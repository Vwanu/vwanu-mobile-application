import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'
import { PaginatedResponse } from '../../types'

interface FetchFollowersParams {
  UserId?: string
  action: 'people-who-follow-me' | 'people-i-follow'
  $limit?: number
  $skip?: number
}

interface FollowParams {
  UserId: string
}

export const followersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch followers of a user
     * GET /followers?action=people-who-follow-me&UserId={userId}
     */
    fetchFollowers: builder.query<PaginatedResponse<Profile>, string>({
      query: (userId) => ({
        url: endpoints.FOLLOWERS,
        method: HttpMethods.GET,
        params: {
          action: 'people-who-follow-me',
          UserId: userId,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Follower' as const,
                id,
              })),
              { type: 'Follower', id: 'FOLLOWERS_LIST' },
            ]
          : [{ type: 'Follower', id: 'FOLLOWERS_LIST' }],
    }),

    /**
     * Fetch users that a user is following
     * GET /followers?action=people-i-follow&UserId={userId}
     */
    fetchFollowing: builder.query<PaginatedResponse<Profile>, string>({
      query: (userId) => ({
        url: endpoints.FOLLOWERS,
        method: HttpMethods.GET,
        params: {
          action: 'people-i-follow',
          UserId: userId,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Follower' as const,
                id,
              })),
              { type: 'Follower', id: 'FOLLOWING_LIST' },
            ]
          : [{ type: 'Follower', id: 'FOLLOWING_LIST' }],
    }),

    /**
     * Follow a user
     * POST /followers { UserId: targetUserId }
     */
    followUser: builder.mutation<{ message: string }, FollowParams>({
      query: (params) => ({
        url: endpoints.FOLLOWERS,
        method: HttpMethods.POST,
        body: params,
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: 'Follower', id: 'FOLLOWERS_LIST' },
        { type: 'Follower', id: 'FOLLOWING_LIST' },
        { type: 'Profile', id: params.UserId },
      ],
    }),

    /**
     * Unfollow a user
     * DELETE /followers/{userId}
     */
    unfollowUser: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `${endpoints.FOLLOWERS}/${userId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'Follower', id: 'FOLLOWERS_LIST' },
        { type: 'Follower', id: 'FOLLOWING_LIST' },
        { type: 'Profile', id: userId },
      ],
    }),
  }),
})

export const {
  useFetchFollowersQuery,
  useFetchFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followersApiSlice
