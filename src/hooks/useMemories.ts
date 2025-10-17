/**
 * useMemories Hook
 *
 * React hook for memory CRUD operations with live updates.
 * Uses Dexie's useLiveQuery for reactive database changes.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db, type Memory, type MemoryType } from '../lib/db';
import {
  createMemory as dbCreateMemory,
  updateMemory as dbUpdateMemory,
  deleteMemory as dbDeleteMemory,
  searchMemories as dbSearchMemories,
  filterMemories as dbFilterMemories,
} from '../lib/db/memories';

export interface UseMemoriesOptions {
  filter?: MemoryType | 'all';
  searchQuery?: string;
}

export interface UseMemoriesReturn {
  memories: Memory[] | undefined;
  isLoading: boolean;
  createMemory: (data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'embedding'>) => Promise<number>;
  updateMemory: (id: number, data: Partial<Memory>) => Promise<void>;
  deleteMemory: (id: number) => Promise<void>;
  searchMemories: (query: string) => Promise<Array<Memory & { score: number }>>;
}

/**
 * React hook for memory CRUD operations with live updates
 *
 * Uses Dexie's useLiveQuery for reactive updates - any database
 * changes automatically trigger re-renders.
 *
 * @param options - Filter and search options
 * @returns Memory list and CRUD operations
 *
 * @example
 * ```tsx
 * function MemoryList() {
 *   const { memories, createMemory, isLoading } = useMemories();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       {memories?.map(m => <div key={m.id}>{m.content}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMemories(options: UseMemoriesOptions = {}): UseMemoriesReturn {
  const { filter, searchQuery } = options;

  // Live query - automatically re-renders on DB changes
  const memories = useLiveQuery(async () => {
    if (searchQuery) {
      const results = await dbSearchMemories(searchQuery);
      return results;
    }

    if (filter && filter !== 'all') {
      return dbFilterMemories(filter);
    }

    return db.memories.orderBy('createdAt').reverse().toArray();
  }, [filter, searchQuery]);

  const createMemory = useCallback(
    async (data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'embedding'>) => {
      return dbCreateMemory(data);
    },
    []
  );

  const updateMemory = useCallback(
    async (id: number, data: Partial<Memory>) => {
      return dbUpdateMemory(id, data);
    },
    []
  );

  const deleteMemory = useCallback(
    async (id: number) => {
      return dbDeleteMemory(id);
    },
    []
  );

  const searchMemories = useCallback(
    async (query: string) => {
      return dbSearchMemories(query);
    },
    []
  );

  return {
    memories,
    isLoading: memories === undefined,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
  };
}
