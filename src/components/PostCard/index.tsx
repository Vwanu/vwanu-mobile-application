import React from 'react'
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
  onToggleReplies: () => void
  onToggleReplyInput: () => void
  isExpanded: boolean
  showReplyInput?: boolean
  replyForm?: React.ReactNode
  likeform?: React.ReactNode
  isShowLikers?: boolean
  toggleShowLikers?: () => void
  children?: React.ReactNode
}

const PostCard: React.FC<PostCardProps> = ({
  entity,
  title,
  body,
  replyLabel = 'Reply',
  replyCount,
  likeCount,
  isReactor,
  replies,
  isLoadingReplies,
  likers,
  isFetchingLikers,
  onFetchReplies,
  onFetchLikers,
  onToggleReplies,
  onToggleReplyInput,
  isExpanded,
  showReplyInput,
  replyForm,
  likeform,
  isShowLikers,
  toggleShowLikers,
  children,
}) => {
  const navigation = useNavigation()
  const date = formatDate(new Date(entity.createdAt), 'MMM dd, yyyy')

  const handleToggleExpand = () => {
    if (!isExpanded) onFetchReplies()
    onToggleReplies()
  }

  return (
    <Card>
      <ProfAvatar user={entity.user} size={36} subtitle={date} />
      {title && <CardTitle title={title} />}

      <MentionText
        style={tw`font-poppins text-soft dark:text-gray-400 text-sm mt-1 leading-5`}
        numberOfLines={isExpanded ? undefined : 3}
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
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={tw.color('primary')}
                style={tw`ml-1`}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={tw`flex-row items-center`}
            onPress={onToggleReplyInput}
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

      {isShowLikers && toggleShowLikers && (
        <LikerPopover
          visible={!!isShowLikers}
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

      {isExpanded && isLoadingReplies && (
        <View style={tw`items-center py-4`}>
          <ActivityIndicator
            animating
            size="small"
            color={tw.color('primary')}
          />
        </View>
      )}
      {isExpanded &&
        !isLoadingReplies &&
        replies.map((reply) => (
          <ReplyCard key={reply.id.toString()} reply={reply} />
        ))}
    </Card>
  )
}

export default PostCard
export type { PostCardReply } from './components/ReplyCard'
