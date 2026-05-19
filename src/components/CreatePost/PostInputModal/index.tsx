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
} from 'react-native'
import { styles } from './style'

import tw from 'lib/tailwind'
import ProfAvatar from '../../ProfAvatar'
import { Form, Submit, PrivacyNoticeField, MentionInput } from '../../form'
import Text from '../../Text'
import { useCreatePostMutation } from 'store/post'

import { Notice } from '../../../../types'
import { useFetchProfileQuery } from 'store/profiles'
import { RootState } from 'store'
import { useFormikContext } from 'formik'
import routes from 'navigation/routes'
import { useTheme } from 'hooks/useTheme'
import { useMediaUploads, MediaItemInput } from '../useMediaUploads'
import MediaTile from '../MediaTile'

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
  const [createPost, result] = useCreatePostMutation()
  const mediaUploads = useMediaUploads({ uploadType: 'post' })

  const [postText, setPostText] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const spinAnim = useRef(new Animated.Value(0)).current

  const initialValues: InferType<typeof ValidationSchema> = {
    postText: '',
    privacyType: 'public',
    postImage: [],
    communityId: communityId,
  }
  // React.useEffect(() => {
  //   if (communityId) {
  //      initialValues.communityId = communityId
  //   }
  // }, [communityId])
  // console.log('communityId', communityId)

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

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
    mediaUploads.clearAll()
    if (onClose) onClose()
  }

  const isPostReady = postText.trim().length > 0
  const isSubmitDisabled =
    !isPostReady || result.isLoading || mediaUploads.isAnyUploading
  const { isDarkMode } = useTheme()

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
      // statusBarTranslucent
    >
      {/* <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" /> */}

      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Form
          validationSchema={ValidationSchema}
          initialValues={initialValues}
          onSubmit={async (values) => {
            await createPost({
              postText: values.postText,
              privacyType: values.privacyType,
              communityId: values.communityId,
              mediaKeys: mediaUploads.getCompletedKeys(),
            })
          }}
          style={tw`flex-1`}
        >
          {/* Enhanced Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: isDarkMode ? 'gray-800' : 'white',
                borderBottomColor: isDarkMode
                  ? tw.color('border-primary')
                  : 'gray-200',
              },
            ]}
          >
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>

            <Text>Create Post</Text>

            <Submit
              title={result.isLoading ? 'Posting...' : 'Post'}
              size="small"
              disabled={isSubmitDisabled}
              style={[
                styles.postButton,
                isPostReady && styles.postButtonActive,
                result.isLoading && styles.postButtonLoading,
              ]}
              textStyle={[
                styles.postButtonText,
                isPostReady && styles.postButtonTextActive,
              ]}
            />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Enhanced User Section */}
            <View
              style={[
                styles.userSection,
                {
                  borderBottomColor: isDarkMode
                    ? tw.color('border-primary')
                    : 'gray-200',
                },
              ]}
            >
              <ProfAvatar
                user={user!}
                subtitle="Share your thoughts with the community"
                subtitleParams={{
                  textStyles: 'text-gray-500 text-sm',
                }}
              />

              <PrivacyNoticeField
                displayLong
                name="privacyType"
                canEdit={true}
                isEditing={false}
              />
            </View>

            {/* Enhanced Text Input */}
            <View style={styles.textInputSection}>
              <MentionInput
                name="postText"
                placeholder="What's on your mind?"
                autoCapitalize="sentences"
                style={styles.textInput}
                multiline={true}
                textAlignVertical="top"
              />

              <PostTextSync onTextChange={setPostText} />

              {/* Character counter */}
              <View style={styles.characterCounter}>
                <Text
                  style={[
                    styles.counterText,
                    postText.length > 280 && styles.counterWarning,
                  ]}
                >
                  {postText.length}/500
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Add Media</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Location</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.actionText}>Tag People</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Enhanced Bottom Sheet */}
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
              <PresignMediaPicker mediaUploads={mediaUploads} />
            </BottomSheetView>
          </BottomSheet>
        </Form>

        {/* Loading Overlay */}
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
                    color="#3B82F6"
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
      </Animated.View>
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
