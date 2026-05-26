import React from 'react'
import { TextInput } from 'react-native'
import { Input } from '@ui-kitten/components'

import Wrapper, { WrapperProps } from './InputsWrapper'

export type P = React.ComponentProps<typeof TextInput> &
  WrapperProps & {
    secureTextEntry?: boolean
    showPasswordToggle?: boolean
  }

//const AppInput = /*React.forwardRef<TextInput, P>*/ ((props, ref) => {
const AppInput = (props: P) => {
  const {
    label,
    iconLeft,
    iconRight,
    style,
    onIconLeftPress,
    onIconRightPress,
    onFocus,
    ...rest
  } = props

  const internalRef = React.useRef<TextInput>(null)

  // Use the forwarded ref if provided, otherwise use internal ref
  // const textInputRef = ref || internalRef

  // const handleWrapperPress = () => {
  //   if (typeof textInputRef === 'function') {
  //     // ref is a callback ref, we can't call focus on it directly
  //     return
  //   }
  //   textInputRef?.current?.focus()
  // }

  return (
    // <Wrapper
    //   label={label}
    //   iconLeft={iconLeft}
    //   iconRight={iconRight}
    //   style={style}
    //   onIconLeftPress={onIconLeftPress}
    //   onIconRightPress={onIconRightPress}
    //   onPress={handleWrapperPress}
    // >
    <>
      <Input
        {...rest}
        onFocus={onFocus && onFocus}
        onBlur={props.onBlur && props.onBlur}
        style={style}
      />
      {/* </Wrapper> */}
    </>
  )
}
// })

AppInput.displayName = 'AppInput'

export default AppInput
