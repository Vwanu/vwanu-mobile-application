import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { CommunityInterface } from '../../../../../../types'
import { useCommunityMembership } from '../hooks/useCommunityMembership'

interface Props {
  community: CommunityInterface
  hideJoin?: boolean
  onError?: (e: any) => void
}

const CommunityMembershipActions: React.FC<Props> = ({
  community,
  hideJoin = false,
  onError,
}) => {
  const { join, respondToInvitation } = useCommunityMembership({
    communityId: community.id,
    onError,
  })

  const isMember = (community as any).isMember
  if (isMember) {
    return (
      <View style={tw`bg-white bg-opacity-90 px-3 py-1 rounded-full`}>
        <Text style={tw`text-black font-semibold text-xs`}>
          {isMember.role.toUpperCase()}
        </Text>
      </View>
    )
  }

  if (community.pendingInvitation) {
    return (
      <View style={tw`gap-2`}>
        <TouchableOpacity
          onPress={() => {
            if (community.pendingInvitation) {
              respondToInvitation(community.pendingInvitation.id, true)
            }
          }}
          style={tw`bg-white border-b-2 border-l-2 border-r-2 border-b-primary border-r-primary bg-opacity-90 border-l-primary bg-opacity-90 px-3 py-1 rounded-full`}
        >
          <Text style={tw`text-black font-semibold text-xs`}>
            Accept Invitation{' '}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (community.pendingInvitation) {
              respondToInvitation(community.pendingInvitation.id, false)
            }
          }}
          style={tw`bg-white border-b-2 border-l-2 border-r-2 border-b-red-500 border-l-red-500 border-r-red-500 bg-opacity-90 px-3 py-1 rounded-full`}
        >
          <Text style={tw`text-black font-semibold text-xs`}>
            Reject Invitation
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (hideJoin) return null

  return (
    <TouchableOpacity
      disabled={community.pendingJoinRequest}
      onPress={() => join()}
    >
      <Text
        style={tw`text-black font-semibold text-xs bg-white bg-opacity-90 px-3 py-1 rounded-full`}
      >
        {community.pendingJoinRequest ? 'Pending Request' : 'Join'}
      </Text>
    </TouchableOpacity>
  )
}

export default CommunityMembershipActions
