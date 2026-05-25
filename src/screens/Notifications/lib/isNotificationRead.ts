import { NotificationInterface } from '../../../../types'

export const isNotificationRead = (
  notification: NotificationInterface
): boolean => {
  return notification.readAt !== null
}
