import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  FriendRequestInterface,
  FetchFriendRequestsParams,
  SendFriendRequestParams,
  PaginatedResponse,
} from '../../types'

enum FriendShipStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DENIED = 2,
}

/**
 * Friends API Slice
 * Handles all friend request-related API endpoints
 */
export const friendsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch friend requests (sent or received)
     * GET /friendship
     */
    fetchFriendRequests: builder.query<
      PaginatedResponse<FriendRequestInterface>,
      FetchFriendRequestsParams
    >({
      query: (params: FetchFriendRequestsParams) => {
        const queryParams: Record<string, string> = {}

        if (params?.userId) {
          queryParams.userId = params.userId
        }

        if (params?.targetId) {
          queryParams.targetId = params.targetId
        }
        queryParams.status = String(params?.status ?? FriendShipStatus.PENDING)

        return {
          url: '/friendship',
          params: queryParams,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'friendship' as const,
                id,
              })),
              { type: 'friendship', id: 'LIST' },
            ]
          : [{ type: 'friendship', id: 'LIST' }],
    }),

    /**
     * Fetch received friend requests
     * GET /friendship?targetId={userId}&status=pending
     */
    fetchReceivedFriendRequests: builder.query<
      PaginatedResponse<FriendRequestInterface>,
      string
    >({
      query: (userId) => ({
        url: '/friendship',
        params: { targetId: userId, status: FriendShipStatus.PENDING },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'friendship' as const,
                id,
              })),
              { type: 'friendship', id: 'RECEIVED' },
            ]
          : [{ type: 'friendship', id: 'RECEIVED' }],
    }),

    /**
     * Fetch sent friend requests
     * GET /friendship?userId={userId}&status=pending
     */
    fetchSentFriendRequests: builder.query<
      PaginatedResponse<FriendRequestInterface>,
      string
    >({
      query: (userId) => ({
        url: '/friendship',
        params: { userId: userId, status: FriendShipStatus.PENDING },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'friendship' as const,
                id,
              })),
              { type: 'friendship', id: 'SENT' },
            ]
          : [{ type: 'friendship', id: 'SENT' }],
    }),

    /**
     * Send a new friend request
     * POST /friendship
     */
    sendFriendRequest: builder.mutation<
      FriendRequestInterface,
      SendFriendRequestParams
    >({
      query: (params) => ({
        url: '/friendship',
        method: HttpMethods.POST,
        body: params,
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: 'friendship', id: 'LIST' },
        { type: 'friendship', id: 'SENT' },
        { type: 'friendship', id: 'COUNT' },
        { type: 'Profile', id: params.targetId },
      ],
    }),

    /**
     * Accept a friend request
     * PUT /friendship/:id/accept
     */
    acceptFriendRequest: builder.mutation<
      FriendRequestInterface,
      { requestId: string; targetId: string }
    >({
      query: ({ requestId }) => ({
        url: `/friendship/${requestId}`,
        method: HttpMethods.PATCH,
        body: { status: FriendShipStatus.ACCEPTED },
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: 'friendship', id: params.requestId },
        { type: 'friendship', id: 'LIST' },
        { type: 'friendship', id: 'RECEIVED' },
        { type: 'friendship', id: 'COUNT' },
        { type: 'Profile', id: params.targetId },
      ],
    }),

    /**
     * Decline a friend request
     * PUT /friendship/:id/decline
     */
    declineFriendRequest: builder.mutation<
      FriendRequestInterface,
      { requestId: string; targetId: string }
    >({
      query: ({ requestId }) => ({
        url: `/friendship/${requestId}`,
        method: HttpMethods.PATCH,
        body: { status: FriendShipStatus.DENIED },
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: 'friendship', id: params.requestId },
        { type: 'friendship', id: 'LIST' },
        { type: 'friendship', id: 'RECEIVED' },
        { type: 'friendship', id: 'COUNT' },
        { type: 'Profile', id: params.targetId },
      ],
    }),

    /**
     * Cancel (delete) a sent friend request
     * DELETE /friendship/:id
     */
    cancelFriendRequest: builder.mutation<void, string>({
      query: (requestId) => ({
        url: `/friendship/${requestId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: 'friendship', id: requestId },
        { type: 'friendship', id: 'LIST' },
        { type: 'friendship', id: 'SENT' },
        { type: 'friendship', id: 'COUNT' },
        { type: 'Profile', id: 'LIST' },
      ],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useFetchFriendRequestsQuery,
  useFetchReceivedFriendRequestsQuery,
  useFetchSentFriendRequestsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
} = friendsApiSlice
