import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface StatPillProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
}

const StatPill: React.FC<StatPillProps> = ({ icon, label }) => (
  <View
    style={[
      tw`flex-row items-center px-3 py-1 rounded-full border border-white/30`,
      { backgroundColor: 'rgba(255,255,255,0.15)' },
    ]}
  >
    <Ionicons name={icon} size={12} color="white" />
    <Text style={tw`text-white text-xs font-poppins-medium ml-1`}>{label}</Text>
  </View>
)

export default StatPill
