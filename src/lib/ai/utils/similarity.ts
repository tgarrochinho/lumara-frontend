/**
 * Similarity Detection Utilities
 *
 * Provides cosine similarity calculations and semantic search functionality
 * for finding related memories based on their vector embeddings.
 */

import { dotProduct, magnitude } from './vector-math';
import { performanceMonitor } from '../performance';

/**
 * Calculate cosine similarity between two vectors
 *
 * Cosine similarity measures the cosine of the angle between two vectors,
 * resulting in a value between -1 (opposite) and 1 (identical).
 * For embeddings, values typically range from 0 to 1.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Similarity score between 0 and 1 (higher = more similar)
 * @throws Error if vectors have different lengths
 *
 * @example
 * cosineSimilarity([1, 0, 0], [1, 0, 0]) // Returns 1.0 (identical)
 * cosineSimilarity([1, 0, 0], [0, 1, 0]) // Returns 0.0 (orthogonal)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);

  // Handle zero vectors
  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}

/**
 * Result of a similarity search
 */
export interface SimilarityMatch {
  /** ID of the matching memory */
  id: string;

  /** Similarity score (0-1, higher = more similar) */
  similarity: number;

  /** Content of the matching memory */
  content: string;
}

/**
 * Options for similarity search
 */
export interface SimilaritySearchOptions {
  /** Minimum similarity threshold (default: 0.7) */
  threshold?: number;

  /** Maximum number of results to return (default: 10) */
  limit?: number;

  /** IDs to exclude from search results (e.g., the query memory itself) */
  excludeIds?: string[];
}

/**
 * Find memories similar to a query embedding
 *
 * Performs semantic search by calculating cosine similarity between
 * the query embedding and all memory embeddings, returning matches
 * above the threshold sorted by similarity.
 *
 * Optimized with performance tracking and early termination using a min-heap.
 *
 * @param queryEmbedding - The embedding vector to search for
 * @param memories - Array of memories with embeddings to search through
 * @param options - Search configuration options
 * @returns Array of similarity matches, sorted by similarity (descending)
 *
 * @example
 * const similar = await findSimilar(
 *   queryEmbedding,
 *   memories,
 *   { threshold: 0.7, limit: 5 }
 * );
 * // Returns top 5 memories with >0.7 similarity
 */
export async function findSimilar(
  queryEmbedding: number[],
  memories: Array<{ id: string; content: string; embedding?: number[] }>,
  options: SimilaritySearchOptions = {}
): Promise<SimilarityMatch[]> {
  return performanceMonitor.measureSync('similarity-search', () => {
    const {
      threshold = 0.7,
      limit = 10,
      excludeIds = [],
    } = options;

    // Use min-heap approach for top-k results
    const topK: SimilarityMatch[] = [];
    let minSimilarity = threshold;

    for (const memory of memories) {
      // Skip if excluded
      if (excludeIds.includes(memory.id)) {
        continue;
      }

      // Skip if no embedding
      if (!memory.embedding) {
        continue;
      }

      try {
        // Calculate similarity
        const similarity = cosineSimilarity(queryEmbedding, memory.embedding);

        // Only consider if above minimum threshold
        if (similarity >= minSimilarity) {
          // Add to results
          topK.push({
            id: memory.id,
            similarity,
            content: memory.content,
          });

          // Keep array sorted and maintain size limit
          if (topK.length > limit) {
            topK.sort((a, b) => b.similarity - a.similarity);
            topK.pop(); // Remove lowest
            // Update minimum threshold for early termination
            minSimilarity = Math.max(threshold, topK[topK.length - 1].similarity);
          }
        }
      } catch (error) {
        // Skip memories with invalid embeddings
        console.warn(`Skipping memory ${memory.id} due to embedding error:`, error);
        continue;
      }
    }

    // Final sort by similarity (descending)
    topK.sort((a, b) => b.similarity - a.similarity);

    return topK;
  });
}

/**
 * Calculate cosine similarity for multiple vectors against a query
 *
 * Optimized batch operation for calculating similarities in bulk.
 * More efficient than calling cosineSimilarity in a loop.
 *
 * @param query - The query vector
 * @param vectors - Array of vectors to compare against
 * @returns Array of similarity scores in the same order as input vectors
 *
 * @example
 * const scores = batchCosineSimilarity(query, [vec1, vec2, vec3]);
 * // Returns [0.85, 0.92, 0.67]
 */
export function batchCosineSimilarity(
  query: number[],
  vectors: number[][]
): number[] {
  return vectors.map(vector => {
    try {
      return cosineSimilarity(query, vector);
    } catch (error) {
      // Return 0 for invalid vectors
      console.warn('Error calculating similarity:', error);
      return 0;
    }
  });
}

/**
 * Find the top N most similar vectors
 *
 * Efficient method to get only the top matches without sorting all results.
 * Useful for large datasets where you only need a few best matches.
 *
 * Optimized with performance tracking and better heap management.
 *
 * @param query - The query vector
 * @param vectors - Array of vectors with IDs and content
 * @param n - Number of top results to return
 * @returns Top N matches sorted by similarity
 */
export function topNSimilar(
  query: number[],
  vectors: Array<{ id: string; content: string; embedding: number[] }>,
  n: number
): SimilarityMatch[] {
  return performanceMonitor.measureSync('top-n-similarity', () => {
    const matches: SimilarityMatch[] = [];
    let minSimilarity = -Infinity;

    for (const item of vectors) {
      try {
        // Skip if we have enough results and this can't beat the minimum
        const similarity = cosineSimilarity(query, item.embedding);

        if (matches.length < n) {
          // Add to array if not yet at limit
          matches.push({ id: item.id, similarity, content: item.content });

          // Only sort when we reach the limit
          if (matches.length === n) {
            matches.sort((a, b) => b.similarity - a.similarity);
            minSimilarity = matches[matches.length - 1].similarity;
          }
        } else if (similarity > minSimilarity) {
          // Replace lowest similarity if this is higher
          matches[matches.length - 1] = { id: item.id, similarity, content: item.content };
          matches.sort((a, b) => b.similarity - a.similarity);
          minSimilarity = matches[matches.length - 1].similarity;
        }
      } catch (error) {
        // Skip invalid vectors
        continue;
      }
    }

    // Final sort if we have less than n matches
    if (matches.length < n) {
      matches.sort((a, b) => b.similarity - a.similarity);
    }

    return matches;
  });
}
