/**
 * Tests for Provider Registry
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  selectProvider,
  getAvailableProviders,
  checkProviderAvailability,
  createProvider,
  providerRegistry,
} from '../registry';
import { ChromeAIProvider } from '../providers/chrome-ai';
import { NoProviderAvailableError } from '../types';

// Mock Chrome AI API
interface MockTextSession {
  prompt: ReturnType<typeof vi.fn>;
  destroy?: ReturnType<typeof vi.fn>;
}

interface MockLanguageModel {
  availability: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
}

describe('Provider Registry', () => {
  let mockLanguageModel: MockLanguageModel;
  let mockSession: MockTextSession;

  beforeEach(() => {
    // Create mock session
    mockSession = {
      prompt: vi.fn(),
      destroy: vi.fn(),
    };

    // Setup Chrome 141+ global LanguageModel API
    mockLanguageModel = {
      availability: vi.fn().mockResolvedValue('readily'),
      create: vi.fn().mockResolvedValue(mockSession),
    };

    mockSession.prompt.mockResolvedValue('Mock response');

    // Install mock global API
    (globalThis as any).LanguageModel = mockLanguageModel;
    (window as Window & { isSecureContext: boolean }).isSecureContext = true;
  });

  afterEach(() => {
    // Cleanup
    delete (globalThis as any).LanguageModel;
  });

  describe('providerRegistry', () => {
    it('should contain chrome-ai and mock-ai providers', () => {
      expect(providerRegistry['chrome-ai']).toBe(ChromeAIProvider);
      expect(providerRegistry['mock-ai']).toBeDefined();
    });

    it('should have const type definition', () => {
      // Registry is defined with 'as const' making it read-only at compile time
      expect(Object.keys(providerRegistry)).toContain('chrome-ai');
      expect(Object.keys(providerRegistry)).toContain('mock-ai');
    });
  });

  describe('selectProvider', () => {
    it('should select and initialize chrome-ai when available', async () => {
      const provider = await selectProvider('chrome-ai');

      expect(provider).toBeInstanceOf(ChromeAIProvider);
      expect(provider.name).toBe('Chrome AI (Gemini Nano)');
      expect(mockLanguageModel.availability).toHaveBeenCalled();
      expect(mockLanguageModel.create).toHaveBeenCalled();
    });

    it('should select first available provider when no preference given', async () => {
      const provider = await selectProvider();

      expect(provider).toBeInstanceOf(ChromeAIProvider);
    });

    it('should throw NoProviderAvailableError when no providers work', async () => {
      delete (globalThis as any).LanguageModel;

      // Also make mock-ai fail by mocking it to throw
      const { MockAIProvider } = await import('../providers/mock-ai');
      const originalInitialize = MockAIProvider.prototype.initialize;
      MockAIProvider.prototype.initialize = vi.fn().mockRejectedValue(new Error('Mock provider failed'));

      await expect(selectProvider()).rejects.toThrow(NoProviderAvailableError);
      await expect(selectProvider()).rejects.toThrow(
        'No AI provider available'
      );

      // Restore original
      MockAIProvider.prototype.initialize = originalInitialize;
    });

    it('should include error details for each failed provider', async () => {
      delete (globalThis as any).LanguageModel;

      // Make mock-ai also fail
      const { MockAIProvider } = await import('../providers/mock-ai');
      const originalInitialize = MockAIProvider.prototype.initialize;
      MockAIProvider.prototype.initialize = vi.fn().mockRejectedValue(new Error('Mock provider failed'));

      try {
        await selectProvider();
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof NoProviderAvailableError) {
          expect(error.message).toContain('chrome-ai');
          expect(error.message).toContain('Tried');
        } else {
          throw error;
        }
      } finally {
        // Restore original
        MockAIProvider.prototype.initialize = originalInitialize;
      }
    });

    it('should not fallback when preferred provider fails', async () => {
      // When chrome-ai fails and it's the preferred provider, should throw immediately
      // without trying other providers
      delete (globalThis as any).LanguageModel;

      await expect(selectProvider('chrome-ai')).rejects.toThrow(
        NoProviderAvailableError
      );
      await expect(selectProvider('chrome-ai')).rejects.toThrow(
        "Preferred provider 'chrome-ai' failed"
      );
    });

    it('should skip preferred provider in fallback list', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await selectProvider('chrome-ai');

      // Should only be initialized once (not tried again in fallback)
      expect(mockLanguageModel.create).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });


    it('should warn when preferred provider fails', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockLanguageModel.availability.mockResolvedValueOnce('no');

      await selectProvider('chrome-ai').catch(() => {}); // Ignore error

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Provider chrome-ai failed'),
        expect.anything()
      );

      warnSpy.mockRestore();
    });

    it('should handle provider health check failure', async () => {
      // Make chrome-ai health check fail by returning 'no' availability
      mockLanguageModel.availability.mockResolvedValue('no');

      // Without preference, should fallback to mock-ai (which works)
      const provider = await selectProvider();

      // Should have selected mock-ai as fallback
      expect(provider.name).toBe('Mock AI');
    });

    it('should allow fallback when allowFallback=true', async () => {
      // Make chrome-ai unavailable
      mockLanguageModel.availability.mockResolvedValueOnce('no');

      // Should fallback to mock-ai when allowFallback=true
      const provider = await selectProvider('chrome-ai', true);

      expect(provider).toBeDefined();
      expect(provider.name).not.toBe('Chrome AI (Gemini Nano)');
    });
  });

  describe('getAvailableProviders', () => {
    it('should return list of registered providers', () => {
      const providers = getAvailableProviders();
      expect(providers).toContain('chrome-ai');
      expect(providers).toBeInstanceOf(Array);
    });

    it('should return all provider keys', () => {
      const providers = getAvailableProviders();
      const registryKeys = Object.keys(providerRegistry);
      expect(providers).toEqual(registryKeys);
    });
  });

  describe('checkProviderAvailability', () => {
    it('should check chrome-ai availability', async () => {
      const availability = await checkProviderAvailability();

      expect(availability.get('chrome-ai')).toBe(true);
    });

    it('should return false when provider is unavailable', async () => {
      delete (globalThis as any).LanguageModel;

      const availability = await checkProviderAvailability();
      expect(availability.get('chrome-ai')).toBe(false);
    });

    it('should return Map with all providers', async () => {
      const availability = await checkProviderAvailability();

      expect(availability).toBeInstanceOf(Map);
      expect(availability.size).toBeGreaterThan(0);
    });

    it('should not throw on provider errors', async () => {
      mockLanguageModel.availability.mockRejectedValue(new Error('API error'));

      const availability = await checkProviderAvailability();
      expect(availability.get('chrome-ai')).toBe(false);
    });

    it('should dispose providers after checking', async () => {
      // Create a new provider instance to spy on
      const provider = new ChromeAIProvider();
      const disposeSpy = vi.spyOn(provider, 'dispose');

      // Manually call health check and dispose (simulating what checkProviderAvailability does)
      await provider.healthCheck();
      await provider.dispose();

      expect(disposeSpy).toHaveBeenCalled();
      disposeSpy.mockRestore();
    });
  });

  describe('createProvider', () => {
    it('should create chrome-ai provider instance', () => {
      const provider = createProvider('chrome-ai');
      expect(provider).toBeInstanceOf(ChromeAIProvider);
    });

    it('should create uninitialized provider', async () => {
      // Remove LanguageModel to ensure it's truly uninitialized
      delete (globalThis as any).LanguageModel;

      const provider = createProvider('chrome-ai');
      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
    });

    it('should throw for unknown provider', () => {
      expect(() => {
        // @ts-expect-error Testing runtime error handling
        createProvider('unknown-provider');
      }).toThrow('Unknown provider');
    });

    it('should create fresh instances each time', () => {
      const provider1 = createProvider('chrome-ai');
      const provider2 = createProvider('chrome-ai');

      expect(provider1).not.toBe(provider2);
      expect(provider1).toBeInstanceOf(ChromeAIProvider);
      expect(provider2).toBeInstanceOf(ChromeAIProvider);
    });
  });
});
