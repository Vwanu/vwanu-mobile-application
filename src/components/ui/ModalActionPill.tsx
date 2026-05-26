import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

interface Props {
  icon: string
  label: string
  iconSet?: 'ionicons' | 'material-community'
  onPress?: () => void
  disabled?: boolean
}

const ModalActionPill: React.FC<Props> = ({
  icon,
  label,
  iconSet = 'ionicons',
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    style={[
      tw`flex-row items-center px-3 py-2 rounded-full mr-2 border`,
      {
        backgroundColor: colors.warmSurface,
        borderColor: colors.warmBorder,
        opacity: disabled ? 0.5 : 1,
      },
    ]}
  >
    {iconSet === 'material-community' ? (
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={colors.primaryDeep}
      />
    ) : (
      <Ionicons name={icon as any} size={16} color={colors.primaryDeep} />
    )}
    <Text
      style={[
        tw`ml-1.5 font-poppins-medium text-xs`,
        { color: colors.primaryDeep },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
)

export default ModalActionPill
