import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import NotificationIndicator from 'components/NotificationIndicator'
import FriendRequestIndicator from 'components/FriendRequestIndicator'

const TimelineHeader: React.FC = () => (
  <View
    style={tw`flex-row items-center justify-between px-4 bg-white dark:bg-gray-900`}
  >
    {/* App Name */}
    <Text style={tw`text-2xl font-bold text-primary`}>Vwanu</Text>

    <View style={tw`flex-row items-center`}>
      <FriendRequestIndicator />
      <NotificationIndicator />
    </View>
  </View>
)

export default TimelineHeader
