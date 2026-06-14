import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import { cardShadow } from 'components/ui/tokens'
import ProfAvatar from 'components/ProfAvatar'

interface Props {
  user: Profile
  accessoryRight?: React.ReactNode
}

const PersonCard: React.FC<Props> = ({ user, accessoryRight }) => {
  return (
    <View
      style={[
        tw`flex-row items-center bg-warm-surface border border-warm-border rounded-card p-3 mb-3`,
        cardShadow,
      ]}
    >
      <View style={tw`flex-1 min-w-0 overflow-hidden`}>
        <ProfAvatar user={user} />
      </View>
      {accessoryRight ? (
        <View style={tw`ml-3 shrink-0`}>{accessoryRight}</View>
      ) : null}
    </View>
  )
}

export default PersonCard
