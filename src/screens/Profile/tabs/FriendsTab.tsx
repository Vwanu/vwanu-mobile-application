import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from '../../../components/Text'
import Follower from '../components/Follower'
import { useFetchFriendsQuery } from '../../../store/friends-api-slice'

import { TabContentProps } from '../types'

const FriendsTab: React.FC<TabContentProps> = ({ targetUserId }) => {
  const {
    data: friendsData,
    isLoading,
    refetch,
  } = useFetchFriendsQuery({ userId: targetUserId, status: 1 }) // status: 1 for accepted friends})

  const friends = friendsData?.data || []

  console.log('FriendsTab - friendsData:', friends[0])
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center p-8`}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={tw`flex-1`}>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Follower follower={item.user} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center p-8`}>
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text style={tw`text-gray-500 mt-4 text-center`}>No friends yet</Text>
          <Text style={tw`text-gray-400 mt-2 text-center text-sm`}>
            Connect with people you know
          </Text>
        </View>
      )}
    </View>
  )
}

export default FriendsTab
