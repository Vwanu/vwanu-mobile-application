import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFormikContext } from 'formik'

import Text from 'components/Text'
import tw from 'lib/tailwind'
import { CommunityPrivacyType } from '../../../../types'

interface Props {
  name?: string
}

const PRIMARY = '#1B1F5E'
const PRIMARY_3 = '#4A5295'
const SOFT = '#4A4A5E'

const PrivacySettings: React.FC<Props> = ({ name = 'privacyType' }) => {
  const { values, setFieldValue } = useFormikContext<any>()
  const privacyType = (values[name] || 'public') as CommunityPrivacyType
  const onPrivacyTypeChange = (type: CommunityPrivacyType) =>
    setFieldValue(name, type)

  const privacyOptions = [
    {
      type: 'public' as CommunityPrivacyType,
      icon: 'globe-outline' as const,
      title: 'Public',
      description: 'Anyone can find and join',
    },
    {
      type: 'private' as CommunityPrivacyType,
      icon: 'people-outline' as const,
      title: 'Private',
      description: 'Members-only, searchable',
    },
    {
      type: 'hidden' as CommunityPrivacyType,
      icon: 'lock-closed-outline' as const,
      title: 'Hidden',
      description: 'Invite-only, hidden',
    },
  ]

  const renderPrivacyOption = (option: (typeof privacyOptions)[0]) => {
    const isSelected = privacyType === option.type

    return (
      <TouchableOpacity
        key={option.type}
        style={[
          tw`flex-1 p-3 rounded-2xl border`,
          isSelected
            ? tw`border-[${PRIMARY}] bg-[#EEF0FA]`
            : tw`border-[#D4D1C8] bg-[#F5F3EE]`,
        ]}
        onPress={() => onPrivacyTypeChange(option.type)}
      >
        <View
          style={[
            tw`w-8 h-8 rounded-full items-center justify-center mb-2`,
            isSelected ? tw`bg-[#EEF0FA]` : tw`bg-[#E4E2DC]`,
          ]}
        >
          <Ionicons
            name={option.icon}
            size={16}
            color={isSelected ? PRIMARY_3 : SOFT}
          />
        </View>
        <Text style={tw`font-poppins-bold text-[13.5px] text-[#1A1A2E] mb-0.5`}>
          {option.title}
        </Text>
        <Text style={tw`font-poppins text-[11.5px] text-[#8A8A9E] leading-4`}>
          {option.description}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={tw`my-2 border-b border-gray-100`}>
      <View style={tw``}>
        <Text category="h6" style={tw`font-poppins-bold text-lg mb-4`}>
          Visibility
        </Text>
        <View style={tw`flex-row gap-2.5`}>
          {privacyOptions.map(renderPrivacyOption)}
        </View>
      </View>
    </View>
  )
}

export default PrivacySettings
