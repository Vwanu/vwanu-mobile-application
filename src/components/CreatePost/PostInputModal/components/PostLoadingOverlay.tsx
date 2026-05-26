import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Text from 'components/Text'
import { colors } from 'components/ui/tokens'
import { styles } from '../style'

interface Props {
  isSuccess: boolean
}

const PostLoadingOverlay: React.FC<Props> = ({ isSuccess }) => {
  const spinAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isSuccess) return
    const spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    )
    spinAnimation.start()
    return () => spinAnimation.stop()
  }, [isSuccess])

  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContent}>
        {isSuccess ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={40}
            color="#10B981"
            style={styles.loadingIcon}
          />
        ) : (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: spinAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            <MaterialCommunityIcons
              name="loading"
              size={40}
              color={colors.primaryDeep}
              style={styles.loadingIcon}
            />
          </Animated.View>
        )}
        <Text style={styles.loadingText}>
          {isSuccess ? 'Post created successfully!' : 'Creating your post...'}
        </Text>
        <Text style={styles.loadingSubtext}>
          {isSuccess
            ? 'Your post has been shared with the community'
            : 'Please wait while we upload your content'}
        </Text>
      </View>
    </View>
  )
}

export default PostLoadingOverlay
