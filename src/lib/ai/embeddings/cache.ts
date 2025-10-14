/**
 * Embedding cache management with memory and IndexedDB storage
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { EmbeddingCache, CacheStats, Embedding } from './types';

/**
 * IndexedDB schema for embedding cache
 */
interface EmbeddingDB extends DBSchema {
  embeddings: {
    key: string;
    value: {
      text: string;
      embedding: Embedding;
      timestamp: number;
    };
  };
}

/**
 * Maximum number of embeddings to store in memory cache
 */
const MAX_MEMORY_CACHE_SIZE = 1000;

/**
 * Maximum age of cached embeddings (30 days)
 */
const MAX_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Manages embedding caching with two-tier storage:
 * - Memory cache (Map) for fast access during session
 * - IndexedDB for persistent storage across sessions
 */
export class EmbeddingCacheManager {
  private memoryCache = new Map<string, EmbeddingCache>();
  private db: IDBPDatabase<EmbeddingDB> | null = null;
  private dbPromise: Promise<IDBPDatabase<EmbeddingDB>> | null = null;
  private initializationError: Error | null = null;

  /**
   * Initialize the cache manager and open IndexedDB connection
   */
  async initialize(): Promise<void> {
    if (this.db) return;
    if (this.dbPromise) return this.dbPromise.then(() => {});
    if (this.initializationError) throw this.initializationError;

    try {
      this.dbPromise = openDB<EmbeddingDB>('lumara-embeddings', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('embeddings')) {
            db.createObjectStore('embeddings', { keyPath: 'text' });
          }
        },
      });

      this.db = await this.dbPromise;

      // Clean up old entries on initialization
      await this.cleanupOldEntries();
    } catch (error) {
      this.initializationError = error as Error;
      console.error('Failed to initialize embedding cache:', error);
      // Continue without IndexedDB - memory cache will still work
    }
  }

  /**
   * Generate a cache key for the given text
   * Uses a simple hash for now, could be upgraded to crypto.subtle.digest
   */
  private getCacheKey(text: string): string {
    // Simple hash function for cache keys
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `emb_${hash}`;
  }

  /**
   * Store an embedding in both memory and persistent cache
   */
  async set(text: string, embedding: Embedding): Promise<void> {
    const cacheEntry: EmbeddingCache = {
      text,
      embedding,
      timestamp: new Date(),
    };

    // Always store in memory cache
    this.memoryCache.set(text, cacheEntry);

    // Enforce memory cache size limit (LRU-style)
    if (this.memoryCache.size > MAX_MEMORY_CACHE_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    // Try to store in IndexedDB
    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        await this.db.put('embeddings', {
          text,
          embedding,
          timestamp: cacheEntry.timestamp.getTime(),
        });
      }
    } catch (error) {
      console.error('Failed to store embedding in IndexedDB:', error);
      // Continue - memory cache is still valid
    }
  }

  /**
   * Retrieve an embedding from cache (checks memory first, then IndexedDB)
   */
  async get(text: string): Promise<Embedding | null> {
    // Check memory cache first
    const memoryCached = this.memoryCache.get(text);
    if (memoryCached) {
      return memoryCached.embedding;
    }

    // Check IndexedDB
    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        const cached = await this.db.get('embeddings', text);
        if (cached) {
          const cacheEntry: EmbeddingCache = {
            text: cached.text,
            embedding: cached.embedding,
            timestamp: new Date(cached.timestamp),
          };

          // Restore to memory cache for faster subsequent access
          this.memoryCache.set(text, cacheEntry);

          return cached.embedding;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve embedding from IndexedDB:', error);
    }

    return null;
  }

  /**
   * Check if an embedding exists in cache
   */
  async has(text: string): Promise<boolean> {
    // Check memory cache first
    if (this.memoryCache.has(text)) {
      return true;
    }

    // Check IndexedDB
    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        const cached = await this.db.get('embeddings', text);
        return !!cached;
      }
    } catch (error) {
      console.error('Failed to check IndexedDB cache:', error);
    }

    return false;
  }

  /**
   * Clear all cached embeddings from both memory and IndexedDB
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        await this.db.clear('embeddings');
      }
    } catch (error) {
      console.error('Failed to clear IndexedDB cache:', error);
    }
  }

  /**
   * Get the number of embeddings in memory cache
   */
  size(): number {
    return this.memoryCache.size;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    let oldestEntry: Date | null = null;
    let newestEntry: Date | null = null;

    // Check memory cache
    for (const entry of this.memoryCache.values()) {
      if (!oldestEntry || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (!newestEntry || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    // Check IndexedDB for more complete stats
    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        const tx = this.db.transaction('embeddings', 'readonly');
        const store = tx.objectStore('embeddings');
        let cursor = await store.openCursor();

        while (cursor) {
          const timestamp = new Date(cursor.value.timestamp);
          if (!oldestEntry || timestamp < oldestEntry) {
            oldestEntry = timestamp;
          }
          if (!newestEntry || timestamp > newestEntry) {
            newestEntry = timestamp;
          }
          cursor = await cursor.continue();
        }
      }
    } catch (error) {
      console.error('Failed to get cache stats from IndexedDB:', error);
    }

    // Estimate memory usage (rough calculation)
    // Each embedding is 384 floats * 8 bytes + text + overhead
    const memoryUsageEstimate = this.memoryCache.size * (384 * 8 + 100);

    return {
      size: this.memoryCache.size,
      oldestEntry,
      newestEntry,
      memoryUsageEstimate,
    };
  }

  /**
   * Remove old entries from IndexedDB to prevent unlimited growth
   */
  private async cleanupOldEntries(): Promise<void> {
    try {
      if (!this.db) return;

      const cutoffTime = Date.now() - MAX_CACHE_AGE_MS;
      const tx = this.db.transaction('embeddings', 'readwrite');
      const store = tx.objectStore('embeddings');
      let cursor = await store.openCursor();

      while (cursor) {
        if (cursor.value.timestamp < cutoffTime) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }

      await tx.done;
    } catch (error) {
      console.error('Failed to cleanup old cache entries:', error);
    }
  }

  /**
   * Get total cache size including IndexedDB
   */
  async getTotalSize(): Promise<number> {
    let total = this.memoryCache.size;

    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        const count = await this.db.count('embeddings');
        total = Math.max(total, count);
      }
    } catch (error) {
      console.error('Failed to get total cache size:', error);
    }

    return total;
  }

  /**
   * Preload cache from IndexedDB into memory (useful on app start)
   */
  async preloadCache(limit: number = 100): Promise<void> {
    try {
      if (!this.db) await this.initialize();
      if (this.db) {
        const tx = this.db.transaction('embeddings', 'readonly');
        const store = tx.objectStore('embeddings');
        let cursor = await store.openCursor(null, 'prev'); // Start with newest

        let count = 0;
        while (cursor && count < limit) {
          const cacheEntry: EmbeddingCache = {
            text: cursor.value.text,
            embedding: cursor.value.embedding,
            timestamp: new Date(cursor.value.timestamp),
          };
          this.memoryCache.set(cursor.value.text, cacheEntry);
          cursor = await cursor.continue();
          count++;
        }
      }
    } catch (error) {
      console.error('Failed to preload cache:', error);
    }
  }

  /**
   * Close the IndexedDB connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbPromise = null;
    }
  }
}

/**
 * Singleton instance of the embedding cache manager
 */
export const embeddingCache = new EmbeddingCacheManager();
