/**
 * Memory Filters Component
 *
 * Provides search and type filtering UI for memories.
 * Includes search bar and type filter buttons.
 */

import { type MemoryType } from '@/lib/db';

export interface MemoryFiltersProps {
  searchQuery: string;
  filterType: MemoryType | 'all';
  onSearchChange: (query: string) => void;
  onFilterChange: (type: MemoryType | 'all') => void;
  onClearFilters: () => void;
  memoryCount: number;
  isSearching?: boolean;
}

const TYPE_OPTIONS: Array<{ value: MemoryType | 'all'; label: string; icon: string }> = [
  { value: 'all', label: 'All', icon: '📚' },
  { value: 'knowledge', label: 'Knowledge', icon: '🧠' },
  { value: 'experience', label: 'Experience', icon: '📅' },
  { value: 'method', label: 'Method', icon: '📋' },
];

/**
 * Memory filters UI component
 *
 * @param props - Filter props
 * @returns Filter UI with search and type selection
 *
 * @example
 * ```tsx
 * <MemoryFilters
 *   searchQuery={searchQuery}
 *   filterType={filterType}
 *   onSearchChange={setSearchQuery}
 *   onFilterChange={setFilterType}
 *   onClearFilters={clearFilters}
 *   memoryCount={memories.length}
 *   isSearching={isSearching}
 * />
 * ```
 */
export function MemoryFilters({
  searchQuery,
  filterType,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  memoryCount,
  isSearching = false,
}: MemoryFiltersProps) {
  const hasActiveFilters = searchQuery.trim() !== '' || filterType !== 'all';

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search memories..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search memories"
        />
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Clear Search Button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Searching Indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-2">
        {TYPE_OPTIONS.map((option) => {
          const isActive = filterType === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }
                border
              `}
              aria-label={`Filter by ${option.label}`}
              aria-pressed={isActive}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          );
        })}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-sm text-gray-600 hover:text-gray-800 underline"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500">
        {isSearching ? (
          <span>Searching...</span>
        ) : (
          <span>
            {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
            {hasActiveFilters && ' found'}
          </span>
        )}
      </div>
    </div>
  );
}
