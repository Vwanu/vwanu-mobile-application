import React, { useState } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import { Discussion } from '../../../../types'
import ReplyCard from './ReplyCard'
import ReplyForm from './ReplyForm'
import LikeForm from 'components/LikeForm'
import {
  useLazyFetchDiscussionRepliesQuery,
  useToggleDiscussionLikeMutation,
  useLazyFetchDiscussionLikersQuery,
} from 'store/discussion-api-slice'
import LikerPopover from 'components/LikersPopOver'
import useToggle from 'hooks/useToggle'

interface DiscussionCardProps {
  discussion: Discussion
}
const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  const [expanded, setExpanded] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const date = formatDate(new Date(discussion.createdAt), 'MMM dd, yyyy')
  const replyCount = discussion.amountOfReplies
  const [isShowLikers, toggleShowLikers] = useToggle(false)

  const [fetchReplies, { data: repliesData, isFetching: isLoadingReplies }] =
    useLazyFetchDiscussionRepliesQuery()
  const [fetchLikers, { data: likersData, isFetching: isFetchingLikers }] =
    useLazyFetchDiscussionLikersQuery()
  const [toggleDiscussionLike] = useToggleDiscussionLikeMutation()

  const handleLike = async (_id: string) => {
    await toggleDiscussionLike({
      interestId: discussion.interestId,
      discussionId: discussion.id,
    }).unwrap()
  }

  const replies = repliesData?.data ?? []

  const handleToggleExpand = () => {
    const willExpand = !expanded
    setExpanded(willExpand)
    if (willExpand) {
      fetchReplies({
        interestId: discussion.interestId,
        discussionId: discussion.id,
      })
    }
  }

  return (
    <View
      style={[
        tw`bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl p-4`,
        cardShadow,
      ]}
    >
      <ProfAvatar user={discussion.user} size={36} subtitle={date} />
      <Text style={tw`font-bold text-gray-900 dark:text-white text-base mt-3`}>
        {discussion.title}
      </Text>
      <Text
        style={tw`text-gray-600 dark:text-gray-400 text-sm mt-1 leading-5`}
        numberOfLines={expanded ? undefined : 3}
      >
        {discussion.body}
      </Text>

      {/* Likes, replies count, and reply button */}
      <View style={tw`flex-row items-center mt-3 gap-4`}>
        <LikeForm
          id={discussion.id}
          isReactor={!!discussion.isReactor}
          likersCount={discussion.amountOfLikes || 0}
          flexDir="row"
          size={15}
          onLike={handleLike}
          onToggleLikers={() => {
            toggleShowLikers()
            fetchLikers({
              interestId: discussion.interestId,
              discussionId: discussion.id,
            })
          }}
        />
        {isShowLikers && (
          <LikerPopover
            visible={isShowLikers}
            onDismiss={toggleShowLikers}
            likers={likersData?.data || []}
            isFetching={isFetchingLikers}
            onRefetch={() => {
              fetchLikers({
                interestId: discussion.interestId,
                discussionId: discussion.id,
              })
            }}
            anchorContent={
              <TouchableOpacity onPress={toggleShowLikers}>
                <Text style={tw`text-xs text-primary`}>
                  {discussion.amountOfLikes}{' '}
                  {discussion.amountOfLikes === 1 ? 'like' : 'likes'}
                </Text>
              </TouchableOpacity>
            }
          />
        )}
        {replyCount > 0 && (
          <TouchableOpacity
            style={tw`flex-row items-center`}
            onPress={handleToggleExpand}
          >
            <Ionicons
              name="chatbubble-outline"
              size={15}
              color={tw.color('primary')}
            />
            <Text style={tw`text-xs text-primary ml-1`}>
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
            color={tw.color('gray-500')}
          />
          <Text style={tw`text-xs text-gray-500 ml-1`}>Reply</Text>
        </TouchableOpacity>
      </View>

      {/* Inline reply input */}
      {showReplyInput && (
        <ReplyForm
          onClose={() => setShowReplyInput(false)}
          discussionId={discussion.id}
          interestId={discussion.interestId}
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
        replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)}
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
export default DiscussionCard
