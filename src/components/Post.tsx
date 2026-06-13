import React, { memo } from 'react'

import tw from '../lib/tailwind'
import ImageGrid from './ImageGrid'
import { PostProps } from '../../types'
import PostCard, { PostCardReply } from './PostCard'
import {
  useToggleKoreMutation,
  useLazyFetchPostLikersQuery,
  useLazyFetchPostsQuery,
  useCreatePostMutation,
} from 'store/post'
import { useNavigation } from '@react-navigation/native'
interface Props extends PostProps {
  showViewComment?: boolean
  disableNavigation?: boolean
  toggleCommenting: () => void
}
const Post: React.FC<Props> = (props) => {
  const [toggleKore, {}] = useToggleKoreMutation()
  const navigation = useNavigation()

  const [
    fetchLikers,
    { isLoading: isLoadingLikers, isFetching: isFetchingLikers },
  ] = useLazyFetchPostLikersQuery()

  const [
    fetchComments,
    {
      data: comments = { data: [] },
      isLoading: isLoadingComments,
      isFetching: isFetchingComments,
    },
  ] = useLazyFetchPostsQuery()

  const mappedReplies: PostCardReply[] = (comments.data || []).map((reply) => ({
    ...reply,
    amountOfLikes: reply.amountOfKorems,
    isFetchingLikers: false,
    onLike: async (id: string) => {
      await toggleKore(id)
    },
    onFetchLikers: () => {
      fetchLikers({ postId: reply.id.toString() })
    },
  }))

  const onLikePress = async (id: string) => {
    await toggleKore(id)
  }
  const onfetchComments = async () => {
    console.log('fetching comments for post', props.id.toString())
    console.log({
      comments,
      isLoadingComments,
      isFetchingComments,
    })
    const resp = await fetchComments({ postId: props.id.toString() })
    console.log('fetching comments for post', props.id.toString(), 'done')
    console.log('comments for post', props.id.toString(), resp)
    console.log({
      comments,
      isLoadingComments,
      isFetchingComments,
    })
  }

  const onfetchLikers = () => {
    fetchLikers({ postId: props.id.toString() })
  }
  const [createPost, { isLoading: isSubmittingReply }] = useCreatePostMutation()
  const handleSubmitReply = async ({
    content,
    mentions,
  }: {
    content: string
    mentions: string[]
  }) => {
    await createPost({
      postText: content,
      mentions,
      postId: props.id.toString(),
    }).unwrap()
    onfetchComments()
  }
  return (
    <PostCard
      entity={{
        id: props.id,
        createdAt: props.createdAt,
        user: props.user,
      }}
      title={undefined}
      body={props.postText || ' '}
      isReactor={!!props.isReactor}
      replyCount={props.amountOfComments || 0}
      likeCount={props.amountOfKorems || 0}
      onLike={onLikePress}
      onFetchReplies={onfetchComments}
      replies={mappedReplies}
      isLoadingReplies={isLoadingComments || isFetchingComments}
      onFetchLikers={onfetchLikers}
      isFetchingLikers={isLoadingLikers || isFetchingLikers}
      isSubmittingReply={isSubmittingReply}
      onSubmitReply={handleSubmitReply}
    >
      {props?.media && props.media.length > 0 && (
        <ImageGrid
          medias={props.media}
          style={tw`w-100% mt-3 rounded-lg overflow-hidden`}
          onImageTouch={(index) => {
            // @ts-ignore
            navigation.navigate('Gallery', {
              ...props,
              initialSlide: index,
            })
          }}
        />
      )}
    </PostCard>
  )
}

const MemoizedPost = memo(Post, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.amountOfKorems === nextProps.amountOfKorems &&
    prevProps.amountOfComments === nextProps.amountOfComments &&
    prevProps.isReactor === nextProps.isReactor &&
    prevProps.postText === nextProps.postText &&
    prevProps.media?.length === nextProps.media?.length &&
    prevProps.createdAt === nextProps.createdAt
  )
})

MemoizedPost.displayName = 'Post'

export default MemoizedPost
