import React, { useCallback, useState } from 'react'
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator } from 'react-native-paper'

import tw from 'lib/tailwind'
import Text from 'components/Text'

import Screen from 'components/screen'
import { FeedStackParams, Discussion } from '../../../types'
import CreateDiscussionForm from './component/CreateDiscussionFrom'
import DiscussionCard from './component/DiscussionCard'
import EmptyList from 'components/EmptyList'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import { colors } from 'components/ui/tokens'
import {
  useFetchDiscussionsQuery,
  useCreateDiscussionMutation,
} from 'store/discussion-api-slice'

const DISCUSSION_FILTERS: Tab[] = [
  { id: 'latest', label: 'Latest' },
  { id: 'top', label: 'Top' },
  { id: 'unanswered', label: 'Unanswered' },
]

const GRADIENT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['rgba(27,31,94,0.85)', 'rgba(247,108,94,0.45)'],
  ['rgba(27,31,94,0.85)', 'rgba(244,163,0,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(247,108,94,0.5)'],
  ['rgba(27,31,94,0.9)', 'rgba(59,130,246,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(197,132,0,0.45)'],
]
const EMOJIS = ['💬', '🗣️', '📣', '🌐', '🔥', '✨', '🧠']

const hashId = (id: string | number) => {
  const key = String(id)
  let hash = 0
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  return Math.abs(hash)
}
const gradientFor = (id: string | number) =>
  GRADIENT_PAIRS[hashId(id) % GRADIENT_PAIRS.length]
const emojiFor = (id: string | number) => EMOJIS[hashId(id) % EMOJIS.length]
const mockThreadCount = (id: string | number) => (hashId(id) % 240) + 6
const mockMemberCount = (id: string | number) => (hashId(id) % 1800) + 120

type ForumDetailRoute = RouteProp<FeedStackParams, 'ForumDetail'>

const ForumDetailScreen: React.FC = () => {
  const route = useRoute<ForumDetailRoute>()
  const navigation = useNavigation()
  const { forum } = route.params
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('latest')

  const {
    data: discussionsData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchDiscussionsQuery({ interestId: forum.id })

  const [createDiscussion] = useCreateDiscussionMutation()

  const discussions = discussionsData?.data ?? []

  const handleCreateDiscussion = async (
    title: string,
    body: string,
    mentions?: string[]
  ) => {
    try {
      await createDiscussion({
        interestId: forum.id,
        title,
        body,
        mentions,
      }).unwrap()
    } catch (err) {
      console.error('Failed to create discussion:', err)
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: Discussion }) => <DiscussionCard discussion={item} />,
    []
  )

  return (
    <Screen safeArea={false}>
      <View style={tw`flex-1`}>
        <ImageBackground
          source={forum.coverPicture ? { uri: forum.coverPicture } : undefined}
          style={tw`h-[220px] w-full`}
        >
          <LinearGradient
            colors={gradientFor(forum.id)}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={tw`flex-1 px-4 pt-12 pb-5 justify-end overflow-hidden`}
          >
            <Text
              style={[
                tw`absolute right-3 top-8`,
                { fontSize: 130, opacity: 0.18 },
              ]}
            >
              {emojiFor(forum.id)}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              style={[
                tw`absolute top-12 left-4 w-10 h-10 rounded-full items-center justify-center border border-white/30`,
                { backgroundColor: 'rgba(255,255,255,0.18)' },
              ]}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            <Text style={tw`text-white font-syne-bold text-2xl`}>
              {forum.name}
            </Text>
            {forum.description ? (
              <Text
                style={tw`text-white/80 font-poppins text-sm mt-1`}
                numberOfLines={2}
              >
                {forum.description}
              </Text>
            ) : null}

            <View style={tw`flex-row gap-2 mt-3`}>
              <View
                style={[
                  tw`flex-row items-center px-3 py-1 rounded-full border border-white/30`,
                  { backgroundColor: 'rgba(255,255,255,0.15)' },
                ]}
              >
                <Ionicons name="chatbubbles-outline" size={12} color="white" />
                <Text style={tw`text-white text-xs font-poppins-medium ml-1`}>
                  {mockThreadCount(forum.id)} threads
                </Text>
              </View>
              <View
                style={[
                  tw`flex-row items-center px-3 py-1 rounded-full border border-white/30`,
                  { backgroundColor: 'rgba(255,255,255,0.15)' },
                ]}
              >
                <Ionicons name="people-outline" size={12} color="white" />
                <Text style={tw`text-white text-xs font-poppins-medium ml-1`}>
                  {mockMemberCount(forum.id).toLocaleString()} members
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View
          style={tw`flex-row items-center bg-white align-center justify-between mb-1`}
        >
          <View style={tw`flex-1 min-w-0 overflow-hidden`}>
            <TabBar
              tabs={DISCUSSION_FILTERS}
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            activeOpacity={0.85}
            style={[
              tw`shrink-0 mr-2 ml-3 px-3 py-2 rounded-full flex-row items-center`,
              { backgroundColor: colors.primaryDeep },
            ]}
          >
            <Ionicons name="add" size={14} color="#FFFFFF" />
            <Text style={tw`text-white text-xs font-poppins-semibold ml-1`}>
              New thread
            </Text>
          </TouchableOpacity>
        </View>

        {/* Discussions list */}
        <FlatList
          data={discussions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tw`pt-4 pb-34`}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={tw.color('primary')}
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={tw`items-center justify-center py-20`}>
                <ActivityIndicator animating color={tw.color('primary')} />
              </View>
            ) : (
              <EmptyList
                icon="chatbubble-outline"
                title="No discussions yet"
                subtitle="Be the first to start a conversation"
              />
            )
          }
        />

        {/* Create Discussion Modal */}
        <CreateDiscussionForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateDiscussion}
          categoryName={forum.name}
        />
      </View>
    </Screen>
  )
}

export default ForumDetailScreen
