# AI System Architecture

## Overview

This document describes the architecture decisions, design patterns, and rationale behind Lumara's AI system.

## Design Principles

### 1. Local-First Philosophy

**Decision:** Prioritize on-device AI over cloud APIs.

**Rationale:**
- **Privacy:** User data never leaves their device
- **Cost:** No API costs for free tier users
- **Performance:** No network latency for local inference
- **Reliability:** Works offline

**Implementation:**
- Chrome AI (Gemini Nano) as primary provider
- Browser-based embeddings via Transformers.js
- Cloud providers as opt-in alternatives

### 2. Provider Abstraction Pattern

**Decision:** Use an abstract provider interface with concrete implementations.

**Rationale:**
- **Flexibility:** Easy to swap providers without changing application code
- **Extensibility:** Add new providers by implementing interface
- **Testing:** Mock providers for testing
- **Future-proof:** Support emerging AI providers

**Implementation:**
```typescript
// Abstract interface
interface AIProvider {
  chat(message: string, context?: string[]): Promise<string>;
  embed(text: string): Promise<number[]>;
  initialize(config?: ProviderConfig): Promise<void>;
  dispose(): Promise<void>;
  healthCheck(): Promise<ProviderHealth>;
}

// Base class with common functionality
abstract class BaseProvider implements AIProvider {
  // Shared health checking, state management
}

// Concrete implementations
class ChromeAIProvider extends BaseProvider { }
class GeminiAPIProvider extends BaseProvider { }
```

### 3. Separation of Concerns

**Decision:** Separate chat capabilities from embeddings.

**Rationale:**
- **Independence:** Embeddings and chat have different use cases
- **Flexibility:** Use Chrome AI for chat, Transformers.js for embeddings
- **Optimization:** Different caching and performance strategies
- **Compatibility:** Not all providers support both capabilities

**Implementation:**
- Providers: Handle chat/text generation
- Embeddings system: Separate module for semantic embeddings
- Clear API boundaries between systems

### 4. Aggressive Caching Strategy

**Decision:** Implement two-tier caching (memory + IndexedDB) for embeddings.

**Rationale:**
- **Performance:** <100ms embedding generation after cache
- **Cost:** Reduce computation for repeated text
- **UX:** Instant responses for cached queries
- **Persistence:** IndexedDB survives browser restarts

**Implementation:**
```typescript
class EmbeddingCacheManager {
  private memoryCache = new Map<string, Embedding>(); // Fast access
  private db: IDBPDatabase<EmbeddingDB>; // Persistent storage

  async get(text: string): Promise<Embedding | null> {
    // 1. Check memory cache (fastest)
    if (this.memoryCache.has(text)) return this.memoryCache.get(text);

    // 2. Check IndexedDB (persistent)
    const cached = await this.db.get('embeddings', text);
    if (cached) {
      this.memoryCache.set(text, cached.embedding); // Promote to memory
      return cached.embedding;
    }

    return null;
  }
}
```

### 5. Registry Pattern for Provider Management

**Decision:** Central registry for provider discovery and selection.

**Rationale:**
- **Simplicity:** Single entry point for getting providers
- **Fallback logic:** Automatic fallback to available providers
- **Discoverability:** Easy to see all available providers
- **Configuration:** Centralized provider configuration

**Implementation:**
```typescript
const providerRegistry = {
  'chrome-ai': ChromeAIProvider,
  'gemini': GeminiAPIProvider,
  'openai': OpenAIProvider,
};

async function selectProvider(preferred?: string): Promise<AIProvider> {
  // Try preferred provider first
  // Fall back to others if unavailable
  // Throw if none available
}
```

## Architecture Diagrams

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                           │
│                    (React Components)                        │
└────────────────────┬──────────────────┬─────────────────────┘
                     │                  │
           ┌─────────▼──────────┐  ┌───▼────────────────┐
           │  AI Provider API   │  │  Embeddings API    │
           │  (chat, health)    │  │  (generate, cache) │
           └─────────┬──────────┘  └───┬────────────────┘
                     │                  │
           ┌─────────▼──────────┐  ┌───▼────────────────┐
           │  Provider Registry │  │  Transformers.js   │
           │  (selectProvider)  │  │  (MiniLM-L6-v2)    │
           └─────────┬──────────┘  └───┬────────────────┘
                     │                  │
        ┌────────────▼────────────┐     │
        │   Concrete Providers    │     │
        │  ┌───────────────────┐  │     │
        │  │ ChromeAIProvider  │  │     │
        │  ├───────────────────┤  │     │
        │  │ GeminiAPIProvider │  │     │
        │  ├───────────────────┤  │     │
        │  │ OpenAIProvider    │  │     │
        │  └───────────────────┘  │     │
        └─────────────────────────┘     │
                                   ┌────▼──────────────┐
                                   │  Cache Manager    │
                                   │  ┌─────────────┐  │
                                   │  │ Memory Map  │  │
                                   │  ├─────────────┤  │
                                   │  │ IndexedDB   │  │
                                   │  └─────────────┘  │
                                   └───────────────────┘
```

### Data Flow for Chat

```
User Input ("Help me think about X")
    ↓
selectProvider('chrome-ai')
    ↓
Registry tries Chrome AI
    ↓
Health check (is available?)
    ↓
Initialize provider
    ↓
provider.chat(message, context)
    ↓
Chrome AI API (window.ai.createTextSession)
    ↓
Response returned to application
```

### Data Flow for Embeddings

```
User creates memory ("Important thought")
    ↓
generateEmbedding(text)
    ↓
Check memory cache
    ├─ Hit → Return cached embedding
    └─ Miss ↓
Check IndexedDB cache
    ├─ Hit → Promote to memory, return
    └─ Miss ↓
Load Transformers.js model (if not loaded)
    ↓
Generate embedding (MiniLM-L6-v2)
    ↓
Cache in memory + IndexedDB
    ↓
Return 384-dimensional vector
```

## File Organization

```
src/lib/ai/
├── index.ts                    # Public API exports
├── types.ts                    # Core type definitions
├── registry.ts                 # Provider registry and selection
├── providers/
│   ├── base.ts                # Abstract base provider class
│   └── chrome-ai.ts           # Chrome AI implementation
├── embeddings/
│   ├── index.ts               # Public embeddings API
│   ├── types.ts               # Embedding-specific types
│   ├── transformers.ts        # Transformers.js wrapper
│   └── cache.ts               # Two-tier caching system
├── utils/
│   └── progress.ts            # Progress tracking utility
└── __tests__/
    ├── types.test.ts
    ├── base.test.ts
    ├── chrome-ai.test.ts
    ├── registry.test.ts
    ├── embeddings.test.ts
    ├── cache.test.ts
    └── progress.test.ts
```

### Organization Rationale

- **Flat structure:** Easy to navigate and understand
- **Clear boundaries:** Providers, embeddings, utils are separate
- **Colocation:** Tests live with implementation
- **Single exports:** index.ts files provide clean public APIs

## Key Design Decisions

### 1. Why Chrome AI First?

**Options Considered:**
1. OpenAI API (cloud, costs money)
2. Local LLM (heavy, requires setup)
3. Chrome AI (local, free, built-in)

**Decision:** Chrome AI (Gemini Nano)

**Trade-offs:**
- ✅ Free and local
- ✅ No API key required
- ✅ Privacy-preserving
- ✅ Fast (on-device)
- ❌ Chrome Canary/Dev only (for now)
- ❌ Limited model capabilities
- ❌ No embeddings (use Transformers.js)

**Mitigation:**
- Clear documentation for setup
- Fallback to other providers
- Embeddings via separate system

### 2. Why Transformers.js for Embeddings?

**Options Considered:**
1. Provider-specific embeddings (e.g., OpenAI)
2. Local model (e.g., sentence-transformers)
3. Transformers.js (browser-based)

**Decision:** Transformers.js with MiniLM-L6-v2

**Trade-offs:**
- ✅ Runs in browser (no server)
- ✅ Free
- ✅ 384 dimensions (good for memory search)
- ✅ Fast (<100ms after load)
- ✅ Automatic caching
- ❌ Initial download (~22MB)
- ❌ Not as powerful as larger models

**Mitigation:**
- Aggressive caching to offset load time
- Progress tracking for downloads
- Future: Optional provider embeddings

### 3. Why Two-Tier Caching?

**Options Considered:**
1. No caching (regenerate every time)
2. Memory cache only (lost on reload)
3. IndexedDB only (slower access)
4. Two-tier (memory + IndexedDB)

**Decision:** Two-tier caching

**Trade-offs:**
- ✅ Fast access (memory)
- ✅ Persistent (IndexedDB)
- ✅ LRU-style eviction (memory)
- ✅ Automatic cleanup (30-day TTL)
- ❌ More complex code
- ❌ Higher memory usage

**Mitigation:**
- Size limits (1000 embeddings in memory)
- Automatic cleanup
- Clear cache API

### 4. Why Abstract Base Class?

**Options Considered:**
1. Interface only (no shared code)
2. Utility functions (external helpers)
3. Abstract base class (inheritance)

**Decision:** Abstract base class with interface

**Trade-offs:**
- ✅ Share common logic (health checks, state)
- ✅ Enforce interface via TypeScript
- ✅ Reduce boilerplate in concrete providers
- ❌ Inheritance can be rigid

**Mitigation:**
- Keep base class minimal
- Providers can override methods
- Composition over inheritance where possible

### 5. Why Separate Progress Tracking?

**Options Considered:**
1. Callbacks directly in embedding API
2. Events (EventEmitter)
3. Observable pattern (RxJS)
4. Simple pub/sub (ProgressTracker)

**Decision:** Simple pub/sub with ProgressTracker

**Trade-offs:**
- ✅ Simple and lightweight
- ✅ No external dependencies
- ✅ Easy to use with React (useState)
- ✅ Multiple subscribers supported
- ❌ Not as feature-rich as RxJS

**Mitigation:**
- Sufficient for current needs
- Can upgrade to RxJS if needed

## Performance Considerations

### 1. Lazy Loading

**Strategy:** Load models only when needed, not on app start.

**Implementation:**
```typescript
class TransformersEmbeddingService {
  private embedder: any = null;

  async generateEmbedding(text: string): Promise<Embedding> {
    if (!this.embedder) {
      await this.initialize(); // Lazy load
    }
    return this.embedder(text);
  }
}
```

**Benefits:**
- Faster initial app load
- Reduced memory usage if AI not used

### 2. Batch Processing

**Strategy:** Process multiple embeddings in parallel.

**Implementation:**
```typescript
async function generateBatchEmbeddings(texts: string[]): Promise<Embedding[]> {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}
```

**Benefits:**
- ~3x faster than sequential
- Better resource utilization

### 3. Health Check Caching

**Strategy:** Cache health check results for 10 seconds.

**Implementation:**
```typescript
async healthCheck(): Promise<ProviderHealth> {
  if (this.lastHealth && this.isFresh(this.lastHealth)) {
    return this.lastHealth;
  }
  // Perform new check
}
```

**Benefits:**
- Reduce repeated API calls
- Faster availability checks

### 4. Automatic Retry with Backoff

**Strategy:** Retry failed operations with exponential backoff.

**Implementation:**
```typescript
private async loadModelWithRetry(): Promise<any> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await this.loadModel();
    } catch (error) {
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

**Benefits:**
- Handle transient failures
- Better user experience

## Security Considerations

### 1. API Key Storage

**Current:** Local storage (not implemented yet for cloud providers)

**Future:**
- Encrypt keys at rest
- Use secure storage APIs
- Warn users about key security

### 2. Content Isolation

**Strategy:** No data sent to cloud for local providers.

**Implementation:**
- Chrome AI runs entirely on-device
- Transformers.js runs in browser
- Clear labeling for cloud providers

### 3. Input Validation

**Strategy:** Validate all inputs before processing.

**Implementation:**
```typescript
if (!text || typeof text !== 'string') {
  throw new EmbeddingError(EmbeddingErrorType.INVALID_INPUT);
}
```

### 4. Error Messages

**Strategy:** Avoid leaking sensitive information in errors.

**Implementation:**
- Generic error messages to users
- Detailed logs only in development
- No API keys in error messages

## Scalability Considerations

### 1. Cache Growth

**Problem:** Unlimited cache can grow indefinitely.

**Solution:**
- Memory cache: 1000 item limit (LRU)
- IndexedDB: 30-day TTL with automatic cleanup
- Manual clear() API

### 2. Concurrent Requests

**Problem:** Multiple embeddings at once can overwhelm browser.

**Solution:**
- Batch API for efficient parallel processing
- Browser handles Transformers.js threading
- Future: Request queuing if needed

### 3. Model Updates

**Problem:** Models may update, cache becomes stale.

**Solution:**
- Version model names in cache keys
- Clear cache on model version change
- Future: Automatic migration

## Testing Strategy

### 1. Unit Tests

**Coverage:** 81.72% overall

**Focus:**
- Individual function behavior
- Error handling
- Edge cases

**Tools:**
- Vitest for test runner
- Mock providers for testing
- Fake timers for async

### 2. Integration Tests

**Focus:**
- Provider selection logic
- Cache integration
- End-to-end flows

### 3. Manual Testing

**Focus:**
- Chrome AI setup
- Model download UX
- Performance benchmarks

## Future Architecture Improvements

### 1. Worker-Based Embeddings

**Goal:** Move embeddings to Web Worker for better performance.

**Benefits:**
- Don't block main thread
- Better parallelization
- Smoother UI

**Effort:** Medium (2-3 days)

### 2. Streaming Responses

**Goal:** Support streaming for long chat responses.

**Benefits:**
- Perceived performance improvement
- Better UX for long responses
- Token-by-token display

**Effort:** Small (1 day per provider)

### 3. Multi-Provider Strategies

**Goal:** Use multiple providers simultaneously.

**Use Cases:**
- Embeddings from one, chat from another
- Compare responses from multiple providers
- Fallback chains

**Effort:** Medium (3-4 days)

### 4. Provider-Specific Embeddings

**Goal:** Support embeddings from cloud providers.

**Benefits:**
- Higher quality embeddings
- Multimodal support
- Larger dimensions

**Effort:** Small (1 day per provider)

### 5. Smart Caching Strategies

**Goal:** Predictive caching based on usage patterns.

**Benefits:**
- Preload likely queries
- Better hit rates
- Improved performance

**Effort:** Medium (2-3 days)

## References

- [Chrome Built-in AI API](https://developer.chrome.com/docs/ai/built-in)
- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [MiniLM-L6-v2 Model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Provider Pattern](https://refactoring.guru/design-patterns/strategy)

## Changelog

- **2025-10-14:** Initial architecture document
  - Provider abstraction layer (Task #25)
  - Browser-based embeddings (Task #26)
  - Two-tier caching system
  - Progress tracking utilities
