/**
 * Tests for AI Error Handler
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AIError,
  ProviderUnavailableError,
  ModelLoadError,
  EmbeddingError,
  NetworkError,
  ChatError,
  InitializationError,
  DependencyError,
  withRetry,
  AIErrorHandler,
  errorHandler,
} from '../error-handler';

describe('AIError Classes', () => {
  describe('AIError', () => {
    it('should create error with all properties', () => {
      const error = new AIError('Test error', 'TEST_CODE', true);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.recoverable).toBe(true);
      expect(error.name).toBe('AIError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should default recoverable to false', () => {
      const error = new AIError('Test error', 'TEST_CODE');
      expect(error.recoverable).toBe(false);
    });

    it('should store cause error', () => {
      const cause = new Error('Original error');
      const error = new AIError('Test error', 'TEST_CODE', false, cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('ProviderUnavailableError', () => {
    it('should create error with provider name', () => {
      const error = new ProviderUnavailableError('Chrome AI');
      expect(error.message).toBe('AI provider "Chrome AI" is not available');
      expect(error.code).toBe('PROVIDER_UNAVAILABLE');
      expect(error.recoverable).toBe(true);
      expect(error.name).toBe('ProviderUnavailableError');
    });

    it('should store cause error', () => {
      const cause = new Error('API not available');
      const error = new ProviderUnavailableError('Chrome AI', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('ModelLoadError', () => {
    it('should create error with model name', () => {
      const error = new ModelLoadError('gpt-4');
      expect(error.message).toBe('Failed to load model "gpt-4"');
      expect(error.code).toBe('MODEL_LOAD_FAILED');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('EmbeddingError', () => {
    it('should create error with custom message', () => {
      const error = new EmbeddingError('tokenization failed');
      expect(error.message).toBe('Embedding generation failed: tokenization failed');
      expect(error.code).toBe('EMBEDDING_FAILED');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('NetworkError', () => {
    it('should create error with custom message', () => {
      const error = new NetworkError('connection timeout');
      expect(error.message).toBe('Network error: connection timeout');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('ChatError', () => {
    it('should create error with custom message', () => {
      const error = new ChatError('rate limit exceeded');
      expect(error.message).toBe('Chat error: rate limit exceeded');
      expect(error.code).toBe('CHAT_FAILED');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('InitializationError', () => {
    it('should create error with component name', () => {
      const error = new InitializationError('AI Provider');
      expect(error.message).toBe('Failed to initialize AI Provider');
      expect(error.code).toBe('INITIALIZATION_FAILED');
      expect(error.recoverable).toBe(false);
    });
  });

  describe('DependencyError', () => {
    it('should create error with dependency name', () => {
      const error = new DependencyError('transformers.js');
      expect(error.message).toBe('Required dependency not available: transformers.js');
      expect(error.code).toBe('DEPENDENCY_UNAVAILABLE');
      expect(error.recoverable).toBe(false);
    });
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on recoverable errors', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new NetworkError('timeout'))
      .mockResolvedValue('success');

    const promise = withRetry(fn, { maxAttempts: 3, delayMs: 1000 });

    // Fast-forward through the delay
    await vi.advanceTimersByTimeAsync(1000);
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use exponential backoff', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new NetworkError('timeout'))
      .mockRejectedValueOnce(new NetworkError('timeout'))
      .mockResolvedValue('success');

    const promise = withRetry(fn, {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
    });

    // First retry after 1000ms
    await vi.advanceTimersByTimeAsync(1000);

    // Second retry after 2000ms
    await vi.advanceTimersByTimeAsync(2000);

    const result = await promise;
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should respect max delay', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new NetworkError('timeout'))
      .mockRejectedValueOnce(new NetworkError('timeout'))
      .mockResolvedValue('success');

    const promise = withRetry(fn, {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 10,
      maxDelayMs: 2000,
    });

    // First retry after 1000ms
    await vi.advanceTimersByTimeAsync(1000);

    // Second retry capped at 2000ms (not 10000ms)
    await vi.advanceTimersByTimeAsync(2000);

    const result = await promise;
    expect(result).toBe('success');
  });

  it('should not retry non-recoverable errors', async () => {
    const error = new InitializationError('AI Provider');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxAttempts: 3 })).rejects.toThrow(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should throw after max attempts', async () => {
    const error = new NetworkError('timeout');
    const fn = vi.fn().mockRejectedValue(error);

    const promise = withRetry(fn, { maxAttempts: 3, delayMs: 100 });

    // Advance through all retries
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(200);

    await expect(promise).rejects.toThrow(error);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should use custom shouldRetry function', async () => {
    const shouldRetry = vi.fn().mockReturnValue(false);
    const fn = vi.fn().mockRejectedValue(new NetworkError('timeout'));

    await expect(withRetry(fn, { shouldRetry })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry callback', async () => {
    const onRetry = vi.fn();
    const error = new NetworkError('timeout');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const promise = withRetry(fn, { maxAttempts: 3, delayMs: 100, onRetry });

    await vi.advanceTimersByTimeAsync(100);
    await promise;

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(1, error);
  });
});

describe('AIErrorHandler', () => {
  let handler: AIErrorHandler;

  beforeEach(() => {
    handler = AIErrorHandler.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = AIErrorHandler.getInstance();
      const instance2 = AIErrorHandler.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('handle', () => {
    it('should return AIError as-is', () => {
      const aiError = new AIError('test', 'TEST', true);
      const result = handler.handle(aiError);
      expect(result).toBe(aiError);
    });

    it('should convert Chrome AI errors to ProviderUnavailableError', () => {
      const error = new Error('Chrome AI not available');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(ProviderUnavailableError);
      expect(result.code).toBe('PROVIDER_UNAVAILABLE');
    });

    it('should convert network errors to NetworkError', () => {
      const error = new Error('fetch failed: network timeout');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(NetworkError);
      expect(result.code).toBe('NETWORK_ERROR');
    });

    it('should convert model errors to ModelLoadError', () => {
      const error = new Error('failed to load model weights');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(ModelLoadError);
      expect(result.code).toBe('MODEL_LOAD_FAILED');
    });

    it('should convert embedding errors to EmbeddingError', () => {
      const error = new Error('embedding pipeline failed');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(EmbeddingError);
      expect(result.code).toBe('EMBEDDING_FAILED');
    });

    it('should convert chat errors to ChatError', () => {
      const error = new Error('chat completion timeout');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(ChatError);
      expect(result.code).toBe('CHAT_FAILED');
    });

    it('should convert initialization errors to InitializationError', () => {
      const error = new Error('failed to initialize provider');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(InitializationError);
      expect(result.code).toBe('INITIALIZATION_FAILED');
    });

    it('should create generic AIError for unknown errors', () => {
      const error = new Error('unknown error');
      const result = handler.handle(error);
      expect(result).toBeInstanceOf(AIError);
      expect(result.code).toBe('UNKNOWN');
      expect(result.recoverable).toBe(false);
    });

    it('should preserve original error as cause', () => {
      const originalError = new Error('original');
      const result = handler.handle(originalError);
      expect(result.cause).toBe(originalError);
    });
  });

  describe('getUserMessage', () => {
    it('should return message for PROVIDER_UNAVAILABLE', () => {
      const error = new ProviderUnavailableError('Chrome AI');
      const message = handler.getUserMessage(error);
      expect(message).toContain('AI is currently unavailable');
    });

    it('should return message for MODEL_LOAD_FAILED', () => {
      const error = new ModelLoadError('gpt-4');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Failed to download AI models');
    });

    it('should return message for EMBEDDING_FAILED', () => {
      const error = new EmbeddingError('test');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Could not process your text');
    });

    it('should return message for NETWORK_ERROR', () => {
      const error = new NetworkError('timeout');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Network connection issue');
    });

    it('should return message for CHAT_FAILED', () => {
      const error = new ChatError('rate limit');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Unable to generate a response');
    });

    it('should return message for INITIALIZATION_FAILED', () => {
      const error = new InitializationError('provider');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Failed to start the AI system');
    });

    it('should return message for DEPENDENCY_UNAVAILABLE', () => {
      const error = new DependencyError('transformers');
      const message = handler.getUserMessage(error);
      expect(message).toContain('Required AI components are not available');
    });

    it('should return generic message for unknown codes', () => {
      const error = new AIError('test', 'UNKNOWN_CODE');
      const message = handler.getUserMessage(error);
      expect(message).toContain('unexpected error');
    });
  });

  describe('getSupportInfo', () => {
    it('should include error code and type', () => {
      const error = new NetworkError('timeout');
      const info = handler.getSupportInfo(error);
      expect(info).toContain('Error Code: NETWORK_ERROR');
      expect(info).toContain('Error Type: NetworkError');
    });

    it('should include recoverable status', () => {
      const error = new AIError('test', 'TEST', true);
      const info = handler.getSupportInfo(error);
      expect(info).toContain('Recoverable: true');
    });

    it('should include support URL', () => {
      const error = new AIError('test', 'TEST');
      const info = handler.getSupportInfo(error);
      expect(info).toContain('github.com');
    });
  });

  describe('isRecoverable', () => {
    it('should return true for recoverable AIErrors', () => {
      const error = new NetworkError('timeout');
      expect(handler.isRecoverable(error)).toBe(true);
    });

    it('should return false for non-recoverable AIErrors', () => {
      const error = new InitializationError('provider');
      expect(handler.isRecoverable(error)).toBe(false);
    });

    it('should return false for non-AIErrors', () => {
      const error = new Error('generic error');
      expect(handler.isRecoverable(error)).toBe(false);
    });
  });
});

describe('errorHandler singleton', () => {
  it('should export singleton instance', () => {
    expect(errorHandler).toBeInstanceOf(AIErrorHandler);
  });

  it('should be same instance as getInstance', () => {
    expect(errorHandler).toBe(AIErrorHandler.getInstance());
  });
});
