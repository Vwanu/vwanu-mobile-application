import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import { DiscussionReply } from '../../../../types'

import ReplyCard, { PostCardReply } from './ReplyCard'

const ReplyList: React.FC<{ replies: DiscussionReply[] }> = ({ replies }) => {
  return (
    <View
      style={tw`ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700`}
    >
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={
            {
              id: reply.id,
              createdAt: new Date(reply.createdAt),
              user: reply.user,
              body: reply.body,
              amountOfLikes: reply.amountOfLikes,
              isFetchingLikers: false,
              onLike: async () => {},
              onFetchLikers: () => {},
            } satisfies PostCardReply
          }
        />
      ))}
    </View>
  )
}

export default ReplyList
