import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import { NotificationInterface } from '../../../../types'
import { useMarkNotificationAsReadMutation } from 'store/notifications-api-slice'
import { ActivityIndicator } from 'react-native-paper'

interface NotificationItemProps {
  notification: NotificationInterface
  onPress: (notification: NotificationInterface) => void
  onDelete?: (notificationId: string) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const navigation = useNavigation()
  const [markAsRead, { isFetching, isLoading }] =
    useMarkNotificationAsReadMutation()

  const getEntityNavigation = () => {
    switch (notification.entityName) {
      case 'Post':
        return {
          screen: 'PostDetail',
          params: { postId: notification.entityId },
        }
      default:
        return null
    }
  }

  const handleNavigateToEntity = () => {
    const navigationData = getEntityNavigation()
    if (navigationData?.screen && navigationData.params) {
      // @ts-ignore
      navigation.navigate(navigationData.screen, navigationData.params)
    }
  }
  if (isFetching || isLoading) {
    return <ActivityIndicator />
  }
  return (
    <View
      style={tw` flex-row justify-between items-center p-2 mx-2 rounded my-[1/4] ${
        !notification.read
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'bg-white dark:bg-gray-800'
      } border-b border-gray-200 dark:border-gray-700`}
    >
      <ProfAvatar
        size={48}
        userId={notification.userId}
        subtitle={notification.message}
        onLongPress={handleNavigateToEntity}
        source={notification.fromUser.profilePicture}
        name={
          notification.fromUser.firstName + ' ' + notification.fromUser.lastName
        }
      />

      <View style={tw`items-end`}>
        <TouchableOpacity
          onPress={() => {
            markAsRead(notification.id)
          }}
          disabled={notification.read}
        >
          <Text
            style={tw` text-${
              notification.read ? 'gray-400' : 'primary'
            } dark:text-gray-400 text-sm`}
          >
            {notification.read ? 'Read' : 'Marked as read'}
          </Text>
        </TouchableOpacity>
        <Text style={tw` mt-2 text-gray-500 dark:text-gray-400 text-xs`}>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </Text>
      </View>
    </View>
  )
}

export default NotificationItem
