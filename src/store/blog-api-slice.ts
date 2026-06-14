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

// Strip undefined fields. The backend now accepts JSON for blog create/patch;
// multipart upload is gone (VWA-129). Title picture lands via presign +
// titlePictureKey; backend's applyBlogMediaKeys hook resolves to the
// persisted titlePicture column.
const buildBody = (
  values: Partial<CreateBlogParams & Pick<UpdateBlogParams, 'publishedAt'>>
) => {
  const body: Record<string, unknown> = {}
  if (values.title !== undefined) body.title = values.title
  if (values.content !== undefined) body.content = values.content
  if ('publishedAt' in values) body.publishedAt = values.publishedAt
  if (values.interests !== undefined) body.interests = values.interests
  if (values.titlePictureKey !== undefined) {
    body.titlePictureKey = values.titlePictureKey
  }
  return body
}

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch paginated blog list
    fetchBlogs: builder.query<PaginatedResponse<Blog>, FetchBlogsParams>({
      query: ({ limit = 10, search, interestIds, userId } = {}) => {
        const params: Record<string, string> = {}
        params['$limit'] = limit.toString()
        params['$sort[createdAt]'] = '-1'

        if (search && search.trim()) {
          params.search = search.trim()
        }
        if (interestIds?.length) {
          params.interestIds = interestIds.join(',')
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
      query: (blogData) => ({
        url: endpoints.BLOGS,
        method: HttpMethods.POST,
        body: buildBody(blogData),
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // Update an existing blog
    updateBlog: builder.mutation<Blog, UpdateBlogParams>({
      query: ({ id, ...data }) => ({
        url: `${endpoints.BLOGS}/${id}`,
        method: HttpMethods.PATCH,
        body: buildBody(data),
      }),
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
