/**
 * AIErrorState Component
 *
 * Displays error messages with retry functionality when AI initialization fails.
 * Provides helpful context based on error type and user-friendly guidance.
 */

import { errorHandler, AIError } from '@/lib/ai/error-handler';
import type { AIErrorStateProps } from './types';

/**
 * Error state component for AI initialization failures
 *
 * @example
 * ```tsx
 * <AIErrorState
 *   error={error}
 *   onRetry={handleRetry}
 * />
 * ```
 */
export function AIErrorState({
  error,
  onRetry,
  title = 'AI Setup Failed',
  showDetails = import.meta.env.DEV,
}: AIErrorStateProps) {
  if (!error) {
    return null;
  }

  // Convert to AIError if needed
  const aiError = error instanceof AIError ? error : errorHandler.handle(error, 'AIErrorState');
  const errorMessage = errorHandler.getUserMessage(aiError);
  const supportInfo = errorHandler.getSupportInfo(aiError);

  // Determine error type for specific help
  const isChromeMissing = aiError.code === 'PROVIDER_UNAVAILABLE';
  const isNetworkError = aiError.code === 'NETWORK_ERROR' || aiError.code === 'MODEL_LOAD_FAILED';
  const isEmbeddingError = aiError.code === 'EMBEDDING_FAILED';

  return (
    <div
      className="ai-error-state"
      role="alert"
      aria-live="assertive"
    >
      {/* Error icon */}
      <div className="error-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 8v4m0 4h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Error title */}
      <h3 className="error-title">{title}</h3>

      {/* Error message */}
      <p className="error-message">{errorMessage}</p>

      {/* Specific help for Chrome AI missing */}
      {isChromeMissing && (
        <div className="help-section">
          <h4 className="help-title">Chrome AI Required</h4>
          <p className="help-text">
            This app requires Chrome Canary or Chrome Dev with the Prompt API enabled.
          </p>
          <a
            href="https://developer.chrome.com/docs/ai/built-in"
            target="_blank"
            rel="noopener noreferrer"
            className="help-link"
          >
            Learn how to enable Chrome AI
            <svg
              className="external-link-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}

      {/* Specific help for network errors */}
      {isNetworkError && (
        <div className="help-section">
          <h4 className="help-title">Network Issue</h4>
          <p className="help-text">
            Could not download AI models. Please check your internet connection and try again.
          </p>
        </div>
      )}

      {/* Specific help for embedding errors */}
      {isEmbeddingError && (
        <div className="help-section">
          <h4 className="help-title">Model Loading Issue</h4>
          <p className="help-text">
            Failed to load the embedding model. This could be due to network issues or browser compatibility.
          </p>
        </div>
      )}

      {/* Retry button */}
      {aiError.recoverable && (
        <button
          onClick={onRetry}
          className="retry-button"
          type="button"
          aria-label="Retry AI initialization"
        >
          <svg
            className="retry-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 4v6h6M23 20v-6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Try Again
        </button>
      )}

      {/* Technical details (dev mode only) */}
      {showDetails && (
        <details className="technical-details">
          <summary className="details-summary">Technical Details</summary>
          <div className="details-content">
            <pre className="details-pre">
              {supportInfo}
              {aiError.stack && `\n\nStack Trace:\n${aiError.stack}`}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}
