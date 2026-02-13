import React from 'react'
import { ScrollView } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { mockBlogs } from 'data/mockBlogs'

type Props = {
  blog: (typeof mockBlogs)[0]
}

const BlogDetailScreen: React.FC<Props> = ({ blog }) => {
  return (
    <ScrollView
      style={tw`flex- bg-white dark:bg-gray-900`}
      showsVerticalScrollIndicator={false}
    >
      <Text style={tw`text-2xl font-bold text-gray-900 dark:text-white mb-4`}>
        {blog.title}
      </Text>
      <Text style={tw`text-base text-gray-700 dark:text-gray-300 leading-7`}>
        {blog.content}
      </Text>
    </ScrollView>
  )
}

export default BlogDetailScreen
