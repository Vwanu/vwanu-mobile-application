import apiSlice from './api-slice'
import { HttpMethods } from '../config'

export type UploadType = 'post' | 'profile' | 'message' | 'blog' | 'community'

export type ProfileFileType = 'profilePicture' | 'coverPicture'

export interface PresignFileRequest {
  filename: string
  mimeType: string
  uploadType: UploadType
  /**
   * Discriminator for `uploadType: 'profile'` to choose between
   * profilePicture / coverPicture (drives the S3 key prefix on the
   * backend via generateS3Key). Ignored for other upload types.
   */
  fileType?: ProfileFileType
}

export interface PresignFileResponse {
  key: string
  uploadUrl: string
  publicUrl: string
  expiresAt: string
}

export interface PresignBatchRequest {
  files: PresignFileRequest[]
}

export interface PresignBatchResponse {
  files: PresignFileResponse[]
}

export const uploadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPresignedUploadUrls: builder.mutation<
      PresignBatchResponse,
      PresignBatchRequest
    >({
      query: (body) => ({
        url: '/uploads/presign',
        method: HttpMethods.POST,
        body,
      }),
    }),
  }),
})

export const { useGetPresignedUploadUrlsMutation } = uploadsApiSlice
