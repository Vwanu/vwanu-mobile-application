import React from 'react'
import { View } from 'react-native'
import { format } from 'date-fns'

import { Message } from '../../../../types'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface ChatBubbleProps extends Message {
  isMessageFromCurrentUser: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = (message) => {
  const containerStyle = message.isMessageFromCurrentUser
    ? tw`bg-gray-200 p-[10px] w-[80%] self-start rounded-lg mb-2`
    : tw`bg-primary p-[10px] w-[80%] self-end rounded-lg mb-2`

  const textStyle = message.isMessageFromCurrentUser
    ? tw`text-black font-semibold text-md`
    : tw`text-white font-semibold text-md`

  return (
    <View style={containerStyle}>
      <Text category="p1" style={textStyle}>
        {message.messageText}
      </Text>
      <Text category="c1" appearance="hint" style={tw`text-right font-bold`}>
        {format(message.createdAt, 'p')}
      </Text>
    </View>
  )
}

export default ChatBubble
