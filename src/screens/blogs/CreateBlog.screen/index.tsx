import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Screen from 'components/screen'
import Button from 'components/Button'
import AppCloseBtn from 'components/AppCloseBtn'
import Toast, { ToastType } from 'components/Toast'
import { FeedStackParams, CreateBlogParams } from '../../../../types'
import { Ionicons } from '@expo/vector-icons'
import { colors } from 'components/ui/tokens'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogQuery,
} from '../../../store/blog-api-slice'
import BlogContent from './BlogContent'
import BlogImageInterest from './BlogImageInterest'
import ScreenHeader from 'components/ScreenHeader'
import { styles } from 'components/CreatePost/PostInputModal/style'

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

  const isSubmitDisabled = useCallback(() => {
    if (step === 0) {
      return !step1Values?.titlePicture && !step1Values?.interests?.length
    } else {
      return !contentValues?.title || !contentValues?.content
    }
  }, [step, step1Values, contentValues])

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
        style={tw`flex-row items-center justify-between px-2 border-b border-t py-2 border-gray-300 mb-4`}
      >
        <TouchableOpacity
          onPress={handlePreviousOrClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={20} color={colors.soft} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 0 ? 'Create Blog' : 'Add Content'}
        </Text>
        {/* <Text style={tw`text-lg font-semibold`}></Text> */}

        {step === 0 ? (
          <Button
            title="Next"
            size="small"
            onPress={() => handleSave()}
            style={{
              backgroundColor: colors.warmBg,
              borderColor: isSubmitDisabled()
                ? colors.warmBorder
                : tw.color('primary-500'),

              borderWidth: 1,
              borderRadius: 9999,
              paddingHorizontal: 18,
              minHeight: 36,
            }}
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
