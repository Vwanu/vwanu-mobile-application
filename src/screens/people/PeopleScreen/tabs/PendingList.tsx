import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import {
  useFetchReceivedFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from 'store/friends-api-slice'
import { FriendRequestInterface } from '../../../../../types'

import PersonList from '../components/PersonList'
import { TabProps } from '../index'

const PendingList: React.FC<TabProps> = ({ search }) => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const {
    data: requestsData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchReceivedFriendRequestsQuery(userId ?? '', { skip: !userId })

  // TODO: server-side search; client-side filter until the endpoint supports it.
  const items: FriendRequestInterface[] = useMemo(() => {
    const all = requestsData?.data || []
    const term = search.trim().toLowerCase()
    if (!term) return all
    return all.filter((r) =>
      `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`
        .toLowerCase()
        .includes(term)
    )
  }, [requestsData, search])

  const [acceptRequest] = useAcceptFriendRequestMutation()
  const [declineRequest] = useDeclineFriendRequestMutation()

  const handleAccept = async (requestId: string, targetId: string) => {
    try {
      await acceptRequest({ requestId, targetId }).unwrap()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleDeny = async (requestId: string, targetId: string) => {
    try {
      await declineRequest({ requestId, targetId }).unwrap()
    } catch (error) {
      console.error('Error declining friend request:', error)
    }
  }

  const renderAccessory = (r: FriendRequestInterface) => (
    <View style={tw`flex-row gap-2`}>
      <TouchableOpacity
        onPress={() => handleAccept(r.id, r.targetId)}
        activeOpacity={0.8}
        style={[
          tw`px-3 py-2 rounded-full`,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        <Ionicons name="checkmark" size={16} color={tw.color(`green-500`)} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeny(r.id, r.targetId)}
        activeOpacity={0.8}
        style={[
          tw`px-3 py-2 rounded-full border`,
          {
            backgroundColor: colors.warmSurface,
            borderColor: colors.warmBorderStrong,
          },
        ]}
      >
        <Ionicons name="close" size={16} color={tw.color(`red-500`)} />
      </TouchableOpacity>
    </View>
  )

  return (
    <PersonList<FriendRequestInterface>
      items={items}
      getProfile={(r) => r.user as Profile}
      loading={isLoading}
      refreshing={isFetching && !isLoading}
      onRefresh={refetch}
      emptyTitle="No pending requests"
      emptySubtitle="Sent friend requests will appear here"
      renderAccessory={renderAccessory}
    />
  )
}

export default PendingList
