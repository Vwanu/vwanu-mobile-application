import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { MediaItem } from './useMediaUploads'

interface MediaTileProps {
  item: MediaItem
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

const TILE_SIZE = 100

const MediaTile: React.FC<MediaTileProps> = ({ item, onRemove, onRetry }) => {
  const isUploading = item.status === 'uploading'
  const isError = item.status === 'error'
  const isDone = item.status === 'done'

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.uri }} style={styles.image} />

      {isUploading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#fff" />
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      )}

      {isError && (
        <View style={[styles.overlay, styles.errorOverlay]}>
          <TouchableOpacity
            onPress={() => onRetry(item.id)}
            style={styles.retryButton}
            accessibilityLabel="Retry upload"
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {isDone && (
        <View style={styles.doneBadge}>
          <MaterialCommunityIcons name="check" size={12} color="#fff" />
        </View>
      )}

      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.removeButton}
        accessibilityLabel="Remove media"
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <MaterialCommunityIcons name="close" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%' as const,
    height: '100%' as const,
  },
  overlay: {
    ...({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as const),
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  errorOverlay: {
    backgroundColor: 'rgba(220, 38, 38, 0.7)',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600' as const,
  },
  retryButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  removeButton: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  doneBadge: {
    position: 'absolute' as const,
    bottom: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
}

export default MediaTile
