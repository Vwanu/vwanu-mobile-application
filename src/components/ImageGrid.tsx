import React, { useMemo } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { Image } from 'expo-image'
import { Video, ResizeMode } from 'expo-av'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import tw from '../lib/tailwind'
import { Media } from '../../types'
import { splitImages } from '../lib/splitImages'
import { cdnImageUrl } from '../lib/cdnImageUrl'

/**
 * Props for the ImageGrid component.
 *
 * @interface ImageGridProps
 * @property {Media[]} medias - An array of media objects to be displayed in the grid.
 * @property {any} [style] - Optional custom styles to be applied to the grid.
 * @property {(id: number) => void} [onImageTouch] - Optional callback function to handle image touch events, receives the image id as a parameter.
 */
interface ImageGridProps {
  medias: Media[]
  style?: any
  onImageTouch?: (id: number) => void
}

const ImageGrid: React.FC<ImageGridProps> = (props) => {
  // Memoize expensive calculations
  const screenWidth = useMemo(() => Dimensions.get('screen').width, [])
  const { leftColumn, rightColumn } = useMemo(
    () => splitImages(props.medias),
    [props.medias]
  )

  // Check if video support is available
  const hasVideoSupport = () => {
    try {
      require('expo-av')
      return true
    } catch {
      return false
    }
  }

  // Helper function to determine if the URI is a video
  const isVideo = (uri: string) => {
    return (
      uri &&
      (uri.includes('.mp4') ||
        uri.includes('.mov') ||
        uri.includes('.avi') ||
        uri.includes('video') ||
        uri.includes('.webm'))
    )
  }

  // Component to render media (image or video) - memoized for performance
  const MediaItem = React.memo(
    ({ item, style }: { item: Media; style: any }) => (
      <View style={[style, { position: 'relative' }]}>
        {hasVideoSupport() && isVideo(item.original) ? (
          <>
            <Video
              source={{ uri: item.original }}
              style={style}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              isLooping={false}
              isMuted={true}
            />
            {/* Video play icon overlay */}
            <View
              style={[
                StyleSheet.absoluteFillObject,
                tw`flex justify-center items-center`,
              ]}
            >
              <View style={tw`bg-black bg-opacity-50 rounded-full p-3`}>
                <MaterialCommunityIcons name="play" size={32} color="white" />
              </View>
            </View>
          </>
        ) : (
          <Image
            source={{ uri: cdnImageUrl(item.original, 'medium') }}
            style={style}
            contentFit="cover"
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            placeholderContentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        )}
      </View>
    )
  )

  // Memoize column widths
  const leftColumnWidth = useMemo(
    () => (rightColumn.length > 0 ? screenWidth / 2 - 12 : screenWidth - 24),
    [screenWidth, rightColumn.length]
  )

  const rightColumnWidth = useMemo(() => screenWidth / 2 - 12, [screenWidth])

  // Render left column item
  const renderLeftColumnItem = React.useCallback(
    (image: Media) => (
      <TouchableOpacity
        key={image.id}
        style={[
          tw`rounded-l-lg overflow-hidden ${
            !rightColumn.length ? 'rounded-r-lg' : ''
          }`,
          {
            width: leftColumnWidth,
            marginBottom: 2,
          },
        ]}
        onPress={() => props?.onImageTouch?.(image.id)}
        activeOpacity={0.8}
      >
        <MediaItem
          item={image}
          style={{
            width: leftColumnWidth,
            height: image.height,
          }}
        />
      </TouchableOpacity>
    ),
    [leftColumnWidth, rightColumn.length, props]
  )

  // Render right column item
  const renderRightColumnItem = React.useCallback(
    (image: Media) => (
      <TouchableOpacity
        key={image.id}
        style={[
          tw`rounded-r-lg overflow-hidden`,
          {
            marginBottom: 2,
            marginLeft: 4,
          },
        ]}
        onPress={() => props?.onImageTouch?.(image.id)}
        activeOpacity={0.8}
      >
        <MediaItem
          item={image}
          style={{
            width: rightColumnWidth,
            height: image.height,
          }}
        />
      </TouchableOpacity>
    ),
    [rightColumnWidth, props]
  )

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.columnsContainer}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {leftColumn.map(renderLeftColumnItem)}
        </View>

        {/* Right Column */}
        {rightColumn.length > 0 && (
          <View style={styles.rightColumn}>
            {rightColumn.map(renderRightColumnItem)}
          </View>
        )}
      </View>
    </View>
  )
}

export default ImageGrid

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  columnsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    margin: 2,
    maxWidth: Dimensions.get('screen').width - 16,
  },
})
