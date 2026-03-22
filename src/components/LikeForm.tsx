import React, { useCallback, useRef } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

import tw from 'lib/tailwind'
import Text from './Text'
import { abbreviateNumber } from '../lib/numberFormat'
import useToggle from '../hooks/useToggle'
import { useTheme } from 'hooks/useTheme'

interface LikeFormProps {
  id: string
  isReactor: boolean
  likersCount: number
  size: number
  flexDir: 'row' | 'column'
  onLike: (id: string) => Promise<void>
  onToggleLikers?: () => void
}

const LikeForm: React.FC<LikeFormProps> = ({
  id,
  flexDir,
  size,
  likersCount,
  isReactor,
  onLike,
  onToggleLikers,
}) => {
  const isLoadingRef = useRef(false)
  const { isDarkMode } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    // Trigger heartbeat animation
    scale.value = withSequence(
      withSpring(1.5, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    )

    try {
      await onLike(id)
    } finally {
      isLoadingRef.current = false
    }
  }, [id, onLike, scale])

  return (
    <View
      style={tw`flex-${
        flexDir === 'row' ? 'row-reverse ' : 'column -gap-1'
      }  items-center`}
    >
      <TouchableOpacity
        disabled={likersCount === 0 || !onToggleLikers}
        onLongPress={() => {
          onToggleLikers?.()
        }}
      >
        {likersCount > 0 ? (
          <Text
            style={[
              tw`text-primary ml-1 ${isDarkMode ? 'text-gray-300' : ''}`,
              { fontSize: size ? size * 0.9 : 12 },
            ]}
          >
            {abbreviateNumber(likersCount)}{' '}
            {flexDir === 'row' ? (likersCount === 1 ? 'kore' : 'kores') : ''}
          </Text>
        ) : (
          <Text
            style={[
              tw`text-primary ml-1`,
              { fontSize: size ? size * 0.9 : 12 },
            ]}
          >
            {' '}
          </Text>
        )}
      </TouchableOpacity>
      <Pressable onPress={handlePress}>
        <Animated.View style={animatedStyle}>
          <Ionicons
            name={isReactor ? 'heart' : 'heart-outline'}
            size={size || 20}
            color={isReactor ? tw.color('secondary') : tw.color('gray-400')}
          />
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default LikeForm
