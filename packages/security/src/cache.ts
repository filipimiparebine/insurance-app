import { quotesRedis, assertRedis } from "./redis";

const CACHE_PREFIX = "blaj:cache:quote";
const DEFAULT_TTL = 300;

function cacheKey(params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce(
      (acc, k) => {
        const v = String(params[k] ?? "");
        if (v) acc += `${k}=${v}|`;
        return acc;
      },
      "",
    );
  return `${CACHE_PREFIX}:${sorted}`;
}

export async function getCachedQuote<T>(params: Record<string, unknown>): Promise<T | null> {
  const redis = quotesRedis;
  if (!redis) return null;
  const key = cacheKey(params);
  const data = await redis.get<string>(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setCachedQuote<T>(
  params: Record<string, unknown>,
  data: T,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  const redis = assertRedis(quotesRedis, "QUOTES");
  const key = cacheKey(params);
  await redis.set(key, JSON.stringify(data), { ex: ttl });
}

export async function invalidateQuoteCache(pattern: string = "*"): Promise<void> {
  const redis = quotesRedis;
  if (!redis) return;
  const keys = await redis.keys(`${CACHE_PREFIX}:${pattern}`);
  if (keys.length > 0) {
    const pipeline = redis.pipeline();
    for (const key of keys) pipeline.del(key);
    await pipeline.exec();
  }
}
