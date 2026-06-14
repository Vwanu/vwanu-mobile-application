import { useEffect } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'

import {
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} from '../store/devices-api-slice'
import {
  getCachedToken,
  setCachedToken,
  clearCachedToken,
} from '../lib/pushTokenCache'

const ensureAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  })
}

export const usePushNotifications = (isAuthenticated: boolean): void => {
  const [registerPushToken] = useRegisterPushTokenMutation()
  const [unregisterPushToken] = useUnregisterPushTokenMutation()

  useEffect(() => {
    if (!isAuthenticated) return
    if (!Device.isDevice) return

    let cancelled = false

    const run = async () => {
      await ensureAndroidChannel()

      const { status } = await Notifications.getPermissionsAsync()

      if (status !== 'granted') {
        const { status: requested } =
          await Notifications.requestPermissionsAsync()
        if (requested !== 'granted') {
          const cached = await getCachedToken()
          if (cached) {
            try {
              await unregisterPushToken(cached).unwrap()
            } catch (err) {
              console.warn(
                '[usePushNotifications] unregister failed (likely already reassigned):',
                err
              )
            }
            await clearCachedToken()
          }
          return
        }
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        (Constants as { easConfig?: { projectId?: string } }).easConfig
          ?.projectId

      if (!projectId) {
        console.warn(
          '[usePushNotifications] No EAS projectId in app config — skipping token registration'
        )
        return
      }

      let token: string
      try {
        const result = await Notifications.getExpoPushTokenAsync({ projectId })
        token = result.data
      } catch (err) {
        console.warn(
          '[usePushNotifications] getExpoPushTokenAsync failed:',
          err
        )
        return
      }

      if (cancelled) return

      const cached = await getCachedToken()
      const platform: 'ios' | 'android' =
        Platform.OS === 'ios' ? 'ios' : 'android'

      if (cached !== token) {
        try {
          await registerPushToken({ token, platform }).unwrap()
          await setCachedToken(token)
        } catch (err) {
          console.warn('[usePushNotifications] registerPushToken failed:', err)
          return
        }

        if (cached) {
          await unregisterPushToken(cached).catch(() => {})
        }
      } else {
        registerPushToken({ token, platform })
          .unwrap()
          .catch((err) =>
            console.warn(
              '[usePushNotifications] re-register failed (non-fatal):',
              err
            )
          )
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, registerPushToken, unregisterPushToken])
}

export default usePushNotifications
