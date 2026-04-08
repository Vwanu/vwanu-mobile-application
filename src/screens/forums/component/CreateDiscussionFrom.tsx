import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { string, object } from 'yup'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Form, MentionInput } from 'components/form'
import extractMentionIds from 'utils/extractMentionIds'

const ValidationSchema = object().shape({
  title: string().required().min(1).label('Title'),
  body: string().required().min(1).label('Body'),
})

interface FormValues {
  title: string
  body: string
}

const CreateDiscussionFormContent: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { values, setFieldValue, handleSubmit } = useFormikContext<FormValues>()
  const isReady = values.title.trim() && values.body.trim()

  return (
    <>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-5`}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={tw.color('gray-500')} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-900 dark:text-white`}>
          New Discussion
        </Text>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          disabled={!isReady}
          style={tw`${
            isReady ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
          } px-4 py-2 rounded-full`}
        >
          <Text style={tw`text-white font-semibold text-sm`}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Title input */}
      <TextInput
        value={values.title}
        onChangeText={(text) => setFieldValue('title', text)}
        placeholder="Discussion title"
        placeholderTextColor={tw.color('gray-400')}
        style={tw`text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4`}
      />

      {/* Body input with mention support */}
      <MentionInput
        name="body"
        placeholder="What would you like to discuss?"
        placeholderTextColor={tw.color('gray-400')}
        style={tw`text-sm text-gray-700 dark:text-gray-300 flex-1`}
        multiline
        textAlignVertical="top"
      />
    </>
  )
}

const CreateDiscussionForm: React.FC<{
  visible: boolean
  onClose: () => void
  onSubmit: (title: string, body: string, mentions?: string[]) => void
}> = ({ visible, onClose, onSubmit }) => {
  const handleFormSubmit = ({ title, body }: FormValues) => {
    const mentions = extractMentionIds(body)
    onSubmit(title.trim(), body.trim(), mentions)
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior="padding" style={tw`flex-1`}>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View
            style={tw`bg-white dark:bg-gray-800 rounded-t-3xl p-5 min-h-[380px]`}
          >
            <Form
              validationSchema={ValidationSchema}
              initialValues={{ title: '', body: '' }}
              onSubmit={handleFormSubmit}
            >
              <CreateDiscussionFormContent onClose={onClose} />
            </Form>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateDiscussionForm
