import React, { useState } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

import Text from 'components/Text'
import MediaTile from '../../MediaTile'
import { useMediaUploads } from '../../useMediaUploads'
import { inferMediaInputs } from '../lib/mediaInputs'

const MAX_PRESIGN_FILES_PER_POST = 5

interface Props {
  mediaUploads: ReturnType<typeof useMediaUploads>
}

const PresignMediaPicker: React.FC<Props> = ({ mediaUploads }) => {
  const [picking, setPicking] = useState(false)

  const remainingSlots = MAX_PRESIGN_FILES_PER_POST - mediaUploads.items.length

  const handlePick = async () => {
    if (picking || remainingSlots <= 0) return
    setPicking(true)
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      })

      if (result.canceled) return

      const inputs = inferMediaInputs(result.assets).slice(0, remainingSlots)
      await mediaUploads.addFiles(inputs)
    } catch (error) {
      console.error('PresignMediaPicker: image picker error:', error)
    } finally {
      setPicking(false)
    }
  }

  return (
    <View style={presignPickerStyles.container}>
      <View style={presignPickerStyles.header}>
        <View style={presignPickerStyles.headerLeft}>
          <MaterialCommunityIcons name="file-image" size={20} color="#374151" />
          <Text style={presignPickerStyles.headerTitle}>Photos</Text>
        </View>
        <View style={presignPickerStyles.countBadge}>
          <Text style={presignPickerStyles.countText}>
            {mediaUploads.items.length}/{MAX_PRESIGN_FILES_PER_POST}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={presignPickerStyles.tilesRow}
      >
        <TouchableOpacity
          onPress={handlePick}
          disabled={picking || remainingSlots <= 0}
          style={[
            presignPickerStyles.addButton,
            (picking || remainingSlots <= 0) &&
              presignPickerStyles.addButtonDisabled,
          ]}
          accessibilityLabel="Add media"
        >
          <MaterialCommunityIcons
            name={picking ? 'loading' : 'camera-plus'}
            size={28}
            color="#3B82F6"
          />
        </TouchableOpacity>

        {mediaUploads.items.map((item) => (
          <MediaTile
            key={item.id}
            item={item}
            onRemove={mediaUploads.removeItem}
            onRetry={mediaUploads.retryItem}
          />
        ))}
      </ScrollView>

      {mediaUploads.hasError && (
        <Text style={presignPickerStyles.warningText}>
          Some media failed to upload. Tap retry on the red tile, or remove it
          and post anyway.
        </Text>
      )}
    </View>
  )
}

const presignPickerStyles = {
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  countText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#3B82F6',
  },
  tilesRow: {
    paddingHorizontal: 4,
    alignItems: 'center' as const,
  },
  addButton: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed' as const,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  warningText: {
    marginTop: 8,
    fontSize: 12,
    color: '#B45309',
    paddingHorizontal: 4,
  },
}

export default PresignMediaPicker
