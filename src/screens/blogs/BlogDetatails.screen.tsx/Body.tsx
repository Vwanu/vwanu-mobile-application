import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Blog } from '../../../../types'
import RenderHtml from 'react-native-render-html'

type Props = {
  blog: Blog
}

const BlogDetailScreen: React.FC<Props> = ({ blog }) => {
  const { width } = useWindowDimensions()
  return (
    <ScrollView
      style={tw`flex- bg-white dark:bg-gray-900 px-2`}
      showsVerticalScrollIndicator={false}
    >
      <Text style={tw`text-2xl font-bold dark:text-white `}>{blog.title}</Text>

      <RenderHtml
        contentWidth={width}
        source={{ html: blog.content }}
        baseStyle={tw``}
      />
    </ScrollView>
  )
}

export default BlogDetailScreen
