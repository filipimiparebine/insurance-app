import { os } from "@orpc/server";
import type { AppContext } from "../context";
import { enforceEndpointRateLimit } from "../middleware/ratelimit";

export const adminBuilder = os
  .$context<AppContext>()
  .use(async ({ context, next }) => {
    if (!context.userId && !context.apiClient) {
      throw new Error("Unauthorized");
    }

    if (context.apiClient) {
      await enforceEndpointRateLimit("admin:*", context.apiClient);
      return next();
    }

    if (!context.isAdmin) {
      throw new Error("Forbidden");
    }

    return next();
  });
