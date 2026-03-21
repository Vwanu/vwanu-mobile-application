import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'

const CreateDiscussionForm: React.FC<{
  visible: boolean
  onClose: () => void
  onSubmit: (title: string, body: string) => void
}> = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return
    onSubmit(title.trim(), body.trim())
    setTitle('')
    setBody('')
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior="padding" style={tw`flex-1`}>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View
            style={tw`bg-white dark:bg-gray-800 rounded-t-3xl p-5 min-h-[380px]`}
          >
            {/* Header */}
            <View style={tw`flex-row items-center justify-between mb-5`}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={tw.color('gray-500')} />
              </TouchableOpacity>
              <Text style={tw`text-lg font-bold text-gray-900 dark:text-white`}>
                New Discussion
              </Text>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!title.trim() || !body.trim()}
                style={tw`${
                  title.trim() && body.trim()
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600'
                } px-4 py-2 rounded-full`}
              >
                <Text style={tw`text-white font-semibold text-sm`}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Title input */}
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Discussion title"
              placeholderTextColor={tw.color('gray-400')}
              style={tw`text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4`}
            />

            {/* Body input */}
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="What would you like to discuss?"
              placeholderTextColor={tw.color('gray-400')}
              style={tw`text-sm text-gray-700 dark:text-gray-300 flex-1`}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default CreateDiscussionForm
