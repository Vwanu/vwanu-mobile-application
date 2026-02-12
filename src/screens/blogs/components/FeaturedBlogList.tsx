import React from 'react'
import { View, FlatList } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import BlogCardFeatured from './BlogCardFeatured'
import { MockBlog } from 'data/mockBlogs'

interface FeaturedBlogListProps {
  blogs: MockBlog[]
  title?: string
  onBlogPress?: (blog: MockBlog) => void
}

const FeaturedBlogList: React.FC<FeaturedBlogListProps> = ({
  blogs,
  title = 'Featured Blogs',
  onBlogPress,
}) => {
  const renderItem = ({ item }: { item: MockBlog }) => (
    <BlogCardFeatured blog={item} onPress={() => onBlogPress?.(item)} />
  )

  return (
    <View style={tw`mb-4`}>
      {title && (
        <Text
          style={tw`text-lg font-bold text-gray-900 dark:text-white mb-3 px-4`}
        >
          {title}
        </Text>
      )}
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
