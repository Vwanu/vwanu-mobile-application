import React, { useRef, useState } from 'react'
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// Custom dependencies
import tw from '../../lib/tailwind'
import Text from '../../components/Text'
import Button from '../../components/Button'
import PageWrapper from '../../components/PageWrapper'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  useFetchProfileQuery,
  useUpdateProfileMutation,
} from '../../store/profiles'
import { useGetPresignedUploadUrlsMutation } from '../../store/uploads-api-slice'
import { uploadToS3 } from '../../lib/uploadToS3'
import AvatarGroup from 'components/AvatarGroups'
import image from '../../config/image'
import { User } from '../../../types.d'

const IconWithArrow: React.FC = () => (
  <MaterialCommunityIcons
    name="chevron-right"
    size={24}
    color="white"
    style={tw`-ml-4`}
  />
)

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

const inferMime = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

const ProfilePictureForm: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: profile } = useFetchProfileQuery(userId!)
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [getPresignedUploadUrls] = useGetPresignedUploadUrlsMutation()

  const [previewUri, setPreviewUri] = useState<string | undefined>()
  const [mediaKey, setMediaKey] = useState<string | undefined>()
  const [status, setStatus] = useState<UploadStatus>('idle')
  const abortRef = useRef<AbortController | null>(null)

  const startUpload = async (uri: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const filename = uri.split('/').pop() || 'avatar.jpg'
    const mimeType = inferMime(filename)

    setStatus('uploading')
    try {
      const { files } = await getPresignedUploadUrls({
        files: [
          {
            filename,
            mimeType,
            uploadType: 'profile',
            fileType: 'profilePicture',
          },
        ],
      }).unwrap()
      await uploadToS3(files[0].uploadUrl, uri, mimeType, {
        signal: controller.signal,
      })
      setMediaKey(files[0].key)
      setStatus('done')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error('Profile picture upload failed:', err)
      setStatus('error')
    }
  }

  const handlePick = async () => {
    const { status: perm } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (perm !== 'granted') return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (result.canceled) return

    const asset = result.assets[0]
    setPreviewUri(asset.uri)
    setMediaKey(undefined)
    void startUpload(asset.uri)
  }

  const submitDisabled = status === 'uploading' || isUpdating || !mediaKey

  const handleSubmit = () => {
    if (!mediaKey) return
    updateProfile({
      id: userId!,
      data: {
        profilePictureKey: mediaKey,
        nextCompletionStep: 4,
      },
    })
  }

  const handleSkip = () => {
    updateProfile({
      id: userId!,
      data: {
        profilePicture: `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}`,
        nextCompletionStep: 4,
      },
    })
  }

  return (
    <PageWrapper title="" subtitle="" pageNumber={3} loading={false}>
      <View style={tw`flex-1 flex justify-between mt-10`}>
        <View style={tw`flex items-center mt-10`}>
          <View style={tw`mt-5`}>
            <View style={tw`flex-col items-center`}>
              <AvatarGroup
                size={50}
                avatars={[
                  {
                    firstName: 'John',
                    lastName: 'Doe',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=ffffff',
                  } as User,
                  {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=ffffff',
                  } as User,
                  {
                    firstName: 'Mike',
                    lastName: 'Johnson',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=Mike+Johnson&background=10B981&color=ffffff',
                  } as User,
                  {
                    firstName: 'Sarah',
                    lastName: 'Wilson',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=Sarah+Wilson&background=F59E0B&color=ffffff',
                  } as User,
                  {
                    firstName: 'Alex',
                    lastName: 'Brown',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=Alex+Brown&background=8B5CF6&color=ffffff',
                  } as User,
                  {
                    firstName: 'Emma',
                    lastName: 'Davis',
                    profilePicture:
                      'https://ui-avatars.com/api/?name=Emma+Davis&background=EF4444&color=ffffff',
                  } as User,
                ]}
              />
              <Text
                style={tw`text-blue-600 text-xl text-center mt-5 font-extrabold tracking-wide`}
              >
                ✨ We love a great looking profile picture ✨
              </Text>
              <Text
                style={tw`text-blue-500 text-lg text-center mb-5 font-bold tracking-wide`}
              >
                Let's make or choose one
              </Text>

              <TouchableOpacity
                onPress={handlePick}
                disabled={status === 'uploading'}
                style={tw`w-60 h-60 rounded-full bg-gray-200 overflow-hidden flex justify-center items-center`}
              >
                {previewUri ? (
                  <>
                    <Image
                      source={{ uri: previewUri }}
                      style={tw`w-full h-full`}
                    />
                    {status === 'uploading' && (
                      <View
                        style={tw`absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
                      >
                        <ActivityIndicator color="#fff" />
                      </View>
                    )}
                    {status === 'error' && (
                      <View
                        style={tw`absolute inset-0 bg-red-500 bg-opacity-70 flex justify-center items-center`}
                      >
                        <Text style={tw`text-white font-bold`}>
                          Tap to retry
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Image
                    source={image.appIcon}
                    style={tw`w-40 h-40 rounded-full`}
                  />
                )}
              </TouchableOpacity>

              <View
                style={tw`mt-2 mb-2 flex justify-center items-center w-full`}
              >
                <Image
                  source={image.connectedPeople[4]}
                  style={[
                    tw`w-30 h-30`,
                    { transform: [{ rotate: '-180deg' }] },
                  ]}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={tw`mt-2`}>
              <Text style={tw`text-[#979292] text-lg text-center`}>
                Choose a profile picture
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={tw`flex flex-row justify-between`}>
            <Button
              title="Skip"
              appearance="ghost"
              style={tw`text-black`}
              textStyle={tw`text-black`}
              onPress={handleSkip}
            />
            <Button
              title={status === 'uploading' ? 'Uploading...' : 'Register'}
              // @ts-ignore
              accessoryRight={IconWithArrow}
              appearance="filled"
              style={tw`bg-primary flex-1 w-full`}
              textStyle={tw`text-white font-bold`}
              onPress={handleSubmit}
              disabled={submitDisabled}
            />
          </View>
        </View>
      </View>
    </PageWrapper>
  )
}

export default ProfilePictureForm
