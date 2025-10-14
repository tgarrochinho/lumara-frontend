/**
 * Performance Benchmark Tests for AI System
 *
 * Validates that AI operations meet performance targets:
 * - Embedding generation: <100ms (after initial model load)
 * - Similarity search: <50ms for 1000 memories
 * - Provider operations: Fast initialization and response
 *
 * These tests use the mock transformer to ensure consistent results.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateEmbedding, embeddingsService } from '../embeddings/transformers';
import { findSimilar, cosineSimilarity, batchCosineSimilarity } from '../utils/similarity';
import { MockAIProvider } from '../providers/mock';
import { embeddingCache } from '../embeddings/cache';

describe('Performance Benchmarks', () => {
  beforeEach(async () => {
    await embeddingCache.clear();
    embeddingsService.dispose();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Embedding Generation Performance', () => {
    it('generates embedding in <100ms after initialization', async () => {
      // Initialize first (not counted in timing)
      await embeddingsService.initialize();

      // Measure embedding generation time
      const startTime = performance.now();
      await generateEmbedding('test text for performance');
      const duration = performance.now() - startTime;

      // Target: <100ms for embedding generation
      expect(duration).toBeLessThan(100);
    });

    it('cached embeddings are retrieved in <10ms', async () => {
      await embeddingsService.initialize();

      // First generation (creates cache entry)
      const text = 'cached performance test';
      await generateEmbedding(text);

      // Measure cached retrieval time
      const startTime = performance.now();
      await generateEmbedding(text);
      const duration = performance.now() - startTime;

      // Cached retrieval should be very fast
      expect(duration).toBeLessThan(10);
    });

    it('batch embedding generation is efficient', async () => {
      await embeddingsService.initialize();

      const texts = Array.from({ length: 10 }, (_, i) => `batch text ${i}`);

      const startTime = performance.now();
      const embeddings = await Promise.all(
        texts.map(text => generateEmbedding(text, { useCache: false }))
      );
      const duration = performance.now() - startTime;

      expect(embeddings).toHaveLength(10);

      // Target: <1000ms for 10 embeddings (100ms each)
      expect(duration).toBeLessThan(1000);
    });

    it('handles rapid sequential embedding requests', async () => {
      await embeddingsService.initialize();

      const iterations = 20;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        await generateEmbedding(`sequential ${i}`, { useCache: false });
      }

      const duration = performance.now() - startTime;
      const avgTime = duration / iterations;

      // Average should be well under target
      expect(avgTime).toBeLessThan(100);
    });

    it('concurrent embedding generation scales well', async () => {
      await embeddingsService.initialize();

      const concurrent = 10;
      const texts = Array.from({ length: concurrent }, (_, i) => `concurrent ${i}`);

      const startTime = performance.now();
      await Promise.all(texts.map(text => generateEmbedding(text, { useCache: false })));
      const duration = performance.now() - startTime;

      // Concurrent operations should not take 10x longer
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Similarity Search Performance', () => {
    it('searches through 1000 memories in <50ms', async () => {
      // Create 1000 test memories with embeddings
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory content ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

      // Measure search time
      const startTime = performance.now();
      await findSimilar(queryEmbedding, memories, { threshold: 0.7, limit: 10 });
      const duration = performance.now() - startTime;

      // Target: <50ms for 1000 memories
      expect(duration).toBeLessThan(50);
    });

    it('searches through 5000 memories in <250ms', async () => {
      // Create 5000 test memories
      const memories = Array.from({ length: 5000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

      const startTime = performance.now();
      await findSimilar(queryEmbedding, memories, { threshold: 0.7, limit: 10 });
      const duration = performance.now() - startTime;

      // Should scale linearly: ~250ms for 5000
      expect(duration).toBeLessThan(250);
    });

    it('filters by threshold efficiently', async () => {
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

      // High threshold should be just as fast
      const startTime = performance.now();
      await findSimilar(queryEmbedding, memories, { threshold: 0.9, limit: 5 });
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(50);
    });

    it('limits results without performance penalty', async () => {
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

      // Different limits should have similar performance
      const startTime1 = performance.now();
      await findSimilar(queryEmbedding, memories, { threshold: 0.5, limit: 1 });
      const duration1 = performance.now() - startTime1;

      const startTime2 = performance.now();
      await findSimilar(queryEmbedding, memories, { threshold: 0.5, limit: 100 });
      const duration2 = performance.now() - startTime2;

      // Both should be under target
      expect(duration1).toBeLessThan(50);
      expect(duration2).toBeLessThan(50);

      // Should have similar performance (not O(n) in limit)
      expect(Math.abs(duration1 - duration2)).toBeLessThan(30);
    });
  });

  describe('Cosine Similarity Performance', () => {
    it('calculates single similarity in <1ms', () => {
      const vec1 = Array.from({ length: 384 }, () => Math.random());
      const vec2 = Array.from({ length: 384 }, () => Math.random());

      const startTime = performance.now();
      cosineSimilarity(vec1, vec2);
      const duration = performance.now() - startTime;

      // Single calculation should be extremely fast
      expect(duration).toBeLessThan(1);
    });

    it('batch similarity calculation is efficient', () => {
      const query = Array.from({ length: 384 }, () => Math.random());
      const vectors = Array.from(
        { length: 100 },
        () => Array.from({ length: 384 }, () => Math.random())
      );

      const startTime = performance.now();
      batchCosineSimilarity(query, vectors);
      const duration = performance.now() - startTime;

      // 100 calculations should be <10ms
      expect(duration).toBeLessThan(10);
    });

    it('handles large batch calculations', () => {
      const query = Array.from({ length: 384 }, () => Math.random());
      const vectors = Array.from(
        { length: 1000 },
        () => Array.from({ length: 384 }, () => Math.random())
      );

      const startTime = performance.now();
      batchCosineSimilarity(query, vectors);
      const duration = performance.now() - startTime;

      // 1000 calculations should be <50ms
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Provider Performance', () => {
    it('initializes mock provider in <100ms', async () => {
      const provider = new MockAIProvider();

      const startTime = performance.now();
      await provider.initialize();
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(100);
      await provider.dispose();
    });

    it('mock provider chat responds in <10ms', async () => {
      const provider = new MockAIProvider();
      await provider.initialize();

      const startTime = performance.now();
      await provider.chat('test message');
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(10);
      await provider.dispose();
    });

    it('mock provider embedding generation in <10ms', async () => {
      const provider = new MockAIProvider();
      await provider.initialize();

      const startTime = performance.now();
      await provider.embed('test text');
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(10);
      await provider.dispose();
    });

    it('handles rapid provider operations', async () => {
      const provider = new MockAIProvider();
      await provider.initialize();

      const operations = 100;
      const startTime = performance.now();

      for (let i = 0; i < operations; i++) {
        await provider.chat(`message ${i}`);
      }

      const duration = performance.now() - startTime;
      const avgTime = duration / operations;

      expect(avgTime).toBeLessThan(10);
      await provider.dispose();
    });

    it('handles concurrent provider operations', async () => {
      const provider = new MockAIProvider();
      await provider.initialize();

      const concurrent = 50;
      const promises = Array.from({ length: concurrent }, (_, i) =>
        provider.chat(`concurrent ${i}`)
      );

      const startTime = performance.now();
      await Promise.all(promises);
      const duration = performance.now() - startTime;

      // Should handle concurrency well
      expect(duration).toBeLessThan(500);
      await provider.dispose();
    });
  });

  describe('Cache Performance', () => {
    it('cache lookup is fast (<1ms)', async () => {
      await embeddingCache.initialize();

      const text = 'cache test';
      const embedding = Array.from({ length: 384 }, () => 0.5);
      await embeddingCache.set(text, embedding);

      const startTime = performance.now();
      await embeddingCache.get(text);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(1);
    });

    it('cache write is fast (<5ms)', async () => {
      await embeddingCache.initialize();

      const text = 'write test';
      const embedding = Array.from({ length: 384 }, () => 0.5);

      const startTime = performance.now();
      await embeddingCache.set(text, embedding);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(5);
    });

    it('handles multiple cache operations efficiently', async () => {
      await embeddingCache.initialize();

      const operations = 100;
      const startTime = performance.now();

      for (let i = 0; i < operations; i++) {
        const text = `cache entry ${i}`;
        const embedding = Array.from({ length: 384 }, () => Math.random());
        await embeddingCache.set(text, embedding);
      }

      const duration = performance.now() - startTime;

      // 100 write operations should complete quickly
      expect(duration).toBeLessThan(500);
    });

    it('cache statistics retrieval is fast', async () => {
      await embeddingCache.initialize();

      // Add some entries
      for (let i = 0; i < 10; i++) {
        await embeddingCache.set(`text ${i}`, Array.from({ length: 384 }, () => 0.5));
      }

      const startTime = performance.now();
      await embeddingCache.getStats();
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(10);
    });
  });

  describe('End-to-End Performance', () => {
    it('completes full flow in reasonable time', async () => {
      await embeddingsService.initialize();
      const provider = new MockAIProvider();
      await provider.initialize();

      const startTime = performance.now();

      // Full flow: chat → embed → search
      const response = await provider.chat('test query');
      const embedding = await generateEmbedding(response);

      const memories = Array.from({ length: 100 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      await findSimilar(embedding, memories, { threshold: 0.7 });

      const duration = performance.now() - startTime;

      // End-to-end should complete quickly
      expect(duration).toBeLessThan(200);

      await provider.dispose();
    });

    it('handles batch memory processing efficiently', async () => {
      await embeddingsService.initialize();

      const batchSize = 20;
      const texts = Array.from({ length: batchSize }, (_, i) => `memory ${i}`);

      const startTime = performance.now();

      // Process batch: generate all embeddings
      const embeddings = await Promise.all(
        texts.map(text => generateEmbedding(text, { useCache: false }))
      );

      // Search each against the set
      const searchPromises = embeddings.map(emb =>
        findSimilar(emb, [], { threshold: 0.7 })
      );
      await Promise.all(searchPromises);

      const duration = performance.now() - startTime;

      // Batch processing should be efficient
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Memory Usage', () => {
    it('embeddings do not cause memory bloat', async () => {
      await embeddingsService.initialize();

      // Generate many embeddings
      const count = 500;
      const embeddings = [];

      for (let i = 0; i < count; i++) {
        const emb = await generateEmbedding(`text ${i}`);
        embeddings.push(emb);
      }

      // Check cache stats
      const stats = await embeddingCache.getStats();

      // Each embedding is ~384 floats * 8 bytes = ~3KB
      // 500 embeddings = ~1.5MB + overhead
      expect(stats.memoryUsageEstimate).toBeLessThan(5 * 1024 * 1024); // 5MB max
    });

    it('cache clear releases memory', async () => {
      await embeddingCache.initialize();

      // Add entries
      for (let i = 0; i < 100; i++) {
        await embeddingCache.set(`text ${i}`, Array.from({ length: 384 }, () => 0.5));
      }

      const statsBefore = await embeddingCache.getStats();
      expect(statsBefore.size).toBe(100);

      // Clear cache
      await embeddingCache.clear();

      const statsAfter = await embeddingCache.getStats();
      expect(statsAfter.size).toBe(0);
      expect(statsAfter.memoryUsageEstimate).toBe(0);
    });
  });

  describe('Scalability Tests', () => {
    it('performance scales linearly with data size', async () => {
      // Test with different data sizes
      const sizes = [100, 500, 1000];
      const durations: number[] = [];

      for (const size of sizes) {
        const memories = Array.from({ length: size }, (_, i) => ({
          id: `mem-${i}`,
          content: `memory ${i}`,
          embedding: Array.from({ length: 384 }, () => Math.random()),
        }));

        const queryEmbedding = Array.from({ length: 384 }, () => Math.random());

        const startTime = performance.now();
        await findSimilar(queryEmbedding, memories, { threshold: 0.7 });
        const duration = performance.now() - startTime;

        durations.push(duration);
      }

      // Check that growth is roughly linear (not exponential)
      const ratio500to100 = durations[1] / durations[0];
      const ratio1000to500 = durations[2] / durations[1];

      // Ratios should be similar for linear scaling
      expect(Math.abs(ratio500to100 - ratio1000to500)).toBeLessThan(3);
    });

    it('handles increasing cache size gracefully', async () => {
      await embeddingCache.initialize();

      const cacheSizes = [10, 50, 100];
      const durations: number[] = [];

      for (const size of cacheSizes) {
        await embeddingCache.clear();

        // Fill cache
        for (let i = 0; i < size; i++) {
          await embeddingCache.set(`text ${i}`, Array.from({ length: 384 }, () => 0.5));
        }

        // Measure lookup time
        const startTime = performance.now();
        await embeddingCache.get('text 0');
        const duration = performance.now() - startTime;

        durations.push(duration);
      }

      // Lookup time should stay fast regardless of cache size
      durations.forEach(d => expect(d).toBeLessThan(5));
    });
  });

  describe('Performance Regression Detection', () => {
    it('embedding generation stays within bounds', async () => {
      await embeddingsService.initialize();

      const samples = 10;
      const times: number[] = [];

      for (let i = 0; i < samples; i++) {
        const startTime = performance.now();
        await generateEmbedding(`sample ${i}`, { useCache: false });
        times.push(performance.now() - startTime);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / samples;
      const maxTime = Math.max(...times);

      // Average should be well under target
      expect(avgTime).toBeLessThan(100);

      // No single sample should be extremely slow (regression indicator)
      expect(maxTime).toBeLessThan(200);
    });

    it('similarity search stays within bounds', async () => {
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `memory ${i}`,
        embedding: Array.from({ length: 384 }, () => Math.random()),
      }));

      const samples = 10;
      const times: number[] = [];

      for (let i = 0; i < samples; i++) {
        const queryEmbedding = Array.from({ length: 384 }, () => Math.random());
        const startTime = performance.now();
        await findSimilar(queryEmbedding, memories, { threshold: 0.7 });
        times.push(performance.now() - startTime);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / samples;
      const maxTime = Math.max(...times);

      // Average should be under target
      expect(avgTime).toBeLessThan(50);

      // No outliers
      expect(maxTime).toBeLessThan(100);
    });
  });
});
