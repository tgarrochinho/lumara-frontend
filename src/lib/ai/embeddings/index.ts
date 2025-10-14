/**
 * Browser-based semantic embeddings using Transformers.js
 *
 * This module provides semantic embedding generation using the MiniLM-L6-v2 model
 * running entirely in the browser. Features include:
 * - 384-dimensional embeddings
 * - Two-tier caching (memory + IndexedDB)
 * - Progress tracking for model downloads
 * - Retry logic with exponential backoff
 * - <100ms generation time after initial load
 */

// Main API
export {
  generateEmbedding,
  generateBatchEmbeddings,
  initializeEmbeddings,
  isEmbeddingsReady,
  getEmbeddingInfo,
  embeddingsService,
} from './transformers';

// Cache management
export { embeddingCache, EmbeddingCacheManager } from './cache';

// Progress tracking
export { embeddingProgress, ProgressTracker } from '../utils/progress';
export type { ProgressCallback } from '../utils/progress';

// Types
export type { Embedding, EmbeddingOptions, CacheStats } from './types';
export { EmbeddingError, EmbeddingErrorType } from './types';
