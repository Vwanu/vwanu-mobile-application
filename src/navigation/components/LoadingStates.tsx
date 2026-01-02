import React from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import tw from '../../lib/tailwind'
import Screen from '../../components/screen'

/**
 * Displayed during initial app load while checking for existing session
 */
export const SessionCheckingScreen: React.FC = () => (
  <Screen>
    <View style={tw`flex-1 justify-center items-center`}>
      <ActivityIndicator size="large" animating={true} />
      <Text style={tw`mt-4 text-gray-600`}>Checking session...</Text>
    </View>
  </Screen>
)

/**
 * Displayed while loading user profile after authentication
 */
export const ProfileLoadingScreen: React.FC = () => (
  <Screen loading={true}>
    <View style={tw`flex-1 justify-center items-center`}>
      <ActivityIndicator size="large" animating={true} />
      <Text style={tw`mt-4 text-gray-600`}>Loading Profile...</Text>
    </View>
  </Screen>
)

/**
 * Displayed when profile fetch fails, before automatic sign-out
 */
export const ProfileErrorScreen: React.FC = () => (
  <Screen>
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <Text style={tw`text-lg text-gray-600 mb-4 text-center`}>
        Unable to load your profile. Signing out...
      </Text>
      <ActivityIndicator size="small" animating={true} />
    </View>
  </Screen>
)
