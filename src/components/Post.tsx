import React, { memo } from 'react'

import tw from '../lib/tailwind'
import ImageGrid from './ImageGrid'
import { PostProps } from '../../types'
import PostCard from './PostCard'
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

  const onLikePress = async () => {
    await toggleKore(props.id.toString())
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
      post={props}
      body={props.postText || ' '} // Map postText to body for PostCard
      isReactor={true}
      amountOfReplies={props.amountOfComments || 0}
      amountOfLikes={props.amountOfKorems || 0}
      handleLike={onLikePress}
      fetchReplies={onfetchComments}
      replies={comments.data || []}
      isLoadingReplies={isLoadingComments || isFetchingComments}
      fetchLikers={onfetchLikers}
      isFetchingLikers={isLoadingLikers || isFetchingLikers}
      isSubmittingReply={isSubmittingReply}
      onSubmitingReply={handleSubmitReply}
    >
      {props?.media && props.media.length > 0 && (
        <ImageGrid
          medias={props.media}
          style={tw`w-100% mt-3 rounded-lg overflow-hidden`}
          onImageTouch={(index) => {
            navigation.navigate('Gallery', {
              initialIndex: index,
            })
          }} // calculate the index of the touched image and pass it to the image viewer
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
