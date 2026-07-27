import React from 'react'
import { View, useWindowDimensions } from 'react-native'

import tw from 'lib/tailwind'
import { Blog } from '../../../../types'
import RenderHtml from 'react-native-render-html'

type Props = {
  blog: Blog
}

const Body: React.FC<Props> = ({ blog }) => {
  const { width } = useWindowDimensions()
  return (
    <View style={tw`px-4`}>
      <RenderHtml
        contentWidth={width - 32}
        source={{ html: blog.content }}
        baseStyle={tw``}
      />
    </View>
  )
}

export default Body
