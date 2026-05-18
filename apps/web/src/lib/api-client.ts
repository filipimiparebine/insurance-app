export interface ApiError {
  message: string
  status?: number
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Request failed" }))
    throw { message: body.message ?? body.error ?? "Request failed", status: res.status } as ApiError
  }
  return res.json() as Promise<T>
}

function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ""
  return `${base}/api${path}`
}

export interface PaymentIntentResult {
  clientSecret: string | null
  paymentIntentId: string
}

export interface CancelRefundResult {
  refunded: boolean
  amount?: number
  currency?: string
}

export const api = {
  policies: {
    list: (params?: { status?: string; limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.offset) searchParams.set("offset", String(params.offset))
      const qs = searchParams.toString()
      return fetch(apiUrl(`/policies${qs ? `?${qs}` : ""}`)).then(handleResponse)
    },
    get: (policyId: string) =>
      fetch(apiUrl(`/policies/${policyId}`)).then(handleResponse),
    cancel: (policyId: string, reason: string) =>
      fetch(apiUrl(`/policies/${policyId}/cancel`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }).then(handleResponse),
  },
  payments: {
    createIntent: (body: { quoteOfferId?: string; amount: number; currency?: string; customerId?: string }): Promise<PaymentIntentResult> =>
      fetch(apiUrl("/policies"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "createPaymentIntent", ...body }),
      }).then(handleResponse<PaymentIntentResult>),
    get: (paymentId: string) =>
      fetch(apiUrl(`/payments/${paymentId}`)).then(handleResponse),
    cancelWithRefund: (policyId: string, reason: string): Promise<CancelRefundResult> =>
      fetch(apiUrl(`/payments/cancel-with-refund`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, reason }),
      }).then(handleResponse<CancelRefundResult>),
  },
  account: {
    getProfile: () =>
      fetch(apiUrl("/account")).then(handleResponse),
    updatePreferences: (preferences: Record<string, boolean>) =>
      fetch(apiUrl("/account"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      }).then(handleResponse),
    delete: (reason?: string) =>
      fetch(apiUrl("/account"), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }).then(handleResponse),
  },
}

export type ApiClient = typeof api
