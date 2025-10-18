/**
 * Tests for ChromeAIProvider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChromeAIProvider } from '../providers/chrome-ai';
import { ProviderInitializationError } from '../types';

// Mock Chrome AI API
interface MockTextSession {
  prompt: ReturnType<typeof vi.fn>;
  promptStreaming?: (input: string) => AsyncIterable<string>;
  destroy?: ReturnType<typeof vi.fn>;
}

describe('ChromeAIProvider', () => {
  let provider: ChromeAIProvider;
  let mockSession: MockTextSession;

  beforeEach(() => {
    provider = new ChromeAIProvider();

    // Create mock session
    mockSession = {
      prompt: vi.fn(),
      destroy: vi.fn(),
    };

    // Setup Chrome 141+ global LanguageModel API (default)
    const mockLanguageModel = {
      availability: vi.fn().mockResolvedValue('readily'),
      create: vi.fn().mockResolvedValue(mockSession),
    };

    (globalThis as any).LanguageModel = mockLanguageModel;
    (window as Window & { isSecureContext: boolean }).isSecureContext = true;
  });

  afterEach(() => {
    // Cleanup
    delete (globalThis as any).LanguageModel;
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
        streaming: true,
        multimodal: false,
      });
    });
  });

  describe('initialize', () => {
    it('should successfully initialize when Chrome 141+ API is available', async () => {
      await provider.initialize();

      expect((globalThis as any).LanguageModel.availability).toHaveBeenCalled();
      expect((globalThis as any).LanguageModel.create).toHaveBeenCalled();
      expect(provider['initialized']).toBe(true);
      expect(provider['session']).toBe(mockSession);
    });

    it('should throw when LanguageModel API is not available', async () => {
      delete (globalThis as any).LanguageModel;

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('Chrome AI global LanguageModel API not found');
      expect(error.cause?.message).toContain('Chrome 141+');
    });

    it('should throw when model is not available (no)', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('no');

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('not available on this device');
    });

    it('should throw when model needs download', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('after-download');

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('needs to be downloaded');
    });

    it('should pass temperature config to session', async () => {
      const config = { temperature: 0.8 };
      await provider.initialize(config);

      expect((globalThis as any).LanguageModel.create).toHaveBeenCalledWith({ temperature: 0.8 });
    });

    it('should support system prompts', async () => {
      const config = { systemPrompt: 'You are a helpful assistant.' };
      await provider.initialize(config as any);

      expect((globalThis as any).LanguageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          systemPrompt: 'You are a helpful assistant.',
        })
      );
    });

  });

  describe('healthCheck', () => {
    it('should return unavailable when LanguageModel API is missing', async () => {
      delete (globalThis as any).LanguageModel;

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('Chrome AI global LanguageModel API not found');
      expect(health.message).toContain('Chrome 141+');
    });

    it('should return unavailable when model is not supported', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('no');

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('not supported on this device');
    });

    it('should return initializing when model is downloading', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('after-download');

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
      expect(health.message).toContain('Chrome 141+');
    });

    it('should return error status when check fails', async () => {
      (globalThis as any).LanguageModel.availability.mockRejectedValue(new Error('API error'));

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
      mockSession.prompt.mockResolvedValue('AI response');

      const response = await uninitializedProvider.chat('Hello');
      expect(response).toBe('AI response');
      expect((globalThis as any).LanguageModel.create).toHaveBeenCalled();
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

  });


  describe('secure context check', () => {
    it('should throw when not in secure context', async () => {
      (window as Window & { isSecureContext: boolean }).isSecureContext = false;

      const error = await provider.initialize().catch(e => e);
      expect(error).toBeInstanceOf(ProviderInitializationError);
      expect(error.cause?.message).toContain('secure context');
      expect(error.cause?.message).toContain('HTTPS');
    });

    it('should return unavailable health status in insecure context', async () => {
      (window as Window & { isSecureContext: boolean }).isSecureContext = false;

      const health = await provider.healthCheck();
      expect(health.available).toBe(false);
      expect(health.status).toBe('unavailable');
      expect(health.message).toContain('HTTPS');
    });
  });

  describe('streaming', () => {
    beforeEach(async () => {
      // Add streaming support to mock session
      mockSession.promptStreaming = async function* (_input: string) {
        yield 'Hello ';
        yield 'world';
        yield '!';
      };

      await provider.initialize();
    });

    it('should stream responses', async () => {
      const chunks: string[] = [];

      for await (const chunk of provider.chatStream('Test')) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['Hello ', 'world', '!']);
    });

    it('should include context in streamed prompts', async () => {
      const streamSpy = vi.spyOn(mockSession, 'promptStreaming' as any);

      const chunks: string[] = [];
      for await (const chunk of provider.chatStream('New message', ['Context 1'])) {
        chunks.push(chunk);
      }

      expect(streamSpy).toHaveBeenCalledWith(expect.stringContaining('Context:'));
      expect(streamSpy).toHaveBeenCalledWith(expect.stringContaining('Context 1'));
    });

    it('should throw if streaming not supported', async () => {
      mockSession.promptStreaming = undefined;

      // Try to consume the generator
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _chunk of provider.chatStream('Test')) {
          // Should not get here
        }
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Streaming is not supported');
      }
    });
  });

  describe('model download', () => {
    it('should trigger download when status is after-download', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('after-download');
      mockSession.destroy = vi.fn();

      const result = await provider.downloadModel();

      expect((globalThis as any).LanguageModel.create).toHaveBeenCalled();
      expect(mockSession.destroy).toHaveBeenCalled();
      expect(result).toBe('readily');
    });

    it('should return readily when model is available', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('readily');

      const result = await provider.downloadModel();

      expect(result).toBe('readily');
    });

    it('should return no when model is not supported', async () => {
      (globalThis as any).LanguageModel.availability.mockResolvedValue('no');

      const result = await provider.downloadModel();

      expect(result).toBe('no');
    });

    it('should throw when LanguageModel API is not available', async () => {
      delete (globalThis as any).LanguageModel;

      await expect(provider.downloadModel()).rejects.toThrow('Chrome AI global LanguageModel API not found');
    });
  });
});
