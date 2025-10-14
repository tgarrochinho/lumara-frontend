/**
 * Advanced Caching Strategies with Cache API
 *
 * Provides persistent caching for AI models and large binary assets
 * using the browser's Cache API for cross-session persistence.
 */

/**
 * Cache statistics
 */
export interface CacheInfo {
  /** Total size in bytes */
  size: number;

  /** Number of cached items */
  itemCount: number;

  /** List of cached URLs */
  urls: string[];
}

/**
 * Model cache manager using Cache API
 *
 * Handles persistent storage of AI models and large binary assets
 * across browser sessions using the Cache API.
 */
export class ModelCacheManager {
  private static readonly CACHE_NAME = 'lumara-ai-models';
  private static readonly VERSION = 'v1';
  private static readonly CACHE_KEY = `${ModelCacheManager.CACHE_NAME}-${ModelCacheManager.VERSION}`;

  /**
   * Cache a model from a URL
   *
   * @param url - URL of the model to cache
   * @param data - Model data as ArrayBuffer
   * @returns Promise that resolves when cached
   */
  static async cacheModel(url: string, data: ArrayBuffer): Promise<void> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const response = new Response(data, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'max-age=31536000', // 1 year
        },
      });

      await cache.put(url, response);
    } catch (error) {
      console.error('Failed to cache model:', error);
      throw new Error(`Failed to cache model at ${url}: ${error}`);
    }
  }

  /**
   * Retrieve a cached model
   *
   * @param url - URL of the model to retrieve
   * @returns Model data as ArrayBuffer or null if not cached
   */
  static async getCachedModel(url: string): Promise<ArrayBuffer | null> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const response = await cache.match(url);

      if (response) {
        return await response.arrayBuffer();
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached model:', error);
      return null;
    }
  }

  /**
   * Check if a model is cached
   *
   * @param url - URL of the model to check
   * @returns True if the model is cached
   */
  static async hasCachedModel(url: string): Promise<boolean> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const response = await cache.match(url);
      return response !== undefined;
    } catch (error) {
      console.error('Failed to check cached model:', error);
      return false;
    }
  }

  /**
   * Delete a specific cached model
   *
   * @param url - URL of the model to delete
   * @returns True if deleted successfully
   */
  static async deleteModel(url: string): Promise<boolean> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      return await cache.delete(url);
    } catch (error) {
      console.error('Failed to delete cached model:', error);
      return false;
    }
  }

  /**
   * Clear all cached models
   *
   * @returns Promise that resolves when cache is cleared
   */
  static async clearCache(): Promise<void> {
    try {
      await caches.delete(this.CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear model cache:', error);
      throw new Error('Failed to clear model cache');
    }
  }

  /**
   * Get the total size of cached models
   *
   * @returns Total cache size in bytes
   */
  static async getCacheSize(): Promise<number> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const keys = await cache.keys();
      let totalSize = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }

  /**
   * Get cache information
   *
   * @returns Cache statistics and information
   */
  static async getCacheInfo(): Promise<CacheInfo> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const requests = await cache.keys();
      const urls = requests.map((req) => req.url);
      let totalSize = 0;

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return {
        size: totalSize,
        itemCount: requests.length,
        urls,
      };
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return {
        size: 0,
        itemCount: 0,
        urls: [],
      };
    }
  }

  /**
   * List all cached model URLs
   *
   * @returns Array of cached model URLs
   */
  static async listCachedModels(): Promise<string[]> {
    try {
      const cache = await caches.open(this.CACHE_KEY);
      const requests = await cache.keys();
      return requests.map((req) => req.url);
    } catch (error) {
      console.error('Failed to list cached models:', error);
      return [];
    }
  }

  /**
   * Prune old cache versions
   *
   * Removes caches from previous versions to save space
   */
  static async pruneOldVersions(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        (name) => name.startsWith(this.CACHE_NAME) && name !== this.CACHE_KEY
      );

      await Promise.all(oldCaches.map((name) => caches.delete(name)));
    } catch (error) {
      console.error('Failed to prune old cache versions:', error);
    }
  }

  /**
   * Check if Cache API is supported
   *
   * @returns True if Cache API is available
   */
  static isSupported(): boolean {
    return 'caches' in window;
  }
}

/**
 * Response cache manager for API calls
 *
 * Caches API responses with TTL (time-to-live) support
 */
export class ResponseCacheManager {
  private static readonly CACHE_NAME = 'lumara-api-responses';
  private static readonly DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Cache an API response
   *
   * @param url - Request URL
   * @param data - Response data
   * @param ttlMs - Time to live in milliseconds
   */
  static async cacheResponse(
    url: string,
    data: any,
    ttlMs: number = this.DEFAULT_TTL_MS
  ): Promise<void> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const expiresAt = Date.now() + ttlMs;

      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache-Expires': expiresAt.toString(),
        },
      });

      await cache.put(url, response);
    } catch (error) {
      console.error('Failed to cache response:', error);
    }
  }

  /**
   * Retrieve a cached API response
   *
   * @param url - Request URL
   * @returns Cached data or null if not found or expired
   */
  static async getCachedResponse(url: string): Promise<any | null> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(url);

      if (!response) {
        return null;
      }

      // Check expiration
      const expiresAt = response.headers.get('X-Cache-Expires');
      if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
        // Expired, delete it
        await cache.delete(url);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return null;
    }
  }

  /**
   * Clear expired responses from cache
   */
  static async cleanupExpired(): Promise<void> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const expiresAt = response.headers.get('X-Cache-Expires');
          if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
            await cache.delete(request);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup expired responses:', error);
    }
  }

  /**
   * Clear all cached responses
   */
  static async clearCache(): Promise<void> {
    try {
      await caches.delete(this.CACHE_NAME);
    } catch (error) {
      console.error('Failed to clear response cache:', error);
    }
  }
}

/**
 * Unified cache manager
 *
 * Provides a single interface to manage all caching layers
 */
export class CacheManager {
  /**
   * Get total cache usage across all caches
   *
   * @returns Total size in bytes
   */
  static async getTotalCacheSize(): Promise<number> {
    let totalSize = 0;

    try {
      const modelCacheSize = await ModelCacheManager.getCacheSize();
      totalSize += modelCacheSize;

      // Add response cache size if needed
      // Note: Response cache is typically much smaller
    } catch (error) {
      console.error('Failed to get total cache size:', error);
    }

    return totalSize;
  }

  /**
   * Clear all caches
   */
  static async clearAllCaches(): Promise<void> {
    await Promise.all([
      ModelCacheManager.clearCache(),
      ResponseCacheManager.clearCache(),
    ]);
  }

  /**
   * Get comprehensive cache information
   */
  static async getAllCacheInfo(): Promise<{
    models: CacheInfo;
    totalSize: number;
  }> {
    const [models, totalSize] = await Promise.all([
      ModelCacheManager.getCacheInfo(),
      this.getTotalCacheSize(),
    ]);

    return {
      models,
      totalSize,
    };
  }

  /**
   * Perform cache maintenance
   *
   * Cleans up expired items and old versions
   */
  static async performMaintenance(): Promise<void> {
    await Promise.all([
      ModelCacheManager.pruneOldVersions(),
      ResponseCacheManager.cleanupExpired(),
    ]);
  }

  /**
   * Check if caching is available
   *
   * @returns True if Cache API is supported
   */
  static isAvailable(): boolean {
    return ModelCacheManager.isSupported();
  }
}
