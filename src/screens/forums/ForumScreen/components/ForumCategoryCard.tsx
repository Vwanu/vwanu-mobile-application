import React from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import tw from 'lib/tailwind'
import Text from 'components/Text'

const GRADIENT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['rgba(27,31,94,0.85)', 'rgba(247,108,94,0.45)'],
  ['rgba(27,31,94,0.85)', 'rgba(244,163,0,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(247,108,94,0.5)'],
  ['rgba(27,31,94,0.9)', 'rgba(59,130,246,0.45)'],
  ['rgba(43,49,128,0.85)', 'rgba(197,132,0,0.45)'],
]

const gradientFor = (id: string | number): readonly [string, string] => {
  const key = String(id)
  let hash = 0
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length]
}

interface Props {
  id: string | number
  title: string
  threadCount?: number
  image?: string | null
  onPress?: () => void
}

const ForumCategoryCard: React.FC<Props> = ({
  id,
  title,
  threadCount,
  image,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={tw`flex-1 m-1.5 h-36 rounded-card overflow-hidden`}
  >
    <ImageBackground
      source={image ? { uri: image } : undefined}
      style={tw`w-full h-full`}
      resizeMode="cover"
    >
      <LinearGradient
        colors={gradientFor(id)}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={tw`flex-1 p-3 justify-end`}
      >
        <Text
          style={tw`text-white font-syne-bold text-base leading-5 mb-1`}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text style={tw`text-white text-xs font-poppins-medium opacity-90`}>
          {threadCount ?? 0} threads
        </Text>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
)

export default ForumCategoryCard
