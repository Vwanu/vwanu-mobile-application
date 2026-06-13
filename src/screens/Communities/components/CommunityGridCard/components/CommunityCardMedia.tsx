import React from 'react'
import { View, ImageBackground } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'

import tw from 'lib/tailwind'
import { cdnImageUrl } from 'lib/cdnImageUrl'

interface Props {
  profilePicture?: string | null
  loading?: boolean
  children: React.ReactNode
  id?: string | number
}

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
const CommunityCardMedia: React.FC<Props> = ({
  profilePicture,
  loading,
  children,
  id,
}) => (
  <ImageBackground
    source={{
      uri: cdnImageUrl(profilePicture, { width: 600, height: 600 }),
    }}
    style={tw`w-full h-full`}
    resizeMode="cover"
  >
    {loading && <ActivityIndicator animating={loading} />}
    <LinearGradient
      colors={gradientFor(id ?? 0)}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={tw`flex-1 p-3 justify-end`}
    >
      <View style={tw`h-full flex justify-between p-3`}>{children}</View>
    </LinearGradient>
  </ImageBackground>
)

export default CommunityCardMedia
