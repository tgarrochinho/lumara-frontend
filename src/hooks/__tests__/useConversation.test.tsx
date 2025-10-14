/**
 * useConversation Hook Tests
 *
 * Tests the useConversation hook including message management,
 * AI integration, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useConversation } from '../useConversation';
import * as registry from '../../lib/ai/registry';
import type { AIProvider } from '../../lib/ai/types';

describe('useConversation hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty messages', () => {
    const { result } = renderHook(() => useConversation());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isTyping).toBe(false);
  });

  it('sends message to AI and receives response', async () => {
    const mockProvider: Partial<AIProvider> = {
      chat: vi.fn().mockResolvedValue('AI response'),
    };
    vi.spyOn(registry, 'selectProvider').mockResolvedValue(mockProvider as AIProvider);

    const { result } = renderHook(() => useConversation());

    await result.current.sendMessage('Hello AI');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Hello AI');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toBe('AI response');
    });
  });

  it('handles errors gracefully', async () => {
    const mockProvider: Partial<AIProvider> = {
      chat: vi.fn().mockRejectedValue(new Error('API error')),
    };
    vi.spyOn(registry, 'selectProvider').mockResolvedValue(mockProvider as AIProvider);

    const { result } = renderHook(() => useConversation());

    await result.current.sendMessage('Hello');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1].content).toContain('error');
    });
  });

  it('clears messages', async () => {
    const mockProvider: Partial<AIProvider> = {
      chat: vi.fn().mockResolvedValue('Response'),
    };
    vi.spyOn(registry, 'selectProvider').mockResolvedValue(mockProvider as AIProvider);

    const { result } = renderHook(() => useConversation());

    await result.current.sendMessage('Test message');

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    await waitFor(() => {
      result.current.clearMessages();
    });

    await waitFor(() => {
      expect(result.current.messages).toEqual([]);
    });
  });

  it('shows typing indicator while AI responds', async () => {
    let resolveChat: (value: string) => void;
    const chatPromise = new Promise<string>(resolve => {
      resolveChat = resolve;
    });

    const mockProvider: Partial<AIProvider> = {
      chat: vi.fn().mockReturnValue(chatPromise),
    };
    vi.spyOn(registry, 'selectProvider').mockResolvedValue(mockProvider as AIProvider);

    const { result } = renderHook(() => useConversation());

    const sendPromise = result.current.sendMessage('Hello');

    await waitFor(() => {
      expect(result.current.isTyping).toBe(true);
    });

    resolveChat!('Response');
    await sendPromise;

    await waitFor(() => {
      expect(result.current.isTyping).toBe(false);
    });
  });

  it('maintains conversation context', async () => {
    const mockProvider: Partial<AIProvider> = {
      chat: vi.fn()
        .mockResolvedValueOnce('First response')
        .mockResolvedValueOnce('Second response'),
    };
    const selectProviderSpy = vi.spyOn(registry, 'selectProvider').mockResolvedValue(mockProvider as AIProvider);

    const { result } = renderHook(() => useConversation());

    await result.current.sendMessage('First message');
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    await result.current.sendMessage('Second message');
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(4);
    });

    // Verify context was passed
    const chatCalls = (mockProvider.chat as ReturnType<typeof vi.fn>).mock.calls;
    expect(chatCalls[1][1]).toBeDefined(); // Second call should have context
    expect(chatCalls[1][1]).toBeInstanceOf(Array);
  });
});
