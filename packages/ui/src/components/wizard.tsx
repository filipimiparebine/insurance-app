"use client"

import { type WizardStep } from "@blaj/shared"
import { WizardProvider, useWizard } from "./wizard-context"
import { Stepper, type StepperStep } from "./stepper"
import { ErrorBoundary } from "./error-boundary"
import { VehicleStep } from "./vehicle-step"
import { OwnerStep } from "./owner-step"
import { ConfigStep } from "./config-step"
import { OffersStep } from "./offers-step"
import { CheckoutStep } from "./checkout-step"
import { ThankYouStep } from "./thank-you-step"
import { t } from "@blaj/shared"
import { motion, AnimatePresence } from "framer-motion"
import { animations } from "../index"

const STEP_KEYS: Record<WizardStep, string | null> = {
  landing: null,
  vehicle: "wizard.step1",
  owner: "wizard.step2",
  config: "wizard.step3",
  offers: "wizard.step4",
  checkout: "wizard.step5",
  thank_you: "wizard.step6",
}

const VISIBLE_STEPS: WizardStep[] = ["vehicle", "owner", "config", "offers"]

function WizardContent() {
  const { state, currentStepIndex } = useWizard()

  const stepperSteps: StepperStep[] = VISIBLE_STEPS.map((key, i) => {
    const activeIdx = VISIBLE_STEPS.indexOf(state.current_step)
    const status: StepperStep["status"] =
      activeIdx > i
        ? "completed"
        : activeIdx === i
          ? "active"
          : "inactive"

    return {
      id: key,
      label: t(STEP_KEYS[key] ?? key),
      status,
    }
  })

  const renderStep = () => {
    switch (state.current_step) {
      case "vehicle":
        return <ErrorBoundary key="vehicle"><VehicleStep /></ErrorBoundary>
      case "owner":
        return <ErrorBoundary key="owner"><OwnerStep /></ErrorBoundary>
      case "config":
        return <ErrorBoundary key="config"><ConfigStep /></ErrorBoundary>
      case "offers":
        return <ErrorBoundary key="offers"><OffersStep /></ErrorBoundary>
      case "checkout":
        return <ErrorBoundary key="checkout"><CheckoutStep /></ErrorBoundary>
      case "thank_you":
        return <ErrorBoundary key="thank_you"><ThankYouStep /></ErrorBoundary>
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper */}
      {VISIBLE_STEPS.includes(state.current_step) && (
        <Stepper steps={stepperSteps} className="mb-10" />
      )}

      {/* Progress indicator */}
      {VISIBLE_STEPS.includes(state.current_step) && (
        <p className="text-center text-xs text-neutral-400 mb-8">
          {t("wizard.progress", {
            current: currentStepIndex + 1,
            total: VISIBLE_STEPS.length,
          })}
        </p>
      )}

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.current_step}
          {...animations.slideUpFade}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
