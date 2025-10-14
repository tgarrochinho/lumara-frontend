/**
 * Memory List Component
 *
 * Displays all saved memories in reverse chronological order.
 * Uses Dexie live queries for automatic reactivity.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { MemoryCard } from './MemoryCard';
import { EmptyState } from '../layout/EmptyState';

/**
 * Memory list container
 *
 * Displays memories with automatic updates via Dexie live queries.
 * Shows empty state when no memories exist.
 */
export function MemoryList() {
  // Dexie live query - auto re-renders on DB changes
  const memories = useLiveQuery(
    () => db.memories.orderBy('createdAt').reverse().toArray()
  );

  // Loading state
  if (!memories) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading memories...</div>
      </div>
    );
  }

  // Empty state
  if (memories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className="p-4 space-y-4 overflow-y-auto"
      data-testid="memory-list"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map(memory => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </div>
  );
}
