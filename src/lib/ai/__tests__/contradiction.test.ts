/**
 * Tests for Contradiction Detection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  detectContradictions,
  detectDuplicates,
  getContradictionCandidates,
  batchAnalyzeContradictions,
} from '../utils/contradiction';
import type { AIProvider } from '../types';

describe('Contradiction Detection', () => {
  // Mock AI Provider
  let mockProvider: AIProvider;

  beforeEach(() => {
    mockProvider = {
      name: 'Mock Provider',
      type: 'local',
      requiresApiKey: false,
      capabilities: {
        chat: true,
        embeddings: true,
        streaming: false,
        multimodal: false,
      },
      chat: vi.fn(),
      embed: vi.fn(),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
    };
  });

  describe('detectContradictions', () => {
    const mockMemories = [
      {
        id: 'mem-1',
        content: 'I love coffee',
        embedding: [1, 0.5, 0, 0, 0],
      },
      {
        id: 'mem-2',
        content: 'I hate coffee',
        embedding: [0.9, 0.4, 0.1, 0, 0], // Similar vector (>0.7)
      },
      {
        id: 'mem-3',
        content: 'Tea is great',
        embedding: [0, 0, 1, 0, 0], // Different topic
      },
      {
        id: 'mem-4',
        content: 'Coffee is okay',
        embedding: [0.8, 0.45, 0.05, 0, 0], // Similar vector
      },
    ];

    it('detects contradictions with high confidence', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        JSON.stringify({
          contradicts: true,
          confidence: 95,
          explanation: 'One says loves coffee, other says hates coffee',
        })
      );

      const newMemory = {
        id: 'new-1',
        content: 'I absolutely love coffee',
        embedding: [0.95, 0.48, 0.02, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('contradicts', true);
      expect(results[0]).toHaveProperty('confidence');
      expect(results[0]).toHaveProperty('explanation');
      expect(results[0]).toHaveProperty('memory1Id', newMemory.id);
      expect(results[0]).toHaveProperty('memory2Id');
    });

    it('returns empty array when no similar memories exist', async () => {
      const newMemory = {
        id: 'new-1',
        content: 'I like hiking',
        embedding: [0, 1, 0, 0, 0], // Orthogonal to all existing
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      expect(results).toEqual([]);
    });

    it('excludes the new memory itself from search', async () => {
      const memories = [
        {
          id: 'mem-1',
          content: 'I love coffee',
          embedding: [1, 0.5, 0, 0, 0],
        },
      ];

      const newMemory = {
        id: 'mem-1', // Same ID
        content: 'I love coffee',
        embedding: [1, 0.5, 0, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        memories,
        mockProvider
      );

      expect(results).toEqual([]);
    });

    it('only analyzes semantically similar memories (>0.7 threshold)', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        JSON.stringify({
          contradicts: false,
          confidence: 50,
          explanation: 'Not contradictory',
        })
      );

      const newMemory = {
        id: 'new-1',
        content: 'Coffee is great',
        embedding: [0.9, 0.45, 0.05, 0, 0],
      };

      await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      // Should only call chat for similar memories (similarity > 0.7)
      const chatCalls = vi.mocked(mockProvider.chat).mock.calls.length;
      expect(chatCalls).toBeGreaterThan(0);
      expect(chatCalls).toBeLessThan(mockMemories.length); // Not all memories
    });

    it('handles AI provider errors gracefully', async () => {
      vi.mocked(mockProvider.chat).mockRejectedValue(new Error('AI error'));

      const newMemory = {
        id: 'new-1',
        content: 'I love coffee',
        embedding: [0.95, 0.48, 0.02, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      // Should not throw, returns empty or with fallback results
      expect(Array.isArray(results)).toBe(true);
    });

    it('parses JSON response correctly', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        'Here is the analysis: {"contradicts": true, "confidence": 85, "explanation": "Direct contradiction"}'
      );

      const newMemory = {
        id: 'new-1',
        content: 'I love coffee',
        embedding: [0.95, 0.48, 0.02, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      if (results.length > 0) {
        expect(results[0].contradicts).toBe(true);
        expect(results[0].confidence).toBe(85);
        expect(results[0].explanation).toContain('contradiction');
      }
    });

    it('handles malformed JSON responses', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue('Not valid JSON at all');

      const newMemory = {
        id: 'new-1',
        content: 'I love coffee',
        embedding: [0.95, 0.48, 0.02, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      // Should handle gracefully, not throw
      expect(Array.isArray(results)).toBe(true);
    });

    it('clamps confidence values to 0-100 range', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        JSON.stringify({
          contradicts: true,
          confidence: 150, // Out of range
          explanation: 'Test',
        })
      );

      const newMemory = {
        id: 'new-1',
        content: 'I love coffee',
        embedding: [0.95, 0.48, 0.02, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        mockMemories,
        mockProvider
      );

      if (results.length > 0) {
        expect(results[0].confidence).toBeLessThanOrEqual(100);
        expect(results[0].confidence).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('detectDuplicates', () => {
    const mockMemories = [
      {
        id: 'mem-1',
        content: 'I love coffee',
        embedding: [1, 0.5, 0, 0, 0],
      },
      {
        id: 'mem-2',
        content: 'I love coffee', // Near duplicate
        embedding: [0.99, 0.49, 0.01, 0, 0],
      },
      {
        id: 'mem-3',
        content: 'Coffee is great',
        embedding: [0.7, 0.3, 0.1, 0, 0],
      },
    ];

    it('finds near-duplicate memories with default threshold', async () => {
      const newMemory = [1, 0.5, 0, 0, 0];
      const duplicates = await detectDuplicates(newMemory, mockMemories);

      expect(duplicates.length).toBeGreaterThan(0);
      expect(duplicates.every(d => d.similarity >= 0.85)).toBe(true);
    });

    it('respects custom threshold', async () => {
      const newMemory = [1, 0.5, 0, 0, 0];
      const duplicates = await detectDuplicates(newMemory, mockMemories, 0.95);

      expect(duplicates.every(d => d.similarity >= 0.95)).toBe(true);
    });

    it('returns duplicates sorted by similarity', async () => {
      const newMemory = [1, 0.5, 0, 0, 0];
      const duplicates = await detectDuplicates(newMemory, mockMemories, 0.5);

      for (let i = 1; i < duplicates.length; i++) {
        expect(duplicates[i - 1].similarity).toBeGreaterThanOrEqual(
          duplicates[i].similarity
        );
      }
    });

    it('returns empty array when no duplicates exist', async () => {
      const newMemory = [0, 0, 0, 0, 1]; // Very different
      const duplicates = await detectDuplicates(newMemory, mockMemories);

      expect(duplicates).toEqual([]);
    });
  });

  describe('getContradictionCandidates', () => {
    const mockMemories = [
      {
        id: 'mem-1',
        content: 'I love coffee',
        embedding: [1, 0.5, 0, 0, 0],
      },
      {
        id: 'mem-2',
        content: 'I hate coffee',
        embedding: [0.9, 0.4, 0.1, 0, 0],
      },
      {
        id: 'mem-3',
        content: 'Tea is great',
        embedding: [0, 0, 1, 0, 0],
      },
    ];

    it('returns semantically similar memories as candidates', async () => {
      const newMemory = [0.95, 0.48, 0.02, 0, 0];
      const candidates = await getContradictionCandidates(newMemory, mockMemories);

      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0]).toHaveProperty('memory');
      expect(candidates[0]).toHaveProperty('semanticallySimilar', true);
    });

    it('filters out dissimilar memories', async () => {
      const newMemory = [0, 1, 0, 0, 0]; // Orthogonal to most
      const candidates = await getContradictionCandidates(newMemory, mockMemories);

      // Should only include memories with >0.7 similarity
      expect(candidates.every(c => c.memory.similarity >= 0.7)).toBe(true);
    });

    it('returns empty array when no similar memories', async () => {
      const newMemory = [0, 0, 0, 0, 1];
      const candidates = await getContradictionCandidates(newMemory, mockMemories);

      expect(candidates).toEqual([]);
    });
  });

  describe('batchAnalyzeContradictions', () => {
    beforeEach(() => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        JSON.stringify({
          contradicts: true,
          confidence: 80,
          explanation: 'Contradiction found',
        })
      );
    });

    it('analyzes multiple pairs in batch', async () => {
      const pairs = [
        {
          id1: 'mem-1',
          content1: 'I love coffee',
          id2: 'mem-2',
          content2: 'I hate coffee',
        },
        {
          id1: 'mem-3',
          content1: 'I love tea',
          id2: 'mem-4',
          content2: 'I hate tea',
        },
      ];

      const results = await batchAnalyzeContradictions(pairs, mockProvider);

      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty('memory1Id', 'mem-1');
      expect(results[0]).toHaveProperty('memory2Id', 'mem-2');
      expect(results[1]).toHaveProperty('memory1Id', 'mem-3');
      expect(results[1]).toHaveProperty('memory2Id', 'mem-4');
    });

    it('returns empty array for empty input', async () => {
      const results = await batchAnalyzeContradictions([], mockProvider);
      expect(results).toEqual([]);
    });

    it('handles individual pair failures gracefully', async () => {
      vi.mocked(mockProvider.chat)
        .mockResolvedValueOnce(
          JSON.stringify({
            contradicts: true,
            confidence: 90,
            explanation: 'Success',
          })
        )
        .mockRejectedValueOnce(new Error('API error'))
        .mockResolvedValueOnce(
          JSON.stringify({
            contradicts: false,
            confidence: 50,
            explanation: 'No contradiction',
          })
        );

      const pairs = [
        { id1: '1', content1: 'A', id2: '2', content2: 'B' },
        { id1: '3', content1: 'C', id2: '4', content2: 'D' },
        { id1: '5', content1: 'E', id2: '6', content2: 'F' },
      ];

      const results = await batchAnalyzeContradictions(pairs, mockProvider);

      expect(results).toHaveLength(3);
      // Middle one should have fallback values
      expect(results[1].contradicts).toBe(false);
      expect(results[1].confidence).toBe(0);
    });
  });

  describe('Real-world Scenarios', () => {
    beforeEach(() => {
      vi.mocked(mockProvider.chat).mockImplementation(async (prompt: string) => {
        // Simulate realistic AI responses based on content
        if (prompt.includes('love coffee') && prompt.includes('hate coffee')) {
          return JSON.stringify({
            contradicts: true,
            confidence: 95,
            explanation: 'Direct contradiction: love vs hate',
          });
        }
        if (prompt.includes('I work at Google') && prompt.includes('I work in tech')) {
          return JSON.stringify({
            contradicts: false,
            confidence: 90,
            explanation: 'Compatible: Google is a tech company',
          });
        }
        return JSON.stringify({
          contradicts: false,
          confidence: 50,
          explanation: 'No clear contradiction',
        });
      });
    });

    it('detects direct contradictions', async () => {
      const memories = [
        {
          id: 'mem-1',
          content: 'I love coffee',
          embedding: [0.9, 0.5, 0.1, 0, 0],
        },
      ];

      const newMemory = {
        id: 'new-1',
        content: 'I hate coffee',
        embedding: [0.92, 0.48, 0.08, 0, 0], // Similar enough
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        memories,
        mockProvider
      );

      expect(results.some(r => r.contradicts && r.confidence > 90)).toBe(true);
    });

    it('does not flag complementary statements as contradictions', async () => {
      // Override the mock for this specific test
      vi.mocked(mockProvider.chat).mockResolvedValueOnce(
        JSON.stringify({
          contradicts: false,
          confidence: 90,
          explanation: 'Compatible: Google is a tech company',
        })
      );

      const memories = [
        {
          id: 'mem-1',
          content: 'I work at Google',
          embedding: [0.8, 0.6, 0.2, 0, 0],
        },
      ];

      const newMemory = {
        id: 'new-1',
        content: 'I work in tech',
        embedding: [0.82, 0.58, 0.22, 0, 0],
      };

      const results = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        memories,
        mockProvider
      );

      // Since the AI says no contradiction, results should be empty
      // (detectContradictions only returns contradictions where contradicts=true)
      expect(results).toEqual([]);
    });
  });

  describe('Performance', () => {
    it('handles large memory sets efficiently', async () => {
      vi.mocked(mockProvider.chat).mockResolvedValue(
        JSON.stringify({
          contradicts: false,
          confidence: 50,
          explanation: 'No contradiction',
        })
      );

      const largeMemorySet = Array.from({ length: 1000 }, (_, i) => ({
        id: `mem-${i}`,
        content: `Memory ${i}`,
        embedding: Array(768).fill(Math.random()),
      }));

      const newMemory = {
        id: 'new-1',
        content: 'Test memory',
        embedding: Array(768).fill(0.5),
      };

      const start = performance.now();
      await detectContradictions(
        newMemory.id,
        newMemory.content,
        newMemory.embedding,
        largeMemorySet,
        mockProvider
      );
      const end = performance.now();

      // Should be reasonably fast even with large dataset
      // (Most time will be in similarity search, not contradiction analysis)
      expect(end - start).toBeLessThan(1000);
    });
  });
});
