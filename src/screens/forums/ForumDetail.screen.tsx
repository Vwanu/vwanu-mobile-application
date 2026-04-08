import React, { useCallback, useState } from 'react'
import {
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'
import { ActivityIndicator } from 'react-native-paper'

import tw from 'lib/tailwind'
import Text from 'components/Text'

import Screen from 'components/screen'
import { FeedStackParams, Discussion } from '../../../types'
import CreateDiscussionForm from './component/CreateDiscussionFrom'
import DiscussionCard from './component/DiscussionCard'
import EmptyList from 'components/EmptyList'
import {
  useFetchDiscussionsQuery,
  useCreateDiscussionMutation,
} from 'store/discussion-api-slice'

type ForumDetailRoute = RouteProp<FeedStackParams, 'ForumDetail'>

const ForumDetailScreen: React.FC = () => {
  const route = useRoute<ForumDetailRoute>()
  const navigation = useNavigation()
  const { forum } = route.params
  const [showForm, setShowForm] = useState(false)

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
      <View style={tw`flex-1 bg-gray-50 dark:bg-gray-900`}>
        {/* Header with cover image */}
        <ImageBackground
          source={forum.coverPicture ? { uri: forum.coverPicture } : undefined}
          style={tw`h-[200px] w-full`}
        >
          <View style={tw`flex-1 bg-black/50 justify-end p-4`}>
            <TouchableOpacity
              style={tw`absolute top-12 left-4 bg-black/30 rounded-full p-2`}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-2xl font-bold`}>{forum.name}</Text>
            {forum.description ? (
              <Text style={tw`text-white/80 text-sm mt-1`} numberOfLines={2}>
                {forum.description}
              </Text>
            ) : null}
          </View>
        </ImageBackground>

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

        {/* FAB */}
        <TouchableOpacity
          style={[
            tw`absolute bottom-8 right-5 bg-white rounded-full w-14 h-14 items-center justify-center`,
            fabShadow,
          ]}
          onPress={() => setShowForm(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={tw.color('primary')} />
        </TouchableOpacity>

        {/* Create Discussion Modal */}
        <CreateDiscussionForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateDiscussion}
        />
      </View>
    </Screen>
  )
}

const fabShadow = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    android: {
      elevation: 8,
    },
  }),
}

export default ForumDetailScreen
