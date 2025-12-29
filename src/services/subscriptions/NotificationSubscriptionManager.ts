import { WebSocketManagerFeathers } from '../websocket-manager-feathers'
import apiSlice from '../../store/api-slice'
import type { AppDispatch } from '../../store'
import type { NotificationInterface } from '../../../types'

/**
 * Global Notification Subscription Manager
 *
 * Manages global WebSocket subscriptions for notifications that are independent
 * of component lifecycle. Starts subscriptions immediately on authentication
 * and invalidates RTK Query cache tags when notifications arrive.
 */
export class NotificationSubscriptionManager {
  private static dispatch: AppDispatch | null = null
  private static unsubscribe: (() => void) | null = null

  /**
   * Set dispatch function (called once during store initialization)
   * @param dispatch - Redux dispatch function
   */
  static setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch
    console.log('📡 NotificationSubscriptionManager: Dispatch set')
  }

  /**
   * Start global notification subscription
   * Subscribes to Feathers 'notifications' service 'created' event
   * Invalidates cache tags when notifications arrive to trigger automatic refetch
   */
  static startGlobalSubscription() {
    if (this.unsubscribe) {
      console.log('⚠️ Notification subscription already active')
      return
    }

    if (!this.dispatch) {
      console.error('❌ Cannot start subscription: dispatch not set')
      return
    }

    console.log('📡 Starting global notification subscription...')

    // Subscribe to Feathers service 'created' event
    this.unsubscribe =
      WebSocketManagerFeathers.subscribeToService<NotificationInterface>(
        'notifications',
        'created',
        (notification) => {
          console.log('🔔 New notification received:', notification)

          // Invalidate RTK Query cache tags to trigger refetch
          if (this.dispatch) {
            this.dispatch(
              apiSlice.util.invalidateTags([
                { type: 'Notification', id: 'LIST' },
                { type: 'Notification', id: 'UNREAD' },
              ])
            )
          }
        }
      )

    console.log('✅ Global notification subscription started')
  }

  /**
   * Stop global notification subscription
   * Cleans up the active subscription
   */
  static stopGlobalSubscription() {
    if (this.unsubscribe) {
      console.log('📡 Stopping global notification subscription...')
      this.unsubscribe()
      this.unsubscribe = null
    }
  }
}
