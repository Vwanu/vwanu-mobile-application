import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'

interface Props {
  onPress: () => void
}

const ComposeButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    accessibilityRole="button"
    accessibilityLabel="Compose new message"
    style={tw`w-10 border border-warm-border h-10 rounded-full items-center justify-center bg-white`}
  >
    <Ionicons
      name="chatbox-ellipses-outline"
      size={20}
      color={colors.primaryDeep}
    />
  </TouchableOpacity>
)

export default ComposeButton
