import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { useFetchFollowingQuery } from 'store/followers-api-slice'
import { TabContentProps } from '../types'
import Follower from '../components/Follower'

/**
 * Following Tab Component
 * Displays list of users that the current profile is following
 */
const FollowingTab: React.FC<TabContentProps> = ({ targetUserId, userId }) => {
  const {
    data: followingData,
    isLoading,
    refetch,
  } = useFetchFollowingQuery(targetUserId || '')
  const navigation = useNavigation()

  const following = followingData?.data || []

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center p-8`}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {following.length > 0 ? (
        <FlatList
          data={following}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Follower follower={item} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <Ionicons name="person-add-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-500 mt-4 text-center`}>
            Not following anyone yet
          </Text>
          <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
            Start following people to see them here
          </Text>
        </View>
      )}
    </View>
  )
}

export default FollowingTab
