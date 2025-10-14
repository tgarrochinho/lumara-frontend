/**
 * Tests for Similarity Detection
 */

import { describe, it, expect } from 'vitest';
import {
  cosineSimilarity,
  findSimilar,
  batchCosineSimilarity,
  topNSimilar,
} from '../utils/similarity';

describe('Similarity Detection', () => {
  describe('cosineSimilarity', () => {
    it('returns 1.0 for identical vectors', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
    });

    it('returns 0.0 for orthogonal vectors', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(0.0);
    });

    it('returns -1.0 for opposite vectors', () => {
      const a = [1, 0, 0];
      const b = [-1, 0, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0);
    });

    it('handles non-normalized vectors', () => {
      const a = [2, 0, 0];
      const b = [4, 0, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0); // Same direction
    });

    it('calculates correct similarity for angled vectors', () => {
      const a = [1, 1, 0];
      const b = [1, 0, 0];
      // Angle is 45 degrees, cos(45°) ≈ 0.707
      expect(cosineSimilarity(a, b)).toBeCloseTo(0.707, 2);
    });

    it('returns 0 for zero vectors', () => {
      expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
      expect(cosineSimilarity([1, 2, 3], [0, 0, 0])).toBe(0);
      expect(cosineSimilarity([0, 0, 0], [0, 0, 0])).toBe(0);
    });

    it('throws error for mismatched dimensions', () => {
      expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow('Vector dimension mismatch');
    });

    it('handles high-dimensional vectors', () => {
      const dim = 768; // Common embedding dimension
      const a = Array(dim).fill(1);
      const b = Array(dim).fill(1);
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
    });

    it('is symmetric', () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      expect(cosineSimilarity(a, b)).toBe(cosineSimilarity(b, a));
    });

    it('handles negative values correctly', () => {
      const a = [1, -1, 0];
      const b = [-1, 1, 0];
      expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0);
    });
  });

  describe('findSimilar', () => {
    const mockMemories = [
      { id: '1', content: 'I love coffee', embedding: [1, 0.5, 0] },
      { id: '2', content: 'I hate coffee', embedding: [-1, -0.5, 0] },
      { id: '3', content: 'Coffee is great', embedding: [0.9, 0.4, 0.1] },
      { id: '4', content: 'Tea is better', embedding: [0, 0, 1] },
      { id: '5', content: 'No embedding', embedding: undefined },
    ];

    it('finds similar memories above threshold', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, { threshold: 0.7 });

      expect(similar.length).toBeGreaterThan(0);
      expect(similar.every(m => m.similarity >= 0.7)).toBe(true);
    });

    it('sorts results by similarity descending', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, { threshold: 0.5 });

      for (let i = 1; i < similar.length; i++) {
        expect(similar[i - 1].similarity).toBeGreaterThanOrEqual(similar[i].similarity);
      }
    });

    it('respects limit parameter', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, { threshold: 0, limit: 2 });

      expect(similar.length).toBeLessThanOrEqual(2);
    });

    it('excludes specified IDs', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, {
        threshold: 0,
        excludeIds: ['1', '3'],
      });

      expect(similar.every(m => m.id !== '1' && m.id !== '3')).toBe(true);
    });

    it('skips memories without embeddings', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, { threshold: 0 });

      expect(similar.every(m => m.id !== '5')).toBe(true);
    });

    it('returns empty array when no matches above threshold', async () => {
      const query = [0.5, 0.5, 0.5]; // Different from all memories
      const similar = await findSimilar(query, mockMemories, { threshold: 0.99 });

      expect(similar).toEqual([]);
    });

    it('uses default threshold of 0.7', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories);

      expect(similar.every(m => m.similarity >= 0.7)).toBe(true);
    });

    it('uses default limit of 10', async () => {
      const manyMemories = Array.from({ length: 20 }, (_, i) => ({
        id: `mem-${i}`,
        content: `Memory ${i}`,
        embedding: [1, 0.5, 0.1 * i],
      }));

      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, manyMemories, { threshold: 0 });

      expect(similar.length).toBeLessThanOrEqual(10);
    });

    it('handles invalid embeddings gracefully', async () => {
      const memoriesWithInvalid = [
        { id: '1', content: 'Valid', embedding: [1, 0, 0] },
        { id: '2', content: 'Wrong dimension', embedding: [1, 0] },
        { id: '3', content: 'Also valid', embedding: [0.9, 0.1, 0] },
      ];

      const query = [1, 0, 0];
      const similar = await findSimilar(query, memoriesWithInvalid, { threshold: 0 });

      // Should skip the invalid embedding but include valid ones
      expect(similar.some(m => m.id === '1')).toBe(true);
      expect(similar.some(m => m.id === '3')).toBe(true);
    });

    it('returns match with correct structure', async () => {
      const query = [1, 0.5, 0];
      const similar = await findSimilar(query, mockMemories, { threshold: 0.9 });

      if (similar.length > 0) {
        expect(similar[0]).toHaveProperty('id');
        expect(similar[0]).toHaveProperty('similarity');
        expect(similar[0]).toHaveProperty('content');
        expect(typeof similar[0].similarity).toBe('number');
      }
    });
  });

  describe('batchCosineSimilarity', () => {
    it('calculates similarity for multiple vectors', () => {
      const query = [1, 0, 0];
      const vectors = [
        [1, 0, 0],
        [0, 1, 0],
        [-1, 0, 0],
      ];

      const results = batchCosineSimilarity(query, vectors);

      expect(results).toHaveLength(3);
      expect(results[0]).toBeCloseTo(1.0);
      expect(results[1]).toBeCloseTo(0.0);
      expect(results[2]).toBeCloseTo(-1.0);
    });

    it('returns empty array for empty input', () => {
      const query = [1, 0, 0];
      const results = batchCosineSimilarity(query, []);

      expect(results).toEqual([]);
    });

    it('handles invalid vectors gracefully', () => {
      const query = [1, 0, 0];
      const vectors = [
        [1, 0, 0],
        [1, 0], // Wrong dimension
        [0, 1, 0],
      ];

      const results = batchCosineSimilarity(query, vectors);

      expect(results).toHaveLength(3);
      expect(results[0]).toBeCloseTo(1.0);
      expect(results[1]).toBe(0); // Should return 0 for invalid
      expect(results[2]).toBeCloseTo(0.0);
    });

    it('processes large batches efficiently', () => {
      const query = Array(768).fill(1);
      const vectors = Array.from({ length: 1000 }, () => Array(768).fill(1));

      const start = performance.now();
      const results = batchCosineSimilarity(query, vectors);
      const end = performance.now();

      expect(results).toHaveLength(1000);
      expect(end - start).toBeLessThan(100); // Should be fast
    });
  });

  describe('topNSimilar', () => {
    const mockVectors = [
      { id: '1', content: 'Very similar', embedding: [1, 0.5, 0] },
      { id: '2', content: 'Less similar', embedding: [0.5, 0.5, 0.5] },
      { id: '3', content: 'Identical', embedding: [1, 0.5, 0] },
      { id: '4', content: 'Different', embedding: [0, 0, 1] },
      { id: '5', content: 'Somewhat similar', embedding: [0.8, 0.4, 0.1] },
    ];

    it('returns top N most similar vectors', () => {
      const query = [1, 0.5, 0];
      const top3 = topNSimilar(query, mockVectors, 3);

      expect(top3).toHaveLength(3);
      expect(top3[0].similarity).toBeGreaterThanOrEqual(top3[1].similarity);
      expect(top3[1].similarity).toBeGreaterThanOrEqual(top3[2].similarity);
    });

    it('returns fewer results if n exceeds available vectors', () => {
      const query = [1, 0.5, 0];
      const top10 = topNSimilar(query, mockVectors, 10);

      expect(top10.length).toBeLessThanOrEqual(mockVectors.length);
    });

    it('returns empty array for n=0', () => {
      const query = [1, 0.5, 0];
      const top0 = topNSimilar(query, mockVectors, 0);

      expect(top0).toEqual([]);
    });

    it('handles single result request', () => {
      const query = [1, 0.5, 0];
      const top1 = topNSimilar(query, mockVectors, 1);

      expect(top1).toHaveLength(1);
    });

    it('skips invalid embeddings', () => {
      const vectorsWithInvalid = [
        { id: '1', content: 'Valid', embedding: [1, 0, 0] },
        { id: '2', content: 'Invalid', embedding: [1, 0] }, // Wrong dimension
        { id: '3', content: 'Also valid', embedding: [0.9, 0.1, 0] },
      ];

      const query = [1, 0, 0];
      const top2 = topNSimilar(query, vectorsWithInvalid, 2);

      expect(top2).toHaveLength(2);
      expect(top2.every(m => m.id !== '2')).toBe(true);
    });

    it('is more efficient than sorting all results', () => {
      const largeSet = Array.from({ length: 10000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `Memory ${i}`,
        embedding: Array(768).fill(Math.random()),
      }));

      const query = Array(768).fill(1);

      const start = performance.now();
      const top10 = topNSimilar(query, largeSet, 10);
      const end = performance.now();

      expect(top10).toHaveLength(10);
      expect(end - start).toBeLessThan(500); // Should be reasonably fast
    });
  });

  describe('Performance Benchmarks', () => {
    it('finds similar in large dataset within 50ms', async () => {
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `Memory ${i}`,
        embedding: Array(768).fill(Math.random()),
      }));

      const query = Array(768).fill(1);

      const start = performance.now();
      await findSimilar(query, memories, { threshold: 0.7 });
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
    });
  });

  describe('Real-world Scenarios', () => {
    it('finds semantically similar memories', async () => {
      // Simulating real embedding vectors (simplified)
      const memories = [
        {
          id: '1',
          content: 'I love programming in TypeScript',
          embedding: [0.8, 0.6, 0.2, 0.1, 0.3],
        },
        {
          id: '2',
          content: 'TypeScript is my favorite language',
          embedding: [0.85, 0.55, 0.25, 0.15, 0.28],
        },
        {
          id: '3',
          content: 'I enjoy cooking Italian food',
          embedding: [0.1, 0.2, 0.9, 0.8, 0.7],
        },
      ];

      const query = [0.82, 0.58, 0.22, 0.12, 0.29]; // Similar to TypeScript memories

      const similar = await findSimilar(query, memories, { threshold: 0.7 });

      // Should find the TypeScript-related memories
      expect(similar.some(m => m.id === '1' || m.id === '2')).toBe(true);
      expect(similar.every(m => m.id !== '3')).toBe(true); // Cooking memory should not match
    });

    it('handles duplicate detection threshold', async () => {
      const memories = [
        {
          id: '1',
          content: 'I love coffee',
          embedding: [1, 0.5, 0, 0, 0],
        },
        {
          id: '2',
          content: 'I love coffee', // Duplicate
          embedding: [0.99, 0.49, 0.01, 0, 0],
        },
        {
          id: '3',
          content: 'Coffee is nice',
          embedding: [0.7, 0.3, 0.1, 0, 0],
        },
      ];

      const query = [1, 0.5, 0, 0, 0];
      const duplicates = await findSimilar(query, memories, { threshold: 0.85 });

      expect(duplicates.length).toBeGreaterThanOrEqual(2);
      expect(duplicates.every(d => d.similarity >= 0.85)).toBe(true);
    });
  });
});
