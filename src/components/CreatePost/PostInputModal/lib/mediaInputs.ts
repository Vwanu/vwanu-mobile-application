import * as ImagePicker from 'expo-image-picker'

import { MediaItemInput } from '../../useMediaUploads'

export const EXTENSION_FROM_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const inferMediaInputs = (
  assets: ImagePicker.ImagePickerAsset[]
): MediaItemInput[] =>
  assets.map((asset) => {
    const fallbackName = asset.uri.split('/').pop() || 'media'
    const mimeType = asset.mimeType || 'image/jpeg'
    const ext = EXTENSION_FROM_MIME[mimeType] || 'jpg'
    const filename =
      asset.fileName ||
      (fallbackName.includes('.') ? fallbackName : `${fallbackName}.${ext}`)
    return { uri: asset.uri, mimeType, filename }
  })
