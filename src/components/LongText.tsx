import React from 'react'
import {
  TouchableOpacity,
  View,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native'
import Text from './Text'
import tw from '../lib/tailwind'
import useToggle from '../hooks/useToggle'

interface LongTextProps extends TextProps {
  text: string
  maxLength?: number
  showMoreText?: string
  showLessText?: string
  textStyles?: StyleProp<TextStyle>
  showShowMoreText?: boolean
}

const LongText: React.FC<LongTextProps> = ({
  text,
  maxLength = 150,
  showMoreText = 'Show more',
  showLessText = 'Show less',
  textStyles = {},
  showShowMoreText = true,
  ...textProps
}) => {
  const [isExpanded, toggleExpanded] = useToggle(false)
  const shouldTruncate = text.length > maxLength

  const displayText =
    shouldTruncate && !isExpanded ? `${text.slice(0, maxLength)}...` : text

  const toggleButton = shouldTruncate && showShowMoreText && (
    <TouchableOpacity onPress={toggleExpanded}>
      <Text style={tw`text-primary text-sm ml-1`}>
        {isExpanded ? showLessText : showMoreText}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex flex-row flex-wrap items-center`}>
      <Text style={textStyles} {...textProps}>
        {displayText}
      </Text>
      {toggleButton}
    </View>
  )
}

export default LongText
