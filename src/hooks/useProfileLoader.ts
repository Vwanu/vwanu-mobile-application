import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { useFetchProfileQuery } from '../store/profiles'
import { signOutUser } from '../store/auth-slice'
import { NextCompletionStep } from '../../types.d'

type ProfileLoadStatus = 'idle' | 'loading' | 'error' | 'ready'

interface UseProfileLoaderOptions {
  userId: string | null
  isAuthenticated: boolean
  autoSignoutDelay?: number
  enableAutoSignout?: boolean
}

interface UseProfileLoaderReturn {
  profile: any | null
  completionStep: NextCompletionStep
  status: ProfileLoadStatus
  isLoading: boolean
  error: any
}

/**
 * Parse nextCompletionStep safely with validation
 */
const parseCompletionStep = (
  nextCompletionStep: string | number | undefined | null
): NextCompletionStep => {
  if (nextCompletionStep === undefined || nextCompletionStep === null) {
    return NextCompletionStep.START
  }

  const step =
    typeof nextCompletionStep === 'string'
      ? parseInt(nextCompletionStep, 10)
      : Number(nextCompletionStep)

  if (!isNaN(step) && step >= 1 && step <= 4) {
    return step as NextCompletionStep
  }

  console.warn(
    'Invalid nextCompletionStep:',
    nextCompletionStep,
    'defaulting to START'
  )
  return NextCompletionStep.START
}

/**
 * Hook to load user profile with auto-signout on error.
 * Consolidates profile fetching and error handling logic.
 */
export const useProfileLoader = ({
  userId,
  isAuthenticated,
  autoSignoutDelay = 1500,
  enableAutoSignout = true,
}: UseProfileLoaderOptions): UseProfileLoaderReturn => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    data: profile,
    isLoading,
    isFetching,
    error,
  } = useFetchProfileQuery(userId || '', {
    skip: !isAuthenticated || !userId,
    refetchOnMountOrArgChange: true,
  })

  // Auto-signout on error
  useEffect(() => {
    if (!isAuthenticated || !error || !enableAutoSignout) return

    console.log('Profile fetch failed, signing out user...', error)
    const signOutTimer = setTimeout(() => {
      dispatch(signOutUser())
    }, autoSignoutDelay)

    return () => clearTimeout(signOutTimer)
  }, [isAuthenticated, error, dispatch, autoSignoutDelay, enableAutoSignout])

  // Parse completion step
  const completionStep = useMemo(
    () => parseCompletionStep(profile?.nextCompletionStep),
    [profile?.nextCompletionStep]
  )

  // Derive status
  const status: ProfileLoadStatus = useMemo(() => {
    if (!isAuthenticated) return 'idle'
    if (error) return 'error'
    if (isLoading || isFetching) return 'loading'
    if (profile) return 'ready'
    return 'idle'
  }, [isAuthenticated, error, isLoading, isFetching, profile])

  return {
    profile: profile || null,
    completionStep,
    status,
    isLoading: isLoading || isFetching,
    error,
  }
}

export default useProfileLoader
