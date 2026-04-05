import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from '../../../components/Text'
import Follower from '../components/Follower'
import { useFetchFollowersQuery } from '../../../store/followers-api-slice'

import { TabContentProps } from '../types'

const FollowersTab: React.FC<TabContentProps> = ({ targetUserId, userId }) => {
  const {
    data: followersData,
    isLoading,
    refetch,
  } = useFetchFollowersQuery(targetUserId || '')

  const followers = followersData?.data || []

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center p-8`}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {followers.length > 0 ? (
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Follower follower={item} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-500 mt-4 text-center`}>
            No followers yet
          </Text>
          <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
            Start connecting with people
          </Text>
        </View>
      )}
    </View>
  )
}

export default FollowersTab
