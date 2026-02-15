import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import BlogCard from './components/BlogCard'
import FeaturedBlogList from './components/FeaturedBlogList'
import Screen from 'components/screen'
import { ImageBackground } from 'expo-image'
import CategoryTabs from '../Communities/components/CategoryTabs'
import { useFetchInterestsQuery, Interest } from '../../store/interests'
import { FeedStackParams } from '../../../types'
import { useFetchBlogsQuery } from 'store/blog-api-slice'
import { ActivityIndicator } from 'react-native-paper'
import { Blog } from '../../../types'
const BlogListScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParams>>()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null
  )

  const { data: interests, isLoading: interestsLoading } =
    useFetchInterestsQuery()

  const {
    data: blogsData,
    isLoading: isBlogLoading,
    isFetching: isBlogFetching,
    error: blogError,
    refetch,
  } = useFetchBlogsQuery({})

  const blogs = blogsData?.data || []

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
          Check back later
        </Text>
      </View>
    )
  }, [])

  const handleBlogPress = useCallback(
    (blog: Blog) => {
      navigation.navigate('BlogDetail', { blogId: blog.id })
    },
    [navigation]
  )

  const renderItem = useCallback(
    ({ item }: { item: Blog }) => {
      return <BlogCard blog={item} onPress={() => handleBlogPress(item)} />
    },
    [handleBlogPress]
  )

  const handleInterestChange = (interest: Interest) => {
    setSelectedInterest(interest)
  }

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
        <SafeAreaView style={tw`flex-1 `}>
          <View style={tw`pt-10`}>
            <FeaturedBlogList onBlogPress={handleBlogPress} />
          </View>
          {interests?.length ? (
            <CategoryTabs
              interests={interests}
              selectedInterest={selectedInterest}
              onInterestChange={handleInterestChange}
              style={tw`bg-red-500 mt-5`}
            />
          ) : (
            <ActivityIndicator animating />
          )}
          <FlatList
            data={blogs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={tw`p-3 pb-34`}
            refreshControl={
              <RefreshControl
                refreshing={isBlogFetching}
                onRefresh={refetch}
                tintColor={tw.color('primary')}
              />
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            windowSize={5}
          />
          <TouchableOpacity
            style={tw`absolute bottom-6 right-4 w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg`}
            onPress={() => navigation.navigate('CreateBlog')}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Screen>
  )
}

export default BlogListScreen
