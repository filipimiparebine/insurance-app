import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCheckRateLimit = vi.fn();
const mockParseWindow = vi.fn((window: string) => {
  if (window.endsWith(" s")) return parseInt(window) * 1000;
  if (window.endsWith(" m")) return parseInt(window) * 60 * 1000;
  return 60_000;
});

vi.mock("@blaj/security/ratelimit", () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
  rateLimitHeaders: vi.fn((result: Record<string, unknown>) => ({
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
    "Retry-After": result.success ? "0" : "30",
  })),
  parseWindow: (w: string) => mockParseWindow(w),
}));

import {
  enforceEndpointRateLimit,
  DEFAULT_ENDPOINT_LIMITS,
} from "./ratelimit";

describe("enforceEndpointRateLimit", () => {
  const client = {
    id: "client-test",
    rateLimitPerMin: null,
    rateLimitConfig: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves when rate limit is not exceeded", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    await expect(
      enforceEndpointRateLimit("policies:get", client),
    ).resolves.toBeUndefined();
  });

  it("throws 429 when rate limit is exceeded", async () => {
    const now = Date.now();
    mockCheckRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 60,
      remaining: 0,
      reset: Math.floor((now + 30_000) / 1000),
    });

    await expect(
      enforceEndpointRateLimit("policies:get", client),
    ).rejects.toMatchObject({
      message: "Rate limit exceeded for policies:get",
    });
  });

  it("uses endpoint-specific limit from DEFAULT_ENDPOINT_LIMITS", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 30,
      remaining: 29,
      reset: Date.now() + 60_000,
    });

    await enforceEndpointRateLimit("quotes:create", client);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      "client:client-test:quotes:create",
      30,
      "60 s",
    );
  });

  it("uses client-specific rate limit config over defaults", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 200,
      remaining: 199,
      reset: Date.now() + 60_000,
    });

    const clientWithConfig = {
      id: "client-config",
      rateLimitPerMin: null,
      rateLimitConfig: {
        "quotes:create": { requests: 200, window: "30 s" as const },
      },
    };

    await enforceEndpointRateLimit("quotes:create", clientWithConfig);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      "client:client-config:quotes:create",
      200,
      "30 s",
    );
  });

  it("falls back to global default for unknown endpoints", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    await enforceEndpointRateLimit("unknown:endpoint", client);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      "client:client-test:unknown:endpoint",
      60,
      "60 s",
    );
  });

  it("throws with endpoint in error message", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Math.floor((Date.now() + 30_000) / 1000),
    });

    try {
      await enforceEndpointRateLimit("policies:create", client);
      throw new Error("Should have thrown");
    } catch (err: unknown) {
      expect((err as Record<string, unknown>).message).toBe(
        "Rate limit exceeded for policies:create",
      );
    }
  });

  it("includes rate limit details in thrown error", async () => {
    const reset = Math.floor((Date.now() + 45_000) / 1000);
    mockCheckRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 60,
      remaining: 0,
      reset,
    });

    try {
      await enforceEndpointRateLimit("admin:*", client);
      throw new Error("Should have thrown");
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      expect(errObj.details).toBeDefined();
      const details = errObj.details as Record<string, unknown>;
      expect(details.limit).toBe(60);
      expect(details.remaining).toBe(0);
      expect(details.endpoint).toBe("admin:*");
      expect(details.headers).toBeDefined();
    }
  });
});

describe("DEFAULT_ENDPOINT_LIMITS", () => {
  it("contains known endpoint limits", () => {
    expect(DEFAULT_ENDPOINT_LIMITS).toHaveProperty("quotes:create");
    expect(DEFAULT_ENDPOINT_LIMITS).toHaveProperty("quotes:get");
    expect(DEFAULT_ENDPOINT_LIMITS).toHaveProperty("policies:create");
    expect(DEFAULT_ENDPOINT_LIMITS).toHaveProperty("policies:get");
    expect(DEFAULT_ENDPOINT_LIMITS).toHaveProperty("admin:*");
  });

  it("quotes:create limit is 30 per 60s", () => {
    expect(DEFAULT_ENDPOINT_LIMITS["quotes:create"]).toEqual({
      requests: 30,
      window: "60 s",
    });
  });

  it("quotes:get limit is 60 per 60s", () => {
    expect(DEFAULT_ENDPOINT_LIMITS["quotes:get"]).toEqual({
      requests: 60,
      window: "60 s",
    });
  });

  it("policies:get limit is 120 per 60s", () => {
    expect(DEFAULT_ENDPOINT_LIMITS["policies:get"]).toEqual({
      requests: 120,
      window: "60 s",
    });
  });
});
