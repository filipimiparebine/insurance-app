"use client"

import { useState, useEffect } from "react"
import type { Quote } from "@blaj/shared"
import { useWizard } from "./wizard-context"
import { OffersComparator } from "./offers-comparator"
import { Button } from "./button"
import { Skeleton } from "./skeleton"
import { t } from "@blaj/shared"
import { Percent, ChevronLeft } from "lucide-react"

interface MockOffer extends Quote {
  price_secondary?: number
  price_direct_settlement_secondary?: number
  secondary_label?: string
}

const MOCK_OFFERS: MockOffer[] = [
  {
    id: "1",
    insurer: "Allianz-Țiriac",
    insurer_logo_url: "",
    price_standard: 856.50,
    price_direct_settlement: 1038.79,
    price_secondary: 523.20,
    price_direct_settlement_secondary: 634.50,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "AT-2026-001",
    unavailable: false,
  },
  {
    id: "2",
    insurer: "Groupama",
    insurer_logo_url: "",
    price_standard: 923.40,
    price_direct_settlement: 1120.50,
    price_secondary: 564.80,
    price_direct_settlement_secondary: 685.30,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "GP-2026-002",
    unavailable: false,
  },
  {
    id: "3",
    insurer: "Omniasig",
    insurer_logo_url: "",
    price_standard: 789.30,
    price_direct_settlement: 967.80,
    price_secondary: 482.50,
    price_direct_settlement_secondary: 591.90,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "OM-2026-003",
    unavailable: false,
  },
  {
    id: "4",
    insurer: "Euroins",
    insurer_logo_url: "",
    price_standard: 723.15,
    price_direct_settlement: 887.40,
    price_secondary: 442.10,
    price_direct_settlement_secondary: 542.70,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "EU-2026-004",
    unavailable: false,
  },
  {
    id: "5",
    insurer: "Generali",
    insurer_logo_url: "",
    price_standard: 950.00,
    price_direct_settlement: 1180.00,
    price_secondary: 581.00,
    price_direct_settlement_secondary: 721.80,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "GE-2026-005",
    unavailable: false,
  },
  {
    id: "6",
    insurer: "Grawe",
    insurer_logo_url: "",
    price_standard: 812.75,
    price_direct_settlement: 998.50,
    price_secondary: 497.10,
    price_direct_settlement_secondary: 610.70,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "GR-2026-006",
    unavailable: false,
  },
  {
    id: "7",
    insurer: "Asirom",
    insurer_logo_url: "",
    price_standard: 670.00,
    price_direct_settlement: 845.30,
    price_secondary: 409.80,
    price_direct_settlement_secondary: 517.10,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "AS-2026-007",
    unavailable: false,
  },
  {
    id: "8",
    insurer: "Uniqa",
    insurer_logo_url: "",
    price_standard: 0,
    price_direct_settlement: 0,
    price_secondary: 0,
    bonus_malus_class: "B4",
    offer_code: "UN-2026-008",
    unavailable: true,
    unavailable_reason: "Nu oferă decontare directă pentru acest vehicul.",
  },
  {
    id: "9",
    insurer: "City Insurance",
    insurer_logo_url: "",
    price_standard: 734.20,
    price_direct_settlement: 899.99,
    price_secondary: 449.10,
    price_direct_settlement_secondary: 550.60,
    secondary_label: "6 luni",
    bonus_malus_class: "B4",
    offer_code: "CI-2026-009",
    unavailable: false,
  },
]

export function OffersStep() {
  const { state, setOffers, selectOffer, goNext, goPrev } = useWizard()
  const [loading, setLoading] = useState(true)

  const decontareDirecta = state.policy_config?.decontare_directa ?? true
  const existingOffers = state.offers ?? MOCK_OFFERS

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffers(MOCK_OFFERS)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSelect = (offerId: string) => {
    selectOffer(offerId)
  }

  const handleCheckout = (offerId: string) => {
    selectOffer(offerId)
    goNext()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent-soft">
          <Percent className="h-5 w-5 text-brand-accent" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-primary">
            {t("offers.title")}
          </h2>
          <p className="text-sm text-neutral-500">{t("offers.subtitle")}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <OffersComparator
          offers={existingOffers}
          selectedOfferId={state.selected_offer_id}
          onSelect={handleSelect}
          onCheckout={handleCheckout}
          decontareDirecta={decontareDirecta}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button type="button" variant="ghost" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
      </div>
    </div>
  )
}
