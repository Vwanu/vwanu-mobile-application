/**
 * Chat Stack Navigator
 * Handles chat list and message screens
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Configuration
import { stackConfig, screenConfigs } from './config/navigationConfig'
import { SCREEN_NAMES } from './utils/navigationUtils'

// Screens
import ChatScreen from '../screens/Chat'
import MessageScreen from '../screens/Chat/Message'

// Types
import { ChatStackParams } from '../../types'

const Stack = createStackNavigator<ChatStackParams>()

/**
 * Chat navigation stack
 * Provides navigation between chat list and individual conversations
 */
const ChatNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={stackConfig}
    initialRouteName={SCREEN_NAMES.CHAT}
  >
    <Stack.Screen
      name={SCREEN_NAMES.CHAT}
      component={ChatScreen}
      options={{
        ...screenConfigs.chat,
        title: 'Messages',
      }}
    />
    <Stack.Screen
      name={SCREEN_NAMES.MESSAGE}
      component={MessageScreen}
      options={{
        ...screenConfigs.message,
        title: 'Conversation',
      }}
    />
  </Stack.Navigator>
)

export default ChatNavigator
