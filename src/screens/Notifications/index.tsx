import React, { useState, useCallback, useMemo } from 'react'
import { View, RefreshControl, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns'

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

type Row =
  | { kind: 'separator'; key: string; label: string }
  | { kind: 'item'; key: string; notification: NotificationInterface }

// Bucket label for grouping notifications by recency.
// Today / Yesterday / "N days ago" (2-7) / Earlier (8+).
const bucketLabel = (date: Date, now: Date): string => {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  const days = differenceInCalendarDays(now, date)
  if (days <= 7) return `${days} days ago`
  return 'Earlier'
}

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

  // Walk items in order, emit a separator row when the bucket label changes,
  // skip the very first "Today" separator (most-recent group needs no header).
  const rows = useMemo((): Row[] => {
    const items = notifications?.data || []
    const now = new Date()
    const out: Row[] = []
    let lastLabel: string | null = null
    for (const item of items) {
      const label = bucketLabel(new Date(item.createdAt), now)
      if (label !== lastLabel) {
        const isFirst = out.length === 0
        if (!(isFirst && label === 'Today')) {
          out.push({
            kind: 'separator',
            key: `sep:${label}:${item.id}`,
            label,
          })
        }
        lastLabel = label
      }
      out.push({
        kind: 'item',
        key: `item:${item.id}`,
        notification: item,
      })
    }
    return out
  }, [notifications])
  const renderHeader = () => {
    const activeStyle = 'border-b-primary-deep'
    const inactiveStyle = 'border-b-warm-border-strong'
    const baseStyle = 'px-4 py-2 border-b-2 w-1/2'
    const textStyle = 'font-poppins-semibold text-center text-primary-deep'
    return (
      <View>
        {/* Title row */}
        <View style={tw`flex-row items-start justify-between px-4 pt-4 pb-3`}>
          <View>
            <Text style={tw`text-2xl font-syne-bold text-ink`}>
              Notifications
            </Text>
            <Text style={tw`text-sm font-poppins text-mute -mt-1`}>
              Stay up to date
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Text
              style={tw`font-poppins-semibold text-sm ${
                unreadCount > 0 ? 'text-primary-deep' : 'text-warm-dim'
              }`}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        {/* All / Unread pills */}
        <View style={tw`flex-row w-full justify-between`}>
          <Text
            onPress={() => setShowUnreadOnly(false)}
            style={tw`${textStyle} ${baseStyle} ${
              !showUnreadOnly ? activeStyle : inactiveStyle
            }`}
          >
            All
          </Text>

          <Text
            onPress={() => setShowUnreadOnly(true)}
            style={tw`${textStyle} ${baseStyle} ${
              showUnreadOnly ? activeStyle : inactiveStyle
            }`}
          >
            Unread
            <>
              {unreadCount > 0 && (
                <View style={tw`ml-1.5 px-2  rounded-full bg-coral`}>
                  <Text style={tw`font-poppins-bold text-[10px] text-white`}>
                    {unreadCount > 99 ? '99+' : String(unreadCount)}
                  </Text>
                </View>
              )}
            </>
          </Text>
        </View>
      </View>
    )
  }

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

  const renderEmptyState = () => (
    <View style={tw`flex-1 justify-center items-center px-8 pt-24`}>
      <View
        style={tw`w-16 h-16 rounded-full bg-warm-surface border border-warm-border items-center justify-center mb-4`}
      >
        <Ionicons
          name="notifications-off-outline"
          size={28}
          color={colors.mute}
        />
      </View>
      <Text style={tw`text-base font-syne-bold text-ink text-center`}>
        {showUnreadOnly ? 'No unread notifications' : 'No notifications yet'}
      </Text>
      <Text
        style={tw`text-sm font-poppins text-mute mt-1 text-center leading-5`}
      >
        {showUnreadOnly
          ? "You're all caught up!"
          : "When you get notifications, they'll show up here"}
      </Text>
    </View>
  )

  if (isLoading) {
    return (
      <Screen>
        {renderHeader()}
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
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
