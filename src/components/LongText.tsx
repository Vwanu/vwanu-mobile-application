import React from 'react'
import {
  TouchableOpacity,
  View,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native'
import Text from './Text'
import MentionText from './MentionText'
import tw from '../lib/tailwind'
import useToggle from '../hooks/useToggle'
import routes from '../navigation/routes'
import { useNavigation } from '@react-navigation/native'

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
  const navigation = useNavigation()
  const [isExpanded, toggleExpanded] = useToggle(false)
  const shouldTruncate = text.length > maxLength

  const displayText =
    shouldTruncate && !isExpanded ? `${text.slice(0, maxLength)}...` : text

  const handleMentionPress = (id: string) => {
    const parentNavigation = navigation.getParent()
    const nav = parentNavigation || navigation
    // @ts-ignore
    nav.navigate(routes.ACCOUNT, {
      screen: routes.PROFILE,
      params: { profileId: id },
    })
  }

  const toggleButton = shouldTruncate && showShowMoreText && (
    <TouchableOpacity onPress={toggleExpanded}>
      <Text style={tw`text-primary text-sm ml-1`}>
        {isExpanded ? showLessText : showMoreText}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex flex-row flex-wrap items-center`}>
      <MentionText style={textStyles} onMentionPress={handleMentionPress}>
        {displayText}
      </MentionText>
      {toggleButton}
    </View>
  )
}

export default LongText
