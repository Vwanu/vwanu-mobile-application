import React from 'react'
import { View, TouchableOpacity, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import InterestPills from './InterestPills'

import CoverCornerButton from './CoverCornerButton'

interface InterestLike {
  id: string | number
  name: string
}

interface Props {
  coverImage?: string
  interests?: InterestLike[]
  onChangeCover?: () => void
  onAddInterests?: () => void
  headerComponent: React.ReactNode
  titleComponent: React.ReactNode
}

const CoverHero = ({
  coverImage,
  interests,
  onChangeCover,
  onAddInterests,
  headerComponent: HeaderComponent,
  titleComponent: TitleComponent,
}: Props) => {
  const hasInterests = !!interests && interests.length > 0

  return (
    <ImageBackground
      source={coverImage ? { uri: coverImage } : undefined}
      style={[tw`w-full`, { height: 300 }]}
    >
      <LinearGradient
        colors={['rgba(27,31,94,0.55)', 'rgba(27,31,94,0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={tw`flex-1 px-4 pb-2`}
      >
        <SafeAreaView style={tw`flex-1`}>
          {HeaderComponent}

          {!coverImage && onChangeCover && (
            <TouchableOpacity
              onPress={onChangeCover}
              activeOpacity={0.85}
              style={tw`self-center mt-4 flex-row items-center px-3 py-1.5 rounded-full border border-white/40`}
            >
              <Ionicons name="image-outline" size={14} color="#FFFFFF" />
              <Text style={tw`text-white text-xs font-poppins-medium ml-1`}>
                Add cover photo
              </Text>
            </TouchableOpacity>
          )}

          <View style={tw`mt-auto`}>
            {hasInterests ? (
              <InterestPills
                interests={interests}
                max={3}
                onMore={onAddInterests}
              />
            ) : onAddInterests ? (
              <TouchableOpacity
                onPress={onAddInterests}
                activeOpacity={0.85}
                style={tw`self-start flex-row items-center px-3 py-1 rounded-full border border-white/40 mb-2`}
              >
                <Ionicons name="add" size={14} color="#FFFFFF" />
                <Text style={tw`text-white text-xs font-poppins-medium ml-1`}>
                  Add interests
                </Text>
              </TouchableOpacity>
            ) : null}
            <View style={{ height: 92, justifyContent: 'flex-end' }}>
              {TitleComponent}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      {coverImage && onChangeCover && (
        <CoverCornerButton onPress={onChangeCover} />
      )}
    </ImageBackground>
  )
}

export default CoverHero
