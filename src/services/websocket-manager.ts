// @ts-ignore - socket.io-client v1.x doesn't have types
import io from 'socket.io-client'
import { AuthTokenService } from '../lib/authTokenService'
import { Header } from '@react-navigation/stack'

// Type definitions for socket.io-client v1.x
type Socket = any

/**
 * WebSocket Manager
 * Centralized WebSocket connection management with authentication
 * Implements singleton pattern to ensure single connection
 */
export class WebSocketManager {
  private static socket: Socket | null = null
  private static connectionPromise: Promise<void> | null = null
  private static isInitializing = false

  /**
   * Initialize WebSocket connection with authentication
   * Uses tokens from AuthTokenService for authentication
   */
  static async initialize(): Promise<void> {
    console.log('🔌 Initializing WebSocket connection...')
    if (this.isInitializing && this.connectionPromise) {
      console.log(
        '⏳ WebSocket initialization already in progress, awaiting existing connection...'
      )
      return this.connectionPromise
    }
    console.log('🔍 Checking existing WebSocket connection...')

    // Return immediately if already connected
    if (this.socket?.connected) {
      return Promise.resolve()
    }
    console.log('🚀 Establishing new WebSocket connection...')

    this.isInitializing = true

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // Get valid authentication tokens
        const tokens = await AuthTokenService.getValidTokens()
        console.log('🔐 Retrieved authentication tokens for WebSocket:')

        if (!tokens?.accessToken || !tokens?.idToken) {
          throw new Error('No authentication tokens available')
        }

        // Get WebSocket URL from API URL
        const apiUrl = process.env.EXPO_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error('EXPO_PUBLIC_API_URL not configured')
        }

        // Convert HTTP/HTTPS URL to WS/WSS
        const wsUrl = apiUrl.replace(/^http/, 'ws')

        console.log('🔌 Initializing WebSocket connection to:', wsUrl)

        // Create Socket.io connection with authentication
        // IMPORTANT: socket.io-client v1.x uses 'query' for auth, not 'auth' option
        this.socket = io(wsUrl, {
          transports: ['websocket'],
          query: {
            token: tokens.accessToken,
            idToken: tokens.idToken,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        })

        console.log(
          '🔐 Auth tokens sent via query params (socket.io v1.x compatible)'
        )
        console.log(
          '   Access Token (first 30 chars):',
          tokens.accessToken?.substring(0, 30) + '...'
        )
        console.log(
          '   ID Token (first 30 chars):',
          tokens.idToken?.substring(0, 30) + '...'
        )

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected:', this.socket?.id)
          this.isInitializing = false
          resolve()
        })

        this.socket.on('connect_error', (error: any) => {
          console.error('❌ WebSocket connection error:', error.message)
          this.isInitializing = false
          reject(error)
        })

        this.socket.on('disconnect', (reason: any) => {
          console.log('🔌 WebSocket disconnected:', reason)
        })

        this.socket.on('reconnect', (attemptNumber: any) => {
          console.log(
            '🔄 WebSocket reconnected after',
            attemptNumber,
            'attempts'
          )
        })

        this.socket.on('reconnect_attempt', (attemptNumber: any) => {
          console.log('🔄 WebSocket reconnection attempt:', attemptNumber)
        })

        this.socket.on('reconnect_error', (error: any) => {
          console.error('❌ WebSocket reconnection error:', error.message)
        })

        this.socket.on('reconnect_failed', () => {
          console.error('❌ WebSocket reconnection failed')
        })

        // Handle authentication errors
        this.socket.on('error', (error: any) => {
          console.error('❌ WebSocket error:', error)
          if (error?.message?.includes('authentication')) {
            console.log('🔐 Re-authenticating WebSocket...')
            this.reconnectWithNewTokens()
          }
        })
      } catch (error) {
        this.isInitializing = false
        console.error('❌ Failed to initialize WebSocket:', error)
        reject(error)
      }
    })

    return this.connectionPromise
  }

  /**
   * Reconnect with fresh authentication tokens
   * Used when tokens expire or authentication fails
   */
  private static async reconnectWithNewTokens(): Promise<void> {
    try {
      // Get fresh tokens
      const tokens = await AuthTokenService.refreshTokens()

      if (!tokens?.accessToken || !tokens?.idToken) {
        throw new Error('Failed to refresh tokens')
      }

      // Update socket authentication
      if (this.socket) {
        this.socket.auth = {
          token: tokens.accessToken,
          idToken: tokens.idToken,
        }

        // Reconnect with new tokens
        this.socket.disconnect()
        this.socket.connect()
      }
    } catch (error) {
      console.error('❌ Failed to reconnect with new tokens:', error)
    }
  }

  /**
   * Subscribe to WebSocket events
   * Returns unsubscribe function for cleanup
   */
  static subscribe<T = any>(
    event: string,
    callback: (data: T) => void
  ): () => void {
    if (!this.socket) {
      console.warn('⚠️ WebSocket not initialized, cannot subscribe to:', event)
      return () => {}
    }

    console.log('📡 Subscribing to WebSocket event:', event)

    // Add event listener
    this.socket.on(event, callback)

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        console.log('📡 Unsubscribing from WebSocket event:', event)
        this.socket.off(event, callback)
      }
    }
  }

  /**
   * Disconnect WebSocket and cleanup
   */
  static disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this.connectionPromise = null
      this.isInitializing = false
    }
  }

  /**
   * Check if WebSocket is connected
   */
  static isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Get Socket instance (for advanced usage)
   */
  static getSocket(): Socket | null {
    return this.socket
  }
}
