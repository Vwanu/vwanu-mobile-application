import { Ionicons } from '@expo/vector-icons'
import React, { useState, useCallback, useEffect } from 'react'
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import UserCard from './components/UserCard'
import { useFetchProfilesQuery } from 'store/profiles'
import SearchBox from 'screens/Communities/components/SearchBox'

const ITEMS_PER_PAGE = 10

const PeopleList: React.FC = () => {
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [allUsers, setAllUsers] = useState<Profile[]>([])

  // Fetch profiles from API with pagination
  const {
    data: profilesData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchProfilesQuery({
    search: searchQuery,
    $limit: ITEMS_PER_PAGE,
    $skip: skip,
    // $sort: { createdAt: -1 } as const,
  })

  // Accumulate users when new data arrives
  useEffect(() => {
    if (profilesData?.data) {
      if (skip === 0) {
        // Fresh load or search - replace all users
        setAllUsers(profilesData.data)
      } else {
        // Loading more - append new users
        setAllUsers((prev) => [...prev, ...profilesData.data])
      }

      // Check if we've reached the end
      const totalLoaded = skip + profilesData.data.length
      setHasMore(totalLoaded < profilesData.total)
    }
  }, [profilesData])

  // Reset pagination when search query changes
  useEffect(() => {
    setSkip(0)
    setAllUsers([])
    setHasMore(true)
  }, [searchQuery])

  const loadMoreUsers = useCallback(() => {
    if (isFetching || !hasMore) {
      return
    }

    // Load next page
    setSkip((prev) => prev + ITEMS_PER_PAGE)
  }, [isFetching, hasMore])

  const handleRefresh = useCallback(async () => {
    setSkip(0)
    setAllUsers([])
    setHasMore(true)
    await refetch()
  }, [refetch])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const renderFooter = useCallback(() => {
    if (!isFetching || skip === 0) return null

    return (
      <View style={tw`py-4 items-center`}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    )
  }, [isFetching, skip])

  const renderEmpty = useCallback(() => {
    if (isLoading || isFetching) return null

    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Ionicons name="people-outline" size={64} color="#9CA3AF" />
        <Text
          style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4`}
        >
          No users found
        </Text>
        <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2`}>
          {searchQuery ? 'Try a different search' : 'Try refreshing the list'}
        </Text>
      </View>
    )
  }, [isLoading, isFetching, searchQuery])

  // Show loading indicator on initial load
  if (isLoading) {
    return (
      <View
        style={tw`flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center`}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`text-gray-500 dark:text-gray-400 mt-4`}>
          Loading users...
        </Text>
      </View>
    )
  }

  return (
    <View style={tw`flex-1 bg-gray-50 dark:bg-gray-900`}>
      <SearchBox onSearch={handleSearch} />
      <FlatList
        data={allUsers}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item: Profile) => item.id}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={tw`p-3 pb-34`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && skip === 0}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  )
}

export default PeopleList
