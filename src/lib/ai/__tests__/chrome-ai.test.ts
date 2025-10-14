/**
 * Tests for ChromeAIProvider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChromeAIProvider } from '../providers/chrome-ai';
import { ProviderInitializationError } from '../types';

// Mock Chrome AI API
interface MockAI {
  canCreateTextSession: ReturnType<typeof vi.fn>;
  createTextSession: ReturnType<typeof vi.fn>;
}

interface MockTextSession {
  prompt: ReturnType<typeof vi.fn>;
  destroy?: ReturnType<typeof vi.fn>;
}

describe('ChromeAIProvider', () => {
  let provider: ChromeAIProvider;
  let mockAI: MockAI;
  let mockSession: MockTextSession;

  beforeEach(() => {
    provider = new ChromeAIProvider();

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

    // Install mock in window
    (window as Window & { ai?: MockAI }).ai = mockAI;
  });

  afterEach(() => {
    // Cleanup
    delete (window as Window & { ai?: MockAI }).ai;
  });

  describe('provider metadata', () => {
    it('should have correct name', () => {
      expect(provider.name).toBe('Chrome AI (Gemini Nano)');
    });

    it('should be local provider', () => {
      expect(provider.type).toBe('local');
    });

    it('should not require API key', () => {
      expect(provider.requiresApiKey).toBe(false);
    });

    it('should have correct capabilities', () => {
      expect(provider.capabilities).toEqual({
        chat: true,
        embeddings: false,
        streaming: false,
        multimodal: false,
      });
    });
  });

  describe('initialize', () => {
    it('should successfully initialize when Chrome AI is available', async () => {
      await provider.initialize();

      expect(mockAI.canCreateTextSession).toHaveBeenCalled();
      expect(mockAI.createTextSession).toHaveBeenCalled();
      expect(provider['initialized']).toBe(true);
      expect(provider['session']).toBe(mockSession);
    });

    it('should throw when window.ai is not available', async () => {
      delete (window as Window & { ai?: MockAI }).ai;

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('Chrome AI not available');
    });

    it('should throw when model is not available (no)', async () => {
      mockAI.canCreateTextSession.mockResolvedValue('no');

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('not available on this device');
    });

    it('should throw when model needs download', async () => {
      mockAI.canCreateTextSession.mockResolvedValue('after-download');

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('needs to be downloaded');
    });

    it('should pass temperature config to session', async () => {
      const config = { temperature: 0.8 };
      await provider.initialize(config);

      expect(mockAI.createTextSession).toHaveBeenCalledWith({ temperature: 0.8 });
    });

    it('should log success message', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      await provider.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('initialized successfully')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('healthCheck', () => {
    it('should return unavailable when window.ai is missing', async () => {
      delete (window as Window & { ai?: MockAI }).ai;

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('Chrome AI API not available');
    });

    it('should return unavailable when model is not supported', async () => {
      mockAI.canCreateTextSession.mockResolvedValue('no');

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('not supported on this device');
    });

    it('should return initializing when model is downloading', async () => {
      mockAI.canCreateTextSession.mockResolvedValue('after-download');

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('initializing');
      expect(health.message).toContain('downloading');
    });

    it('should return ready when initialized', async () => {
      await provider.initialize();
      const health = await provider.healthCheck();

      expect(health.available).toBe(true);
      expect(health.status).toBe('ready');
      expect(health.message).toContain('ready');
    });

    it('should return error status when check fails', async () => {
      mockAI.canCreateTextSession.mockRejectedValue(new Error('API error'));

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('error');
      expect(health.message).toContain('Health check failed');
    });
  });

  describe('chat', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    it('should send message and return response', async () => {
      mockSession.prompt.mockResolvedValue('AI response');

      const response = await provider.chat('Hello');
      expect(response).toBe('AI response');
      expect(mockSession.prompt).toHaveBeenCalledWith('Hello');
    });

    it('should include context in prompt', async () => {
      mockSession.prompt.mockResolvedValue('AI response');

      const context = ['Previous message 1', 'Previous message 2'];
      await provider.chat('New message', context);

      expect(mockSession.prompt).toHaveBeenCalledWith(
        expect.stringContaining('Context:')
      );
      expect(mockSession.prompt).toHaveBeenCalledWith(
        expect.stringContaining('Previous message 1')
      );
      expect(mockSession.prompt).toHaveBeenCalledWith(
        expect.stringContaining('New message')
      );
    });

    it('should auto-initialize if not initialized', async () => {
      const uninitializedProvider = new ChromeAIProvider();
      (window as Window & { ai?: MockAI }).ai = mockAI;

      mockSession.prompt.mockResolvedValue('AI response');

      const response = await uninitializedProvider.chat('Hello');
      expect(response).toBe('AI response');
      expect(mockAI.createTextSession).toHaveBeenCalled();
    });

    it('should throw descriptive error on chat failure', async () => {
      mockSession.prompt.mockRejectedValue(new Error('Network error'));

      await expect(provider.chat('Hello')).rejects.toThrow(
        'Chrome AI chat failed'
      );
    });
  });

  describe('embed', () => {
    it('should throw error for embeddings', async () => {
      await expect(provider.embed('test text')).rejects.toThrow(
        'does not support embeddings'
      );
      await expect(provider.embed('test text')).rejects.toThrow(
        'Transformers.js'
      );
    });
  });

  describe('dispose', () => {
    it('should destroy session and reset state', async () => {
      await provider.initialize();
      await provider.dispose();

      expect(mockSession.destroy).toHaveBeenCalled();
      expect(provider['session']).toBe(null);
      expect(provider['initialized']).toBe(false);
      expect(provider['config']).toBeUndefined();
    });

    it('should handle missing destroy method gracefully', async () => {
      delete mockSession.destroy;
      await provider.initialize();

      await expect(provider.dispose()).resolves.not.toThrow();
      expect(provider['session']).toBe(null);
    });

    it('should log disposal message', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      await provider.initialize();
      await provider.dispose();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('disposed')
      );

      consoleSpy.mockRestore();
    });
  });
});
