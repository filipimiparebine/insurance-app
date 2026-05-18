"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWizard } from "./wizard-context"
import { Button } from "./button"
import { Badge } from "./badge"
import { Separator } from "./separator"
import type { Quote } from "@blaj/shared"
import { t } from "@blaj/shared"
import { CreditCard, ChevronLeft, CheckCircle } from "lucide-react"

export function CheckoutStep() {
  const { state, setPaymentCompleted, goPrev } = useWizard()
  const [paying, setPaying] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const selectedOffer: Quote | undefined = state.offers?.find(
    (o: Quote) => o.id === state.selected_offer_id,
  )

  const handlePay = async () => {
    setPaying(true)
    await new Promise((r) => setTimeout(r, 2000))
    setPaymentCompleted()
    setPaying(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent-soft">
          <CreditCard className="h-5 w-5 text-brand-accent" />
        </div>
        <h2 className="text-xl font-display font-semibold text-primary">
          {t("checkout.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-surface p-6">
            <h3 className="text-sm font-semibold text-primary font-display mb-4">
              {t("checkout.summary")}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.insurer")}</span>
                <span className="font-medium text-primary">
                  {selectedOffer?.insurer ?? "Groupama"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.vehicle")}</span>
                <span className="font-medium text-primary">
                  {state.vehicle?.marca} {state.vehicle?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.period")}</span>
                <span className="font-medium text-primary">
                  {state.policy_config?.durata_luni ?? 12} luni
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.start_date")}</span>
                <span className="font-medium text-primary">
                  {state.policy_config?.data_inceput}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.net_premium")}</span>
                <span className="font-medium text-primary">
                  {((selectedOffer?.price_standard ?? 785.50) * 0.9).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} RON
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("checkout.broker_fee")}</span>
                <span className="font-medium text-primary">
                  {((selectedOffer?.price_standard ?? 785.50) * 0.1).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} RON
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>{t("checkout.total")}</span>
                <span className="text-brand-accent">
                  {(selectedOffer?.price_standard ?? 785.50).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} RON
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-surface p-6 space-y-4">
            <div className="flex h-20 items-center justify-center rounded-lg bg-neutral-50 border border-dashed border-neutral-300">
              <p className="text-xs text-neutral-400">
                {t("checkout.documents")}
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-electric"
              />
              <span className="text-xs text-neutral-600">
                {t("checkout.confirm_documents")}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <Button type="button" variant="ghost" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <Button
          variant="hero-accent"
          size="lg"
          disabled={!confirmed || paying}
          onClick={handlePay}
        >
          {paying ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <CreditCard className="h-4 w-4" />
              </motion.div>
              {t("common.loading")}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              {t("checkout.pay", { amount: (selectedOffer?.price_standard ?? 785.50).toFixed(2) })}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
