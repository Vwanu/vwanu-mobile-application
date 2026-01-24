import apiSlice from './api-slice'
import { HttpMethods } from '../config'
import {
  FriendRequestInterface,
  FetchFriendRequestsParams,
  SendFriendRequestParams,
  PaginatedResponse,
} from '../../types'
import { WebSocketManagerFeathers } from 'services/websocket-manager-feathers'

enum FriendShipStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DENIED = 2,
}

interface FetchProfilesParams {
  search?: string
  $limit?: number
  $skip?: number
  $sort?: Record<string, 1 | -1>
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

    fetchFriends: builder.query<
      PaginatedResponse<Profile>,
      FetchProfilesParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> = {}

        if (params && typeof params === 'object') {
          // Add search param if provided
          if (params.search?.trim()) {
            queryParams.search = params.search.trim()
          }

          // Add pagination params
          if (params.$limit !== undefined) {
            queryParams.$limit = params.$limit
          }
          if (params.$skip !== undefined) {
            queryParams.$skip = params.$skip
          }
          if (params.$sort) {
            queryParams.$sort = JSON.stringify(params.$sort)
          }
        }
        return {
          url: '/friendship',
          method: HttpMethods.GET,
          params: queryParams,
        }
      },
      //   providesTags: ['Profile'],
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

      async onCacheEntryAdded(
        _arg,
        { cacheDataLoaded, dispatch, cacheEntryRemoved, getState }
      ) {
        try {
          await cacheDataLoaded
          const state = getState() as any
          const currentUserId = state.auth.userId
          const unsubscribeCreated =
            WebSocketManagerFeathers.subscribeToService<FriendRequestInterface>(
              'friendship',
              'created',
              (data) => {
                const profileIdToInvalidate =
                  data.targetId === currentUserId ? data.userId : data.targetId
                console.log(
                  'New friend request received via websocket:',
                  profileIdToInvalidate
                )
                dispatch(
                  apiSlice.util.invalidateTags([
                    { type: 'friendship', id: 'RECEIVED' },
                    { type: 'Profile', id: profileIdToInvalidate }, // invalidate target profile
                  ])
                )
              }
            )

          const unsubscribeRemoved =
            WebSocketManagerFeathers.subscribeToService<FriendRequestInterface>(
              'friendship',
              'removed',
              () => {
                dispatch(
                  apiSlice.util.invalidateTags([
                    { type: 'friendship', id: 'RECEIVED' },
                  ])
                )
              }
            )
          const unsubscribeUpdated =
            WebSocketManagerFeathers.subscribeToService<FriendRequestInterface>(
              'friendship',
              'patched',

              (data) => {
                const profileIdToInvalidate =
                  data.targetId === currentUserId ? data.userId : data.targetId
                dispatch(
                  apiSlice.util.invalidateTags([
                    { type: 'friendship', id: 'RECEIVED' },
                    { type: 'friendship', id: 'SENT' },
                    { type: 'Profile', id: profileIdToInvalidate }, // invalidate target profile
                  ])
                )
              }
            )
          await cacheEntryRemoved
          unsubscribeCreated()
          unsubscribeRemoved()
          unsubscribeUpdated()
        } catch {
          return
        }
      },
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
      { requestId: string; targetId: string; userId?: string }
    >({
      query: ({ requestId }) => ({
        url: `/friendship/${requestId}`,
        method: HttpMethods.PATCH,
        body: { status: FriendShipStatus.ACCEPTED },
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: 'friendship', id: params.requestId },
        { type: 'friendship', id: 'LIST' },
        { type: 'friendship', id: 'COUNT' },
        // { type: 'Profile', id: params.userId },
        { type: 'friendship', id: 'RECEIVED' },
        // { type: 'Profile', id: params.targetId },
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
  useFetchFriendsQuery,
} = friendsApiSlice
