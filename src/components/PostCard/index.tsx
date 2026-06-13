import React, { useState } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import MentionText from 'components/MentionText'
import ProfAvatar from 'components/ProfAvatar'
import ReplyCard from './components/ReplyCard'
import ReplyForm from './components/ReplyForm'
import LikeForm from 'components/LikeForm'

import LikerPopover from 'components/LikersPopOver'
import useToggle from 'hooks/useToggle'
import routes from 'navigation/routes'
import { useNavigation } from '@react-navigation/native'

interface Post {
  id: string | number
  createdAt: Date
  user: User
}

interface PostCardProps {
  post: Post
  title?: string
  body: string
  handleLike: (id: string) => Promise<void>
  fetchReplies: () => void
  fetchLikers: () => void
  replies: PostCardProps[]
  isLoadingReplies: boolean
  amountOfReplies: number
  isReactor: boolean
  amountOfLikes: number
  children?: React.ReactNode
  likers?: Array<{ User: User; createdAt: Date }>
  isFetchingLikers: boolean
  isSubmittingReply: boolean
  onSubmitingReply: ({
    content,
    mentions,
  }: {
    content: string
    mentions: string[]
  }) => void
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  amountOfReplies,
  amountOfLikes,
  title,
  isReactor,
  body,
  children,
  handleLike,
  fetchReplies,
  replies,
  fetchLikers,
  isFetchingLikers = false,
  isLoadingReplies = false,
  likers,
  onSubmitingReply,
  isSubmittingReply,
}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const date = formatDate(new Date(post.createdAt), 'MMM dd, yyyy')
  const replyCount = amountOfReplies
  const [isShowLikers, toggleShowLikers] = useToggle(false)

  const responseToPost = replies.map((reply) => ({
    ...reply,
    // @ts-ignore
    body: reply!.postText || ' ',
  })) // Map postText to body for ReplyCard

  console.log('rendering PostCard', [replies])

  const handleToggleExpand = () => {
    const willExpand = !expanded
    setExpanded(willExpand)
    if (willExpand) {
      fetchReplies()
    }
  }

  return (
    <View
      style={[
        tw`bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl p-4`,
        cardShadow,
      ]}
    >
      <ProfAvatar user={post.user} size={36} subtitle={date} />
      {title && (
        <Text
          style={tw`font-syne-bold text-ink dark:text-white text-base mt-3`}
        >
          {title}
        </Text>
      )}
      <MentionText
        style={tw`font-poppins text-soft dark:text-gray-400 text-sm mt-1 leading-5`}
        numberOfLines={expanded ? undefined : 3}
        onMentionPress={(id) => {
          // @ts-ignore
          navigation.navigate(routes.ACCOUNT, {
            screen: routes.PROFILE,
            params: { profileId: id },
          })
        }}
      >
        {body}
      </MentionText>
      <View style={tw`overflow-hidden rounded-lg mt-3`}>{children}</View>

      {/* Likes, replies count, and reply button */}
      <View style={tw`flex-row justify-between items-center mt-3 gap-4`}>
        <>
          {replyCount > 0 && (
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={handleToggleExpand}
            >
              <Ionicons
                name="chatbubble-outline"
                size={15}
                color={tw.color('primary-deep')}
              />
              <Text style={tw`font-poppins-medium text-xs text-primary ml-1`}>
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={tw.color('primary')}
                style={tw`ml-1`}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={tw`flex-row items-center`}
            onPress={() => setShowReplyInput((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={15}
              color={tw.color('primary-deep')}
            />
            <Text
              style={tw`font-poppins-medium text-xs text-primary-deep ml-1`}
            >
              Reply
            </Text>
          </TouchableOpacity>
        </>
        <>
          <LikeForm
            id={post.id.toString()}
            isReactor={!!isReactor}
            likersCount={amountOfLikes || 0}
            flexDir="row"
            size={15}
            onLike={handleLike}
            onToggleLikers={() => {
              toggleShowLikers()
              fetchLikers()
            }}
          />
          {isShowLikers && (
            <LikerPopover
              visible={isShowLikers}
              onDismiss={toggleShowLikers}
              likers={likers || []}
              isFetching={isFetchingLikers}
              onRefetch={() => {
                // fetchLikers({
                //   interestId: discussion.interestId,
                //   discussionId: discussion.id,
                // })
              }}
              anchorContent={
                <TouchableOpacity onPress={toggleShowLikers}>
                  <Text style={tw`font-poppins-medium text-xs text-primary`}>
                    {amountOfLikes} {amountOfLikes === 1 ? 'like' : 'likes'}
                  </Text>
                </TouchableOpacity>
              }
            />
          )}
        </>
      </View>

      {/* Inline reply input */}
      {showReplyInput && (
        <ReplyForm
          onClose={() => setShowReplyInput(false)}
          submitReply={onSubmitingReply}
          isSubmitting={isSubmittingReply}
        />
      )}

      {/* Expanded replies */}
      {expanded && isLoadingReplies && (
        <View style={tw`items-center py-4`}>
          <ActivityIndicator
            animating
            size="small"
            color={tw.color('primary')}
          />
        </View>
      )}
      {expanded &&
        !isLoadingReplies &&
        responseToPost.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
    </View>
  )
}

const cardShadow = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 3,
    },
  }),
}
export default PostCard
