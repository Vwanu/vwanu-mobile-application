import React from 'react'
import { View, SafeAreaView } from 'react-native'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'

import tw from 'lib/tailwind'
import HeroActionBar from './HeroActionBar'
import InterestPills from './InterestPills'
import TitleField from './TitleField'
import CoverCornerButton from './CoverCornerButton'

interface InterestLike {
  id: string | number
  name: string
}

interface Props {
  coverImage?: string
  interests?: InterestLike[]
  onClose?: () => void
  onSave?: () => void
  onMenu?: () => void
  onChangeCover?: () => void
  isSubmitting?: boolean
  isDraft?: boolean
}

const CoverHero = ({
  coverImage,
  interests,
  onClose,
  onSave,
  onMenu,
  onChangeCover,
  isSubmitting,
  isDraft,
}: Props) => (
  <ImageBackground
    source={coverImage ? { uri: coverImage } : undefined}
    style={[tw`w-full`, { minHeight: 240 }]}
  >
    <LinearGradient
      colors={['rgba(27,31,94,0.55)', 'rgba(27,31,94,0.92)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={tw`flex-1 px-4 pb-2`}
    >
      <SafeAreaView style={tw`flex-1`}>
        <HeroActionBar
          onClose={onClose}
          onSave={onSave}
          onMenu={onMenu}
          isSubmitting={isSubmitting}
          isDraft={isDraft}
        />
        <View style={tw`mt-auto`}>
          <InterestPills interests={interests} />
          <TitleField light />
        </View>
      </SafeAreaView>
    </LinearGradient>
    {onChangeCover && <CoverCornerButton onPress={onChangeCover} />}
  </ImageBackground>
)

export default CoverHero
