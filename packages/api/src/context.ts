import type { Db } from "@blaj/db";

export interface ApiClientContext {
  id: string;
  name: string | null;
  rateLimitPerMin: number | null;
  rateLimitConfig?: Record<string, { requests: number; window: `${number} s` | `${number} m` }> | null;
}

export type AppContext = {
  db: Db;
  userId?: string;
  isAdmin?: boolean;
  apiClient?: ApiClientContext;
  ipAddress?: string;
  userAgent?: string;
};
