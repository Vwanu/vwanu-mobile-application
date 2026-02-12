import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import BlogCard from './components/BlogCard'
import FeaturedBlogList from './components/FeaturedBlogList'
import { mockBlogs, MockBlog } from 'data/mockBlogs'
import Screen from 'components/screen'
import { ImageBackground } from 'expo-image'
import CategoryTabs from '../Communities/components/CategoryTabs'
import { useFetchInterestsQuery, Interest } from '../../store/interests'

const BlogListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null
  )

  const { data: interests, isLoading: interestsLoading } =
    useFetchInterestsQuery()

  // Featured blogs (top 5 by likes)
  const featuredBlogs = [...mockBlogs]
    .sort((a, b) => b.amountOfLikes - a.amountOfLikes)
    .slice(0, 5)

  // Filter blogs based on search query and selected interest
  const filteredBlogs = useMemo(() => {
    let blogs = mockBlogs

    if (searchQuery) {
      blogs = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          blog.author.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return blogs
  }, [searchQuery, selectedInterest])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }, [])

  const renderEmpty = useCallback(() => {
    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Ionicons name="newspaper-outline" size={64} color="#9CA3AF" />
        <Text
          style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4`}
        >
          No blogs found
        </Text>
        <Text style={tw`text-sm text-gray-500 dark:text-gray-400 mt-2`}>
          {searchQuery ? 'Try a different search' : 'Check back later'}
        </Text>
      </View>
    )
  }, [searchQuery])

  const renderItem = useCallback(({ item }: { item: MockBlog }) => {
    return <BlogCard blog={item} />
  }, [])

  const handleInterestChange = (interest: Interest) => {
    setSelectedInterest(interest)
  }

  const renderHeader = useCallback(() => {
    if (searchQuery) return null // Hide featured when searching
    return (
      <View>
        {interests && interests.length > 0 && (
          <CategoryTabs
            interests={interests}
            selectedInterest={selectedInterest}
            onInterestChange={handleInterestChange}
          />
        )}
        <FeaturedBlogList blogs={featuredBlogs} title="Featured" />

        <View style={tw`flex flex-row justify-between items-center mt-4 `}>
          <Text
            style={tw`text-lg font-bold text-gray-900 dark:text-white mb-3 mt-2`}
          >
            Recent
          </Text>
          <TouchableOpacity>
            <Text
              style={tw`text-lg font-bold text-primary text-gray-900 dark:text-white mb-3 mt-2`}
            >
              Filters{' '}
              <Ionicons
                name="filter"
                size={16}
                color={tw.color('gray-900 dark:gray-100')}
                style={tw`ml-1`}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }, [searchQuery, featuredBlogs, selectedInterest, handleInterestChange])

  return (
    <Screen safeArea={false}>
      <View style={tw`flex-1  bg-gray-50 dark:bg-gray-900`}>
        {/* ImageBackground fixed at top, covering half of featured blogs height (90px) */}
        <ImageBackground
          source={{
            uri: 'https://plus.unsplash.com/premium_photo-1684581214880-2043e5bc8b8b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }}
          style={tw`absolute top-0 left-0 right-0 h-[330px]`}
        />
        <SafeAreaView style={tw`flex-1`}>
          <FlatList
            data={filteredBlogs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={tw`p-3 pb-34`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
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
        </SafeAreaView>
      </View>
    </Screen>
  )
}

export default BlogListScreen
