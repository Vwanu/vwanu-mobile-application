import React, { useCallback, useMemo, forwardRef } from 'react'
import { TextStyle } from 'react-native'
import { useFormikContext } from 'formik'

import { P } from '../Input'
import Error from './Error'
import FieldParams from './fieldParams'

import { Input } from '@ui-kitten/components'

interface Props extends FieldParams, P {
  onTextUpdate?: (text: string) => void
  textStyle?: TextStyle
}

const FormField: React.FC<Props> = ({ name, onTextUpdate, ...otherProps }) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext<any>()

  // console.log('otherProps', otherProps)

  // Memoized change handler
  const handleTextChange = useCallback(
    (text: string) => {
      setFieldValue(name, text)
      onTextUpdate?.(text)
    },
    [setFieldValue, name, onTextUpdate]
  )

  // Memoized blur handler
  const handleBlur = useCallback(() => {
    setFieldTouched(name)
  }, [setFieldTouched, name])

  // Memoize the input props
  const inputProps = useMemo(
    () => ({
      value: values[name],
      onBlur: handleBlur,
      onChangeText: handleTextChange,
      ...otherProps,
    }),
    [values[name], handleBlur, handleTextChange, otherProps]
  )

  const error = errors[name]
  const visible = touched[name]

  return (
    <>
      {/* <Input ref={ref} {...inputProps} />
       */}
      <Input {...inputProps} />
      <Error
        error={typeof error === 'string' ? error : undefined}
        visible={typeof visible === 'boolean' ? visible : false}
      />
    </>
  )
}
// )

FormField.displayName = 'FormField'

export default FormField
