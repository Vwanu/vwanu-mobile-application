import React, { useCallback } from 'react'
import { string, object } from 'yup'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

import tw from 'lib/tailwind'
import Text from './Text'
import { Form, Submit } from './form'
import { abbreviateNumber } from '../lib/numberFormat'
import LikerPopover from './LikersPopOver'
import useToggle from '../hooks/useToggle'
import { useTheme } from 'hooks/useTheme'

interface PostInputModalInterface {
  id: string
  isReactor: boolean
  likersCount: number
  size: number
  flexDir: 'row' | 'column'
  onLike: (id: string) => Promise<void>
  onToggleLikers?: ({ skip }: { skip: boolean }) => {
    data: Array<{ User: User; createdAt: Date }>
    isFetching: boolean
    refetch: () => void
  }
}

const ValidationSchema = object().shape({
  id: string().label('Content'),
})

const PostInputModal: React.FC<PostInputModalInterface> = ({
  id,
  flexDir,
  size,
  likersCount,
  isReactor,
  onLike,
  onToggleLikers,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showLikers, toggleLikers] = useToggle(false)
  const { isDarkMode } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleSubmit = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    // Trigger heartbeat animation
    scale.value = withSequence(
      withSpring(1.5, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    )

    try {
      await onLike(id)
    } finally {
      setIsLoading(false)
    }
  }, [id, isLoading, onLike, scale])

  const handleShowLikers = () => {
    toggleLikers()
    if (onToggleLikers) {
      onToggleLikers({ skip: !showLikers })
    }
  }

  const LikeCount = () => (
    <TouchableOpacity onLongPress={handleShowLikers}>
      {likersCount > 0 ? (
        <Text
          style={[
            tw`text-primary ml-1 ${isDarkMode ? 'text-gray-300' : ''}`,
            { fontSize: size ? size * 0.9 : 12 },
          ]}
        >
          {likersCount && abbreviateNumber(likersCount)}{' '}
          {flexDir === 'row' ? (likersCount === 1 ? 'kore' : 'kores') : ''}
        </Text>
      ) : (
        <Text
          style={[tw`text-primary ml-1`, { fontSize: size ? size * 0.9 : 12 }]}
        >
          {' '}
        </Text>
      )}
    </TouchableOpacity>
  )

  return (
    <View
      style={tw`flex-${
        flexDir === 'row' ? 'row-reverse ' : 'column -gap-1'
      }  items-center`}
    >
      <LikeCount />
      <Form
        validationSchema={ValidationSchema}
        initialValues={{ id }}
        onSubmit={handleSubmit}
        style={tw`-m-1`}
      >
        <Submit
          disabled={isLoading}
          appearance="ghost"
          accessoryRight={() => (
            <Animated.View style={animatedStyle}>
              <Ionicons
                name={isReactor ? 'heart' : 'heart-outline'}
                size={size || 20}
                color={isReactor ? tw.color('secondary') : tw.color('gray-400')}
              />
            </Animated.View>
          )}
          size="small"
          style={tw`-m-1 -p-1`}
        />
      </Form>
      {showLikers && likersCount > 0 && (
        <LikerPopover
          id={id}
          visible={showLikers}
          onDismiss={toggleLikers}
          fetchLikers={onToggleLikers}
        />
      )}
    </View>
  )
}

export default PostInputModal
