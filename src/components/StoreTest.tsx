/**
 * StoreTest Component
 *
 * A test component to verify Zustand store functionality.
 * This component demonstrates:
 * - Reading state from the store
 * - Triggering actions
 * - Component re-renders on state changes
 * - Selective state subscription
 *
 * This file can be removed once store functionality is verified.
 */

import {
  useStore,
  useCount,
  useCounterActions,
  useTheme,
  useUIActions,
} from '../lib/store'
import { useShallow } from 'zustand/react/shallow'

export function StoreTest() {
  // Method 1: Using custom selector hooks (recommended)
  const count = useCount()
  const { increment, decrement, reset } = useCounterActions()
  const theme = useTheme()
  const { setTheme } = useUIActions()

  // Method 2: Using direct store selector
  const sidebarOpen = useStore(state => state.sidebarOpen)
  const toggleSidebar = useStore(state => state.toggleSidebar)

  // Method 3: Using multiple values from store (requires useShallow to prevent infinite loops)
  const { modalOpen, openModal, closeModal } = useStore(
    useShallow(state => ({
      modalOpen: state.modalOpen,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }))
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Zustand Store Test</h1>

      {/* Counter Test */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Counter Test</h2>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Count: <strong>{count}</strong>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
          <button onClick={reset}>Reset</button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Click buttons to test state updates and re-renders
        </p>
      </section>

      {/* Theme Test */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Theme Test</h2>
        <div style={{ marginBottom: '1rem' }}>
          Current theme: <strong>{theme}</strong>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setTheme('light')}>Light</button>
          <button onClick={() => setTheme('dark')}>Dark</button>
          <button onClick={() => setTheme('system')}>System</button>
        </div>
      </section>

      {/* Sidebar Test */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Sidebar Test</h2>
        <div style={{ marginBottom: '1rem' }}>
          Sidebar is: <strong>{sidebarOpen ? 'Open' : 'Closed'}</strong>
        </div>
        <button onClick={toggleSidebar}>Toggle Sidebar</button>
      </section>

      {/* Modal Test */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Modal Test</h2>
        <div style={{ marginBottom: '1rem' }}>
          Modal is: <strong>{modalOpen ? 'Open' : 'Closed'}</strong>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => openModal('Test modal content')}>
            Open Modal
          </button>
          <button onClick={closeModal} disabled={!modalOpen}>
            Close Modal
          </button>
        </div>
      </section>

      {/* Instructions */}
      <section
        style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem' }}>Test Instructions</h3>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>Click buttons to verify state updates</li>
          <li>Check that components re-render when state changes</li>
          <li>Open Redux DevTools to see action history</li>
          <li>Verify TypeScript types work correctly</li>
        </ul>
      </section>
    </div>
  )
}
