import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-body font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric/20 disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-400",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white shadow-xs hover:shadow-sm hover:-translate-y-px active:translate-y-0 active:shadow-xs",
        "hero-accent":
          "bg-brand-accent text-white shadow-xs hover:bg-brand-accent-hover hover:shadow-sm focus-visible:ring-brand-accent/20",
        secondary:
          "bg-transparent text-brand-primary border border-neutral-300 hover:bg-black/5 active:bg-black/10",
        ghost:
          "bg-transparent text-neutral-500 hover:bg-black/5 hover:text-brand-primary",
        destructive:
          "bg-danger text-white hover:brightness-90",
        outline:
          "bg-transparent text-brand-primary border border-neutral-300 hover:bg-black/5",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-2",
        md: "h-10 px-4 text-base gap-2.5",
        lg: "h-12 px-6 text-lg gap-3",
        xl: "h-14 px-10 text-xl gap-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
