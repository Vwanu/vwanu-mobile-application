import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Input from 'components/Input'
import Screen from 'components/screen'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { useFetchProfilesQuery } from 'store/profiles'
import { ChatStackParams, User } from '../../../types'
import Conversation from './components/Conversation'
import {
  useFetchConversationsQuery,
  useCreateDirectConversationMutation,
} from 'store/conversation-api-slice'

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
    useFetchProfilesQuery(
      {
        search: searchQuery,
      },
      {
        skip: !searchQuery.length,
      }
    )

  const [createDirectConversation, { isLoading: isCreatingConversation }] =
    useCreateDirectConversationMutation()
  const [activeTab, setActiveTab] = useState('all')

  const conversations = data?.data || []
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

  // Mock filtering based on tab selection
  const getFilteredConversations = () => {
    switch (activeTab) {
      case 'unread':
        // Filter conversations with unread messages
        return conversations.filter((c) => c.amountOfUnreadMessages > 0)
      case 'groups':
        // Filter group conversations
        return conversations.filter((c) => c.type === 'group')
      case 'all':
      default:
        return conversations
    }
  }

  const filteredConversations = getFilteredConversations()
  console.log('Filtered Conversations:', filteredConversations)

  return (
    <Screen loading={isLoading || isCreatingConversation}>
      <View style={tw`bg-white p-2`}>
        <Text style={tw`mb-2 text-lg font-bold`}>Conversation</Text>
        <Input
          placeholder="Search"
          iconLeft={<Ionicons name="search" size={24} color="black" />}
          onChangeText={(text) => setSearchQuery(text)}
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
                  try {
                    const conversation = await createDirectConversation({
                      userId: user.id,
                    })
                    console.log('Created conversation:', conversation)
                    // @ts-ignore
                    handleConversationPress(user, conversation?.data?.id)
                  } catch (error) {}
                }}
              >
                <Text
                  style={tw`text-blue-500`}
                >{`${user.firstName} ${user.lastName}`}</Text>
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
