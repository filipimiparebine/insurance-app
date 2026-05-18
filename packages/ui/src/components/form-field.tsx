"use client"

import type { ReactNode } from "react"
import { cn } from "../lib/utils"
import { Label } from "./label"

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-neutral-400 mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-danger mt-0.5">{error}</p>
      )}
    </div>
  )
}
