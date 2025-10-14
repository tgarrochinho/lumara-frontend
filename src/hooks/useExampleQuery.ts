/**
 * Example Query Hook
 *
 * This file demonstrates how to integrate TanStack Query with Dexie.
 * It provides a pattern for creating query hooks that fetch data from IndexedDB.
 *
 * This example can be used as a template for creating actual data fetching hooks
 * for memories, reflections, tags, and other entities in the application.
 *
 * Key concepts demonstrated:
 * - Using useQuery for data fetching
 * - Query key structure for cache management
 * - Integration with Dexie database
 * - TypeScript typing for query results
 * - Error handling
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/queries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'

/**
 * Database info type returned by the query
 */
export interface DatabaseInfo {
  name: string
  version: number
  isOpen: boolean
  tables: string[]
}

/**
 * Query Keys for Database Info
 *
 * Using a centralized query key structure helps with:
 * - Type safety
 * - Cache invalidation
 * - Preventing typos
 */
export const databaseQueryKeys = {
  all: ['database'] as const,
  info: () => [...databaseQueryKeys.all, 'info'] as const,
}

/**
 * Fetch database information from Dexie
 *
 * This is the query function that TanStack Query will call.
 * It returns the database info or throws an error if something goes wrong.
 */
async function fetchDatabaseInfo(): Promise<DatabaseInfo> {
  try {
    const info: DatabaseInfo = {
      name: db.name,
      version: db.verno,
      isOpen: db.isOpen(),
      tables: db.tables.map(t => t.name),
    }

    return info
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[useExampleQuery] Error fetching database info:', error)
    }
    throw error
  }
}

/**
 * Hook to fetch database information
 *
 * This hook demonstrates the basic pattern for using TanStack Query with Dexie.
 * It automatically handles:
 * - Loading state
 * - Error state
 * - Caching
 * - Background refetching
 * - Automatic retries
 *
 * Usage:
 * ```typescript
 * function MyComponent() {
 *   const { data, isLoading, error, refetch } = useDatabaseInfo();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>Database: {data.name}</div>;
 * }
 * ```
 *
 * @returns Query result with database info, loading state, and error state
 */
export function useDatabaseInfo() {
  return useQuery({
    queryKey: databaseQueryKeys.info(),
    queryFn: fetchDatabaseInfo,
    // Override default options if needed
    staleTime: 1000 * 60 * 5, // 5 minutes (same as default)
  })
}

/**
 * Example: Simulated mutation for testing cache updates
 *
 * This demonstrates how to use mutations with TanStack Query.
 * In a real application, this might be adding a memory, updating a reflection, etc.
 *
 * Usage:
 * ```typescript
 * function MyComponent() {
 *   const { mutate, isPending } = useRefreshDatabase();
 *
 *   return (
 *     <button onClick={() => mutate()} disabled={isPending}>
 *       Refresh Database Info
 *     </button>
 *   );
 * }
 * ```
 */
export function useRefreshDatabase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Simulate a database operation that would trigger a refresh
      if (import.meta.env.DEV) {
        console.log('[useExampleQuery] Refreshing database info...')
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    },
    onSuccess: () => {
      // Invalidate and refetch database info query
      queryClient.invalidateQueries({
        queryKey: databaseQueryKeys.info(),
      })
      if (import.meta.env.DEV) {
        console.log(
          '[useExampleQuery] Database info invalidated, refetch triggered'
        )
      }
    },
    onError: error => {
      if (import.meta.env.DEV) {
        console.error('[useExampleQuery] Error refreshing database:', error)
      }
    },
  })
}

/**
 * Example: Manual cache update
 *
 * This demonstrates how to manually update the cache without refetching.
 * Useful for optimistic updates or when you know the new data.
 *
 * Usage:
 * ```typescript
 * const updateDbCache = useUpdateDatabaseCache();
 *
 * // Update cache with new data
 * updateDbCache({ name: 'NewDB', version: 2, isOpen: true, tables: ['users'] });
 * ```
 */
export function useUpdateDatabaseCache() {
  const queryClient = useQueryClient()

  return (newData: DatabaseInfo) => {
    queryClient.setQueryData(databaseQueryKeys.info(), newData)
    if (import.meta.env.DEV) {
      console.log('[useExampleQuery] Cache updated with new data:', newData)
    }
  }
}

/**
 * Example pattern for a more complex query with parameters
 *
 * This demonstrates how you might structure a query that takes parameters,
 * such as filtering or pagination.
 *
 * In a real application, this might be:
 * - useMemories(filters)
 * - useReflections(memoryId)
 * - useTags(searchTerm)
 *
 * @param enabled - Whether the query should run (useful for conditional fetching)
 */
export function useDatabaseInfoWithOptions(enabled = true) {
  return useQuery({
    queryKey: databaseQueryKeys.info(),
    queryFn: fetchDatabaseInfo,
    enabled, // Only run query if enabled is true
    // You can add more options here:
    // staleTime, gcTime, refetchInterval, etc.
  })
}
