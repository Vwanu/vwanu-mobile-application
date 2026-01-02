import { Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator } from 'react-native-paper'
import React, { useEffect, useMemo, useCallback } from 'react'

// Navigation Stacks
import DrawerNavigator from './Drawer'
import AuthNavigator from './Auth.navigation'
import BoardingNavigator from './boarding.navigation'
import ProfileCreationNavigator from './updateuser.navigator'

import tw from '../lib/tailwind'
import { RootState, AppDispatch } from '../store'
import Screen from 'components/screen'
import { NextCompletionStep } from '../../types.d'
import { useFetchProfileQuery } from '../store/profiles'
import {
  NextActions,
  checkExistingSession,
  signOutUser,
} from '../store/auth-slice'
import { useTokenMonitoring } from '../hooks/useTokenMonitoring'
import { WebSocketManagerFeathers } from '../services/websocket-manager-feathers'
import { NotificationSubscriptionManager } from '../services/subscriptions'

interface AuthState {
  nextAction: NextActions
  token: string | null
  idToken: string | null
  userId: string | null
}

interface ProfileData {
  nextCompletionStep?: string | number
}

const Routes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth) as AuthState
  const { nextAction, token, idToken, userId } = authState

  // Memoized auth check
  const isAuthenticated = useMemo(
    () => Boolean(token && idToken && userId),
    [token, idToken, userId]
  )

  useTokenMonitoring({
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes
    enabled: isAuthenticated, // Only monitor when authenticated
  })

  // Memoized loading state check
  const isInitializing = useMemo(
    () => nextAction === NextActions.INITIALIZING,
    [nextAction]
  )

  // Check for existing Cognito session when the app starts
  useEffect(() => {
    if (isInitializing) {
      dispatch(checkExistingSession())
    }
  }, [dispatch, isInitializing])

  // Initialize Feathers WebSocket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      WebSocketManagerFeathers.initialize()
        .then(() => {
          // Start global notification subscription
          NotificationSubscriptionManager.startGlobalSubscription()
        })
        .catch((error) => {
          console.error('❌ Failed to initialize Feathers WebSocket:', error)
        })

      // Cleanup on unmount or when authentication changes
      return () => {
        console.log('🔌 Disconnecting Feathers WebSocket on auth state change')
        NotificationSubscriptionManager.stopGlobalSubscription()
        WebSocketManagerFeathers.disconnect()
      }
    }
  }, [isAuthenticated])

  const {
    data: profile,
    isLoading,
    isFetching,
    error,
  } = useFetchProfileQuery(userId || '', {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  })

  // Sign out immediately when profile fetch fails
  useEffect(() => {
    if (!isAuthenticated || !error) return

    console.log('🚫 Profile fetch failed, signing out user...', error)
    // Small delay to show error message before signing out
    const signOutTimer = setTimeout(() => {
      dispatch(signOutUser())
    }, 1500)

    return () => clearTimeout(signOutTimer)
  }, [isAuthenticated, error, dispatch])

  // Render initializing screen
  const renderInitializingScreen = useCallback(
    () => (
      <Screen>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" animating={true} />
          <Text style={tw`mt-4 text-gray-600`}>Checking session...</Text>
        </View>
      </Screen>
    ),
    []
  )

  // Render navigation based on auth state
  const renderNavigationByAuthState = useCallback(() => {
    return nextAction === NextActions.BOARDED ? (
      <BoardingNavigator />
    ) : (
      <AuthNavigator />
    )
  }, [nextAction])

  // Render navigation based on profile completion
  const renderNavigationByProfile = useCallback((profileData: ProfileData) => {
    // Safe parsing of nextCompletionStep
    let completionStep = NextCompletionStep.START // Default value

    if (
      profileData.nextCompletionStep !== undefined &&
      profileData.nextCompletionStep !== null
    ) {
      const step =
        typeof profileData.nextCompletionStep === 'string'
          ? parseInt(profileData.nextCompletionStep, 10)
          : Number(profileData.nextCompletionStep)

      // Validate the parsed value
      if (!isNaN(step) && step >= 1 && step <= 4) {
        completionStep = step
      } else {
        console.warn(
          'Invalid nextCompletionStep in profile:',
          profileData.nextCompletionStep,
          'defaulting to START'
        )
      }
    }

    switch (completionStep) {
      case NextCompletionStep.PROFILE_COMPLETE:
        return <DrawerNavigator />
      default:
        return <ProfileCreationNavigator />
    }
  }, [])

  // Determine what to render based on current state
  const renderContent = useMemo(() => {
    // Show loading/error states for authenticated users
    if (isAuthenticated && (isFetching || isLoading || error)) {
      return (
        <Screen loading={isFetching || isLoading}>
          {error ? (
            <View style={tw`flex-1 justify-center items-center p-4`}>
              <Text style={tw`text-lg text-gray-600 mb-4 text-center`}>
                Unable to load your profile. Signing out...
              </Text>
              <ActivityIndicator size="small" animating={true} />
            </View>
          ) : (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" animating={true} />
              <Text style={tw`mt-4 text-gray-600`}>Loading Profile...</Text>
            </View>
          )}
        </Screen>
      )
    }

    // Pre-Authentication Flow
    if (!isAuthenticated) {
      if (isInitializing) {
        return renderInitializingScreen()
      }
      return renderNavigationByAuthState()
    }

    // Post-Authentication Flow - User is authenticated
    if (profile) {
      return renderNavigationByProfile(profile)
    }

    // Fallback to profile creation if no profile data yet
    return <ProfileCreationNavigator />
  }, [
    isAuthenticated,
    isFetching,
    isLoading,
    error,
    isInitializing,
    profile,
    renderInitializingScreen,
    renderNavigationByAuthState,
    renderNavigationByProfile,
  ])

  return renderContent
}

export default Routes
