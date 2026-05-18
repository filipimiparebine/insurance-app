import { useSyncExternalStore, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'blaj_quote_form';

// ── Wizard Step Tracking ──────────────────────────────────────────────
// Mirrors the web wizard state machine in packages/ui/src/components/wizard-context.tsx

export type WizardStep =
  | 'landing'
  | 'vehicle'
  | 'owner'
  | 'config'
  | 'offers'
  | 'checkout'
  | 'thank_you';

export const STEP_ORDER: WizardStep[] = [
  'vehicle',
  'owner',
  'config',
  'offers',
  'checkout',
  'thank_you',
];

/** Maps WizardStep to Expo Router paths */
export const STEP_ROUTES: Partial<Record<WizardStep, string>> = {
  vehicle: '/quote/step-1',
  owner: '/quote/step-2',
  config: '/quote/step-3',
  offers: '/quote/step-4',
  checkout: '/quote/payment',
};

/** Visible stepper steps (checkout and thank_you are hidden from the progress bar) */
const VISIBLE_STEPS: WizardStep[] = ['vehicle', 'owner', 'config', 'offers'];

function getStepperIndex(step: WizardStep): number {
  const idx = VISIBLE_STEPS.indexOf(step);
  return idx >= 0 ? idx + 1 : 4;
}

export interface QuoteFormData {
  // Step 1 — Vehicle
  registrationStatus: 'registered' | 'pending_registration' | 'mayor_registered';
  registrationSubtype?: 'second_hand_ro' | 'foreign' | 'new_dealer_ro';
  plateNumber: string;
  vin: string;
  make: string;
  model: string;
  vehicleCategory: string;
  vehicleSubcategory: string;
  usageType: string;
  fuelType: string;
  yearOfManufacture: string;
  firstRegistrationDate: string;
  maxMass: string;
  engineCapacity: string;
  enginePower: string;
  seatsCount: string;
  civSeries: string;
  itpExpiresAt: string;
  mileage: string;
  travelsNonEU: boolean;

  // Step 2 — Owner
  personType: 'individual' | 'company';
  firstName: string;
  lastName: string;
  cnp: string;
  email: string;
  phone: string;
  idDocType: 'ci' | 'bi' | 'passport';
  idDocSeries: string;
  idDocNumber: string;
  idDocExpiresAt: string;
  addressCounty: string;
  addressCity: string;
  addressStreet: string;
  addressNumber: string;
  addressPostalCode: string;

  // Company owner fields
  companyCui: string;
  companyName: string;
  companyCaen: string;
  companyRegNumber: string;
  companyEntityType: string;
  companyEmail: string;
  companyPhone: string;
  repFirstName: string;
  repLastName: string;
  repCapacity: string;
  companyAddressCounty: string;
  companyAddressCity: string;
  companyAddressStreet: string;
  companyAddressNumber: string;
  companyAddressPostalCode: string;

  // Step 3 — Configuration
  startDate: string;
  durationMonthsSecondary: string;
  directSettlementRequested: boolean;
  licenseYear: string;
  hasNoLicense: boolean;
  driverIsOwner: boolean;
  drivers: DriverData[];
  isLeasing: boolean;
  leasingCompany: string;

  // Wizard state machine (cross-step)
  currentStep: WizardStep;
}

export interface DriverData {
  firstName: string;
  lastName: string;
  cnp: string;
  licenseYear: string;
}

export const emptyQuoteForm: QuoteFormData = {
  registrationStatus: 'registered',
  plateNumber: '',
  vin: '',
  make: '',
  model: '',
  vehicleCategory: '',
  vehicleSubcategory: '',
  usageType: 'personal',
  fuelType: '',
  yearOfManufacture: '',
  firstRegistrationDate: '',
  maxMass: '',
  engineCapacity: '',
  enginePower: '',
  seatsCount: '',
  civSeries: '',
  itpExpiresAt: '',
  mileage: '',
  travelsNonEU: false,
  personType: 'individual',
  firstName: '',
  lastName: '',
  cnp: '',
  email: '',
  phone: '',
  idDocType: 'ci',
  idDocSeries: '',
  idDocNumber: '',
  idDocExpiresAt: '',
  addressCounty: '',
  addressCity: '',
  addressStreet: '',
  addressNumber: '',
  addressPostalCode: '',
  companyCui: '',
  companyName: '',
  companyCaen: '',
  companyRegNumber: '',
  companyEntityType: '',
  companyEmail: '',
  companyPhone: '',
  repFirstName: '',
  repLastName: '',
  repCapacity: '',
  companyAddressCounty: '',
  companyAddressCity: '',
  companyAddressStreet: '',
  companyAddressNumber: '',
  companyAddressPostalCode: '',
  startDate: new Date().toISOString().split('T')[0],
  durationMonthsSecondary: '6',
  directSettlementRequested: false,
  licenseYear: '',
  hasNoLicense: false,
  driverIsOwner: true,
  drivers: [],
  isLeasing: false,
  leasingCompany: '',
  currentStep: 'vehicle',
};

type Listener = () => void;

let quoteFormData: QuoteFormData = { ...emptyQuoteForm };
const listeners = new Set<Listener>();
let hydrationPromise: Promise<QuoteFormData> | null = null;

function notify() {
  listeners.forEach((l) => l());
}

async function hydrate(): Promise<QuoteFormData> {
  try {
    const stored = await SecureStore.getItemAsync(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as QuoteFormData;
      quoteFormData = { ...emptyQuoteForm, ...parsed };
      notify();
    }
  } catch {
    // Silent fallback — use defaults
  }
  return quoteFormData;
}

function persist(): void {
  SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(quoteFormData)).catch(() => {});
}

/** Initialize store from SecureStore (call once at app launch) */
export function initQuoteForm(): Promise<QuoteFormData> {
  if (!hydrationPromise) {
    hydrationPromise = hydrate();
  }
  return hydrationPromise;
}

export function subscribeToQuoteForm(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getQuoteFormData(): QuoteFormData {
  return quoteFormData;
}

export function updateQuoteFormData(updates: Partial<QuoteFormData>): QuoteFormData {
  quoteFormData = { ...quoteFormData, ...updates };
  persist();
  notify();
  return quoteFormData;
}

export function resetQuoteFormData(): void {
  quoteFormData = { ...emptyQuoteForm };
  persist();
  notify();
}

// ── Step Navigation ───────────────────────────────────────────────────

export function getCurrentStep(): WizardStep {
  return quoteFormData.currentStep;
}

export function setCurrentStep(step: WizardStep): void {
  quoteFormData = { ...quoteFormData, currentStep: step };
  persist();
  notify();
}

export function goNext(): WizardStep | null {
  const idx = STEP_ORDER.indexOf(quoteFormData.currentStep);
  if (idx < STEP_ORDER.length - 1) {
    const next = STEP_ORDER[idx + 1];
    setCurrentStep(next);
    return next;
  }
  return null;
}

export function goPrev(): WizardStep | null {
  const idx = STEP_ORDER.indexOf(quoteFormData.currentStep);
  if (idx > 0) {
    const prev = STEP_ORDER[idx - 1];
    setCurrentStep(prev);
    return prev;
  }
  return null;
}

export function goToStep(step: WizardStep): void {
  setCurrentStep(step);
}

function computeStepDerived(step: WizardStep) {
  const currentStepIndex = STEP_ORDER.indexOf(step);
  return {
    currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === STEP_ORDER.length - 1,
  };
}

/** React hook — reactive quote form state */
export function useQuoteForm() {
  const snapshot = useSyncExternalStore(subscribeToQuoteForm, getQuoteFormData);
  const update = useCallback((updates: Partial<QuoteFormData>) => updateQuoteFormData(updates), []);
  const reset = useCallback(() => resetQuoteFormData(), []);
  return {
    form: snapshot,
    update,
    reset,
    currentStep: snapshot.currentStep,
    stepperCurrent: getStepperIndex(snapshot.currentStep),
    ...computeStepDerived(snapshot.currentStep),
  };
}
