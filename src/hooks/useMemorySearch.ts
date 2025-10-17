/**
 * useMemorySearch Hook
 *
 * React hook for semantic search and filtering of memories.
 * Combines text search with type filtering.
 */

import { useState, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Memory, type MemoryType } from '../lib/db';
import { searchMemories } from '../lib/db/memories';

export interface UseMemorySearchReturn {
  memories: Memory[];
  isSearching: boolean;
  searchQuery: string;
  filterType: MemoryType | 'all';
  setSearchQuery: (query: string) => void;
  setFilterType: (type: MemoryType | 'all') => void;
  clearFilters: () => void;
}

/**
 * Hook for searching and filtering memories
 *
 * @param debounceMs - Debounce delay for search (default: 300ms)
 * @returns Search state and actions
 *
 * @example
 * ```tsx
 * function MemoryList() {
 *   const { memories, searchQuery, setSearchQuery, filterType, setFilterType } = useMemorySearch();
 *
 *   return (
 *     <div>
 *       <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
 *       <select value={filterType} onChange={e => setFilterType(e.target.value as MemoryType)}>
 *         <option value="all">All</option>
 *         <option value="knowledge">Knowledge</option>
 *       </select>
 *       {memories.map(m => <MemoryCard key={m.id} memory={m} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMemorySearch(debounceMs = 300): UseMemorySearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MemoryType | 'all'>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Memory[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Get all memories from DB (reactive with Dexie live queries)
  const allMemories = useLiveQuery(
    () => db.memories.orderBy('createdAt').reverse().toArray(),
    []
  );

  // Perform semantic search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    searchMemories(debouncedQuery, 0.3, 50) // Low threshold for better recall
      .then(results => {
        setSearchResults(results);
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Search failed:', error);
        setSearchResults([]);
        setIsSearching(false);
      });
  }, [debouncedQuery]);

  // Determine which memories to show
  const memories = (() => {
    // If searching, use search results
    if (debouncedQuery.trim() && searchResults.length > 0) {
      const filtered = filterType === 'all'
        ? searchResults
        : searchResults.filter(m => m.type === filterType);
      return filtered;
    }

    // Otherwise use all memories
    const base = allMemories || [];

    // Apply type filter
    if (filterType === 'all') {
      return base;
    }

    return base.filter(m => m.type === filterType);
  })();

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterType('all');
  }, []);

  return {
    memories,
    isSearching,
    searchQuery,
    filterType,
    setSearchQuery,
    setFilterType,
    clearFilters,
  };
}
