import { cn } from "../lib/utils"
import { Check } from "lucide-react"

export interface StepperStep {
  id: string
  label: string
  status: "inactive" | "active" | "completed"
}

interface StepperProps {
  steps: StepperStep[]
  className?: string
}

export function Stepper({ steps, className }: StepperProps) {
  const completedCount = steps.filter((s) => s.status === "completed").length
  const progress = (completedCount / steps.length) * 100
  const activeIndex = steps.findIndex((s) => s.status === "active")

  return (
    <div className={cn("w-full", className)} role="group" aria-label="Progres ghid">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-neutral-200" />

        <div
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-label={`${Math.round(progress)}% completat`}
          className="absolute top-3 left-0 h-0.5 bg-brand-primary transition-all duration-500 ease-spring-soft"
          style={{ width: `${progress}%` }}
        />

        {steps.map((step, i) => (
          <div
            key={step.id}
            role="tab"
            aria-selected={step.status === "active"}
            aria-current={step.status === "active" ? ("step" as const) : undefined}
            aria-label={`${step.label}${step.status === "completed" ? " (completat)" : step.status === "active" ? " (pas curent)" : ""}`}
            tabIndex={step.status === "active" ? 0 : -1}
            className={cn(
              "relative flex flex-col items-center z-10",
              i <= activeIndex && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-full",
            )}
          >
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white text-xs font-medium transition-all duration-200 ease-out",
                step.status === "completed" &&
                  "bg-brand-primary border-brand-primary text-white",
                step.status === "active" &&
                  "border-brand-primary text-brand-primary scale-110 shadow-[0_0_0_3px_rgba(10,10,15,0.06)]",
                step.status === "inactive" &&
                  "border-neutral-300 text-neutral-500",
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{i + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium font-body text-center",
                step.status === "completed" && "text-brand-primary",
                step.status === "active" && "text-brand-primary",
                step.status === "inactive" && "text-neutral-500",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
