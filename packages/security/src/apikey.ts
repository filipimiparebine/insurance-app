import { quotesRedis, assertRedis } from "./redis";
import type { ApiClient, RateLimitResult, RateLimitHeaders, ApiKeyAuthResult } from "./types";
import { checkRateLimit, rateLimitHeaders, parseWindow } from "./ratelimit";

const APIKEY_PREFIX = "apikey";
const APIKEY_INDEX_KEY = `${APIKEY_PREFIX}:index`;

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function redisKey(hash: string): string {
  return `${APIKEY_PREFIX}:${hash}`;
}

export async function validateApiKey(
  apiKey: string,
): Promise<ApiKeyAuthResult> {
  const redis = assertRedis(quotesRedis, "QUOTES");
  const keyHash = await hashKey(apiKey);
  const key = redisKey(keyHash);

  const data = await redis.get<{ id: string; name: string; rateLimitPerMin: number; allowedEndpoints: string[] }>(key);
  if (!data) {
    return { valid: false, error: "Invalid API key", status: 401 };
  }

  const { id, name, rateLimitPerMin } = data;

  const result: RateLimitResult = await checkRateLimit(
    `client:${id}`,
    rateLimitPerMin,
    "60 s",
  );

  const windowMs = parseWindow("60 s");
  const headers: RateLimitHeaders = rateLimitHeaders(result, windowMs);

  if (!result.success) {
    return { valid: false, error: "Rate limit exceeded", status: 429 };
  }

  return { valid: true, clientId: id, clientName: name, headers };
}

export async function registerApiKey(client: ApiClient): Promise<void> {
  const redis = assertRedis(quotesRedis, "QUOTES");

  const payload = {
    id: client.id,
    name: client.name,
    rateLimitPerMin: client.rateLimitPerMin,
    allowedEndpoints: client.allowedEndpoints,
  };

  const pipeline = redis.pipeline();
  pipeline.set(redisKey(client.apiKeyHash), payload);
  pipeline.sadd(APIKEY_INDEX_KEY, client.apiKeyHash);
  await pipeline.exec();
}

export async function revokeApiKey(apiKeyHash: string): Promise<void> {
  const redis = assertRedis(quotesRedis, "QUOTES");

  const pipeline = redis.pipeline();
  pipeline.del(redisKey(apiKeyHash));
  pipeline.srem(APIKEY_INDEX_KEY, apiKeyHash);
  await pipeline.exec();
}

export async function getApiKeyList(): Promise<string[]> {
  const redis = assertRedis(quotesRedis, "QUOTES");
  return redis.smembers(APIKEY_INDEX_KEY);
}

export async function getApiKey(apiKeyHash: string): Promise<ApiClient | null> {
  const redis = assertRedis(quotesRedis, "QUOTES");
  const data = await redis.get<ApiClient>(redisKey(apiKeyHash));
  if (!data) return null;
  return { ...data, apiKeyHash };
}
