"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Input } from "@blaj/ui"
import { Label } from "@blaj/ui"
import { Stepper, type StepperStep } from "@blaj/ui"
import { AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { api } from "@/lib/api-client"

type CancellationType = "withdrawal" | "sale" | "other"

interface Props {
  locale: string
  policyId: string
  onClose: () => void
}

export function CancellationWizard({ locale, policyId, onClose }: Props) {
  const isRo = locale === "ro"
  const [step, setStep] = useState(0)
  const [type, setType] = useState<CancellationType>("withdrawal")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ refunded: boolean; amount?: number; currency?: string } | null>(null)

  const steps: StepperStep[] = [
    { id: "confirm", label: isRo ? "Confirmă" : "Confirm", status: step > 0 ? "completed" : step === 0 ? "active" : "inactive" },
    { id: "details", label: isRo ? "Detalii" : "Details", status: step > 1 ? "completed" : step === 1 ? "active" : "inactive" },
    { id: "result", label: isRo ? "Rezultat" : "Result", status: step === 2 ? "active" : "inactive" },
  ]

  const handleCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.payments.cancelWithRefund(policyId, reason)
      setResult(data)
      setStep(2)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message ?? (isRo ? "A apărut o eroare." : "An error occurred."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isRo ? "Anulare poliță" : "Cancel policy"}
          </DialogTitle>
          <DialogDescription>
            {isRo
              ? "Procesul de anulare este ghidat pas cu pas."
              : "The cancellation process is guided step by step."}
          </DialogDescription>
        </DialogHeader>

        <Stepper steps={steps} className="mb-6" />

        {step === 0 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-warning/20 bg-warning-soft p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">
                    {isRo ? "Confirmă anularea" : "Confirm cancellation"}
                  </p>
                  <p className="mt-1 text-warning/80">
                    {isRo
                      ? "Această acțiune va anula polița selectată. Dacă te afli în perioada de retragere de 14 zile, vei primi rambursarea integrală."
                      : "This action will cancel the selected policy. If you are within the 14-day withdrawal period, you will receive a full refund."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-700">
                {isRo ? "Tipul anulării:" : "Cancellation type:"}
              </p>

              {(
                [
                  { value: "withdrawal", label: isRo ? "Retragere (14 zile)" : "Withdrawal (14 days)", desc: isRo ? "Rambursare integrală" : "Full refund" },
                  { value: "sale", label: isRo ? "Vânzare vehicul" : "Vehicle sale", desc: isRo ? "Restituire proporțională" : "Proportional refund" },
                  { value: "other", label: isRo ? "Alt motiv" : "Other reason", desc: isRo ? "Specifică motivul" : "Specify reason" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
                    type === opt.value
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelType"
                    value={opt.value}
                    checked={type === opt.value}
                    onChange={() => setType(opt.value)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      type === opt.value
                        ? "border-brand-primary bg-brand-primary"
                        : "border-neutral-300"
                    }`}
                  >
                    {type === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{opt.label}</p>
                    <p className="text-xs text-neutral-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">
                {isRo ? "Motivul anulării" : "Cancellation reason"}
              </Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  isRo
                    ? type === "withdrawal"
                      ? "Doresc să mă retrag din contract..."
                      : "Descrie motivul anulării..."
                    : type === "withdrawal"
                      ? "I wish to withdraw from the contract..."
                      : "Describe the cancellation reason..."
                }
                className="h-24"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {result ? (
              result.refunded ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft mb-4">
                    <CheckCircle className="h-7 w-7 text-success" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900 font-display">
                    {isRo ? "Poliță anulată" : "Policy cancelled"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {isRo
                      ? `Rambursare: ${result.amount ?? "—"} ${result.currency ?? "RON"}`
                      : `Refund: ${result.amount ?? "—"} ${result.currency ?? "RON"}`}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-soft mb-4">
                    <AlertTriangle className="h-7 w-7 text-warning" />
                  </div>
                  <p className="text-lg font-semibold text-neutral-900 font-display">
                    {isRo ? "Anulare fără rambursare" : "Cancelled without refund"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {isRo
                      ? "Polița a fost anulată. Nu se aplică rambursare pentru această situație."
                      : "The policy has been cancelled. No refund applies for this situation."}
                  </p>
                </div>
              )
            ) : error ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                  <XCircle className="h-7 w-7 text-red-500" />
                </div>
                <p className="text-lg font-semibold text-neutral-900 font-display">
                  {isRo ? "Eroare" : "Error"}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                <p className="mt-2 text-sm text-neutral-500">
                  {isRo ? "Se procesează anularea..." : "Processing cancellation..."}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div>
            {step > 0 && step < 2 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4" />
                {isRo ? "Înapoi" : "Back"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 2 && (
              <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
                {isRo ? "Renunță" : "Cancel"}
              </Button>
            )}
            {step === 0 && (
              <Button variant="primary" size="sm" onClick={() => setStep(1)}>
                {isRo ? "Continuă" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {step === 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isRo ? "Anulează polița" : "Cancel policy"
                )}
              </Button>
            )}
            {step === 2 && (
              <Button variant="primary" size="sm" onClick={onClose}>
                {isRo ? "Închide" : "Close"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
