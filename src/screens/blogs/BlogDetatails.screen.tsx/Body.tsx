import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'

import tw from 'lib/tailwind'
import { Blog } from '../../../../types'
import RenderHtml from 'react-native-render-html'

type Props = {
  blog: Blog
}

const BlogDetailScreen: React.FC<Props> = ({ blog }) => {
  const { width } = useWindowDimensions()
  return (
    <ScrollView
      style={tw`dark:bg-gray-900 px-2`}
      showsVerticalScrollIndicator={false}
    >
      <RenderHtml
        contentWidth={width}
        source={{ html: blog.content }}
        baseStyle={tw``}
      />
    </ScrollView>
  )
}

export default BlogDetailScreen
