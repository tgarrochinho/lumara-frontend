/**
 * Type definitions for AI components
 *
 * Shared types and interfaces for UI components that interact with the AI system.
 */

import type { AIError } from '@/lib/ai/error-handler';

/**
 * Props for the AILoadingState component
 */
export interface AILoadingStateProps {
  /** Loading progress percentage (0-100) */
  progress: number;

  /** Optional message to display */
  message?: string;

  /** Optional detailed status message */
  statusMessage?: string;
}

/**
 * Props for the AIErrorState component
 */
export interface AIErrorStateProps {
  /** The error that occurred */
  error: Error | AIError | null;

  /** Callback when user clicks retry button */
  onRetry: () => void;

  /** Optional custom error title */
  title?: string;

  /** Whether to show technical details (defaults to DEV mode) */
  showDetails?: boolean;
}

/**
 * Props for the AISetup component
 */
export interface AISetupProps {
  /** Whether to automatically start initialization (default: true) */
  autoInitialize?: boolean;

  /** Callback when setup completes successfully */
  onComplete?: () => void;

  /** Callback when setup fails */
  onError?: (error: Error) => void;

  /** Optional custom className for styling */
  className?: string;
}

/**
 * Props for the AIStatus component
 */
export interface AIStatusProps {
  /** Whether to show provider name (default: false) */
  showProvider?: boolean;

  /** Whether to show as compact variant (default: false) */
  compact?: boolean;

  /** Optional custom className for styling */
  className?: string;

  /** Optional click handler for the status indicator */
  onClick?: () => void;
}
