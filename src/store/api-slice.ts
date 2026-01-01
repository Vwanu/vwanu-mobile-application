import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { AuthTokenService } from '../lib/authTokenService'
import { signOutUser } from './auth-slice'

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Get valid tokens (will refresh if needed)
  const tokens = await AuthTokenService.getValidTokens()

  // Create the base query with tokens
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // Add app key from EAS environment
      const appKey = process.env.EXPO_PUBLIC_APP_KEY
      if (appKey) {
        headers.set('x-app-key', appKey)
      }

      // Add authentication tokens
      if (tokens?.accessToken && tokens?.idToken) {
        headers.set('authorization', `Bearer ${tokens.accessToken}`)
        headers.set('x-id-token', tokens.idToken)
      }
      return headers
    },
  })

  // Make the initial request
  let result = await baseQuery(args, api, extraOptions)

  // Handle 401 Unauthorized responses
  if (result.error && result.error.status === 401) {
    console.log('🔄 Received 401, attempting token refresh...')

    // Try to refresh tokens
    const refreshedTokens = await AuthTokenService.refreshTokens()

    if (refreshedTokens?.accessToken && refreshedTokens?.idToken) {
      console.log('✅ Token refresh successful, retrying request...')

      // Recreate base query with new tokens
      const retryBaseQuery = fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
          // Add app key from EAS environment
          const appKey = process.env.EXPO_PUBLIC_APP_KEY
          if (appKey) {
            headers.set('x-app-key', appKey)
          }

          // Add refreshed authentication tokens
          headers.set('authorization', `Bearer ${refreshedTokens.accessToken}`)
          headers.set('x-id-token', refreshedTokens.idToken || '')
          return headers
        },
      })

      // Retry the original request
      result = await retryBaseQuery(args, api, extraOptions)
    } else {
      console.log('❌ Token refresh failed, signing out user...')
      // If token refresh fails, sign out the user
      api.dispatch(signOutUser())
    }
  }

  return result
}

const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: [
    'Profile',
    'Post',
    'Community',
    'Interest',
    'Notification',
    'friendship',
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})

export default apiSlice
