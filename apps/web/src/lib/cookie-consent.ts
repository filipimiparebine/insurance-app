"use client";

export const CONSENT_VERSION = 1;

export const CONSENT_CATEGORIES = [
  "necessary",
  "functional",
  "analytics",
  "marketing",
] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type ConsentState = {
  version: number;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const STORAGE_KEY = "blaj_cookie_consent";

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as ConsentState;
    if (!parsed || typeof parsed.timestamp !== "number") return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsent(): boolean {
  return getStoredConsent() !== null;
}

export function getConsent(): ConsentState | null {
  return getStoredConsent();
}

export function isCategoryAccepted(category: ConsentCategory): boolean {
  const consent = getStoredConsent();
  if (!consent) return category === "necessary";
  return consent[category] === true;
}

export function acceptAll(): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    timestamp: Date.now(),
  };
  persistConsent(state);
  logConsentToServer(state);
  return state;
}

export function acceptNecessary(): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  };
  persistConsent(state);
  logConsentToServer(state);
  return state;
}

export function acceptCustom(
  categories: Partial<Record<ConsentCategory, boolean>>
): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    functional: categories.functional ?? false,
    analytics: categories.analytics ?? false,
    marketing: categories.marketing ?? false,
    timestamp: Date.now(),
  };
  persistConsent(state);
  logConsentToServer(state);
  return state;
}

export function revokeAll(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be blocked
  }
}

function persistConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be blocked
  }
}

async function logConsentToServer(state: ConsentState) {
  try {
    const categories: ConsentCategory[] = [];
    for (const cat of CONSENT_CATEGORIES) {
      if (state[cat]) categories.push(cat);
    }
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categories,
        version: state.version,
        timestamp: state.timestamp,
      }),
    });
  } catch {
    // fire-and-forget logging
  }
}
