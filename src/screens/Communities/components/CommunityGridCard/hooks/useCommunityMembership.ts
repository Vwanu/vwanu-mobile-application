import { useEffect } from 'react'

import {
  useJoinCommunityMutation,
  useUpdateCommunityInvitationMutation,
} from 'store/communities-api-slice'

interface UseCommunityMembershipParams {
  communityId: string | number
  onError?: (e: any) => void
}

export const useCommunityMembership = ({
  communityId,
  onError,
}: UseCommunityMembershipParams) => {
  const [updateCommunity, { isLoading: loadingUpdated, error: errorUpdating }] =
    useUpdateCommunityInvitationMutation()
  const [joinCommunity, { isLoading: loadingJoin, error: joinError }] =
    useJoinCommunityMutation()

  const loading = loadingJoin || loadingUpdated
  const error = joinError || errorUpdating

  useEffect(() => {
    if (error) onError?.(error)
  }, [error])

  const join = () => joinCommunity(String(communityId))

  const respondToInvitation = (invitationId: string, response: boolean) =>
    updateCommunity({
      invitationId,
      communityId: String(communityId),
      response,
    })

  return {
    join,
    respondToInvitation,
    loading,
    error,
  }
}
