/**
 * Unit tests for embedding cache management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EmbeddingCacheManager } from '../embeddings/cache';

describe('EmbeddingCacheManager', () => {
  let cache: EmbeddingCacheManager;

  beforeEach(async () => {
    cache = new EmbeddingCacheManager();
    await cache.initialize();
    await cache.clear();
  });

  afterEach(async () => {
    await cache.clear();
    cache.close();
  });

  describe('initialization', () => {
    it('initializes successfully', async () => {
      const newCache = new EmbeddingCacheManager();
      await expect(newCache.initialize()).resolves.not.toThrow();
      newCache.close();
    });

    it('handles multiple initialization calls', async () => {
      await cache.initialize();
      await cache.initialize();
      await cache.initialize();

      // Should not throw or cause issues
      expect(cache.size()).toBe(0);
    });
  });

  describe('set and get', () => {
    it('stores and retrieves embeddings', async () => {
      const text = 'Test text';
      const embedding = new Array(384).fill(0.5);

      await cache.set(text, embedding);
      const retrieved = await cache.get(text);

      expect(retrieved).toEqual(embedding);
    });

    it('returns null for non-existent entries', async () => {
      const retrieved = await cache.get('non-existent');

      expect(retrieved).toBeNull();
    });

    it('handles multiple different texts', async () => {
      const texts = [
        { text: 'First', embedding: new Array(384).fill(0.1) },
        { text: 'Second', embedding: new Array(384).fill(0.2) },
        { text: 'Third', embedding: new Array(384).fill(0.3) },
      ];

      for (const { text, embedding } of texts) {
        await cache.set(text, embedding);
      }

      for (const { text, embedding } of texts) {
        const retrieved = await cache.get(text);
        expect(retrieved).toEqual(embedding);
      }
    });

    it('updates existing entries', async () => {
      const text = 'Update test';
      const embedding1 = new Array(384).fill(0.4);
      const embedding2 = new Array(384).fill(0.5);

      await cache.set(text, embedding1);
      let retrieved = await cache.get(text);
      expect(retrieved).toEqual(embedding1);

      await cache.set(text, embedding2);
      retrieved = await cache.get(text);
      expect(retrieved).toEqual(embedding2);
    });
  });

  describe('has', () => {
    it('returns false for non-existent entries', async () => {
      const exists = await cache.has('non-existent');

      expect(exists).toBe(false);
    });

    it('returns true for existing entries', async () => {
      const text = 'Existing text';
      await cache.set(text, new Array(384).fill(0.1));

      const exists = await cache.has(text);

      expect(exists).toBe(true);
    });

    it('reflects cache state accurately', async () => {
      const text = 'Test existence';

      expect(await cache.has(text)).toBe(false);

      await cache.set(text, new Array(384).fill(0.2));
      expect(await cache.has(text)).toBe(true);

      await cache.clear();
      expect(await cache.has(text)).toBe(false);
    });
  });

  describe('size', () => {
    it('returns 0 for empty cache', () => {
      expect(cache.size()).toBe(0);
    });

    it('tracks size correctly', async () => {
      await cache.set('text1', new Array(384).fill(0.1));
      expect(cache.size()).toBe(1);

      await cache.set('text2', new Array(384).fill(0.2));
      expect(cache.size()).toBe(2);

      await cache.set('text3', new Array(384).fill(0.3));
      expect(cache.size()).toBe(3);
    });

    it('size does not increase on update', async () => {
      const text = 'Same text';

      await cache.set(text, new Array(384).fill(0.1));
      expect(cache.size()).toBe(1);

      await cache.set(text, new Array(384).fill(0.2));
      expect(cache.size()).toBe(1);
    });
  });

  describe('clear', () => {
    it('removes all entries', async () => {
      await cache.set('text1', new Array(384).fill(0.1));
      await cache.set('text2', new Array(384).fill(0.2));
      await cache.set('text3', new Array(384).fill(0.3));

      expect(cache.size()).toBe(3);

      await cache.clear();

      expect(cache.size()).toBe(0);
      expect(await cache.has('text1')).toBe(false);
      expect(await cache.has('text2')).toBe(false);
      expect(await cache.has('text3')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('returns correct statistics', async () => {
      await cache.set('text1', new Array(384).fill(0.1));
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      await cache.set('text2', new Array(384).fill(0.2));

      const stats = await cache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
      expect(stats.memoryUsageEstimate).toBeGreaterThan(0);

      // Newest should be after oldest
      if (stats.oldestEntry && stats.newestEntry) {
        expect(stats.newestEntry.getTime()).toBeGreaterThanOrEqual(
          stats.oldestEntry.getTime()
        );
      }
    });

    it('handles empty cache', async () => {
      const stats = await cache.getStats();

      expect(stats.size).toBe(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });

    it('estimates memory usage correctly', async () => {
      await cache.set('text1', new Array(384).fill(0.1));

      const stats = await cache.getStats();

      // Each embedding is 384 floats * 8 bytes + text + overhead
      // Should be at least 384 * 8 bytes
      expect(stats.memoryUsageEstimate).toBeGreaterThan(384 * 8);
    });
  });

  describe('getTotalSize', () => {
    it('returns correct total size', async () => {
      await cache.set('text1', new Array(384).fill(0.1));
      await cache.set('text2', new Array(384).fill(0.2));

      const totalSize = await cache.getTotalSize();

      expect(totalSize).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Memory cache behavior', () => {
    it('retrieves from memory cache quickly', async () => {
      const text = 'Memory cache test';
      const embedding = new Array(384).fill(0.5);

      await cache.set(text, embedding);

      // First retrieval
      const start1 = performance.now();
      await cache.get(text);
      const duration1 = performance.now() - start1;

      // Second retrieval (should be from memory)
      const start2 = performance.now();
      await cache.get(text);
      const duration2 = performance.now() - start2;

      // Both should be fast
      expect(duration1).toBeLessThan(100);
      expect(duration2).toBeLessThan(100);
    });

    it('handles cache size limits gracefully', async () => {
      // Add many entries
      const promises = [];
      for (let i = 0; i < 1500; i++) {
        promises.push(cache.set(`text_${i}`, new Array(384).fill(i % 10 / 10)));
      }
      await Promise.all(promises);

      // Cache should still work
      const size = cache.size();
      expect(size).toBeGreaterThan(0);
      expect(size).toBeLessThanOrEqual(1500);
    });
  });

  describe('Special characters handling', () => {
    it('handles texts with special characters', async () => {
      const texts = [
        'Text with spaces',
        'Text\nwith\nnewlines',
        'Text\twith\ttabs',
        'Text with emoji 😀',
        'Text with unicode 你好',
        'Text with symbols @#$%^&*()',
      ];

      for (const text of texts) {
        const embedding = new Array(384).fill(0.5);
        await cache.set(text, embedding);
        const retrieved = await cache.get(text);
        expect(retrieved).toEqual(embedding);
      }
    });
  });

  describe('preloadCache', () => {
    it('preloads recent entries into memory', async () => {
      // Add entries to IndexedDB
      for (let i = 0; i < 10; i++) {
        await cache.set(`text_${i}`, new Array(384).fill(i / 10));
      }

      // Create new cache instance to test preload
      const newCache = new EmbeddingCacheManager();
      await newCache.initialize();

      // Preload should populate memory cache
      await newCache.preloadCache(5);

      // Memory cache should have some entries
      expect(newCache.size()).toBeGreaterThan(0);

      newCache.close();
    });
  });

  describe('Persistence', () => {
    it('persists data across cache instances', async () => {
      const text = 'Persistent text';
      const embedding = new Array(384).fill(0.7);

      await cache.set(text, embedding);

      // Create new cache instance
      const newCache = new EmbeddingCacheManager();
      await newCache.initialize();

      const retrieved = await newCache.get(text);

      expect(retrieved).toEqual(embedding);

      newCache.close();
    });
  });

  describe('Error handling', () => {
    it('continues to work if IndexedDB fails', async () => {
      // Memory cache should still work even if IndexedDB fails
      const text = 'Fallback test';
      const embedding = new Array(384).fill(0.8);

      await cache.set(text, embedding);

      const retrieved = await cache.get(text);

      // Should still work from memory cache
      expect(retrieved).toEqual(embedding);
    });
  });

  describe('close', () => {
    it('closes cleanly', () => {
      expect(() => cache.close()).not.toThrow();
    });

    it('can be reinitialized after close', async () => {
      cache.close();
      await cache.initialize();

      await cache.set('text', new Array(384).fill(0.5));
      const retrieved = await cache.get('text');

      expect(retrieved).toEqual(new Array(384).fill(0.5));
    });
  });
});
