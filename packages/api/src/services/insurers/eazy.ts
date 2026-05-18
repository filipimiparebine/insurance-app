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

export class EazyInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "eazy",
      name: "Eazy Asigurari",
      baseUrl: "https://api.eazyasigurari.ro",
      timeoutMs: 15000,
      maxRetries: 2,
    });
  }

  async doGetQuote(
    db: Db,
    params: GetQuoteParams,
  ): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) {
      throw new InsurerApiError(
        "Missing API credentials",
        this.config.code,
        "getQuote",
      );
    }

    const headers = this.authHeaders(credentials);
    const payload = this.buildQuotePayload(params);

    const resp = await fetch(`${this.config.baseUrl}/v1/rca/quote`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.message ?? "Quote request failed",
        this.config.code,
        "getQuote",
        resp.status,
        body,
      );
    }

    await this.logAudit(db, "get_quote", "getQuote", "Quote requested", {
      vehiclePlate: params.vehicle.plateNumber,
    });

    return this.transformQuoteResponse(body, params);
  }

  async doIssuePolicy(
    db: Db,
    params: IssuePolicyParams,
  ): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) {
      throw new InsurerApiError(
        "Missing API credentials",
        this.config.code,
        "issuePolicy",
      );
    }

    const payload = {
      offerId: params.offerSnapshot.externalOfferCode,
      policyHolder: {
        type: params.owner.type === "company" ? "juridical" : "individual",
        firstName: params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      vehicle: {
        vin: params.vehicle.vin,
        plateNumber: params.vehicle.plateNumber,
      },
      startDate: params.startDate,
      endDate: params.endDate,
      brokerReference: params.policyId,
    };

    const headers = this.authHeaders(credentials);

    const resp = await fetch(`${this.config.baseUrl}/v1/rca/policy`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.message ?? "Policy issuance failed",
        this.config.code,
        "issuePolicy",
        resp.status,
        body,
      );
    }

    await this.logAudit(db, "issue_policy", "issuePolicy", "Policy issued", {
      externalPolicyNumber: body.policyNumber,
    });

    return {
      externalPolicyNumber: body.policyNumber,
      insurerStatus: body.status ?? "active",
      documents: body.documents ?? [],
      rawResponse: body,
    };
  }

  async doCancelPolicy(
    db: Db,
    params: CancelPolicyParams,
  ): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials) {
      throw new InsurerApiError(
        "Missing API credentials",
        this.config.code,
        "cancelPolicy",
      );
    }

    const payload = {
      policyNumber: params.externalPolicyNumber,
      reason: params.reason,
      effectiveDate: params.effectiveDate,
    };

    const headers = this.authHeaders(credentials);

    const resp = await fetch(`${this.config.baseUrl}/v1/rca/policy/cancel`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.message ?? "Policy cancellation failed",
        this.config.code,
        "cancelPolicy",
        resp.status,
        body,
      );
    }

    await this.logAudit(
      db,
      "cancel_policy",
      "cancelPolicy",
      `Cancelled: ${params.reason}`,
      { externalPolicyNumber: params.externalPolicyNumber },
    );

    return {
      cancelled: body.cancelled ?? true,
      refundAmount: body.refundAmount ?? "0",
      currency: body.currency ?? "RON",
      rawResponse: body,
    };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return resp.ok;
  }

  private authHeaders(apiKey: string): Record<string, string> {
    return { Authorization: `Bearer ${apiKey}`, "X-Insurer-Code": "eazy" };
  }

  private buildQuotePayload(params: GetQuoteParams): Record<string, unknown> {
    return {
      vehicle: {
        vin: params.vehicle.vin,
        plateNumber: params.vehicle.plateNumber,
        registrationStatus: params.vehicle.registrationStatus,
        make: params.vehicle.make,
        model: params.vehicle.model,
        category: params.vehicle.vehicleCategory,
        subcategory: params.vehicle.vehicleSubcategory,
        usageType: params.vehicle.usageType,
        fuelType: params.vehicle.fuelType,
        yearOfManufacture: params.vehicle.yearOfManufacture,
        maxMassKg: params.vehicle.maxMassKg,
        engineCapacityCc: params.vehicle.engineCapacityCc,
        enginePowerKw: params.vehicle.enginePowerKw,
        seatsCount: params.vehicle.seatsCount,
      },
      policyHolder: {
        type: params.owner.type === "company" ? "juridical" : "individual",
        firstName: params.owner.type === "company" ? params.owner.firstName : params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      coverage: {
        startDate: params.startDate,
        durationMonths: params.durationMonths,
        bonusMalusClass: params.bonusMalusClass,
        directSettlement: params.directSettlementRequested,
      },
    };
  }

  private transformQuoteResponse(
    body: Record<string, unknown>,
    params: GetQuoteParams,
  ): InsurerQuoteResult {
    const premium = (body.premium as any) ?? {};
    const document = (body.document as any) ?? {};

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(premium.net ?? "0"),
      brokerCommission: String(premium.commission ?? "0"),
      totalAmount: String(premium.total ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalusClass ?? params.bonusMalusClass),
      directSettlementDelta: String(premium.directSettlementDelta ?? "0"),
      excludedCountries: (body.excludedCountries as string[]) ?? [],
      externalOfferCode: String(body.offerId ?? null),
      isAvailable: body.isAvailable !== false,
      unavailableReason: (body.unavailableReason as string) ?? null,
      documentsUrl: (document.url as string) ?? null,
      rawResponse: body,
    };
  }
}

export function registerEazyAdapter(): void {
  const { registerAdapter } = require("./factory");
  registerAdapter("eazy", () => new EazyInsurerAdapter());
}
