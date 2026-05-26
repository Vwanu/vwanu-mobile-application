import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface ActionBtnProps {
  label: string
  icon?: React.ComponentProps<typeof Ionicons>['name']
  onPress: () => void
}

interface EmptyListProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'] | React.ReactNode
  title?: string
  subtitle?: string
  actionBtn?: ActionBtnProps
}

const renderIcon = (
  icon: EmptyListProps['icon'],
  defaultName: React.ComponentProps<typeof Ionicons>['name']
) => {
  if (!icon) {
    return <Ionicons name={defaultName} size={28} color={tw.color('mute')} />
  }
  if (typeof icon === 'string') {
    return (
      <Ionicons
        name={icon as React.ComponentProps<typeof Ionicons>['name']}
        size={28}
        color={tw.color('mute')}
      />
    )
  }
  return icon
}

const EmptyList: React.FC<EmptyListProps> = ({
  title = 'Nothing here yet',
  subtitle,
  actionBtn,
  icon,
}) => (
  <View style={tw`flex-1 items-center justify-center px-8 pt-24`}>
    <View
      style={tw`w-16 h-16 rounded-full bg-warm-surface border border-warm-border items-center justify-center mb-4`}
    >
      {renderIcon(icon, 'mail-open-outline')}
    </View>
    <Text style={tw`text-base font-syne-bold text-ink text-center`}>
      {title}
    </Text>
    {subtitle ? (
      <Text
        style={tw`text-sm font-poppins text-mute mt-1 text-center leading-5`}
      >
        {subtitle}
      </Text>
    ) : null}
    {actionBtn ? (
      <TouchableOpacity
        onPress={actionBtn.onPress}
        style={tw`mt-5 flex-row items-center bg-primary-deep px-5 py-2.5 rounded-full`}
        activeOpacity={0.85}
      >
        {actionBtn.icon ? (
          <Ionicons
            name={actionBtn.icon}
            size={16}
            color="#FFFFFF"
            style={tw`mr-2`}
          />
        ) : null}
        <Text style={tw`text-white font-poppins-semibold text-sm`}>
          {actionBtn.label}
        </Text>
      </TouchableOpacity>
    ) : null}
  </View>
)

export default EmptyList
