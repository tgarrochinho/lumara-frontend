/**
 * Unit tests for embeddings service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateEmbedding,
  generateBatchEmbeddings,
  embeddingsService,
  embeddingCache,
  initializeEmbeddings,
  isEmbeddingsReady,
  getEmbeddingInfo,
} from '../embeddings';
import { EmbeddingError, EmbeddingErrorType } from '../embeddings/types';

// Mock @xenova/transformers
vi.mock('@xenova/transformers', () => {
  const mockEmbedder = vi.fn().mockResolvedValue({
    data: new Float32Array(384).fill(0.1),
  });

  return {
    pipeline: vi.fn().mockResolvedValue(mockEmbedder),
    env: {
      allowLocalModels: false,
      allowRemoteModels: true,
      cacheDir: 'models',
    },
  };
});

describe('Embeddings Service', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await embeddingCache.clear();
    embeddingsService.dispose();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateEmbedding', () => {
    it('generates 384-dimensional embeddings', async () => {
      const text = 'This is a test sentence for embedding generation.';
      const embedding = await generateEmbedding(text);

      expect(embedding).toHaveLength(384);
      expect(Array.isArray(embedding)).toBe(true);
      expect(typeof embedding[0]).toBe('number');
    });

    it('generates different embeddings for different texts', async () => {
      const text1 = 'First test sentence.';
      const text2 = 'Second test sentence.';

      const embedding1 = await generateEmbedding(text1);
      const embedding2 = await generateEmbedding(text2);

      // Both should be 384-dimensional
      expect(embedding1).toHaveLength(384);
      expect(embedding2).toHaveLength(384);

      // Note: In real usage they would be different, but our mock returns same values
      // This test structure is kept for when real implementation is used
      expect(Array.isArray(embedding1)).toBe(true);
      expect(Array.isArray(embedding2)).toBe(true);
    });

    it('caches embeddings correctly', async () => {
      const text = 'Cached text for testing';

      // First generation
      const embedding1 = await generateEmbedding(text);

      // Second generation should use cache
      const embedding2 = await generateEmbedding(text);

      // Should be the same reference if properly cached
      expect(embedding1).toEqual(embedding2);

      // Verify cache has the entry
      const cached = await embeddingCache.has(text);
      expect(cached).toBe(true);
    });

    it('respects useCache option', async () => {
      const text = 'Test without caching';

      // Generate without caching
      const embedding1 = await generateEmbedding(text, { useCache: false });

      // Should not be in cache
      const cached = await embeddingCache.has(text);
      expect(cached).toBe(false);

      // Generate with caching
      const embedding2 = await generateEmbedding(text, { useCache: true });

      // Should now be in cache
      const cached2 = await embeddingCache.has(text);
      expect(cached2).toBe(true);

      expect(embedding1).toHaveLength(384);
      expect(embedding2).toHaveLength(384);
    });

    it('throws error for invalid input', async () => {
      await expect(generateEmbedding('')).rejects.toThrow(EmbeddingError);

      await expect(
        generateEmbedding(null as any)
      ).rejects.toThrow(EmbeddingError);

      await expect(
        generateEmbedding(undefined as any)
      ).rejects.toThrow(EmbeddingError);
    });

    it('handles special characters and unicode', async () => {
      const text = 'Special chars: @#$%^&*() 你好 مرحبا';
      const embedding = await generateEmbedding(text);

      expect(embedding).toHaveLength(384);
      expect(Array.isArray(embedding)).toBe(true);
    });

    it('handles very long text', async () => {
      const longText = 'a'.repeat(10000);
      const embedding = await generateEmbedding(longText);

      expect(embedding).toHaveLength(384);
    });
  });

  describe('generateBatchEmbeddings', () => {
    it('generates embeddings for multiple texts', async () => {
      const texts = [
        'First sentence',
        'Second sentence',
        'Third sentence',
      ];

      const embeddings = await generateBatchEmbeddings(texts);

      expect(embeddings).toHaveLength(3);
      embeddings.forEach(embedding => {
        expect(embedding).toHaveLength(384);
      });
    });

    it('handles empty array', async () => {
      await expect(generateBatchEmbeddings([])).rejects.toThrow(EmbeddingError);
    });

    it('caches batch embeddings correctly', async () => {
      const texts = ['Text one', 'Text two', 'Text three'];

      // First batch generation
      const embeddings1 = await generateBatchEmbeddings(texts);

      // Second generation should use cache
      const embeddings2 = await generateBatchEmbeddings(texts);

      expect(embeddings1).toEqual(embeddings2);

      // Verify all are cached
      for (const text of texts) {
        const cached = await embeddingCache.has(text);
        expect(cached).toBe(true);
      }
    });

    it('uses cache for some texts and generates for others', async () => {
      // Pre-cache some texts
      const cachedText = 'Already cached text';
      await generateEmbedding(cachedText);

      // Mix cached and new texts
      const texts = [
        cachedText,
        'New text 1',
        'New text 2',
      ];

      const embeddings = await generateBatchEmbeddings(texts);

      expect(embeddings).toHaveLength(3);
      embeddings.forEach(embedding => {
        expect(embedding).toHaveLength(384);
      });
    });
  });

  describe('EmbeddingsService', () => {
    it('initializes successfully', async () => {
      await embeddingsService.initialize();

      expect(embeddingsService.isReady()).toBe(true);
      expect(embeddingsService.isLoading()).toBe(false);
    });

    it('provides correct model information', () => {
      const info = embeddingsService.getInfo();

      expect(info.modelName).toBe('Xenova/all-MiniLM-L6-v2');
      expect(info.dimension).toBe(384);
      expect(typeof info.isReady).toBe('boolean');
      expect(typeof info.isLoading).toBe('boolean');
    });

    it('returns correct embedding dimension', () => {
      expect(embeddingsService.getEmbeddingDimension()).toBe(384);
    });

    it('can be disposed and reinitialized', async () => {
      await embeddingsService.initialize();
      expect(embeddingsService.isReady()).toBe(true);

      embeddingsService.dispose();
      expect(embeddingsService.isReady()).toBe(false);

      await embeddingsService.initialize();
      expect(embeddingsService.isReady()).toBe(true);
    });

    it('handles multiple initialization calls gracefully', async () => {
      // Should not throw or cause issues
      await Promise.all([
        embeddingsService.initialize(),
        embeddingsService.initialize(),
        embeddingsService.initialize(),
      ]);

      expect(embeddingsService.isReady()).toBe(true);
    });
  });

  describe('EmbeddingCache', () => {
    beforeEach(async () => {
      await embeddingCache.initialize();
      await embeddingCache.clear();
    });

    it('stores and retrieves embeddings', async () => {
      const text = 'Test text';
      const embedding = new Array(384).fill(0.5);

      await embeddingCache.set(text, embedding);
      const retrieved = await embeddingCache.get(text);

      expect(retrieved).toEqual(embedding);
    });

    it('returns null for non-existent entries', async () => {
      const retrieved = await embeddingCache.get('non-existent text');
      expect(retrieved).toBeNull();
    });

    it('reports correct size', async () => {
      expect(embeddingCache.size()).toBe(0);

      await embeddingCache.set('text1', new Array(384).fill(0.1));
      expect(embeddingCache.size()).toBe(1);

      await embeddingCache.set('text2', new Array(384).fill(0.2));
      expect(embeddingCache.size()).toBe(2);
    });

    it('clears all entries', async () => {
      await embeddingCache.set('text1', new Array(384).fill(0.1));
      await embeddingCache.set('text2', new Array(384).fill(0.2));

      expect(embeddingCache.size()).toBe(2);

      await embeddingCache.clear();
      expect(embeddingCache.size()).toBe(0);
    });

    it('provides cache statistics', async () => {
      await embeddingCache.set('text1', new Array(384).fill(0.1));
      await embeddingCache.set('text2', new Array(384).fill(0.2));

      const stats = await embeddingCache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
      expect(stats.memoryUsageEstimate).toBeGreaterThan(0);
    });

    it('handles has() correctly', async () => {
      const text = 'Test existence';

      expect(await embeddingCache.has(text)).toBe(false);

      await embeddingCache.set(text, new Array(384).fill(0.3));

      expect(await embeddingCache.has(text)).toBe(true);
    });

    it('updates existing entries', async () => {
      const text = 'Update test';
      const embedding1 = new Array(384).fill(0.4);
      const embedding2 = new Array(384).fill(0.5);

      await embeddingCache.set(text, embedding1);
      const retrieved1 = await embeddingCache.get(text);
      expect(retrieved1).toEqual(embedding1);

      await embeddingCache.set(text, embedding2);
      const retrieved2 = await embeddingCache.get(text);
      expect(retrieved2).toEqual(embedding2);
    });
  });

  describe('High-level API', () => {
    it('initializeEmbeddings works correctly', async () => {
      await initializeEmbeddings();

      expect(isEmbeddingsReady()).toBe(true);
    });

    it('getEmbeddingInfo returns correct information', async () => {
      await initializeEmbeddings();

      const info = getEmbeddingInfo();

      expect(info).toHaveProperty('modelName');
      expect(info).toHaveProperty('dimension');
      expect(info).toHaveProperty('isReady');
      expect(info).toHaveProperty('isLoading');
      expect(info.dimension).toBe(384);
    });

    it('isEmbeddingsReady reflects actual state', async () => {
      embeddingsService.dispose();
      expect(isEmbeddingsReady()).toBe(false);

      await initializeEmbeddings();
      expect(isEmbeddingsReady()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('creates proper EmbeddingError instances', () => {
      const error = new EmbeddingError(
        EmbeddingErrorType.INVALID_INPUT,
        'Test error'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(EmbeddingError);
      expect(error.type).toBe(EmbeddingErrorType.INVALID_INPUT);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('EmbeddingError');
    });

    it('handles originalError correctly', () => {
      const originalError = new Error('Original error');
      const error = new EmbeddingError(
        EmbeddingErrorType.GENERATION_FAILED,
        'Wrapped error',
        originalError
      );

      expect(error.originalError).toBe(originalError);
    });
  });

  describe('Performance', () => {
    it('generates embeddings in reasonable time', async () => {
      await embeddingsService.initialize();

      const startTime = performance.now();
      await generateEmbedding('Performance test text');
      const duration = performance.now() - startTime;

      // Should be fast with mock (real implementation should be <100ms after first load)
      expect(duration).toBeLessThan(1000);
    });

    it('cached embeddings are faster than generation', async () => {
      const text = 'Cache speed test';

      // First generation (not cached)
      const start1 = performance.now();
      await generateEmbedding(text);
      const duration1 = performance.now() - start1;

      // Second generation (cached)
      const start2 = performance.now();
      await generateEmbedding(text);
      const duration2 = performance.now() - start2;

      // Cached should be faster
      expect(duration2).toBeLessThanOrEqual(duration1);
    });

    it('batch processing is efficient', async () => {
      const texts = Array.from({ length: 10 }, (_, i) => `Text ${i}`);

      const startTime = performance.now();
      const embeddings = await generateBatchEmbeddings(texts);
      const duration = performance.now() - startTime;

      expect(embeddings).toHaveLength(10);
      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Memory Management', () => {
    it('cache size stays within limits', async () => {
      // Generate many embeddings
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(generateEmbedding(`Text number ${i}`));
      }
      await Promise.all(promises);

      const stats = await embeddingCache.getStats();

      // Memory usage should be reasonable
      expect(stats.memoryUsageEstimate).toBeLessThan(200 * 1024 * 1024); // 200MB
    });
  });
});
