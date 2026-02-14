import React from 'react'
import { View, FlatList } from 'react-native'

import tw from 'lib/tailwind'
import BlogCardFeatured from './BlogCardFeatured'
import { Blog } from '../../../../types'

interface FeaturedBlogListProps {
  blogs: Blog[]
  title?: string
  onBlogPress?: (blog: Blog) => void
}

const FeaturedBlogList: React.FC<FeaturedBlogListProps> = ({
  blogs,
  onBlogPress,
}) => {
  const renderItem = ({ item }: { item: Blog }) => (
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
