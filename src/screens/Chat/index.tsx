import React, { useState, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useSelector } from 'react-redux'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import ScreenHeader from 'components/ScreenHeader'
import SearchBar from 'components/SearchBar'
import EmptyList from 'components/EmptyList'
import ProfAvatar from 'components/ProfAvatar'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'
import Conversation from './components/Conversation'
import { ChatStackParams, User } from '../../../types'
import { useFetchFriendsQuery } from 'store/friends-api-slice'
import {
  useFetchConversationsQuery,
  useCreateDirectConversationMutation,
} from 'store/conversation-api-slice'

type ChatScreenNavigationProp = StackNavigationProp<ChatStackParams, 'Chat'>

const CHAT_TABS: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
]

const Chat: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>()
  const { userId } = useSelector((state: RootState) => state.auth)

  const [searchQuery, setSearchQuery] = useState('')
  const [localSearchFilter, setLocalSearchFilter] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const { data, isLoading, refetch } = useFetchConversationsQuery()

  // Friends search (when user types and no local match)
  const { data: profilesData } = useFetchFriendsQuery(
    { userId: userId ?? '', search: searchQuery, status: 1 },
    { skip: !searchQuery.length || !userId }
  )

  // All friends for the "People you know" suggestions row (empty state)
  const { data: friendsData } = useFetchFriendsQuery(
    { userId: userId ?? '', status: 1 },
    { skip: !userId }
  )
  const friends = friendsData?.data || []

  const [createDirectConversation, createdConversationResult] =
    useCreateDirectConversationMutation()

  const conversations = data?.data || []

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
    navigation.navigate('Message', { conversationId, user })
  }

  const handleSearchConversation = (text: string) => {
    setLocalSearchFilter(text)
    const localMatches = conversations.filter((conversation) =>
      conversation.users.some((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return fullName.includes(text.toLowerCase())
      })
    )
    if (localMatches.length === 0 && text.length > 0) {
      setSearchQuery(text)
    } else {
      setSearchQuery('')
    }
  }

  const startDirectConversation = async (user: User) => {
    setSearchQuery('')
    setLocalSearchFilter('')
    const convo = await createDirectConversation({ userId: user.id })
    if ('error' in convo || !convo.data) return
    handleConversationPress(user, convo.data.id)
  }

  const renderEmptyState = () => (
    <View style={tw`flex-1 pt-4`}>
      <EmptyList
        icon="chatbubbles-outline"
        title="No messages yet"
        subtitle="Start a conversation with people you know."
        actionBtn={{
          label: 'New message',
          icon: 'create-outline',
          onPress: () => {
            // Placeholder: focus search / open compose flow
          },
        }}
      />

      {friends.length > 0 && (
        <View style={tw`mt-8 px-4`}>
          <Text
            style={tw`px-1 mb-3 text-xs font-poppins-bold text-mute tracking-widest uppercase`}
          >
            People you know
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-1`}
          >
            {friends.map((user: User) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => startDirectConversation(user)}
                activeOpacity={0.8}
                style={tw`items-center mr-4 w-16`}
              >
                <ProfAvatar
                  user={user}
                  size={56}
                  disableDefaultNavigation
                  onPress={() => startDirectConversation(user)}
                />
                <Text
                  style={tw`text-xs font-poppins text-soft mt-1 text-center`}
                  numberOfLines={1}
                >
                  {user.firstName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )

  return (
    <Screen
      loading={isLoading || createdConversationResult.isLoading}
      error={
        createdConversationResult.isError
          ? (createdConversationResult.error as any).data.error
          : undefined
      }
    >
      <View style={tw`flex-1 bg-warm-bg`}>
        <ScreenHeader
          title="Conversation"
          subtitle="Direct messages"
          rightAction={
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                tw`w-10 border border-warm-border h-10 rounded-full items-center justify-center bg-white`,
              ]}
              onPress={() => {
                // Placeholder: compose new message
              }}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={20}
                color={colors.primaryDeep}
              />
            </TouchableOpacity>
          }
        />

        <SearchBar
          onSearchChange={handleSearchConversation}
          placeholder="Search conversations"
        />

        <TabBar
          fullWidth
          tabs={CHAT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={tw`mb-2 border-b border-warm-border border-b-2`}
        />

        {profilesData?.data && searchQuery.length > 0 && (
          <View
            style={[
              tw`mx-4 mb-2 p-3 rounded-card border`,
              {
                backgroundColor: colors.warmSurface,
                borderColor: colors.warmBorder,
              },
            ]}
          >
            {profilesData.data.length === 0 ? (
              <Text style={tw`text-mute font-poppins`}>No users found</Text>
            ) : (
              profilesData.data.map((user: User) => (
                <TouchableOpacity
                  key={user.id}
                  style={tw`py-2`}
                  onPress={() => startDirectConversation(user)}
                >
                  <ProfAvatar user={user} disableDefaultNavigation />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={tw`flex-1 px-2`}>
          {filteredConversations.length === 0 ? (
            renderEmptyState()
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
