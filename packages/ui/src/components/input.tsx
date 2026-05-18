import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "../lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  detected?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, detected, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border bg-surface px-4 py-3 text-base font-body text-primary placeholder:text-neutral-400",
          "transition-all duration-150 ease-out",
          "hover:border-neutral-400",
          "focus:border-electric focus:border-[1.5px] focus:shadow-focus focus:outline-none",
          "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200",
          error
            ? "border-danger border-[1.5px] shadow-[0_0_0_4px_rgba(220,38,38,0.1)]"
            : detected
              ? "border-success border-[1.5px] bg-[rgba(22,163,74,0.04)]"
              : "border-neutral-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
