"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { t } from "@blaj/shared"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-danger/20 bg-danger-soft/10">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft">
              <AlertTriangle className="h-6 w-6 text-danger" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">{t("common.error")}</p>
              <p className="text-xs text-neutral-500">
                {this.state.error?.message ?? t("common.error")}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={this.handleRetry}>
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
