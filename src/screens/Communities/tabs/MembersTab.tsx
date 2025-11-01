import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import CommunityMember from '../components/CommunityMember'

import tw from 'lib/tailwind'
import { useFetchCommunityMembersQuery } from '../../../store/communities-api-slice'

const roles = [
  { name: 'Member', id: 1 },
  { name: 'Moderator', id: 2 },
  { name: 'Admin', id: 3 },
  { name: 'Owner', id: 4 },
]

import SearchBox from '../components/SearchBox'
import { ActivityIndicator } from 'react-native-paper'
import Filter from '../components/Filter'

interface MembersTabProps {
  communityId: string
  onError?: (error: any) => void
}

const MembersTab: React.FC<MembersTabProps> = ({ communityId, onError }) => {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const {
    data: members,
    isLoading,
    error,
  } = useFetchCommunityMembersQuery({ id: communityId, filter })

  console.log(members)
  useEffect(() => {
    if (error) {
      console.error('Error fetching community members:', error)
      onError && onError(error)
    }
  }, [error])

  const handleFilter = (item: any) => {
    console.log(item)
    setFilter(item.id.toString())
  }

  return (
    <View>
      <View style={tw`flex-row items-center justify-around px-2`}>
        <SearchBox onSearch={console.log} style={tw`flex-grow-1`} />
        <Filter style={tw``} items={roles} onSelect={handleFilter} />
      </View>
      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={tw`my-4`} />
      )}
      <FlatList
        data={members?.data || []}
        renderItem={({ item }) => <CommunityMember item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-4`}
      />
    </View>
  )
}

export default MembersTab
