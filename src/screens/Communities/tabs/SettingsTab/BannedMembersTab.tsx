import React, { useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

import tw from 'lib/tailwind'
import NoPost from 'components/EmptyList'
import SearchBox from '../../components/SearchBox'
import CommunityMember from '../../components/CommunityMember'
import {
  useFetchBannedMembersQuery,
  useUnbanMemberMutation,
} from 'store/communities-api-slice'

interface BannedMembersTabProps {
  communityId: string
  onError: (
    error: FetchBaseQueryError | SerializedError,
    onRefetch?: () => void
  ) => void
}

const BannedMembersTab: React.FC<BannedMembersTabProps> = ({
  communityId,
  onError,
}) => {
  const {
    data: bannedMembers,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useFetchBannedMembersQuery({ id: communityId })

  console.log('[❤️‍🔥💙💔Banned Members Data:]', bannedMembers?.data)

  const [unbanMember] = useUnbanMemberMutation()

  useEffect(() => {
    if (error) {
      console.error('Error fetching banned members:', error)
      onError(error, refetch)
    }
  }, [error, refetch])

  const handleUnban = async (userId: string) => {
    try {
      await unbanMember({ communityId, userId }).unwrap()
    } catch (err) {
      console.error('Error unbanning member:', err)
    }
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center justify-around px-2`}>
        <SearchBox
          onSearch={console.log}
          style={tw`flex-grow-1`}
          placeholder="Search banned members..."
        />
      </View>
      {(isFetching || isLoading) && <ActivityIndicator />}
      <FlatList
        data={bannedMembers?.data || []}
        renderItem={({ item }) => (
          <CommunityMember
            item={{ user: item.bannedUser, communityRole: { name: 'Banned' } }}
            isBanned
            onUnban={handleUnban}
          />
        )}
        keyExtractor={(item) => item.bannedUser.id}
        ListEmptyComponent={
          <NoPost
            title="No Banned Members"
            subtitle="Banned members will appear here"
          />
        }
        contentContainerStyle={
          (bannedMembers?.data?.length || 0) === 0 ? tw`flex-1` : tw`pb-4`
        }
      />
    </View>
  )
}

export default BannedMembersTab
