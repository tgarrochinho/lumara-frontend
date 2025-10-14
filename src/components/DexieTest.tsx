/**
 * DexieTest Component
 *
 * Temporary test component to verify Dexie database initialization.
 * This component will be removed after Issue #6 is verified complete.
 */

import { useEffect, useState } from 'react'
import { db } from '@/lib/db'

export function DexieTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>(
    'testing'
  )
  const [dbInfo, setDbInfo] = useState<{
    name: string
    version: number
    isOpen: boolean
    tables: string[]
  } | null>(null)

  useEffect(() => {
    const testDatabase = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('[Dexie Test] Testing database connection...')
        }

        const info = {
          name: db.name,
          version: db.verno,
          isOpen: db.isOpen(),
          tables: db.tables.map(t => t.name),
        }

        setDbInfo(info)
        setStatus('success')

        if (import.meta.env.DEV) {
          console.log('[Dexie Test] Database info:', info)
          console.log('[Dexie Test] ✓ Database initialized successfully!')
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[Dexie Test] Database initialization error:', error)
        }
        setStatus('error')
      }
    }

    testDatabase()
  }, [])

  if (status === 'testing') {
    return (
      <div
        style={{
          padding: '20px',
          background: '#1a1a1a',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <h3>Testing Dexie Database...</h3>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div
        style={{
          padding: '20px',
          background: '#ff000020',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        <h3 style={{ color: '#ff6b6b' }}>❌ Database Test Failed</h3>
        <p>Check the browser console for details.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        background: '#00ff0020',
        borderRadius: '8px',
        margin: '20px 0',
      }}
    >
      <h3 style={{ color: '#51cf66' }}>✓ Dexie Database Initialized</h3>
      {dbInfo && (
        <div
          style={{
            fontSize: '14px',
            marginTop: '10px',
            fontFamily: 'monospace',
          }}
        >
          <p>
            <strong>Name:</strong> {dbInfo.name}
          </p>
          <p>
            <strong>Version:</strong> {dbInfo.version}
          </p>
          <p>
            <strong>Is Open:</strong> {dbInfo.isOpen ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Tables:</strong>{' '}
            {dbInfo.tables.length > 0
              ? dbInfo.tables.join(', ')
              : '(empty schema)'}
          </p>
        </div>
      )}
      <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
        Check Browser DevTools → Application → IndexedDB to see "LumaraDB"
      </p>
    </div>
  )
}
