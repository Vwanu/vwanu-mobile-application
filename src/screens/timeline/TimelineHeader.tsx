import React from 'react'
import { View } from 'react-native'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import NotificationIndicator from 'components/NotificationIndicator'

const TimelineHeader: React.FC = () => (
  <View
    style={tw`flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800`}
  >
    {/* App Name */}
    <Text style={tw`text-2xl font-bold text-primary`}>Vwanu</Text>

    <NotificationIndicator />
  </View>
)

export default TimelineHeader
