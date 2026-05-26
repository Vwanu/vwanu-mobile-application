import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'

interface Props {
  onPress: () => void
  size?: number
  bordered?: boolean
}

const ModalCloseButton: React.FC<Props> = ({
  onPress,
  size = 20,
  bordered = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel="Close"
    style={[
      tw`w-9 h-9 items-center justify-center rounded-full`,
      bordered && {
        borderWidth: 1,
        borderColor: colors.warmBorderStrong,
        backgroundColor: colors.warmSurface,
      },
    ]}
  >
    <Ionicons name="close" size={size} color={colors.soft} />
  </TouchableOpacity>
)

export default ModalCloseButton
