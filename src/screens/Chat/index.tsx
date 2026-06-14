import React from 'react'
import { View, FlatList } from 'react-native'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import ScreenHeader from 'components/ScreenHeader'
import SearchBar from 'components/SearchBar'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'

import { useFetchConversationsQuery } from 'store/conversation-api-slice'

import Conversation from './components/Conversation'
import ComposeButton from './components/ComposeButton'
import FriendSearchResults from './components/FriendSearchResults'
import ConversationEmptyState from './components/ConversationEmptyState'

import { useConversationSearch } from './hooks/useConversationSearch'
import { useConversationFilters } from './hooks/useConversationFilters'
import { useStartDirectConversation } from './hooks/useStartDirectConversation'

const CHAT_TABS: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
]

const Chat: React.FC = () => {
  const { data, isLoading, refetch } = useFetchConversationsQuery()
  const conversations = data?.data || []

  const { searchQuery, localSearchFilter, handleSearchChange, resetSearch } =
    useConversationSearch(conversations)

  const { activeTab, setActiveTab, filteredConversations } =
    useConversationFilters(conversations, localSearchFilter)

  const {
    startWithUser,
    isLoading: isCreating,
    isError,
    error,
  } = useStartDirectConversation({ onSuccess: resetSearch })

  return (
    <Screen
      loading={isLoading || isCreating}
      error={isError ? (error as any)?.data?.error : undefined}
    >
      <View style={tw`flex-1 bg-warm-bg`}>
        <ScreenHeader
          title="Conversation"
          subtitle="Direct messages"
          rightAction={
            <ComposeButton
              onPress={() => {
                /* TODO */
              }}
            />
          }
        />

        <SearchBar
          onSearchChange={handleSearchChange}
          placeholder="Search conversations"
        />

        <TabBar
          fullWidth
          tabs={CHAT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={tw`mb-2 border-b border-warm-border border-b-2`}
        />

        <FriendSearchResults
          searchQuery={searchQuery}
          onSelect={startWithUser}
        />

        <View style={tw`flex-1 px-2`}>
          {filteredConversations.length === 0 ? (
            <ConversationEmptyState onSelectFriend={startWithUser} />
          ) : (
            <FlatList
              data={filteredConversations}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    tw`h-px mx-2`,
                    { backgroundColor: colors.warmBorder },
                  ]}
                />
              )}
              renderItem={({ item }) => <Conversation conversation={item} />}
              onRefresh={refetch}
              refreshing={isLoading}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-6`}
            />
          )}
        </View>
      </View>
    </Screen>
  )
}

export default Chat
