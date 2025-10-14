/**
 * Types for embedding generation and management
 */

/**
 * A semantic embedding vector (384-dimensional for MiniLM-L6-v2)
 */
export type Embedding = number[];

/**
 * Cached embedding with metadata
 */
export interface EmbeddingCache {
  text: string;
  embedding: Embedding;
  timestamp: Date;
}

/**
 * Progress information during model loading
 */
export interface DownloadProgress {
  status: 'progress' | 'done' | 'error';
  loaded: number;
  total: number;
  file?: string;
}

/**
 * Configuration options for embedding generation
 */
export interface EmbeddingOptions {
  /**
   * Whether to use cached embeddings (default: true)
   */
  useCache?: boolean;

  /**
   * Whether to normalize the embedding vectors (default: true)
   */
  normalize?: boolean;

  /**
   * Pooling strategy for the model (default: 'mean')
   */
  pooling?: 'mean' | 'cls' | 'max';

  /**
   * Batch size for processing multiple embeddings (default: 10)
   */
  batchSize?: number;
}

/**
 * Statistics about the embedding cache
 */
export interface CacheStats {
  size: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
  memoryUsageEstimate: number; // in bytes
}

/**
 * Error types for embedding operations
 */
export const EmbeddingErrorType = {
  MODEL_LOAD_FAILED: 'MODEL_LOAD_FAILED',
  GENERATION_FAILED: 'GENERATION_FAILED',
  CACHE_ERROR: 'CACHE_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
} as const;

export type EmbeddingErrorType = typeof EmbeddingErrorType[keyof typeof EmbeddingErrorType];

/**
 * Custom error class for embedding operations
 */
export class EmbeddingError extends Error {
  public readonly type: EmbeddingErrorType;
  public readonly originalError?: Error;

  constructor(
    type: EmbeddingErrorType,
    message: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'EmbeddingError';
    this.type = type;
    this.originalError = originalError;
  }
}
