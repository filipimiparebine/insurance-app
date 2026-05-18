import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateApiKey,
  hashApiKey,
  hashApiKeyWithBcrypt,
  validateKeyFormat,
} from "./keygen";

const mockRandomBytes = new Uint8Array([
  0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0x01, 0x23, 0x45, 0x67,
  0x89, 0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0x01, 0x23, 0x45,
]);

function mockGetRandomValues() {
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
    (arr) => {
      const target = arr as Uint8Array;
      target.set(mockRandomBytes.slice(0, target.length));
      return target;
    },
  );
}

describe("generateApiKey", () => {
  beforeEach(() => {
    mockGetRandomValues();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("produces a raw key with blaj_ prefix", () => {
    const result = generateApiKey();
    expect(result.rawKey).toMatch(/^blaj_[0-9a-f]{48}$/);
  });

  it("produces a hex string of 48 characters", () => {
    const result = generateApiKey();
    expect(result.hex).toHaveLength(48);
    expect(result.hex).toMatch(/^[0-9a-f]{48}$/);
  });

  it("prefix matches first 6 hex chars after the key prefix", () => {
    const result = generateApiKey();
    const expectedPrefix = result.hex.slice(0, 6);
    expect(result.prefix).toBe(`blaj_${expectedPrefix}`);
  });

  it("prefix length equals blaj_ + 6 chars", () => {
    const { prefix } = generateApiKey();
    expect(prefix).toHaveLength("blaj_".length + 6);
  });

  it("generates deterministic hex from fixed random bytes", () => {
    const result = generateApiKey();
    expect(result.hex).toBe(
      "abcdef01234567890123456789abcdef0123456789012345",
    );
    expect(result.rawKey).toBe(
      "blaj_abcdef01234567890123456789abcdef0123456789012345",
    );
    expect(result.prefix).toBe("blaj_abcdef");
  });

  it("raw key includes hex without prefix separator", () => {
    const result = generateApiKey();
    expect(result.rawKey).toBe(`blaj_${result.hex}`);
  });
});

describe("hashApiKey", () => {
  it("returns a 64-char hex string for SHA-256", async () => {
    const hash = await hashApiKey("blaj_abcdef01234567890123456789abcdef0123456789012345");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces deterministic hashes for the same input", async () => {
    const input = "blaj_test_key_abc123";
    const h1 = await hashApiKey(input);
    const h2 = await hashApiKey(input);
    expect(h1).toBe(h2);
  });

  it("produces different hashes for different inputs", async () => {
    const h1 = await hashApiKey("blaj_key_one");
    const h2 = await hashApiKey("blaj_key_two");
    expect(h1).not.toBe(h2);
  });
});

describe("hashApiKeyWithBcrypt", () => {
  it("returns a bcrypt hash string with valid version prefix", async () => {
    const hash = await hashApiKeyWithBcrypt("blaj_test_key");
    expect(hash).toMatch(/^\$2[ab]\$12\$/);
  });

  it("produces different hashes for different inputs", async () => {
    const h1 = await hashApiKeyWithBcrypt("blaj_key_a");
    const h2 = await hashApiKeyWithBcrypt("blaj_key_b");
    expect(h1).not.toBe(h2);
  });
});

describe("validateKeyFormat", () => {
  it("accepts a valid blaj_ key with 48 hex chars", () => {
    expect(validateKeyFormat("blaj_abcdef01234567890123456789abcdef0123456789012345")).toBe(true);
  });

  it("rejects a key without blaj_ prefix", () => {
    expect(validateKeyFormat("abc_abcdef01234567890123456789abcdef0123456789012345")).toBe(false);
  });

  it("rejects a key with uppercase hex", () => {
    expect(validateKeyFormat("blaj_ABCDEF01234567890123456789ABCDEF0123456789012345")).toBe(false);
  });

  it("rejects a key shorter than expected", () => {
    expect(validateKeyFormat("blaj_abc123")).toBe(false);
  });

  it("rejects a key longer than expected", () => {
    expect(validateKeyFormat("blaj_abcdef01234567890123456789abcdef0123456789012345extra")).toBe(false);
  });

  it("rejects a key with non-hex characters", () => {
    expect(validateKeyFormat("blaj_ghijkl01234567890123456789abcdef0123456789012345")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateKeyFormat("")).toBe(false);
  });

  it("rejects a key missing hex portion", () => {
    expect(validateKeyFormat("blaj_")).toBe(false);
  });
});
