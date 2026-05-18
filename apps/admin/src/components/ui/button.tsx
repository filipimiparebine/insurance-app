"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive" | "ghost" | "outline" | "default";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all",
          variant === "primary" && "bg-brand-primary text-white",
          variant === "destructive" && "bg-danger text-white hover:brightness-90",
          variant === "ghost" && "bg-transparent hover:bg-neutral-100",
          variant === "outline" && "border border-neutral-200 bg-transparent",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-base",
          size === "lg" && "h-12 px-6 text-lg",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
