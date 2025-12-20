import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

export interface ErrorObject {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  retryText?: string
}

/**
 * Extracts a user-friendly error message from RTK Query errors
 * @param error - FetchBaseQueryError or SerializedError from RTK Query
 * @returns A human-readable error message string
 */
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError
): string => {
  if ('status' in error) {
    // FetchBaseQueryError
    if (error.status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.'
    }
    if (error.status === 'PARSING_ERROR') {
      // Check if it's an ngrok error (HTML response)
      const data = error.data as any
      if (typeof data === 'string' && data.includes('ngrok')) {
        // Extract ngrok error message if possible
        if (
          data.includes('connection refused') ||
          data.includes('ERR_NGROK_8012')
        ) {
          return 'Backend server is not running. Please start the server and try again.'
        }
        if (data.includes('ERR_NGROK')) {
          return 'Server connection error. Please check if the backend is running.'
        }
      }
      // Check for other HTML responses
      if (
        typeof data === 'string' &&
        (data.includes('<!DOCTYPE') || data.includes('<html'))
      ) {
        return 'Server returned invalid response. The backend may be down or misconfigured.'
      }
      return 'Error processing server response. Expected JSON but received something else.'
    }
    if (error.status === 'TIMEOUT_ERROR') {
      return 'Request timed out. Please try again.'
    }
    if (typeof error.status === 'number') {
      const data = error.data as any
      // Try to extract error message from various possible locations
      const message = data?.message || data?.error || data?.statusText
      return message || `Error: ${error.status}`
    }
    return 'An unexpected error occurred.'
  } else {
    // SerializedError
    return error.message || 'An unexpected error occurred.'
  }
}

/**
 * Creates an error object with message and optional retry callback
 * Automatically includes retry for network and timeout errors
 * @param error - FetchBaseQueryError or SerializedError from RTK Query
 * @param onRetry - Optional retry callback for retryable errors
 * @param onDismiss - Optional dismiss callback
 * @returns ErrorObject with message and retry callback for network/timeout errors
 */
export const getErrorObject = (
  error: FetchBaseQueryError | SerializedError,
  onRetry?: () => void,
  onDismiss?: () => void
): ErrorObject => {
  const message = getErrorMessage(error)
  const shouldAllowRetry = isNetworkError(error)

  return {
    message,
    onRetry: shouldAllowRetry ? onRetry : undefined,
    onDismiss,
    retryText: shouldAllowRetry ? 'Retry' : undefined,
  }
}

/**
 * Checks if an error is a network-related error
 * @param error - FetchBaseQueryError or SerializedError
 * @returns true if the error is network-related
 */
export const isNetworkError = (
  error: FetchBaseQueryError | SerializedError
): boolean => {
  if ('status' in error) {
    return error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR'
  }
  return false
}

/**
 * Checks if an error is a 4xx client error
 * @param error - FetchBaseQueryError or SerializedError
 * @returns true if the error is a client error (400-499)
 */
export const isClientError = (
  error: FetchBaseQueryError | SerializedError
): boolean => {
  if ('status' in error && typeof error.status === 'number') {
    return error.status >= 400 && error.status < 500
  }
  return false
}

/**
 * Checks if an error is a 5xx server error
 * @param error - FetchBaseQueryError or SerializedError
 * @returns true if the error is a server error (500-599)
 */
export const isServerError = (
  error: FetchBaseQueryError | SerializedError
): boolean => {
  if ('status' in error && typeof error.status === 'number') {
    return error.status >= 500 && error.status < 600
  }
  return false
}
