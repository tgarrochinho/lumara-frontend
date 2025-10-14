---
created: 2025-10-14T16:58:14Z
last_updated: 2025-10-14T16:58:14Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## File Naming

### Components
- **PascalCase** for files: `MemoryCard.tsx`, `EvolutionTimeline.tsx`
- Match component name to file name exactly
- Use `.tsx` for components with JSX
- Use `.ts` for pure TypeScript (utilities, types)

### Modules
- **kebab-case** for non-component files
- Examples: `vector-math.ts`, `error-handler.ts`, `use-example-query.ts`
- Use descriptive names: `similarity.ts` not `sim.ts`

### Tests
- Same name as source + `.test.ts`
- Location: `__tests__/` directory
- Example: `similarity.ts` → `__tests__/similarity.test.ts`

### Documentation
- **SCREAMING_CASE.md** for important docs: `README.md`, `CORE_FEATURES.md`
- **kebab-case.md** for regular docs: `parallel-execution-safeguards.md`

## Code Style

### TypeScript
```typescript
// Use strict mode (already configured)
// Prefer interfaces over types for objects
interface Memory {
  id: number;
  content: string;
}

// Use type for unions/primitives
type MemoryType = 'knowledge' | 'experience' | 'method';

// Explicit return types for functions
function processMemory(memory: Memory): Promise<void> {
  // Implementation
}

// Use async/await, not .then()
async function fetchData() {
  const data = await api.getData();
  return data;
}
```

### React Components
```typescript
// Functional components only, no class components
// Props interface above component
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// Export component directly
export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn('btn', `btn-${variant}`)}>
      {children}
    </button>
  );
}
```

### Hooks
```typescript
// Prefix with 'use'
// Return object or array, be consistent
export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  
  return { memories, loading, setMemories };
}
```

## Import Style

### Order
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External dependencies
import { useQuery } from '@tanstack/react-query';
import { db } from 'dexie';

// 3. Internal modules (use @ alias)
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { Memory } from '@/types';

// 4. Relative imports (avoid when possible)
import { helper } from './helper';
```

### Path Aliases
```typescript
// Always use @ alias, never relative paths for src/
import { Button } from '@/components/ui/Button';  // ✅ Good
import { Button } from '../../components/ui/Button';  // ❌ Bad
```

## Formatting

### Prettier Configuration
- **Indent:** 2 spaces
- **Semi:** Always use semicolons
- **Quotes:** Single quotes for strings
- **Trailing Comma:** ES5 style
- **Line Width:** 100 characters
- **Arrow Parens:** Always

### Example
```typescript
const processItems = (items: Item[]): ProcessedItem[] => {
  return items
    .filter((item) => item.active)
    .map((item) => ({
      id: item.id,
      name: item.name,
      processed: true,
    }));
};
```

## Comments

### When to Comment
```typescript
// ✅ Good: Explain WHY, not WHAT
// Retry 3 times because the model load can be flaky
await withRetry(() => loadModel(), { maxAttempts: 3 });

// ❌ Bad: Obvious comment
// Load the model
await loadModel();
```

### JSDoc for Public APIs
```typescript
/**
 * Generate embedding for text using Transformers.js
 *
 * @param text - The text to generate embedding for
 * @returns 384-dimensional normalized vector
 * @throws {EmbeddingError} If model fails to load or process
 *
 * @example
 * ```typescript
 * const embedding = await generateEmbedding('Hello world');
 * console.log(embedding.length); // 384
 * ```
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Implementation
}
```

## Testing Style

### Test Structure
```typescript
describe('Feature', () => {
  // Setup
  beforeEach(() => {
    // Reset state
  });
  
  // Test cases
  it('does something specific', () => {
    // Arrange
    const input = setupInput();
    
    // Act
    const result = doSomething(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Test Descriptions
```typescript
// ✅ Good: Describes behavior
it('returns 1.0 for identical vectors', () => {});
it('throws error when provider not initialized', () => {});

// ❌ Bad: Vague or technical
it('works', () => {});
it('test case 1', () => {});
```

## Error Handling

### Pattern
```typescript
// Use custom error types
throw new EmbeddingError('Failed to generate embedding', originalError);

// Catch specific errors
try {
  await riskyOperation();
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network error
  } else {
    // Re-throw unknown errors
    throw error;
  }
}
```

## Git Commits

### Message Format
```
type(scope): short description

Longer explanation if needed

- Bullet points for details
- More context
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding or updating tests
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `chore`: Build process or auxiliary tools

### Examples
```
feat(ai): add retry logic with exponential backoff

Implements automatic retry for transient AI errors
with configurable backoff multiplier and max attempts.

- Add withRetry() function
- Add RetryOptions interface
- Add tests for retry logic
```

## Code Organization

### Directory Structure
```
feature-name/
├── index.ts          # Public API (exports)
├── types.ts          # TypeScript types
├── feature.ts        # Main logic
├── utils.ts          # Helper functions
└── __tests__/        # Tests
    └── feature.test.ts
```

### Barrel Exports (index.ts)
```typescript
// Public API only
export { mainFunction } from './feature';
export type { MainType } from './types';

// Don't export internals
// export { helperFunction } from './utils';  ❌
```

## Naming Conventions

### Variables
```typescript
// camelCase for variables and functions
const userName = 'Alice';
function processData() {}

// PascalCase for classes and components
class DataProcessor {}
function UserCard() {}

// SCREAMING_SNAKE_CASE for constants
const MAX_RETRIES = 3;
const API_URL = 'https://api.example.com';

// Prefix booleans with is/has/can
const isLoading = true;
const hasError = false;
const canEdit = false;
```

### Functions
```typescript
// Verbs for actions
function loadData() {}
function saveMemory() {}
function deleteItem() {}

// get/set for accessors
function getUserName() {}
function setUserName(name: string) {}

// is/has for booleans
function isValid() {}
function hasPermission() {}
```

## Anti-Patterns to Avoid

### ❌ Don't Do This
```typescript
// Relative imports from src/
import { Button } from '../../../components/ui/Button';

// Any type
function process(data: any) {}

// Implicit return types
async function fetchData() {
  return await api.get();
}

// Class components
class MyComponent extends React.Component {}

// Default exports (use named exports)
export default MyComponent;

// Console.log in production code
console.log('Debug:', data);

// Skipped tests
it.skip('will implement later', () => {});

// Flaky tests (must fix, not skip)
```

### ✅ Do This Instead
```typescript
// @ alias imports
import { Button } from '@/components/ui/Button';

// Proper types
function process(data: ProcessedData): Result {}

// Explicit return types
async function fetchData(): Promise<Data> {
  return await api.get();
}

// Functional components
export function MyComponent() {}

// Named exports
export { MyComponent };

// Proper logging (development only)
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}

// Complete all tests
it('implements feature', () => {});

// Fix flaky tests
it('is reliable', () => {});
```

---

**Last Updated:** 2025-10-14T16:58:14Z
