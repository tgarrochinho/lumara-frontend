/**
 * Provider Abstraction Tests
 *
 * Tests the AI provider abstraction layer and MockAIProvider implementation.
 * Validates provider lifecycle, capabilities, and contract compliance.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider } from '../providers/mock';
import { selectProvider } from '../registry';

describe('AI Provider Abstraction', () => {
  let provider: MockAIProvider;

  beforeEach(() => {
    provider = new MockAIProvider();
  });

  describe('Provider Lifecycle', () => {
    it('initializes successfully', async () => {
      expect(provider.capabilities.chat).toBe(true);
      expect(provider.capabilities.embeddings).toBe(true);

      await provider.initialize();

      const health = await provider.healthCheck();
      expect(health.available).toBe(true);
      expect(health.status).toBe('ready');
    });

    it('reports unavailable before initialization', async () => {
      const health = await provider.healthCheck();

      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('not initialized');
    });

    it('throws error when chat called before initialization', async () => {
      await expect(provider.chat('test')).rejects.toThrow('not initialized');
    });

    it('throws error when embed called before initialization', async () => {
      await expect(provider.embed('test')).rejects.toThrow('not initialized');
    });

    it('can be disposed and reinitialized', async () => {
      await provider.initialize();
      expect((await provider.healthCheck()).available).toBe(true);

      await provider.dispose();
      expect((await provider.healthCheck()).available).toBe(false);

      await provider.initialize();
      expect((await provider.healthCheck()).available).toBe(true);
    });

    it('clears state on disposal', async () => {
      await provider.initialize();
      provider.setResponse('test', 'response');
      provider.setEmbedding('test', new Array(384).fill(0.5));

      const statsBefore = provider.getStats();
      expect(statsBefore.configuredResponses).toBeGreaterThan(0);
      expect(statsBefore.configuredEmbeddings).toBeGreaterThan(0);

      await provider.dispose();

      const statsAfter = provider.getStats();
      expect(statsAfter.configuredResponses).toBe(0);
      expect(statsAfter.configuredEmbeddings).toBe(0);
      expect(statsAfter.chatCalls).toBe(0);
      expect(statsAfter.embedCalls).toBe(0);
    });
  });

  describe('Provider Capabilities', () => {
    it('declares correct capabilities', () => {
      expect(provider.name).toBe('Mock AI Provider');
      expect(provider.type).toBe('local');
      expect(provider.requiresApiKey).toBe(false);
      expect(provider.capabilities).toEqual({
        chat: true,
        embeddings: true,
        streaming: false,
        multimodal: false,
      });
    });

    it('supports chat capability', async () => {
      await provider.initialize();

      const response = await provider.chat('test message');

      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('supports embedding capability', async () => {
      await provider.initialize();

      const embedding = await provider.embed('test text');

      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding).toHaveLength(384);
      embedding.forEach(val => expect(typeof val).toBe('number'));
    });
  });

  describe('Chat Operations', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('generates chat responses', async () => {
      const response = await provider.chat('test prompt');

      expect(typeof response).toBe('string');
      expect(response).toContain('Mock response to:');
      expect(response).toContain('test prompt');
    });

    it('uses configured responses', async () => {
      provider.setResponse('hello', 'Hi there!');
      provider.setResponse('goodbye', 'See you later!');

      expect(await provider.chat('hello')).toBe('Hi there!');
      expect(await provider.chat('goodbye')).toBe('See you later!');
    });

    it('supports pattern matching in responses', async () => {
      provider.setResponse('weather', 'It is sunny today');

      const response = await provider.chat('what is the weather like?');

      // Pattern matching works - finds 'weather' in prompt and returns configured response
      expect(response).toBe('It is sunny today');
    });

    it('handles context in chat', async () => {
      const context = ['message 1', 'message 2', 'message 3'];
      const response = await provider.chat('new message', context);

      expect(response).toContain('3 context messages');
    });

    it('tracks chat call count', async () => {
      expect(provider.getStats().chatCalls).toBe(0);

      await provider.chat('message 1');
      expect(provider.getStats().chatCalls).toBe(1);

      await provider.chat('message 2');
      expect(provider.getStats().chatCalls).toBe(2);

      await provider.chat('message 3');
      expect(provider.getStats().chatCalls).toBe(3);
    });

    it('can clear configured responses', async () => {
      provider.setResponse('test', 'response');
      expect(provider.getStats().configuredResponses).toBe(1);

      provider.clearResponses();
      expect(provider.getStats().configuredResponses).toBe(0);

      // Should use default response now
      const response = await provider.chat('test');
      expect(response).toContain('Mock response to:');
    });
  });

  describe('Embedding Operations', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('generates 384-dimensional embeddings', async () => {
      const embedding = await provider.embed('test text');

      expect(embedding).toHaveLength(384);
      expect(Array.isArray(embedding)).toBe(true);
    });

    it('generates deterministic embeddings', async () => {
      const text = 'deterministic test';

      const embedding1 = await provider.embed(text);
      const embedding2 = await provider.embed(text);

      expect(embedding1).toEqual(embedding2);
    });

    it('generates different embeddings for different texts', async () => {
      const embedding1 = await provider.embed('text one');
      const embedding2 = await provider.embed('text two');

      // Should be different vectors
      expect(embedding1).not.toEqual(embedding2);
    });

    it('generates normalized embeddings', async () => {
      const embedding = await provider.embed('test');

      // Calculate magnitude
      const magnitude = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0)
      );

      // Should be unit vector (magnitude = 1)
      expect(magnitude).toBeCloseTo(1.0, 5);
    });

    it('uses configured embeddings', async () => {
      const customEmbedding = new Array(384).fill(0.5);
      provider.setEmbedding('custom text', customEmbedding);

      const result = await provider.embed('custom text');

      expect(result).toEqual(customEmbedding);
    });

    it('validates embedding dimensions', () => {
      const invalidEmbedding = new Array(100).fill(0.5);

      expect(() => {
        provider.setEmbedding('test', invalidEmbedding);
      }).toThrow('384-dimensional');
    });

    it('tracks embed call count', async () => {
      expect(provider.getStats().embedCalls).toBe(0);

      await provider.embed('text 1');
      expect(provider.getStats().embedCalls).toBe(1);

      await provider.embed('text 2');
      expect(provider.getStats().embedCalls).toBe(2);
    });

    it('can clear configured embeddings', async () => {
      const embedding = new Array(384).fill(0.5);
      provider.setEmbedding('test', embedding);
      expect(provider.getStats().configuredEmbeddings).toBe(1);

      provider.clearEmbeddings();
      expect(provider.getStats().configuredEmbeddings).toBe(0);
    });
  });

  describe('Health Checks', () => {
    it('returns health status with required fields', async () => {
      const health = await provider.healthCheck();

      expect(health).toHaveProperty('available');
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('message');
      expect(health).toHaveProperty('lastChecked');
      expect(health.lastChecked).toBeInstanceOf(Date);
    });

    it('updates health status after initialization', async () => {
      const healthBefore = await provider.healthCheck();
      expect(healthBefore.available).toBe(false);
      expect(healthBefore.status).toBe('unavailable');

      await provider.initialize();

      const healthAfter = await provider.healthCheck();
      expect(healthAfter.available).toBe(true);
      expect(healthAfter.status).toBe('ready');
    });

    it('updates health status after disposal', async () => {
      await provider.initialize();

      const healthInitialized = await provider.healthCheck();
      expect(healthInitialized.available).toBe(true);

      await provider.dispose();

      const healthDisposed = await provider.healthCheck();
      expect(healthDisposed.available).toBe(false);
    });
  });

  describe('Configuration', () => {
    it('accepts configuration during initialization', async () => {
      const config = {
        apiKey: 'test-key',
        modelName: 'test-model',
        temperature: 0.7,
      };

      await provider.initialize(config);

      const health = await provider.healthCheck();
      expect(health.available).toBe(true);
    });

    it('can simulate delays', async () => {
      await provider.initialize();

      provider.setDelays({
        chat: 50,
        embed: 30,
      });

      // Test chat delay
      const chatStart = performance.now();
      await provider.chat('test');
      const chatDuration = performance.now() - chatStart;
      expect(chatDuration).toBeGreaterThanOrEqual(45); // Some tolerance

      // Test embed delay
      const embedStart = performance.now();
      await provider.embed('test');
      const embedDuration = performance.now() - embedStart;
      expect(embedDuration).toBeGreaterThanOrEqual(25);
    });

    it('can reset delays', async () => {
      await provider.initialize();

      provider.setDelays({ chat: 100 });
      provider.setDelays({ chat: 0 }); // Reset

      const start = performance.now();
      await provider.chat('test');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });

  describe('Statistics Tracking', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('tracks comprehensive statistics', async () => {
      provider.setResponse('test', 'response');
      const embedding = new Array(384).fill(0.5);
      provider.setEmbedding('test', embedding);

      await provider.chat('test');
      await provider.embed('test');

      const stats = provider.getStats();

      expect(stats.chatCalls).toBe(1);
      expect(stats.embedCalls).toBe(1);
      expect(stats.configuredResponses).toBe(1);
      expect(stats.configuredEmbeddings).toBe(1);
    });

    it('can reset statistics', async () => {
      await provider.chat('test');
      await provider.embed('test');

      expect(provider.getStats().chatCalls).toBeGreaterThan(0);

      provider.resetStats();

      const stats = provider.getStats();
      expect(stats.chatCalls).toBe(0);
      expect(stats.embedCalls).toBe(0);
    });

    it('maintains accurate counts over multiple operations', async () => {
      const operations = 10;

      for (let i = 0; i < operations; i++) {
        await provider.chat(`message ${i}`);
        await provider.embed(`text ${i}`);
      }

      const stats = provider.getStats();
      expect(stats.chatCalls).toBe(operations);
      expect(stats.embedCalls).toBe(operations);
    });
  });

  describe('Concurrent Operations', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('handles concurrent chat operations', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        provider.chat(`concurrent ${i}`)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => expect(typeof result).toBe('string'));
      expect(provider.getStats().chatCalls).toBe(10);
    });

    it('handles concurrent embed operations', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        provider.embed(`concurrent ${i}`)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => expect(result).toHaveLength(384));
      expect(provider.getStats().embedCalls).toBe(10);
    });

    it('handles mixed concurrent operations', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(provider.chat(`chat ${i}`));
        promises.push(provider.embed(`embed ${i}`));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(provider.getStats().chatCalls).toBe(5);
      expect(provider.getStats().embedCalls).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('handles empty string chat', async () => {
      const response = await provider.chat('');

      expect(typeof response).toBe('string');
    });

    it('handles empty string embedding', async () => {
      const embedding = await provider.embed('');

      expect(embedding).toHaveLength(384);
    });

    it('handles very long text', async () => {
      const longText = 'a'.repeat(10000);

      const chatResponse = await provider.chat(longText);
      expect(typeof chatResponse).toBe('string');

      const embedding = await provider.embed(longText);
      expect(embedding).toHaveLength(384);
    });

    it('handles special characters', async () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

      const response = await provider.chat(specialText);
      expect(typeof response).toBe('string');

      const embedding = await provider.embed(specialText);
      expect(embedding).toHaveLength(384);
    });

    it('handles unicode characters', async () => {
      const unicodeText = '你好 世界 🌍 مرحبا العالم';

      const response = await provider.chat(unicodeText);
      expect(typeof response).toBe('string');

      const embedding = await provider.embed(unicodeText);
      expect(embedding).toHaveLength(384);
    });

    it('handles multiple initializations without error', async () => {
      await provider.initialize();
      await provider.initialize();
      await provider.initialize();

      const health = await provider.healthCheck();
      expect(health.available).toBe(true);
    });
  });

  describe('Provider Contract Compliance', () => {
    it('implements all required methods', () => {
      expect(typeof provider.initialize).toBe('function');
      expect(typeof provider.chat).toBe('function');
      expect(typeof provider.embed).toBe('function');
      expect(typeof provider.healthCheck).toBe('function');
      expect(typeof provider.dispose).toBe('function');
    });

    it('has all required properties', () => {
      expect(provider.name).toBeDefined();
      expect(provider.type).toBeDefined();
      expect(provider.requiresApiKey).toBeDefined();
      expect(provider.capabilities).toBeDefined();
    });

    it('capabilities have all required fields', () => {
      const caps = provider.capabilities;
      expect(typeof caps.chat).toBe('boolean');
      expect(typeof caps.embeddings).toBe('boolean');
      expect(typeof caps.streaming).toBe('boolean');
      expect(typeof caps.multimodal).toBe('boolean');
    });

    it('chat returns Promise<string>', async () => {
      await provider.initialize();
      const result = provider.chat('test');

      expect(result).toBeInstanceOf(Promise);
      expect(typeof (await result)).toBe('string');
    });

    it('embed returns Promise<number[]>', async () => {
      await provider.initialize();
      const result = provider.embed('test');

      expect(result).toBeInstanceOf(Promise);
      const embedding = await result;
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.every(v => typeof v === 'number')).toBe(true);
    });

    it('healthCheck returns Promise<ProviderHealth>', async () => {
      const result = provider.healthCheck();

      expect(result).toBeInstanceOf(Promise);
      const health = await result;
      expect(typeof health.available).toBe('boolean');
      expect(typeof health.status).toBe('string');
      expect(health.lastChecked).toBeInstanceOf(Date);
    });
  });
});
