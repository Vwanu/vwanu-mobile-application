import React, { memo } from 'react'
import { View } from 'react-native'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LikeForm from 'components/LikeForm'
import ProfAvatar from 'components/ProfAvatar'
import { Discussion } from '../../../../types'
import { useToggleDiscussionLikeMutation } from 'store/discussion-api-slice'

const ReplyCard: React.FC<{ reply: Discussion }> = ({ reply }) => {
  const date = formatDate(new Date(reply.createdAt), 'MMM dd, yyyy')

  const [toggleDiscussionLike] = useToggleDiscussionLikeMutation()
  const handleLike = async (_id: string) => {
    await toggleDiscussionLike({
      interestId: reply.interestId,
      discussionId: reply.id,
      parentId: reply.parentId,
    }).unwrap()
  }

  return (
    <View
      style={tw`ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700`}
    >
      <ProfAvatar user={reply.user} size={28} subtitle={date} />
      <Text style={tw`text-gray-600 dark:text-gray-400 text-sm mt-2 leading-5`}>
        {reply.body}
      </Text>
      <LikeForm
        id={reply.id}
        isReactor={!!reply.isReactor}
        likersCount={reply.amountOfLikes}
        flexDir="row"
        size={15}
        onLike={handleLike}
      />
    </View>
  )
  {
    /* <TouchableOpacity
        style={tw`flex-row items-center mt-2`}
        onPress={toggleLike}
        activeOpacity={0.7}
      >
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={14}
          color={liked ? '#EF4444' : tw.color('gray-400')}
        />
        <Text
          style={tw`text-xs ${liked ? 'text-red-500' : 'text-gray-400'} ml-1`}
        >
          {likes}
        </Text>
      </TouchableOpacity> */
  }
  // </View>
  //   )
}

export default memo(ReplyCard)
