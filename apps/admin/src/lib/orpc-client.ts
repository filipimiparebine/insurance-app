import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "@blaj/api";

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken(): Promise<string | null>;
      };
    };
  }
}

async function getClerkToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const token = await window.Clerk?.session?.getToken();
    return token ?? null;
  } catch {
    return null;
  }
}

const link = new RPCLink({
  url: "/api/admin/rpc",
  headers: async () => {
    const token = await getClerkToken();
    const h: Record<string, string> = {};
    if (token) {
      h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const orpc = createORPCClient<AppRouter & any>(link);
