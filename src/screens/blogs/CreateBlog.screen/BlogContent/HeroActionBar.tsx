import React from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

export const FLOAT_SURFACE = 'rgba(255,255,255,0.18)'

interface Props {
  onClose?: () => void
  onSave?: () => void
  onMenu?: () => void
  isSubmitting?: boolean
  isDraft?: boolean
}

const HeroActionBar = ({
  onClose,
  onSave,
  onMenu,
  isSubmitting,
  isDraft,
}: Props) => (
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
        <Ionicons name="close" size={20} color="#FFFFFF" />
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

    <View style={tw`flex-row items-center`}>
      <TouchableOpacity
        onPress={onMenu}
        activeOpacity={0.85}
        style={[
          tw`w-9 h-9 rounded-full items-center justify-center border border-white/30 mr-2`,
          { backgroundColor: FLOAT_SURFACE },
        ]}
      >
        <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSave}
        disabled={isSubmitting}
        activeOpacity={0.85}
        style={[
          tw`px-4 py-2 rounded-full flex-row items-center`,
          { backgroundColor: colors.primaryDeep },
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={tw`text-white font-poppins-bold text-xs`}>Publish</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
)

export default HeroActionBar
