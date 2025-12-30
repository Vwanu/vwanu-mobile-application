import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useTheme } from 'hooks/useTheme'
import { useFetchUnreadNotificationsQuery } from 'store/notifications-api-slice'
import { FeedStackParams, BottomTabParms } from '../../types'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<FeedStackParams, 'Feed'>,
  BottomTabNavigationProp<BottomTabParms>
>

const NotificationIndicator: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { isDarkMode } = useTheme()

  const { data: unreadNotifications } = useFetchUnreadNotificationsQuery()
  const unreadCount = unreadNotifications?.data?.length || 0

  const handleNotificationPress = () => {
    navigation.navigate('ACCOUNT', {
      screen: 'Notifications',
    })
  }

  return (
    <TouchableOpacity
      onPress={handleNotificationPress}
      style={tw`relative p-2`}
    >
      <Ionicons
        name="notifications-outline"
        size={26}
        color={isDarkMode ? 'white' : 'black'}
      />
      {unreadCount > 0 && (
        <View
          style={tw`absolute top-1 right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center px-1`}
        >
          <Text style={tw`text-white text-xs font-bold`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default NotificationIndicator
