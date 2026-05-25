import React, { useState, useCallback } from 'react'
import { View, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import NotificationItem from './components/NotificationItem'
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from 'store/notifications-api-slice'
import { NotificationInterface } from '../../../types'
import Screen from 'components/screen'
import { colors } from 'components/ui/tokens'
import { FlatList } from 'react-native-gesture-handler'
import { isNotificationRead } from './lib/isNotificationRead'
import { resolveNotificationTarget } from './lib/routing'
import { useGroupedNotifications, Row } from './lib/useGroupedNotifications'
import NotificationListHeader from './components/NotificationHeader'
import EmptyList from 'components/EmptyList'

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

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

  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()

  const handleNotificationPress = useCallback(
    async (notification: NotificationInterface) => {
      if (!isNotificationRead(notification)) {
        try {
          await markAsRead(notification.id)
        } catch (error) {
          console.error('Failed to mark notification as read:', error)
        }
      }

      const target = resolveNotificationTarget(notification)
      console.log('Resolved navigation target:', target) // Debug log
      if (!target) return
      if (target.parent) {
        // @ts-ignore — react-navigation types are loose in this codebase.
        navigation.navigate(target.parent, {
          screen: target.to,
          params: target.params,
        })
      } else {
        // @ts-ignore
        navigation.navigate(target.to, target.params)
      }
    },
    [markAsRead, navigation]
  )

  const handleMarkAllAsRead = useCallback(async () => {
    if (!notifications?.data) return
    const unreadIds = notifications.data
      .filter((n) => !isNotificationRead(n))
      .map((n) => n.id)
    if (unreadIds.length > 0) {
      await markAllAsRead({ notificationIds: unreadIds })
    }
  }, [notifications, markAllAsRead])

  const unreadCount =
    notifications?.data?.filter((n) => !isNotificationRead(n)).length || 0

  const rows = useGroupedNotifications(notifications?.data)

  const renderRow = ({ item }: { item: Row }) => {
    if (item.kind === 'separator') {
      return (
        <View style={tw`px-4 pt-3 pb-1`}>
          <Text
            style={tw`text-xs font-poppins-bold text-mute tracking-widest uppercase`}
          >
            {item.label}
          </Text>
        </View>
      )
    }
    return (
      <NotificationItem
        notification={item.notification}
        onPress={handleNotificationPress}
      />
    )
  }

  if (isLoading) {
    return (
      <Screen>
        <NotificationListHeader
          unreadCount={unreadCount}
          showUnreadOnly={showUnreadOnly}
          setShowUnreadOnly={setShowUnreadOnly}
          handleMarkAllAsRead={handleMarkAllAsRead}
        />
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator color={colors.primaryDeep} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        ListHeaderComponent={() => (
          <NotificationListHeader
            unreadCount={unreadCount}
            showUnreadOnly={showUnreadOnly}
            setShowUnreadOnly={setShowUnreadOnly}
            handleMarkAllAsRead={handleMarkAllAsRead}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyList
            title={
              showUnreadOnly
                ? 'No unread notifications'
                : 'No notifications yet'
            }
            subtitle={
              showUnreadOnly
                ? "You're all caught up!"
                : "When you get notifications, they'll show up here"
            }
            icon="notifications-off-outline"
          />
        )}
        contentContainerStyle={tw`pb-6`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primaryDeep}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  )
}

export default NotificationsScreen
