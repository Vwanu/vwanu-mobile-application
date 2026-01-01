import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useTheme } from 'hooks/useTheme'
import { useFetchFriendRequestsQuery } from 'store/friends-api-slice'
import { FeedStackParams, BottomTabParms } from '../../types'
import { RootState } from '../store'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<FeedStackParams, 'Feed'>,
  BottomTabNavigationProp<BottomTabParms>
>

const FriendRequestIndicator: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { isDarkMode } = useTheme()
  const { userId } = useSelector((state: RootState) => state.auth)

  const { data: { total } = { total: 0 } } = useFetchFriendRequestsQuery(
    // @ts-ignore
    { targetId: userId as string, status: 0 },
    { skip: !userId }
  )
  const pendingRequestsCount = total
  const handleFriendRequestPress = () => {
    navigation.navigate('ACCOUNT', {
      screen: 'FriendRequests',
    })
  }

  return (
    <TouchableOpacity
      onPress={handleFriendRequestPress}
      style={tw`relative p-2`}
    >
      <Ionicons
        name="people-outline"
        size={26}
        color={isDarkMode ? 'white' : 'black'}
      />
      {pendingRequestsCount > 0 && (
        <View
          style={tw`absolute top-1 right-1 bg-blue-500 rounded-full min-w-5 h-5 items-center justify-center px-1`}
        >
          <Text style={tw`text-white text-xs font-bold`}>
            {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default FriendRequestIndicator
