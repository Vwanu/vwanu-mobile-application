import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import StatPill from 'components/StatPill'

interface InterestLike {
  id: string | number
  name: string
}

const InterestPills = ({ interests }: { interests?: InterestLike[] }) => {
  if (!interests || interests.length === 0) return null

  return (
    <View style={tw`flex-row flex-wrap gap-2 mb-2`}>
      {interests.map((interest) => (
        <StatPill key={interest.id} icon="pricetag" label={interest.name} />
      ))}
    </View>
  )
}

export default InterestPills
