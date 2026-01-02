import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { NextActions, checkExistingSession } from '../store/auth-slice'
import { useTokenMonitoring } from './useTokenMonitoring'
import { WebSocketManagerFeathers } from '../services/websocket-manager-feathers'
import { NotificationSubscriptionManager } from '../services/subscriptions'

interface UseAuthSessionOptions {
  tokenMonitoringInterval?: number
  enableTokenMonitoring?: boolean
}

interface UseAuthSessionReturn {
  isAuthenticated: boolean
  isInitializing: boolean
  nextAction: NextActions
  userId: string | null
}

/**
 * Hook to manage authentication session, WebSocket connections, and notifications.
 * Consolidates all session-related logic from the navigation component.
 */
export const useAuthSession = (
  options: UseAuthSessionOptions = {}
): UseAuthSessionReturn => {
  const {
    tokenMonitoringInterval = 5 * 60 * 1000,
    enableTokenMonitoring = true,
  } = options

  const dispatch = useDispatch<AppDispatch>()
  const { token, idToken, userId, nextAction } = useSelector(
    (state: RootState) => state.auth
  )

  // Derived states
  const isAuthenticated = useMemo(
    () => Boolean(token && idToken && userId),
    [token, idToken, userId]
  )

  const isInitializing = useMemo(
    () => nextAction === NextActions.INITIALIZING,
    [nextAction]
  )

  // Token monitoring
  useTokenMonitoring({
    checkInterval: tokenMonitoringInterval,
    enabled: enableTokenMonitoring && isAuthenticated,
  })

  // Session check on app start
  useEffect(() => {
    if (isInitializing) {
      dispatch(checkExistingSession())
    }
  }, [dispatch, isInitializing])

  // WebSocket and notification subscription management
  useEffect(() => {
    if (isAuthenticated) {
      WebSocketManagerFeathers.initialize()
        .then(() => {
          NotificationSubscriptionManager.startGlobalSubscription()
        })
        .catch((error) => {
          console.error('Failed to initialize WebSocket:', error)
        })

      return () => {
        NotificationSubscriptionManager.stopGlobalSubscription()
        WebSocketManagerFeathers.disconnect()
      }
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isInitializing,
    nextAction,
    userId,
  }
}

export default useAuthSession
