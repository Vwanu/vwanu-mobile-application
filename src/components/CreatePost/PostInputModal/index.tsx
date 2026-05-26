import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { string, object, mixed, InferType, array, number } from 'yup'
import { useSelector } from 'react-redux'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { styles } from './style'

import tw from 'lib/tailwind'
import ProfAvatar from '../../ProfAvatar'
import { Form, ImageFields, PrivacyNoticeField, MentionInput } from '../../form'
import ModalSubmitPill from 'components/ui/ModalSubmitPill'
import ModalCloseButton from 'components/ui/ModalCloseButton'
import ModalActionPill from 'components/ui/ModalActionPill'
import { useFetchCommunityQuery } from 'store/communities-api-slice'
import Text from '../../Text'
import {
  useCreatePostMutation,
  useCreatePostWithMediaKeysMutation,
} from 'store/post'
import extractMentionIds from 'utils/extractMentionIds'

import { Notice } from '../../../../types'
import { useFetchProfileQuery } from 'store/profiles'
import { RootState } from 'store'
import { useFormikContext } from 'formik'
import routes from 'navigation/routes'
import { colors } from 'components/ui/tokens'
import { useMediaUploads, MediaItemInput } from '../useMediaUploads'
import MediaTile from '../MediaTile'

const PRESIGN_ENABLED = process.env.EXPO_PUBLIC_USE_PRESIGN_UPLOAD === 'true'

const EXTENSION_FROM_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const inferMediaInputs = (
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

interface PostInputModalInterface {
  visible: boolean
  openBottomSheet: boolean
  onClose?: () => void
  communityId?: string
}

export interface PostInputModalHandle {
  focus: () => void
}
const POST_INPUT_MODAL_CLOSE_TIMEOUT = 250 // 250ms

const ValidationSchema = object().shape({
  postText: string().label('Content'),
  privacyType: mixed<Notice>().required().label('Privacy Type'),
  postImage: array().of(string()).label('Images'),
  communityId: string().label('Community ID').optional(),
})

const PostInputModal: React.FC<PostInputModalInterface> = ({
  visible,
  onClose,
  openBottomSheet,
  communityId,
}) => {
  const navigation = useNavigation()
  const { userId } = useSelector((state: RootState) => state.auth)
  const { data: user } = useFetchProfileQuery(userId!)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = React.useMemo(() => [40, 100], [])
  const iniTialsnapPointIndex = openBottomSheet ? 1 : 0
  const [createPost, multipartResult] = useCreatePostMutation()
  const [createPostWithMediaKeys, presignResult] =
    useCreatePostWithMediaKeysMutation()
  const mediaUploads = useMediaUploads({ uploadType: 'post' })

  const result = PRESIGN_ENABLED ? presignResult : multipartResult

  const [postText, setPostText] = useState('')
  const spinAnim = useRef(new Animated.Value(0)).current

  const initialValues: InferType<typeof ValidationSchema> = {
    postText: '',
    privacyType: 'public',
    postImage: [],
    communityId: communityId,
  }

  // Spinning animation for loading icon
  React.useEffect(() => {
    if (result.isLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
      spinAnimation.start()
      return () => spinAnimation.stop()
    }
  }, [result.isLoading])

  // Handle post creation result
  React.useEffect(() => {
    if (result.isSuccess) {
      // Show success briefly, then close and navigate to feed
      setTimeout(() => {
        handleClose()
        // Navigate to the timeline/feed
        try {
          navigation.navigate(routes.TIMELINE as never)
        } catch (error) {
          console.log(
            'Navigation: Could not navigate to timeline, but post was created successfully'
          )
          // If navigation fails, at least the modal will close and the post was created
        }
      }, POST_INPUT_MODAL_CLOSE_TIMEOUT)
    }
    if (result.isError) {
      console.error(result.error)
    }
  }, [result.isSuccess, result.isError, navigation])

  const handleClose = () => {
    if (PRESIGN_ENABLED) mediaUploads.clearAll()
    if (onClose) onClose()
  }

  const isPostReady = postText.trim().length > 0
  const isSubmitDisabled =
    !isPostReady ||
    result.isLoading ||
    (PRESIGN_ENABLED && mediaUploads.isAnyUploading)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 bg-black/40 justify-end`}>
          <TouchableOpacity
            activeOpacity={1}
            style={tw`flex-1`}
            onPress={handleClose}
          />
          <View
            style={[
              tw`rounded-t-3xl pb-3`,
              {
                backgroundColor: colors.warmSurface,
                maxHeight: '92%',
                minHeight: 540,
              },
            ]}
          >
            <View style={tw`items-center pt-2 pb-1`}>
              <View
                style={[
                  tw`h-1 w-12 rounded-full`,
                  { backgroundColor: colors.warmBorderStrong },
                ]}
              />
            </View>

            <Form
              validationSchema={ValidationSchema}
              initialValues={initialValues}
              onSubmit={async (values) => {
                if (PRESIGN_ENABLED) {
                  await createPostWithMediaKeys({
                    postText: values.postText,
                    privacyType: values.privacyType,
                    communityId: values.communityId,
                    mediaKeys: mediaUploads.getCompletedKeys(),
                  })
                  return
                }

                const mentions = extractMentionIds(values.postText || '')

                //@ts-ignore
                await createPost({ ...values, mentions })
              }}
              style={tw`flex-1`}
            >
              <View
                style={tw`flex-row items-center justify-between px-4 pt-3 pb-3`}
              >
                <ModalCloseButton onPress={handleClose} />
                <Text style={tw`font-syne-bold text-base text-ink`}>
                  Create Post
                </Text>
                <FormSubmitPill
                  enabled={!isSubmitDisabled}
                  loading={result.isLoading}
                />
              </View>

              <PostingInPill communityId={communityId} />

              <View style={tw`flex-row items-center justify-between px-4 py-2`}>
                <View style={tw`flex-1 min-w-0 mr-3 overflow-hidden`}>
                  <ProfAvatar
                    user={user!}
                    subtitle="Share your thoughts with the community"
                  />
                </View>
                <View
                  style={[
                    tw`p-2 rounded-full border`,
                    { borderColor: colors.warmBorder },
                  ]}
                >
                  <PrivacyNoticeField
                    displayLong
                    name="privacyType"
                    canEdit={true}
                    isEditing={false}
                  />
                </View>
              </View>

              <ScrollView
                style={tw`flex-1 px-4`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <MentionInput
                  name="postText"
                  placeholder="What's on your mind?"
                  autoCapitalize="sentences"
                  style={styles.textInput}
                  multiline={true}
                  textAlignVertical="top"
                />

                <PostTextSync onTextChange={setPostText} />

                <View style={tw`flex-row justify-end pb-2`}>
                  <Text
                    style={[
                      tw`font-poppins-medium text-xs`,
                      {
                        color:
                          postText.length > 280 ? colors.coral : colors.mute,
                      },
                    ]}
                  >
                    {postText.length}/500
                  </Text>
                </View>
              </ScrollView>

              <View
                style={[
                  tw`flex-row items-center px-4 py-3 border-t`,
                  { borderColor: colors.warmBorder },
                ]}
              >
                <ModalActionPill
                  icon="image-multiple"
                  iconSet="material-community"
                  label="Add Media"
                  onPress={() => bottomSheetRef.current?.expand()}
                />
                <ModalActionPill
                  icon="map-marker"
                  iconSet="material-community"
                  label="Location"
                />
                <ModalActionPill
                  icon="account-group"
                  iconSet="material-community"
                  label="Tag People"
                />
              </View>

              {/*@ts-ignore */}
              <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={iniTialsnapPointIndex}
                enablePanDownToClose={false}
                style={styles.bottomSheet}
                handleIndicatorStyle={styles.bottomSheetHandle}
                backgroundStyle={styles.bottomSheetBackground}
              >
                {/*@ts-ignore */}
                <BottomSheetView style={styles.bottomSheetContent}>
                  {PRESIGN_ENABLED ? (
                    <PresignMediaPicker mediaUploads={mediaUploads} />
                  ) : (
                    <ImageFields name="postImage" />
                  )}
                </BottomSheetView>
              </BottomSheet>
            </Form>
          </View>
        </View>
      </KeyboardAvoidingView>

      {result.isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            {result.isSuccess ? (
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
              {result.isSuccess
                ? 'Post created successfully!'
                : 'Creating your post...'}
            </Text>
            <Text style={styles.loadingSubtext}>
              {result.isSuccess
                ? 'Your post has been shared with the community'
                : 'Please wait while we upload your content'}
            </Text>
          </View>
        </View>
      )}
    </Modal>
  )
}
const PostTextSync: React.FC<{ onTextChange: (text: string) => void }> = ({
  onTextChange,
}) => {
  const { values } = useFormikContext<any>()
  React.useEffect(() => {
    onTextChange(values.postText || '')
  }, [values.postText])
  return null
}

const FormSubmitPill: React.FC<{ enabled: boolean; loading?: boolean }> = ({
  enabled,
  loading,
}) => {
  const { handleSubmit } = useFormikContext()
  return (
    <ModalSubmitPill
      enabled={enabled}
      loading={loading}
      onPress={() => handleSubmit()}
    />
  )
}

const PostingInPill: React.FC<{ communityId?: string }> = ({ communityId }) => {
  const { data: community } = useFetchCommunityQuery(communityId!, {
    skip: !communityId,
  })
  const label = community?.name ?? 'Feed'
  return (
    <View style={tw`px-4 pb-1`}>
      <View
        style={[
          tw`flex-row items-center self-start px-3 py-1.5 rounded-full`,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        <Ionicons
          name={communityId ? 'people-outline' : 'globe-outline'}
          size={12}
          color={colors.primaryDeep}
        />
        <Text
          style={[
            tw`ml-1.5 font-poppins-medium text-xs`,
            { color: colors.primaryDeep },
          ]}
        >
          Posting in {label}
        </Text>
      </View>
    </View>
  )
}

const MAX_PRESIGN_FILES_PER_POST = 5

interface PresignMediaPickerProps {
  mediaUploads: ReturnType<typeof useMediaUploads>
}

const PresignMediaPicker: React.FC<PresignMediaPickerProps> = ({
  mediaUploads,
}) => {
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

export default PostInputModal
