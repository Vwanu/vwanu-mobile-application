import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'

import tw from 'lib/tailwind'
import EmptyList from 'components/EmptyList'
import { useFetchFollowingQuery } from 'store/followers-api-slice'
import { TabContentProps } from '../types'
import Follower from '../components/Follower'

const FollowingTab: React.FC<TabContentProps> = ({ targetUserId }) => {
  const {
    data: followingData,
    isLoading,
    refetch,
  } = useFetchFollowingQuery(targetUserId || '')

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
        <EmptyList
          icon="person-add-outline"
          title="Not following anyone yet"
          subtitle="Discover people and start following to see them here"
          actionBtn={{
            label: 'Find People',
            icon: 'search-outline',
            // TODO: wire to People search route
            onPress: () => console.log('Find People'),
          }}
        />
      )}
    </View>
  )
}

export default FollowingTab
