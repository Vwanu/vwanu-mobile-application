import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'

interface InterestLike {
  id: string | number
  name: string
}

interface Props {
  interests?: InterestLike[]
  max?: number
  containerStyle?: StyleProp<ViewStyle>
}

const CommunityInterestPills: React.FC<Props> = ({
  interests,
  max = 3,
  containerStyle,
}) => {
  return (
    <View style={[tw`flex-row flex-wrap `, containerStyle]}>
      {interests?.slice(0, max).map((interest) => (
        <View
          key={interest.id}
          style={tw`bg-white px-3 py-1 rounded-full mr-2 mb-2`}
        >
          <Text style={tw`text-black text-xs font-medium`}>
            {interest.name}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default CommunityInterestPills
