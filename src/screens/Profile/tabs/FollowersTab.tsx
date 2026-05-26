import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'

import tw from 'lib/tailwind'
import EmptyList from 'components/EmptyList'
import Follower from '../components/Follower'
import { useFetchFollowersQuery } from '../../../store/followers-api-slice'
import { TabContentProps } from '../types'

const FollowersTab: React.FC<TabContentProps> = ({ targetUserId }) => {
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
        <EmptyList
          icon="people-outline"
          title="No followers yet"
          subtitle="Share your profile to start connecting with people"
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

export default FollowersTab
