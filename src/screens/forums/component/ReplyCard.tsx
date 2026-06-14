import React, { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import MentionText from 'components/MentionText'
import LikeForm from 'components/LikeForm'
import ProfAvatar from 'components/ProfAvatar'

import useToggle from 'hooks/useToggle'
import LikerPopover from 'components/LikersPopOver'
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
  handleLike: () => void
  fetchReplies: () => void
  fetchLikers: () => void
  replies: PostCardProps[]
  isLoadingReplies: boolean
  amountOfReplies: number
  isReactor: boolean
  amountOfLikes: number
  children?: React.ReactNode
  likers: User[]
  isFetchingLikers: boolean
}

const ReplyCard: React.FC<{ reply: PostCardProps }> = ({ reply }) => {
  const navigation = useNavigation()
  const [isShowLikers, toggleShowLikers] = useToggle(false)
  const date = formatDate(new Date(reply.post.createdAt), 'MMM dd, yyyy')

  const handleLike = async (_id: string) => {
    reply.handleLike()
  }
  const handleNavigateToProfile = (id: string) => {
    // navigate to user profile
    // @ts-ignore
    navigation.navigate(routes.ACCOUNT, {
      screen: routes.PROFILE,
      params: { profileId: id },
    })
  }

  return (
    <View
      style={tw`ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700`}
    >
      <ProfAvatar user={reply.post.user} size={28} subtitle={date} />
      <MentionText
        style={tw`text-gray-600 dark:text-gray-400 text-sm mt-2 leading-5`}
        onMentionPress={handleNavigateToProfile}
      >
        {reply.body}
      </MentionText>
      <LikeForm
        id={reply.post.id.toString()}
        isReactor={!!reply.isReactor}
        likersCount={reply.amountOfLikes}
        flexDir="row"
        size={15}
        onLike={handleLike}
        onToggleLikers={() => {
          toggleShowLikers()
          reply.fetchLikers()
        }}
      />

      {isShowLikers && (
        <LikerPopover
          visible={isShowLikers}
          onDismiss={toggleShowLikers}
          likers={reply.likers || []}
          isFetching={reply.isFetchingLikers}
          onRefetch={() => {
            reply.fetchLikers()
          }}
          anchorContent={
            <TouchableOpacity onPress={toggleShowLikers}>
              <Text style={tw`text-xs text-primary`}>
                {reply.amountOfLikes}{' '}
                {reply.amountOfLikes === 1 ? 'like' : 'likes'}
              </Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  )
  {
  }
}

export default memo(ReplyCard)
