"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-semibold text-brand-primary">
            blaj<span className="text-brand-accent">.</span>io
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Admin Panel</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-surface border border-border-subtle rounded-lg shadow-lg p-8",
              headerTitle: "font-display text-lg font-semibold text-text-primary",
              headerSubtitle: "text-sm text-text-secondary",
              formButtonPrimary:
                "bg-brand-primary text-on-brand hover:bg-neutral-800 text-sm font-medium h-10 px-4 rounded-md transition-colors duration-fast",
              formFieldInput:
                "h-11 rounded-md border border-border-default bg-surface px-4 py-2 text-base text-text-primary focus:border-border-focus focus:shadow-focus",
              formFieldLabel: "text-sm font-medium text-text-primary",
              footerActionLink:
                "text-electric hover:text-electric-hover text-sm font-medium",
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
