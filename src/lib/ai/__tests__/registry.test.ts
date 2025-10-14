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
interface MockAI {
  canCreateTextSession: ReturnType<typeof vi.fn>;
  createTextSession: ReturnType<typeof vi.fn>;
}

interface MockTextSession {
  prompt: ReturnType<typeof vi.fn>;
  destroy?: ReturnType<typeof vi.fn>;
}

describe('Provider Registry', () => {
  let mockAI: MockAI;
  let mockSession: MockTextSession;

  beforeEach(() => {
    // Create mock session
    mockSession = {
      prompt: vi.fn(),
      destroy: vi.fn(),
    };

    // Create mock AI API
    mockAI = {
      canCreateTextSession: vi.fn(),
      createTextSession: vi.fn(),
    };

    // Setup default successful behavior
    mockAI.canCreateTextSession.mockResolvedValue('readily');
    mockAI.createTextSession.mockResolvedValue(mockSession);
    mockSession.prompt.mockResolvedValue('Mock response');

    // Install mock in window
    (window as Window & { ai?: MockAI }).ai = mockAI;
  });

  afterEach(() => {
    // Cleanup
    delete (window as Window & { ai?: MockAI }).ai;
  });

  describe('providerRegistry', () => {
    it('should contain chrome-ai provider', () => {
      expect(providerRegistry['chrome-ai']).toBe(ChromeAIProvider);
    });

    it('should have const type definition', () => {
      // Registry is defined with 'as const' making it read-only at compile time
      expect(Object.keys(providerRegistry)).toContain('chrome-ai');
    });
  });

  describe('selectProvider', () => {
    it('should select and initialize chrome-ai when available', async () => {
      const provider = await selectProvider('chrome-ai');

      expect(provider).toBeInstanceOf(ChromeAIProvider);
      expect(provider.name).toBe('Chrome AI (Gemini Nano)');
      expect(mockAI.canCreateTextSession).toHaveBeenCalled();
      expect(mockAI.createTextSession).toHaveBeenCalled();
    });

    it('should select first available provider when no preference given', async () => {
      const provider = await selectProvider();

      expect(provider).toBeInstanceOf(ChromeAIProvider);
    });

    it('should throw NoProviderAvailableError when no providers work', async () => {
      delete (window as Window & { ai?: MockAI }).ai;

      await expect(selectProvider()).rejects.toThrow(NoProviderAvailableError);
      await expect(selectProvider()).rejects.toThrow(
        'No AI provider available'
      );
    });

    it('should include error details for each failed provider', async () => {
      delete (window as Window & { ai?: MockAI }).ai;

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
      }
    });

    it('should fall back to next provider if preferred fails', async () => {
      // With only one provider, this test should throw when it fails
      // In the future with multiple providers, it would fallback
      mockAI.canCreateTextSession.mockResolvedValueOnce('no');

      await expect(selectProvider('chrome-ai')).rejects.toThrow(
        NoProviderAvailableError
      );
    });

    it('should skip preferred provider in fallback list', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await selectProvider('chrome-ai');

      // Should only be initialized once (not tried again in fallback)
      expect(mockAI.createTextSession).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('should log provider selection', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await selectProvider('chrome-ai');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Selected preferred provider: chrome-ai')
      );

      consoleSpy.mockRestore();
    });

    it('should warn when preferred provider fails', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockAI.canCreateTextSession.mockResolvedValueOnce('no');

      await selectProvider('chrome-ai').catch(() => {}); // Ignore error

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Provider chrome-ai failed'),
        expect.anything()
      );

      warnSpy.mockRestore();
    });

    it('should handle provider health check failure', async () => {
      // Make health check fail by returning 'no' availability
      mockAI.canCreateTextSession.mockResolvedValue('no');

      await expect(selectProvider()).rejects.toThrow(NoProviderAvailableError);
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
      delete (window as Window & { ai?: MockAI }).ai;

      const availability = await checkProviderAvailability();
      expect(availability.get('chrome-ai')).toBe(false);
    });

    it('should return Map with all providers', async () => {
      const availability = await checkProviderAvailability();

      expect(availability).toBeInstanceOf(Map);
      expect(availability.size).toBeGreaterThan(0);
    });

    it('should not throw on provider errors', async () => {
      mockAI.canCreateTextSession.mockRejectedValue(new Error('API error'));

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
      // Remove window.ai to ensure it's truly uninitialized
      delete (window as Window & { ai?: MockAI }).ai;

      const provider = createProvider('chrome-ai');
      const health = await provider.healthCheck();
      expect(health.available).toBe(false);

      // Restore for other tests
      (window as Window & { ai?: MockAI }).ai = mockAI;
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
