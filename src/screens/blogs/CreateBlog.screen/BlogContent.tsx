import * as Yup from 'yup'
import React, { useRef } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import QuillEditor from 'react-native-cn-quill'
import { FormikProps } from 'formik'

import tw from 'lib/tailwind'
import { Field, Form } from 'components/form'

import RichToolBar from 'components/form/RichToolBar'
import RichTextEditor from '../../../components/form/RichTextEditor'

const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(20, 'Content must be at least 20 characters')
    .required('Content is required'),
})

const initialValues = {
  title: '',
  content: '',
}

interface BlogContentProps {
  formRef?: React.Ref<FormikProps<typeof initialValues>>
  onSubmit: (values: typeof initialValues) => void
}

const BlogContent: React.FC<BlogContentProps> = ({ formRef, onSubmit }) => {
  const editorRef = useRef<QuillEditor>(null)

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Form
        validationSchema={ValidationSchema}
        initialValues={initialValues}
        style={tw`flex-1`}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        <View style={tw`flex-1`}>
          <Field
            name="title"
            style={tw`bg-white border-0`}
            textStyle={tw`text-3xl font-bold`}
            required
            autoFocus
            multiline
          />
          <RichTextEditor name="content" required editorRef={editorRef} />
        </View>
        <RichToolBar editor={editorRef} />
      </Form>
    </KeyboardAvoidingView>
  )
}

export default BlogContent
