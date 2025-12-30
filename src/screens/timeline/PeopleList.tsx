import React, { useState, useCallback } from 'react'
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import tw from 'lib/tailwind'
import Text from 'components/Text'
import UserCard from './components/UserCard'
import { mockUsers, MockUser } from 'data/mockUsers'
import { Ionicons } from '@expo/vector-icons'
import SearchBox from 'screens/Communities/components/SearchBox'

const ITEMS_PER_PAGE = 10

const PeopleList: React.FC = () => {
  const [users, setUsers] = useState<MockUser[]>(mockUsers)
  const [displayedUsers, setDisplayedUsers] = useState<MockUser[]>(
    mockUsers.slice(0, ITEMS_PER_PAGE)
  )
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleFollowToggle = useCallback(
    (userId: string, newFollowingState: boolean) => {
      // Update the user's follow state in both the main list and displayed list
      const updateUserFollowState = (userList: MockUser[]) =>
        userList.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: newFollowingState }
            : user
        )

      setUsers((prev) => updateUserFollowState(prev))
      setDisplayedUsers((prev) => updateUserFollowState(prev))
    },
    []
  )

  const loadMoreUsers = useCallback(() => {
    if (isLoadingMore || displayedUsers.length >= users.length) {
      return
    }

    setIsLoadingMore(true)

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = page * ITEMS_PER_PAGE
      const endIndex = nextPage * ITEMS_PER_PAGE
      const newUsers = users.slice(startIndex, endIndex)

      setDisplayedUsers((prev) => [...prev, ...newUsers])
      setPage(nextPage)
      setIsLoadingMore(false)
    }, 500)
  }, [isLoadingMore, displayedUsers.length, users.length, page, users])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setDisplayedUsers(users.slice(0, ITEMS_PER_PAGE))
      setPage(1)
      setIsRefreshing(false)
    }, 1000)
  }, [users])

  const renderUser = useCallback(
    ({ item }: { item: MockUser }) => (
      <UserCard user={item} onFollowToggle={handleFollowToggle} />
    ),
    [handleFollowToggle]
  )

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null

    return (
      <View style={tw`py-4 items-center`}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    )
  }, [isLoadingMore])

  const renderEmpty = useCallback(() => {
    if (isRefreshing) return null

    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Ionicons name="people-outline" size={64} color="#9CA3AF" />
        <Text
          style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4`}
        >
          No users found
        </Text>
        <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2`}>
          Try refreshing the list
        </Text>
      </View>
    )
  }, [isRefreshing])

  const keyExtractor = useCallback((item: MockUser) => item.id, [])

  return (
    <View style={tw`flex-1 bg-gray-50 dark:bg-gray-900`}>
      <SearchBox />
      <FlatList
        data={displayedUsers}
        renderItem={renderUser}
        keyExtractor={keyExtractor}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={tw`p-3 pb-34`}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
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
