import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'

export interface Interest {
  id: string
  name: string
  coverPicture?: string
  description?: string
}

const interests = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchInterests: build.query<Interest[], void>({
      query: () => ({
        url: endpoints.INTERESTS,
        method: HttpMethods.GET,
      }),
      providesTags: ['Interest'],
    }),
  }),
})

const { useFetchInterestsQuery } = interests

export { useFetchInterestsQuery }
export type { Interest as InterestType }
