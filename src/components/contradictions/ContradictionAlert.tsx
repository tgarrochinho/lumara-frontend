/**
 * Contradiction Alert Component
 *
 * Displays an inline warning when contradictions are detected.
 * Shows summary and provides action to view details.
 */

import { type ContradictionResult } from '@/lib/ai/utils/contradiction';

export interface ContradictionAlertProps {
  contradictions: ContradictionResult[];
  onReview: () => void;
  onDismiss: () => void;
}

/**
 * Inline contradiction warning banner
 *
 * @param props - Contradictions and action handlers
 * @returns Alert banner with action buttons
 *
 * @example
 * ```tsx
 * {contradictions.length > 0 && (
 *   <ContradictionAlert
 *     contradictions={contradictions}
 *     onReview={() => setShowResolution(true)}
 *     onDismiss={clearContradictions}
 *   />
 * )}
 * ```
 */
export function ContradictionAlert({
  contradictions,
  onReview,
  onDismiss,
}: ContradictionAlertProps) {
  const count = contradictions.length;
  const highConfidence = contradictions.filter(c => c.confidence >= 70);

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            {count === 1 ? 'Contradiction Detected' : `${count} Contradictions Detected`}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              This new memory may contradict {count === 1 ? 'an existing memory' : `${count} existing memories`}.
              {highConfidence.length > 0 && (
                <span className="font-medium">
                  {' '}
                  {highConfidence.length} {highConfidence.length === 1 ? 'is' : 'are'} high confidence.
                </span>
              )}
            </p>
            {contradictions[0] && (
              <p className="mt-1 text-xs">
                "{contradictions[0].explanation}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onReview}
              className="bg-yellow-100 px-3 py-1.5 border border-yellow-300 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Review Contradictions
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-sm font-medium text-yellow-700 hover:text-yellow-900 focus:outline-none"
            >
              Keep Both Anyway
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="ml-auto pl-3">
          <button
            onClick={onDismiss}
            className="inline-flex rounded-md text-yellow-400 hover:text-yellow-500 focus:outline-none"
            aria-label="Dismiss"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
