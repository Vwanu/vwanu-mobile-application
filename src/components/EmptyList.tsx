import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { Ionicons } from '@expo/vector-icons'

interface ActionBtnProps {
  label?: string
  icon?: string | React.ReactNode
  onPress: () => void
}
interface NoPostProps {
  icon?: string | React.ReactNode
  title?: string
  subtitle?: string
  actionBtn?: ActionBtnProps
}

interface IconElement {
  icon?: string | React.ReactNode
  defaultIconName: string
}

const Icon: React.FC<IconElement> = ({ icon, defaultIconName }) =>
  !icon ? (
    <Ionicons name={defaultIconName} size={40} color="#9CA3AF" />
  ) : typeof icon === 'string' ? (
    <Ionicons name={icon} size={40} color="#9CA#AF" />
  ) : (
    icon
  )
const EmptyPost: React.FC<NoPostProps> = ({
  title = 'No posts found',
  subtitle,
  actionBtn,
  icon,
}) => {
  return (
    <View style={tw`flex-1 items-center justify-center p-8`}>
      <View
        style={tw`w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4`}
      >
        {<Icon icon={icon} defaultIconName="mail-open-outline" />}
      </View>
      <Text style={tw`text-gray-900 font-semibold text-lg mb-2`}>{title}</Text>
      <Text style={tw`text-gray-600 text-center text-sm`}>{subtitle}</Text>

      {actionBtn && (
        <TouchableOpacity
          onPress={actionBtn?.onPress}
          style={tw`justify-center items-center mt-5`}
        >
          <Text style={tw`text-gray-500 text-thin`}>
            {actionBtn?.label ? actionBtn?.label : 'Refresh'}
          </Text>
          <Icon icon={icon} defaultIconName="refresh" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default EmptyPost
