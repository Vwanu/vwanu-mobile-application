import React, { useState, useRef, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import Toast, { ToastType } from 'components/Toast'
import { FeedStackParams, CreateBlogParams } from '../../../../types'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogQuery,
} from '../../../store/blog-api-slice'
import BlogContent from './BlogContent'

type NavigationProp = StackNavigationProp<FeedStackParams, 'CreateBlog'>

const CreateBlogScreen = () => {
  const formRef = useRef<FormikProps<any>>(null)
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteProp<FeedStackParams, 'CreateBlog'>>()
  const blogId = route.params?.blogId
  const isEditing = !!blogId

  const [step1Values, setStep1Values] = useState<any>({
    titlePicture: '',
    interests: [],
  })
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
  const isSubmitting = isCreating || isUpdating

  // Pre-fill form values when editing an existing blog
  useEffect(() => {
    if (existingBlog) {
      setStep1Values({
        titlePicture: existingBlog.titlePicture,
        interests: existingBlog.interests?.map((i) => i.id) || [],
      })
      setContentValues({
        title: existingBlog.title,
        content: existingBlog.content,
      })
    }
  }, [existingBlog])

  const handleSubmit = async (value: any) => {
    const allData: CreateBlogParams = {
      ...step1Values,
      ...value,
    }
    try {
      if (isEditing) {
        await updateBlog({ id: blogId, ...allData }).unwrap()
      } else {
        await createBlog(allData).unwrap()
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
            typeof error.data === 'string' ? JSON.parse(error.data) : error.data
          message = parsed.error || message
        } catch {
          // use default message
        }
      } else if (error?.error) {
        message = error.error
      }
      console.error('Error submitting blog:', message)
      setToast({ visible: true, type: 'error', message })
    }
  }

  const handleSave = () => {
    formRef.current?.submitForm()
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
    <Screen safeArea={false}>
      <View style={tw`flex-1 bg-warm-bg`}>
        <BlogContent
          formRef={formRef}
          onSubmit={handleSubmit}
          values={contentValues}
          interestIds={step1Values?.interests}
          coverImage={step1Values?.titlePicture}
          onClose={() => navigation.goBack()}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          isDraft={!isEditing || !existingBlog?.publishedAt}
          onCoverChange={(uri) =>
            setStep1Values((prev: any) => ({ ...prev, titlePicture: uri }))
          }
          onInterestsChange={(ids) =>
            setStep1Values((prev: any) => ({ ...prev, interests: ids }))
          }
        />
        {toast.visible && (
          <Toast
            type={toast.type}
            message={toast.message}
            onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
          />
        )}
      </View>
    </Screen>
  )
}

export default CreateBlogScreen
