/**
 * Integration tests for useChat hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChat } from '../useChat';
import { selectProvider } from '@/lib/ai/registry';
import { ChromeAIProvider } from '@/lib/ai/providers/chrome-ai';

// Mock the AI system
vi.mock('@/lib/ai/registry', () => ({
  selectProvider: vi.fn(),
}));

vi.mock('@/lib/ai/embeddings/transformers', () => ({
  embeddingsService: {
    initialize: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
  },
}));

describe('useChat', () => {
  const mockProvider = {
    name: 'Chrome AI',
    version: '1.0.0',
    capabilities: {
      chat: true,
      embeddings: false,
      streaming: false,
    },
    chat: vi.fn(),
    initialize: vi.fn().mockResolvedValue(undefined),
    checkHealth: vi.fn().mockResolvedValue({
      healthy: true,
      latencyMs: 10,
    }),
    dispose: vi.fn(),
  } as unknown as ChromeAIProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(selectProvider).mockResolvedValue(mockProvider);
  });

  it('should initialize with empty messages', async () => {
    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should send a message and get AI response', async () => {
    mockProvider.chat = vi.fn().mockResolvedValue('Hello! How can I help you?');

    const { result } = renderHook(() => useChat());

    // Wait for provider to be ready
    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    // Send message
    await result.current.sendMessage('Hi there');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Hi there');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toBe('Hello! How can I help you?');
    });
  });

  it('should handle empty messages', async () => {
    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    await expect(result.current.sendMessage('')).rejects.toThrow(
      'Message content cannot be empty'
    );
  });

  it('should handle AI errors gracefully', async () => {
    mockProvider.chat = vi.fn().mockRejectedValue(new Error('AI Error'));

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    await expect(result.current.sendMessage('Test')).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      // Should have user message and error message
      expect(result.current.messages.length).toBeGreaterThanOrEqual(2);
      const lastMessage = result.current.messages[result.current.messages.length - 1];
      expect(lastMessage.error).toBe(true);
    });
  });

  it('should clear messages', async () => {
    mockProvider.chat = vi.fn().mockResolvedValue('Response');

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    await result.current.sendMessage('Test');

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      result.current.clearMessages();
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });
  });

  it('should remove specific message', async () => {
    mockProvider.chat = vi.fn().mockResolvedValue('Response');

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    await result.current.sendMessage('Test');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    const messageId = result.current.messages[0].id;

    await waitFor(() => {
      result.current.removeMessage(messageId);
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages.find((m) => m.id === messageId)).toBeUndefined();
    });
  });

  it('should include context from previous messages', async () => {
    mockProvider.chat = vi.fn().mockResolvedValue('Response');

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    // Send first message
    await result.current.sendMessage('First message');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    // Send second message
    await result.current.sendMessage('Second message');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(4);
    });

    // Chat should have been called with context
    expect(mockProvider.chat).toHaveBeenCalledTimes(2);
    const secondCall = vi.mocked(mockProvider.chat).mock.calls[1];
    expect(secondCall[1]).toBeDefined(); // Context should be passed
  });

  it('should prevent sending when not ready', async () => {
    const { result } = renderHook(() => useChat());

    // Try to send before ready
    await expect(result.current.sendMessage('Test')).rejects.toThrow('AI not ready');
  });

  it('should set loading state during message send', async () => {
    let resolveChat: ((value: string) => void) | undefined;
    const chatPromise = new Promise<string>((resolve) => {
      resolveChat = resolve;
    });
    mockProvider.chat = vi.fn().mockReturnValue(chatPromise);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.canSend).toBe(true);
    });

    const sendPromise = result.current.sendMessage('Test');

    // Should be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
      expect(result.current.canSend).toBe(false);
    });

    // Resolve the chat
    resolveChat?.('Response');
    await sendPromise;

    // Should no longer be loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.canSend).toBe(true);
    });
  });
});
