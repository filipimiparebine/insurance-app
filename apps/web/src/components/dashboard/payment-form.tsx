"use client"

import { useState, useCallback } from "react"
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import type { StripePaymentElementOptions, StripeExpressCheckoutElementOptions } from "@stripe/stripe-js"
import { Card, CardContent, CardHeader, CardTitle } from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Separator } from "@blaj/ui"
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { api } from "@/lib/api-client"
import { getStripe, STRIPE_ELEMENT_THEME } from "@/lib/stripe"

interface PaymentFormProps {
  locale: string
  amount: number
  currency?: string
  orderSummary?: {
    label: string
    value: string
  }[]
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
  onClose?: () => void
}

export function PaymentForm(props: PaymentFormProps) {
  const { locale, amount, currency = "RON", orderSummary, onSuccess, onError, onClose } = props
  const isRo = locale === "ro"
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [stripePromise] = useState(getStripe)

  const handleInitiatePayment = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const result = await api.payments.createIntent({ amount, currency })
      setClientSecret(result.clientSecret)
      setPaymentIntentId(result.paymentIntentId)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setErrorMsg(err.message ?? (isRo ? "Eroare la inițierea plății." : "Payment initiation error."))
      setStatus("failed")
      onError?.(err.message ?? "Payment error")
    } finally {
      setLoading(false)
    }
  }, [amount, currency, isRo, onError])

  const handleSuccess = useCallback((piId: string) => {
    setStatus("succeeded")
    onSuccess?.(piId)
  }, [onSuccess])

  const handleReset = useCallback(() => {
    setStatus("idle")
    setErrorMsg(null)
    setClientSecret(null)
    setPaymentIntentId(null)
  }, [])

  const formatAmount = (value: number) =>
    new Intl.NumberFormat(isRo ? "ro-RO" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

  return (
    <div className="space-y-4">
      {orderSummary && orderSummary.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {isRo ? "Sumar comandă" : "Order summary"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orderSummary.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-neutral-500">{item.label}</span>
                <span className="font-medium text-neutral-900">{item.value}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-neutral-900">
                {isRo ? "Total de plată" : "Total"}
              </span>
              <span className="text-brand-primary">
                {formatAmount(amount)} {currency}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "idle" && !clientSecret && (
        <IdleState
          isRo={isRo}
          loading={loading}
          amount={amount}
          currency={currency}
          formatAmount={formatAmount}
          onPay={handleInitiatePayment}
        />
      )}

      {clientSecret && status !== "succeeded" && status !== "failed" && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: STRIPE_ELEMENT_THEME,
          }}
        >
          <PaymentFormInner
            isRo={isRo}
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId ?? ""}
            onSuccess={handleSuccess}
            onError={(msg) => {
              setErrorMsg(msg)
              setStatus("failed")
            }}
            onBack={handleReset}
          />
        </Elements>
      )}

      {status === "succeeded" && (
        <SuccessState
          isRo={isRo}
          paymentIntentId={paymentIntentId}
          onClose={onClose}
        />
      )}

      {status === "failed" && (
        <FailedState
          isRo={isRo}
          errorMsg={errorMsg}
          onRetry={handleReset}
        />
      )}
    </div>
  )
}

function IdleState({
  isRo,
  loading,
  amount,
  currency,
  formatAmount,
  onPay,
}: {
  isRo: boolean
  loading: boolean
  amount: number
  currency: string
  formatAmount: (v: number) => string
  onPay: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Lock className="h-4 w-4 text-success" />
          <span className="text-neutral-700">
            {isRo
              ? "Plată securizată prin Stripe. Datele cardului nu trec prin serverele noastre."
              : "Secure payment via Stripe. Card details never pass through our servers."}
          </span>
        </div>
      </div>

      <Button
        variant="hero-accent"
        size="lg"
        className="w-full"
        onClick={onPay}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            {isRo
              ? `Plătește ${formatAmount(amount)} ${currency}`
              : `Pay ${formatAmount(amount)} ${currency}`}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-neutral-400">
        Visa &middot; Mastercard &middot; Apple Pay &middot; Google Pay &middot; Link
      </p>
    </div>
  )
}

function PaymentFormInner({
  isRo,
  paymentIntentId,
  onSuccess,
  onError,
  onBack,
}: {
  isRo: boolean
  clientSecret: string
  paymentIntentId: string
  onSuccess: (paymentIntentId: string) => void
  onError: (msg: string) => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  }

  const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
    buttonHeight: 48,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setValidationError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setValidationError(submitError.message ?? "Validation error")
      setSubmitting(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${isRo ? "ro" : "en"}/dashboard`,
      },
      redirect: "if_required",
    })

    if (error) {
      setValidationError(error.message ?? (isRo ? "Plata a eșuat." : "Payment failed."))
      onError(error.message ?? "Payment failed")
      setSubmitting(false)
    } else {
      onSuccess(paymentIntentId)
    }
  }

  const handleExpressCheckoutConfirm = () => {
    onSuccess(paymentIntentId)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Lock className="h-4 w-4 text-success" />
          <span className="text-neutral-700">
            {isRo
              ? "Plată securizată prin Stripe. Datele cardului nu trec prin serverele noastre."
              : "Secure payment via Stripe. Card details never pass through our servers."}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
        <ExpressCheckoutElement
          options={expressCheckoutOptions}
          onConfirm={handleExpressCheckoutConfirm}
          className="mb-2"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400">
              {isRo ? "sau card" : "or card"}
            </span>
          </div>
        </div>

        <PaymentElement options={paymentElementOptions} />
      </div>

      {validationError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {validationError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          {isRo ? "Înapoi" : "Back"}
        </Button>
        <Button
          type="submit"
          variant="hero-accent"
          size="lg"
          className="flex-1"
          disabled={!stripe || !elements || submitting}
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              {isRo ? "Confirmă plata" : "Confirm payment"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

function SuccessState({
  isRo,
  paymentIntentId,
  onClose,
}: {
  isRo: boolean
  paymentIntentId: string | null
  onClose?: () => void
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft mx-auto">
        <CheckCircle className="h-7 w-7 text-success" />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-900 font-display">
          {isRo ? "Plată reușită!" : "Payment successful!"}
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          {isRo
            ? "Tranzacția a fost procesată cu succes."
            : "Transaction was processed successfully."}
        </p>
        {paymentIntentId && (
          <p className="text-xs text-neutral-400 mt-1">ID: {paymentIntentId}</p>
        )}
      </div>
      {onClose && (
        <Button variant="primary" size="sm" onClick={onClose}>
          {isRo ? "Închide" : "Close"}
        </Button>
      )}
    </div>
  )
}

function FailedState({
  isRo,
  errorMsg,
  onRetry,
}: {
  isRo: boolean
  errorMsg: string | null
  onRetry: () => void
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mx-auto">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-900 font-display">
          {isRo ? "Plată eșuată" : "Payment failed"}
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          {errorMsg ?? (isRo ? "Plata nu a putut fi procesată." : "Payment could not be processed.")}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {isRo ? "Încearcă din nou" : "Try again"}
      </Button>
    </div>
  )
}
