/**
 * AIStatus Component
 *
 * Compact status indicator showing the current state of the AI system.
 * Can be placed in navigation, headers, or anywhere status needs to be displayed.
 */

import { useAIStatus } from '@/hooks/useAIStatus';
import type { AIStatusProps } from './types';

/**
 * AI status indicator component
 *
 * Shows current AI system status with visual indicators.
 * Automatically updates based on system health.
 *
 * @example
 * ```tsx
 * // In a header or navigation
 * <AIStatus showProvider compact />
 *
 * // With click handler
 * <AIStatus onClick={() => setShowDetails(true)} />
 * ```
 */
export function AIStatus({
  showProvider = false,
  compact = false,
  className = '',
  onClick,
}: AIStatusProps) {
  const { status, provider } = useAIStatus(false); // Don't auto-initialize from status indicator

  // Status configuration
  const statusConfig = {
    uninitialized: {
      icon: 'circle',
      text: 'AI Offline',
      color: 'gray',
      ariaLabel: 'AI system is offline',
    },
    initializing: {
      icon: 'spinner',
      text: 'AI Loading...',
      color: 'blue',
      ariaLabel: 'AI system is initializing',
    },
    ready: {
      icon: 'check-circle',
      text: 'AI Ready',
      color: 'green',
      ariaLabel: 'AI system is ready',
    },
    error: {
      icon: 'x-circle',
      text: 'AI Error',
      color: 'red',
      ariaLabel: 'AI system has an error',
    },
    degraded: {
      icon: 'alert-circle',
      text: 'AI Degraded',
      color: 'yellow',
      ariaLabel: 'AI system is running with limited functionality',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`ai-status ai-status-${config.color} ${compact ? 'ai-status-compact' : ''} ${className}`}
      role="status"
      aria-label={config.ariaLabel}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Status icon */}
      <span className="status-icon" aria-hidden="true">
        {config.icon === 'circle' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
        {config.icon === 'spinner' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="status-spinner"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="32 32"
              fill="none"
            />
          </svg>
        )}
        {config.icon === 'check-circle' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {config.icon === 'x-circle' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M15 9l-6 6m0-6l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        {config.icon === 'alert-circle' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      {/* Status text */}
      {!compact && <span className="status-text">{config.text}</span>}

      {/* Provider name */}
      {showProvider && provider && (
        <span className="provider-name">{provider.name}</span>
      )}
    </div>
  );
}
