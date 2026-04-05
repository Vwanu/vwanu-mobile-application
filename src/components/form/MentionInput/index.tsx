import React, { useCallback, useMemo } from 'react'
import { View, TextInput, TextInputProps } from 'react-native'
import { useFormikContext } from 'formik'
import { useMentions } from 'react-native-controlled-mentions'

import tw from 'lib/tailwind'
import Error from '../Error'
import FieldParams from '../fieldParams'
import SuggestionList from './SuggestionList'
import { mentionTriggersConfig } from 'config/mentionConfig'

interface MentionInputProps
  extends FieldParams,
    Omit<TextInputProps, 'value' | 'onChangeText' | 'children'> {}

const MentionInputField: React.FC<MentionInputProps> = ({
  name,
  label,
  required,
  otherProps,
  style,
  ...restProps
}) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext<any>()

  const handleChange = useCallback(
    (text: string) => {
      setFieldValue(name, text)
    },
    [setFieldValue, name]
  )

  const { textInputProps, triggers } = useMentions({
    value: values[name] || '',
    onChange: handleChange,
    triggersConfig: mentionTriggersConfig,
  })

  const handleBlur = useCallback(() => {
    setFieldTouched(name)
  }, [setFieldTouched, name])

  const error = errors[name]
  const visible = touched[name]

  return (
    <View style={[tw`flex-1`, { position: 'relative', zIndex: 100 }]}>
      <SuggestionList {...triggers.mention} />
      <TextInput
        {...restProps}
        {...textInputProps}
        onBlur={handleBlur}
        style={[tw`text-sm text-gray-700 dark:text-gray-300 px-2 py-1`, style]}
      />
      <Error
        error={typeof error === 'string' ? error : undefined}
        visible={typeof visible === 'boolean' ? visible : false}
      />
    </View>
  )
}

MentionInputField.displayName = 'MentionInput'

export default MentionInputField
