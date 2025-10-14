/**
 * TanStack Query Configuration
 *
 * This file configures the QueryClient for data fetching and caching.
 * TanStack Query (React Query) provides automatic caching, background refetching,
 * and optimistic updates even for local IndexedDB data.
 *
 * Features:
 * - Automatic request deduplication
 * - Background refetching
 * - Cache management
 * - Optimistic updates
 * - Retry logic
 * - DevTools integration (development only)
 *
 * @see https://tanstack.com/query/latest/docs/react/overview
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Global QueryClient instance
 *
 * Configured with sensible defaults for a local-first application.
 * Since we're primarily working with IndexedDB (Dexie), we use:
 * - Moderate staleTime: Data is considered fresh for 5 minutes
 * - Extended cacheTime: Cached data persists for 30 minutes
 * - Disabled window focus refetching: Local data doesn't change on focus
 * - Limited retries: One retry for transient failures
 *
 * These settings can be overridden per-query as needed.
 *
 * Usage:
 * ```tsx
 * import { queryClient } from '@/lib/query';
 * import { QueryClientProvider } from '@tanstack/react-query';
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       Your app
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * staleTime: How long data is considered fresh (5 minutes)
       * Queries won't refetch during this time unless explicitly invalidated
       */
      staleTime: 1000 * 60 * 5,

      /**
       * gcTime: How long unused/inactive cache data remains in memory (30 minutes)
       * Previously called cacheTime in older versions
       */
      gcTime: 1000 * 60 * 30,

      /**
       * refetchOnWindowFocus: Disabled for local-first data
       * IndexedDB data doesn't change when window gains focus
       * Enable this if/when adding remote API calls
       */
      refetchOnWindowFocus: false,

      /**
       * refetchOnReconnect: Disabled for local-first data
       * Enable this when integrating with remote APIs
       */
      refetchOnReconnect: false,

      /**
       * retry: Retry failed queries once
       * Useful for transient failures (network, temporary locks, etc.)
       */
      retry: 1,

      /**
       * retryDelay: Exponential backoff for retries
       * First retry after ~1000ms, second after ~2000ms, etc.
       */
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    mutations: {
      /**
       * retry: Don't retry mutations by default
       * Mutations should be explicit and user-initiated
       * Override per-mutation if needed
       */
      retry: false,
    },
  },
})

/**
 * Type helper for query keys
 *
 * Use this to create type-safe query keys for your queries.
 * This pattern helps prevent typos and makes refactoring easier.
 *
 * Example:
 * const queryKeys = {
 *   memories: {
 *     all: ['memories'] as const,
 *     lists: () => [...queryKeys.memories.all, 'list'] as const,
 *     list: (filters: string) => [...queryKeys.memories.lists(), filters] as const,
 *     details: () => [...queryKeys.memories.all, 'detail'] as const,
 *     detail: (id: number) => [...queryKeys.memories.details(), id] as const,
 *   },
 * }
 */
export type QueryKey = readonly unknown[]

/**
 * Query client instance export for type inference
 */
export type QueryClientInstance = typeof queryClient
