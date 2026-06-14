import ProfAvatar from 'components/ProfAvatar'
import { View } from 'react-native'
import React from 'react'

import tw from 'lib/tailwind'

interface FollowerProps {
  follower: User
}

const Follower: React.FC<FollowerProps> = ({ follower }) => {
  return (
    <View
      style={tw`flex-row items-center justify-between p-3 border-b border-gray-100 bg-white rounded-2xl my-2 py-3`}
    >
      <ProfAvatar user={follower} />
    </View>
  )
}

export default Follower
