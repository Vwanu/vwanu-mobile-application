import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ProfileStackParams } from '../../types'

import Profile from 'screens/Profile'
import SinglePostScreen from '../screens/timeline/SinglePost.screen'
import Notifications from '../screens/Notifications'
import FriendRequests from '../screens/FriendRequests'
import Settings from '../screens/Settings'
import NotificationSettings from '../screens/Settings/NotificationSettings'
import AccountSettings from '../screens/Settings/AccountSettings'
import PrivacySettings from '../screens/Settings/PrivacySettings'
import AppearanceSettings from '../screens/Settings/AppearanceSettings'
import HelpSettings from '../screens/Settings/HelpSettings'
import AboutSettings from '../screens/Settings/AboutSettings'
import routes from 'navigation/routes'

const Stack = createStackNavigator<ProfileStackParams>()

const Account: React.FC<{}> = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerTransparent: true,
    }}
  >
    <Stack.Screen name={routes.PROFILE} component={Profile} />
    <Stack.Screen name="SinglePost" component={SinglePostScreen} />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen
      name="FriendRequests"
      component={FriendRequests}
      options={{ title: 'Friend Requests' }}
    />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettings}
    />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
    <Stack.Screen name="AppearanceSettings" component={AppearanceSettings} />
    <Stack.Screen name="HelpSettings" component={HelpSettings} />
    <Stack.Screen name="AboutSettings" component={AboutSettings} />
  </Stack.Navigator>
)

export default Account
