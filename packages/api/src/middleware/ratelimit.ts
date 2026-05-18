import { checkRateLimit, rateLimitHeaders, parseWindow } from "@blaj/security/ratelimit";
import { createApiError } from "./auth";

export const DEFAULT_ENDPOINT_LIMITS: Record<string, { requests: number; window: `${number} s` | `${number} m` }> = {
  "quotes:create": { requests: 30, window: "60 s" },
  "quotes:get": { requests: 60, window: "60 s" },
  "policies:create": { requests: 10, window: "60 s" },
  "policies:get": { requests: 120, window: "60 s" },
  "admin:*": { requests: 60, window: "60 s" },
};

const DEFAULT_GLOBAL_LIMIT = { requests: 60, window: "60 s" as const };

interface ClientRateLimitInfo {
  id: string;
  rateLimitPerMin: number | null;
  rateLimitConfig?: Record<string, { requests: number; window: `${number} s` | `${number} m` }> | null;
}

export async function enforceEndpointRateLimit(
  endpoint: string,
  client: ClientRateLimitInfo,
): Promise<void> {
  const config = client.rateLimitConfig?.[endpoint] ?? DEFAULT_ENDPOINT_LIMITS[endpoint] ?? DEFAULT_GLOBAL_LIMIT;

  const requests = config.requests ?? client.rateLimitPerMin ?? 60;
  const windowDuration = config.window ?? "60 s";

  const result = await checkRateLimit(`client:${client.id}:${endpoint}`, requests, windowDuration);

  if (!result.success) {
    const windowMs = parseWindow(windowDuration);
    const headers = rateLimitHeaders(result, windowMs);
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

    throw createApiError(429, "RATE_LIMITED", `Rate limit exceeded for ${endpoint}`, {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter,
      endpoint,
      headers,
    });
  }
}
