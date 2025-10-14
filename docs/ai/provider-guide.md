# Adding New AI Providers to Lumara

This guide shows you how to add new AI providers to Lumara. Follow these steps to integrate providers like Gemini API, LM Studio, OpenAI, or Claude.

## Overview

Adding a new provider takes approximately **2-4 hours** and requires changes to 3-4 files:

1. **Provider implementation** (`src/lib/ai/providers/your-provider.ts`)
2. **Registry entry** (`src/lib/ai/registry.ts`)
3. **Type definitions** (`src/lib/ai/types.ts`) - if needed
4. **Tests** (`src/lib/ai/__tests__/your-provider.test.ts`)

Optional:
5. Settings UI (`src/components/settings/AISettings.tsx`) - for user configuration
6. API key management (`src/components/settings/APIKeyManager.tsx`) - if cloud provider

## Prerequisites

- Understanding of TypeScript and async/await
- Familiarity with the AI provider's API documentation
- API key (if adding a cloud provider)
- Test account with provider

## Step-by-Step Guide

### Step 1: Implement AIProvider Interface

Create a new file in `src/lib/ai/providers/` that extends `BaseProvider`:

```typescript
// src/lib/ai/providers/gemini-api.ts
import { BaseProvider } from './base';
import type { ProviderConfig, ProviderHealth } from '../types';
import { ProviderInitializationError } from '../types';

export class GeminiAPIProvider extends BaseProvider {
  // Required properties
  readonly name = 'Google Gemini API';
  readonly type = 'cloud' as const;
  readonly requiresApiKey = true;

  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  // Private state
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1';

  /**
   * Initialize the provider with API key
   */
  async initialize(config?: ProviderConfig): Promise<void> {
    try {
      // Validate required configuration
      if (!config?.apiKey) {
        throw new Error('API key required for Gemini API');
      }

      this.apiKey = config.apiKey;
      this.storeConfig(config);

      // Test the API key with a simple request
      await this.healthCheck();

      if (!(await this.healthCheck()).available) {
        throw new Error('API key validation failed');
      }

      this.markInitialized();
      console.log(`${this.name} initialized successfully`);
    } catch (error) {
      this.resetState();
      throw new ProviderInitializationError(this.name, error);
    }
  }

  /**
   * Generate chat response
   */
  async chat(message: string, context?: string[]): Promise<string> {
    this.ensureInitialized();

    try {
      // Build prompt with optional context
      let prompt = message;
      if (context && context.length > 0) {
        prompt = `Context:\n${context.join('\n\n')}\n\nUser: ${message}`;
      }

      // Make API request
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey!,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: this.config?.temperature || 0.7,
              maxOutputTokens: this.config?.maxTokens || 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(
        `Chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate embeddings (if supported)
   */
  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();

    if (!this.capabilities.embeddings) {
      throw new Error(`${this.name} does not support embeddings`);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/embedding-001:embedContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey!,
          },
          body: JSON.stringify({
            content: { parts: [{ text }] },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding.values;
    } catch (error) {
      throw new Error(
        `Embedding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Health check - verify API is accessible
   */
  async healthCheck(): Promise<ProviderHealth> {
    const now = new Date();

    // Not initialized
    if (!this.initialized || !this.apiKey) {
      return {
        available: false,
        status: 'unavailable',
        message: `${this.name} is not initialized`,
        lastChecked: now,
      };
    }

    // Try a simple API call
    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro`,
        {
          headers: {
            'x-goog-api-key': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        return {
          available: false,
          status: 'error',
          message: `API error: ${response.statusText}`,
          lastChecked: now,
        };
      }

      return {
        available: true,
        status: 'ready',
        message: `${this.name} is ready`,
        lastChecked: now,
      };
    } catch (error) {
      return {
        available: false,
        status: 'error',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastChecked: now,
      };
    }
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    this.apiKey = null;
    this.resetState();
    console.log(`${this.name} disposed`);
  }
}
```

### Step 2: Add to Type Definitions (if needed)

If adding a new provider type, update `src/lib/ai/types.ts`:

```typescript
// src/lib/ai/types.ts

// Add your provider to this type
export type ProviderType =
  | 'chrome-ai'
  | 'gemini'      // ← Add here
  | 'lm-studio'
  | 'openai'
  | 'claude';
```

### Step 3: Register Provider

Add your provider to the registry in `src/lib/ai/registry.ts`:

```typescript
// src/lib/ai/registry.ts
import { ChromeAIProvider } from './providers/chrome-ai';
import { GeminiAPIProvider } from './providers/gemini-api'; // ← Import

export const providerRegistry = {
  'chrome-ai': ChromeAIProvider,
  'gemini': GeminiAPIProvider,  // ← Add here
  // ... other providers
} as const;
```

### Step 4: Write Tests

Create comprehensive tests in `src/lib/ai/__tests__/`:

```typescript
// src/lib/ai/__tests__/gemini-api.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeminiAPIProvider } from '../providers/gemini-api';

describe('GeminiAPIProvider', () => {
  let provider: GeminiAPIProvider;

  beforeEach(() => {
    provider = new GeminiAPIProvider();
  });

  describe('initialization', () => {
    it('initializes with valid API key', async () => {
      // Mock fetch for health check
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await provider.initialize({ apiKey: 'test-key' });

      expect(provider.isReady()).toBe(true);
    });

    it('throws error without API key', async () => {
      await expect(provider.initialize()).rejects.toThrow('API key required');
    });

    it('throws error with invalid API key', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Unauthorized',
      });

      await expect(
        provider.initialize({ apiKey: 'invalid-key' })
      ).rejects.toThrow();
    });
  });

  describe('chat', () => {
    beforeEach(async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      await provider.initialize({ apiKey: 'test-key' });
    });

    it('generates chat response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Hello from Gemini!' }],
              },
            },
          ],
        }),
      });

      const response = await provider.chat('Hello');
      expect(response).toBe('Hello from Gemini!');
    });

    it('includes context in prompt', async () => {
      let capturedBody: any;
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'Response' }] } }],
          }),
        });
      });

      await provider.chat('Question', ['Context 1', 'Context 2']);

      expect(capturedBody.contents[0].parts[0].text).toContain('Context 1');
      expect(capturedBody.contents[0].parts[0].text).toContain('Context 2');
    });

    it('throws error if not initialized', async () => {
      const uninitializedProvider = new GeminiAPIProvider();
      await expect(uninitializedProvider.chat('Hello')).rejects.toThrow(
        'not initialized'
      );
    });

    it('handles API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Rate limit exceeded',
        json: async () => ({ error: { message: 'Too many requests' } }),
      });

      await expect(provider.chat('Hello')).rejects.toThrow('API error');
    });
  });

  describe('embeddings', () => {
    beforeEach(async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });
      await provider.initialize({ apiKey: 'test-key' });
    });

    it('generates embeddings', async () => {
      const mockEmbedding = new Array(768).fill(0.1);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          embedding: { values: mockEmbedding },
        }),
      });

      const embedding = await provider.embed('Test text');
      expect(embedding).toEqual(mockEmbedding);
    });

    it('handles embedding errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(provider.embed('Test')).rejects.toThrow('Embedding failed');
    });
  });

  describe('health check', () => {
    it('returns unavailable when not initialized', async () => {
      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
    });

    it('returns ready when API is accessible', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await provider.initialize({ apiKey: 'test-key' });
      const health = await provider.healthCheck();

      expect(health.available).toBe(true);
      expect(health.status).toBe('ready');
    });

    it('returns error when API is inaccessible', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await provider.initialize({ apiKey: 'test-key' });

      // Make health check fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('error');
    });
  });

  describe('dispose', () => {
    it('cleans up resources', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await provider.initialize({ apiKey: 'test-key' });
      await provider.dispose();

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
    });
  });
});
```

### Step 5: Run Tests

```bash
# Run your provider tests
npm test -- gemini-api.test.ts

# Run all AI tests
npm test -- --testPathPattern=src/lib/ai

# Check coverage
npm test -- --coverage
```

### Step 6: Manual Testing

Create a test script to verify your provider works:

```typescript
// scripts/test-provider.ts
import { GeminiAPIProvider } from './src/lib/ai/providers/gemini-api';

async function test() {
  const provider = new GeminiAPIProvider();

  console.log('Initializing provider...');
  await provider.initialize({
    apiKey: process.env.GEMINI_API_KEY,
  });

  console.log('Health check...');
  const health = await provider.healthCheck();
  console.log(health);

  console.log('Testing chat...');
  const response = await provider.chat('What is 2+2?');
  console.log('Response:', response);

  console.log('Testing embeddings...');
  const embedding = await provider.embed('Hello world');
  console.log('Embedding dimensions:', embedding.length);

  console.log('Cleaning up...');
  await provider.dispose();

  console.log('✅ All tests passed!');
}

test().catch(console.error);
```

Run with: `GEMINI_API_KEY=your_key tsx scripts/test-provider.ts`

## Example Implementations

### LM Studio Provider

```typescript
// src/lib/ai/providers/lm-studio.ts
import { BaseProvider } from './base';

export class LMStudioProvider extends BaseProvider {
  readonly name = 'LM Studio';
  readonly type = 'local' as const;
  readonly requiresApiKey = false;

  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  private baseUrl = 'http://localhost:1234/v1';

  async initialize(config?: ProviderConfig): Promise<void> {
    this.storeConfig(config);

    // Check if LM Studio is running
    const health = await this.healthCheck();
    if (!health.available) {
      throw new ProviderInitializationError(
        this.name,
        new Error('LM Studio is not running on localhost:1234')
      );
    }

    this.markInitialized();
  }

  async chat(message: string, context?: string[]): Promise<string> {
    this.ensureInitialized();

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...(context?.map(c => ({ role: 'system', content: c })) || []),
          { role: 'user', content: message },
        ],
        temperature: this.config?.temperature || 0.7,
        max_tokens: this.config?.maxTokens || 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();

    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
      });

      if (!response.ok) {
        return {
          available: false,
          status: 'error',
          message: 'LM Studio API error',
          lastChecked: new Date(),
        };
      }

      return {
        available: true,
        status: 'ready',
        message: 'LM Studio is running',
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        available: false,
        status: 'unavailable',
        message: 'LM Studio is not running',
        lastChecked: new Date(),
      };
    }
  }

  async dispose(): Promise<void> {
    this.resetState();
  }
}
```

### OpenAI Provider

```typescript
// src/lib/ai/providers/openai.ts
import { BaseProvider } from './base';

export class OpenAIProvider extends BaseProvider {
  readonly name = 'OpenAI';
  readonly type = 'cloud' as const;
  readonly requiresApiKey = true;

  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  async initialize(config?: ProviderConfig): Promise<void> {
    if (!config?.apiKey) {
      throw new Error('API key required for OpenAI');
    }

    this.apiKey = config.apiKey;
    this.storeConfig(config);

    const health = await this.healthCheck();
    if (!health.available) {
      throw new ProviderInitializationError(this.name, new Error('Invalid API key'));
    }

    this.markInitialized();
  }

  async chat(message: string, context?: string[]): Promise<string> {
    this.ensureInitialized();

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config?.modelName || 'gpt-4',
        messages: [
          ...(context?.map(c => ({ role: 'system', content: c })) || []),
          { role: 'user', content: message },
        ],
        temperature: this.config?.temperature || 0.7,
        max_tokens: this.config?.maxTokens || 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();

    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.apiKey) {
      return {
        available: false,
        status: 'unavailable',
        message: 'Not initialized',
        lastChecked: new Date(),
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });

      return {
        available: response.ok,
        status: response.ok ? 'ready' : 'error',
        message: response.ok ? 'OpenAI is ready' : 'API error',
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        available: false,
        status: 'error',
        message: 'Health check failed',
        lastChecked: new Date(),
      };
    }
  }

  async dispose(): Promise<void> {
    this.apiKey = null;
    this.resetState();
  }
}
```

## Provider Checklist

Before submitting your provider implementation, verify:

- [ ] Implements AIProvider interface
- [ ] Extends BaseProvider
- [ ] Declares capabilities correctly
- [ ] Has proper error handling (try/catch)
- [ ] Includes detailed JSDoc comments
- [ ] Health check implementation
- [ ] Registered in registry.ts
- [ ] Added to ProviderType (if needed)
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests work
- [ ] Manual testing passed
- [ ] Documentation updated
- [ ] Example code provided

## Common Pitfalls

### 1. Forgetting to call ensureInitialized()

```typescript
// ❌ Bad - no initialization check
async chat(message: string): Promise<string> {
  const response = await fetch(this.apiUrl, ...);
}

// ✅ Good - check initialization
async chat(message: string): Promise<string> {
  this.ensureInitialized(); // Throws if not initialized
  const response = await fetch(this.apiUrl, ...);
}
```

### 2. Not handling API errors

```typescript
// ❌ Bad - errors leak through
async chat(message: string): Promise<string> {
  const response = await fetch(this.apiUrl, ...);
  const data = await response.json();
  return data.text;
}

// ✅ Good - proper error handling
async chat(message: string): Promise<string> {
  try {
    const response = await fetch(this.apiUrl, ...);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    throw new Error(
      `Chat failed: ${error instanceof Error ? error.message : 'Unknown'}`
    );
  }
}
```

### 3. Missing health check caching

```typescript
// ❌ Bad - no caching
async healthCheck(): Promise<ProviderHealth> {
  // Expensive API call every time
  const response = await fetch(this.apiUrl);
  return { available: response.ok, ... };
}

// ✅ Good - use base class caching
// Base class already implements caching for you!
// Override only if you need custom logic
```

### 4. Not cleaning up in dispose()

```typescript
// ❌ Bad - leaks resources
async dispose(): Promise<void> {
  // Nothing - state persists
}

// ✅ Good - clean up everything
async dispose(): Promise<void> {
  this.apiKey = null;
  this.session = null;
  this.resetState(); // Base class helper
}
```

## Testing Tips

### 1. Mock fetch globally

```typescript
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### 2. Test error paths

```typescript
it('handles network errors', async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
  await expect(provider.chat('Hello')).rejects.toThrow();
});
```

### 3. Use environment variables for real API tests

```typescript
const skipRealTests = !process.env.GEMINI_API_KEY;

describe('real API tests', { skip: skipRealTests }, () => {
  it('works with real API', async () => {
    await provider.initialize({ apiKey: process.env.GEMINI_API_KEY });
    const response = await provider.chat('Hello');
    expect(response).toBeTruthy();
  });
});
```

## Getting Help

- **Examples:** See `docs/ai/examples/` for more code samples
- **Architecture:** Read `docs/ai/architecture.md` for design patterns
- **Issues:** Check `docs/ai/troubleshooting.md` for common problems
- **API Reference:** See `docs/ai/README.md` for full API documentation

## Next Steps

After implementing your provider:

1. **Update documentation** - Add to README.md
2. **Add UI integration** - Settings page, API key management
3. **Performance testing** - Verify meets targets
4. **Security review** - API key handling, error messages
5. **User testing** - Get feedback on UX

Congratulations! You've successfully added a new AI provider to Lumara. 🎉
