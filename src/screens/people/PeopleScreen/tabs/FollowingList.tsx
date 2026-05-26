import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import { useFetchFollowingQuery } from 'store/followers-api-slice'

import PersonList from '../components/PersonList'
import { useSelector } from 'react-redux'
import { TabProps } from '../index'

const FollowingList: React.FC<TabProps> = ({ search }) => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const {
    data: followingData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchFollowingQuery(userId || '', { skip: !userId })

  // TODO  search should be done server side, this is just a quick fix to filter results client side until we add search to the endpoint
  const users: Profile[] = useMemo(() => {
    const all = followingData?.data || []
    const term = search.trim().toLowerCase()
    if (!term) return all
    return all.filter((u) =>
      `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(term)
    )
  }, [followingData, search])

  const renderAccessory = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        tw`px-3 py-2 rounded-full flex-row items-center`,
        { backgroundColor: colors.primaryDeep },
      ]}
    >
      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
    </TouchableOpacity>
  )

  return (
    <PersonList<Profile>
      items={users}
      getProfile={(u) => u}
      loading={isLoading}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}
      emptyTitle="Not following anyone yet"
      emptySubtitle="Follow people to see their updates"
      renderAccessory={renderAccessory}
    />
  )
}

export default FollowingList
