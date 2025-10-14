/**
 * Memory Card Component
 *
 * Displays individual memory with type badge, content, and metadata.
 * Supports expand/collapse for long content.
 */

import { useState } from 'react';
import type { Memory } from '../../lib/db';
import { formatRelativeTime } from '../../lib/utils/date';

interface MemoryCardProps {
  memory: Memory;
  similarity?: number;
}

const TYPE_COLORS = {
  knowledge: 'bg-blue-100 text-blue-800',
  experience: 'bg-green-100 text-green-800',
  method: 'bg-purple-100 text-purple-800',
};

/**
 * Memory card component
 *
 * Displays memory content with expand/collapse for long text.
 * Shows type badge, timestamp, and optional tags.
 */
export function MemoryCard({ memory, similarity }: MemoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = memory.content.length > 200;
  const displayContent = isLong && !isExpanded
    ? `${memory.content.slice(0, 200)}...`
    : memory.content;

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      aria-label={`${memory.type} memory`}
      tabIndex={0}
      data-testid="memory-card"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            TYPE_COLORS[memory.type]
          }`}
        >
          {memory.type}
        </span>
        <time
          className="text-xs text-gray-500"
          dateTime={memory.createdAt.toISOString()}
        >
          {formatRelativeTime(memory.createdAt)}
        </time>
      </header>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{displayContent}</p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Similarity Score (if present) */}
      {similarity !== undefined && (
        <div className="mb-2">
          <span className="text-xs text-gray-500">
            {Math.round(similarity * 100)}% match
          </span>
        </div>
      )}

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <footer className="flex flex-wrap gap-2">
          {memory.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
