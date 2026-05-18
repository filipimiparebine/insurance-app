"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import type { Quote } from "@blaj/shared"
import { cn } from "../lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import { Card, CardContent } from "./card"
import { t, formatPrice, getLocale } from "@blaj/shared"
import {
  ArrowUpDown,
  ShieldCheck,
  Shield,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  ShoppingCart,
  LayoutGrid,
  Table,
} from "lucide-react"

interface Offer extends Quote {
  price_secondary?: number
  price_direct_settlement_secondary?: number
  secondary_label?: string
}

type SortKey = "price_standard" | "price_direct_settlement" | "insurer" | "price_secondary"
type SortDir = "asc" | "desc"
type ViewMode = "grid" | "table"

interface OffersComparatorProps {
  offers: Offer[]
  selectedOfferId?: string
  onSelect: (offerId: string) => void
  onCheckout: (offerId: string) => void
  decontareDirecta: boolean
  className?: string
}

const staggerVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
} as const

export function OffersComparator({
  offers,
  selectedOfferId,
  onSelect,
  onCheckout,
  decontareDirecta,
  className,
}: OffersComparatorProps) {
  const [sortKey, setSortKey] = useState<SortKey>(
    decontareDirecta ? "price_direct_settlement" : "price_standard",
  )
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterDirectSettlementOnly, setFilterDirectSettlementOnly] =
    useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const locale = getLocale()

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filteredOffers = useMemo(() => {
    if (!filterDirectSettlementOnly) return offers
    return offers.filter(
      (o) => !o.unavailable && o.price_direct_settlement != null,
    )
  }, [offers, filterDirectSettlementOnly])

  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) => {
      const multiplier = sortDir === "asc" ? 1 : -1

      if (a.unavailable !== b.unavailable) {
        return a.unavailable ? 1 : -1
      }

      if (sortKey === "insurer") {
        return multiplier * a.insurer.localeCompare(b.insurer)
      }

      if (sortKey === "price_direct_settlement") {
        const priceA = a.price_direct_settlement ?? Infinity
        const priceB = b.price_direct_settlement ?? Infinity
        return multiplier * (priceA - priceB)
      }

      if (sortKey === "price_secondary") {
        const priceA = a.price_secondary ?? Infinity
        const priceB = b.price_secondary ?? Infinity
        return multiplier * (priceA - priceB)
      }

      return multiplier * (a.price_standard - b.price_standard)
    })
  }, [filteredOffers, sortKey, sortDir])

  const selectedOffer = useMemo(
    () => offers.find((o) => o.id === selectedOfferId),
    [offers, selectedOfferId],
  )

  const checkoutPrice = selectedOffer
    ? decontareDirecta
      ? (selectedOffer.price_direct_settlement ?? selectedOffer.price_standard)
      : selectedOffer.price_standard
    : 0

  const checkoutSecondaryPrice = selectedOffer?.price_secondary

  if (offers.length === 0) {
    return (
      <Card className={cn("text-center py-12", className)}>
        <CardContent>
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-primary mb-2">
            {t("offers.no_offers")}
          </h3>
          <p className="text-sm text-neutral-500">
            {t("offers.no_offers_detail")}
          </p>
        </CardContent>
      </Card>
    )
  }

  const availableOffers = sortedOffers.filter((o) => !o.unavailable)
  const minPrice = Math.min(
    ...availableOffers.map((o) =>
      decontareDirecta
        ? (o.price_direct_settlement ?? o.price_standard)
        : o.price_standard,
    ),
  )

  const showMobileTable = viewMode === "table"

  const staggerVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.07,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar: Sort + View + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-500 mr-1">
            {t("offers.price_standard")}:
          </span>
          {(["price_standard", "price_direct_settlement", "insurer"] as const)
            .filter((k) => k !== "price_direct_settlement" || decontareDirecta)
            .map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSort(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  sortKey === key
                    ? "bg-brand-primary text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
                )}
              >
                {key === "price_standard" && t("offers.price_standard")}
                {key === "price_direct_settlement" &&
                  t("offers.price_direct_settlement")}
                {key === "insurer" && "Asigurător"}
                {sortKey === key && <ArrowUpDown className="h-3 w-3" />}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-2">
          {decontareDirecta && (
            <button
              type="button"
              onClick={() => setFilterDirectSettlementOnly((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                filterDirectSettlementOnly
                  ? "bg-electric-soft text-electric"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
              )}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Decontare directă
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              setViewMode((v) => (v === "grid" ? "table" : "grid"))
            }
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            {viewMode === "grid" ? (
              <Table className="h-3 w-3" />
            ) : (
              <LayoutGrid className="h-3 w-3" />
            )}
            {viewMode === "grid" ? "Tabel" : "Grilă"}
          </button>
        </div>
      </div>

      {/* Grid view - desktop */}
      {!showMobileTable && (
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOffers.map((offer, i) => {
            const isSelected = offer.id === selectedOfferId
            const isUnavailable = offer.unavailable
            const price = decontareDirecta
              ? (offer.price_direct_settlement ?? offer.price_standard)
              : offer.price_standard
            const isBestPrice = price === minPrice && !isUnavailable

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                  <Card
                    className={cn(
                      "relative overflow-hidden transition-all duration-200",
                      isSelected && "ring-2 ring-electric shadow-lg",
                      isUnavailable && "opacity-60",
                      !isUnavailable &&
                        "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
                    )}
                    onClick={() => !isUnavailable && onSelect(offer.id)}
                  >
                    {isBestPrice && (
                      <div className="absolute top-0 right-0">
                        <Badge className="rounded-none rounded-bl-lg bg-success text-white border-0 text-xs px-3 py-1">
                          Cel mai bun preț
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-5">
                      {/* Insurer header */}
                      <div className="flex items-center gap-3 mb-4">
                        {offer.insurer_logo_url ? (
                          <img
                            src={offer.insurer_logo_url}
                            alt={offer.insurer}
                            className="h-8 w-8 rounded object-contain"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent-soft">
                            <Shield className="h-4 w-4 text-brand-accent" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {offer.insurer}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {t("offers.bonus_malus", {
                              cls: offer.bonus_malus_class,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* 12L price (primary) */}
                      <div className="space-y-1 mb-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-neutral-500">12 luni</span>
                          <span className="text-lg font-display font-semibold text-primary">
                            {formatPrice(price, locale)}
                          </span>
                        </div>
                      </div>

                      {/* Secondary period price */}
                      {offer.price_secondary && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-neutral-400">
                            {offer.secondary_label ?? "6 luni"}
                          </span>
                          <span className="text-sm font-mono text-neutral-500">
                            {formatPrice(
                              decontareDirecta
                                ? (offer.price_direct_settlement_secondary ??
                                    offer.price_secondary)
                                : offer.price_secondary,
                              locale,
                            )}
                          </span>
                        </div>
                      )}

                      {/* Direct settlement price line */}
                      {decontareDirecta && offer.price_direct_settlement && (
                        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-neutral-100">
                          <span className="text-xs text-neutral-500">
                            {t("offers.price_direct_settlement")}
                          </span>
                          <span className="text-sm font-mono font-medium text-brand-accent">
                            {formatPrice(
                              offer.price_direct_settlement,
                              locale,
                            )}
                          </span>
                        </div>
                      )}

                      <div className="mt-4">
                        {isUnavailable ? (
                          <Badge className="w-full justify-center bg-neutral-100 text-neutral-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {t("offers.unavailable")}
                          </Badge>
                        ) : (
                          <Button
                            variant={isSelected ? "primary" : "outline"}
                            size="sm"
                            className="w-full"
                            type="button"
                          >
                            {isSelected ? (
                              <>
                                <ShieldCheck className="h-4 w-4" />
                                Selectat
                              </>
                            ) : (
                              <>
                                {t("offers.choose")}
                                <ChevronRight className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
        </div>
      )}

      {/* Table view - mobile */}
      <div
        className={cn(
          "overflow-x-auto rounded-lg border border-neutral-200",
          !showMobileTable && "md:hidden",
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-100 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              <th className="px-4 py-3">Asigurător</th>
              <th className="px-4 py-3">12 luni</th>
              {decontareDirecta && <th className="px-4 py-3">Decontare</th>}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers
              .filter((o) => !o.unavailable)
              .map((offer) => {
                const isSelected = offer.id === selectedOfferId
                const price = decontareDirecta
                  ? (offer.price_direct_settlement ?? offer.price_standard)
                  : offer.price_standard
                return (
                  <tr
                    key={offer.id}
                    className={cn(
                      "border-t border-neutral-200 cursor-pointer transition-colors hover:bg-neutral-50",
                      isSelected && "bg-electric-soft",
                    )}
                    onClick={() => onSelect(offer.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">
                        {offer.insurer}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium">
                      {formatPrice(price, locale)}
                    </td>
                    {decontareDirecta && (
                      <td className="px-4 py-3 font-mono text-brand-accent">
                        {offer.price_direct_settlement
                          ? formatPrice(offer.price_direct_settlement, locale)
                          : "—"}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <Button
                        variant={isSelected ? "primary" : "ghost"}
                        size="sm"
                        type="button"
                      >
                        {isSelected ? "Selectat" : "Alege"}
                      </Button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* BAAR High-risk notice */}
      <Card className="bg-warning-soft border-warning/20">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">
              Atenție — Clasă bonus-malus
            </p>
            <p className="text-xs text-warning/80 mt-1">
              Ofertă valabilă în baza declarației tale. Pentru clasa B0 sau
              superioară, asigurătorii pot solicita documente justificative.
              Verifică datele înainte de plată.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sticky checkout bar */}
      {selectedOffer && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 z-40"
        >
          <Card className="shadow-xl border-electric/30">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-neutral-500">Ofertă selectată</p>
                <p className="text-sm font-semibold text-primary">
                  {selectedOffer.insurer}
                  {" · "}
                  <span className="text-lg font-display font-bold text-brand-accent">
                    {formatPrice(checkoutPrice, locale)}
                  </span>
                  {checkoutSecondaryPrice && (
                    <span className="text-xs font-normal text-neutral-400 ml-2">
                      sau {formatPrice(checkoutSecondaryPrice, locale)} / 6 luni
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="hero-accent"
                size="lg"
                type="button"
                onClick={() => onCheckout(selectedOffer.id)}
              >
                <ShoppingCart className="h-4 w-4" />
                Plătește {formatPrice(checkoutPrice, locale)} →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
