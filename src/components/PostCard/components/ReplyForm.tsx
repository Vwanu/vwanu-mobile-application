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
  submitReply: ({
    content,
    mentions,
  }: {
    content: string
    mentions: string[]
  }) => void
  isSubmitting: boolean
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
}> = ({ onClose, isLoading }) => {
  const { values } = useFormikContext<ReplyFormValues>()
  const isEmpty = !values.body.trim()

  return (
    <View
      style={tw`flex-row items-center justify-between mt-3 dark:border-gray-700`}
    >
      <TouchableOpacity onPress={onClose} style={tw`mr-2`}>
        <Ionicons name="close" size={20} color={tw.color('gray-500')} />
      </TouchableOpacity>
      <MentionInput
        name="body"
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
  const handleSubmit = async ({ body }: ReplyFormValues) => {
    const mentions = extractMentionIds(body)
    await submitReply({
      content: body,
      mentions,
    })
    onClose()
  }

  return (
    <Form
      validationSchema={ValidationSchema}
      initialValues={{ body: '' }}
      onSubmit={handleSubmit}
    >
      <ReplyFormContent onClose={onClose} isLoading={isSubmitting} />
    </Form>
  )
}
export default ReplyForm
