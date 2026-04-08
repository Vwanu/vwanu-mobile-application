import apiSlice from './api-slice'
import { endpoints, HttpMethods } from '../config'
import {
  Discussion,
  DiscussionReply,
  PaginatedResponse,
  FetchDiscussionsParams,
  CreateDiscussionParams,
  CreateDiscussionReplyParams,
} from '../../types'

const discussionUrl = (interestId: string) =>
  `${endpoints.INTERESTS}/${interestId}/discussion`
const discussionKoremUrl = (interestId: string) =>
  `${endpoints.INTERESTS}/${interestId}/discussion-kore`

export const discussionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDiscussions: builder.query<
      PaginatedResponse<Discussion>,
      FetchDiscussionsParams
    >({
      query: ({ interestId, limit = 20, page = 1 }) => ({
        url: discussionUrl(interestId),
        params: {
          $limit: limit.toString(),
          $skip: ((page - 1) * limit).toString(),
          '$sort[createdAt]': '-1',
          parentId: 'null',
          interestId: interestId,
        },
      }),
      providesTags: (result, _error, { interestId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Discussion' as const,
                id,
              })),
              { type: 'Discussion', id: `LIST-${interestId}` },
            ]
          : [{ type: 'Discussion', id: `LIST-${interestId}` }],
    }),

    createDiscussion: builder.mutation<Discussion, CreateDiscussionParams>({
      query: ({ interestId, title, body }) => ({
        url: discussionUrl(interestId),
        method: HttpMethods.POST,
        body: { title, body, interestId },
      }),
      invalidatesTags: (_result, _error, { interestId }) => [
        { type: 'Discussion', id: `LIST-${interestId}` },
      ],
    }),

    fetchDiscussionLikers: builder.query<
      PaginatedResponse<{ User: User; createdAt: Date }>,
      { interestId: string; discussionId: string }
    >({
      query: ({ interestId, discussionId }) => ({
        url: discussionKoremUrl(interestId),
        params: {
          '$sort[createdAt]': '-1',
          discussionId,
          entityType: 'Discussion',
        },
      }),
      providesTags: (_result, _error, { discussionId }) => [
        { type: 'Discussion', id: `LIKERS-${discussionId}` },
      ],
    }),

    // Fetch replies for a specific discussion (where parentId = discussionId)
    fetchDiscussionReplies: builder.query<
      PaginatedResponse<Discussion>,
      { interestId: string; discussionId: string }
    >({
      query: ({ interestId, discussionId }) => ({
        url: discussionUrl(interestId),
        params: {
          '$sort[createdAt]': '1',
          parentId: discussionId,
        },
      }),
      providesTags: (_result, _error, { discussionId }) => [
        { type: 'Discussion', id: `REPLIES-${discussionId}` },
      ],
    }),

    // Reply to a discussion — sends the parent discussion's id as `parentId`
    replyToDiscussion: builder.mutation<
      Discussion,
      {
        interestId: string
        discussionId: string
        body: string
        mentions?: string[]
      }
    >({
      query: ({ interestId, discussionId, body, mentions }) => ({
        url: discussionUrl(interestId),
        method: HttpMethods.POST,
        body: { body, parentId: discussionId, interestId, mentions },
      }),
      invalidatesTags: (_result, _error, { discussionId, interestId }) => [
        { type: 'Discussion', id: discussionId },
        { type: 'Discussion', id: `REPLIES-${discussionId}` },
        { type: 'Discussion', id: `LIST-${interestId}` },
      ],
    }),

    toggleDiscussionLike: builder.mutation<
      Discussion,
      { interestId: string; discussionId: string; parentId?: string }
    >({
      query: ({ interestId, discussionId }) => ({
        url: discussionKoremUrl(interestId),
        method: HttpMethods.POST,
        body: { discussionId },
      }),
      async onQueryStarted(
        { interestId, discussionId, parentId },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic update for a reply inside its parent's replies cache
        if (parentId) {
          const patchResult = dispatch(
            discussionApiSlice.util.updateQueryData(
              'fetchDiscussionReplies',
              { interestId, discussionId: parentId },
              (draft) => {
                const reply = draft.data.find((r) => r.id === discussionId)
                if (reply) {
                  if (reply.isReactor) {
                    reply.amountOfLikes = Math.max(0, reply.amountOfLikes - 1)
                    reply.isReactor = null
                  } else {
                    reply.amountOfLikes = (reply.amountOfLikes || 0) + 1
                    reply.isReactor = true
                  }
                }
              }
            )
          )
          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        }
      },
      invalidatesTags: (_result, _error, { discussionId, parentId }) =>
        parentId ? [] : [{ type: 'Discussion', id: discussionId }],
    }),

    toggleReplyLike: builder.mutation<
      DiscussionReply,
      { interestId: string; discussionId: string; replyId: string }
    >({
      query: ({ interestId, discussionId, replyId }) => ({
        url: `${discussionUrl(
          interestId
        )}/${discussionId}/replies/${replyId}/like`,
        method: HttpMethods.POST,
      }),
      invalidatesTags: (_result, _error, { discussionId }) => [
        { type: 'Discussion', id: discussionId },
      ],
    }),
  }),
})

export const {
  useFetchDiscussionsQuery,
  useLazyFetchDiscussionRepliesQuery,
  useCreateDiscussionMutation,
  useReplyToDiscussionMutation,
  useToggleDiscussionLikeMutation,
  useToggleReplyLikeMutation,
  useLazyFetchDiscussionLikersQuery,
} = discussionApiSlice
