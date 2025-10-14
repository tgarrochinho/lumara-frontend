/**
 * AISetup Component
 *
 * Setup wizard component that guides users through AI initialization.
 * Displays loading, success, and error states with appropriate UI.
 */

import { useEffect } from 'react';
import { useAIStatus } from '@/hooks/useAIStatus';
import { AILoadingState } from './AILoadingState';
import { AIErrorState } from './AIErrorState';
import type { AISetupProps } from './types';

/**
 * AI setup wizard component
 *
 * Handles the complete AI initialization flow with visual feedback.
 * Shows progress during model download and provides retry on error.
 *
 * @example
 * ```tsx
 * <AISetup
 *   onComplete={() => console.log('AI ready!')}
 *   onError={(err) => console.error('Setup failed:', err)}
 * />
 * ```
 */
export function AISetup({
  autoInitialize = true,
  onComplete,
  onError,
  className = '',
}: AISetupProps) {
  const { status, progress, progressMessage, error, retry } = useAIStatus(autoInitialize);

  // Notify on completion
  useEffect(() => {
    if (status === 'ready' && onComplete) {
      onComplete();
    }
  }, [status, onComplete]);

  // Notify on error
  useEffect(() => {
    if (status === 'error' && error && onError) {
      onError(error);
    }
  }, [status, error, onError]);

  // Success state
  if (status === 'ready') {
    return (
      <div className={`ai-setup-success ${className}`}>
        {/* Success icon */}
        <div className="success-icon" aria-hidden="true">
          <svg
            width="64"
            height="64"
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
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Success message */}
        <h2 className="success-title">AI Ready!</h2>
        <p className="success-message">
          Everything runs on your device. Your privacy is protected.
        </p>

        {/* Feature highlights */}
        <div className="feature-list">
          <div className="feature-item">
            <svg
              className="feature-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>100% on-device processing</span>
          </div>
          <div className="feature-item">
            <svg
              className="feature-icon"
              width="20"
              height="20"
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
            </svg>
            <span>Your data never leaves your browser</span>
          </div>
          <div className="feature-item">
            <svg
              className="feature-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Fast and responsive</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className={className}>
        <AIErrorState error={error} onRetry={retry} />
      </div>
    );
  }

  // Loading/Initializing state
  if (status === 'initializing') {
    return (
      <div className={className}>
        <AILoadingState
          progress={progress}
          message={progressMessage}
          statusMessage={
            progress < 20
              ? 'Connecting to AI provider...'
              : progress < 90
                ? 'This may take a minute on first load...'
                : 'Almost ready...'
          }
        />
      </div>
    );
  }

  // Degraded state (still usable but with issues)
  if (status === 'degraded') {
    return (
      <div className={`ai-setup-degraded ${className}`}>
        <div className="warning-icon" aria-hidden="true">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="degraded-title">AI Running with Limited Functionality</h2>
        <p className="degraded-message">
          The AI system is operational but may experience reduced performance or reliability.
        </p>
        <button onClick={retry} className="retry-button" type="button">
          Reinitialize
        </button>
      </div>
    );
  }

  // Uninitialized state (shouldn't normally be visible with autoInitialize=true)
  return (
    <div className={`ai-setup-uninitialized ${className}`}>
      <h2>AI Not Initialized</h2>
      <p>Click to start AI initialization</p>
      <button onClick={retry} className="init-button" type="button">
        Initialize AI
      </button>
    </div>
  );
}
