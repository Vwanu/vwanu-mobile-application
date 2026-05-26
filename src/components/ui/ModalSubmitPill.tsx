import React from 'react'
import { TouchableOpacity, ActivityIndicator, View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import { colors } from 'components/ui/tokens'

interface Props {
  enabled: boolean
  loading?: boolean
  onPress: () => void
  label?: string
  loadingLabel?: string
  accessibilityLabel?: string
}

const ModalSubmitPill: React.FC<Props> = ({
  enabled,
  loading = false,
  onPress,
  label = 'Post',
  loadingLabel = 'Posting…',
  accessibilityLabel,
}) => {
  const isActive = enabled && !loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isActive}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        tw`px-4 py-2 rounded-full flex-row items-center`,
        { backgroundColor: isActive ? colors.amber : colors.warmBorder },
      ]}
    >
      {loading ? (
        <View style={tw`mr-1.5`}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : null}
      <Text
        style={[
          tw`font-poppins-bold text-xs`,
          { color: isActive ? '#FFFFFF' : colors.mute },
        ]}
      >
        {loading ? loadingLabel : label}
      </Text>
    </TouchableOpacity>
  )
}

export default ModalSubmitPill
