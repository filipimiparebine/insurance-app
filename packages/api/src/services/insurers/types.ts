import type { Db } from "@blaj/db";

export interface VehicleData {
  registrationStatus: string;
  plateNumber: string | null;
  vin: string;
  make: string;
  model: string;
  vehicleCategory: string;
  vehicleSubcategory: string;
  usageType: string;
  fuelType: string;
  yearOfManufacture: number;
  maxMassKg: number;
  engineCapacityCc: number;
  enginePowerKw: string;
  seatsCount: number;
  civSeries: string | null;
  firstRegistrationDate: string;
  mileage: number | null;
  itpExpiresAt: string | null;
}

export interface IndividualOwnerData {
  type: "individual";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseYear: number | null;
  addressCounty: string;
  addressCity: string;
  addressStreet: string;
  addressNumber: string;
  addressBlock: string | null;
  addressApartment: string | null;
  addressPostalCode: string;
}

export interface CompanyOwnerData {
  type: "company";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companyType: string;
  registrationNumber: string;
  caenCode: string;
  addressCounty: string;
  addressCity: string;
  addressStreet: string;
  addressNumber: string;
  addressPostalCode: string;
}

export type OwnerData = IndividualOwnerData | CompanyOwnerData;

export interface GetQuoteParams {
  vehicle: VehicleData;
  owner: OwnerData;
  insurerCode: string;
  startDate: string;
  durationMonths: number;
  directSettlementRequested: boolean;
  bonusMalusClass: string;
}

export interface InsurerQuoteResult {
  insurerCode: string;
  durationMonths: number;
  premiumNet: string;
  brokerCommission: string;
  totalAmount: string;
  currency: string;
  bonusMalusClass: string;
  directSettlementDelta: string;
  excludedCountries: string[];
  externalOfferCode: string | null;
  isAvailable: boolean;
  unavailableReason: string | null;
  documentsUrl: string | null;
  rawResponse: Record<string, unknown>;
}

export interface IssuePolicyParams {
  policyId: string;
  offerSnapshot: {
    insurerCode: string;
    externalOfferCode: string | null;
    durationMonths: number;
    premiumNet: string;
    brokerCommission: string;
    totalAmount: string;
    currency: string;
  };
  vehicle: VehicleData;
  owner: OwnerData;
  startDate: string;
  endDate: string;
}

export interface IssuePolicyResult {
  externalPolicyNumber: string;
  insurerStatus: string;
  documents: Array<{ name: string; url: string }>;
  rawResponse: Record<string, unknown>;
}

export interface CancelPolicyParams {
  externalPolicyNumber: string;
  reason: string;
  effectiveDate: string;
}

export interface CancelPolicyResult {
  cancelled: boolean;
  refundAmount: string;
  currency: string;
  rawResponse: Record<string, unknown>;
}

export class InsurerApiError extends Error {
  constructor(
    message: string,
    public readonly insurerCode: string,
    public readonly endpoint: string,
    public readonly statusCode?: number,
    public readonly responseBody?: unknown,
  ) {
    super(`[${insurerCode}] ${message} (${endpoint}${statusCode ? ` HTTP ${statusCode}` : ""})`);
    this.name = "InsurerApiError";
  }
}

export class InsurerTimeoutError extends InsurerApiError {
  constructor(
    insurerCode: string,
    endpoint: string,
    public readonly timeoutMs: number,
  ) {
    super(`Request timed out after ${timeoutMs}ms`, insurerCode, endpoint);
    this.name = "InsurerTimeoutError";
  }
}

export class InsurerUnavailableError extends InsurerApiError {
  constructor(insurerCode: string) {
    super("Insurer API is currently unavailable", insurerCode, "health_check");
    this.name = "InsurerUnavailableError";
  }
}

export interface InsurerAdapterConfig {
  code: string;
  name: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
}

export interface InsurerAdapter {
  readonly config: InsurerAdapterConfig;

  getQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult>;

  issuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult>;

  cancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult>;

  healthCheck(): Promise<boolean>;
}
