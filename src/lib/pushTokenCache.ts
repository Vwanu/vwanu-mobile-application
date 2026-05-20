import * as SecureStore from 'expo-secure-store'

const KEY = 'expo_push_token'

export const getCachedToken = (): Promise<string | null> =>
  SecureStore.getItemAsync(KEY)

export const setCachedToken = (token: string): Promise<void> =>
  SecureStore.setItemAsync(KEY, token)

export const clearCachedToken = (): Promise<void> =>
  SecureStore.deleteItemAsync(KEY)
