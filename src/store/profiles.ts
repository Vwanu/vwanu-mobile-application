import apiSlice from './api-slice'
import { Profile, PaginatedResponse } from '../../types'
import { endpoints, HttpMethods } from '../config'

interface UpdateProfile extends Partial<Profile> {
  [key: string]: any
}

interface FetchProfilesParams {
  search?: string
  $limit?: number
  $skip?: number
  $sort?: Record<string, 1 | -1>
}

const Profiles = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchProfiles: build.query<
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
          url: endpoints.USERS,
          method: HttpMethods.GET,
          params: queryParams,
        }
      },
      providesTags: ['Profile'],
    }),
    fetchProfile: build.query<Profile, string>({
      query: (profileId) => ({
        url: `${endpoints.USERS}/${profileId}`,
        method: HttpMethods.GET,
      }),
      providesTags: (result, error, id) => [{ type: 'Profile', id }],
    }),
    updateProfile: build.mutation<Profile, { id: string; data: UpdateProfile }>(
      {
        query: ({ id, data }) => ({
          url: `${endpoints.USERS}/${id}`,
          method: HttpMethods.PATCH,
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }
    ),
  }),
})

const {
  useFetchProfilesQuery,
  useFetchProfileQuery,
  useUpdateProfileMutation,
} = Profiles

export { useFetchProfilesQuery, useFetchProfileQuery, useUpdateProfileMutation }

export default Profiles.reducer
