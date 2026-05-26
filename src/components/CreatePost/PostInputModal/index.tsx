import React, { useState, useRef } from 'react'
import { string, object, mixed, InferType, array } from 'yup'
import { useSelector } from 'react-redux'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { styles } from './style'

import tw from 'lib/tailwind'
import ProfAvatar from '../../ProfAvatar'
import { Form, ImageFields, PrivacyNoticeField, MentionInput } from '../../form'
import ModalCloseButton from 'components/ui/ModalCloseButton'
import ModalActionPill from 'components/ui/ModalActionPill'
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
import { useMediaUploads } from '../useMediaUploads'

import FormSubmitPill from './components/FormSubmitPill'
import PostingInPill from './components/PostingInPill'
import PostLoadingOverlay from './components/PostLoadingOverlay'
import PresignMediaPicker from './components/PresignMediaPicker'

const PRESIGN_ENABLED = process.env.EXPO_PUBLIC_USE_PRESIGN_UPLOAD === 'true'

interface PostInputModalInterface {
  visible: boolean
  openBottomSheet: boolean
  onClose?: () => void
  communityId?: string
}

export interface PostInputModalHandle {
  focus: () => void
}
const POST_INPUT_MODAL_CLOSE_TIMEOUT = 250

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
  const snapPoints = React.useMemo(() => [80, 100], [])
  const iniTialsnapPointIndex = openBottomSheet ? 1 : 0
  const [createPost, multipartResult] = useCreatePostMutation()
  const [createPostWithMediaKeys, presignResult] =
    useCreatePostWithMediaKeysMutation()
  const mediaUploads = useMediaUploads({ uploadType: 'post' })

  const result = PRESIGN_ENABLED ? presignResult : multipartResult

  const [postText, setPostText] = useState('')

  const initialValues: InferType<typeof ValidationSchema> = {
    postText: '',
    privacyType: 'public',
    postImage: [],
    communityId: communityId,
  }

  React.useEffect(() => {
    if (result.isSuccess) {
      setTimeout(() => {
        handleClose()
        try {
          navigation.navigate(routes.TIMELINE as never)
        } catch (error) {
          console.log(
            'Navigation: Could not navigate to timeline, but post was created successfully'
          )
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
              tw` pb-3`,
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
                style={tw`flex-row items-center justify-between mb-2 px-4 pt-3 pb-3 border-b border-b-warm-border`}
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

              <View
                style={tw`flex-row items-center justify-between px-4 py-2 border-t border-b border-t-warm-border border-b-warm-border`}
              >
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
                style={tw`px-2`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <MentionInput
                  name="postText"
                  autoFocus
                  placeholder="What's on your mind?"
                  autoCapitalize="sentences"
                  style={[styles.textInput]}
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
                  tw`flex-row h-35 items-start pt-3 px-2 border-t`,
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

      {result.isLoading && <PostLoadingOverlay isSuccess={result.isSuccess} />}
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

export default PostInputModal
