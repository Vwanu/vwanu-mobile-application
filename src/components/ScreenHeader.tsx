import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'

export interface ScreenHeaderProps {
  title: string
  subtitle?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  containerStyle,
}) => (
  <View
    style={[
      tw`flex-row items-center justify-between px-4 pt-4 pb-3`,
      containerStyle,
    ]}
  >
    {leftAction ? <View style={tw`mr-3`}>{leftAction}</View> : null}
    <View style={tw`flex-1 mr-3`}>
      <Text style={tw`text-2xl font-syne-bold text-ink`}>{title}</Text>
      {subtitle ? (
        <Text style={tw`text-sm font-poppins text-mute -mt-1`}>{subtitle}</Text>
      ) : null}
    </View>
    {rightAction ?? null}
  </View>
)

export default ScreenHeader
