// @ts-ignore - feathers v2.x doesn't have types
import feathers from 'feathers/client'
// @ts-ignore - socket.io-client v1.x doesn't have types
import io from 'socket.io-client'
// @ts-ignore - feathers-socketio v1.x doesn't have types
import socketio from 'feathers-socketio/client'
import { AuthTokenService } from '../lib/authTokenService'

/**
 * WebSocket Manager with Feathers.js
 * Centralized WebSocket connection management using Feathers client
 * Compatible with Feathers v2.x and socket.io v1.x
 */
export class WebSocketManagerFeathers {
  private static app: any = null
  private static socket: any = null
  private static connectionPromise: Promise<void> | null = null
  private static isInitializing = false

  /**
   * Initialize Feathers WebSocket connection with authentication
   */
  static async initialize(): Promise<void> {
    if (this.isInitializing && this.connectionPromise) {
      return this.connectionPromise
    }
    // Return immediately if already connected
    if (this.app && this.socket?.connected) {
      return Promise.resolve()
    }
    this.isInitializing = true

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // Get valid authentication tokens
        const tokens = await AuthTokenService.getValidTokens()
        if (!tokens?.accessToken || !tokens?.idToken) {
          throw new Error('No authentication tokens available')
        }

        // Get WebSocket URL from API URL
        const apiUrl = process.env.EXPO_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error('EXPO_PUBLIC_API_URL not configured')
        }

        console.log('🔌 Connecting to Feathers server:', apiUrl)

        // Create Socket.io connection
        const socketOptions = {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
          query: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'x-id-token': tokens.idToken,
          },
        }

        this.socket = io(apiUrl, socketOptions)

        // Create Feathers app and configure with socket.io
        // @ts-ignore - feathers v2.x doesn't have proper call signature types
        this.app = feathers()
        this.app.configure(socketio(this.socket))

        console.log('🦅 Feathers app configured with socket.io transport')

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('✅ Feathers WebSocket connected:', this.socket?.id)
          console.log('   Transport:', this.socket?.io?.engine?.transport?.name)
          this.isInitializing = false
          resolve()
        })

        this.socket.on('connect_error', (error: any) => {
          console.error(
            '❌ Feathers WebSocket connection error:',
            error.message
          )
          this.isInitializing = false
          reject(error)
        })

        this.socket.on('disconnect', (reason: any) => {
          console.log('🔌 Feathers WebSocket disconnected:', reason)
        })

        this.socket.on('reconnect', (attemptNumber: any) => {
          console.log(
            '🔄 Feathers WebSocket reconnected after',
            attemptNumber,
            'attempts'
          )
        })

        this.socket.on('reconnect_attempt', (attemptNumber: any) => {
          console.log(
            '🔄 Feathers WebSocket reconnection attempt:',
            attemptNumber
          )
        })

        this.socket.on('reconnect_error', (error: any) => {
          console.error(
            '❌ Feathers WebSocket reconnection error:',
            error.message
          )
        })

        this.socket.on('reconnect_failed', () => {
          console.error('❌ Feathers WebSocket reconnection failed')
        })

        // Handle authentication errors
        this.socket.on('error', (error: any) => {
          console.error('❌ Feathers WebSocket error:', error)
          if (error?.message?.includes('authentication')) {
            console.log('🔐 Re-authenticating Feathers WebSocket...')
            this.reconnectWithNewTokens()
          }
        })

        console.log('🦅 Feathers WebSocket setup complete')
      } catch (error) {
        this.isInitializing = false
        console.error('❌ Failed to initialize Feathers WebSocket:', error)
        reject(error)
      }
    })

    return this.connectionPromise
  }

  /**
   * Reconnect with fresh authentication tokens
   */
  private static async reconnectWithNewTokens(): Promise<void> {
    try {
      console.log('🔄 Attempting to reconnect Feathers with fresh tokens...')

      // Get fresh tokens
      const tokens = await AuthTokenService.refreshTokens()

      if (!tokens?.accessToken || !tokens?.idToken) {
        throw new Error('Failed to refresh tokens')
      }

      // Disconnect and reinitialize with new tokens
      if (this.socket) {
        console.log('🔌 Disconnecting old Feathers socket...')
        this.socket.disconnect()
        this.socket = null
      }

      this.app = null

      // Reinitialize with new tokens
      console.log('🔌 Reinitializing Feathers with fresh tokens...')
      await this.initialize()
    } catch (error) {
      console.error('❌ Failed to reconnect Feathers with new tokens:', error)
    }
  }

  /**
   * Subscribe to Feathers service events
   * Feathers uses service-based events (created, updated, patched, removed)
   */
  static subscribeToService<T = any>(
    serviceName: string,
    event: 'created' | 'updated' | 'patched' | 'removed',
    callback: (data: T) => void
  ): () => void {
    if (!this.app) {
      console.warn(
        '⚠️ Feathers app not initialized, cannot subscribe to:',
        serviceName,
        event
      )
      return () => {}
    }

    console.log(
      `📡 Subscribing to Feathers service: ${serviceName} -> ${event}`
    )

    const service = this.app.service(serviceName)
    service.on(event, callback)

    // Return unsubscribe function
    return () => {
      console.log(
        `📡 Unsubscribing from Feathers service: ${serviceName} -> ${event}`
      )
      service.removeListener(event, callback)
    }
  }

  /**
   * Subscribe to generic socket.io events (for custom events)
   */
  static subscribe<T = any>(
    event: string,
    callback: (data: T) => void
  ): () => void {
    if (!this.socket) {
      console.warn(
        '⚠️ Feathers socket not initialized, cannot subscribe to:',
        event
      )
      return () => {}
    }

    console.log('📡 Subscribing to Feathers socket event:', event)

    // Add event listener
    this.socket.on(event, callback)

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        console.log('📡 Unsubscribing from Feathers socket event:', event)
        this.socket.off(event, callback)
      }
    }
  }

  /**
   * Disconnect Feathers WebSocket and cleanup
   */
  static disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting Feathers WebSocket')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this.app = null
      this.connectionPromise = null
      this.isInitializing = false
    }
  }

  /**
   * Check if Feathers WebSocket is connected
   */
  static isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Get Feathers app instance
   */
  static getApp(): any {
    return this.app
  }

  /**
   * Get Socket instance
   */
  static getSocket(): any {
    return this.socket
  }

  /**
   * TEMPORARY: Subscribe to all Feathers service events for debugging
   * Logs all created, updated, patched, removed events from all services
   */
  static subscribeToAllServiceEvents(): () => void {
    if (!this.socket) {
      console.warn(
        '⚠️ Feathers socket not initialized, cannot subscribe to events'
      )
      return () => {}
    }

    console.log(
      '🐛 DEBUG: Subscribing to all Feathers service events (created, updated, patched, removed)...'
    )

    // Intercept all socket.io events
    const originalOnevent = this.socket.onevent
    this.socket.onevent = function (packet: any) {
      const eventName = packet.data?.[0]
      const eventData = packet.data?.[1]

      // Log all service events (they follow pattern: 'serviceName eventType')
      if (eventName && typeof eventName === 'string') {
        const parts = eventName.split(' ')
        if (
          parts.length === 2 &&
          ['created', 'updated', 'patched', 'removed'].includes(parts[1])
        ) {
          console.log(
            `🐛 DEBUG: Feathers service event - ${eventName}:`,
            eventData
          )
        } else {
          console.log(`🐛 DEBUG: Socket.io event - ${eventName}:`, eventData)
        }
      }

      // Call original handler
      if (originalOnevent) {
        originalOnevent.call(this, packet)
      }
    }

    // Return cleanup function
    return () => {
      console.log('🐛 DEBUG: Stopping all service events subscription')
      if (this.socket) {
        this.socket.onevent = originalOnevent
      }
    }
  }
}
