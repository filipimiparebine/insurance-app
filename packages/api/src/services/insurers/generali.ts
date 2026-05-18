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

export class GeneraliInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "generali",
      name: "Generali Romania",
      baseUrl: "https://api.generali.ro",
      timeoutMs: 25000,
      maxRetries: 1,
    });
  }

  async doGetQuote(db: Db, params: GetQuoteParams): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      requestType: "RCA_QUOTE",
      requestId: crypto.randomUUID(),
      vehicle: {
        vin: params.vehicle.vin,
        plate: params.vehicle.plateNumber,
        regStatus: params.vehicle.registrationStatus,
        make: params.vehicle.make,
        model: params.vehicle.model,
        year: params.vehicle.yearOfManufacture,
        cc: params.vehicle.engineCapacityCc,
        kw: params.vehicle.enginePowerKw,
        mass: params.vehicle.maxMassKg,
        seats: params.vehicle.seatsCount,
        fuel: params.vehicle.fuelType,
        usage: params.vehicle.usageType,
      },
      insured: {
        type: params.owner.type === "company" ? "COMPANY" : "INDIVIDUAL",
        name: `${params.owner.firstName} ${params.owner.lastName}`,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      coverage: {
        startDate: params.startDate,
        durationMonths: params.durationMonths,
        bonusMalus: params.bonusMalusClass,
        hasDirectSettlement: params.directSettlementRequested,
      },
    };

    const headers = {
      "X-API-Key": credentials,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const resp = await fetch(`${this.config.baseUrl}/portal/api/quote`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(body.message ?? body.errorDescription ?? "Quote failed", this.config.code, "getQuote", resp.status, body);
    }

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.data?.premiumNet ?? "0"),
      brokerCommission: String(body.data?.commission ?? "0"),
      totalAmount: String(body.data?.total ?? "0"),
      currency: String(body.data?.currency ?? "RON"),
      bonusMalusClass: String(body.data?.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.data?.directSettlementDelta ?? "0"),
      excludedCountries: body.data?.excludedCountries ?? [],
      externalOfferCode: String(body.data?.offerId ?? null),
      isAvailable: body.data?.available !== false,
      unavailableReason: body.data?.reason ?? null,
      documentsUrl: body.data?.ipid ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(db: Db, params: IssuePolicyParams): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const payload = {
      requestType: "RCA_ISSUE",
      requestId: crypto.randomUUID(),
      offerId: params.offerSnapshot.externalOfferCode,
      insured: {
        type: params.owner.type === "company" ? "COMPANY" : "INDIVIDUAL",
        firstName: params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      vehicleVin: params.vehicle.vin,
      startDate: params.startDate,
      endDate: params.endDate,
      brokerRef: params.policyId,
    };

    const headers = { "X-API-Key": credentials, "Content-Type": "application/json", Accept: "application/json" };

    const resp = await fetch(`${this.config.baseUrl}/portal/api/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(body.message ?? "Policy issuance failed", this.config.code, "issuePolicy", resp.status, body);
    }

    return {
      externalPolicyNumber: body.data?.policyNumber,
      insurerStatus: body.data?.status ?? "active",
      documents: body.data?.documents ?? [],
      rawResponse: body,
    };
  }

  async doCancelPolicy(db: Db, params: CancelPolicyParams): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { "X-API-Key": credentials, "Content-Type": "application/json" };

    const resp = await fetch(`${this.config.baseUrl}/portal/api/policy/${params.externalPolicyNumber}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(body.message ?? "Cancellation failed", this.config.code, "cancelPolicy", resp.status, body);
    }

    return {
      cancelled: body.data?.cancelled ?? true,
      refundAmount: String(body.data?.refundAmount ?? "0"),
      currency: String(body.data?.currency ?? "RON"),
      rawResponse: body,
    };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/portal/api/health`, { signal: AbortSignal.timeout(5000) });
    return resp.ok;
  }
}

export function registerGeneraliAdapter(): void {
  const { registerAdapter } = require("./factory");
  registerAdapter("generali", () => new GeneraliInsurerAdapter());
}
