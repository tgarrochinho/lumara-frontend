---
created: 2025-10-14T16:58:14Z
last_updated: 2025-10-14T16:58:14Z
version: 1.0
author: Claude Code PM System
---

# System Patterns & Architecture

## Core Architectural Patterns

### 1. Provider Pattern (AI System)

**Purpose:** Extensible AI provider abstraction for multiple backends

**Implementation:**
```typescript
// Interface defining contract
interface AIProvider {
  readonly name: string;
  readonly type: 'local' | 'cloud';
  readonly requiresApiKey: boolean;
  
  capabilities: {
    chat: boolean;
    embeddings: boolean;
    streaming: boolean;
    multimodal: boolean;
  };
  
  chat(message: string, context?: string[]): Promise<string>;
  embed(text: string): Promise<number[]>;
  initialize(config?: ProviderConfig): Promise<void>;
  healthCheck(): Promise<ProviderHealth>;
  dispose(): Promise<void>;
}

// Base implementation
abstract class BaseProvider implements AIProvider {
  protected initialized = false;
  protected config?: ProviderConfig;
  
  protected ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Provider not initialized');
    }
  }
  
  protected storeConfig(config?: ProviderConfig) {
    this.config = config;
  }
  
  protected markInitialized() {
    this.initialized = true;
  }
}

// Concrete implementation
class ChromeAIProvider extends BaseProvider {
  name = 'Chrome AI (Gemini Nano)';
  type = 'local' as const;
  requiresApiKey = false;
  
  async initialize() {
    // Chrome-specific initialization
    this.markInitialized();
  }
  
  async chat(message: string): Promise<string> {
    this.ensureInitialized();
    // Implementation
  }
}
```

**Benefits:**
- Easy to add new providers
- Type-safe with TypeScript
- Lifecycle management built-in
- Health monitoring standard

**Usage in code:**
- Location: `src/lib/ai/providers/`
- Registry: `src/lib/ai/registry.ts`
- Examples: Chrome AI, Mock provider

---

### 2. Error Handling Pattern

**Purpose:** Comprehensive error handling with retry logic

**Implementation:**
```typescript
// Custom error hierarchy
class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean,
    public cause?: Error
  ) {
    super(message);
    this.name = 'AIError';
  }
}

// Specific error types
class ProviderUnavailableError extends AIError {}
class EmbeddingError extends AIError {}
class NetworkError extends AIError {}

// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = defaultShouldRetry
  } = options;
  
  let lastError: Error;
  let delay = delayMs;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, 10000);
    }
  }
  
  throw lastError!;
}
```

**Benefits:**
- Automatic retry on transient failures
- User-friendly error messages
- Detailed error context
- Recovery strategies

**Usage:**
- Location: `src/lib/ai/error-handler.ts`
- Pattern: Wrap AI operations with `withRetry()`

---

### 3. Caching Pattern (Embeddings)

**Purpose:** Efficient caching of expensive computations

**Implementation:**
```typescript
class EmbeddingCache {
  private db: Promise<IDBDatabase>;
  
  async get(text: string): Promise<number[] | null> {
    const hash = this.hashText(text);
    const db = await this.db;
    const tx = db.transaction('embeddings', 'readonly');
    const store = tx.objectStore('embeddings');
    const result = await store.get(hash);
    return result?.embedding || null;
  }
  
  async set(text: string, embedding: number[]): Promise<void> {
    const hash = this.hashText(text);
    const db = await this.db;
    const tx = db.transaction('embeddings', 'readwrite');
    const store = tx.objectStore('embeddings');
    await store.put({ hash, text, embedding, createdAt: new Date() });
  }
  
  private hashText(text: string): string {
    // Simple hash for demonstration
    return btoa(text).slice(0, 32);
  }
}
```

**Benefits:**
- Avoids recomputing embeddings
- IndexedDB persistence
- Fast lookups (<1ms)
- Automatic cleanup

**Usage:**
- Location: `src/lib/ai/embeddings/cache.ts`
- Pattern: Check cache before generating

---

### 4. Lazy Initialization Pattern

**Purpose:** Generate expensive resources only when needed

**Implementation:**
```typescript
// Database helper with lazy embedding generation
async function ensureMemoryHasEmbedding(memoryId: number): Promise<number[]> {
  const memory = await db.memories.get(memoryId);
  
  if (!memory) {
    throw new Error(`Memory ${memoryId} not found`);
  }
  
  // Return existing if available
  if (memory.embedding) {
    return memory.embedding;
  }
  
  // Generate lazily
  const { generateEmbedding } = await import('./ai/embeddings/transformers');
  const embedding = await generateEmbedding(memory.content);
  
  // Store for future
  await db.memories.update(memoryId, {
    embedding,
    updatedAt: new Date()
  });
  
  return embedding;
}
```

**Benefits:**
- Deferred expensive operations
- Graceful degradation
- Progressive enhancement
- Better performance

**Usage:**
- Location: `src/lib/db.ts`
- Pattern: Check existence before generation

---

### 5. Singleton Pattern (Service Instances)

**Purpose:** Single instance of services across app

**Implementation:**
```typescript
class AIErrorHandler {
  private static instance: AIErrorHandler;
  
  private constructor() {}
  
  static getInstance(): AIErrorHandler {
    if (!this.instance) {
      this.instance = new AIErrorHandler();
    }
    return this.instance;
  }
  
  handle(error: Error): AIError {
    // Error handling logic
  }
}

// Export singleton instance
export const errorHandler = AIErrorHandler.getInstance();
```

**Benefits:**
- Single source of truth
- Global configuration
- Memory efficient
- Easy to mock in tests

**Usage:**
- AI Error Handler
- Embedding Cache
- Provider Registry

---

### 6. Hook Pattern (React Integration)

**Purpose:** Encapsulate stateful logic in reusable hooks

**Implementation:**
```typescript
function useExampleQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      // Fetch logic
      return data;
    }
  });
  
  return { data, isLoading, error };
}

// Usage in component
function MyComponent() {
  const { data, isLoading } = useExampleQuery();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

**Benefits:**
- Reusable logic
- Testable independently
- Clean component code
- Standard React patterns

**Usage:**
- Location: `src/hooks/`
- Pattern: One hook per file, prefix with `use`

---

### 7. Database Migration Pattern

**Purpose:** Version database schema safely

**Implementation:**
```typescript
class LumaraDatabase extends Dexie {
  constructor() {
    super('LumaraDB');
    
    // Version 1: Initial schema
    this.version(1).stores({
      // Empty - foundation
    });
    
    // Version 2: Add memories
    this.version(2)
      .stores({
        memories: '++id, content, type, createdAt, updatedAt, *tags'
      })
      .upgrade(async (trans) => {
        console.log('Upgrading to v2: Adding memories table');
        // Data migration if needed
      });
  }
}
```

**Benefits:**
- Safe schema evolution
- Backward compatibility
- Data migration support
- Version tracking

**Usage:**
- Location: `src/lib/db.ts`
- Pattern: Increment version, add upgrade hook

---

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Store Action (Zustand)
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update
```

### Server State Management

```
Component Mount
    ↓
TanStack Query Hook
    ↓
Fetch Data (with Cache Check)
    ↓
Update Cache
    ↓
Return Data to Component
```

### Local-First Data Flow

```
User Creates Memory
    ↓
Write to IndexedDB (Dexie)
    ↓
Generate Embedding (Lazy)
    ↓
Cache Embedding
    ↓
Update UI (Reactive Query)
```

---

## Testing Patterns

### Unit Test Pattern

```typescript
describe('cosineSimilarity', () => {
  it('returns 1.0 for identical vectors', () => {
    const vec = [1, 2, 3];
    const result = cosineSimilarity(vec, vec);
    expect(result).toBeCloseTo(1.0);
  });
  
  it('returns 0.0 for orthogonal vectors', () => {
    const vec1 = [1, 0];
    const vec2 = [0, 1];
    const result = cosineSimilarity(vec1, vec2);
    expect(result).toBeCloseTo(0.0);
  });
});
```

### Integration Test Pattern

```typescript
describe('AI Provider Integration', () => {
  let provider: MockAIProvider;
  
  beforeEach(async () => {
    provider = new MockAIProvider();
    await provider.initialize();
  });
  
  afterEach(async () => {
    await provider.dispose();
  });
  
  it('completes full chat workflow', async () => {
    const response = await provider.chat('Hello');
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
  });
});
```

### Component Test Pattern

```typescript
describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

## Key Architectural Principles

1. **Local-First:** All data and processing client-side
2. **Type Safety:** TypeScript strict mode everywhere
3. **Extensibility:** Provider pattern for future growth
4. **Performance:** Lazy loading, caching, optimization
5. **Reliability:** Error handling, retry logic, health checks
6. **Testability:** Comprehensive test coverage
7. **Privacy:** Zero data transmission to servers

---

**Last Updated:** 2025-10-14T16:58:14Z
