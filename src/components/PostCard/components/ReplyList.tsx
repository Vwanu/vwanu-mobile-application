import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import { Discussion } from '../../../../types'

import ReplyCard from './ReplyCard'

const ReplyList: React.FC<{ replies: Discussion[] }> = ({ replies }) => {
  return (
    <View
      style={tw`ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700`}
    >
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={
            {
              ...reply,
              handleLike: async () => {},
              fetchLikers: () => {},
            } as any
          }
        />
      ))}
    </View>
  )
}

export default ReplyList
