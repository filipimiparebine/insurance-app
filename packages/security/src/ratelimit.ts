import { Ratelimit } from "@upstash/ratelimit";
import { ratelimitRedis } from "./redis";
import type { RateLimitResult, RateLimitHeaders } from "./types";

const DEFAULT_REQUESTS = 60;
const DEFAULT_WINDOW = "60 s" as const;
const RATELIMIT_PREFIX = "blaj:ratelimit";

const limiterCache = new Map<string, Ratelimit>();

const inMemoryWindows = new Map<string, number[]>();
const IN_MEMORY_WINDOW_MS = 60_000;

function getLimiter(requests: number, window: `${number} s` | `${number} m`): Ratelimit | null {
  const cacheKey = `${requests}:${window}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  if (!ratelimitRedis) {
    return null;
  }

  const limiter = new Ratelimit({
    redis: ratelimitRedis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: RATELIMIT_PREFIX,
    enableProtection: true,
  });

  limiterCache.set(cacheKey, limiter);
  return limiter;
}

function inMemoryCheck(key: string, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const window_ = now - IN_MEMORY_WINDOW_MS;

  let timestamps = inMemoryWindows.get(key);
  if (!timestamps) {
    timestamps = [];
    inMemoryWindows.set(key, timestamps);
  }

  const valid = timestamps.filter((t) => t > window_);
  valid.push(now);
  inMemoryWindows.set(key, valid);

  const reset = Math.ceil((Math.floor(now / IN_MEMORY_WINDOW_MS) * IN_MEMORY_WINDOW_MS + IN_MEMORY_WINDOW_MS) / 1000);

  if (valid.length > maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, reset };
  }

  return { success: true, limit: maxRequests, remaining: maxRequests - valid.length, reset };
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = DEFAULT_REQUESTS,
  window: `${number} s` | `${number} m` = DEFAULT_WINDOW,
): Promise<RateLimitResult> {
  const limiter = getLimiter(maxRequests, window);

  if (!limiter) {
    return inMemoryCheck(key, maxRequests);
  }

  try {
    return await limiter.limit(key);
  } catch {
    return inMemoryCheck(key, maxRequests);
  }
}

export function rateLimitHeaders(result: RateLimitResult, windowMs: number): RateLimitHeaders {
  const retryAfter = result.success
    ? 0
    : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
    "Retry-After": String(retryAfter),
  };
}

export function parseWindow(window: `${number} s` | `${number} m`): number {
  if (window.endsWith(" s")) return parseInt(window) * 1000;
  if (window.endsWith(" m")) return parseInt(window) * 60 * 1000;
  return 60000;
}
