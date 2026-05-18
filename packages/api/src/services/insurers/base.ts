import type { Db } from "@blaj/db";
import { auditLog, insurers } from "@blaj/db/schema";
import { eq } from "drizzle-orm";
import { getTier1 } from "@blaj/encryption";
import { fetchCredentialBlob } from "../../lib/credential-storage";
import {
  InsurerApiError,
  InsurerTimeoutError,
  InsurerUnavailableError,
  type InsurerAdapter,
  type InsurerAdapterConfig,
  type GetQuoteParams,
  type InsurerQuoteResult,
  type IssuePolicyParams,
  type IssuePolicyResult,
  type CancelPolicyParams,
  type CancelPolicyResult,
} from "./types";

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_RETRIES = 2;

export abstract class BaseInsurerAdapter implements InsurerAdapter {
  constructor(public readonly config: InsurerAdapterConfig) {}

  abstract doGetQuote(
    db: Db,
    params: GetQuoteParams,
  ): Promise<InsurerQuoteResult>;

  abstract doIssuePolicy(
    db: Db,
    params: IssuePolicyParams,
  ): Promise<IssuePolicyResult>;

  abstract doCancelPolicy(
    db: Db,
    params: CancelPolicyParams,
  ): Promise<CancelPolicyResult>;

  abstract doHealthCheck(): Promise<boolean>;

  async getQuote(
    db: Db,
    params: GetQuoteParams,
  ): Promise<InsurerQuoteResult> {
    return this.withRetry("getQuote", () => this.doGetQuote(db, params));
  }

  async issuePolicy(
    db: Db,
    params: IssuePolicyParams,
  ): Promise<IssuePolicyResult> {
    return this.withRetry("issuePolicy", () => this.doIssuePolicy(db, params));
  }

  async cancelPolicy(
    db: Db,
    params: CancelPolicyParams,
  ): Promise<CancelPolicyResult> {
    return this.withRetry("cancelPolicy", () =>
      this.doCancelPolicy(db, params),
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      return await this.doHealthCheck();
    } catch {
      return false;
    }
  }

  protected async withRetry<T>(
    operation: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const maxRetries = this.config.maxRetries ?? DEFAULT_MAX_RETRIES;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.withTimeout(fn);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (err instanceof InsurerApiError && err.statusCode === 404) {
          throw err;
        }

        if (attempt < maxRetries) {
          const backoffMs = Math.min(2 ** attempt * 1000, 10000);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw lastError ?? new Error(`Retry exhausted for ${operation}`);
  }

  protected async withTimeout<T>(fn: () => Promise<T>): Promise<T> {
    const timeoutMs = this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(
          new InsurerTimeoutError(this.config.code, "api_call", timeoutMs),
        );
      }, timeoutMs);
    });

    return Promise.race([fn(), timeout]);
  }

  protected async loadCredentials(db: Db): Promise<string | null> {
    const [insurer] = await db
      .select({ apiCredentialsSecretId: insurers.apiCredentialsSecretId })
      .from(insurers)
      .where(eq(insurers.code, this.config.code))
      .limit(1);

    if (!insurer?.apiCredentialsSecretId) {
      return null;
    }

    const encrypted = await fetchCredentialBlob(insurer.apiCredentialsSecretId);
    if (!encrypted) {
      return null;
    }

    const tier1 = getTier1();
    const plaintext = await tier1.decrypt(encrypted);
    return plaintext.toString("utf-8");
  }

  protected async logAudit(
    db: Db,
    action: string,
    fieldName: string,
    reason: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await db.insert(auditLog).values({
        userId: "",
        actorId: "",
        action,
        fieldName: `${this.config.code}:${fieldName}`,
        recordId: metadata ? JSON.stringify(metadata) : "",
        reason,
        ipAddress: "",
        userAgent: "",
      });
    } catch {
      // audit failure is non-blocking
    }
  }
}
