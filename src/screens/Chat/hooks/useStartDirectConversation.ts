import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { useCreateDirectConversationMutation } from 'store/conversation-api-slice'
import { ChatStackParams, User } from '../../../../types'

type Nav = StackNavigationProp<ChatStackParams, 'Chat'>

interface Args {
  onSuccess?: () => void
}

export function useStartDirectConversation({ onSuccess }: Args = {}) {
  const navigation = useNavigation<Nav>()
  const [createDirectConversation, { isLoading, isError, error }] =
    useCreateDirectConversationMutation()

  const startWithUser = async (user: User) => {
    const convo = await createDirectConversation({ userId: user.id })
    if ('error' in convo || !convo.data) return
    onSuccess?.()
    navigation.navigate('Message', {
      conversationId: convo.data.id,
      user,
    })
  }

  return { startWithUser, isLoading, isError, error }
}
