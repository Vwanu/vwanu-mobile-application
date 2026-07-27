import React from 'react'
import { StyleProp, TextStyle } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { getReadingStats } from '../utils/readingStats'

interface Props {
  html: string
  showWordCount?: boolean
  style?: StyleProp<TextStyle>
}

const ReadingStats: React.FC<Props> = ({
  html,
  showWordCount = true,
  style,
}) => {
  const { words, minutes } = getReadingStats(html)

  const parts: string[] = []
  if (showWordCount) parts.push(`${words} ${words === 1 ? 'word' : 'words'}`)
  if (words > 0) parts.push(`${minutes} min read`)

  return (
    <Text style={[tw`text-xs font-poppins text-mute`, style]}>
      {parts.join('  ·  ')}
    </Text>
  )
}

export default ReadingStats
