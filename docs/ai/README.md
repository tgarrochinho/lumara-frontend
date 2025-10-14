# Lumara AI System

## Overview

Lumara's AI system is built on a **provider abstraction pattern** that supports multiple AI providers while starting with Chrome's built-in Gemini Nano. The system is designed to be local-first, privacy-preserving, and easily extensible.

### Key Features

- **Local-first by default** - Chrome AI runs entirely on-device
- **Privacy-preserving** - No data sent to external servers (for local providers)
- **Extensible** - Easy to add new providers (Gemini API, LM Studio, OpenAI, Claude)
- **Zero-cost tier** - Free tier uses browser AI with no API costs
- **Performant** - <100ms embeddings, <2s chat responses
- **Aggressive caching** - Two-tier caching (memory + IndexedDB) for embeddings

### Architecture

```
User Input
    ↓
AI Provider Registry (src/lib/ai/registry.ts)
    ├→ Chrome AI (Gemini Nano)      [v1 - Implemented]
    ├→ Gemini API                   [v2 - Planned]
    ├→ LM Studio                    [v3 - Planned]
    ├→ OpenAI                       [v3 - Planned]
    └→ Claude                       [v3 - Planned]

Embeddings System (src/lib/ai/embeddings/)
    ├→ Transformers.js (MiniLM-L6-v2)
    ├→ Memory Cache
    └→ IndexedDB Cache
```

### Quick Start

```typescript
import { selectProvider } from '@/lib/ai/registry';
import { generateEmbedding } from '@/lib/ai/embeddings';

// Get AI provider (auto-selects best available)
const provider = await selectProvider('chrome-ai');

// Chat with the AI
const response = await provider.chat('Hello! Can you help me organize my thoughts?');

// Generate semantic embedding
const embedding = await generateEmbedding('Some text to embed');
console.log(embedding.length); // 384 dimensions
```

## Components

### 1. Providers (`src/lib/ai/providers/`)

AI providers implement the `AIProvider` interface and handle text generation (chat) capabilities.

#### Implemented Providers

- **`ChromeAIProvider`** - Chrome built-in AI (Gemini Nano)
  - Type: Local (on-device)
  - Requires: Chrome Canary/Dev 127+ with Origin Trial
  - Capabilities: Chat only (embeddings via Transformers.js)
  - Cost: Free

#### Planned Providers

- **`GeminiAPIProvider`** - Google Gemini API (v2)
  - Type: Cloud API
  - Requires: Google API key
  - Capabilities: Chat, embeddings, multimodal

- **`LMStudioProvider`** - Local models via LM Studio (v3)
  - Type: Local (self-hosted)
  - Requires: LM Studio running locally
  - Capabilities: Chat, embeddings

- **`OpenAIProvider`** - OpenAI API (v3)
  - Type: Cloud API
  - Requires: OpenAI API key
  - Capabilities: Chat, embeddings

- **`ClaudeProvider`** - Anthropic Claude (v3)
  - Type: Cloud API
  - Requires: Anthropic API key
  - Capabilities: Chat

### 2. Embeddings (`src/lib/ai/embeddings/`)

Browser-based semantic embeddings using Transformers.js with the MiniLM-L6-v2 model.

**Features:**
- 384-dimensional embeddings
- Two-tier caching strategy (memory + IndexedDB)
- Progress tracking for model downloads
- Retry logic with exponential backoff
- Batch processing support

**Files:**
- `transformers.ts` - Main embedding service
- `cache.ts` - Two-tier caching system
- `types.ts` - Type definitions
- `index.ts` - Public API exports

```typescript
import { generateEmbedding, generateBatchEmbeddings } from '@/lib/ai/embeddings';

// Single embedding (with caching)
const embedding = await generateEmbedding('Hello world');

// Batch embeddings (more efficient)
const embeddings = await generateBatchEmbeddings([
  'First text',
  'Second text',
  'Third text'
]);
```

### 3. Provider Registry (`src/lib/ai/registry.ts`)

Central registry for managing and selecting AI providers.

**Key Functions:**
- `selectProvider(preferred?)` - Select and initialize a provider
- `getAvailableProviders()` - List all registered providers
- `checkProviderAvailability()` - Check which providers are available
- `createProvider(name)` - Create a specific provider instance

```typescript
import { selectProvider, checkProviderAvailability } from '@/lib/ai/registry';

// Auto-select best available provider
const provider = await selectProvider();

// Prefer Chrome AI, fallback to others
const provider = await selectProvider('chrome-ai');

// Check availability without initializing
const availability = await checkProviderAvailability();
console.log(availability); // Map<ProviderName, boolean>
```

### 4. Base Provider (`src/lib/ai/providers/base.ts`)

Abstract base class that provides common functionality for all providers:
- Health checking with caching
- Initialization state tracking
- Configuration management
- Helper methods for concrete implementations

### 5. Progress Tracking (`src/lib/ai/utils/progress.ts`)

Observable progress tracking for async operations like model downloads.

```typescript
import { embeddingProgress } from '@/lib/ai/utils/progress';

// Subscribe to progress updates
const unsubscribe = embeddingProgress.subscribe((progress, message) => {
  console.log(`${progress}% - ${message}`);
});

// Later: unsubscribe
unsubscribe();
```

## Configuration

### Origin Trial Token for Chrome AI

Chrome AI (Gemini Nano) requires an Origin Trial token. Add this to your `index.html`:

```html
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```

**How to get a token:**
1. Visit [Chrome Origin Trials](https://developer.chrome.com/origintrials)
2. Search for "Built-in AI"
3. Register your origin (e.g., `http://localhost:5173`)
4. Copy the token into your `index.html`

### Chrome Flags

Enable these flags in Chrome Canary/Dev:

1. `chrome://flags/#optimization-guide-on-device-model` - Enable
2. `chrome://flags/#prompt-api-for-gemini-nano` - Enable
3. Restart Chrome
4. Wait for model download at `chrome://components` (Optimization Guide)

### Provider Selection Strategy

The registry tries providers in this order:
1. Preferred provider (if specified)
2. All registered providers in registry order
3. Throws `NoProviderAvailableError` if none work

## Performance

### Targets and Typical Performance

| Operation | Target | Typical | Notes |
|-----------|--------|---------|-------|
| First embedding model load | <30s | ~20s | One-time download (~22MB) |
| Subsequent loads | <1s | ~500ms | Cached in browser |
| Single embedding | <100ms | ~50ms | After model loaded |
| Batch embeddings (10 items) | <500ms | ~300ms | Parallel processing |
| Chat response | <2s | ~1s | Chrome AI (Gemini Nano) |
| Similarity search (1K items) | <50ms | ~20ms | In-memory computation |

### Memory Usage

- **Embedding model:** ~22MB (one-time download)
- **Memory cache:** ~1000 embeddings (384 dims × 8 bytes + overhead)
- **IndexedDB:** Unlimited, cleaned up after 30 days
- **Provider sessions:** <10MB

### Optimization Tips

1. **Preload embeddings on app start:**
   ```typescript
   import { initializeEmbeddings } from '@/lib/ai/embeddings';

   await initializeEmbeddings((progress, message) => {
     console.log(`${progress}%: ${message}`);
   });
   ```

2. **Use batch operations when possible:**
   ```typescript
   // Good - processes in parallel
   const embeddings = await generateBatchEmbeddings(texts);

   // Bad - sequential processing
   const embeddings = await Promise.all(texts.map(generateEmbedding));
   ```

3. **Enable caching (enabled by default):**
   ```typescript
   const embedding = await generateEmbedding(text, { useCache: true });
   ```

## Error Handling

### Common Errors

```typescript
import {
  NoProviderAvailableError,
  ProviderInitializationError,
  EmbeddingError,
  EmbeddingErrorType
} from '@/lib/ai';

try {
  const provider = await selectProvider('chrome-ai');
} catch (error) {
  if (error instanceof NoProviderAvailableError) {
    // No AI provider is available
    console.error('No AI provider available:', error.message);
  } else if (error instanceof ProviderInitializationError) {
    // Provider failed to initialize
    console.error('Provider initialization failed:', error.message);
  }
}

try {
  const embedding = await generateEmbedding(text);
} catch (error) {
  if (error instanceof EmbeddingError) {
    switch (error.type) {
      case EmbeddingErrorType.MODEL_LOAD_FAILED:
        console.error('Failed to load embedding model');
        break;
      case EmbeddingErrorType.GENERATION_FAILED:
        console.error('Failed to generate embedding');
        break;
      case EmbeddingErrorType.INVALID_INPUT:
        console.error('Invalid input provided');
        break;
    }
  }
}
```

## Testing

All AI components have comprehensive test coverage (81.72% overall):

```bash
# Run all AI tests
npm test -- --testPathPattern=src/lib/ai

# Run specific test suite
npm test -- chrome-ai.test.ts
npm test -- embeddings.test.ts
npm test -- cache.test.ts
```

### Test Files

- `__tests__/types.test.ts` - Type definitions and custom errors
- `__tests__/base.test.ts` - Base provider functionality
- `__tests__/chrome-ai.test.ts` - Chrome AI provider
- `__tests__/registry.test.ts` - Provider registry
- `__tests__/embeddings.test.ts` - Embedding generation
- `__tests__/cache.test.ts` - Caching system
- `__tests__/progress.test.ts` - Progress tracking

## Documentation

- [Architecture](./architecture.md) - Architecture decisions and design patterns
- [Provider Guide](./provider-guide.md) - Step-by-step guide for adding new providers
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Examples](./examples/) - Code examples for common use cases

## API Reference

### Provider Interface

```typescript
interface AIProvider {
  readonly name: string;
  readonly type: 'local' | 'cloud' | 'hosted';
  readonly requiresApiKey: boolean;
  capabilities: AICapabilities;

  chat(message: string, context?: string[]): Promise<string>;
  embed(text: string): Promise<number[]>;
  initialize(config?: ProviderConfig): Promise<void>;
  dispose(): Promise<void>;
  healthCheck(): Promise<ProviderHealth>;
}
```

### Embedding API

```typescript
// Generate single embedding
function generateEmbedding(
  text: string,
  options?: EmbeddingOptions
): Promise<Embedding>

// Generate batch embeddings
function generateBatchEmbeddings(
  texts: string[],
  options?: EmbeddingOptions
): Promise<Embedding[]>

// Initialize embedding system
function initializeEmbeddings(
  onProgress?: (progress: number, message?: string) => void
): Promise<void>

// Check if ready
function isEmbeddingsReady(): boolean

// Get model info
function getEmbeddingInfo(): {
  modelName: string;
  dimension: number;
  isReady: boolean;
  isLoading: boolean;
}
```

### Cache API

```typescript
class EmbeddingCacheManager {
  async initialize(): Promise<void>
  async set(text: string, embedding: Embedding): Promise<void>
  async get(text: string): Promise<Embedding | null>
  async has(text: string): Promise<boolean>
  async clear(): Promise<void>
  size(): number
  async getStats(): Promise<CacheStats>
  async getTotalSize(): Promise<number>
  async preloadCache(limit?: number): Promise<void>
  close(): void
}
```

## Contributing

When adding new AI features:

1. Follow the established patterns (see [provider-guide.md](./provider-guide.md))
2. Add comprehensive JSDoc comments
3. Write tests with >80% coverage
4. Update this documentation
5. Add examples for common use cases
6. Performance test against targets

## License

Part of the Lumara project. See main LICENSE file.
