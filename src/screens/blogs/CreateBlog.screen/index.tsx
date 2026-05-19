import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import Button from 'components/Button'
import AppCloseBtn from 'components/AppCloseBtn'
import Toast, { ToastType } from 'components/Toast'
import { cdnImageUrl } from 'lib/cdnImageUrl'
import { FeedStackParams, CreateBlogParams } from '../../../../types'
import { Ionicons } from '@expo/vector-icons'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogQuery,
} from '../../../store/blog-api-slice'
import { useGetPresignedUploadUrlsMutation } from '../../../store/uploads-api-slice'
import { uploadToS3 } from '../../../lib/uploadToS3'
import BlogContent from './BlogContent'
import BlogImageInterest from './BlogImageInterest'

type NavigationProp = StackNavigationProp<FeedStackParams, 'CreateBlog'>

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

const inferMime = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'gif') return 'image/gif'
  return 'image/jpeg'
}

const CreateBlogScreen = () => {
  const formRef = useRef<FormikProps<any>>(null)
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteProp<FeedStackParams, 'CreateBlog'>>()
  const blogId = route.params?.blogId
  const isEditing = !!blogId

  const [step, setStep] = useState(0)
  const [step1Values, setStep1Values] = useState<any>()
  const [contentValues, setContentValues] = useState<{
    title: string
    content: string
  }>()
  const [toast, setToast] = useState<{
    visible: boolean
    type: ToastType
    message: string
  }>({ visible: false, type: 'info', message: '' })

  const { data: existingBlog, isLoading: isFetchingBlog } = useFetchBlogQuery(
    blogId!,
    { skip: !blogId }
  )

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const [getPresignedUploadUrls] = useGetPresignedUploadUrlsMutation()
  const isSubmitting = isCreating || isUpdating

  // Picture upload state — owned outside Formik so the upload lifecycle
  // survives the step 0 ↔ step 1 transitions. Mirrors the pattern in
  // CreateCommunity.tsx (VWA-128).
  const [pictureKey, setPictureKey] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const abortRef = useRef<AbortController | null>(null)

  // Pre-fill form values when editing an existing blog. Cover preview goes
  // through cdnImageUrl so the bare S3 key (VWA-133) renders via CloudFront.
  // Note: we don't seed pictureKey from existingBlog.titlePicture — the
  // patch payload should only include titlePictureKey when the user picks
  // a new image; otherwise the server keeps the existing column value.
  useEffect(() => {
    if (existingBlog) {
      setStep1Values({
        titlePicture: cdnImageUrl(existingBlog.titlePicture, 'large') ?? '',
        interests: existingBlog.interests?.map((i) => i.id) || [],
      })
      setContentValues({
        title: existingBlog.title,
        content: existingBlog.content,
      })
    }
  }, [existingBlog])

  const startPictureUpload = async (uri: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const filename = uri.split('/').pop() || 'titlePicture.jpg'
    const mimeType = inferMime(filename)

    setUploadStatus('uploading')
    try {
      const { files } = await getPresignedUploadUrls({
        files: [{ filename, mimeType, uploadType: 'blog' }],
      }).unwrap()
      await uploadToS3(files[0].uploadUrl, uri, mimeType, {
        signal: controller.signal,
      })
      setPictureKey(files[0].key)
      setUploadStatus('done')
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error('Blog cover upload failed:', err)
      setUploadStatus('error')
    }
  }

  const handleImagePicked = (uri: string) => {
    setPictureKey(undefined)
    void startPictureUpload(uri)
  }

  const handleSubmit = async (value: any) => {
    if (step === 1) {
      // Block submit if a picture is mid-upload or errored. We deliberately
      // don't block when no picture was picked at all (cover is optional).
      if (uploadStatus === 'uploading') {
        setToast({
          visible: true,
          type: 'info',
          message: 'Cover image is still uploading — try again in a moment.',
        })
        return
      }
      if (uploadStatus === 'error') {
        setToast({
          visible: true,
          type: 'error',
          message: 'Cover image upload failed. Pick a new image to retry.',
        })
        return
      }

      const payload: CreateBlogParams = {
        title: value.title,
        content: value.content,
        interests: (step1Values?.interests ?? []) as string[],
        ...(pictureKey ? { titlePictureKey: pictureKey } : {}),
      }

      try {
        if (isEditing) {
          await updateBlog({ id: blogId, ...payload }).unwrap()
        } else {
          await createBlog(payload).unwrap()
        }
        setToast({
          visible: true,
          type: 'success',
          message: isEditing
            ? 'Your blog post has been updated!'
            : 'Your blog post has been published!',
        })
        setTimeout(() => navigation.goBack(), 1500)
      } catch (error: any) {
        let message = isEditing
          ? 'Failed to update blog post. Please try again.'
          : 'Failed to publish blog post. Please try again.'
        if (error?.data) {
          try {
            const parsed =
              typeof error.data === 'string'
                ? JSON.parse(error.data)
                : error.data
            message = parsed.error || parsed.message || message
          } catch {
            // use default message
          }
        } else if (error?.error) {
          message = error.error
        }
        console.error('Error submitting blog:', message)
        setToast({ visible: true, type: 'error', message })
      }
      return
    }
    setStep1Values(value)
    setStep(1)
  }

  const handleSave = () => {
    formRef.current?.submitForm()
  }

  const handlePreviousOrClose = () => {
    step === 1 ? setStep(0) : navigation.goBack()
  }

  if (isEditing && isFetchingBlog) {
    return (
      <Screen>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <View
        style={tw`flex-row items-center justify-between px-2 bg-white border-b border-gray-100`}
      >
        <AppCloseBtn onPress={handlePreviousOrClose} />
        {step === 0 ? (
          <Button
            title="Next"
            size="small"
            onPress={() => handleSave()}
            style={tw`px-4 py-2 rounded-full`}
          />
        ) : (
          <TouchableOpacity onPress={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="save" size={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`flex-1`}>
        {step === 0 ? (
          <BlogImageInterest
            formRef={formRef}
            onSubmit={handleSubmit}
            values={step1Values}
            onImagePicked={handleImagePicked}
          />
        ) : (
          <BlogContent
            formRef={formRef}
            onSubmit={handleSubmit}
            values={contentValues}
          />
        )}
      </View>
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </Screen>
  )
}

export default CreateBlogScreen
