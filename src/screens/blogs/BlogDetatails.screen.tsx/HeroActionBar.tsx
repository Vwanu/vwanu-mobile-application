import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

export const FLOAT_SURFACE = 'rgba(255,255,255,0.18)'

interface Props {
  onClose?: () => void
  onMenu?: () => void
  isDraft?: boolean
  canEdit?: boolean
}

const HeroActionBar = ({ onClose, onMenu, isDraft, canEdit }: Props) => (
  <View style={tw`flex-row items-center justify-between`}>
    <View style={tw`flex-row items-center`}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.85}
        style={[
          tw`w-9 h-9 rounded-full items-center justify-center border border-white/30`,
          { backgroundColor: FLOAT_SURFACE },
        ]}
      >
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {isDraft && (
        <View
          style={[
            tw`ml-2 px-2.5 py-1 rounded-full`,
            { backgroundColor: colors.amberSoft },
          ]}
        >
          <Text
            style={[tw`font-poppins-bold text-xs`, { color: colors.amberDeep }]}
          >
            Draft
          </Text>
        </View>
      )}
    </View>

    {canEdit && (
      <TouchableOpacity
        onPress={onMenu}
        activeOpacity={0.85}
        style={[
          tw`w-9 h-9 rounded-full items-center justify-center border border-white/30`,
          { backgroundColor: FLOAT_SURFACE },
        ]}
      >
        <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    )}
  </View>
)

export default HeroActionBar
