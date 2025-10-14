# Basic AI Usage Examples

This guide shows common patterns for using Lumara's AI system.

## Provider Selection and Chat

### Auto-Select Provider

```typescript
import { selectProvider } from '@/lib/ai';

async function chatWithAI() {
  // Automatically select best available provider
  const provider = await selectProvider();

  console.log(`Using: ${provider.name}`);

  // Send a message
  const response = await provider.chat('Hello! How can you help me?');
  console.log('AI:', response);

  // Clean up when done
  await provider.dispose();
}
```

### Prefer Specific Provider

```typescript
import { selectProvider } from '@/lib/ai';

async function useChromeAI() {
  try {
    // Try Chrome AI first, fallback if unavailable
    const provider = await selectProvider('chrome-ai');
    const response = await provider.chat('Help me organize my thoughts');
    console.log(response);
  } catch (error) {
    console.error('Chrome AI not available:', error);
  }
}
```

### Chat with Context

```typescript
import { selectProvider } from '@/lib/ai';

async function chatWithContext() {
  const provider = await selectProvider();

  // Previous conversation context
  const context = [
    'User is learning TypeScript',
    'Prefers functional programming style',
    'Working on a web application',
  ];

  const response = await provider.chat(
    'How should I handle async errors?',
    context
  );

  console.log(response);
}
```

## Embeddings

### Generate Single Embedding

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';

async function embedText() {
  const text = 'I need to remember to call mom tomorrow';

  // Generate 384-dimensional embedding
  const embedding = await generateEmbedding(text);

  console.log('Dimensions:', embedding.length); // 384
  console.log('First few values:', embedding.slice(0, 5));
}
```

### Batch Embeddings

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';

async function embedMultiple() {
  const texts = [
    'Buy groceries',
    'Finish project report',
    'Call dentist',
    'Review pull requests',
  ];

  // Process all in parallel (efficient!)
  const embeddings = await generateBatchEmbeddings(texts);

  console.log(`Generated ${embeddings.length} embeddings`);

  // Each embedding is 384 dimensions
  embeddings.forEach((emb, i) => {
    console.log(`${texts[i]}: [${emb.slice(0, 3).join(', ')}...]`);
  });
}
```

### Preload Embeddings

```typescript
import { initializeEmbeddings } from '@/lib/ai/embeddings';

async function preloadOnAppStart() {
  console.log('Loading embedding model...');

  await initializeEmbeddings((progress, message) => {
    // Show progress to user
    console.log(`${progress.toFixed(1)}%: ${message}`);
  });

  console.log('✅ Model ready!');
}
```

## React Integration

### Provider Hook

```typescript
// hooks/useAIProvider.ts
import { useState, useEffect } from 'react';
import { selectProvider } from '@/lib/ai';
import type { AIProvider } from '@/lib/ai';

export function useAIProvider(preferred?: string) {
  const [provider, setProvider] = useState<AIProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const p = await selectProvider(preferred);
        if (mounted) {
          setProvider(p);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      provider?.dispose();
    };
  }, [preferred]);

  return { provider, loading, error };
}
```

### Chat Component

```typescript
// components/AIChat.tsx
import { useState } from 'react';
import { useAIProvider } from '@/hooks/useAIProvider';

export function AIChat() {
  const { provider, loading, error } = useAIProvider();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [chatting, setChatting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!provider || !message) return;

    setChatting(true);
    try {
      const result = await provider.chat(message);
      setResponse(result);
      setMessage('');
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setChatting(false);
    }
  }

  if (loading) return <div>Loading AI...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Chat with {provider?.name}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={chatting}
        />
        <button type="submit" disabled={chatting}>
          {chatting ? 'Thinking...' : 'Send'}
        </button>
      </form>

      {response && (
        <div className="response">
          <strong>AI:</strong> {response}
        </div>
      )}
    </div>
  );
}
```

### Embedding Progress Component

```typescript
// components/EmbeddingProgress.tsx
import { useState, useEffect } from 'react';
import { embeddingProgress } from '@/lib/ai/utils/progress';

export function EmbeddingProgress() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Subscribe to progress updates
    const unsubscribe = embeddingProgress.subscribe((p, m) => {
      setProgress(p);
      setMessage(m || '');
    });

    return unsubscribe;
  }, []);

  if (progress === 0 || progress === 100) {
    return null; // Don't show when idle or complete
  }

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
      <span>{message}</span>
    </div>
  );
}
```

## Error Handling

### Try-Catch Pattern

```typescript
import { selectProvider, NoProviderAvailableError } from '@/lib/ai';
import { generateEmbedding, EmbeddingError, EmbeddingErrorType } from '@/lib/ai/embeddings';

async function robustAIOperation() {
  // Provider errors
  try {
    const provider = await selectProvider('chrome-ai');
    const response = await provider.chat('Hello');
  } catch (error) {
    if (error instanceof NoProviderAvailableError) {
      console.error('No AI provider available');
      // Show user setup instructions
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Embedding errors
  try {
    const embedding = await generateEmbedding('Some text');
  } catch (error) {
    if (error instanceof EmbeddingError) {
      switch (error.type) {
        case EmbeddingErrorType.MODEL_LOAD_FAILED:
          console.error('Failed to load model');
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
}
```

### Retry Logic

```typescript
async function generateEmbeddingWithRetry(
  text: string,
  maxRetries = 3
): Promise<number[]> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateEmbedding(text);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

## Cache Management

### Clear Cache

```typescript
import { embeddingCache } from '@/lib/ai/embeddings';

async function clearAllCaches() {
  // Clear embedding cache
  await embeddingCache.clear();

  console.log('✅ Cache cleared');
}
```

### Check Cache Stats

```typescript
import { embeddingCache } from '@/lib/ai/embeddings';

async function showCacheStats() {
  const stats = await embeddingCache.getStats();

  console.log('Cache Statistics:');
  console.log('  Size:', stats.size);
  console.log('  Memory usage:', (stats.memoryUsageEstimate / 1024 / 1024).toFixed(2), 'MB');
  console.log('  Oldest:', stats.oldestEntry);
  console.log('  Newest:', stats.newestEntry);
}
```

### Preload Cache

```typescript
import { embeddingCache } from '@/lib/ai/embeddings';

async function warmupCache() {
  // Load most recent 100 embeddings into memory
  await embeddingCache.preloadCache(100);

  console.log('✅ Cache warmed up');
}
```

## Health Monitoring

### Check Provider Health

```typescript
import { selectProvider } from '@/lib/ai';

async function monitorProviderHealth() {
  const provider = await selectProvider();

  // Check health
  const health = await provider.healthCheck();

  console.log('Provider Health:');
  console.log('  Available:', health.available);
  console.log('  Status:', health.status);
  console.log('  Message:', health.message);
  console.log('  Last checked:', health.lastChecked);

  // Health status values:
  // - 'ready': Provider is working
  // - 'initializing': Provider is loading
  // - 'error': Provider has an error
  // - 'unavailable': Provider cannot be used
}
```

### Check All Providers

```typescript
import { checkProviderAvailability, getAvailableProviders } from '@/lib/ai';

async function checkAllProviders() {
  const providers = getAvailableProviders();
  console.log('Registered providers:', providers);

  const availability = await checkProviderAvailability();

  console.log('\nAvailability:');
  availability.forEach((available, name) => {
    console.log(`  ${name}: ${available ? '✅ Available' : '❌ Unavailable'}`);
  });
}
```

## Performance Optimization

### Batch Operations

```typescript
// ❌ Bad - sequential processing
async function slowBatchEmbeddings(texts: string[]) {
  const embeddings: number[][] = [];

  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }

  return embeddings;
}

// ✅ Good - parallel processing
async function fastBatchEmbeddings(texts: string[]) {
  return await generateBatchEmbeddings(texts);
}
```

### Measure Performance

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';

async function measureEmbeddingSpeed() {
  const text = 'Sample text for embedding';

  // Warm up
  await generateEmbedding(text);

  // Measure
  const times: number[] = [];
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    await generateEmbedding(text);
    times.push(performance.now() - start);
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  console.log(`Average: ${avg.toFixed(1)}ms`);
  console.log(`Min: ${Math.min(...times).toFixed(1)}ms`);
  console.log(`Max: ${Math.max(...times).toFixed(1)}ms`);
}
```

### Chunked Processing

```typescript
async function processLargeDataset(texts: string[], chunkSize = 100) {
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);

    console.log(`Processing chunk ${i / chunkSize + 1}...`);
    const embeddings = await generateBatchEmbeddings(chunk);

    results.push(...embeddings);

    // Optional: pause between chunks to avoid overwhelming browser
    if (i + chunkSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
```

## Advanced Usage

### Custom Configuration

```typescript
import { createProvider } from '@/lib/ai';

async function useCustomConfig() {
  // Create provider manually
  const provider = createProvider('chrome-ai');

  // Initialize with custom config
  await provider.initialize({
    temperature: 0.9, // More creative
    maxTokens: 2048, // Longer responses
  });

  const response = await provider.chat('Tell me a story');
  console.log(response);
}
```

### Multiple Providers

```typescript
import { selectProvider } from '@/lib/ai';

async function useMultipleProviders() {
  // Use Chrome AI for chat
  const chatProvider = await selectProvider('chrome-ai');

  // Use Gemini for embeddings
  const embeddingProvider = await selectProvider('gemini');

  // Use them together
  const chatResponse = await chatProvider.chat('Explain quantum computing');
  const embedding = await embeddingProvider.embed(chatResponse);

  console.log('Response:', chatResponse);
  console.log('Embedding:', embedding.slice(0, 5));
}
```

### Streaming (Future)

```typescript
// Note: Not yet implemented, but planned
async function streamResponse() {
  const provider = await selectProvider();

  if (!provider.capabilities.streaming) {
    console.log('Streaming not supported by this provider');
    return;
  }

  // Future API:
  // for await (const chunk of provider.chatStream('Tell me a story')) {
  //   process.stdout.write(chunk);
  // }
}
```

## Next Steps

- See [provider-guide.md](../provider-guide.md) for adding new providers
- See [architecture.md](../architecture.md) for system design
- See [troubleshooting.md](../troubleshooting.md) for common issues
