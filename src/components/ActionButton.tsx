import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

import tw from 'lib/tailwind'
import { useTheme } from 'hooks/useTheme'
import { ActivityIndicator } from 'react-native-paper'

interface ActionButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof Ionicons.glyphMap
  loading?: boolean
  iconStyle?: TextStyle
}
const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  iconName,
  accessibilityLabel,
  loading = false,
  iconStyle,
}) => {
  const { isDarkMode } = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`p-2 rounded-full`}
      accessibilityLabel={accessibilityLabel}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Ionicons
          name={iconName}
          size={20}
          color={isDarkMode ? 'white' : 'black'}
          {...iconStyle}
        />
      )}
    </TouchableOpacity>
  )
}

export default ActionButton
