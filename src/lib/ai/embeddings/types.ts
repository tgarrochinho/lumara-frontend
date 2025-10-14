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
export enum EmbeddingErrorType {
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  GENERATION_FAILED = 'GENERATION_FAILED',
  CACHE_ERROR = 'CACHE_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
}

/**
 * Custom error class for embedding operations
 */
export class EmbeddingError extends Error {
  constructor(
    public type: EmbeddingErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'EmbeddingError';
  }
}
