import React from 'react'
import { View, FlatList } from 'react-native'

import tw from 'lib/tailwind'
import BlogCardFeatured from './BlogCardFeatured'
import { MockBlog } from 'data/mockBlogs'

interface FeaturedBlogListProps {
  blogs: MockBlog[]
  title?: string
  onBlogPress?: (blog: MockBlog) => void
}

const FeaturedBlogList: React.FC<FeaturedBlogListProps> = ({
  blogs,
  onBlogPress,
}) => {
  const renderItem = ({ item }: { item: MockBlog }) => (
    <BlogCardFeatured blog={item} onPress={() => onBlogPress?.(item)} />
  )

  return (
    <View style={tw`my-4`}>
      <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
      />
    </View>
  )
}

export default FeaturedBlogList
