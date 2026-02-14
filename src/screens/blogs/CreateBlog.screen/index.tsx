import React, { useState, useRef } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import Screen from 'components/screen'
import Button from 'components/Button'
import AppCloseBtn from 'components/AppCloseBtn'
import { FeedStackParams } from '../../../../types'
import { Ionicons } from '@expo/vector-icons'
import BlogContent from './BlogContent'
import BlogImageInterest from './BlogImageInterest'

type NavigationProp = StackNavigationProp<FeedStackParams, 'CreateBlog'>

const CreateBlogScreen = () => {
  const formRef = useRef<FormikProps<any>>(null)
  const navigation = useNavigation<NavigationProp>()
  const [step, setStep] = useState(0)
  const [step1Values, setStep1Values] = useState()

  const handleSubmit = async (value: any) => {
    if (step == 1)
      Alert.alert('Blog Created', 'Your blog post has been published!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    // cache the data ,
    setStep1Values(value)
    setStep(1)
  }

  const handleSave = () => {
    formRef.current?.submitForm()
  }

  const handlePreviousOrClose = () => {
    step === 1 ? setStep(0) : navigation.goBack()
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
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="save" size={24} />
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`flex-1`}>
        {step === 0 ? (
          <BlogImageInterest
            formRef={formRef}
            onSubmit={handleSubmit}
            values={step1Values}
          />
        ) : (
          <BlogContent formRef={formRef} onSubmit={handleSubmit} />
        )}
      </View>
    </Screen>
  )
}

export default CreateBlogScreen
