import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { api } from '../lib/api'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

interface PushNotificationData {
  policyId?: string
  type?: string
}

function navigateFromNotification(data: PushNotificationData) {
  if (data.policyId) {
    router.push(`/(app)/politica/${data.policyId}`)
  } else if (
    data.type === 'reminder_60d' ||
    data.type === 'reminder_30d' ||
    data.type === 'reminder_7d'
  ) {
    router.push('/(app)/(tabs)/polite')
  }
}

export function usePushNotifications() {
  const { user } = useUser()
  const userId = user?.id
  const responseListener = useRef<Notifications.Subscription>()
  const token = useRef<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const uid = userId
    let cancelled = false

    async function register() {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') return

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'General',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        })
      }

      const expoToken = (await Notifications.getExpoPushTokenAsync()).data
      if (cancelled) return

      token.current = expoToken

      await api.pushTokens.register({
        userId: uid,
        token: expoToken,
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
      })
    }

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as PushNotificationData
        navigateFromNotification(data)
      })

    Notifications.getLastNotificationResponseAsync().then((lastResponse) => {
      if (lastResponse && !cancelled) {
        const data = lastResponse.notification.request.content.data as PushNotificationData
        navigateFromNotification(data)
      }
    })

    register()

    return () => {
      cancelled = true
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }

      if (token.current) {
        api.pushTokens
          .unregister({ userId: uid, token: token.current })
          .catch(() => {})
      }
    }
  }, [userId])
}
