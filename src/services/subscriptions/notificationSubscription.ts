import { WebSocketManagerFeathers } from '../websocket-manager-feathers'
import { NotificationInterface } from '../../../types'

/**
 * Subscribe to notification creation events using Feathers.js service events
 * Automatically adds new notifications to the cache in real-time
 *
 * @param onNotificationCreated - Callback fired when a new notification is created
 * @returns Unsubscribe function to cleanup the subscription
 */
export const subscribeToNotifications = (
  onNotificationCreated: (notification: NotificationInterface) => void
): (() => void) => {
  // Subscribe to 'created' event on the 'notifications' service
  const unsubscribe =
    WebSocketManagerFeathers.subscribeToService<NotificationInterface>(
      'notifications',
      'created',
      (notification) => {
        console.log(
          '📬 Received new notification via Feathers service:',
          notification
        )
        onNotificationCreated(notification)
      }
    )
  return unsubscribe
}

/**
 * Subscribe to notification read status updates using Feathers.js service events
 * Automatically updates notification read status in real-time
 *
 * @param onNotificationRead - Callback fired when a notification is patched/updated
 * @returns Unsubscribe function to cleanup the subscription
 */
export const subscribeToNotificationRead = (
  onNotificationRead: (notification: NotificationInterface) => void
): (() => void) => {
  // Subscribe to 'patched' event on the 'notifications' service
  const unsubscribe =
    WebSocketManagerFeathers.subscribeToService<NotificationInterface>(
      'notifications',
      'patched',
      (notification) => {
        console.log(
          '📖 Notification updated via Feathers service:',
          notification
        )
        onNotificationRead(notification)
      }
    )

  return unsubscribe
}

/**
 * Subscribe to notification deletion events using Feathers.js service events
 * Automatically removes deleted notifications from the cache
 *
 * @param onNotificationDeleted - Callback fired when a notification is deleted
 * @returns Unsubscribe function to cleanup the subscription
 */
export const subscribeToNotificationDeleted = (
  onNotificationDeleted: (notification: NotificationInterface) => void
): (() => void) => {
  // Subscribe to 'removed' event on the 'notifications' service
  const unsubscribe =
    WebSocketManagerFeathers.subscribeToService<NotificationInterface>(
      'notifications',
      'removed',
      (notification) => {
        console.log(
          '🗑️ Notification deleted via Feathers service:',
          notification
        )
        onNotificationDeleted(notification)
      }
    )

  return unsubscribe
}
