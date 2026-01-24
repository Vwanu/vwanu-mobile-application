import React from 'react'
import { View } from 'react-native'
import { format } from 'date-fns'

import { Message } from '../../../../types'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface ChatBubbleProps extends Message {
  isMessageFromCurrentUser: boolean
}

const MessageStatus: React.FC<ChatBubbleProps> = ({
  readDate,
  receivedDate,
}) => {
  const calculateStatus = (): 'sent' | 'delivered' | 'read' => {
    if (readDate) return 'read'
    else if (receivedDate) return 'delivered'
    else return 'sent'
  }
  const status = calculateStatus()
  const statusStyle =
    status === 'sent'
      ? tw`text-gray-500`
      : status === 'delivered'
      ? tw`text-blue-500`
      : status === 'read'
      ? tw`text-green-500`
      : tw`text-gray-500`

  let statusText = ''
  switch (status) {
    case 'sent':
      statusText = 'Sent'
      break
    case 'delivered':
      statusText = 'Delivered'
      break
    case 'read':
      statusText = 'Read'
      break
    default:
      statusText = ''
  }

  return <Text style={statusStyle}>{statusText}</Text>
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
      <View style={tw`flex flex-row justify-between mt-1`}>
        {message.isMessageFromCurrentUser ? (
          <MessageStatus {...message} />
        ) : (
          <View />
        )}
        <Text category="c1" appearance="hint" style={tw`text-right font-bold`}>
          {format(message.createdAt, 'p')}
        </Text>
      </View>
    </View>
  )
}

export default ChatBubble
