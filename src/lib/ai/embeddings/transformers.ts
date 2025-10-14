/**
 * Transformers.js wrapper for browser-based semantic embeddings
 * Uses MiniLM-L6-v2 model for 384-dimensional embeddings
 */

import { pipeline, env } from '@xenova/transformers';
import { embeddingCache } from './cache';
import { embeddingProgress } from '../utils/progress';
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
      const startTime = performance.now();

      const output = await this.embedder(text, {
        pooling: options.pooling || 'mean',
        normalize: options.normalize !== false, // Default to true
      });

      const embedding: Embedding = Array.from(output.data);

      const duration = performance.now() - startTime;
      if (duration > 100) {
        console.warn(
          `Embedding generation took ${duration.toFixed(1)}ms (target: <100ms)`
        );
      }

      return embedding;
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

    const startTime = performance.now();

    // Process in parallel
    const embeddings = await Promise.all(
      texts.map((text) => this.generateEmbedding(text, options))
    );

    const duration = performance.now() - startTime;
    const avgTime = duration / texts.length;

    console.log(
      `Generated ${texts.length} embeddings in ${duration.toFixed(1)}ms (avg: ${avgTime.toFixed(1)}ms per embedding)`
    );

    return embeddings;
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
}

/**
 * Singleton instance of the embedding service
 */
export const embeddingsService = new TransformersEmbeddingService();

/**
 * Generate an embedding with caching support
 * @param text The text to embed
 * @param options Options for embedding generation
 * @returns 384-dimensional embedding vector
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<Embedding> {
  const useCache = options.useCache !== false; // Default to true

  // Initialize cache if needed
  if (useCache) {
    await embeddingCache.initialize();

    // Check cache first
    const cached = await embeddingCache.get(text);
    if (cached) {
      return cached;
    }
  }

  // Generate new embedding
  const embedding = await embeddingsService.generateEmbedding(text, options);

  // Cache result
  if (useCache) {
    await embeddingCache.set(text, embedding);
  }

  return embedding;
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
