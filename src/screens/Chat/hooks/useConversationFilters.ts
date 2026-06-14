import { useMemo, useState } from 'react'

import { Conversation } from '../../../../types'

export function useConversationFilters(
  conversations: Conversation[],
  localSearchFilter: string
) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredConversations = useMemo(() => {
    let result = conversations
    switch (activeTab) {
      case 'unread':
        result = result.filter((c) => c.amountOfUnreadMessages > 0)
        break
      case 'groups':
        result = result.filter((c) => c.type === 'group')
        break
    }
    if (localSearchFilter) {
      const term = localSearchFilter.toLowerCase()
      result = result.filter((conversation) =>
        conversation.users.some((user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
        )
      )
    }
    return result
  }, [conversations, activeTab, localSearchFilter])

  return { activeTab, setActiveTab, filteredConversations }
}
