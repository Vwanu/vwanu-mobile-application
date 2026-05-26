import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'

import tw from 'lib/tailwind'
import EmptyList from 'components/EmptyList'
import Follower from '../components/Follower'
import { useFetchFriendsQuery } from '../../../store/friends-api-slice'
import { TabContentProps } from '../types'

const FriendsTab: React.FC<TabContentProps> = ({ targetUserId }) => {
  const {
    data: friendsData,
    isLoading,
    refetch,
  } = useFetchFriendsQuery({ userId: targetUserId, status: 1 })

  const friends = friendsData?.data || []

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
        <EmptyList
          icon="people-outline"
          title="No connections yet"
          subtitle="Connect with people you know to grow your circle"
          actionBtn={{
            label: 'Find Connections',
            icon: 'search-outline',
            // TODO: wire to People / Friend requests route
            onPress: () => console.log('Find Connections'),
          }}
        />
      )}
    </View>
  )
}

export default FriendsTab
