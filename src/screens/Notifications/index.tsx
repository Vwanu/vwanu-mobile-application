import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import NotificationItem from './components/NotificationItem'
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from 'store/notifications-api-slice'
import { NotificationInterface } from '../../../types'
import Screen from 'components/screen'

/**
 * Notifications Screen
 * Displays all user notifications with filtering and actions
 */
const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    isFetching,
    refetch,
  } = useFetchNotificationsQuery({
    page: 1,
    limit: 50,
    unreadOnly: showUnreadOnly,
  })

  // Mutations
  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()

  const handleNotificationPress = useCallback(
    async (notification: NotificationInterface) => {
      // Mark as read if unread
      if (!notification.read) {
        await markAsRead(notification.id)
      }

      // Navigate based on notification type
      switch (notification.type) {
        case 'like':
        case 'comment':
          if (notification.metadata?.postId) {
            // @ts-ignore
            navigation.navigate('SinglePost', {
              postId: notification.metadata.postId,
            })
          }
          break

        case 'community_invite':
        case 'community_join_request':
        case 'community_post':
          if (notification.metadata?.communityId) {
            // @ts-ignore
            navigation.navigate('COMMUNITY', {
              screen: 'CommunityDetail',
              params: { communityId: notification.metadata.communityId },
            })
          }
          break

        case 'follow':
          if (notification.actor?.id) {
            // @ts-ignore
            navigation.navigate('ACCOUNT', {
              screen: 'PROFILE',
              params: { profileId: notification.actor.id },
            })
          }
          break

        default:
          break
      }
    },
    [markAsRead, navigation]
  )

  const handleMarkAllAsRead = useCallback(async () => {
    if (!notifications?.data) return

    const unreadIds = notifications.data.filter((n) => !n.read).map((n) => n.id)

    if (unreadIds.length > 0) {
      await markAllAsRead({ notificationIds: unreadIds })
    }
  }, [notifications, markAllAsRead])

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      await deleteNotification(notificationId)
    },
    [deleteNotification]
  )

  const unreadCount = notifications?.data?.filter((n) => !n.read).length || 0

  const renderHeader = () => (
    <View
      style={tw`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between p-4`}>
        <Text style={tw`text-2xl font-bold`}>Notifications</Text>
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text
            style={tw`${
              unreadCount > 0
                ? 'text-blue-500'
                : 'text-gray-400 dark:text-gray-600'
            } font-semibold`}
          >
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={tw`flex-row px-4 pb-3`}>
        <TouchableOpacity
          style={tw`mr-4 pb-2 ${
            !showUnreadOnly ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setShowUnreadOnly(false)}
        >
          <Text
            style={tw`${
              !showUnreadOnly
                ? 'text-blue-500 font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`pb-2 ${showUnreadOnly ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setShowUnreadOnly(true)}
        >
          <View style={tw`flex-row items-center`}>
            <Text
              style={tw`${
                showUnreadOnly
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Unread
            </Text>
            {unreadCount > 0 && (
              <View
                style={tw`ml-2 bg-blue-500 rounded-full px-2 py-0.5 min-w-5 items-center`}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={tw`flex-1 justify-center items-center p-8 mt-20`}>
      <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
      <Text style={tw`text-gray-500 mt-4 text-center text-lg`}>
        {showUnreadOnly ? 'No unread notifications' : 'No notifications yet'}
      </Text>
      <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
        {showUnreadOnly
          ? "You're all caught up!"
          : "When you get notifications, they'll show up here"}
      </Text>
    </View>
  )

  if (isLoading || isFetching) {
    return (
      <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
        {renderHeader()}
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    )
  }

  return (
    <Screen>
      <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
        <FlatList
          data={notifications?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onDelete={handleDeleteNotification}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        />
      </View>
    </Screen>
  )
}

export default NotificationsScreen
