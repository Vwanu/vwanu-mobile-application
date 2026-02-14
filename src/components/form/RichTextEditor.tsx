import React, { useRef, useCallback } from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import QuillEditor from 'react-native-cn-quill'
import { useFormikContext } from 'formik'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import Error from './Error'

interface Props {
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  style?: StyleProp<ViewStyle>
  editorRef?: React.RefObject<QuillEditor>
}

const RichTextEditor: React.FC<Props> = ({
  name,
  label,
  required,
  placeholder = '',
  style,
  editorRef: externalRef,
}) => {
  const internalRef = useRef<QuillEditor>(null)
  const editorRef = externalRef || internalRef

  const { setFieldValue, setFieldTouched, errors, touched } =
    useFormikContext<any>()

  const handleHtmlChange = useCallback(
    ({ html }: { html: string }) => {
      setFieldValue(name, html)
    },
    [setFieldValue, name]
  )

  const handleBlur = useCallback(() => {
    setFieldTouched(name, true)
  }, [setFieldTouched, name])

  const error = errors[name]
  const visible = touched[name]

  return (
    <View style={[tw`flex-1`, style]}>
      {label && (
        <Text
          category="label"
          style={tw`font-semibold text-sm text-gray-700 mb-2`}
        >
          {label}
          {required ? ' *' : ''}
        </Text>
      )}

      <View style={tw`flex-1`}>
        <QuillEditor
          ref={editorRef}
          style={tw`flex-1 border-0`}
          quill={{
            placeholder,
            modules: {
              toolbar: false,
            },
          }}
          onHtmlChange={handleHtmlChange}
          onBlur={handleBlur}
          autoSize
          theme={{
            background: '#ffffff',
            color: '#1f2937',
            placeholder: '#9ca3af',
          }}
        />
      </View>

      <Error
        error={typeof error === 'string' ? error : undefined}
        visible={typeof visible === 'boolean' ? visible : false}
      />
    </View>
  )
}

export default RichTextEditor
