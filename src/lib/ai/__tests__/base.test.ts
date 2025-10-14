/**
 * Tests for BaseProvider Abstract Class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseProvider } from '../providers/base';
import type { AICapabilities, ProviderConfig } from '../types';

/**
 * Concrete test implementation of BaseProvider
 */
class TestProvider extends BaseProvider {
  readonly name = 'Test Provider';
  readonly type = 'local' as const;
  readonly requiresApiKey = false;
  capabilities: AICapabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  chatMock = vi.fn<(message: string, context?: string[]) => Promise<string>>();
  embedMock = vi.fn<(text: string) => Promise<number[]>>();
  initializeMock = vi.fn<(config?: ProviderConfig) => Promise<void>>();
  disposeMock = vi.fn<() => Promise<void>>();

  async chat(message: string, context?: string[]): Promise<string> {
    return this.chatMock(message, context);
  }

  async embed(text: string): Promise<number[]> {
    return this.embedMock(text);
  }

  async initialize(config?: ProviderConfig): Promise<void> {
    await this.initializeMock(config);
    this.storeConfig(config);
    this.markInitialized();
  }

  async dispose(): Promise<void> {
    await this.disposeMock();
    this.resetState();
  }
}

describe('BaseProvider', () => {
  let provider: TestProvider;

  beforeEach(() => {
    provider = new TestProvider();
  });

  describe('initialization state', () => {
    it('should start uninitialized', () => {
      expect(provider['initialized']).toBe(false);
    });

    it('should track initialization state', async () => {
      await provider.initialize();
      expect(provider['initialized']).toBe(true);
    });
  });

  describe('healthCheck', () => {
    it('should return unavailable when not initialized', async () => {
      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('Test Provider');
      expect(health.lastChecked).toBeInstanceOf(Date);
    });

    it('should return ready when initialized', async () => {
      await provider.initialize();
      const health = await provider.healthCheck();
      expect(health.available).toBe(true);
      expect(health.status).toBe('ready');
      expect(health.message).toContain('Test Provider is ready');
    });

    it('should cache health check results for 10 seconds', async () => {
      const health1 = await provider.healthCheck();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const health2 = await provider.healthCheck();

      // Should be the same object (cached)
      expect(health1).toBe(health2);
      expect(health1.lastChecked).toBe(health2.lastChecked);
    });

    it('should refresh cache after 10 seconds', async () => {
      // Mock timers to speed up test
      vi.useFakeTimers();

      const health1 = await provider.healthCheck();
      vi.advanceTimersByTime(11000); // Advance 11 seconds
      const health2 = await provider.healthCheck();

      // Should be different objects (cache expired)
      expect(health1).not.toBe(health2);
      expect(health1.lastChecked.getTime()).not.toBe(health2.lastChecked.getTime());

      vi.useRealTimers();
    });
  });

  describe('ensureInitialized', () => {
    it('should throw when not initialized', () => {
      expect(() => provider['ensureInitialized']()).toThrow(
        'Test Provider is not initialized'
      );
    });

    it('should not throw when initialized', async () => {
      await provider.initialize();
      expect(() => provider['ensureInitialized']()).not.toThrow();
    });
  });

  describe('abstract method requirements', () => {
    it('should require chat implementation', () => {
      expect(provider.chat).toBeDefined();
      expect(typeof provider.chat).toBe('function');
    });

    it('should require embed implementation', () => {
      expect(provider.embed).toBeDefined();
      expect(typeof provider.embed).toBe('function');
    });

    it('should require initialize implementation', () => {
      expect(provider.initialize).toBeDefined();
      expect(typeof provider.initialize).toBe('function');
    });

    it('should require dispose implementation', () => {
      expect(provider.dispose).toBeDefined();
      expect(typeof provider.dispose).toBe('function');
    });
  });

  describe('config storage', () => {
    it('should store config when initialized', async () => {
      const config: ProviderConfig = {
        temperature: 0.7,
        maxTokens: 1000,
      };
      await provider.initialize(config);
      expect(provider['config']).toBe(config);
    });

    it('should clear config on dispose', async () => {
      const config: ProviderConfig = { temperature: 0.7 };
      await provider.initialize(config);
      await provider.dispose();
      expect(provider['config']).toBeUndefined();
    });
  });
});
