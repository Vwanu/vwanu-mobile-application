import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'
import { Blog } from '../../../../types'
import BlogHero from './BlogHero'
import BlogTitle from './BlogTitle'
import BlogMetaBar from './BlogMetaBar'
import Body from './Body'

// Scroll distance (px) over which the hero collapses into the sticky header.
const COLLAPSE_DISTANCE = 120

interface Props {
  blog: Blog
  content: boolean
  onToggle: (heroCollapsed: boolean) => void
  onLike: (id: string) => Promise<void>
  onClose: () => void
}

const BlogReadingView: React.FC<Props> = ({
  blog,
  content,
  onToggle,
  onLike,
  onClose,
}) => {
  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  // Report whether the hero is collapsed when toggling, so the comment view
  // can animate the cover back in only if it had vanished.
  const handleToggle = () => onToggle(scrollY.value >= COLLAPSE_DISTANCE)

  const heroStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, COLLAPSE_DISTANCE],
          [0, -40],
          Extrapolation.CLAMP
        ),
      },
    ],
  }))

  // The in-scroll meta bar fades out before the sticky one fades in, so the two
  // are never visible at the same time.
  const inlineMetaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }))

  const compactStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.5, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [COLLAPSE_DISTANCE * 0.5, COLLAPSE_DISTANCE],
          [-16, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }))

  return (
    <View style={tw`flex-1`}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        <Animated.View style={heroStyle}>
          <BlogHero blog={blog} onClose={onClose} />
        </Animated.View>
        <Animated.View style={inlineMetaStyle}>
          <BlogMetaBar
            blog={blog}
            content={content}
            onToggle={handleToggle}
            onLike={onLike}
          />
        </Animated.View>
        <Body blog={blog} />
      </Animated.ScrollView>

      <Animated.View
        style={[tw`absolute top-0 left-0 right-0 bg-warm-bg`, compactStyle]}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={['top']}>
          <View style={tw`flex-row items-center px-2 pt-1`}>
            <TouchableOpacity onPress={onClose} hitSlop={8} style={tw`p-2`}>
              <Ionicons name="chevron-back" size={22} color={colors.ink} />
            </TouchableOpacity>
            <View style={tw`flex-1`}>
              <BlogMetaBar
                blog={blog}
                content={content}
                onToggle={handleToggle}
                onLike={onLike}
              />
            </View>
          </View>
          <BlogTitle
            title={blog.title}
            color={colors.ink}
            style={tw`px-4 pb-2`}
          />
        </SafeAreaView>
      </Animated.View>
    </View>
  )
}

export default BlogReadingView
