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
  values?: typeof initialValues
}

const BlogContent: React.FC<BlogContentProps> = ({
  formRef,
  onSubmit,
  values,
}) => {
  const editorRef = useRef<QuillEditor>(null)
  const formInitialValues = values || initialValues
  const [contentFocused, setContentFocused] = React.useState(false)

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Form
        validationSchema={ValidationSchema}
        initialValues={formInitialValues}
        style={tw`flex-1`}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        <View style={tw`flex-1 bg-warm-bg`}>
          <View
            style={tw`bg-warm-surface px-4 pt-2 border-b border-warm-border`}
          >
            <Field
              name="title"
              placeholder="Title"
              style={tw`bg-warm-surface border-0`}
              textStyle={tw`text-3xl font-syne-bold text-ink`}
              required
              autoFocus
              multiline
            />
          </View>
          <RichTextEditor
            name="content"
            required
            editorRef={editorRef}
            initialValue={formInitialValues.content}
            onFocusChange={setContentFocused}
          />
        </View>
        {contentFocused && <RichToolBar editor={editorRef} />}
      </Form>
    </KeyboardAvoidingView>
  )
}

export default BlogContent
