import type { InsurerAdapter } from "./types";

const adapterRegistry = new Map<string, () => InsurerAdapter>();
const instances = new Map<string, InsurerAdapter>();

export function registerAdapter(
  insurerCode: string,
  factory: () => InsurerAdapter,
): void {
  adapterRegistry.set(insurerCode, factory);
}

export function getAdapter(insurerCode: string): InsurerAdapter {
  const cached = instances.get(insurerCode);
  if (cached) return cached;

  const factory = adapterRegistry.get(insurerCode);
  if (!factory) {
    throw new Error(
      `No adapter registered for insurer "${insurerCode}". Add the adapter and register it via registerAdapter().`,
    );
  }

  const instance = factory();
  instances.set(insurerCode, instance);
  return instance;
}

export function getRegisteredCodes(): string[] {
  return Array.from(adapterRegistry.keys());
}

export function hasAdapter(insurerCode: string): boolean {
  return adapterRegistry.has(insurerCode);
}

export function clearAdapters(): void {
  instances.clear();
  adapterRegistry.clear();
}
