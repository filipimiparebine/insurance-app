import type { Db } from "@blaj/db";
import { BaseInsurerAdapter } from "./base";
import {
  InsurerApiError,
  type GetQuoteParams,
  type InsurerQuoteResult,
  type IssuePolicyParams,
  type IssuePolicyResult,
  type CancelPolicyParams,
  type CancelPolicyResult,
} from "./types";

// --- Groupama ---
export class GroupamaInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "groupama",
      name: "Groupama Asigurari",
      baseUrl: "https://api.groupama.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicle: {
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        registrationStatus: params.vehicle.registrationStatus,
        make: params.vehicle.make,
        model: params.vehicle.model,
        year: params.vehicle.yearOfManufacture,
        cc: params.vehicle.engineCapacityCc,
        powerKw: params.vehicle.enginePowerKw,
        maxMass: params.vehicle.maxMassKg,
        seats: params.vehicle.seatsCount,
        fuel: params.vehicle.fuelType,
        usage: params.vehicle.usageType,
        category: params.vehicle.vehicleCategory,
      },
      insured: {
        type: params.owner.type === "company" ? "legal" : "physical",
        firstName: params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      startDate: params.startDate,
      durationMonths: params.durationMonths,
      bonusMalusClass: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };

    const resp = await fetch(`${this.config.baseUrl}/api/v2/rca/calculate`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(body.detail ?? "Quote failed", this.config.code, "getQuote", resp.status, body);
    }

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.premium?.net ?? "0"),
      brokerCommission: String(body.premium?.commission ?? "0"),
      totalAmount: String(body.premium?.total ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.premium?.decontareDirectaDelta ?? "0"),
      excludedCountries: body.excludedCountries ?? [],
      externalOfferCode: String(body.offerId ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.rejectionMessage ?? null,
      documentsUrl: body.ipidUrl ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const payload = {
      offerId: params.offerSnapshot.externalOfferCode,
      insured: { type: params.owner.type === "company" ? "legal" : "physical", name: `${params.owner.firstName} ${params.owner.lastName}`, email: params.owner.email, phone: params.owner.phone },
      vin: params.vehicle.vin,
      plate: params.vehicle.plateNumber,
      startDate: params.startDate,
      endDate: params.endDate,
      brokerRef: params.policyId,
    };

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/v2/rca/issue`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.detail ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return {
      externalPolicyNumber: body.policyNumber,
      insurerStatus: body.status ?? "active",
      documents: body.documents ?? [],
      rawResponse: body,
    };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/v2/rca/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.detail ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/api/v2/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

// --- Omniasig ---
export class OmniasigInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "omniasig",
      name: "Omniasig Vienna Insurance Group",
      baseUrl: "https://api.omniasig.ro",
      timeoutMs: 25000,
      maxRetries: 1,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicleVin: params.vehicle.vin,
      plateNumber: params.vehicle.plateNumber,
      registration: params.vehicle.registrationStatus,
      make: params.vehicle.make,
      model: params.vehicle.model,
      year: params.vehicle.yearOfManufacture,
      cc: params.vehicle.engineCapacityCc,
      kw: params.vehicle.enginePowerKw,
      mass: params.vehicle.maxMassKg,
      seats: params.vehicle.seatsCount,
      fuel: params.vehicle.fuelType,
      category: params.vehicle.vehicleCategory,
      usage: params.vehicle.usageType,
      insuredType: params.owner.type === "company" ? "PJ" : "PF",
      insuredName: `${params.owner.firstName} ${params.owner.lastName}`,
      insuredEmail: params.owner.email,
      insuredPhone: params.owner.phone,
      startDate: params.startDate,
      months: params.durationMonths,
      bonusMalus: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { "x-api-key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v3/quote`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Quote failed", this.config.code, "getQuote", resp.status, body);

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.premiumNet ?? "0"),
      brokerCommission: String(body.commission ?? "0"),
      totalAmount: String(body.total ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.decontareDirectaDelta ?? "0"),
      excludedCountries: body.excludedCountries ?? [],
      externalOfferCode: String(body.quoteId ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.error ?? null,
      documentsUrl: body.legalDocumentUrl ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const headers = { "x-api-key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v3/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        quoteId: params.offerSnapshot.externalOfferCode,
        insuredName: `${params.owner.firstName} ${params.owner.lastName}`,
        insuredEmail: params.owner.email,
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        brokerRef: params.policyId,
      }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return { externalPolicyNumber: body.policyNumber, insurerStatus: body.status ?? "active", documents: body.documents ?? [], rawResponse: body };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { "x-api-key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v3/policy/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

// --- Allianz ---
export class AllianzInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "allianz",
      name: "Allianz-Tiriac Asigurari",
      baseUrl: "https://api.allianztiriac.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicle: {
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        regStatus: params.vehicle.registrationStatus,
        make: params.vehicle.make,
        model: params.vehicle.model,
        year: params.vehicle.yearOfManufacture,
        engineSize: params.vehicle.engineCapacityCc,
        powerKw: params.vehicle.enginePowerKw,
        maxWeight: params.vehicle.maxMassKg,
        seats: params.vehicle.seatsCount,
        fuel: params.vehicle.fuelType,
        usage: params.vehicle.usageType,
      },
      client: {
        type: params.owner.type === "company" ? "J" : "F",
        firstName: params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      startDate: params.startDate,
      durationMonths: params.durationMonths,
      bonusMalusClass: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/rca/quotations`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Quote failed", this.config.code, "getQuote", resp.status, body);

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.quotation?.netPremium ?? "0"),
      brokerCommission: String(body.quotation?.commission ?? "0"),
      totalAmount: String(body.quotation?.total ?? "0"),
      currency: String(body.quotation?.currency ?? "RON"),
      bonusMalusClass: String(body.quotation?.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.quotation?.decontareDirecta ?? "0"),
      excludedCountries: body.quotation?.exclusions ?? [],
      externalOfferCode: String(body.quotation?.reference ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.message ?? null,
      documentsUrl: body.quotation?.documents?.[0]?.url ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/rca/policies`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        quotationRef: params.offerSnapshot.externalOfferCode,
        client: { firstName: params.owner.firstName, lastName: params.owner.lastName, email: params.owner.email, phone: params.owner.phone },
        vehicleVin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        brokerRef: params.policyId,
      }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return { externalPolicyNumber: body.policy?.policyNumber, insurerStatus: body.policy?.status ?? "active", documents: body.policy?.documents ?? [], rawResponse: body };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { Authorization: `Bearer ${credentials}`, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/rca/policies/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

// --- Grawe ---
export class GraweInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "grawe",
      name: "Grawe Romania",
      baseUrl: "https://api.grawe.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vin: params.vehicle.vin,
      plate: params.vehicle.plateNumber,
      status: params.vehicle.registrationStatus,
      make: params.vehicle.make,
      model: params.vehicle.model,
      year: params.vehicle.yearOfManufacture,
      cc: params.vehicle.engineCapacityCc,
      kw: params.vehicle.enginePowerKw,
      mass: params.vehicle.maxMassKg,
      seats: params.vehicle.seatsCount,
      fuel: params.vehicle.fuelType,
      usage: params.vehicle.usageType,
      clientType: params.owner.type === "company" ? "PJ" : "PF",
      clientName: `${params.owner.firstName} ${params.owner.lastName}`,
      clientEmail: params.owner.email,
      clientPhone: params.owner.phone,
      startDate: params.startDate,
      duration: params.durationMonths,
      bonusMalus: params.bonusMalusClass,
      decontareDirecta: params.directSettlementRequested,
    };

    const headers = { "X-Auth-Token": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/rca/quote`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Quote failed", this.config.code, "getQuote", resp.status, body);

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.premiumNet ?? "0"),
      brokerCommission: String(body.commission ?? "0"),
      totalAmount: String(body.total ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.ddsDelta ?? "0"),
      excludedCountries: body.exclusions ?? [],
      externalOfferCode: String(body.ref ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.message ?? null,
      documentsUrl: body.ipid ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const headers = { "X-Auth-Token": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/rca/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        quoteRef: params.offerSnapshot.externalOfferCode,
        clientName: `${params.owner.firstName} ${params.owner.lastName}`,
        clientEmail: params.owner.email,
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        brokerRef: params.policyId,
      }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return { externalPolicyNumber: body.policyNumber, insurerStatus: body.status ?? "active", documents: body.documents ?? [], rawResponse: body };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { "X-Auth-Token": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/rca/policy/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

// --- Uniqa ---
export class UniqaInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "uniqa",
      name: "Uniqa Asigurari",
      baseUrl: "https://api.uniqa.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicleVin: params.vehicle.vin,
      plate: params.vehicle.plateNumber,
      regStatus: params.vehicle.registrationStatus,
      make: params.vehicle.make,
      model: params.vehicle.model,
      year: params.vehicle.yearOfManufacture,
      capacityCc: params.vehicle.engineCapacityCc,
      powerKw: params.vehicle.enginePowerKw,
      maxMass: params.vehicle.maxMassKg,
      seats: params.vehicle.seatsCount,
      fuel: params.vehicle.fuelType,
      usage: params.vehicle.usageType,
      clientType: params.owner.type === "company" ? "PJ" : "PF",
      clientFirstName: params.owner.firstName,
      clientLastName: params.owner.lastName,
      clientEmail: params.owner.email,
      clientPhone: params.owner.phone,
      startDate: params.startDate,
      durationMonths: params.durationMonths,
      bonusMalusClass: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { apikey: credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/quote`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Quote failed", this.config.code, "getQuote", resp.status, body);

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.netPremium ?? "0"),
      brokerCommission: String(body.commission ?? "0"),
      totalAmount: String(body.grossPremium ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.directSettlementSurcharge ?? "0"),
      excludedCountries: body.exclusions ?? [],
      externalOfferCode: String(body.offerId ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.declineReason ?? null,
      documentsUrl: body.ipid ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const headers = { apikey: credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        offerId: params.offerSnapshot.externalOfferCode,
        clientFirstName: params.owner.firstName,
        clientLastName: params.owner.lastName,
        clientEmail: params.owner.email,
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        brokerRef: params.policyId,
      }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return { externalPolicyNumber: body.policyNumber, insurerStatus: body.status ?? "active", documents: body.documents ?? [], rawResponse: body };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { apikey: credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/api/policy/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.message ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

// --- City Insurance ---
export class CityInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "city",
      name: "City Insurance",
      baseUrl: "https://api.cityinsurance.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicle: { vin: params.vehicle.vin, plate: params.vehicle.plateNumber, regStatus: params.vehicle.registrationStatus, make: params.vehicle.make, model: params.vehicle.model, year: params.vehicle.yearOfManufacture, cc: params.vehicle.engineCapacityCc, kw: params.vehicle.enginePowerKw, mass: params.vehicle.maxMassKg, seats: params.vehicle.seatsCount, fuel: params.vehicle.fuelType, usage: params.vehicle.usageType },
      client: { type: params.owner.type === "company" ? "legal" : "natural", firstName: params.owner.firstName, lastName: params.owner.lastName, email: params.owner.email, phone: params.owner.phone },
      startDate: params.startDate,
      duration: params.durationMonths,
      bonusMalus: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { "X-Api-Key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v2/quote`, { method: "POST", headers, body: JSON.stringify(payload) });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Quote failed", this.config.code, "getQuote", resp.status, body);

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.premiumNet ?? "0"),
      brokerCommission: String(body.commission ?? "0"),
      totalAmount: String(body.premiumTotal ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.dds ?? "0"),
      excludedCountries: body.exclusions ?? [],
      externalOfferCode: String(body.reference ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.message ?? null,
      documentsUrl: body.ipidUrl ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const headers = { "X-Api-Key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v2/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        quoteRef: params.offerSnapshot.externalOfferCode,
        clientName: `${params.owner.firstName} ${params.owner.lastName}`,
        clientEmail: params.owner.email,
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        startDate: params.startDate,
        endDate: params.endDate,
        brokerRef: params.policyId,
      }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Issuance failed", this.config.code, "issuePolicy", resp.status, body);

    return { externalPolicyNumber: body.policyNumber, insurerStatus: body.status ?? "active", documents: body.documents ?? [], rawResponse: body };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { "X-Api-Key": credentials, "Content-Type": "application/json" };
    const resp = await fetch(`${this.config.baseUrl}/v2/policy/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });
    const body = await resp.json() as any;

    if (!resp.ok) throw new InsurerApiError(body.error ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);

    return { cancelled: body.cancelled ?? true, refundAmount: String(body.refundAmount ?? "0"), currency: String(body.currency ?? "RON"), rawResponse: body };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}
