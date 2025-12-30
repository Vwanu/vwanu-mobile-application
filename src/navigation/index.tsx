import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { Layout, Button } from '@ui-kitten/components'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator } from 'react-native-paper'

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
// Import WebSocket test utility (only loads in development)
if (__DEV__) {
  require('../services/websocket-test')
}

interface GeneralError {
  className: string
  code: number
  message: string
  name: string
}

interface AuthState {
  nextAction: NextActions
  token: string | null
  idToken: string | null
  userId: string | null
}

interface ProfileData {
  nextCompletionStep?: string | number
}

interface RetryState {
  retryCount: number
  lastRetryTime: number
  maxRetries: number
}

// Utility function to detect 404 errors from RTK Query
const is404Error = (error: any): boolean => {
  return (
    error?.status === 404 ||
    error?.data?.status === 404 ||
    (error?.status === 'FETCH_ERROR' && error?.error?.includes('404'))
  )
}

const Routes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const authState = useSelector((state: RootState) => state.auth) as AuthState
  const { nextAction, token, idToken, userId } = authState

  // Enhanced retry state management
  const [retryState, setRetryState] = useState<RetryState>({
    retryCount: 0,
    lastRetryTime: 0,
    maxRetries: 3,
  })

  // Memoized auth check
  const isAuthenticated = useMemo(
    () => Boolean(token && idToken && userId),
    [token, idToken, userId]
  )

  // Initialize token monitoring for authenticated users
  const { isMonitoring } = useTokenMonitoring({
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
      console.log(
        '🔌 User authenticated, initializing Feathers WebSocket connection'
      )

      // Initialize Feathers WebSocket connection
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

  // Optimized debug logging (only in development)
  // useEffect(() => {
  //   if (__DEV__) {
  //     console.log('Auth State:', {
  //       token: !!token,
  //       idToken: !!idToken,
  //       userId,
  //       nextAction,
  //     })
  //   }
  // }, [token, idToken, userId, nextAction])

  // Enhanced profile query with retry logic
  const {
    data: profile,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchProfileQuery(userId || '', {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  })

  // Smart retry function with exponential backoff (excludes 404 errors)
  const handleRetry = useCallback(async () => {
    // Don't retry if current error is a 404
    if (error && is404Error(error)) {
      console.log('🚫 Cannot retry 404 error - profile not found')
      return
    }

    const now = Date.now()
    const timeSinceLastRetry = now - retryState.lastRetryTime

    // Implement exponential backoff: 1s, 2s, 4s, 8s...
    const backoffDelay = Math.pow(2, retryState.retryCount) * 1000

    if (timeSinceLastRetry < backoffDelay) {
      // Too soon to retry, wait a bit more
      const remainingTime = backoffDelay - timeSinceLastRetry
      setTimeout(() => handleRetry(), remainingTime)
      return
    }

    if (retryState.retryCount < retryState.maxRetries) {
      setRetryState((prev) => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        lastRetryTime: now,
      }))

      try {
        await refetch()
        // Reset retry count on successful fetch
        setRetryState((prev) => ({ ...prev, retryCount: 0 }))
      } catch (error) {
        // console.log('Retry failed:', error)

        // If this was the last retry attempt, sign out the user
        if (retryState.retryCount + 1 >= retryState.maxRetries) {
          console.log(
            '🚫 Maximum retries reached for profile fetch, signing out user...'
          )
          dispatch(signOutUser())
        }
      }
    } else {
      // Max retries already reached, sign out the user
      console.log(
        '🚫 Maximum retries reached for profile fetch, signing out user...'
      )
      dispatch(signOutUser())
    }
  }, [error, refetch, retryState, dispatch])

  // Reset retry state when authentication changes
  useEffect(() => {
    setRetryState((prev) => ({ ...prev, retryCount: 0 }))
  }, [isAuthenticated])

  // Handle immediate sign-out for 404 profile errors or max retries reached
  useEffect(() => {
    if (!isAuthenticated || !error) return

    // Check if error is a 404 (profile not found)
    if (is404Error(error)) {
      console.log('🚫 Profile not found (404), signing out user immediately...')
      // Immediate sign-out for 404 errors - no delay needed
      dispatch(signOutUser())
      return
    }

    // Handle max retries for other error types
    const maxRetriesReached = retryState.retryCount >= retryState.maxRetries
    if (maxRetriesReached) {
      console.log(
        '🚫 Maximum retries reached for profile fetch, automatically signing out user...'
      )
      // Add a small delay to show the error message before signing out
      const signOutTimer = setTimeout(() => {
        dispatch(signOutUser())
      }, 2000) // 2 second delay

      return () => clearTimeout(signOutTimer)
    }
  }, [
    isAuthenticated,
    error,
    retryState.retryCount,
    retryState.maxRetries,
    dispatch,
  ])

  // Enhanced error message calculation with retry context
  const errorMessage = useMemo(() => {
    if (!error) return null

    // For 404 errors, don't allow retries and show appropriate message
    if (is404Error(error)) {
      return {
        message: 'Profile not found. You will be signed out automatically.',
        onRetry: undefined, // No retry for 404 errors
        retryText: 'Signing out...',
      }
    }

    const isRetryable = retryState.retryCount < retryState.maxRetries
    const retryText = isRetryable
      ? `Try Again ${
          retryState.retryCount > 0
            ? `(${retryState.retryCount}/${retryState.maxRetries})`
            : ''
        }`
      : 'Max Retries Reached'

    if ('error' in error) {
      return {
        message: isRetryable
          ? 'Network error. Please check your internet connection.'
          : 'Network error. Please check your connection and restart the app if the problem persists.',
        onRetry: isRetryable ? handleRetry : undefined,
        retryText,
      }
    }

    if (
      'data' in error &&
      (error.data as GeneralError)?.className === 'general-error'
    ) {
      return {
        message: isRetryable
          ? 'Unable to connect to database. Please try again later.'
          : 'Database connection failed. Please restart the app or contact support.',
        onRetry: isRetryable ? handleRetry : undefined,
        retryText,
      }
    }

    return {
      message: isRetryable
        ? 'Unable to load your profile. Please check your connection and try again.'
        : 'Failed to load profile after multiple attempts. You will be signed out for security.',
      onRetry: isRetryable ? handleRetry : undefined,
      retryText,
    }
  }, [error, retryState, handleRetry])

  // Enhanced error display message with retry context
  const errorDisplayMessage = useMemo(() => {
    if (!error) return ''

    // For 404 errors, show immediate sign-out message
    if (is404Error(error)) {
      return 'Profile not found. You will be signed out automatically to reset your session.'
    }

    const hasRetried = retryState.retryCount > 0
    const maxRetriesReached = retryState.retryCount >= retryState.maxRetries

    if (
      'data' in error &&
      (error.data as GeneralError)?.className === 'general-error'
    ) {
      if (maxRetriesReached) {
        return 'Database connection failed after multiple attempts. Our team has been notified. Please restart the app or contact support.'
      }
      return `We are having trouble connecting to our database. ${
        hasRetried
          ? `Retry ${retryState.retryCount}/${retryState.maxRetries}.`
          : ''
      } Our team has been notified and is working on it.`
    }

    if (maxRetriesReached) {
      return 'Unable to load your profile after multiple attempts. You will be signed out for security reasons. Please sign in again.'
    }

    return `Unable to load your profile. ${
      hasRetried
        ? `Retry ${retryState.retryCount}/${retryState.maxRetries}.`
        : ''
    } Please check your connection and try again.`
  }, [error, retryState])

  // Memoized loading state message
  const loadingMessage = useMemo(() => {
    if (retryState.retryCount > 0) {
      return `Loading Profile... (Retry ${retryState.retryCount}/${retryState.maxRetries})`
    }
    return 'Loading Profile...'
  }, [retryState])

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

    // if (__DEV__) {
    //   console.log(
    //     'Profile navigation - completionStep:',
    //     completionStep,
    //     'raw value:',
    //     profileData.nextCompletionStep
    //   )
    // }

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
        <Screen loading={isFetching || isLoading} error={errorMessage}>
          {error ? (
            <Layout style={tw`flex-1 justify-center items-center p-4`}>
              <Text style={tw`text-lg text-gray-600 mb-4 text-center`}>
                {errorDisplayMessage}
              </Text>
            </Layout>
          ) : (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" animating={true} />
              <Text style={tw`mt-4 text-gray-600`}>{loadingMessage}</Text>
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
    errorMessage,
    errorDisplayMessage,
    loadingMessage,
    isInitializing,
    profile,
    renderInitializingScreen,
    renderNavigationByAuthState,
    renderNavigationByProfile,
  ])

  return renderContent
}

export default Routes
