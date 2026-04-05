import React, { memo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { formatDate } from 'date-fns'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LikeForm from 'components/LikeForm'
import ProfAvatar from 'components/ProfAvatar'
import { Discussion } from '../../../../types'
import {
  useLazyFetchDiscussionLikersQuery,
  useToggleDiscussionLikeMutation,
} from 'store/discussion-api-slice'
import useToggle from 'hooks/useToggle'
import LikerPopover from 'components/LikersPopOver'

const ReplyCard: React.FC<{ reply: Discussion }> = ({ reply }) => {
  const [isShowLikers, toggleShowLikers] = useToggle(false)
  const date = formatDate(new Date(reply.createdAt), 'MMM dd, yyyy')

  const [toggleDiscussionLike] = useToggleDiscussionLikeMutation()

  const [fetchLikers, { data: likersData, isFetching: isFetchingLikers }] =
    useLazyFetchDiscussionLikersQuery()

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
        onToggleLikers={() => {
          toggleShowLikers()
          fetchLikers({
            interestId: reply.interestId,
            discussionId: reply.id,
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
              interestId: reply.interestId,
              discussionId: reply.id,
            })
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
