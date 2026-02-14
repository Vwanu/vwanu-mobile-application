import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'
import {
  Blog,
  BlogComment,
  PaginatedResponse,
  FetchBlogsParams,
  CreateBlogParams,
  UpdateBlogParams,
} from '../../types'

const _toFormData = (values: Partial<CreateBlogParams>): FormData => {
  const formData = new FormData()

  if (values.title) formData.append('title', values.title)
  if (values.content) formData.append('content', values.content)

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
      query: ({ page = 1, limit = 10, search, interestId, userId } = {}) => {
        const params: Record<string, string> = {}
        params.page = page.toString()
        params.limit = limit.toString()

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
      query: (blogData) => {
        const formData = _toFormData(blogData)
        return {
          url: endpoints.BLOGS,
          method: HttpMethods.POST,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'multipart/form-data')
            return headers
          },
        }
      },
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // Update an existing blog
    updateBlog: builder.mutation<Blog, UpdateBlogParams>({
      query: ({ id, ...data }) => {
        const formData = _toFormData(data)
        return {
          url: `${endpoints.BLOGS}/${id}`,
          method: HttpMethods.PATCH,
          body: formData,
          prepareHeaders: (headers: Headers) => {
            headers.set('Content-Type', 'multipart/form-data')
            return headers
          },
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
