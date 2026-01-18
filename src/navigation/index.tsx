import React from 'react'

// Navigation Stacks
import DrawerNavigator from './Drawer'
import AuthNavigator from './Auth.navigation'
import BoardingNavigator from './boarding.navigation'
import ProfileCreationNavigator from './updateuser.navigator'

// Hooks
import { useAuthSession } from '../hooks/useAuthSession'
import { useProfileLoader } from '../hooks/useProfileLoader'
import { NextActions } from '../store/auth-slice'
import { NextCompletionStep } from '../../types.d'

// Components
import {
  SessionCheckingScreen,
  ProfileLoadingScreen,
  ProfileErrorScreen,
} from './components/LoadingStates'

const Routes: React.FC = () => {
  // Session management (WebSocket, subscriptions, token monitoring)
  const { isAuthenticated, isInitializing, nextAction, userId } =
    useAuthSession()

  // Profile loading with auto-signout on error
  const { status: profileStatus, completionStep } = useProfileLoader({
    userId,
    isAuthenticated,
  })

  // Pre-authentication: Show initializing screen
  if (isInitializing) {
    return <SessionCheckingScreen />
  }

  // Pre-authentication: Show auth/boarding flow
  if (!isAuthenticated) {
    return nextAction === NextActions.BOARDED ? (
      <BoardingNavigator />
    ) : (
      <AuthNavigator />
    )
  }

  // Post-authentication: Handle profile loading states
  if (profileStatus === 'loading') {
    return <ProfileLoadingScreen />
  }

  if (profileStatus === 'error') {
    return <ProfileErrorScreen />
  }

  // Post-authentication: Navigate based on profile completion
  if (completionStep === NextCompletionStep.PROFILE_COMPLETE) {
    return <DrawerNavigator />
  }

  // Profile not complete - show profile creation flow
  return <ProfileCreationNavigator />
}

export default Routes
