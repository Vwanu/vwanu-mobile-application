import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import MessageIndicator from 'components/MessageIndicator'
import NotificationIndicator from 'components/NotificationIndicator'
import FriendRequestIndicator from 'components/FriendRequestIndicator'

const TimelineHeader: React.FC = () => (
  <View
    style={tw`flex-row items-center justify-between px-4 py-2 border-b border-warm-border`}
  >
    {/* App Name */}
    <Text style={tw`text-2xl font-syne-bold text-primary-deep`}>Vwanu</Text>

    <View style={tw`flex-row items-center`}>
      <FriendRequestIndicator />
      <NotificationIndicator />
      <MessageIndicator />
    </View>
  </View>
)

export default TimelineHeader
