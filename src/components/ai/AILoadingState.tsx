/**
 * AILoadingState Component
 *
 * Displays loading UI with progress bar during AI model initialization.
 * Shows download progress for Transformers.js model and provides clear
 * feedback about what's happening.
 */

import type { AILoadingStateProps } from './types';

/**
 * Loading state component for AI initialization
 *
 * @example
 * ```tsx
 * <AILoadingState
 *   progress={45}
 *   message="Downloading AI models..."
 * />
 * ```
 */
export function AILoadingState({ progress, message, statusMessage }: AILoadingStateProps) {
  const progressPercent = Math.min(100, Math.max(0, progress));
  const displayMessage = message || 'Loading AI system...';

  return (
    <div
      className="ai-loading-state"
      role="status"
      aria-live="polite"
      aria-label={`Loading AI system: ${progressPercent}% complete`}
    >
      {/* Loading spinner */}
      <div className="loading-spinner" aria-hidden="true">
        <svg
          className="spinner-svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="spinner-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <h3 className="loading-title">Setting up AI</h3>

      {/* Main message */}
      {message && <p className="loading-message">{displayMessage}</p>}

      {/* Progress bar */}
      <div className="progress-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Progress percentage */}
      <p className="progress-text" aria-live="polite">
        {Math.round(progressPercent)}%
      </p>

      {/* Status message */}
      {statusMessage && (
        <p className="status-message">{statusMessage}</p>
      )}

      {/* Privacy note */}
      <div className="privacy-note">
        <svg
          className="privacy-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Models download once and stay on your device</span>
      </div>
    </div>
  );
}
