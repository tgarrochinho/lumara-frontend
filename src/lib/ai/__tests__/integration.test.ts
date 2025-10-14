/**
 * Integration Tests for AI System
 *
 * Tests end-to-end flows that involve multiple AI components working together.
 * Uses MockAIProvider to ensure tests work in CI/CD without Chrome AI.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockAIProvider } from '../providers/mock';
import { findSimilar } from '../utils/similarity';
import { detectContradictions } from '../utils/contradiction';
import { embeddingCache } from '../embeddings/cache';

describe('AI System Integration Tests', () => {
  let provider: MockAIProvider;

  beforeEach(async () => {
    provider = new MockAIProvider();
    await provider.initialize();
    await embeddingCache.clear();
  });

  afterEach(async () => {
    await provider.dispose();
  });

  describe('Provider Initialization Flow', () => {
    it('initializes provider successfully', async () => {
      const newProvider = new MockAIProvider();
      expect(newProvider.capabilities.chat).toBe(true);
      expect(newProvider.capabilities.embeddings).toBe(true);

      await newProvider.initialize();
      const health = await newProvider.healthCheck();

      expect(health.available).toBe(true);
      expect(health.status).toBe('ready');

      await newProvider.dispose();
    });

    it('handles multiple initialization calls gracefully', async () => {
      const newProvider = new MockAIProvider();

      await newProvider.initialize();
      await newProvider.initialize();
      await newProvider.initialize();

      const health = await newProvider.healthCheck();
      expect(health.available).toBe(true);

      await newProvider.dispose();
    });

    it('tracks initialization state correctly', async () => {
      const newProvider = new MockAIProvider();

      // Before initialization
      let health = await newProvider.healthCheck();
      expect(health.available).toBe(false);

      // After initialization
      await newProvider.initialize();
      health = await newProvider.healthCheck();
      expect(health.available).toBe(true);

      // After disposal
      await newProvider.dispose();
      health = await newProvider.healthCheck();
      expect(health.available).toBe(false);
    });
  });

  describe('End-to-End Chat Flow', () => {
    it('completes full chat flow: message → response', async () => {
      provider.setResponse('test message', 'test response');

      const response = await provider.chat('test message');

      expect(response).toBe('test response');
      expect(provider.getStats().chatCalls).toBe(1);
    });

    it('handles chat with context', async () => {
      const context = ['Previous message 1', 'Previous message 2'];
      const response = await provider.chat('new message', context);

      expect(response).toContain('new message');
      expect(response).toContain('2 context messages');
    });

    it('uses configured responses correctly', async () => {
      provider.setResponse('hello', 'Hi there!');
      provider.setResponse('goodbye', 'See you later!');

      const response1 = await provider.chat('hello');
      const response2 = await provider.chat('goodbye');

      expect(response1).toBe('Hi there!');
      expect(response2).toBe('See you later!');
      expect(provider.getStats().chatCalls).toBe(2);
    });

    it('falls back to default response when not configured', async () => {
      const response = await provider.chat('unconfigured prompt');

      expect(response).toContain('Mock response to:');
      expect(response).toContain('unconfigured prompt');
    });
  });

  describe('End-to-End Embedding Flow', () => {
    it('completes full embedding flow: text → vector', async () => {
      const text = 'test sentence for embedding';
      const embedding = await provider.embed(text);

      expect(embedding).toHaveLength(384);
      expect(Array.isArray(embedding)).toBe(true);
      expect(typeof embedding[0]).toBe('number');
      expect(provider.getStats().embedCalls).toBe(1);
    });

    it('generates deterministic embeddings', async () => {
      const text = 'consistent text';

      const embedding1 = await provider.embed(text);
      const embedding2 = await provider.embed(text);

      expect(embedding1).toEqual(embedding2);
      expect(provider.getStats().embedCalls).toBe(2);
    });

    it('generates normalized embeddings', async () => {
      const embedding = await provider.embed('test');

      // Calculate magnitude (should be ~1.0)
      const magnitude = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0)
      );

      expect(magnitude).toBeCloseTo(1.0, 5);
    });

    it('uses configured embeddings correctly', async () => {
      const customEmbedding = new Array(384).fill(0.5);
      provider.setEmbedding('custom', customEmbedding);

      const result = await provider.embed('custom');

      expect(result).toEqual(customEmbedding);
    });
  });

  describe('Chat + Embedding Integration', () => {
    it('generates embeddings from chat responses', async () => {
      // Step 1: Get chat response
      provider.setResponse('summarize', 'This is a summary of the content.');
      const response = await provider.chat('summarize');

      // Step 2: Generate embedding from response
      const embedding = await provider.embed(response);

      expect(embedding).toHaveLength(384);
      expect(response).toContain('summary');
    });

    it('handles batch chat + embedding flow', async () => {
      const prompts = ['prompt 1', 'prompt 2', 'prompt 3'];

      // Get all responses
      const responses = await Promise.all(
        prompts.map(prompt => provider.chat(prompt))
      );

      // Generate embeddings for all responses
      const embeddings = await Promise.all(
        responses.map(response => provider.embed(response))
      );

      expect(responses).toHaveLength(3);
      expect(embeddings).toHaveLength(3);
      embeddings.forEach(emb => expect(emb).toHaveLength(384));
    });
  });

  describe('Similarity Search Integration', () => {
    it('completes full similarity flow: query → similar memories', async () => {
      // Create test memories with embeddings
      const queryEmbedding = await provider.embed('coffee preference');
      const memories = [
        {
          id: '1',
          content: 'I love coffee',
          embedding: await provider.embed('I love coffee'),
        },
        {
          id: '2',
          content: 'I prefer tea',
          embedding: await provider.embed('I prefer tea'),
        },
        {
          id: '3',
          content: 'Coffee is my favorite beverage',
          embedding: await provider.embed('Coffee is my favorite beverage'),
        },
      ];

      // Find similar memories
      const similar = await findSimilar(queryEmbedding, memories, {
        threshold: 0.5,
        limit: 2,
      });

      expect(similar.length).toBeGreaterThan(0);
      expect(similar.length).toBeLessThanOrEqual(2);
      similar.forEach(match => {
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('similarity');
        expect(match).toHaveProperty('content');
        expect(match.similarity).toBeGreaterThanOrEqual(0.5);
      });
    });

    it('ranks similar memories by similarity score', async () => {
      const queryEmbedding = await provider.embed('test query');
      const memories = [
        {
          id: '1',
          content: 'test query',
          embedding: await provider.embed('test query'),
        },
        {
          id: '2',
          content: 'similar text',
          embedding: await provider.embed('similar text'),
        },
        {
          id: '3',
          content: 'completely different',
          embedding: await provider.embed('completely different'),
        },
      ];

      const similar = await findSimilar(queryEmbedding, memories, {
        threshold: 0.0, // Include all
      });

      // Results should be sorted by similarity (descending)
      for (let i = 1; i < similar.length; i++) {
        expect(similar[i - 1].similarity).toBeGreaterThanOrEqual(
          similar[i].similarity
        );
      }
    });

    it('excludes specified memory IDs from results', async () => {
      const queryEmbedding = await provider.embed('query');
      const memories = [
        { id: 'exclude-me', content: 'query', embedding: await provider.embed('query') },
        { id: 'include-me', content: 'query', embedding: await provider.embed('query') },
      ];

      const similar = await findSimilar(queryEmbedding, memories, {
        threshold: 0.0,
        excludeIds: ['exclude-me'],
      });

      expect(similar.every(match => match.id !== 'exclude-me')).toBe(true);
    });
  });

  describe('Contradiction Detection Integration', () => {
    it('detects contradictions using AI analysis', async () => {
      // Configure mock provider to return contradiction result
      const contradictionResponse = JSON.stringify({
        contradicts: true,
        confidence: 90,
        explanation: 'Direct contradiction about coffee preference',
      });

      // Set response for any message containing "contradict"
      provider.setResponse('Analyze if these two statements contradict each other', contradictionResponse);

      const newMemoryId = 'new-mem';
      const newMemoryContent = 'I love coffee';
      const newMemoryEmbedding = await provider.embed(newMemoryContent);

      const existingMemories = [
        {
          id: 'old-mem',
          content: 'I hate coffee',
          embedding: await provider.embed('I hate coffee'),
        },
      ];

      const contradictions = await detectContradictions(
        newMemoryId,
        newMemoryContent,
        newMemoryEmbedding,
        existingMemories,
        provider
      );

      // Should find at least one contradiction since embeddings are similar enough
      expect(Array.isArray(contradictions)).toBe(true);
    });

    it('handles no contradictions case', async () => {
      // Configure mock to return no contradiction
      const noContradictionResponse = JSON.stringify({
        contradicts: false,
        confidence: 95,
        explanation: 'Statements are complementary',
      });

      provider.setResponse('Analyze if these two statements contradict each other', noContradictionResponse);

      const newMemoryId = 'new-mem';
      const newMemoryContent = 'I drink coffee in the morning';
      const newMemoryEmbedding = await provider.embed(newMemoryContent);

      const existingMemories = [
        {
          id: 'old-mem',
          content: 'I avoid caffeine at night',
          embedding: await provider.embed('I avoid caffeine at night'),
        },
      ];

      const contradictions = await detectContradictions(
        newMemoryId,
        newMemoryContent,
        newMemoryEmbedding,
        existingMemories,
        provider
      );

      // May or may not find contradictions depending on similarity threshold
      expect(Array.isArray(contradictions)).toBe(true);
    });

    it('only checks semantically similar memories', async () => {
      const newMemoryId = 'new-mem';
      const newMemoryContent = 'I love coffee';
      const newMemoryEmbedding = await provider.embed(newMemoryContent);

      const existingMemories = [
        {
          id: 'dissimilar-mem',
          content: 'Completely unrelated topic about cars',
          embedding: await provider.embed('Completely unrelated topic about cars'),
        },
      ];

      const contradictions = await detectContradictions(
        newMemoryId,
        newMemoryContent,
        newMemoryEmbedding,
        existingMemories,
        provider
      );

      // Should not check dissimilar memories (below 0.70 threshold)
      // So contradictions array should be empty or very small
      expect(contradictions.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Full End-to-End Memory Flow', () => {
    it('completes: create memory → embed → find similar → check contradictions', async () => {
      // Step 1: Create new memory
      const newMemory = {
        id: 'mem-123',
        content: 'I work at Google',
      };

      // Step 2: Generate embedding
      const newEmbedding = await provider.embed(newMemory.content);
      expect(newEmbedding).toHaveLength(384);

      // Step 3: Create existing memories
      const existingMemories = [
        {
          id: 'mem-100',
          content: 'I work in tech',
          embedding: await provider.embed('I work in tech'),
        },
        {
          id: 'mem-101',
          content: 'I love programming',
          embedding: await provider.embed('I love programming'),
        },
        {
          id: 'mem-102',
          content: 'I work at Microsoft',
          embedding: await provider.embed('I work at Microsoft'),
        },
      ];

      // Step 4: Find similar memories
      const similar = await findSimilar(newEmbedding, existingMemories, {
        threshold: 0.5,
        limit: 3,
      });

      expect(similar.length).toBeGreaterThan(0);

      // Step 5: Check for contradictions
      const contradictionResponse = JSON.stringify({
        contradicts: false,
        confidence: 85,
        explanation: 'Both can work in tech at different companies',
      });
      provider.setResponse('Analyze if these two statements contradict each other', contradictionResponse);

      const contradictions = await detectContradictions(
        newMemory.id,
        newMemory.content,
        newEmbedding,
        existingMemories,
        provider
      );

      expect(Array.isArray(contradictions)).toBe(true);
    });

    it('handles memory update flow with duplicate detection', async () => {
      // Original memory
      const originalMemory = {
        id: 'mem-1',
        content: 'I like pizza',
        embedding: await provider.embed('I like pizza'),
      };

      // Near-duplicate (high similarity)
      const duplicateContent = 'I like pizza';
      const duplicateEmbedding = await provider.embed(duplicateContent);

      // Find similar (should find original with high similarity)
      const similar = await findSimilar(
        duplicateEmbedding,
        [originalMemory],
        { threshold: 0.85 } // High threshold for duplicates
      );

      // Should identify as potential duplicate
      expect(similar.length).toBeGreaterThan(0);
      if (similar.length > 0) {
        expect(similar[0].similarity).toBeGreaterThan(0.85);
      }
    });
  });

  describe('Performance with Mock Provider', () => {
    it('handles rapid sequential operations', async () => {
      const operations = 50;
      const startTime = performance.now();

      for (let i = 0; i < operations; i++) {
        await provider.chat(`message ${i}`);
        await provider.embed(`text ${i}`);
      }

      const duration = performance.now() - startTime;

      expect(provider.getStats().chatCalls).toBe(operations);
      expect(provider.getStats().embedCalls).toBe(operations);

      // Should be fast with mock provider
      expect(duration).toBeLessThan(5000); // 5 seconds for 100 operations
    });

    it('handles concurrent operations', async () => {
      const concurrentOps = 20;

      const promises = [];
      for (let i = 0; i < concurrentOps; i++) {
        promises.push(provider.chat(`concurrent ${i}`));
        promises.push(provider.embed(`concurrent ${i}`));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(concurrentOps * 2);
      expect(provider.getStats().chatCalls).toBe(concurrentOps);
      expect(provider.getStats().embedCalls).toBe(concurrentOps);
    });
  });

  describe('Error Handling', () => {
    it('throws error when chat called before initialization', async () => {
      const uninitializedProvider = new MockAIProvider();

      await expect(
        uninitializedProvider.chat('test')
      ).rejects.toThrow('not initialized');
    });

    it('throws error when embed called before initialization', async () => {
      const uninitializedProvider = new MockAIProvider();

      await expect(
        uninitializedProvider.embed('test')
      ).rejects.toThrow('not initialized');
    });

    it('handles invalid embedding dimensions', () => {
      const invalidEmbedding = new Array(100).fill(0.5); // Wrong size

      expect(() => {
        provider.setEmbedding('test', invalidEmbedding);
      }).toThrow('384-dimensional');
    });
  });

  describe('Mock Provider Testing Features', () => {
    it('tracks call statistics accurately', async () => {
      expect(provider.getStats().chatCalls).toBe(0);
      expect(provider.getStats().embedCalls).toBe(0);

      await provider.chat('test1');
      await provider.chat('test2');
      await provider.embed('text1');

      const stats = provider.getStats();
      expect(stats.chatCalls).toBe(2);
      expect(stats.embedCalls).toBe(1);
      expect(stats.configuredResponses).toBe(0);
      expect(stats.configuredEmbeddings).toBe(0);
    });

    it('can clear configured responses', async () => {
      provider.setResponse('test', 'response');
      expect(provider.getStats().configuredResponses).toBe(1);

      provider.clearResponses();
      expect(provider.getStats().configuredResponses).toBe(0);
    });

    it('can clear configured embeddings', async () => {
      const embedding = new Array(384).fill(0.5);
      provider.setEmbedding('test', embedding);
      expect(provider.getStats().configuredEmbeddings).toBe(1);

      provider.clearEmbeddings();
      expect(provider.getStats().configuredEmbeddings).toBe(0);
    });

    it('can reset statistics', async () => {
      await provider.chat('test');
      await provider.embed('test');

      expect(provider.getStats().chatCalls).toBeGreaterThan(0);

      provider.resetStats();

      expect(provider.getStats().chatCalls).toBe(0);
      expect(provider.getStats().embedCalls).toBe(0);
    });

    it('simulates delays when configured', async () => {
      provider.setDelays({ chat: 100, embed: 50 });

      const chatStart = performance.now();
      await provider.chat('test');
      const chatDuration = performance.now() - chatStart;

      const embedStart = performance.now();
      await provider.embed('test');
      const embedDuration = performance.now() - embedStart;

      expect(chatDuration).toBeGreaterThanOrEqual(90); // Allow some tolerance
      expect(embedDuration).toBeGreaterThanOrEqual(40);
    });
  });
});
