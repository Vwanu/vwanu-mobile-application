import React from 'react'
import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Text from 'components/Text'
import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'

// The config shape that describes one tab. Re-exported by TabBar for
// existing callers that still import `Tab` from there.
export interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: React.ReactNode
}

interface TabProps {
  item: Tab
  isActive: boolean
  onPress: (id: string) => void
  iconOnly?: boolean
  activeColor?: string
  inactiveColor?: string
  underlineColor?: string
  activeTextColor?: string
  disableTextColor?: string
  tabStyle?: StyleProp<ViewStyle>
  fullWidth?: boolean
  isPill?: boolean
}

const TabItem: React.FC<TabProps> = ({
  item,
  isActive,
  onPress,
  iconOnly = false,
  activeColor = colors.primaryDeep,
  inactiveColor = '#6B7280',
  underlineColor,
  activeTextColor,
  disableTextColor,
  tabStyle,
  fullWidth = false,
  isPill = false,
}) => {
  const isDisabled = item.disabled
  const activeBorder = underlineColor ?? activeColor

  const shape = isPill ? 'rounded-full' : ''
  const defaultLayout = fullWidth
    ? tw`flex-1 px-5 py-2.5 ${isDisabled ? 'opacity-40' : ''} ${shape}`
    : tw`mr-3 px-5 py-2.5 ${isDisabled ? 'opacity-40' : ''} ${shape}`

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      style={[
        defaultLayout,
        tabStyle,
        // Active overrides go LAST so a consumer-provided `border` in
        // tabStyle can't override the active visual back to defaults.
        // Inactive tabs apply no overrides — consumer styles win.
        // - Pill mode + active: filled primary background.
        // - Non-pill + active: 2px underline using activeBorder.
        isActive && isPill && { backgroundColor: activeColor },
        isActive &&
          !isPill && {
            borderColor: activeBorder,
            borderBottomWidth: 2,
          },
      ]}
    >
      <View style={tw`flex-row items-center justify-center`}>
        {item.icon && (
          <Ionicons
            name={item.icon as any}
            size={iconOnly ? 24 : 20}
            color={
              isDisabled ? '#9CA3AF' : isActive ? activeColor : inactiveColor
            }
          />
        )}
        {!iconOnly && (
          <Text
            style={tw`font-medium ${item.icon ? 'ml-2' : ''} ${
              isDisabled
                ? disableTextColor || 'text-gray-400'
                : isActive
                ? isPill
                  ? 'text-white'
                  : activeTextColor || 'text-primary'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {item.label}
          </Text>
        )}
        {item.badge ? <View style={tw`ml-1.5`}>{item.badge}</View> : null}
      </View>
    </TouchableOpacity>
  )
}

export default TabItem
