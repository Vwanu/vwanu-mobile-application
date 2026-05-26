import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import { colors } from 'components/ui/tokens'

interface Props {
  onPress: () => void
}

const ForumFAB: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[
      tw`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center`,
      {
        backgroundColor: colors.amber,
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      },
    ]}
  >
    <Ionicons name="add" size={28} color="#FFFFFF" />
  </TouchableOpacity>
)

export default ForumFAB
