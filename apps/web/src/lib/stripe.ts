import { loadStripe, type Stripe } from "@stripe/stripe-js"

let _stripePromise: Promise<Stripe | null> | null = null

export function getStripe(): Promise<Stripe | null> {
  if (!_stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.warn("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
      return Promise.resolve(null)
    }
    _stripePromise = loadStripe(key)
  }
  return _stripePromise
}

export const STRIPE_ELEMENT_THEME = {
  variables: {
    colorPrimary: "#FF6B1A",
    colorBackground: "#ffffff",
    colorText: "#0A0A0F",
    colorDanger: "#dc2626",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e5e7eb",
      boxShadow: "none",
      fontSize: "15px",
      padding: "12px",
    },
    ".Input:focus": {
      borderColor: "#FF6B1A",
      boxShadow: "0 0 0 2px rgba(255, 107, 26, 0.15)",
    },
    ".Label": {
      fontSize: "13px",
      fontWeight: "500",
      color: "#6b7280",
      marginBottom: "4px",
    },
  },
} as const
