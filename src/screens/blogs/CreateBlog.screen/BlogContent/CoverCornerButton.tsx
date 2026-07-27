import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'

const CoverCornerButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    hitSlop={{ top: 14, left: 14, right: 14, bottom: 14 }}
    style={tw`absolute bottom-0 right-0 w-11 h-11 items-end justify-end`}
  >
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        borderBottomWidth: 44,
        borderBottomColor: 'rgba(0,0,0,0.45)',
        borderLeftWidth: 44,
        borderLeftColor: 'transparent',
      }}
    />
    <Ionicons name="pencil" size={15} color="#FFFFFF" style={tw`mb-1 mr-1`} />
  </TouchableOpacity>
)

export default CoverCornerButton
