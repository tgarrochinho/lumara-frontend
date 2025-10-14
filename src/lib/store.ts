/**
 * Zustand Store Configuration
 *
 * This file sets up the global state management using Zustand.
 * Zustand provides a minimal, hook-based API for state management without
 * requiring providers or excessive boilerplate.
 *
 * Features:
 * - TypeScript support with full type inference
 * - Redux DevTools integration for debugging
 * - No provider wrapping needed
 * - Selective re-renders (components only re-render when their selected state changes)
 *
 * @see https://github.com/pmndrs/zustand
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

/**
 * UI State Slice
 *
 * Manages global UI state such as theme, sidebar visibility, modals, etc.
 * This demonstrates a common pattern for organizing related state and actions.
 */
interface UIState {
  /** Current theme mode */
  theme: 'light' | 'dark' | 'system'
  /** Whether the sidebar is currently open */
  sidebarOpen: boolean
  /** Whether a modal is currently displayed */
  modalOpen: boolean
  /** Optional modal content identifier */
  modalContent: string | null
}

interface UIActions {
  /** Set the theme mode */
  setTheme: (theme: UIState['theme']) => void
  /** Toggle sidebar open/closed state */
  toggleSidebar: () => void
  /** Open sidebar */
  openSidebar: () => void
  /** Close sidebar */
  closeSidebar: () => void
  /** Open a modal with optional content */
  openModal: (content?: string) => void
  /** Close the currently open modal */
  closeModal: () => void
}

/**
 * Example Counter Slice
 *
 * A simple counter to demonstrate basic state updates and actions.
 * This can be removed once you add your actual application state.
 */
interface CounterState {
  /** Current counter value */
  count: number
}

interface CounterActions {
  /** Increment counter by 1 */
  increment: () => void
  /** Decrement counter by 1 */
  decrement: () => void
  /** Reset counter to 0 */
  reset: () => void
  /** Set counter to a specific value */
  setCount: (count: number) => void
}

/**
 * Combined App State
 *
 * This interface combines all state slices and their actions.
 * As your app grows, you can organize state into logical slices
 * and combine them here.
 */
export interface AppState
  extends UIState,
    UIActions,
    CounterState,
    CounterActions {}

/**
 * Zustand Store Hook
 *
 * Usage in components:
 *
 * @example
 * // Select specific state (component only re-renders when this value changes)
 * const count = useStore((state) => state.count);
 * const increment = useStore((state) => state.increment);
 *
 * @example
 * // Select multiple values
 * const { theme, setTheme } = useStore((state) => ({
 *   theme: state.theme,
 *   setTheme: state.setTheme
 * }));
 *
 * @example
 * // Access entire state (careful: re-renders on any state change)
 * const state = useStore();
 */
export const useStore = create<AppState>()(
  devtools(
    set => ({
      // UI State
      theme: 'system',
      sidebarOpen: false,
      modalOpen: false,
      modalContent: null,

      // UI Actions
      setTheme: theme => set({ theme }, false, 'setTheme'),

      toggleSidebar: () =>
        set(
          state => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'toggleSidebar'
        ),

      openSidebar: () => set({ sidebarOpen: true }, false, 'openSidebar'),

      closeSidebar: () => set({ sidebarOpen: false }, false, 'closeSidebar'),

      openModal: content =>
        set(
          { modalOpen: true, modalContent: content || null },
          false,
          'openModal'
        ),

      closeModal: () =>
        set({ modalOpen: false, modalContent: null }, false, 'closeModal'),

      // Counter State
      count: 0,

      // Counter Actions
      increment: () =>
        set(state => ({ count: state.count + 1 }), false, 'increment'),

      decrement: () =>
        set(state => ({ count: state.count - 1 }), false, 'decrement'),

      reset: () => set({ count: 0 }, false, 'reset'),

      setCount: count => set({ count }, false, 'setCount'),
    }),
    {
      name: 'lumara-store',
      enabled: import.meta.env.DEV, // Only enable in development
    }
  )
)

/**
 * Selector Hooks (Optional Pattern)
 *
 * You can create custom hooks for commonly used state selections.
 * This can improve code reusability and readability.
 *
 * @example
 * const count = useCount();
 * const increment = useCounterActions();
 */

/** Get the current count value */
export const useCount = () => useStore(state => state.count)

/** Get all counter actions */
export const useCounterActions = () =>
  useStore(
    useShallow(state => ({
      increment: state.increment,
      decrement: state.decrement,
      reset: state.reset,
      setCount: state.setCount,
    }))
  )

/** Get the current theme */
export const useTheme = () => useStore(state => state.theme)

/** Get all UI actions */
export const useUIActions = () =>
  useStore(
    useShallow(state => ({
      setTheme: state.setTheme,
      toggleSidebar: state.toggleSidebar,
      openSidebar: state.openSidebar,
      closeSidebar: state.closeSidebar,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }))
  )

/** Get sidebar state */
export const useSidebar = () =>
  useStore(
    useShallow(state => ({
      isOpen: state.sidebarOpen,
      toggle: state.toggleSidebar,
      open: state.openSidebar,
      close: state.closeSidebar,
    }))
  )

/** Get modal state */
export const useModal = () =>
  useStore(
    useShallow(state => ({
      isOpen: state.modalOpen,
      content: state.modalContent,
      open: state.openModal,
      close: state.closeModal,
    }))
  )
