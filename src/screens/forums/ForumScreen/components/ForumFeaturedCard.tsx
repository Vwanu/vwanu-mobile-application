import React from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface Props {
  title: string
  subLabel?: string
  threadCount?: number
  image?: string | null
  onPress?: () => void
}

const ForumFeaturedCard: React.FC<Props> = ({
  title,
  subLabel,
  threadCount,
  image,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={tw`mx-4 mb-4 rounded-card overflow-hidden h-44`}
  >
    <ImageBackground
      source={image ? { uri: image } : undefined}
      style={tw`w-full h-full`}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(27,31,94,0.85)', 'rgba(247,108,94,0.55)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={tw`flex-1 p-4 justify-between`}
      >
        <View style={tw`flex-row`}>
          <View style={tw`bg-white bg-opacity-25 px-3 py-1 rounded-full`}>
            <Text style={tw`text-white font-poppins-semibold text-xs`}>
              {threadCount ?? 0} threads
            </Text>
          </View>
        </View>
        <View>
          {subLabel ? (
            <Text
              style={tw`text-white text-xs font-poppins-medium opacity-80 mb-1 uppercase tracking-widest`}
            >
              {subLabel}
            </Text>
          ) : null}
          <Text style={tw`text-white font-syne-bold text-2xl leading-7`}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
)

export default ForumFeaturedCard
