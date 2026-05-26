import React, { useCallback, useState } from 'react'
import { View, FlatList, RefreshControl, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import ScreenHeader from 'components/ScreenHeader'
import TabBar, { Tab } from 'components/Tabs/TabBar'
import EmptyList from 'components/EmptyList'
import { colors } from 'components/ui/tokens'

import { useFetchInterestsQuery, Interest } from 'store/interests'
import { FeedStackParams } from '../../../../types'
import ForumFeaturedCard from './components/ForumFeaturedCard'
import ForumCategoryCard from './components/ForumCategoryCard'
import ForumFAB from './components/ForumFAB'

type FilterId = 'all' | 'trending' | 'new' | 'mine'

const FILTERS: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'mine', label: 'My Topics' },
]

const mockThreadCount = (id: string | number) => {
  const key = String(id)
  let hash = 0
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  return (Math.abs(hash) % 240) + 6
}

const ForumScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParams>>()
  const [filter, setFilter] = useState<FilterId>('all')
  const [search, setSearch] = useState('')

  const { data: interests, isFetching, refetch } = useFetchInterestsQuery()

  const handleForumPress = useCallback(
    (forum: Interest) => {
      navigation.navigate('ForumDetail', { forum })
    },
    [navigation]
  )

  const handleNewThread = useCallback(() => {
    console.log('TODO: navigate to new thread flow')
  }, [])

  const handleFilterChange = useCallback((id: string) => {
    setFilter(id as FilterId)
    if (id !== 'all') console.log(`TODO: wire filter "${id}"`)
  }, [])

  const filteredInterests = (interests || []).filter((i) =>
    search.trim()
      ? i.name.toLowerCase().includes(search.trim().toLowerCase())
      : true
  )

  const renderHeader = () => (
    <View>
      <ScreenHeader title="Forum" subtitle="Discuss · Debate · Discover" />
      <View
        style={tw`mx-4 my-3 px-4 py-2 flex-row items-center bg-warm-surface border border-warm-border-strong rounded-full`}
      >
        <Ionicons name="search" size={18} color={colors.mute} />
        <TextInput
          style={tw`flex-1 ml-2 text-ink font-poppins`}
          placeholder="Search categories"
          placeholderTextColor={colors.mute}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <TabBar
        tabs={FILTERS}
        activeTab={filter}
        onTabChange={handleFilterChange}
        activeColor={colors.primaryDeep}
        inactiveColor={colors.mute}
      />
      <ForumFeaturedCard
        title="Building Vwanu Together"
        subLabel="Trending Discussion"
        threadCount={84}
        onPress={() => console.log('TODO: featured discussion route')}
      />
    </View>
  )

  return (
    <Screen>
      <FlatList
        data={filteredInterests}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <ForumCategoryCard
            id={item.id}
            title={item.name}
            image={item.coverPicture}
            threadCount={mockThreadCount(item.id)}
            onPress={() => handleForumPress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !isFetching ? (
            <EmptyList
              icon="chatbubbles-outline"
              title="No forum categories yet"
              subtitle="Check back later"
            />
          ) : null
        }
        contentContainerStyle={tw`pb-24 px-3`}
        columnWrapperStyle={tw`px-1`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primaryDeep}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <ForumFAB onPress={handleNewThread} />
    </Screen>
  )
}

export default ForumScreen
