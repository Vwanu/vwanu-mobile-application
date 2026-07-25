import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import StatPill from 'components/StatPill'

interface InterestLike {
  id: string | number
  name: string
}

interface Props {
  interests?: InterestLike[]
  max?: number
  onMore?: () => void
}

const InterestPills = ({ interests, max = 3, onMore }: Props) => {
  if (!interests || interests.length === 0) return null

  const shown = interests.slice(0, max)
  const remaining = interests.length - shown.length

  return (
    <View style={tw`flex-row flex-wrap gap-2 mb-2`}>
      {shown.map((interest) => (
        <StatPill key={interest.id} icon="pricetag" label={interest.name} />
      ))}
      {remaining > 0 && (
        <TouchableOpacity
          onPress={onMore}
          activeOpacity={0.85}
          style={[
            tw`flex-row items-center px-3 py-1 rounded-full border border-white/30`,
            { backgroundColor: 'rgba(255,255,255,0.15)' },
          ]}
        >
          <Text style={tw`text-white text-xs font-poppins-medium`}>
            +{remaining} more
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default InterestPills
