import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  NotificationInterface,
  NotificationSettings,
  FetchNotificationsParams,
  MarkNotificationsReadParams,
  PaginatedResponse,
} from '../../types'
/**
 * Notifications API Slice
 * Handles all notification-related API endpoints
 */
export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch all notifications (paginated)
     * GET /notifications
     */
    fetchNotifications: builder.query<
      PaginatedResponse<NotificationInterface>,
      FetchNotificationsParams
    >({
      query: ({ page = 1, limit = 10, unreadOnly = false } = {}) => {
        const params: Record<string, string> = {
          //   page: page.toString(),
          //   limit: limit.toString(),
        }

        if (unreadOnly) {
          params.read = 'false'
        }

        return {
          url: '/notifications',
          params,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Notification' as const,
                id,
              })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    /**
     * Fetch unread notifications
     * GET /notifications/unread
     */
    fetchUnreadNotifications: builder.query<
      PaginatedResponse<NotificationInterface>,
      void
    >({
      query: () => '/notifications?read=false',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Notification' as const,
                id,
              })),
              { type: 'Notification', id: 'UNREAD' },
            ]
          : [{ type: 'Notification', id: 'UNREAD' }],
    }),

    /**
     * Mark a single notification as read
     * PUT /notifications/:id/read
     */
    markNotificationAsRead: builder.mutation<NotificationInterface, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: HttpMethods.PATCH,
        body: { read: true },
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),

    /**
     * Mark all notifications as read
     * PUT /notifications/read-all
     */
    markAllNotificationsAsRead: builder.mutation<
      void,
      MarkNotificationsReadParams
    >({
      query: (params) => ({
        url: '/notifications/read-all',
        method: HttpMethods.PUT,
        body: params,
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),

    /**
     * Delete a notification
     * DELETE /notifications/:id
     */
    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'UNREAD' },
      ],
    }),

    /**
     * Update notification preferences/settings
     * PUT /notifications/settings
     */
    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      Partial<NotificationSettings>
    >({
      query: (settings) => ({
        url: '/notifications/settings',
        method: HttpMethods.PUT,
        body: settings,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'SETTINGS' }],
    }),

    /**
     * Fetch notification settings
     * GET /notifications/settings
     */
    fetchNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => '/notifications/settings',
      providesTags: [{ type: 'Notification', id: 'SETTINGS' }],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useFetchNotificationsQuery,
  useFetchUnreadNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useUpdateNotificationSettingsMutation,
  useFetchNotificationSettingsQuery,
} = notificationsApiSlice
