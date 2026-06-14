import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import MentionText from 'components/MentionText'
import ProfAvatar from 'components/ProfAvatar'
import LikerPopover from 'components/LikersPopOver'
import routes from 'navigation/routes'
import { useNavigation } from '@react-navigation/native'
import ReplyCard, { PostCardReply } from './components/ReplyCard'
import Card from 'components/Card'
import CardTitle from 'components/Cardtitle'

export interface PostCardEntity {
  id: string | number
  createdAt: Date
  user: User
}

export interface PostCardProps {
  entity: PostCardEntity
  title?: string
  body: string
  replyLabel?: string
  replyCount: number
  likeCount: number
  isReactor: boolean
  replies: PostCardReply[]
  isLoadingReplies: boolean
  likers?: Array<{ User: User; createdAt: Date }>
  isFetchingLikers: boolean
  onFetchReplies: () => void
  onFetchLikers: () => void
  children?: React.ReactNode
  replyForm?: React.ReactNode
  likeform?: React.ReactNode
  isShowLikers?: boolean
  toggleShowLikers?: () => void
  showReplyInput?: boolean
  setShowReplyInput?: (show: boolean) => void
}

const PostCard: React.FC<PostCardProps> = ({
  entity,
  title,
  body,
  replyLabel = 'Reply',
  replyCount,
  likeCount,
  replies,
  isLoadingReplies,
  likers,
  isFetchingLikers,
  onFetchReplies,
  onFetchLikers,
  children,
  replyForm,
  likeform,
  isShowLikers,
  toggleShowLikers,
  showReplyInput,
  setShowReplyInput,
}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(false)

  const date = formatDate(new Date(entity.createdAt), 'MMM dd, yyyy')

  const handleToggleExpand = () => {
    const willExpand = !expanded
    setExpanded(willExpand)
    if (willExpand) onFetchReplies()
  }

  return (
    <Card>
      <ProfAvatar user={entity.user} size={36} subtitle={date} />
      {title && <CardTitle title={title} />}

      {/* Body */}
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

      {/* Footer */}

      <View style={tw`flex-row justify-between items-center mt-3 gap-4`}>
        <View style={tw`flex-row items-center gap-3`}>
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
            onPress={() => setShowReplyInput?.(!showReplyInput)}
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
              {replyLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {likeform}
      </View>

      {isShowLikers && (
        <LikerPopover
          visible={isShowLikers}
          onDismiss={toggleShowLikers}
          likers={likers || []}
          isFetching={isFetchingLikers}
          onRefetch={onFetchLikers}
          anchorContent={
            <TouchableOpacity onPress={toggleShowLikers}>
              <Text style={tw`font-poppins-medium text-xs text-primary`}>
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </Text>
            </TouchableOpacity>
          }
        />
      )}

      {showReplyInput && (replyForm ? replyForm : null)}

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
        replies.map((reply) => (
          <ReplyCard key={reply.id.toString()} reply={reply} />
        ))}
    </Card>
  )
}

export default PostCard
export type { PostCardReply } from './components/ReplyCard'
