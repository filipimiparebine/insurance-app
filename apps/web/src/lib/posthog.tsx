"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { useEffect } from "react";
import { isCategoryAccepted } from "@/lib/cookie-consent";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

    if (!key) return;

    posthog.init(key, {
      api_host: host,
      persistence: "memory",
      autocapture: false,
      loaded: (ph) => {
        if (!isCategoryAccepted("analytics")) {
          ph.opt_out_capturing();
        }
      },
    });

    const handleConsentChange = () => {
      if (isCategoryAccepted("analytics")) {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }
    };

    window.addEventListener("blaj:consent-change", handleConsentChange);
    return () => {
      window.removeEventListener("blaj:consent-change", handleConsentChange);
    };
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
