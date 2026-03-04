import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'
import { AuthTokenService } from '../lib/authTokenService'
import {
  Blog,
  BlogComment,
  PaginatedResponse,
  FetchBlogsParams,
  CreateBlogParams,
  UpdateBlogParams,
} from '../../types'

const _toFormData = (
  values: Partial<CreateBlogParams & Pick<UpdateBlogParams, 'publishedAt'>>
): FormData => {
  const formData = new FormData()

  if (values.title) formData.append('title', values.title)
  if (values.content) formData.append('content', values.content)
  if ('publishedAt' in values) {
    formData.append(
      'publishedAt',
      values.publishedAt === null ? '' : values.publishedAt!
    )
  }

  if (values.interests) {
    values.interests.forEach((interest) => {
      formData.append('interests', interest)
    })
  }

  if (values.titlePicture) {
    const filename = values.titlePicture.split('/').pop() || 'titlePicture.jpg'
    let mimeType = 'image/jpeg'

    if (filename.endsWith('.png')) {
      mimeType = 'image/png'
    } else if (filename.endsWith('.gif')) {
      mimeType = 'image/gif'
    } else if (filename.endsWith('.webp')) {
      mimeType = 'image/webp'
    }

    const imageBlob = {
      uri: values.titlePicture,
      type: mimeType,
      name: filename,
    } as any
    formData.append('titlePicture', imageBlob)
  }

  return formData
}

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch paginated blog list
    fetchBlogs: builder.query<PaginatedResponse<Blog>, FetchBlogsParams>({
      query: ({ limit = 10, search, interestId, userId } = {}) => {
        const params: Record<string, string> = {}
        params['$limit'] = limit.toString()
        params['$sort[createdAt]'] = '-1'

        if (search && search.trim()) {
          params.search = search.trim()
        }
        if (interestId) {
          params.interestId = interestId
        }
        if (userId) {
          params.userId = userId
        }

        return {
          url: endpoints.BLOGS,
          params,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Blog' as const,
                id,
              })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),

    // Fetch single blog by ID
    fetchBlog: builder.query<Blog, string>({
      query: (id) => `${endpoints.BLOGS}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // Fetch comments for a blog
    fetchBlogComments: builder.query<
      PaginatedResponse<BlogComment>,
      { blogId: string; page?: number; limit?: number }
    >({
      query: ({ blogId, page = 1, limit = 20 }) => ({
        url: `${endpoints.BLOGS}/${blogId}/comments`,
        params: { page: page.toString(), limit: limit.toString() },
      }),
      providesTags: (result, error, { blogId }) => [
        { type: 'Blog', id: blogId },
      ],
    }),

    // Create a new blog
    createBlog: builder.mutation<Blog, CreateBlogParams>({
      async queryFn(blogData) {
        try {
          const formData = _toFormData(blogData)
          const tokens = await AuthTokenService.getValidTokens()
          const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim()
          const appKey = process.env.EXPO_PUBLIC_APP_KEY

          const headers: Record<string, string> = {}
          if (tokens?.accessToken) {
            headers['authorization'] = `Bearer ${tokens.accessToken}`
          }
          if (tokens?.idToken) {
            headers['x-id-token'] = tokens.idToken
          }
          if (appKey) {
            headers['x-app-key'] = appKey
          }

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000)

          console.log(
            '📤 Sending blog POST to:',
            `${baseUrl}${endpoints.BLOGS}`
          )

          const response = await fetch(`${baseUrl}${endpoints.BLOGS}`, {
            method: 'POST',
            headers,
            body: formData,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          console.log('📥 Blog POST response status:', response.status)

          if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Blog POST error body:', errorText)
            return {
              error: {
                status: response.status,
                data: errorText,
              },
            }
          }

          const data = await response.json()
          console.log('✅ Blog created successfully:', data.id)
          return { data: data as Blog }
        } catch (err: any) {
          console.error('❌ Blog POST exception:', err.name, err.message)
          return {
            error: {
              status: 'FETCH_ERROR',
              error: err.message || 'Failed to create blog',
            },
          }
        }
      },
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // Update an existing blog
    updateBlog: builder.mutation<Blog, UpdateBlogParams>({
      async queryFn({ id, ...data }) {
        try {
          const formData = _toFormData(data)
          const tokens = await AuthTokenService.getValidTokens()
          const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim()
          const appKey = process.env.EXPO_PUBLIC_APP_KEY

          const headers: Record<string, string> = {}
          if (tokens?.accessToken) {
            headers['authorization'] = `Bearer ${tokens.accessToken}`
          }
          if (tokens?.idToken) {
            headers['x-id-token'] = tokens.idToken
          }
          if (appKey) {
            headers['x-app-key'] = appKey
          }

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000)

          const response = await fetch(`${baseUrl}${endpoints.BLOGS}/${id}`, {
            method: 'PATCH',
            headers,
            body: formData,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Blog PATCH error body:', errorText)
            return {
              error: {
                status: response.status,
                data: errorText,
              },
            }
          }

          const responseData = await response.json()
          return { data: responseData as Blog }
        } catch (err: any) {
          console.error('❌ Blog PATCH exception:', err.name, err.message)
          return {
            error: {
              status: 'FETCH_ERROR',
              error: err.message || 'Failed to update blog',
            },
          }
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    // Delete a blog
    deleteBlog: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${endpoints.BLOGS}/${id}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    // Like/unlike a blog
    toggleBlogLike: builder.mutation<Blog, string>({
      query: (id) => ({
        url: `${endpoints.BLOGS}/${id}/like`,
        method: HttpMethods.POST,
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // Add a comment to a blog
    createBlogComment: builder.mutation<
      BlogComment,
      { blogId: string; text: string }
    >({
      query: ({ blogId, text }) => ({
        url: `${endpoints.BLOGS}/${blogId}/comments`,
        method: HttpMethods.POST,
        body: { text },
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: 'Blog', id: blogId },
      ],
    }),

    // Delete a comment from a blog
    deleteBlogComment: builder.mutation<
      { success: boolean },
      { blogId: string; commentId: string }
    >({
      query: ({ blogId, commentId }) => ({
        url: `${endpoints.BLOGS}/${blogId}/comments/${commentId}`,
        method: HttpMethods.DELETE,
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: 'Blog', id: blogId },
      ],
    }),
  }),
})

export const {
  useFetchBlogsQuery,
  useFetchBlogQuery,
  useFetchBlogCommentsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogLikeMutation,
  useCreateBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogApiSlice

export default blogApiSlice
