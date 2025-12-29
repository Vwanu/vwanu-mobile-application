import { WebSocketManager } from './websocket-manager'

/**
 * WebSocket Test Utility
 * Helper functions to test WebSocket connection and events
 */
export class WebSocketTest {
  /**
   * Test WebSocket connection status
   */
  static testConnection() {
    const isConnected = WebSocketManager.isConnected()
    const socket = WebSocketManager.getSocket()

    console.log('🧪 WebSocket Test Results:')
    console.log('  - Connected:', isConnected)
    console.log('  - Socket ID:', socket?.id || 'Not connected')
    console.log(
      '  - Socket Transport:',
      socket?.io?.engine?.transport?.name || 'N/A'
    )

    return {
      isConnected,
      socketId: socket?.id,
      transport: socket?.io?.engine?.transport?.name,
    }
  }

  /**
   * Subscribe to ALL events for debugging
   */
  static subscribeToAllEvents() {
    const socket = WebSocketManager.getSocket()

    if (!socket) {
      console.warn('⚠️ WebSocket not connected, cannot subscribe to events')
      return () => {}
    }

    console.log('👂 Subscribing to ALL WebSocket events for debugging...')

    // Listen to all events using wildcard
    const onAnyEvent = (eventName: string, ...args: any[]) => {
      console.log('📡 WebSocket Event Received:', {
        event: eventName,
        data: args,
        timestamp: new Date().toISOString(),
      })
    }

    // Socket.io v1.x uses onevent
    const originalOnevent = socket.onevent
    socket.onevent = function (packet: any) {
      const args = packet.data || []
      onAnyEvent(args[0], ...args.slice(1))
      if (originalOnevent) {
        originalOnevent.call(this, packet)
      }
    }

    console.log('✅ Now listening to ALL WebSocket events')

    // Return cleanup function
    return () => {
      socket.onevent = originalOnevent
      console.log('🛑 Stopped listening to all events')
    }
  }

  /**
   * Subscribe to specific notification events for testing
   */
  static subscribeToNotificationEvents() {
    console.log('👂 Testing notification event subscriptions...')

    const events = [
      'notification:created',
      'notification:read',
      'notification:deleted',
      'notification', // Generic notification event
      'message', // Test if backend uses different event name
    ]

    const unsubscribes: Array<() => void> = []

    events.forEach((eventName) => {
      const unsubscribe = WebSocketManager.subscribe(eventName, (data: any) => {
        console.log(`📬 Received ${eventName}:`, {
          event: eventName,
          data,
          timestamp: new Date().toISOString(),
        })
      })

      unsubscribes.push(unsubscribe)
      console.log(`  ✓ Subscribed to: ${eventName}`)
    })

    console.log(`✅ Subscribed to ${events.length} notification events`)

    // Return cleanup function
    return () => {
      unsubscribes.forEach((unsub) => unsub())
      console.log('🛑 Unsubscribed from all notification test events')
    }
  }

  /**
   * Send a test message to the server (if backend supports it)
   */
  static sendTestMessage(message: string = 'ping') {
    const socket = WebSocketManager.getSocket()

    if (!socket) {
      console.warn('⚠️ WebSocket not connected, cannot send message')
      return
    }

    console.log('📤 Sending test message:', message)
    socket.emit('test', { message, timestamp: new Date().toISOString() })
  }

  /**
   * Request notification test from server (if backend supports it)
   */
  static requestTestNotification() {
    const socket = WebSocketManager.getSocket()

    if (!socket) {
      console.warn(
        '⚠️ WebSocket not connected, cannot request test notification'
      )
      return
    }

    console.log('📤 Requesting test notification from server...')
    socket.emit('notification:test', {
      message: 'Test notification request',
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log('\n🧪 Running WebSocket Tests...\n')

    // Test 1: Connection status
    console.log('Test 1: Connection Status')
    const connectionStatus = this.testConnection()
    console.log('')

    if (!connectionStatus.isConnected) {
      console.warn('⚠️ WebSocket not connected. Tests cannot continue.')
      console.log('💡 Make sure you are logged in and the app is running')
      return
    }

    // Test 2: Subscribe to all events
    console.log('Test 2: Subscribe to All Events')
    const unsubAll = this.subscribeToAllEvents()
    console.log('')

    // Test 3: Subscribe to notification events
    console.log('Test 3: Subscribe to Notification Events')
    const unsubNotif = this.subscribeToNotificationEvents()
    console.log('')

    // Test 4: Send test message
    console.log('Test 4: Send Test Message')
    this.sendTestMessage('Hello from mobile app!')
    console.log('')

    // Test 5: Request test notification
    console.log('Test 5: Request Test Notification')
    this.requestTestNotification()
    console.log('')

    console.log('✅ All tests initiated!')
    console.log('👀 Watch console for incoming events...')
    console.log('')
    console.log('To stop listening to all events, run:')
    console.log('  WebSocketTest.stopAllTests()')

    // Store cleanup functions globally for manual cleanup
    ;(global as any).__wsTestCleanup = () => {
      unsubAll()
      unsubNotif()
      console.log('🧹 Cleaned up all test subscriptions')
    }
  }

  /**
   * Stop all tests and cleanup
   */
  static stopAllTests() {
    if ((global as any).__wsTestCleanup) {
      ;(global as any).__wsTestCleanup()
      delete (global as any).__wsTestCleanup
    }
  }
}

// Export for global access in development
if (__DEV__) {
  ;(global as any).WebSocketTest = WebSocketTest
  console.log('💡 WebSocket test utility available globally as:')
  console.log('   WebSocketTest.runAllTests()')
  console.log('   WebSocketTest.testConnection()')
  console.log('   WebSocketTest.subscribeToAllEvents()')
  console.log('   WebSocketTest.stopAllTests()')
}
