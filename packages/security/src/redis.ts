import { Redis } from "@upstash/redis";

const quotesUrl = process.env.UPSTASH_QUOTES_REDIS_URL;
const quotesToken = process.env.UPSTASH_QUOTES_REDIS_TOKEN;
const ratelimitUrl = process.env.UPSTASH_RATELIMIT_REDIS_URL;
const ratelimitToken = process.env.UPSTASH_RATELIMIT_REDIS_TOKEN;

function createRedis(name: string, url?: string, token?: string): Redis | null {
  if (!url || !token) {
    console.warn(`[security] ${name} Redis not configured — missing env vars`);
    return null;
  }
  return new Redis({ url, token });
}

export const quotesRedis = createRedis("Quotes", quotesUrl, quotesToken);

export const ratelimitRedis = createRedis("RateLimit", ratelimitUrl, ratelimitToken);

export function assertRedis(client: Redis | null, name: string): Redis {
  if (!client) {
    throw new Error(
      `[security] ${name} Redis client not available. Set UPSTASH_${name.toUpperCase()}_REDIS_URL and UPSTASH_${name.toUpperCase()}_REDIS_TOKEN.`,
    );
  }
  return client;
}
