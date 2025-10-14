/**
 * AI Error Boundary Component
 *
 * React error boundary that catches and handles AI-related errors in the component tree.
 * Provides user-friendly error messages and recovery options.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AIError, errorHandler } from '@/lib/ai/error-handler';

/**
 * Props for the AIErrorBoundary component
 */
interface AIErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;

  /** Optional custom fallback UI */
  fallback?: ReactNode | ((error: AIError, reset: () => void) => ReactNode);

  /** Callback invoked when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /** Whether to show detailed error information (defaults to DEV mode) */
  showDetails?: boolean;
}

/**
 * State for the AIErrorBoundary component
 */
interface AIErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;

  /** The caught error (if it's an AIError) */
  error: AIError | null;
}

/**
 * Error boundary that catches AI-related errors and displays user-friendly messages
 *
 * @example
 * ```tsx
 * <AIErrorBoundary>
 *   <AIChat />
 * </AIErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <AIErrorBoundary
 *   fallback={(error, reset) => (
 *     <CustomErrorUI error={error} onRetry={reset} />
 *   )}
 * >
 *   <AIFeature />
 * </AIErrorBoundary>
 * ```
 */
export class AIErrorBoundary extends Component<AIErrorBoundaryProps, AIErrorBoundaryState> {
  constructor(props: AIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): AIErrorBoundaryState {
    // Convert to AIError if needed
    const aiError = error instanceof AIError
      ? error
      : errorHandler.handle(error, 'ErrorBoundary');

    return {
      hasError: true,
      error: aiError,
    };
  }

  /**
   * Log error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[AIErrorBoundary] Caught error:', error);
      console.error('[AIErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // Invoke callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send to error tracking service
    if (!import.meta.env.DEV) {
      // TODO: Send to error tracking service (e.g., Sentry)
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  /**
   * Reset the error boundary state
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Render the error UI or children
   */
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.resetError);
        }
        return this.props.fallback;
      }

      // Default error UI
      return (
        <DefaultErrorUI
          error={this.state.error}
          onReset={this.resetError}
          showDetails={this.props.showDetails ?? import.meta.env.DEV}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error UI component
 */
interface DefaultErrorUIProps {
  error: AIError;
  onReset: () => void;
  showDetails: boolean;
}

function DefaultErrorUI({ error, onReset, showDetails }: DefaultErrorUIProps): ReactNode {
  const userMessage = errorHandler.getUserMessage(error);
  const supportInfo = errorHandler.getSupportInfo(error);

  return (
    <div
      role="alert"
      style={{
        padding: '24px',
        margin: '16px',
        border: '1px solid #e53e3e',
        borderRadius: '8px',
        backgroundColor: '#fff5f5',
        color: '#742a2a',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <svg
          style={{ width: '24px', height: '24px', marginRight: '12px', fill: 'currentColor' }}
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          AI System Error
        </h3>
      </div>

      <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>
        {userMessage}
      </p>

      {error.recoverable && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c53030';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#e53e3e';
          }}
        >
          Try Again
        </button>
      )}

      {showDetails && (
        <details style={{ marginTop: '16px' }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              userSelect: 'none',
            }}
          >
            Technical Details
          </summary>
          <pre
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#fed7d7',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {supportInfo}
            {error.stack && `\n\nStack Trace:\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}
