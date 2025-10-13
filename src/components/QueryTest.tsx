/**
 * QueryTest Component
 *
 * Demonstrates TanStack Query integration with Dexie.
 * Shows query caching, loading states, error handling, and cache invalidation.
 *
 * This component will be removed after Issue #8 is verified complete.
 */

import {
  useDatabaseInfo,
  useRefreshDatabase,
  useUpdateDatabaseCache,
} from '@/hooks/useExampleQuery'

export function QueryTest() {
  const { data, isLoading, error, refetch, isFetching, dataUpdatedAt } =
    useDatabaseInfo()
  const { mutate: refresh, isPending: isRefreshing } = useRefreshDatabase()
  const updateCache = useUpdateDatabaseCache()

  if (isLoading) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#1a1a1a',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <h3>Loading Database Info with TanStack Query...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#ff000020',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <h3 style={{ color: '#ff6b6b' }}>Query Error</h3>
        <p>{error.message}</p>
        <button
          onClick={() => refetch()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#ff6b6b',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        background: '#0066ff20',
        borderRadius: '8px',
        margin: '20px 0',
      }}
    >
      <h3 style={{ color: '#4dabf7', marginBottom: '16px' }}>
        TanStack Query + Dexie Integration
      </h3>

      {data && (
        <div
          style={{
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '16px',
          }}
        >
          <p>
            <strong>Database Name:</strong> {data.name}
          </p>
          <p>
            <strong>Version:</strong> {data.version}
          </p>
          <p>
            <strong>Is Open:</strong> {data.isOpen ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Tables:</strong>{' '}
            {data.tables.length > 0 ? data.tables.join(', ') : '(empty schema)'}
          </p>
          <p style={{ marginTop: '8px', opacity: 0.7, fontSize: '12px' }}>
            Last updated:{' '}
            {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            padding: '8px 16px',
            background: isFetching ? '#666' : '#4dabf7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {isFetching ? 'Refetching...' : 'Refetch Data'}
        </button>

        <button
          onClick={() => refresh()}
          disabled={isRefreshing}
          style={{
            padding: '8px 16px',
            background: isRefreshing ? '#666' : '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {isRefreshing ? 'Invalidating...' : 'Invalidate Cache'}
        </button>

        <button
          onClick={() =>
            updateCache({
              name: 'UpdatedDB',
              version: 99,
              isOpen: true,
              tables: ['test'],
            })
          }
          style={{
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Test Cache Update
        </button>
      </div>

      <div
        style={{
          fontSize: '12px',
          opacity: 0.7,
          padding: '12px',
          background: '#00000020',
          borderRadius: '4px',
        }}
      >
        <p style={{ marginBottom: '4px' }}>
          <strong>Try this:</strong>
        </p>
        <ol style={{ marginLeft: '20px', lineHeight: '1.6' }}>
          <li>Click "Refetch Data" - data refetches immediately</li>
          <li>Click "Invalidate Cache" - marks cache stale & refetches</li>
          <li>Click "Test Cache Update" - optimistically updates cache</li>
          <li>
            Unmount/remount this component - data loads instantly from cache
          </li>
        </ol>
        <p style={{ marginTop: '8px' }}>
          Open React Query DevTools (bottom toolbar) to see cache state
        </p>
      </div>
    </div>
  )
}
