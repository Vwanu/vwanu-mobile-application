import React, { useState, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Input from 'components/Input'
import Screen from 'components/screen'
import ProfAvatar from 'components/ProfAvatar'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import Conversation from './components/Conversation'
import { ChatStackParams, User } from '../../../types'
import { useFetchFriendsQuery } from 'store/friends-api-slice'
import {
  useFetchConversationsQuery,
  useCreateDirectConversationMutation,
} from 'store/conversation-api-slice'
import sortBy from 'lodash/sortBy'

type ChatScreenNavigationProp = StackNavigationProp<ChatStackParams, 'Chat'>

// Chat filter tabs
const CHAT_TABS: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
]

const Chat: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>()
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading, isFetching, refetch } = useFetchConversationsQuery()
  const { data: profilesData, isLoading: isLoadingProfiles } =
    useFetchFriendsQuery(
      {
        search: searchQuery,
      },
      {
        skip: !searchQuery.length,
      }
    )
  const [localSearchFilter, setLocalSearchFilter] = useState('')

  const [createDirectConversation, createdConversationResult] =
    useCreateDirectConversationMutation()
  const [activeTab, setActiveTab] = useState('all')

  const conversations = data?.data || []
  // Compute filtered conversations based on tab and search filter
  const filteredConversations = useMemo(() => {
    let result = conversations

    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        result = result.filter((c) => c.amountOfUnreadMessages > 0)
        break
      case 'groups':
        result = result.filter((c) => c.type === 'group')
        break
    }

    // Apply local search filter
    if (localSearchFilter) {
      result = result.filter((conversation) =>
        conversation.users.some((user) => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
          return fullName.includes(localSearchFilter.toLowerCase())
        })
      )
    }

    return result
  }, [conversations, activeTab, localSearchFilter])

  const handleConversationPress = (
    user: Partial<User>,
    conversationId: string
  ) => {
    navigation.navigate('Message', {
      conversationId,
      user,
    })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleSearchConversation = (text: string) => {
    setLocalSearchFilter(text)

    // If no local matches found after filtering, trigger API search for friends
    const localMatches = conversations.filter((conversation) =>
      conversation.users.some((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return fullName.includes(text.toLowerCase())
      })
    )

    if (localMatches.length === 0 && text.length > 0) {
      setSearchQuery(text) // Triggers friend search API
    } else {
      setSearchQuery('') // Clear friend search
    }
  }
  return (
    <Screen
      loading={isLoading || createdConversationResult.isLoading}
      error={
        createdConversationResult.isError
          ? (createdConversationResult.error as any).data.error
          : undefined
      }
    >
      <View style={tw`bg-white p-2`}>
        <Text style={tw`mb-2 text-lg font-bold`}>Conversation</Text>
        <Input
          placeholder="Search"
          iconLeft={<Ionicons name="search" size={24} color="black" />}
          onChangeText={handleSearchConversation}
        />
      </View>

      <TabBar
        tabs={CHAT_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {profilesData?.data && searchQuery.length > 0 && (
        <View style={tw`bg-white p-2 border-b border-gray-200`}>
          {profilesData.data.length === 0 ? (
            <Text style={tw`text-gray-500`}>No users found</Text>
          ) : (
            profilesData.data.map((user: User) => (
              <TouchableOpacity
                key={user.id}
                style={tw`py-2`}
                onPress={async () => {
                  setSearchQuery('')
                  setLocalSearchFilter('')
                  const convo = await createDirectConversation({
                    userId: user.id,
                  })

                  if ('error' in convo || !convo.data) return
                  handleConversationPress(user, convo.data.id)
                }}
              >
                <ProfAvatar user={user} disableDefaultNavigation />
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <View style={tw`bg-white p-2 flex-1`}>
        {filteredConversations.length === 0 ? (
          <View style={tw`flex-1 items-center justify-center py-10`}>
            <Ionicons
              name="chatbubbles-outline"
              size={48}
              color={tw.color('text-gray-400')}
            />
            <Text style={tw`text-gray-500 mt-2`}>
              {activeTab === 'groups' ? 'No group chats yet' : 'No messages'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
              <View style={tw`my-2 bg-gray-200 w-full h-[1px]`} />
            )}
            renderItem={({ item }) => {
              return <Conversation conversation={item} />
            }}
          />
        )}
      </View>
    </Screen>
  )
}

export default Chat
