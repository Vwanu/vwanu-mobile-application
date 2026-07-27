import React from 'react'
import { StyleProp, TextStyle } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface Props {
  title: string
  color?: string
  numberOfLines?: number
  style?: StyleProp<TextStyle>
}

const BlogTitle: React.FC<Props> = ({
  title,
  color = '#FFFFFF',
  numberOfLines = 2,
  style,
}) => (
  <Text
    style={[tw`text-3xl font-syne-bold`, { color }, style]}
    numberOfLines={numberOfLines}
    ellipsizeMode="tail"
  >
    {title}
  </Text>
)

export default BlogTitle
