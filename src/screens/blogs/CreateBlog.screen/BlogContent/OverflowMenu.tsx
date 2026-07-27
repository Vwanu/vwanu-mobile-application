import React, { useRef } from 'react'
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

const MenuRow = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`flex-row items-center px-2 py-3.5`}
  >
    <Ionicons name={icon} size={20} color={colors.ink} />
    <Text
      style={[tw`ml-3 font-poppins-medium text-base`, { color: colors.ink }]}
    >
      {label}
    </Text>
  </TouchableOpacity>
)

interface Props {
  visible: boolean
  onClose: () => void
  onChangeCover?: () => void
  onManageInterests?: () => void
  onSaveDraft?: () => void
}

const OverflowMenu = ({
  visible,
  onClose,
  onChangeCover,
  onManageInterests,
  onSaveDraft,
}: Props) => {
  // Defer the chosen action until the sheet has fully dismissed. Launching an
  // image picker (or another modal) while this one is still closing freezes iOS.
  const pending = useRef<(() => void) | null>(null)

  const select = (action?: () => void) => {
    if (!action) return
    if (Platform.OS === 'ios') {
      pending.current = action
      onClose()
    } else {
      onClose()
      action()
    }
  }

  const handleDismiss = () => {
    const action = pending.current
    pending.current = null
    action?.()
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={handleDismiss}
    >
      <Pressable style={tw`flex-1 justify-end`} onPress={onClose}>
        <View style={tw`bg-warm-surface rounded-t-3xl pt-2 pb-8 px-4`}>
          <View style={tw`items-center pb-2`}>
            <View style={tw`w-10 h-1 rounded-full bg-warm-border`} />
          </View>
          {onChangeCover && (
            <MenuRow
              icon="image-outline"
              label="Change cover"
              onPress={() => select(onChangeCover)}
            />
          )}
          {onManageInterests && (
            <MenuRow
              icon="pricetags-outline"
              label="Manage interests"
              onPress={() => select(onManageInterests)}
            />
          )}
          <MenuRow
            icon="save-outline"
            label="Save draft"
            onPress={() => select(onSaveDraft)}
          />
        </View>
      </Pressable>
    </Modal>
  )
}

export default OverflowMenu
