import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useFormikContext } from 'formik'

import Text from 'components/Text'
import tw from 'lib/tailwind'

interface Props {
  name: string
  label?: string
  helperText?: string
}

const ImageUploadSection: React.FC<Props> = ({
  name,
  label = 'Community Image',
  helperText,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const { setFieldValue, values } = useFormikContext()

  // Initialize imageUri from Formik values when value exists (for edit mode)
  useEffect(() => {
    const fieldValue = (values as any)[name]
    if (fieldValue && !imageUri) {
      setImageUri(fieldValue)
    }
  }, [(values as any)[name]])
  const onImageSelected = (uri: string) => {
    setImageUri(uri)
    setFieldValue(name, uri)
  }
  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!'
        )
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.')
    }
  }

  const handleCamera = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera is required!'
        )
        return
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.')
    }
  }

  const showImageOptions = () => {
    Alert.alert('Select Image', `Choose how you want to add an image`, [
      {
        text: 'Camera',
        onPress: handleCamera,
      },
      {
        text: 'Photo Library',
        onPress: handleImagePicker,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ])
  }

  return (
    <View style={tw`bg-white px-4 py-6 border-b border-gray-100`}>
      <Text category="h6" style={tw`font-semibold text-lg mb-4`}>
        {label}
      </Text>

      <TouchableOpacity
        style={tw`w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300`}
        onPress={showImageOptions}
      >
        {imageUri ? (
          <ImageBackground
            source={{ uri: imageUri }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          >
            <View
              style={tw`bg-black bg-opacity-30 w-full h-full flex justify-center items-center`}
            >
              <TouchableOpacity
                style={tw`bg-white bg-opacity-90 w-12 h-12 rounded-full items-center justify-center`}
                onPress={showImageOptions}
              >
                <Ionicons name="camera" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <View
            style={tw`w-full h-full bg-gray-50 flex justify-center items-center`}
          >
            <View style={tw`items-center`}>
              <View
                style={tw`w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-3`}
              >
                <Ionicons name="camera-outline" size={32} color="#6B7280" />
              </View>
              <Text style={tw`text-gray-600 font-medium text-base mb-1`}>
                Add {label}
              </Text>
              <Text style={tw`text-gray-500 text-sm text-center`}>
                {helperText || `Tap to upload a cover image`}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <Text style={tw`text-gray-500 text-xs mt-2`}>
        Recommended size: 1200x675px (16:9 ratio)
      </Text>
    </View>
  )
}

export default ImageUploadSection
