import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  CommunityInterface,
  User,
  PaginatedResponse,
  Invitation,
  CommunityRole,
} from '../../types'
import CreateCommunity from 'screens/Communities/CreateCommunity'

interface FetchCommunitiesParams {
  page?: number
  limit?: number
  search?: string
  interestId?: string
  userId?: string
}

type CommunityCreationProps = Partial<CommunityInterface> & {
  coverPicture?: string
}

const _toFormData = (values: Partial<CommunityCreationProps>): FormData => {
  const formData = new FormData()
  formData.append('name', values.name || '')
  formData.append('description', values.description || '')
  formData.append('privacyType', values.privacyType || 'public')

  if (values.interests) {
    values.interests.forEach((interest) => {
      formData.append('interests', interest.toString())
    })
  }

  if (values.coverPicture) {
    const filename = values.coverPicture.split('/').pop() || 'coverPicture.jpg'
    let mimeType = 'image/jpeg' // default

    // Determine mime type based on file extension
    if (filename.endsWith('.png')) {
      mimeType = 'image/png'
    } else if (filename.endsWith('.gif')) {
      mimeType = 'image/gif'
    } else if (filename.endsWith('.webp')) {
      mimeType = 'image/webp'
    }

    const imageBlob = {
      uri: values.coverPicture,
      type: mimeType,
      name: filename,
    } as any
    formData.append('coverPicture', imageBlob)
  }
  console.log('🚀 formData:', formData)
  return formData
}

// Community API endpoints
export const communitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new community
    createCommunity: builder.mutation<
      CommunityInterface,
      Partial<CommunityCreationProps>
    >({
      query: (communityData) => {
        const formData = _toFormData(communityData)
        return {
          url: '/communities',
          method: HttpMethods.POST,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'multipart/form-data')
            return headers
          },
        }
      },
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

    // Update community (for future use)
    updateCommunity: builder.mutation<
      CommunityInterface,
      { id: number; data: Partial<CommunityInterface> }
    >({
      query: ({ id, data }) => ({
        url: `/communities/${id}`,
        method: 'PUT',
        body: data,
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
} = communitiesApiSlice

export default communitiesApiSlice
