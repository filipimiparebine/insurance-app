import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { AppRouter } from '@blaj/api'

const API_URL: string =
  (process.env as any).EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

const link = new RPCLink({
  url: `${API_URL}/api/orpc`,
  fetch: async (request, init) => {
    const token = await getAuthToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return fetch(request, init)
  },
})

let getAuthToken: () => Promise<string | null> = async () => null

export function setAuthTokenProvider(provider: () => Promise<string | null>) {
  getAuthToken = provider
}

export const client = createORPCClient<AppRouter>(link)
