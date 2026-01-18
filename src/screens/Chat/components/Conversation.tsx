import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import ProfAvatar from 'components/ProfAvatar'
import {
  Conversation as ConversationType,
  ChatStackParams,
} from '../../../../types'
import { useSelector } from 'react-redux'

interface ConversationProps {
  conversation: ConversationType
}

type ChatScreenNavigationProp = StackNavigationProp<ChatStackParams, 'Chat'>

const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
  const navigation = useNavigation<ChatScreenNavigationProp>()
  const { userId } = useSelector((state: RootState) => state.auth)
  const { lastMessage, amountOfUnreadMessages, type } = conversation
  const isGroup = type === 'group'
  const hasUnread = amountOfUnreadMessages > 0
  const getOtherUser = isGroup
    ? conversation.users[0]
    : conversation.users.find((u) => u.id !== userId)

  const handleConversationPress = (
    user: Partial<User>,
    conversationId: string
  ) => {
    navigation.navigate('Message', {
      conversationId,
      user,
    })
  }

  return (
    <TouchableOpacity
      onPress={() =>
        handleConversationPress(
          isGroup ? {} : getOtherUser || {},
          conversation.id.toString()
        )
      }
      activeOpacity={0.7}
      style={tw`flex-row items-center justify-between py-3 px-2 ${
        hasUnread ? 'bg-blue-50' : ''
      }`}
    >
      <ProfAvatar
        user={isGroup ? ({} as User) : (getOtherUser as User)}
        size={40}
        subtitle={lastMessage?.messageText ?? ''}
        disableDefaultNavigation
      />

      <View style={tw`items-end`}>
        {lastMessage && (
          <Text
            appearance="hint"
            category="c1"
            style={tw`text-xs ${hasUnread ? 'text-primary' : 'text-gray-400'}`}
          >
            {formatDistanceToNowStrict(new Date(lastMessage?.createdAt), {
              addSuffix: false,
            })}
          </Text>
        )}
        {hasUnread && (
          <View
            style={tw`bg-primary rounded-full min-w-[20px] h-5 items-center justify-center mt-1 px-1.5`}
          >
            <Text style={tw`text-white text-xs font-bold`}>
              {amountOfUnreadMessages > 9 ? '9+' : amountOfUnreadMessages}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Conversation
