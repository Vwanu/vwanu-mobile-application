import apiSlice from './api-slice'
import { HttpMethods } from '../config'

export type DevicePlatform = 'ios' | 'android'

export interface RegisterPushTokenRequest {
  token: string
  platform: DevicePlatform
}

export interface DeviceTokenResponse {
  id: string
  userId: string
  token: string
  platform: DevicePlatform
  lastSeenAt: string
}

export const devicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerPushToken: builder.mutation<
      DeviceTokenResponse,
      RegisterPushTokenRequest
    >({
      query: (body) => ({
        url: '/device-tokens',
        method: HttpMethods.POST,
        body,
      }),
    }),
    unregisterPushToken: builder.mutation<void, string>({
      query: (token) => ({
        url: `/device-tokens/${encodeURIComponent(token)}`,
        method: HttpMethods.DELETE,
      }),
    }),
  }),
})

export const { useRegisterPushTokenMutation, useUnregisterPushTokenMutation } =
  devicesApiSlice

export default devicesApiSlice
