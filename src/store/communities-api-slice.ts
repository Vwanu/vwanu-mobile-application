import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  CommunityInterface,
  User,
  PaginatedResponse,
  Invitation,
  CommunityRole,
} from '../../types'

interface FetchCommunitiesParams {
  page?: number
  limit?: number
  search?: string
  interestId?: string
  userId?: string
}

type CommunityCreationProps = Partial<CommunityInterface> & {
  /**
   * S3 key (from /uploads/presign with uploadType: 'community') of the
   * community profile picture. Backend's applyProfileMediaKeys hook
   * resolves this into the persisted `profilePicture` column.
   */
  profilePictureKey?: string
}

// Strip undefined fields and ensure interests are JSON-encoded as strings.
// The backend now accepts JSON for community create/patch; multipart upload
// is gone (VWA-128).
const buildBody = (values: Partial<CommunityCreationProps>) => {
  const body: Record<string, unknown> = {}
  if (values.name !== undefined) body.name = values.name
  if (values.description !== undefined) body.description = values.description
  if (values.privacyType !== undefined) body.privacyType = values.privacyType
  if (values.interests !== undefined) {
    body.interests = values.interests.map((i) => i.toString())
  }
  if (values.profilePictureKey !== undefined) {
    body.profilePictureKey = values.profilePictureKey
  }
  return body
}

// Community API endpoints
export const communitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new community
    createCommunity: builder.mutation<
      CommunityInterface,
      Partial<CommunityCreationProps>
    >({
      query: (communityData) => ({
        url: '/communities',
        method: HttpMethods.POST,
        body: buildBody(communityData),
      }),
      invalidatesTags: ['Community'],
    }),

    // Fetch communities with optional filters
    fetchCommunities: builder.query<
      PaginatedResponse<CommunityInterface>,
      FetchCommunitiesParams
    >({
      query: ({ page = 1, limit = 10, search, interestId, userId } = {}) => {
        const params: Record<string, string> = {}

        // Add pagination params
        // params.page = page.toString()
        // params.limit = limit.toString()

        // Add search param if provided
        if (search && search.trim()) {
          params.name = search.trim()
        }

        // Add interest filter if provided
        if (interestId) {
          params.interests = interestId
        }

        // Add userId filter if provided (for "my communities")
        if (userId) {
          params.userId = userId
        }

        return {
          url: '/communities',
          params,
        }
      },
      providesTags: ['Community'],
    }),

    // Fetch single community (for future use)
    fetchCommunity: builder.query<CommunityInterface, string>({
      query: (id) => `/communities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Community', id }],
    }),

    // Update community
    updateCommunity: builder.mutation<
      CommunityInterface,
      Partial<CommunityCreationProps> & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/communities/${id}`,
        method: 'PATCH',
        body: buildBody(data),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Community', id }],
    }),

    // Delete community (for future use)
    deleteCommunity: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),

    // Join community (for future use)
    joinCommunity: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/communities/${id}/joinRequest`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),

    // Leave community (for future use)
    leaveCommunity: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/communities/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Community', id }],
    }),
    fetchCommunityMembers: builder.query<
      PaginatedResponse<{
        communityId: String
        user: User
        communityRole: CommunityRole
      }>,
      { id: string; filter?: string }
    >({
      query: ({ id, filter }) => ({
        params: {
          filter,
        },
        url: `/communities/${id}/members`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Community', id: arg.id }],
    }),
    fetchCommunityInvitations: builder.query<
      PaginatedResponse<Invitation>,
      { id: string; filter?: string }
    >({
      query: ({ id, filter }) => ({
        params: {
          filter,
        },
        url: `/communities/${id}/invitations`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Community', id: arg.id }],
    }),
    fetchJoinCommunityRequest: builder.query<
      PaginatedResponse<{}>,
      { id: string; filter: string | undefined }
    >({
      query: ({ id, filter }) => ({
        params: {
          filter,
        },
        url: `/communities/${id}/joinRequest`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Community', id: arg.id }],
    }),

    // Fetch community roles (general, not community-specific)
    fetchCommunityRoles: builder.query<PaginatedResponse<CommunityRole>, void>({
      query: () => ({
        url: '/community-roles',
        method: HttpMethods.GET,
      }),
      providesTags: ['Community'],
    }),

    // Send invitations to users with role
    sendCommunityInvitations: builder.mutation<
      { success: boolean; message?: string },
      { id: string; userIds: string[]; roleId: string }
    >({
      query: ({ id, userIds, roleId }) => ({
        url: `/communities/${id}/invitations`,
        method: HttpMethods.POST,
        body: { userIds, roleId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Community', id }],
    }),

    // Delete community invitation
    deleteCommunityInvitation: builder.mutation<
      Invitation,
      { invitationId: string; communityId: string }
    >({
      query: ({ invitationId, communityId }) => ({
        url: `/communities/${communityId}/invitations/${invitationId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: ['Community'],
    }),

    updateCommunityInvitation: builder.mutation<
      Invitation,
      { invitationId: string; communityId: string; response: boolean }
    >({
      query: ({ invitationId, communityId, response }) => ({
        url: `/communities/${communityId}/invitations/${invitationId}`,
        body: { response },
        method: HttpMethods.PATCH,
      }),
    }),

    // Fetch banned members for a community
    fetchBannedMembers: builder.query<
      PaginatedResponse<{
        bannedUser: User
        banByUser: User
      }>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/communities/${id}/bans`,
        method: HttpMethods.GET,
      }),
      providesTags: (result, error, arg) => [{ type: 'Community', id: arg.id }],
    }),

    // Ban a community member
    banMember: builder.mutation<
      { success: boolean },
      { communityId: string; userId: string; duration: string }
    >({
      query: ({ communityId, userId, duration }) => ({
        url: `/communities/${communityId}/bans`,
        method: HttpMethods.POST,
        body: { userId, until: duration },
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: 'Community', id: communityId },
      ],
    }),

    // Unban a community member
    unbanMember: builder.mutation<
      { success: boolean },
      { communityId: string; userId: string }
    >({
      query: ({ communityId, userId }) => ({
        url: `/communities/${communityId}/bans/${userId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: 'Community', id: communityId },
      ],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useCreateCommunityMutation,
  useFetchCommunitiesQuery,
  useFetchCommunityQuery,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useFetchCommunityMembersQuery,
  useFetchCommunityInvitationsQuery,
  useFetchJoinCommunityRequestQuery,
  useFetchCommunityRolesQuery,
  useSendCommunityInvitationsMutation,
  useDeleteCommunityInvitationMutation,
  useUpdateCommunityInvitationMutation,
  useFetchBannedMembersQuery,
  useBanMemberMutation,
  useUnbanMemberMutation,
} = communitiesApiSlice

export default communitiesApiSlice
