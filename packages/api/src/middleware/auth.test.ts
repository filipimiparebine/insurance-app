import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCheckRateLimit = vi.fn();

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col: unknown, val: unknown) => ({ $eq: [col, val] })),
  and: vi.fn((...args: unknown[]) => args),
  isNull: vi.fn((col: unknown) => ({ $isNull: col })),
  sql: vi.fn(),
}));

vi.mock("@blaj/db", () => ({
  apiClients: {
    id: { name: "id" },
    name: { name: "name" },
    apiKeyBcrypt: { name: "apiKeyBcrypt" },
    apiKeyPrefix: { name: "apiKeyPrefix" },
    rateLimitPerMin: { name: "rateLimitPerMin" },
    rateLimitConfig: { name: "rateLimitConfig" },
    allowedEndpoints: { name: "allowedEndpoints" },
    active: { name: "active" },
    revokedAt: { name: "revokedAt" },
    lastUsedAt: { name: "lastUsedAt" },
  },
}));

vi.mock("@blaj/security/ratelimit", () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
  rateLimitHeaders: vi.fn(() => ({})),
  parseWindow: vi.fn(() => 60000),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn((data: string, cost: number) =>
      Promise.resolve(`$2a$${String(cost).padStart(2, "0")}$mock_${data}`),
    ),
    compare: vi.fn((data: string, hash: string) =>
      Promise.resolve(hash.endsWith(`mock_${data}`)),
    ),
  },
  hash: vi.fn((data: string, cost: number) =>
    Promise.resolve(`$2a$${String(cost).padStart(2, "0")}$mock_${data}`),
  ),
  compare: vi.fn((data: string, hash: string) =>
    Promise.resolve(hash.endsWith(`mock_${data}`)),
  ),
}));

import {
  hashApiKeyForStorage,
  createApiError,
  authenticateApiKey,
} from "./auth";

function chainQuery(result: unknown[]) {
  const limitFn = vi.fn().mockResolvedValue(result);
  const whereFn = vi.fn().mockReturnValue({ limit: limitFn });
  const fromFn = vi.fn().mockReturnValue({ where: whereFn });
  const selectFn = vi.fn().mockReturnValue({ from: fromFn });
  const setFn = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  const updateFn = vi.fn().mockReturnValue({ set: setFn });

  return {
    db: {
      select: selectFn,
      update: updateFn,
    } as unknown as import("@blaj/db").Db,
    select: selectFn,
    from: fromFn,
    where: whereFn,
    limit: limitFn,
    update: updateFn,
    set: setFn,
  };
}

describe("hashApiKeyForStorage", () => {
  it("returns sha256, prefix, and bcryptHash", async () => {
    const result = await hashApiKeyForStorage("blaj_test_key_abc");
    expect(result).toHaveProperty("sha256");
    expect(result).toHaveProperty("prefix");
    expect(result).toHaveProperty("bcryptHash");
  });

  it("sha256 is 64 hex chars", async () => {
    const { sha256 } = await hashApiKeyForStorage("blaj_test_key_abc");
    expect(sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("prefix is first 6 hex chars of sha256", async () => {
    const { sha256, prefix } = await hashApiKeyForStorage("blaj_test_key");
    expect(prefix).toBe(sha256.slice(0, 6));
  });

  it("bcryptHash starts with $2a$12$", async () => {
    const { bcryptHash } = await hashApiKeyForStorage("blaj_test_key");
    expect(bcryptHash).toMatch(/^\$2[ab]\$12\$/);
  });

  it("produces different hashes for different keys", async () => {
    const r1 = await hashApiKeyForStorage("key_a");
    const r2 = await hashApiKeyForStorage("key_b");
    expect(r1.sha256).not.toBe(r2.sha256);
    expect(r1.prefix).not.toBe(r2.prefix);
  });

  it("produces deterministic sha256 for same key", async () => {
    const r1 = await hashApiKeyForStorage("blaj_same_key");
    const r2 = await hashApiKeyForStorage("blaj_same_key");
    expect(r1.sha256).toBe(r2.sha256);
    expect(r1.prefix).toBe(r2.prefix);
  });
});

describe("createApiError", () => {
  it("returns an Error instance", () => {
    const err = createApiError(400, "BAD_REQUEST", "Bad request");
    expect(err).toBeInstanceOf(Error);
  });

  it("sets the status property", () => {
    const err = createApiError(401, "UNAUTHORIZED", "Unauthorized");
    expect((err as unknown as Record<string, unknown>).status).toBe(401);
  });

  it("sets the code property", () => {
    const err = createApiError(404, "NOT_FOUND", "Not found");
    expect((err as unknown as Record<string, unknown>).code).toBe("NOT_FOUND");
  });

  it("sets the message", () => {
    const err = createApiError(500, "INTERNAL", "Server error");
    expect(err.message).toBe("Server error");
  });

  it("sets the name to ApiError", () => {
    const err = createApiError(403, "FORBIDDEN", "Forbidden");
    expect(err.name).toBe("ApiError");
  });

  it("includes optional details", () => {
    const err = createApiError(429, "RATE_LIMITED", "Rate limited", {
      retryAfter: 30,
    });
    expect((err as unknown as Record<string, unknown>).details).toEqual({
      retryAfter: 30,
    });
  });

  it("details is undefined when not provided", () => {
    const err = createApiError(400, "BAD", "Bad");
    expect((err as unknown as Record<string, unknown>).details).toBeUndefined();
  });
});

describe("authenticateApiKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws 401 when Authorization header is missing", async () => {
    const { db } = chainQuery([]);
    await expect(authenticateApiKey(db, null)).rejects.toMatchObject({
      message: "Missing or invalid Authorization header",
    });
  });

  it("throws 401 when Authorization header is not Bearer", async () => {
    const { db } = chainQuery([]);
    await expect(
      authenticateApiKey(db, "Basic abc123"),
    ).rejects.toMatchObject({
      message: "Missing or invalid Authorization header",
    });
  });

  it("throws 401 when no clients match prefix", async () => {
    const { db } = chainQuery([]);
    await expect(
      authenticateApiKey(db, "Bearer blaj_valid_format_key_abcdef0123456789"),
    ).rejects.toMatchObject({
      message: "Invalid API key",
    });
  });

  it("throws 401 when candidate bcrypt does not match", async () => {
    const { db } = chainQuery([
      {
        id: "client-1",
        name: "Test Client",
        apiKeyBcrypt: "$2a$12$mock_wrong_key_x",
        rateLimitPerMin: 60,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    await expect(
      authenticateApiKey(db, "Bearer blaj_not_matching_key"),
    ).rejects.toMatchObject({
      message: "Invalid API key",
    });
  });

  it("returns ApiClient on successful authentication", async () => {
    const { db } = chainQuery([
      {
        id: "client-1",
        name: "Test Client",
        apiKeyBcrypt: "$2a$12$mock_blaj_good_key",
        rateLimitPerMin: 60,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    const result = await authenticateApiKey(db, "Bearer blaj_good_key");

    expect(result).toMatchObject({
      id: "client-1",
      name: "Test Client",
      rateLimitPerMin: 60,
    });
  });

  it("throws 429 when rate limited", async () => {
    const now = Date.now();
    const { db } = chainQuery([
      {
        id: "client-2",
        name: "Rate Limited Client",
        apiKeyBcrypt: "$2a$12$mock_blaj_rated_key",
        rateLimitPerMin: 5,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    mockCheckRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Math.floor((now + 30_000) / 1000),
    });

    await expect(
      authenticateApiKey(db, "Bearer blaj_rated_key"),
    ).rejects.toMatchObject({
      message: "Rate limit exceeded",
    });
  });

  it("uses client-specific rateLimitPerMin", async () => {
    const { db } = chainQuery([
      {
        id: "client-3",
        name: "Custom Rate Client",
        apiKeyBcrypt: "$2a$12$mock_blaj_custom_key",
        rateLimitPerMin: 120,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 120,
      remaining: 119,
      reset: Date.now() + 60_000,
    });

    const result = await authenticateApiKey(db, "Bearer blaj_custom_key");
    expect(result.rateLimitPerMin).toBe(120);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      "client:client-3",
      120,
      "60 s",
    );
  });

  it("propagates rate limit details on 429", async () => {
    const now = Date.now();
    const reset = Math.floor((now + 45000) / 1000);

    const { db } = chainQuery([
      {
        id: "client-4",
        name: null,
        apiKeyBcrypt: "$2a$12$mock_blaj_detail_key",
        rateLimitPerMin: null,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    mockCheckRateLimit.mockResolvedValueOnce({
      success: false,
      limit: 60,
      remaining: 0,
      reset,
    });

    try {
      await authenticateApiKey(db, "Bearer blaj_detail_key");
      throw new Error("Should have thrown");
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      expect(errObj.details).toBeDefined();
      const details = errObj.details as Record<string, unknown>;
      expect(details.limit).toBe(60);
      expect(details.remaining).toBe(0);
      expect(details.reset).toBe(reset);
      expect(typeof details.retryAfter).toBe("number");
    }
  });

  it("matches first candidate when multiple candidates share prefix", async () => {
    const { db } = chainQuery([
      {
        id: "client-first",
        name: "First",
        apiKeyBcrypt: "$2a$12$mock_blaj_prefix_key",
        rateLimitPerMin: 60,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
      {
        id: "client-second",
        name: "Second",
        apiKeyBcrypt: "$2a$12$mock_other_key",
        rateLimitPerMin: 60,
        rateLimitConfig: null,
        allowedEndpoints: null,
        active: true,
      },
    ]);

    mockCheckRateLimit.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    const result = await authenticateApiKey(db, "Bearer blaj_prefix_key");
    expect(result.id).toBe("client-first");
  });
});
