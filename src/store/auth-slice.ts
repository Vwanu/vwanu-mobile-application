import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'store'
import axios from 'axios'
import { Profile } from '../../types'
import { AuthTokenService } from '../lib/authTokenService'
import { WebSocketManagerFeathers } from '../services/websocket-manager-feathers'
import { NotificationSubscriptionManager } from '../services/subscriptions'

import {
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword as confirmReset,
  getCurrentUser,
} from 'aws-amplify/auth'

// Add secure temporary storage service
export class AuthSessionService {
  private static tempCredentials = new Map<string, string>()
  private static timeoutIds = new Map<string, NodeJS.Timeout>()
  private static dispatch: AppDispatch | null = null

  static setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch
  }

  static storeTempPassword(email: string, password: string) {
    this.tempCredentials.set(email, password)

    // Clear any existing timeout for this email
    const existingTimeout = this.timeoutIds.get(email)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      this.clearTempPassword(email)
      // Dispatch action to handle timeout
      if (this.dispatch) {
        this.dispatch(handleConfirmationTimeout())
      }
    }, 5 * 60 * 1000)

    this.timeoutIds.set(email, timeoutId)
  }

  static getTempPassword(email: string) {
    const password = this.tempCredentials.get(email)
    this.clearTempPassword(email)
    return password
  }

  static clearTempPassword(email: string) {
    this.tempCredentials.delete(email)
    const timeoutId = this.timeoutIds.get(email)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.timeoutIds.delete(email)
    }
  }
}

// Add new action for handling confirmation timeout
export const handleConfirmationTimeout = createAsyncThunk(
  'auth/handleConfirmationTimeout',
  async () => {
    // No async work needed, just return null
    return null
  }
)

export enum NextActions {
  INITIALIZING = 'INITIALIZING',
  BOARDED = 'BOARDED',
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_UP = 'SIGNED_UP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  CONFIRMED_SIGNUP = 'CONFIRMED_SIGNUP',
  RESET_PASSWORD = 'RESET_PASSWORD',
  AUTH_COMPLETED = 'AUTH_COMPLETED',
  SIGNED_IN_SIGNED_UP = 'SIGNED_IN_SIGNED_UP',
}

interface AuthState {
  username: string | null
  token: string | null
  idToken: string | null
  loading: boolean
  error: string | null
  nextAction: NextActions
  previousAction: NextActions
  userId: string | null
  birthdate: string | null
  location?: string | null
}

const initialState: AuthState = {
  username: null,
  token: null,
  idToken: null,
  loading: true,
  error: null,
  userId: null,
  nextAction: NextActions.INITIALIZING,
  previousAction: NextActions.INITIALIZING,
  birthdate: null,
  location: null,
}

// Define a simplified response interface
interface SignInResponse {
  token: string | null
  idToken: string | null
  userId: string | null
  // Add other necessary fields if needed
}

interface ForgotPasswordResponse {
  username: string | null
}

export const resendPasscode = createAsyncThunk(
  'auth/resendPasscode',
  async (email: string) => {
    await resendSignUpCode({ username: email })
    return email
  }
)

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async (
    {
      email,
      password,
      firstName,
      lastName,
      gender,
      dob,
      location = undefined,
    }: Profile & { password: string },
    { rejectWithValue }
  ) => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`

      await axios.post(url, {
        email,
        password,
        firstName,
        lastName,
        gender,
        dob,
        location,
      })
      // Store password temporarily in the service instead of returning it
      AuthSessionService.storeTempPassword(email, password)
      return email
    } catch (error: any) {
      // console.log('[signUpUser] Error:', error)

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`
        return rejectWithValue(message)
      } else if (error.request) {
        // Network error (no response received)
        return rejectWithValue('Network error. Please check your connection.')
      } else {
        // Other errors
        return rejectWithValue(error.message || 'An unexpected error occurred')
      }
    }
  }
)

export const confirmSignUpUser = createAsyncThunk<
  SignInResponse,
  { email: string; code: string }
>('auth/confirmSignUp', async ({ email, code }) => {
  await confirmSignUp({ username: email, confirmationCode: code })
  // Get the stored password from secure service
  const password = AuthSessionService.getTempPassword(email)

  if (!password) {
    throw new Error('Confirmation code expired. Please sign up again.')
  }

  // Ensure no existing session before signing in
  try {
    await getCurrentUser()
    await signOut({ global: true })
  } catch (_) {}

  // Sign in the user after confirmation
  try {
    await signIn({
      username: email,
      password,
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message?.toLowerCase().includes('already a signed in user')
    ) {
      try {
        await signOut({ global: true })
        await signIn({ username: email, password })
      } catch (retryError) {
        throw retryError
      }
    } else {
      throw error
    }
  }

  // Get the session to retrieve tokens
  try {
    const session = await fetchAuthSession()
    // console.log(`[debug] fetched session after confirmation`, session)

    const tokens = {
      token: session.tokens?.accessToken?.toString() || null,
      idToken: session.tokens?.idToken?.toString() || null,
      userId: session.tokens?.idToken?.payload.sub || null,
    }

    // Store tokens securely for persistence
    if (session.tokens && tokens.userId) {
      await AuthTokenService.storeTokens(session.tokens, tokens.userId)
    }

    return tokens
  } catch (error) {
    // console.log(`[debug] error fetching session after confirmation`, error)

    if (error instanceof Error) {
      if (
        error.message.includes('Network Error') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed')
      ) {
        throw new Error(
          'Network connection error. Please check your internet connection and try again.'
        )
      }
    }
    throw error
  }
})

export const signInUser = createAsyncThunk<
  SignInResponse,
  { email: string; password: string }
>('auth/signIn', async ({ email, password }, { dispatch }) => {
  try {
    // Ensure no existing session before signing in
    try {
      await getCurrentUser()
      await signOut({ global: true })
    } catch (_) {}

    const signInResult = await signIn({
      username: email,
      password,
    })

    // Check if the user needs to confirm their account
    if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      AuthSessionService.storeTempPassword(email, password)
      throw new Error('NEEDS_CONFIRMATION')
    }

    const session = await fetchAuthSession()
    const tokens = {
      token: session.tokens?.accessToken?.toString() || null,
      idToken: session.tokens?.idToken?.toString() || null,
      userId: session.tokens?.idToken?.payload.sub || null,
    }

    // Store tokens securely for persistence
    if (session.tokens && tokens.userId) {
      await AuthTokenService.storeTokens(session.tokens, tokens.userId)
    }

    return tokens
  } catch (error) {
    if (error instanceof Error) {
      if (error.message?.toLowerCase().includes('already a signed in user')) {
        // Attempt a forced sign-out and retry once
        try {
          await signOut({ global: true })
          const retry = await signIn({ username: email, password })
          if (retry.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
            AuthSessionService.storeTempPassword(email, password)
            throw new Error('NEEDS_CONFIRMATION')
          }
          const session = await fetchAuthSession()
          const tokens = {
            token: session.tokens?.accessToken?.toString() || null,
            idToken: session.tokens?.idToken?.toString() || null,
            userId: session.tokens?.idToken?.payload.sub || null,
          }

          // Store tokens securely for persistence
          if (session.tokens && tokens.userId) {
            await AuthTokenService.storeTokens(session.tokens, tokens.userId)
          }

          return tokens
        } catch (retryError) {
          throw retryError
        }
      }
      if (error.message === 'NEEDS_CONFIRMATION') {
        throw new Error('NEEDS_CONFIRMATION')
      }

      if (error.message.includes('Unauthenticated access')) {
        throw new Error('Please confirm your email address before signing in.')
      }
      throw error
    }
    throw error
  }
})

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // Stop notification subscription
      console.log('📡 Stopping notification subscription before sign out')
      NotificationSubscriptionManager.stopGlobalSubscription()

      // Disconnect Feathers WebSocket before signing out
      console.log('🔌 Disconnecting Feathers WebSocket before sign out')
      WebSocketManagerFeathers.disconnect()

      // Sign out from Cognito and clear tokens from secure storage
      await AuthTokenService.forceSignOut()

      return null
    } catch (error) {
      console.error('Error signing out:', error)
      return rejectWithValue('Failed to sign out')
    }
  }
)

export const forgotPassword = createAsyncThunk<ForgotPasswordResponse, string>(
  'auth/forgotPassword',
  async (email: string) => {
    await resetPassword({ username: email })
    return { username: email }
  }
)

export const confirmResetPassword = createAsyncThunk(
  'auth/confirmResetPassword',
  async (
    {
      username,
      code,
      newPassword,
    }: {
      username: string
      code: string
      newPassword: string
    },
    { rejectWithValue }
  ) => {
    try {
      // First try to confirm the password reset
      await confirmReset({ username, confirmationCode: code, newPassword })

      // Password reset was successful, now try to sign out globally
      try {
        await signOut({ global: true })
      } catch (signOutError) {
        // If sign out fails, log it but still consider the password reset successful
        // This prevents a sign out failure from causing the entire operation to fail
        console.warn(
          'Password reset successful but sign out failed:',
          signOutError
        )
      }

      return null
    } catch (resetError) {
      // This is a password reset error (the primary operation failed)
      console.error('Error confirming password reset:', resetError)

      // TypeScript assertion to extract error message or provide a fallback
      let errorMessage = 'Failed to confirm password reset'
      if (resetError instanceof Error) {
        errorMessage = resetError.message
      } else if (typeof resetError === 'string') {
        errorMessage = resetError
      }

      return rejectWithValue(errorMessage)
    }
  }
)

export const checkExistingSession = createAsyncThunk(
  'auth/checkExistingSession',
  async (_, { rejectWithValue }) => {
    try {
      // First check if we have stored tokens
      const storedTokens = await AuthTokenService.getStoredTokens()

      if (
        storedTokens.accessToken &&
        storedTokens.idToken &&
        storedTokens.userId
      ) {
        // We have stored tokens, verify they're still valid with Cognito
        try {
          const currentUser = await getCurrentUser()

          // Get fresh tokens (this will refresh if needed)
          const validTokens = await AuthTokenService.getValidTokens()

          if (validTokens?.accessToken && validTokens?.idToken) {
            return {
              username: currentUser.username,
              userId: currentUser.userId,
              token: validTokens.accessToken,
              idToken: validTokens.idToken,
              nextAction: NextActions.SIGNED_IN,
            }
          }
        } catch (cognitoError) {
          // Cognito session invalid, clear stored tokens
          await AuthTokenService.clearTokens()
        }
      }

      // No valid session found
      return rejectWithValue('No authenticated user')
    } catch (error) {
      // console.log('No existing session found', error)
      return rejectWithValue('No authenticated user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNextAction: (state, action: PayloadAction<NextActions>) => {
      state.nextAction = action.payload
    },
    setRequiredData: (
      state,
      action: PayloadAction<{ birthdate: string; location: string }>
    ) => {
      // console.log('[setBirthdate]', action.payload)
      state.birthdate = action.payload.birthdate
      state.location = action.payload.location
      state.nextAction = NextActions.SIGNED_IN_SIGNED_UP
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload
        state.previousAction = state.nextAction
        state.nextAction = NextActions.CONFIRMED_SIGNUP
      })
      .addCase(signUpUser.rejected, (state, action) => {
        // console.log('[signUpUser.rejected]>>>>>', action)
        state.loading = false
        state.error =
          (action.payload as string) || action.error.message || 'Sign up failed'
      })
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.idToken = action.payload.idToken
        state.userId = action.payload.userId
        // state.nextAction = action.payload?.email_confirmed_at
        //   ? 'AUTH_COMPLETE'
        //   : 'CONFIRM_SIGNUP';
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false
        if (action.error.message === 'NEEDS_CONFIRMATION') {
          state.username = action.meta.arg.email
          state.previousAction = state.nextAction
          state.nextAction = NextActions.CONFIRMED_SIGNUP
          state.error = 'Please confirm your email address to continue.'
        } else {
          state.error = action.error.message || 'Sign in failed'
        }
      })
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        // Reset auth state to initial values
        state.username = null
        state.token = null
        state.idToken = null
        state.userId = null
        state.error = null
        state.loading = false
        state.nextAction = NextActions.SIGNED_IN_SIGNED_UP // Or whatever your initial state should be
        state.previousAction = NextActions.BOARDED
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Sign out failed'
        state.loading = false
      })
      // Resend Passcode
      .addCase(resendPasscode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resendPasscode.fulfilled, (state) => {
        state.loading = false
        state.previousAction = state.nextAction
        state.nextAction = NextActions.CONFIRMED_SIGNUP
      })
      .addCase(resendPasscode.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to resend passcode'
      })
      // Confirm Sign Up
      .addCase(confirmSignUpUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(confirmSignUpUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.idToken = action.payload.idToken
        state.userId = action.payload.userId
        state.previousAction = state.nextAction
        state.nextAction = NextActions.AUTH_COMPLETED
      })
      .addCase(confirmSignUpUser.rejected, (state, action) => {
        state.loading = false
        if (action.error.message?.toLowerCase().includes('confirmed')) {
          state.previousAction = state.nextAction
          state.nextAction = NextActions.SIGNED_IN
        } else if (
          action.error.message
            ?.toLowerCase()
            .includes('network connection error')
        ) {
          state.error =
            'Unable to reach the server. Please check your internet connection and try again.'
          state.previousAction = state.nextAction
        } else {
          state.error = action.error.message || 'Failed to confirm sign up'
          state.previousAction = state.nextAction
        }
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.username = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.username = action.payload.username
        state.previousAction = state.nextAction
        state.nextAction = NextActions.RESET_PASSWORD
        // You might want to set a specific nextAction here if needed
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || 'Failed to initiate password reset'
        state.username = null
      })
      .addCase(confirmResetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.loading = false
        state.previousAction = state.nextAction
        state.nextAction = NextActions.SIGNED_IN
        state.username = null
        state.token = null
        state.idToken = null
        state.userId = null
        state.error = null
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to reset password'
      })
      .addCase(checkExistingSession.pending, (state) => {
        state.loading = true
      })
      .addCase(checkExistingSession.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.username
        state.userId = action.payload.userId
        state.token = action.payload.token
        state.idToken = action.payload.idToken
        state.nextAction = action.payload.nextAction
      })
      .addCase(checkExistingSession.rejected, (state) => {
        state.loading = false
        // When no existing session is found, transition to BOARDED
        state.nextAction = NextActions.BOARDED
        state.previousAction = NextActions.INITIALIZING
        // Don't set an error, this is an expected case
      })
      // Add handler for confirmation timeout
      .addCase(handleConfirmationTimeout.fulfilled, (state) => {
        state.loading = false
        state.error = 'Confirmation timeout. Please sign in again.'
        state.username = null
        state.previousAction = state.nextAction
        state.nextAction = NextActions.SIGNED_IN_SIGNED_UP
      })
  },
})

export const { setNextAction, setRequiredData } = authSlice.actions
export const isAuthenticated = (state: RootState) => {
  return Boolean(state.auth.token && state.auth.idToken)
}

export default authSlice.reducer
