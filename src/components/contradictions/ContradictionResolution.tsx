/**
 * Contradiction Resolution Component
 *
 * Modal showing side-by-side comparison of contradicting memories.
 * Provides resolution options: Keep Both, Replace, or Keep Original.
 */

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Memory } from '@/lib/db';
import { type ContradictionResult } from '@/lib/ai/utils/contradiction';
import { deleteMemory } from '@/lib/db/memories';

export interface ContradictionResolutionProps {
  contradictions: ContradictionResult[];
  newMemory: Memory;
  onResolve: (action: 'keep-both' | 'replace' | 'keep-original') => void;
  onClose: () => void;
}

/**
 * Contradiction resolution modal
 *
 * @param props - Contradictions, new memory, and action handlers
 * @returns Modal with side-by-side comparison and resolution options
 */
export function ContradictionResolution({
  contradictions,
  newMemory,
  onResolve,
  onClose,
}: ContradictionResolutionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isResolving, setIsResolving] = useState(false);

  const currentContradiction = contradictions[selectedIndex];

  // Get the existing memory that contradicts
  const existingMemory = useLiveQuery(
    () => db.memories.get(Number(currentContradiction?.memory2Id)),
    [currentContradiction?.memory2Id]
  );

  const handleResolve = async (action: 'keep-both' | 'replace' | 'keep-original') => {
    setIsResolving(true);

    try {
      if (action === 'replace' && existingMemory) {
        // Delete the old memory, keep the new one
        await deleteMemory(existingMemory.id!);
      } else if (action === 'keep-original') {
        // Delete the new memory, keep the old one
        await deleteMemory(newMemory.id!);
      }
      // 'keep-both' requires no action

      onResolve(action);
    } catch (error) {
      console.error('Failed to resolve contradiction:', error);
      alert('Failed to resolve. Please try again.');
    } finally {
      setIsResolving(false);
    }
  };

  if (!currentContradiction || !existingMemory) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Resolve Contradiction
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {contradictions.length > 1 && (
                  <span>
                    Viewing {selectedIndex + 1} of {contradictions.length} contradictions
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-yellow-800">
              {currentContradiction.confidence}% Confidence
            </span>
            <span className="text-sm text-yellow-700">• {currentContradiction.explanation}</span>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Existing Memory */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Existing Memory</h3>
                <span className="text-xs text-gray-500">
                  {existingMemory.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {existingMemory.content}
                </p>
              </div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {existingMemory.type}
                </span>
                {existingMemory.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* New Memory */}
            <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-blue-900">New Memory</h3>
                <span className="text-xs text-blue-600">Just created</span>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {newMemory.content}
                </p>
              </div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {newMemory.type}
                </span>
                {newMemory.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation (if multiple contradictions) */}
          {contradictions.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {contradictions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === selectedIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View contradiction ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleResolve('keep-both')}
              disabled={isResolving}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Keep Both
            </button>
            <button
              onClick={() => handleResolve('keep-original')}
              disabled={isResolving}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Keep Original
            </button>
            <button
              onClick={() => handleResolve('replace')}
              disabled={isResolving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isResolving && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              Replace with New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
