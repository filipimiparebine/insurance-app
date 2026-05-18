import { os } from "@orpc/server";
import type { AppContext } from "./context";
import { adminRouter } from "./admin";
import { createQuoteHandler } from "./handlers/quotes";
import {
  getPolicyHandler,
  listPoliciesHandler,
  cancelPolicyHandler,
} from "./handlers/policies";
import {
  createPaymentIntentHandler,
  getPaymentHandler,
  cancelWithRefundHandler,
} from "./handlers/payments";
import {
  getProfileHandler,
  updatePreferencesHandler,
  deleteAccountHandler,
} from "./handlers/account";
import {
  registerPushTokenHandler,
  unregisterPushTokenHandler,
} from "./handlers/push-tokens";
import {
  createQuoteInput,
  createQuoteOutput,
} from "./contracts/quotes";
import {
  getPolicyInput,
  getPolicyOutput,
  listPoliciesInput,
  listPoliciesOutput,
  cancelPolicyInput,
  cancelPolicyOutput,
} from "./contracts/policies";
import {
  createPaymentIntentInput,
  getPaymentInput,
  cancelWithRefundInput,
  createPaymentIntentOutput,
  cancelWithRefundOutput,
  getPaymentOutput,
} from "./contracts/payments";
import {
  getProfileInput,
  getProfileOutput,
  updatePreferencesInput,
  updatePreferencesOutput,
  deleteAccountInput,
  deleteAccountOutput,
} from "./contracts/account";
import { registerPushTokenInput, registerPushTokenOutput, unregisterPushTokenInput, unregisterPushTokenOutput } from "./contracts/push-tokens";

const base = os.$context<AppContext>();

export const publicRouter = base.router({
  quotes: {
    create: base
      .route({ method: "POST" })
      .input(createQuoteInput)
      .output(createQuoteOutput)
      .handler(async ({ input, context }) => {
        return createQuoteHandler(context.db, input);
      }),
  },
  policies: {
    get: base
      .route({ method: "GET" })
      .input(getPolicyInput)
      .output(getPolicyOutput)
      .handler(async ({ input, context }) => {
        return getPolicyHandler(context.db, input);
      }),
    list: base
      .route({ method: "GET" })
      .input(listPoliciesInput)
      .output(listPoliciesOutput)
      .handler(async ({ input, context }) => {
        return listPoliciesHandler(context.db, input);
      }),
    cancel: base
      .route({ method: "POST" })
      .input(cancelPolicyInput)
      .output(cancelPolicyOutput)
      .handler(async ({ input, context }) => {
        return cancelPolicyHandler(context.db, input);
      }),
  },
  payments: {
    createIntent: base
      .route({ method: "POST" })
      .input(createPaymentIntentInput)
      .output(createPaymentIntentOutput)
      .handler(async ({ input, context }) => {
        return createPaymentIntentHandler(context.db, input);
      }),
    get: base
      .route({ method: "GET" })
      .input(getPaymentInput)
      .output(getPaymentOutput)
      .handler(async ({ input, context }) => {
        return getPaymentHandler(context.db, input);
      }),
    cancelWithRefund: base
      .route({ method: "POST" })
      .input(cancelWithRefundInput)
      .output(cancelWithRefundOutput)
      .handler(async ({ input, context }) => {
        return cancelWithRefundHandler(context.db, input);
      }),
  },
  account: {
    getProfile: base
      .route({ method: "GET" })
      .input(getProfileInput)
      .output(getProfileOutput)
      .handler(async ({ input, context }) => {
        return getProfileHandler(context.db, input);
      }),
    updatePreferences: base
      .route({ method: "PUT" })
      .input(updatePreferencesInput)
      .output(updatePreferencesOutput)
      .handler(async ({ input, context }) => {
        return updatePreferencesHandler(context.db, input);
      }),
    delete: base
      .route({ method: "DELETE" })
      .input(deleteAccountInput)
      .output(deleteAccountOutput)
      .handler(async ({ input, context }) => {
        return deleteAccountHandler(context.db, input);
      }),
  },
  pushTokens: {
    register: base
      .route({ method: "POST" })
      .input(registerPushTokenInput)
      .output(registerPushTokenOutput)
      .handler(async ({ input, context }) => {
        if (!context.userId) {
          throw new Error("Authentication required");
        }
        return registerPushTokenHandler(context.db, context.userId, input);
      }),
    unregister: base
      .route({ method: "POST" })
      .input(unregisterPushTokenInput)
      .output(unregisterPushTokenOutput)
      .handler(async ({ input, context }) => {
        if (!context.userId) {
          throw new Error("Authentication required");
        }
        return unregisterPushTokenHandler(context.db, context.userId, input);
      }),
  },
});

export const appRouter = base.router({
  public: publicRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
