import { eq, and, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { Db } from "@blaj/db";
import { apiClients } from "@blaj/db/schema";
import { checkRateLimit } from "@blaj/security/ratelimit";

const BCRYPT_COST = 12;
const PREFIX_LENGTH = 6;

const DUMMY_HASH = "$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5Gz0qXq0qXq0qXq0qXq0qXq0";

export interface ApiClient {
  id: string;
  name: string | null;
  rateLimitPerMin: number | null;
  rateLimitConfig: Record<string, { requests: number; window: `${number} s` | `${number} m` }> | null;
  allowedEndpoints: string[] | null;
  active: boolean | null;
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function extractPrefix(fullHash: string): string {
  return fullHash.slice(0, PREFIX_LENGTH);
}

export async function hashApiKeyForStorage(rawKey: string): Promise<{
  sha256: string;
  prefix: string;
  bcryptHash: string;
}> {
  const sha256 = await sha256Hex(rawKey);
  const prefix = extractPrefix(sha256);
  const bcryptHash = await bcrypt.hash(rawKey, BCRYPT_COST);
  return { sha256, prefix, bcryptHash };
}

export async function authenticateApiKey(
  db: Db,
  authHeader: string | null,
): Promise<ApiClient> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw createApiError(401, "UNAUTHORIZED", "Missing or invalid Authorization header");
  }

  const apiKey = authHeader.slice(7);
  const sha256 = await sha256Hex(apiKey);
  const prefix = extractPrefix(sha256);

  const candidates = await db
    .select({
      id: apiClients.id,
      name: apiClients.name,
      apiKeyBcrypt: apiClients.apiKeyBcrypt,
      rateLimitPerMin: apiClients.rateLimitPerMin,
      rateLimitConfig: apiClients.rateLimitConfig,
      allowedEndpoints: apiClients.allowedEndpoints,
      active: apiClients.active,
    })
    .from(apiClients)
    .where(
      and(
        eq(apiClients.apiKeyPrefix, prefix),
        eq(apiClients.active, true),
        isNull(apiClients.revokedAt),
      ),
    )
    .limit(5);

  let matchedClient: (typeof candidates)[number] | null = null;

  for (const candidate of candidates) {
    const hashToCompare = candidate.apiKeyBcrypt ?? DUMMY_HASH;
    const match = await bcrypt.compare(apiKey, hashToCompare);
    if (match) {
      matchedClient = candidate;
      break;
    }
  }

  if (!matchedClient) {
    if (candidates.length === 0) {
      await bcrypt.compare(apiKey, DUMMY_HASH);
    }
    throw createApiError(401, "UNAUTHORIZED", "Invalid API key");
  }

  const maxRequests = matchedClient.rateLimitPerMin ?? 60;
  const result = await checkRateLimit(`client:${matchedClient.id}`, maxRequests, "60 s");

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    throw createApiError(429, "RATE_LIMITED", "Rate limit exceeded", {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter,
    });
  }

  await db
    .update(apiClients)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiClients.id, matchedClient.id));

  return {
    id: matchedClient.id,
    name: matchedClient.name,
    rateLimitPerMin: matchedClient.rateLimitPerMin,
    rateLimitConfig: (matchedClient.rateLimitConfig ?? null) as ApiClient["rateLimitConfig"],
    allowedEndpoints: matchedClient.allowedEndpoints,
    active: matchedClient.active,
  };
}

export function createApiError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return Object.assign(new Error(message), {
    status,
    code,
    details,
    name: "ApiError",
  });
}
