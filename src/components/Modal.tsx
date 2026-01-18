import React, { useEffect } from 'react'
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'

import Button from './Button'
import tw from '../lib/tailwind'
import { useTailwindTheme } from '../hooks/useTailwindTheme'

interface AppModalProps extends React.ComponentProps<typeof Modal> {
  children: React.ReactNode
  withMenu?: boolean
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  otherProps?: object
  height?: number
}

const AppModal: React.FC<AppModalProps> = ({
  children,
  withMenu = true,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  height,
  ...otherProps
}) => {
  const { colors } = useTailwindTheme()

  // Use our custom theme colors
  const backgroundColor = colors.background.primary
  const separatorColor = colors.border.subtle
  const handleColor = colors.text.secondary

  return (
    <Modal transparent animationType="slide" {...otherProps}>
      <View style={tw`flex-1 bg-black bg-opacity-50 `}>
        <TouchableOpacity style={tw`flex-1 w-full`} onPress={onClose} />
        <View
          style={[tw`w-full overflow-hidden max-h-100`, { backgroundColor }]}
        >
          <View style={tw`items-center `}>
            {withMenu ? (
              <View style={tw` w-full flex items-center`}>
                <View style={tw` w-full flex flex-row justify-between`}>
                  <Button
                    title={cancelText || 'close'}
                    appearance="ghost"
                    onPress={() => {
                      onClose()
                    }}
                  />
                  {onConfirm && (
                    <Button
                      title={confirmText || 'confirm'}
                      appearance="ghost"
                      onPress={() => {
                        onConfirm()
                      }}
                    />
                  )}
                </View>
                <View
                  style={[
                    tw`h-[1px] w-[90%]`,
                    { backgroundColor: separatorColor },
                  ]}
                />
              </View>
            ) : (
              <TouchableWithoutFeedback
                onLongPress={() => {
                  onClose()
                }}
              >
                <View
                  style={[
                    tw`h-[5px] w-2/4 rounded-lg my-4`,
                    { backgroundColor: handleColor },
                  ]}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
          <View>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

export default AppModal
