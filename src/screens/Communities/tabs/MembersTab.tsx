import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import CommunityMember from '../components/CommunityMember'

import tw from 'lib/tailwind'
import {
  useFetchCommunityMembersQuery,
  useFetchCommunityRolesQuery,
} from '../../../store/communities-api-slice'

import SearchBox from '../components/SearchBox'
import { ActivityIndicator } from 'react-native-paper'
import Filter from '../components/Filter'

const MembersTab: React.FC<TabInterFace> = ({ communityId, onError }) => {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useFetchCommunityMembersQuery({ id: communityId, filter })

  const { data: roles, error: roleFetchError } = useFetchCommunityRolesQuery()

  useEffect(() => {
    if (!error || !roleFetchError) return

    const e = roleFetchError || error
    onError && onError(e, refetch)
  }, [error, refetch, roleFetchError])

  const handleFilter = (item: any) => {
    console.log(item)
    setFilter(item.id.toString())
  }

  return (
    <View>
      <View style={tw`flex-row items-center justify-around px-2`}>
        <SearchBox onSearch={console.log} style={tw`flex-grow-1`} />
        <Filter
          style={tw``}
          items={roles?.data || []}
          onSelect={handleFilter}
        />
      </View>
      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={tw`my-4`} />
      )}
      <FlatList
        data={members?.data || []}
        renderItem={({ item }) => <CommunityMember item={item} />}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={tw`pb-4`}
      />
    </View>
  )
}

export default MembersTab
