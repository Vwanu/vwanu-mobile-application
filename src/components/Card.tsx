import React from 'react'
import { View, Platform } from 'react-native'

import tw from 'lib/tailwind'

export interface PostCardProps {
  children?: React.ReactNode
}

const Card: React.FC<PostCardProps> = ({ children }) => {
  return (
    <View
      style={[
        tw`bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl p-4`,
        cardShadow,
      ]}
    >
      {children}
    </View>
  )
}

const cardShadow = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 3,
    },
  }),
}

export default Card
