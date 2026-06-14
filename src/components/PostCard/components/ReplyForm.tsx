import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFormikContext } from 'formik'
import { string, object } from 'yup'

import tw from 'lib/tailwind'
import { MentionInput, Form, Submit } from 'components/form'
import extractMentionIds from 'utils/extractMentionIds'

interface ReplyFormProps {
  onClose: () => void
  submitReply: (values: any) => Promise<void>
  isSubmitting: boolean
  name?: string
}

const ValidationSchema = object().shape({
  body: string().required().min(1).label('Reply'),
})

interface ReplyFormValues {
  body: string
}

const ReplyFormContent: React.FC<{
  onClose: () => void
  isLoading: boolean
  name?: string
}> = ({ onClose, isLoading, name = 'body' }) => {
  const { values } = useFormikContext<ReplyFormValues>()
  const isEmpty = !values.body.trim()

  return (
    <View
      style={tw`flex-row items-center justify-between dark:border-gray-700 rounded-full border border-gray-300 px-1 py-1`}
    >
      <TouchableOpacity
        onPress={onClose}
        style={tw`mr-absolute -left-2 -top-4 -translate-y-1/2 p-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800`}
      >
        <Ionicons name="close" size={20} color={tw.color('red-500')} />
      </TouchableOpacity>
      <MentionInput
        name={name}
        placeholder="Write a reply..."
        placeholderTextColor={tw.color('gray-400')}
        style={tw`flex-1 text-sm text-gray-700 dark:text-gray-300 py-1 rounded-full`}
      />
      <Submit
        disabled={isEmpty || isLoading}
        appearance="ghost"
        textStyle={tw`text-sm`}
        accessoryLeft={
          <Ionicons
            name="send"
            size={18}
            color={
              isEmpty || isLoading ? tw.color('gray-300') : tw.color('primary')
            }
          />
        }
      />
    </View>
  )
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  onClose,
  submitReply,
  isSubmitting,
}) => {
  const handleSubmit = async (values: ReplyFormValues) => {
    await submitReply(values)
    onClose()
  }

  return (
    <Form
      validationSchema={ValidationSchema}
      initialValues={{ body: '' }}
      onSubmit={handleSubmit}
      style={tw`px-4 py-1 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700`}
    >
      <ReplyFormContent onClose={onClose} isLoading={isSubmitting} />
    </Form>
  )
}
export default ReplyForm
