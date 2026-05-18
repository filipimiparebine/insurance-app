"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useWizard } from "./wizard-context"
import { Button } from "./button"
import { t } from "@blaj/shared"
import { CheckCircle, ArrowRight, Home } from "lucide-react"

export function ThankYouStep() {
  const { state, reset } = useWizard()
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setConfetti(true)
    const timer = setTimeout(() => setConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center relative overflow-hidden">
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: ["#FF6B1A", "#2563EB", "#22C55E", "#EAB308", "#EC4899"][i % 5],
                left: `${10 + (i * 4) % 80}%`,
              }}
              initial={{ y: -20, opacity: 1, scale: 0 }}
              animate={{
                y: [0, 200 + i * 10],
                opacity: [1, 1, 0],
                scale: [0, 1.2, 1, 0.5],
                rotate: [0, 180 + i * 30, 360 + i * 10],
              }}
              transition={{ duration: 1.5 + i * 0.1, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6"
      >
        <CheckCircle className="h-10 w-10 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-primary font-display">
          {t("success.title")}
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-md">
          {t("success.subtitle")}
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          {t("success.policy_sent", {
            email:
              state.owner?.tip_persoana === "pf"
                ? state.owner.email
                : state.owner?.tip_persoana === "pj"
                  ? state.owner.email_companie
                  : "email",
          })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-3"
      >
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
        >
          <Home className="h-4 w-4" />
          {t("success.dashboard")}
        </a>
        <Button variant="outline" onClick={reset}>
          {t("success.new_policy")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}
