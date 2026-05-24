import React from 'react'
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import tw from 'lib/tailwind'
import { cardShadow } from './tokens'

export interface GradientStripCardProps {
  colors?: readonly [string, string, ...string[]]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  onPress?: () => void
  width?: number
  height?: number
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
  activeOpacity?: TouchableOpacityProps['activeOpacity']
}

const DEFAULT_COLORS = ['#2B3180', '#F76C5E'] as const

const GradientStripCard: React.FC<GradientStripCardProps> = ({
  colors = DEFAULT_COLORS,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  onPress,
  width = 160,
  height = 200,
  style,
  children,
  activeOpacity = 0.85,
}) => {
  const containerStyle = [
    { width, height },
    tw`mr-3 rounded-card overflow-hidden`,
    cardShadow,
    style,
  ]

  const gradient = (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={tw`flex-1 p-3 justify-end`}
    >
      {children}
    </LinearGradient>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={containerStyle}
      >
        {gradient}
      </TouchableOpacity>
    )
  }

  return <View style={containerStyle}>{gradient}</View>
}

export default GradientStripCard
