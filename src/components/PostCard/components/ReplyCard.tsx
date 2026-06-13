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

interface Reply {
  id: string | number
  createdAt: Date
  user: User
  body: string
  isReactor?: boolean
  amountOfLikes: number
  interestId?: string | number
  parentId?: string | number
  handleLike: (id: string) => Promise<void>
  fetchLikers: () => void
}

const ReplyCard: React.FC<{ reply: Reply }> = ({ reply }) => {
  const navigation = useNavigation()
  const [isShowLikers, toggleShowLikers] = useToggle(false)
  const date = formatDate(new Date(reply.createdAt), 'MMM dd, yyyy')

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
      <ProfAvatar user={reply.user} size={28} subtitle={date} />
      <MentionText
        style={tw`text-gray-600 dark:text-gray-400 text-sm mt-2 leading-5`}
        onMentionPress={handleNavigateToProfile}
      >
        {reply.body}
      </MentionText>
      <LikeForm
        id={reply.id.toString()}
        isReactor={!!reply.isReactor}
        likersCount={reply.amountOfLikes}
        flexDir="row"
        size={15}
        onLike={reply.handleLike}
        onToggleLikers={() => {
          toggleShowLikers()
          reply.fetchLikers()
        }}
      />

      {isShowLikers && (
        <LikerPopover
          visible={isShowLikers}
          onDismiss={toggleShowLikers}
          likers={[]}
          isFetching={false}
          onRefetch={reply.fetchLikers}
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
}

export default memo(ReplyCard)
