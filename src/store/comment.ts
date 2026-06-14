import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'
import { CommentInterface, PostProps } from '../../types'

const comment = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    fetchComments: build.query<CommentInterface[], number>({
      query: (postId) => ({
        url: `${endpoints.COMMENTS}?postId=${postId}`,
        method: HttpMethods.GET,
      }),
    }),

    postComment: build.query<CommentInterface, number>({
      query: (postId) => ({
        url: `${endpoints.COMMENTS}/postId=${postId}`,
        body: {
          postId,
        },
        method: HttpMethods.POST,
      }),
    }),
  }),
})

const { useFetchCommentsQuery, usePostCommentQuery , useLazyFetchCommentsQuery } = comment

export { useFetchCommentsQuery, usePostCommentQuery, useLazyFetchCommentsQuery    }
