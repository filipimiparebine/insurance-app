"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { createStore, useStore } from "zustand"
import type { WizardStep, WizardState, Vehicle, Owner, PolicyConfig, Leasing, Quote } from "@blaj/shared"

const STEP_ORDER: WizardStep[] = [
  "vehicle",
  "owner",
  "config",
  "offers",
  "checkout",
  "thank_you",
]

const initialState: WizardState = {
  current_step: "vehicle",
  payment_completed: false,
}

function computeDerived(state: WizardState) {
  const currentStepIndex = STEP_ORDER.indexOf(state.current_step)
  return {
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === STEP_ORDER.length - 1,
  }
}

export interface WizardStore {
  state: WizardState
  currentStepIndex: number
  isFirstStep: boolean
  isLastStep: boolean
  goNext: () => void
  goPrev: () => void
  goToStep: (step: WizardStep) => void
  setVehicle: (vehicle: Vehicle) => void
  setOwner: (owner: Owner) => void
  setConfig: (config: PolicyConfig, leasing?: Leasing) => void
  setOffers: (offers: Quote[]) => void
  selectOffer: (offerId: string) => void
  setPaymentCompleted: () => void
  reset: () => void
}

function createWizardStore(initialStep: WizardStep = "vehicle") {
  const init = { ...initialState, current_step: initialStep }
  return createStore<WizardStore>((set) => {
    const deriveUpdate = (partial: Partial<WizardState>) => {
      const state = { ...init, ...partial }
      return { state, ...computeDerived(state) }
    }

    return {
      state: init,
      ...computeDerived(init),
      goNext: () =>
        set((s) => {
          const idx = STEP_ORDER.indexOf(s.state.current_step)
          if (idx < STEP_ORDER.length - 1) {
            return deriveUpdate({ current_step: STEP_ORDER[idx + 1] })
          }
          return s
        }),
      goPrev: () =>
        set((s) => {
          const idx = STEP_ORDER.indexOf(s.state.current_step)
          if (idx > 0) {
            return deriveUpdate({ current_step: STEP_ORDER[idx - 1] })
          }
          return s
        }),
      goToStep: (step) =>
        set((s) => deriveUpdate({ ...s.state, current_step: step })),
      setVehicle: (vehicle) =>
        set((s) => deriveUpdate({ ...s.state, vehicle })),
      setOwner: (owner) =>
        set((s) => deriveUpdate({ ...s.state, owner })),
      setConfig: (config, leasing) =>
        set((s) =>
          deriveUpdate({ ...s.state, policy_config: config, leasing }),
        ),
      setOffers: (offers) =>
        set((s) => deriveUpdate({ ...s.state, offers })),
      selectOffer: (offerId) =>
        set((s) => deriveUpdate({ ...s.state, selected_offer_id: offerId })),
      setPaymentCompleted: () =>
        set((s) => deriveUpdate({ ...s.state, payment_completed: true })),
      reset: () => deriveUpdate({ ...initialState, current_step: "vehicle" }),
    }
  })
}

type WizardStoreInstance = ReturnType<typeof createWizardStore>

const WizardStoreContext = createContext<WizardStoreInstance | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createWizardStore())
  return (
    <WizardStoreContext.Provider value={store}>
      {children}
    </WizardStoreContext.Provider>
  )
}

export function useWizard(): WizardStore {
  const store = useContext(WizardStoreContext)
  if (!store) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return useStore(store)
}

export { STEP_ORDER }
