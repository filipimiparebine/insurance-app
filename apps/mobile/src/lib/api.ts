import type { CreatePaymentIntentInput, CreatePaymentIntentOutput } from '@blaj/api'
import type { RegisterPushTokenInput, UnregisterPushTokenInput } from '@blaj/api/contracts'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

let getAuthToken: () => Promise<string | null> = async () => null

export function setApiAuthTokenProvider(provider: () => Promise<string | null>) {
  getAuthToken = provider
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  const token = await getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message ?? body.error ?? `API error: ${response.status}`)
  }
  return response.json()
}

export const api = {
  payments: {
    createIntent: (input: CreatePaymentIntentInput) =>
      request<CreatePaymentIntentOutput>('/api/public/payments/createIntent', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },
  pushTokens: {
    register: (input: RegisterPushTokenInput) =>
      request<{ success: boolean }>('/api/public/pushTokens/register', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    unregister: (input: UnregisterPushTokenInput) =>
      request<{ success: boolean }>('/api/public/pushTokens/unregister', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },
  account: {
    updatePreferences: (preferences: {
      emailReminders?: boolean
      smsReminders?: boolean
      pushReminders?: boolean
    }) =>
      request<{ success: boolean }>('/api/public/account/updatePreferences', {
        method: 'PUT',
        body: JSON.stringify({ preferences }),
      }),
    getProfile: () =>
      request<{
        user: Record<string, unknown>
        persons: Record<string, unknown>[]
        vehicles: Record<string, unknown>[]
        policies: Record<string, unknown>[]
      }>('/api/public/account/getProfile', { method: 'GET' }),
  },
}
