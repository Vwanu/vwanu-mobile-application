import React, { memo, useState } from 'react'
import tw from '../lib/tailwind'
import ImageGrid from './ImageGrid'
import { PostProps } from '../../types'
import PostCard, { PostCardReply } from './PostCard'
import {
  useToggleKoreMutation,
  useLazyFetchPostLikersQuery,
  useLazyFetchPostsQuery,
} from 'store/post'
import { useNavigation } from '@react-navigation/native'
import CommentForm from './CommentForm'
import LikeForm from 'components/LikeForm'
import useToggle from 'hooks/useToggle'
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
    id: reply.id,
    createdAt: reply.createdAt,
    user: reply.user,
    body: reply.postText || ' ',
    isReactor: !!reply.isReactor,
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
  const [isShowLikers, toggleShowLikers] = useToggle(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <PostCard
      entity={{
        id: props.id,
        createdAt: props.createdAt,
        user: props.user,
      }}
      isExpanded={isExpanded}
      onToggleReplies={() => {
        setIsExpanded((prev) => !prev)
        if (!isExpanded) onfetchComments()
      }}
      onToggleReplyInput={() => setShowReplyInput((prev) => !prev)}
      showReplyInput={showReplyInput}
      isShowLikers={isShowLikers}
      toggleShowLikers={toggleShowLikers}
      title={undefined}
      body={props.postText || ' '}
      isReactor={!!props.isReactor}
      replyCount={props.amountOfComments || 0}
      likeCount={props.amountOfKorems || 0}
      onFetchReplies={onfetchComments}
      replies={mappedReplies}
      isLoadingReplies={isLoadingComments || isFetchingComments}
      onFetchLikers={onfetchLikers}
      isFetchingLikers={isLoadingLikers || isFetchingLikers}
      replyLabel="Comment"
      replyForm={
        <CommentForm
          postId={props.id.toString()}
          onSubmit={() => setShowReplyInput(false)}
        />
      }
      likeForm={
        <LikeForm
          id={props.id.toString()}
          isReactor={!!props.isReactor}
          likersCount={props.amountOfKorems || 0}
          flexDir="row"
          size={15}
          onLike={onLikePress}
          onToggleLikers={() => {
            toggleShowLikers()
          }}
        />
      }
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
