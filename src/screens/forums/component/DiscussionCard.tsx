import React, { useMemo } from 'react'

import { Discussion } from '../../../../types'
import {
  useLazyFetchDiscussionRepliesQuery,
  useToggleDiscussionLikeMutation,
  useLazyFetchDiscussionLikersQuery,
  useReplyToDiscussionMutation,
} from 'store/discussion-api-slice'
import PostCard, { PostCardReply } from 'components/PostCard'

interface DiscussionCardProps {
  discussion: Discussion
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  const [fetchReplies, { data: repliesData, isFetching: isLoadingReplies }] =
    useLazyFetchDiscussionRepliesQuery()
  const [fetchLikers, { data: likersData, isFetching: isFetchingLikers }] =
    useLazyFetchDiscussionLikersQuery()
  const [toggleDiscussionLike] = useToggleDiscussionLikeMutation()
  const [replyToDiscussion, { isLoading: isSubmittingReply }] =
    useReplyToDiscussionMutation()

  const replies = repliesData?.data ?? []

  const mappedReplies: PostCardReply[] = useMemo(
    () =>
      replies.map((reply) => ({
        id: reply.id,
        createdAt: new Date(reply.createdAt),
        user: reply.user,
        body: reply.body,
        isReactor: !!reply.isReactor,
        amountOfLikes: reply.amountOfLikes,
        isFetchingLikers,
        onLike: async (id: string) => {
          await toggleDiscussionLike({
            interestId: discussion.interestId,
            discussionId: id,
            parentId: discussion.id,
          }).unwrap()
        },
        onFetchLikers: () => {
          fetchLikers({
            interestId: discussion.interestId,
            discussionId: reply.id,
          })
        },
      })),
    [
      replies,
      isFetchingLikers,
      toggleDiscussionLike,
      discussion.interestId,
      discussion.id,
      fetchLikers,
    ]
  )

  return (
    <PostCard
      entity={{
        id: discussion.id,
        createdAt: new Date(discussion.createdAt),
        user: discussion.user,
      }}
      title={discussion.title}
      body={discussion.body}
      replyLabel="Reply"
      replyCount={discussion.amountOfReplies}
      likeCount={discussion.amountOfLikes}
      isReactor={!!discussion.isReactor}
      replies={mappedReplies}
      isLoadingReplies={isLoadingReplies}
      likers={likersData?.data || []}
      isFetchingLikers={isFetchingLikers}
      isSubmittingReply={isSubmittingReply}
      onLike={async (id) => {
        await toggleDiscussionLike({
          interestId: discussion.interestId,
          discussionId: id,
        }).unwrap()
      }}
      onFetchReplies={() => {
        fetchReplies({
          interestId: discussion.interestId,
          discussionId: discussion.id,
        })
      }}
      onFetchLikers={() => {
        fetchLikers({
          interestId: discussion.interestId,
          discussionId: discussion.id,
        })
      }}
      onSubmitReply={async ({ content, mentions }) => {
        await replyToDiscussion({
          interestId: discussion.interestId,
          discussionId: discussion.id,
          body: content,
          mentions,
        }).unwrap()
      }}
    />
  )
}

export default DiscussionCard
