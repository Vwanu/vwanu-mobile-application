import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import AppCloseBtn from 'components/AppCloseBtn'
import ScreenHeader from 'components/ScreenHeader'
import Toast, { ToastType } from 'components/Toast'
import { FeedStackParams, CreateBlogParams } from '../../../../types'
import { Ionicons } from '@expo/vector-icons'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogQuery,
} from '../../../store/blog-api-slice'
import BlogContent from './BlogContent'
import BlogImageInterest from './BlogImageInterest'

type NavigationProp = StackNavigationProp<FeedStackParams, 'CreateBlog'>

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
    if (step === 1) {
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
              typeof error.data === 'string'
                ? JSON.parse(error.data)
                : error.data
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
    <Screen safeArea={step === 0 ? true : false}>
      <View style={tw`flex-1 bg-warm-bg`}>
        {step === 0 && (
          <ScreenHeader
            title={isEditing ? 'Edit Blog' : 'New Blog'}
            subtitle={
              step === 0
                ? 'Step 1 of 2 · Cover & topics'
                : 'Step 2 of 2 · Write your post'
            }
            leftAction={<AppCloseBtn onPress={handlePreviousOrClose} />}
            rightAction={
              step === 0 ? (
                <Text
                  onPress={handleSave}
                  style={tw`px-4 py-2 rounded-full text-white bg-primary-deep font-poppins-semibold`}
                >
                  Next
                </Text>
              ) : (
                <TouchableOpacity onPress={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Ionicons name="save" size={24} />
                  )}
                </TouchableOpacity>
              )
            }
            containerStyle={tw`border-b border-t border-warm-border mb-2`}
          />
        )}
        <View style={tw`flex-1`}>
          {step === 0 ? (
            <View style={tw`px-3 flex-1`}>
              <BlogImageInterest
                formRef={formRef}
                onSubmit={handleSubmit}
                values={step1Values}
              />
            </View>
          ) : (
            <BlogContent
              formRef={formRef}
              onSubmit={handleSubmit}
              values={contentValues}
              interestIds={step1Values?.interests}
              coverImage={step1Values?.titlePicture}
              onClose={handlePreviousOrClose}
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
          )}
        </View>
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
