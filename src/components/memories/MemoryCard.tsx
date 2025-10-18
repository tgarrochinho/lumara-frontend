/**
 * Memory Card Component
 *
 * Displays individual memory with type badge, content, metadata, and actions.
 * Supports expand/collapse for long content and edit/delete operations.
 */

import { useState } from 'react';
import type { Memory } from '../../lib/db';
import { formatRelativeTime } from '../../lib/utils/date';
import { MemoryActions } from './MemoryActions';
import { updateMemory, deleteMemory } from '../../lib/db/memories';

interface MemoryCardProps {
  memory: Memory;
  similarity?: number;
}

const TYPE_COLORS = {
  knowledge: 'bg-blue-100 text-blue-800',
  experience: 'bg-green-100 text-green-800',
  method: 'bg-purple-100 text-purple-800',
};

const TYPE_ICONS = {
  knowledge: '🧠',
  experience: '📅',
  method: '📋',
};

/**
 * Memory card component
 *
 * Displays memory content with expand/collapse for long text.
 * Shows type badge, timestamp, optional tags, and action menu.
 */
export function MemoryCard({ memory, similarity }: MemoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = memory.content.length > 200;
  const displayContent = isLong && !isExpanded
    ? `${memory.content.slice(0, 200)}...`
    : memory.content;

  const handleEdit = async (id: number, updates: Partial<Memory>) => {
    await updateMemory(id, updates);
  };

  const handleDelete = async (id: number) => {
    await deleteMemory(id);
  };

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
      aria-label={`${memory.type} memory`}
      data-testid="memory-card"
    >
      {/* Header */}
      <header className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            TYPE_COLORS[memory.type]
          }`}
        >
          {TYPE_ICONS[memory.type]} {memory.type}
        </span>
        <time
          className="text-xs text-gray-500"
          dateTime={memory.createdAt.toISOString()}
        >
          {formatRelativeTime(memory.createdAt)}
        </time>

        {/* Similarity Score (if searching) */}
        {similarity !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {Math.round(similarity * 100)}% match
          </span>
        )}

        {/* Actions Menu */}
        <div className="ml-auto">
          <MemoryActions
            memory={memory}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </header>

      {/* Content */}
      <div>
        <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap">{displayContent}</p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-xs mt-1 hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Tags (if any) */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {memory.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
