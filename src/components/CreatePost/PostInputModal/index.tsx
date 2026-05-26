import React, { useState, useRef } from 'react'
import { string, object, mixed, InferType, array } from 'yup'
import { useSelector } from 'react-redux'
import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import tw from 'lib/tailwind'
import { Form } from '../../form'
import ModalCloseButton from 'components/ui/ModalCloseButton'
import Text from '../../Text'
import {
  useCreatePostMutation,
  useCreatePostWithMediaKeysMutation,
} from 'store/post'
import extractMentionIds from 'utils/extractMentionIds'

import { Notice } from '../../../../types'
import { useFetchProfileQuery } from 'store/profiles'
import { RootState } from 'store'
import routes from 'navigation/routes'
import { colors } from 'components/ui/tokens'
import { useMediaUploads } from '../useMediaUploads'

import FormSubmitPill from './components/FormSubmitPill'
import PostingInPill from './components/PostingInPill'
import PostUserRow from './components/PostUserRow'
import PostEditor from './components/PostEditor'
import PostActionRow from './components/PostActionRow'
import PostMediaSheet from './components/PostMediaSheet'
import PostLoadingOverlay from './components/PostLoadingOverlay'

const PRESIGN_ENABLED = process.env.EXPO_PUBLIC_USE_PRESIGN_UPLOAD === 'true'
const POST_INPUT_MODAL_CLOSE_TIMEOUT = 250

interface PostInputModalInterface {
  visible: boolean
  openBottomSheet: boolean
  onClose?: () => void
  communityId?: string
}

export interface PostInputModalHandle {
  focus: () => void
}

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
    communityId,
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
    if (result.isError) console.error(result.error)
  }, [result.isSuccess, result.isError, navigation])

  const handleClose = () => {
    if (PRESIGN_ENABLED) mediaUploads.clearAll()
    if (onClose) onClose()
  }

  const isSubmitDisabled =
    !postText.trim() ||
    result.isLoading ||
    (PRESIGN_ENABLED && mediaUploads.isAnyUploading)

  const handleSubmit = async (values: InferType<typeof ValidationSchema>) => {
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
    // @ts-ignore
    await createPost({ ...values, mentions })
  }

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
              tw`pb-3`,
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
              onSubmit={handleSubmit}
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
              <PostUserRow user={user!} />
              <PostEditor onTextChange={setPostText} />
              <PostActionRow
                onAddMedia={() => bottomSheetRef.current?.expand()}
              />
              <PostMediaSheet
                ref={bottomSheetRef}
                openIndex={openBottomSheet ? 1 : 0}
                mediaUploads={mediaUploads}
              />
            </Form>
          </View>
        </View>
      </KeyboardAvoidingView>

      {result.isLoading && <PostLoadingOverlay isSuccess={result.isSuccess} />}
    </Modal>
  )
}

export default PostInputModal
