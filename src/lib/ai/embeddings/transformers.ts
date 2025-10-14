/**
 * Transformers.js wrapper for browser-based semantic embeddings
 * Uses MiniLM-L6-v2 model for 384-dimensional embeddings
 */

import { pipeline, env } from '@xenova/transformers';
import { embeddingCache } from './cache';
import { embeddingProgress } from '../utils/progress';
import { performanceMonitor } from '../performance';
import { ModelCacheManager } from '../cache-strategy';
import type {
  Embedding,
  EmbeddingOptions,
  DownloadProgress,
} from './types';
import { EmbeddingError, EmbeddingErrorType } from './types';

// Configure Transformers.js environment
env.allowLocalModels = false; // Use CDN
env.allowRemoteModels = true;

// Set cache directory for models
env.cacheDir = 'models';

// Enable Cache API for model persistence if available
if (ModelCacheManager.isSupported()) {
  // Transformers.js will use IndexedDB by default, but we can add
  // additional Cache API layer for cross-session persistence
  console.log('Cache API available for model persistence');
}

/**
 * In-memory memoization for embeddings currently being generated
 * Prevents duplicate requests for the same text
 */
const embeddingMemo = new Map<string, Promise<Embedding>>();

/**
 * Service for generating semantic embeddings using Transformers.js
 */
class TransformersEmbeddingService {
  private embedder: any = null;
  private loading: boolean = false;
  private loadPromise: Promise<any> | null = null;
  private readonly maxRetries: number = 3;
  private readonly modelName: string = 'Xenova/all-MiniLM-L6-v2';

  /**
   * Initialize the embedding model
   * @param onProgress Optional callback for download progress
   */
  async initialize(
    onProgress?: (progress: number, message?: string) => void
  ): Promise<void> {
    if (this.embedder) return;
    if (this.loadPromise) return this.loadPromise;

    this.loading = true;
    this.loadPromise = this.loadModelWithRetry(onProgress);

    try {
      this.embedder = await this.loadPromise;
      this.loading = false;
      embeddingProgress.complete('Model loaded successfully');
    } catch (error) {
      this.loading = false;
      this.loadPromise = null;
      embeddingProgress.error(
        error instanceof Error ? error.message : 'Model load failed'
      );
      throw new EmbeddingError(
        EmbeddingErrorType.MODEL_LOAD_FAILED,
        'Failed to load embedding model',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Load the model with retry logic
   */
  private async loadModelWithRetry(
    onProgress?: (progress: number, message?: string) => void
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const message = `Retry attempt ${attempt}/${this.maxRetries}`;
          embeddingProgress.update((attempt / this.maxRetries) * 10, message);
          onProgress?.(0, message);

          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }

        return await this.loadModel(onProgress);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Model load attempt ${attempt + 1} failed:`, error);

        if (attempt === this.maxRetries) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error('Model load failed after retries');
  }

  /**
   * Load the embedding model from CDN
   */
  private async loadModel(
    onProgress?: (progress: number, message?: string) => void
  ): Promise<any> {
    embeddingProgress.update(0, 'Starting model download...');
    onProgress?.(0, 'Starting model download...');

    const model = await pipeline('feature-extraction', this.modelName, {
      progress_callback: (data: DownloadProgress) => {
        if (data.status === 'progress') {
          const progress = (data.loaded / data.total) * 100;
          const message = data.file
            ? `Downloading ${data.file}: ${progress.toFixed(1)}%`
            : `Downloading: ${progress.toFixed(1)}%`;

          embeddingProgress.update(progress, message);
          onProgress?.(progress, message);
        } else if (data.status === 'done') {
          const message = data.file
            ? `Downloaded ${data.file}`
            : 'Download complete';
          embeddingProgress.update(100, message);
          onProgress?.(100, message);
        }
      },
    });

    return model;
  }

  /**
   * Generate an embedding for a single text
   * @param text The text to embed
   * @param options Embedding generation options
   * @returns 384-dimensional embedding vector
   */
  async generateEmbedding(
    text: string,
    options: EmbeddingOptions = {}
  ): Promise<Embedding> {
    if (!text || typeof text !== 'string') {
      throw new EmbeddingError(
        EmbeddingErrorType.INVALID_INPUT,
        'Text must be a non-empty string'
      );
    }

    // Ensure model is loaded
    if (!this.embedder) {
      await this.initialize();
    }

    try {
      // Use performance monitoring
      return await performanceMonitor.measure('embedding-generation', async () => {
        const output = await this.embedder(text, {
          pooling: options.pooling || 'mean',
          normalize: options.normalize !== false, // Default to true
        });

        const embedding: Embedding = Array.from(output.data);
        return embedding;
      });
    } catch (error) {
      throw new EmbeddingError(
        EmbeddingErrorType.GENERATION_FAILED,
        `Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param texts Array of texts to embed
   * @param options Embedding generation options
   * @returns Array of 384-dimensional embedding vectors
   */
  async generateBatchEmbeddings(
    texts: string[],
    options: EmbeddingOptions = {}
  ): Promise<Embedding[]> {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new EmbeddingError(
        EmbeddingErrorType.INVALID_INPUT,
        'Texts must be a non-empty array'
      );
    }

    // Ensure model is loaded
    if (!this.embedder) {
      await this.initialize();
    }

    // Use performance monitoring for batch operations
    return await performanceMonitor.measure('batch-embedding-generation', async () => {
      const batchSize = options.batchSize || 10;
      const embeddings: Embedding[] = [];

      // Process in smaller batches to avoid memory issues
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);

        // Process batch in parallel
        const batchResults = await Promise.all(
          batch.map((text) => this.generateEmbedding(text, options))
        );

        embeddings.push(...batchResults);
      }

      return embeddings;
    });
  }

  /**
   * Check if the model is ready to use
   */
  isReady(): boolean {
    return this.embedder !== null && !this.loading;
  }

  /**
   * Check if the model is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Get the model name being used
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
   * Get the expected embedding dimension
   */
  getEmbeddingDimension(): number {
    return 384; // MiniLM-L6-v2 produces 384-dimensional embeddings
  }

  /**
   * Dispose of the model and free resources
   */
  dispose(): void {
    // Transformers.js handles cleanup automatically
    this.embedder = null;
    this.loadPromise = null;
    this.loading = false;
  }

  /**
   * Get model information
   */
  getInfo() {
    return {
      modelName: this.modelName,
      dimension: this.getEmbeddingDimension(),
      isReady: this.isReady(),
      isLoading: this.isLoading(),
    };
  }

  /**
   * Get cache information for model persistence
   */
  async getCacheInfo() {
    if (!ModelCacheManager.isSupported()) {
      return {
        supported: false,
        size: 0,
        itemCount: 0,
      };
    }

    const info = await ModelCacheManager.getCacheInfo();
    return {
      supported: true,
      size: info.size,
      itemCount: info.itemCount,
      urls: info.urls,
    };
  }

  /**
   * Clear model cache
   */
  async clearModelCache() {
    if (ModelCacheManager.isSupported()) {
      await ModelCacheManager.clearCache();
    }
  }
}

/**
 * Singleton instance of the embedding service
 */
export const embeddingsService = new TransformersEmbeddingService();

/**
 * Generate an embedding with caching support and memoization
 * @param text The text to embed
 * @param options Options for embedding generation
 * @returns 384-dimensional embedding vector
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<Embedding> {
  const useCache = options.useCache !== false; // Default to true

  // Check in-flight memoization first
  if (useCache && embeddingMemo.has(text)) {
    return embeddingMemo.get(text)!;
  }

  // Create promise for this embedding
  const promise = (async () => {
    // Initialize cache if needed
    if (useCache) {
      await embeddingCache.initialize();

      // Check persistent cache
      const cached = await embeddingCache.get(text);
      if (cached) {
        return cached;
      }
    }

    // Generate new embedding with performance tracking
    const embedding = await embeddingsService.generateEmbedding(text, options);

    // Cache result
    if (useCache) {
      await embeddingCache.set(text, embedding);
    }

    return embedding;
  })();

  // Memoize promise to prevent duplicate requests
  if (useCache) {
    embeddingMemo.set(text, promise);
  }

  try {
    return await promise;
  } finally {
    // Clean up memoization after completion
    embeddingMemo.delete(text);
  }
}

/**
 * Generate embeddings for multiple texts with caching
 * @param texts Array of texts to embed
 * @param options Options for embedding generation
 * @returns Array of 384-dimensional embedding vectors
 */
export async function generateBatchEmbeddings(
  texts: string[],
  options: EmbeddingOptions = {}
): Promise<Embedding[]> {
  // Validate input
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new EmbeddingError(
      EmbeddingErrorType.INVALID_INPUT,
      'Texts must be a non-empty array'
    );
  }

  const useCache = options.useCache !== false; // Default to true

  // Initialize cache if needed
  if (useCache) {
    await embeddingCache.initialize();
  }

  const results: Embedding[] = [];
  const textsToGenerate: string[] = [];
  const indices: number[] = [];

  // Check cache for each text
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    if (useCache) {
      const cached = await embeddingCache.get(text);
      if (cached) {
        results[i] = cached;
        continue;
      }
    }
    textsToGenerate.push(text);
    indices.push(i);
  }

  // Generate embeddings for uncached texts
  if (textsToGenerate.length > 0) {
    const newEmbeddings = await embeddingsService.generateBatchEmbeddings(
      textsToGenerate,
      options
    );

    // Cache and store results
    for (let i = 0; i < newEmbeddings.length; i++) {
      const embedding = newEmbeddings[i];
      const originalIndex = indices[i];
      results[originalIndex] = embedding;

      if (useCache) {
        await embeddingCache.set(textsToGenerate[i], embedding);
      }
    }
  }

  return results;
}

/**
 * Initialize the embedding system (preload model if needed)
 * @param onProgress Optional callback for download progress
 */
export async function initializeEmbeddings(
  onProgress?: (progress: number, message?: string) => void
): Promise<void> {
  await embeddingCache.initialize();
  await embeddingsService.initialize(onProgress);
}

/**
 * Check if embeddings are ready to use
 */
export function isEmbeddingsReady(): boolean {
  return embeddingsService.isReady();
}

/**
 * Get embedding system information
 */
export function getEmbeddingInfo() {
  return embeddingsService.getInfo();
}
