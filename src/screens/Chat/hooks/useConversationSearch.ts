import { useState } from 'react'

import { Conversation } from '../../../../types'

export function useConversationSearch(conversations: Conversation[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [localSearchFilter, setLocalSearchFilter] = useState('')

  const handleSearchChange = (text: string) => {
    setLocalSearchFilter(text)
    if (text.length === 0) {
      setSearchQuery('')
      return
    }
    const term = text.toLowerCase()
    const hasLocalMatch = conversations.some((conversation) =>
      conversation.users.some((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
      )
    )
    setSearchQuery(hasLocalMatch ? '' : text)
  }

  const resetSearch = () => {
    setSearchQuery('')
    setLocalSearchFilter('')
  }

  return {
    searchQuery,
    localSearchFilter,
    handleSearchChange,
    resetSearch,
  }
}
