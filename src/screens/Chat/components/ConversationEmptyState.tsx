import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import EmptyList from 'components/EmptyList'

import { User } from '../../../../types'
import PeopleYouKnowRow from './PeopleYouKnowRow'

interface Props {
  onNewMessage?: () => void
  onSelectFriend: (user: User) => void
}

const ConversationEmptyState: React.FC<Props> = ({
  onNewMessage,
  onSelectFriend,
}) => {
  return (
    <View style={tw`flex-1 pt-4`}>
      <EmptyList
        icon="chatbubbles-outline"
        title="No messages yet"
        subtitle="Start a conversation with people you know."
        actionBtn={{
          label: 'New message',
          icon: 'create-outline',
          onPress: () => onNewMessage?.(),
        }}
      />
      <PeopleYouKnowRow onSelect={onSelectFriend} />
    </View>
  )
}

export default ConversationEmptyState
