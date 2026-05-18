export interface ApiClient {
  id: string;
  name: string;
  apiKeyHash: string;
  rateLimitPerMin: number;
  allowedEndpoints: string[];
  active: boolean;
  createdAt: string;
  revokedAt: string | null;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimitHeaders {
  [key: string]: string;
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
  "Retry-After": string;
}

export interface ApiKeyValidationResult {
  valid: true;
  clientId: string;
  clientName: string;
  headers: RateLimitHeaders;
}

export type ApiKeyAuthResult =
  | ApiKeyValidationResult
  | { valid: false; error: string; status: number };
