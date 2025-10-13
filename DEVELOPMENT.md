# Development Guide

This guide provides detailed information about Lumara's architecture, development patterns, and best practices for contributing to the codebase.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [State Management with Zustand](#state-management-with-zustand)
- [Server State with TanStack Query](#server-state-with-tanstack-query)
- [Database with Dexie](#database-with-dexie)
- [Component Patterns](#component-patterns)
- [Project Structure](#project-structure)
- [Path Aliases](#path-aliases)
- [Styling Guidelines](#styling-guidelines)
- [Type Safety](#type-safety)
- [Development Workflow](#development-workflow)
- [Common Patterns](#common-patterns)
- [Testing with MCP Tools](#testing-with-mcp-tools)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

Lumara follows a **local-first architecture** pattern with clear separation of concerns:

### Data Flow Layers

```
┌─────────────────────────────────────────────┐
│         UI Layer (React Components)         │
│   User interactions, rendering, animations  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      State Layer (Zustand Store)            │
│   Global app state, UI state, preferences   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│    Query Layer (TanStack Query)             │
│   Server state caching, async operations    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│     Database Layer (Dexie/IndexedDB)        │
│   Local persistence, offline-first storage  │
└─────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Offline-First**: All data is stored locally in IndexedDB before any network operations
2. **Optimistic Updates**: UI updates immediately, sync happens in background
3. **Type Safety**: Full TypeScript coverage with strict mode enabled
4. **Component Composition**: Small, reusable components following single responsibility principle
5. **Memory-Aware Design**: UI respects cognitive load (7±2 working memory limit)

### File Organization

```
src/
├── components/       # React components (presentational & container)
├── lib/              # Core library setup (store, db, query client)
├── hooks/            # Custom React hooks (queries, mutations, utilities)
├── utils/            # Pure utility functions (helpers, formatters)
├── styles/           # Global styles and Tailwind configuration
├── features/         # Feature-specific modules (future)
├── types/            # TypeScript type definitions
└── assets/           # Static assets (images, fonts, etc.)
```

## State Management with Zustand

Zustand provides minimal, hook-based state management without providers or boilerplate.

### When to Use Zustand

Use Zustand for:
- **Global UI state**: Theme, sidebar visibility, modal state
- **User preferences**: Settings that persist across sessions
- **Cross-component communication**: State needed by distant components
- **Transient app state**: Data that doesn't need persistence

### Store Implementation

Located in `src/lib/store.ts`, the store uses a slice pattern for organization:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  // UI State
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean

  // Actions
  setTheme: (theme: AppState['theme']) => void
  toggleSidebar: () => void
}

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: false,

      // Actions
      setTheme: (theme) => set({ theme }, false, 'setTheme'),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
    }),
    {
      name: 'lumara-store',
      enabled: import.meta.env.DEV, // Only in development
    }
  )
)
```

### Using the Store in Components

**Pattern 1: Selective state access** (recommended - prevents unnecessary re-renders)

```typescript
function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen)
  const toggleSidebar = useStore((state) => state.toggleSidebar)

  return (
    <div className={cn('sidebar', sidebarOpen && 'open')}>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}
```

**Pattern 2: Multiple values with object selector**

```typescript
function ThemeToggle() {
  const { theme, setTheme } = useStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }))

  return <button onClick={() => setTheme('dark')}>{theme}</button>
}
```

**Pattern 3: Custom selector hooks** (for commonly used selections)

```typescript
// In store.ts
export const useTheme = () => useStore((state) => state.theme)
export const useSidebar = () => useStore((state) => ({
  isOpen: state.sidebarOpen,
  toggle: state.toggleSidebar,
}))

// In component
function MyComponent() {
  const theme = useTheme()
  const { isOpen, toggle } = useSidebar()
  // ...
}
```

### Redux DevTools Integration

Zustand integrates with Redux DevTools for debugging. The third parameter in `set()` is the action name:

```typescript
set({ count: 5 }, false, 'increment') // Shows "increment" in DevTools
```

## Server State with TanStack Query

TanStack Query (formerly React Query) manages server state, caching, and async operations.

### When to Use TanStack Query

Use TanStack Query for:
- **Fetching data**: From IndexedDB, APIs, or any async source
- **Caching**: Automatic caching with configurable staleness
- **Background refetching**: Keep data fresh automatically
- **Mutations**: Create, update, delete operations with cache invalidation
- **Optimistic updates**: Update UI before server confirms

### Query Client Setup

The query client is configured in `src/lib/query.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Creating Query Hooks

Example from `src/hooks/useExampleQuery.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'

// Define query keys (centralized for type safety)
export const memoryQueryKeys = {
  all: ['memories'] as const,
  lists: () => [...memoryQueryKeys.all, 'list'] as const,
  detail: (id: number) => [...memoryQueryKeys.all, 'detail', id] as const,
}

// Query hook
export function useMemories() {
  return useQuery({
    queryKey: memoryQueryKeys.lists(),
    queryFn: async () => {
      return await db.memories.toArray()
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

// Mutation hook
export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memory: NewMemory) => {
      return await db.memories.add(memory)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: memoryQueryKeys.lists() })
    },
  })
}
```

### Using Queries in Components

```typescript
function MemoriesList() {
  const { data, isLoading, error, refetch } = useMemories()
  const createMutation = useCreateMemory()

  if (isLoading) return <div>Loading memories...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map(memory => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
      <button
        onClick={() => createMutation.mutate({ content: 'New memory' })}
        disabled={createMutation.isPending}
      >
        Add Memory
      </button>
    </div>
  )
}
```

### Optimistic Updates Pattern

```typescript
export function useUpdateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateMemoryParams) => {
      return await db.memories.update(id, updates)
    },
    // Before mutation runs
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: memoryQueryKeys.detail(id) })

      // Snapshot previous value
      const previous = queryClient.getQueryData(memoryQueryKeys.detail(id))

      // Optimistically update
      queryClient.setQueryData(memoryQueryKeys.detail(id), (old) => ({
        ...old,
        ...updates,
      }))

      return { previous }
    },
    // On error, rollback
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        memoryQueryKeys.detail(variables.id),
        context?.previous
      )
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: memoryQueryKeys.detail(variables.id) })
    },
  })
}
```

## Database with Dexie

Dexie is a wrapper around IndexedDB that provides a simpler, more intuitive API.

### Schema Definition

Database schema is defined in `src/lib/db.ts`:

```typescript
import Dexie, { Table } from 'dexie'

export interface Memory {
  id?: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export class LumaraDatabase extends Dexie {
  memories!: Table<Memory>

  constructor() {
    super('LumaraDB')

    this.version(1).stores({
      memories: '++id, title, createdAt, updatedAt, *tags',
      // ++id: auto-incrementing primary key
      // title: indexed field
      // *tags: multi-entry index (array field)
    })
  }
}

export const db = new LumaraDatabase()
```

### CRUD Operations

**Create**
```typescript
// Add single record
const id = await db.memories.add({
  title: 'Tennis Lesson',
  content: 'Learned continental grip...',
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ['tennis', 'technique'],
})

// Bulk add
await db.memories.bulkAdd([memory1, memory2, memory3])
```

**Read**
```typescript
// Get all
const allMemories = await db.memories.toArray()

// Get by ID
const memory = await db.memories.get(1)

// Query with where
const tagged = await db.memories
  .where('tags')
  .equals('tennis')
  .toArray()

// Complex queries
const recent = await db.memories
  .where('createdAt')
  .above(lastWeek)
  .reverse()
  .sortBy('createdAt')
```

**Update**
```typescript
// Update specific fields
await db.memories.update(1, {
  content: 'Updated content',
  updatedAt: new Date(),
})

// Update with function
await db.memories.update(1, (memory) => {
  memory.tags.push('important')
})
```

**Delete**
```typescript
// Delete by ID
await db.memories.delete(1)

// Bulk delete
await db.memories.bulkDelete([1, 2, 3])

// Delete with query
await db.memories.where('tags').equals('archived').delete()
```

### Live Queries with Dexie React Hooks

```typescript
import { useLiveQuery } from 'dexie-react-hooks'

function MemoriesLive() {
  const memories = useLiveQuery(
    () => db.memories.toArray()
  )

  if (!memories) return <div>Loading...</div>

  return <div>{memories.map(m => <div key={m.id}>{m.title}</div>)}</div>
}
```

### Database Versioning

When schema changes, increment version:

```typescript
this.version(1).stores({
  memories: '++id, title, createdAt',
})

this.version(2).stores({
  memories: '++id, title, createdAt, updatedAt, *tags', // Added fields
  reflections: '++id, memoryId, content, createdAt',    // New table
})

// Migration logic (optional)
this.version(2).upgrade((tx) => {
  return tx.table('memories').toCollection().modify((memory) => {
    memory.updatedAt = memory.createdAt
    memory.tags = []
  })
})
```

## Component Patterns

All UI components follow consistent patterns for maintainability and reusability.

### Base Component Pattern

Located in `src/components/ui/`, base components use this structure:

```typescript
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl bg-white/5 border border-white/10 p-6',
          // Variant styles
          {
            'shadow-lg': variant === 'elevated',
          },
          // Allow override
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
```

### Pattern Benefits

1. **TypeScript Safety**: Proper typing with HTMLAttributes extension
2. **Ref Forwarding**: Parent components can access the DOM element
3. **className Merging**: `cn()` utility intelligently merges Tailwind classes
4. **Props Spreading**: All HTML attributes work automatically
5. **Display Name**: Better debugging in React DevTools

### Button Component Example

From `src/components/ui/Button.tsx`:

```typescript
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'rounded-lg font-medium transition-colors',
          {
            'bg-gradient-to-r from-brand-indigo to-brand-violet text-white hover:opacity-90':
              variant === 'primary',
            'bg-white/10 text-white hover:bg-white/20': variant === 'secondary',
            'text-white hover:bg-white/10': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

### Input Component with Error Handling

From `src/components/ui/Input.tsx`:

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={cn(
            'rounded-lg bg-white/5 border border-white/10 px-4 py-2',
            'text-white placeholder:text-white/40',
            'focus:outline-none focus:ring-2 focus:ring-brand-indigo',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    )
  }
)
```

## Project Structure

### Detailed Structure Explanation

```
src/
├── components/
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx       # Button with variants & animations
│   │   ├── Card.tsx         # Card container component
│   │   └── Input.tsx        # Input with error states
│   ├── QueryTest.tsx        # TanStack Query demonstration
│   ├── StoreTest.tsx        # Zustand store demonstration
│   └── DexieTest.tsx        # Dexie database demonstration
│
├── lib/                     # Core library setup
│   ├── store.ts             # Zustand store configuration
│   ├── db.ts                # Dexie database schema
│   └── query.ts             # TanStack Query client
│
├── hooks/                   # Custom React hooks
│   └── useExampleQuery.ts   # Query/mutation hook examples
│
├── utils/                   # Pure utility functions
│   ├── cn.ts                # className merging utility
│   └── test.ts              # Test utilities
│
├── styles/                  # Global styles
│   └── globals.css          # Tailwind directives
│
├── features/                # Feature modules (future)
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/
│       └── utils/
│
├── types/                   # TypeScript definitions
│   └── index.ts
│
└── assets/                  # Static assets
    └── react.svg
```

### Feature Module Pattern (Future)

As the app grows, features will be organized into modules:

```
src/features/memories/
├── components/
│   ├── MemoryCard.tsx
│   ├── MemoryList.tsx
│   └── MemoryForm.tsx
├── hooks/
│   ├── useMemories.ts
│   └── useCreateMemory.ts
├── utils/
│   └── memory-helpers.ts
└── types.ts
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports.

### Configuration

In `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

In `vite.config.ts`:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Usage

```typescript
// Instead of
import { Button } from '../../../components/ui/Button'
import { db } from '../../../lib/db'

// Use
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
```

## Styling Guidelines

### Tailwind CSS Conventions

1. **Use utility classes**: Prefer Tailwind utilities over custom CSS
2. **Mobile-first**: Start with mobile styles, add breakpoints up
3. **Design tokens**: Use brand colors from config
4. **Dark mode**: All designs default to dark mode
5. **Conditional classes**: Use `cn()` utility for dynamic classes

### Brand Colors

Defined in `tailwind.config.js`:

```javascript
colors: {
  brand: {
    indigo: '#6366F1',  // Primary
    violet: '#8B5CF6',  // Secondary
  },
  background: {
    dark: '#0A0E1A',    // Deep dark background
  },
}
```

Usage:
```tsx
<div className="bg-gradient-to-r from-brand-indigo to-brand-violet">
  <p className="text-brand-indigo">Text</p>
</div>
```

### Responsive Design

```tsx
<div className="
  px-4           /* Mobile: 16px padding */
  md:px-8        /* Tablet: 32px padding */
  lg:px-16       /* Desktop: 64px padding */

  text-sm        /* Mobile: small text */
  md:text-base   /* Tablet: base text */
  lg:text-lg     /* Desktop: large text */
">
  Content
</div>
```

### cn() Utility

The `cn()` utility (from `src/utils/cn.ts`) merges class names intelligently:

```typescript
import { cn } from '@/utils/cn'

// Handles conflicts (last wins)
cn('px-2 py-1', 'px-4') // Result: 'py-1 px-4'

// Conditional classes
cn('base-class', condition && 'conditional-class', {
  'active': isActive,
  'disabled': isDisabled,
})

// Arrays and objects
cn(
  'base',
  ['array', 'of', 'classes'],
  { 'optional': true, 'skipped': false }
)
```

## Type Safety

### TypeScript Configuration

Strict mode is enabled for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
  }
}
```

### Typing Guidelines

1. **Never use `any`**: Use `unknown` if type is truly unknown
2. **Define interfaces for props**: All component props should be typed
3. **Type all functions**: Include return types explicitly
4. **Use const assertions**: For readonly arrays and objects

```typescript
// Good
interface UserProps {
  name: string
  age: number
  email?: string
}

function formatUser(user: UserProps): string {
  return `${user.name} (${user.age})`
}

// Avoid
function formatUser(user: any) {
  return `${user.name} (${user.age})`
}
```

### Generic Type Patterns

```typescript
// Reusable generic hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  return [value, setValue] as const
}

// Usage
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')
```

## Development Workflow

### Adding a New Feature

1. **Plan the feature**
   - Define data models
   - Sketch UI components
   - Identify state requirements

2. **Create database schema** (if needed)
   ```typescript
   // Update src/lib/db.ts
   this.version(2).stores({
     newTable: '++id, field1, field2',
   })
   ```

3. **Create query hooks**
   ```typescript
   // src/hooks/useNewFeature.ts
   export function useNewFeatureData() {
     return useQuery({
       queryKey: ['newFeature'],
       queryFn: () => db.newTable.toArray(),
     })
   }
   ```

4. **Build UI components**
   ```typescript
   // src/components/NewFeature.tsx
   export function NewFeature() {
     const { data, isLoading } = useNewFeatureData()
     return <div>{/* component */}</div>
   }
   ```

5. **Add to app**
   ```typescript
   // src/App.tsx
   import { NewFeature } from '@/components/NewFeature'
   ```

6. **Test with HMR**
   - Make changes
   - See updates instantly
   - Fix any issues

7. **Commit when working**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Daily Development Cycle

```bash
# 1. Start dev server
npm run dev

# 2. Make changes (HMR applies automatically)
# Edit files in src/

# 3. Check types periodically
npm run build  # Includes type check

# 4. Format code
npm run format

# 5. Lint
npm run lint

# 6. Commit
git commit -m "..."
```

## Common Patterns

### Loading States

```typescript
function Component() {
  const { data, isLoading, error } = useQuery(...)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin ...">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error.message}
      </div>
    )
  }

  return <div>{/* render data */}</div>
}
```

### Form Handling

```typescript
function MemoryForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const createMutation = useCreateMemory()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    createMutation.mutate({
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Memory'}
      </Button>
    </form>
  )
}
```

### Animations with Framer Motion

```typescript
import { motion } from 'framer-motion'

function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Error Boundaries

```typescript
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
```

## Testing with MCP Tools

Lumara includes MCP (Model Context Protocol) servers for automated testing and inspection.

### Playwright MCP - Interactive Testing

```
"Navigate to http://localhost:5173 and test the memory creation flow"
"Click the 'Add Memory' button and fill in the form"
```

### Chrome DevTools MCP - Inspection

```
"Take a screenshot of the current page"
"Check for console errors"
"Analyze accessibility tree"
```

See [MCP_TOOLS.md](./MCP_TOOLS.md) for complete documentation.

## Troubleshooting

### HMR Not Working

**Problem**: Changes don't reflect in browser

**Solutions**:
```bash
# 1. Check Vite server is running
npm run dev

# 2. Verify file is in src/ directory
# HMR only works for files in src/

# 3. Hard refresh browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 4. Restart dev server
# Kill server and run npm run dev again
```

### TypeScript Errors

**Problem**: Red squiggly lines in editor

**Solutions**:
```bash
# 1. Run type check
npm run build  # Includes tsc -b

# 2. Check tsconfig.json paths
# Ensure @/* alias is configured

# 3. Restart TypeScript server
# In VS Code: Cmd+Shift+P → "Restart TS Server"

# 4. Clear build cache
rm -rf node_modules/.tmp
```

### Database Errors

**Problem**: Dexie/IndexedDB errors

**Solutions**:
```typescript
// 1. Check schema version
// Increment version when schema changes
this.version(2).stores({ ... })

// 2. Clear IndexedDB (in browser DevTools)
Application → IndexedDB → LumaraDB → Delete

// 3. Add error handling
try {
  await db.memories.add(memory)
} catch (error) {
  if (error.name === 'ConstraintError') {
    console.error('Duplicate key')
  }
}
```

### Import Errors

**Problem**: Cannot find module '@/...'

**Solutions**:
```bash
# 1. Check path alias in tsconfig.app.json
"paths": { "@/*": ["./src/*"] }

# 2. Check Vite config
resolve: { alias: { '@': path.resolve(__dirname, './src') } }

# 3. Restart dev server
npm run dev
```

### Styling Issues

**Problem**: Tailwind classes not applying

**Solutions**:
```bash
# 1. Check content paths in tailwind.config.js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]

# 2. Restart dev server (Tailwind needs restart)
npm run dev

# 3. Check for class name conflicts
# Use cn() utility to merge classes properly

# 4. Verify dark mode class
# Tailwind uses 'class' strategy, needs class="dark" on html
```

### Performance Issues

**Problem**: App is slow or laggy

**Solutions**:
```typescript
// 1. Use React.memo for expensive components
const MemoizedCard = memo(Card)

// 2. Optimize Zustand selectors (use selective access)
const count = useStore((state) => state.count) // Good
const state = useStore() // Bad - re-renders on any change

// 3. Check for unnecessary re-renders
// Use React DevTools Profiler

// 4. Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

---

## Resources

- [React Docs](https://react.dev/) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Vite Guide](https://vitejs.dev/guide/) - Vite documentation
- [Tailwind Docs](https://tailwindcss.com/docs) - Tailwind CSS reference
- [Zustand Docs](https://github.com/pmndrs/zustand) - Zustand guide
- [TanStack Query Docs](https://tanstack.com/query/latest) - React Query documentation
- [Dexie Docs](https://dexie.org/) - Dexie.js guide
- [Framer Motion Docs](https://www.framer.com/motion/) - Animation library

---

**Happy coding! Build something amazing with Lumara.**
