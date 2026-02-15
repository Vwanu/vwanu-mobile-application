import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'

import tw from 'lib/tailwind'
import BlogCardFeatured from './BlogCardFeatured'
import { Blog } from '../../../../types'
import { useFetchBlogsQuery } from 'store/blog-api-slice'

interface FeaturedBlogListProps {
  title?: string
  onBlogPress?: (blog: Blog) => void
}

const FeaturedBlogList: React.FC<FeaturedBlogListProps> = ({ onBlogPress }) => {
  const { data, isLoading, isFetching } = useFetchBlogsQuery({})
  const blogs = data?.data || []
  const renderItem = ({ item }: { item: Blog }) => (
    <BlogCardFeatured blog={item} onPress={() => onBlogPress?.(item)} />
  )

  if (isLoading)
    return <ActivityIndicator animating={true} style={tw`h-[200px]`} />

  return (
    <View style={tw`my-4`}>
      <FlatList
        data={blogs}
        renderItem={renderItem}
        ListEmptyComponent={() => <View style={tw`h-[200px]`} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
      />
    </View>
  )
}

export default FeaturedBlogList
