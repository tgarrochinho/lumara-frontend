/**
 * ErrorBoundary Component
 *
 * React error boundary to catch JavaScript errors anywhere in the component tree,
 * log those errors, and display a fallback UI instead of crashing the whole app.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Store error info in state for debugging
    this.setState({
      errorInfo,
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background-dark">
          <Card className="max-w-lg w-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Something went wrong
              </h1>

              <p className="text-white/70 mb-6">
                We apologize for the inconvenience. An unexpected error has
                occurred.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <summary className="cursor-pointer text-red-400 font-medium mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="text-sm text-red-300 font-mono overflow-auto max-h-60">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="text-xs mt-1 whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo && (
                        <div className="mt-2">
                          <strong>Component Stack:</strong>
                          <pre className="text-xs mt-1 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleReset} variant="primary">
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                >
                  Reload Page
                </Button>
              </div>

              {!import.meta.env.DEV && (
                <p className="text-white/50 text-sm mt-6">
                  If this problem persists, please contact support.
                </p>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
