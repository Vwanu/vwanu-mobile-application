import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import { useFetchFriendsQuery } from '../../../../store/friends-api-slice'

import PersonList from '../components/PersonList'
import { useSelector } from 'react-redux'
import { TabProps } from '../index'

const FriendsList: React.FC<TabProps> = ({ search }) => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const {
    data: friendsData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchFriendsQuery(
    { userId: userId ?? '', status: 1, search },
    { skip: !userId }
  )

  const users: Profile[] = friendsData?.data || []

  const renderAccessory = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        tw`px-3 py-2 rounded-full`,
        { backgroundColor: colors.primarySoft },
      ]}
    >
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={16}
        color={colors.primaryDeep}
      />
    </TouchableOpacity>
  )

  return (
    <PersonList<Profile>
      items={users}
      getProfile={(u) => u}
      loading={isLoading}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}
      emptyTitle="No friends yet"
      emptySubtitle="Start connecting to grow your circle"
      renderAccessory={renderAccessory}
    />
  )
}

export default FriendsList
