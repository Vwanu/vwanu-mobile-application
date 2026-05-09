import React, { useMemo, useRef, useState } from 'react'
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import { CommunityStackParams, CommunityInterface } from '../../../types'
import InterestSelector from '../../components/form/InterestSelector'
import {
  useCreateCommunityMutation,
  useFetchCommunityQuery,
  useUpdateCommunityMutation,
} from '../../store/communities-api-slice'
import { useGetPresignedUploadUrlsMutation } from '../../store/uploads-api-slice'
import { uploadToS3 } from '../../lib/uploadToS3'
import { Field, Form } from 'components/form'
import * as Yup from 'yup'
import FormHeader from 'components/form/FormHeader'
import FormContent from 'components/form/FormContent'
import { InferType } from 'yup'
import { isEqual } from 'lodash'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import PrivacySettings from './components/PrivacySettings'

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

const inferMime = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

type NavigationProp = StackNavigationProp<
  CommunityStackParams,
  'CreateCommunity'
>

type CreateCommunityRouteProp = RouteProp<
  CommunityStackParams,
  'CreateCommunity'
>

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  interests: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please select at least one interest')
    .max(5, 'You can select up to 5 interests')
    .required('Interests are required'),
  // privacyType: Yup.string().required('Privacy Type is required'),
  // requireApproval: Yup.boolean().required('Require Approval is required'),
})

const CreateCommunity = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<CreateCommunityRouteProp>()
  const [unifiedError, setUnifiedError] = React.useState<
    FetchBaseQueryError | SerializedError | null
  >(null)

  // Extract communityId from route params and determine mode
  const { communityId } = route.params || {}
  const isEditMode = !!communityId

  // Fetch existing community data if in edit mode
  const {
    data: existingCommunity,
    isLoading: isFetchingCommunity,
    error: fetchError,
  } = useFetchCommunityQuery(communityId || '', {
    skip: !isEditMode,
  })

  // Mutation hooks
  const [createCommunity, { isLoading: isCreating, error: createError }] =
    useCreateCommunityMutation()
  const [updateCommunity, { isLoading: isUpdating, error: updateError }] =
    useUpdateCommunityMutation()
  const [getPresignedUploadUrls] = useGetPresignedUploadUrlsMutation()

  // Picture upload state — owned outside Formik so the upload-on-pick
  // lifecycle is decoupled from form values.
  const existingPictureKeyOrUrl = existingCommunity?.profilePicture
  const [previewUri, setPreviewUri] = useState<string | undefined>()
  const [pictureKey, setPictureKey] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const abortRef = useRef<AbortController | null>(null)

  const startPictureUpload = async (uri: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const filename = uri.split('/').pop() || 'community.jpg'
    const mimeType = inferMime(filename)

    setUploadStatus('uploading')
    try {
      const { files } = await getPresignedUploadUrls({
        files: [{ filename, mimeType, uploadType: 'community' }],
      }).unwrap()
      await uploadToS3(files[0].uploadUrl, uri, mimeType, {
        signal: controller.signal,
      })
      setPictureKey(files[0].key)
      setUploadStatus('done')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error('Community picture upload failed:', err)
      setUploadStatus('error')
    }
  }

  const handlePickPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (result.canceled) return
    const asset = result.assets[0]
    setPreviewUri(asset.uri)
    setPictureKey(undefined)
    void startPictureUpload(asset.uri)
  }

  // Unified loading and error states
  const isLoading = isEditMode ? isFetchingCommunity || isUpdating : isCreating
  const error = fetchError || createError || updateError

  // Transform API data to form values based on mode
  const initialValues = useMemo(() => {
    if (isEditMode && existingCommunity) {
      return {
        name: existingCommunity.name,
        description: existingCommunity.description,
        interests:
          existingCommunity.interests?.map((interest) =>
            interest.id.toString()
          ) || [],
      }
    }
    return {
      name: '',
      description: '',
      interests: [],
    }
  }, [isEditMode, existingCommunity])

  const getEditChangedFields = (
    formData: InferType<typeof ValidationSchema>,
    existingCommunity: CommunityInterface
  ) => {
    const changes: any = {}
    if (formData.name !== existingCommunity.name) {
      changes.name = formData.name
    }
    if (formData.description !== existingCommunity.description) {
      changes.description = formData.description
    }
    // Picture: only include if user picked a new one this session AND
    // the upload completed. Stored as profilePictureKey; backend hook
    // resolves to the persisted profilePicture column.
    if (pictureKey) {
      changes.profilePictureKey = pictureKey
    }
    const existingInterestIds =
      existingCommunity.interests?.map((i) => i.id.toString()) || []
    const formInterestIds = formData.interests || []
    if (
      !isEqual([...existingInterestIds].sort(), [...formInterestIds].sort())
    ) {
      changes.interests = formData.interests
    }
    return changes
  }
  const handleSubmit = async (formData: InferType<typeof ValidationSchema>) => {
    if (isEditMode && communityId && existingCommunity) {
      await updateCommunity({
        id: communityId,
        ...getEditChangedFields(formData, existingCommunity),
      })
        .then(() => navigation.replace('CommunityDetail', { communityId }))
        .catch((err) => {
          setUnifiedError(err)
        })
    } else {
      await createCommunity({
        name: formData.name,
        description: formData.description,
        // The form holds interest IDs as strings; CommunityCreationProps types
        // it as `Interest[]` but the API accepts the IDs and the existing
        // codebase has long passed strings here.
        interests: formData.interests as any,
        profilePictureKey: pictureKey,
      })
        .then((result) => {
          navigation.replace('CommunityDetail', {
            // @ts-ignore
            communityId: result.data?.id,
          })
        })
        .catch((err) => {
          setUnifiedError(err)
        })
    }
  }
  return (
    <Screen loading={isLoading} error={unifiedError as any}>
      <View style={tw`flex-1  px-3`}>
        <Form
          validationSchema={ValidationSchema}
          initialValues={initialValues}
          style={tw`flex-1`}
          onSubmit={handleSubmit}
        >
          <FormHeader
            onClose={() => navigation.goBack()}
            isLoading={isLoading}
            submitTitle={isEditMode ? 'Update' : 'Create'}
            submittingText={isEditMode ? 'Updating...' : 'Creating...'}
            title="Creating community"
          />

          <FormContent>
            <Text category="h6" style={tw`font-poppins-bold text-lg mb-2 mt-4`}>
              Community Image
            </Text>
            <View style={tw`flex items-center mb-4`}>
              <TouchableOpacity
                onPress={handlePickPicture}
                disabled={uploadStatus === 'uploading'}
                style={tw`w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex justify-center items-center`}
              >
                {previewUri ? (
                  <>
                    <Image
                      source={{ uri: previewUri }}
                      style={tw`w-full h-full`}
                    />
                    {uploadStatus === 'uploading' && (
                      <View
                        style={tw`absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
                      >
                        <ActivityIndicator color="#fff" />
                      </View>
                    )}
                    {uploadStatus === 'error' && (
                      <View
                        style={tw`absolute inset-0 bg-red-500 bg-opacity-70 flex justify-center items-center`}
                      >
                        <Text style={tw`text-white font-bold text-xs`}>
                          Tap to retry
                        </Text>
                      </View>
                    )}
                  </>
                ) : existingPictureKeyOrUrl ? (
                  // Renders existing community picture in edit mode. Once
                  // VWA-132's cdnImageUrl helper lands in the parent branch,
                  // wrap this in cdnImageUrl(...) for resized + face-cropped
                  // delivery via CloudFront.
                  <Image
                    source={{ uri: existingPictureKeyOrUrl }}
                    style={tw`w-full h-full`}
                  />
                ) : (
                  <Text style={tw`text-gray-500 text-xs px-2 text-center`}>
                    Tap to add image
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text category="h6" style={tw`font-poppins-bold text-lg mb-3 mt-4`}>
              Basic Information
            </Text>
            <Field
              name="name"
              placeholder="Enter community name"
              style={tw`bg-gray-50 rounded-lg mb-3`}
              textStyle={tw`font-poppins`}
              required
              label="Community Name"
            />

            <Field
              name="description"
              placeholder="Describe your community..."
              style={tw`bg-gray-50 text-base rounded-lg`}
              textStyle={tw`min-h-32 font-poppins`}
              required
              multiline
              numberOfLines={6}
              label="Description"
            />
            <View style={tw`mt-4`} />
            <InterestSelector
              name="interests"
              Label="Interests"
              showCount={true}
              maxSelected={5}
              required={true}
            />
            <PrivacySettings />

            {/* Bottom spacing */}
            <View style={tw`h-20`} />
          </FormContent>
        </Form>
      </View>
    </Screen>
  )
}

export default CreateCommunity
