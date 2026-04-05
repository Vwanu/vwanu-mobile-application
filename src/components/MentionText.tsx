import React, { useMemo } from 'react'
import { Text, StyleProp, TextStyle } from 'react-native'
import { parseValue } from 'react-native-controlled-mentions'

import tw from 'lib/tailwind'
import { mentionConfigs } from 'config/mentionConfig'

interface MentionTextProps {
  children: string
  style?: StyleProp<TextStyle>
  mentionStyle?: StyleProp<TextStyle>
  onMentionPress?: (id: string, name: string) => void
}

const MentionText: React.FC<MentionTextProps> = ({
  children,
  style,
  mentionStyle,
  onMentionPress,
}) => {
  const { parts } = useMemo(
    () => parseValue(children, mentionConfigs),
    [children]
  )

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.data ? (
          <Text
            key={`${part.data.id}-${index}`}
            style={[tw`font-bold text-blue-500`, mentionStyle]}
            onPress={
              onMentionPress
                ? () => onMentionPress(part.data!.id, part.data!.name)
                : undefined
            }
          >
            {part.data.name}
          </Text>
        ) : (
          <Text key={`text-${index}`}>{part.text}</Text>
        )
      )}
    </Text>
  )
}

export default MentionText
