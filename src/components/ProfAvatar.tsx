import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import LongText from './LongText'

interface ProfAvatarProps {
  source: string
  name: string
  subtitle?: string
  size: number
  layout?: 'col' | 'row'
  userId?: string | number
  onLongPress?: (userId: string | number) => void
  subtitleParams?: {
    maxLength?: number
    showMoreText?: string
    showLessText?: string
    textStyles?: string
  }
}

const ProfAvatar: React.FC<ProfAvatarProps> = ({
  layout = 'row',
  ...props
}) => {
  const handleLongPress = () => {
    if (props.userId && props.onLongPress) {
      props.onLongPress(props.userId)
    }
  }

  return (
    <TouchableOpacity
      style={tw`flex flex-${layout} items-center`}
      onLongPress={handleLongPress}
      delayLongPress={800}
      disabled={!props.userId || !props.onLongPress}
    >
      <Avatar.Image size={props.size} source={{ uri: props.source }} />
      <View style={tw`ml-2 flex justify-center`}>
        <Text style={tw`font-semibold`}>{props.name}</Text>
        {props.subtitle ? (
          <LongText
            textStyles={`font-thin ${props.subtitleParams?.textStyles}`}
            text={props?.subtitle}
            maxLength={props?.subtitleParams?.maxLength}
            showMoreText={props?.subtitleParams?.showMoreText}
            showLessText={props?.subtitleParams?.showLessText}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default ProfAvatar
