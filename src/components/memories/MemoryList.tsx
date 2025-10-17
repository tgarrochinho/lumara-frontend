/**
 * Memory List Component
 *
 * Displays all saved memories with search and filtering capabilities.
 * Uses semantic search and type filters.
 */

import { useMemorySearch } from '../../hooks/useMemorySearch';
import { MemoryCard } from './MemoryCard';
import { MemoryFilters } from './MemoryFilters';
import { EmptyState } from '../layout/EmptyState';

/**
 * Memory list container with filters
 *
 * Displays memories with search and type filtering.
 * Automatically updates when memories change.
 */
export function MemoryList() {
  const {
    memories,
    isSearching,
    searchQuery,
    filterType,
    setSearchQuery,
    setFilterType,
    clearFilters,
  } = useMemorySearch();

  const hasActiveFilters = searchQuery.trim() !== '' || filterType !== 'all';

  return (
    <div className="h-full flex flex-col">
      {/* Filters Section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <MemoryFilters
          searchQuery={searchQuery}
          filterType={filterType}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterType}
          onClearFilters={clearFilters}
          memoryCount={memories.length}
          isSearching={isSearching}
        />
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto">
        {memories.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            {hasActiveFilters ? (
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">No memories found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        ) : (
          <div
            className="p-4 space-y-4"
            data-testid="memory-list"
          >
            <div className="grid grid-cols-1 gap-4">
              {memories.map(memory => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
