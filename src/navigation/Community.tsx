/**
 * Community Stack Navigator
 * Handles community listing and related screens
 */
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Configuration
import { stackConfig, screenConfigs } from './config/navigationConfig'
import { SCREEN_NAMES } from './utils/navigationUtils'

// Screens
import CommunitiesScreen from '../screens/Communities'
import CommunityDetailScreen from '../screens/Communities/CommunityDetail'
import CreateCommunityScreen from '../screens/Communities/CreateCommunity'
import CommunitySettingsScreen from '../screens/Communities/CommunitySettings'
import routes from './routes'

// Types
import { CommunityStackParams } from '../../types'

const Stack = createStackNavigator<CommunityStackParams>()

/**
 * Community navigation stack
 * Provides navigation for community-related screens
 */
const CommunityNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackConfig} initialRouteName="Communities">
    <Stack.Screen
      name="Communities"
      component={CommunitiesScreen}
      options={{
        headerShown: false,
        title: 'Communities',
      }}
    />
    <Stack.Screen
      name="CommunityDetail"
      component={CommunityDetailScreen}
      options={{
        headerShown: false,
        title: 'Community Details',
      }}
    />
    <Stack.Screen
      name={routes.CREATE_COMMUNITY}
      component={CreateCommunityScreen}
      options={{
        headerShown: false,
        title: 'Create Community',
      }}
    />
    <Stack.Screen
      name="CommunitySettings"
      component={CommunitySettingsScreen}
      options={{
        headerShown: false,
        title: 'Community Settings',
      }}
    />
  </Stack.Navigator>
)

export default CommunityNavigator
