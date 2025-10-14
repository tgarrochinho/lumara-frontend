/**
 * useConversation Hook
 *
 * React hook for managing conversation with AI provider.
 * Maintains message history and typing state.
 */

import { useCallback, useState } from 'react';
import { selectProvider } from '../lib/ai/registry';
import type { AIProvider } from '../lib/ai/types';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UseConversationReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

/**
 * React hook for managing conversation with AI
 *
 * Uses existing AI provider from registry (Chrome AI by default).
 * Maintains message history and typing state.
 *
 * @returns Conversation state and actions
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { messages, isTyping, sendMessage } = useConversation();
 *
 *   return (
 *     <div>
 *       {messages.map(msg => (
 *         <div key={msg.id}>{msg.role}: {msg.content}</div>
 *       ))}
 *       {isTyping && <div>AI is typing...</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConversation(): UseConversationReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<AIProvider | null>(null);

  const ensureProvider = useCallback(async (): Promise<AIProvider> => {
    if (provider) {
      return provider;
    }

    try {
      const newProvider = await selectProvider('chrome-ai');
      setProvider(newProvider);
      return newProvider;
    } catch (error) {
      console.error('Failed to initialize AI provider:', error);
      throw new Error('No AI provider available');
    }
  }, [provider]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI provider
      const aiProvider = await ensureProvider();

      // Build context from recent messages (last 5)
      const context = messages
        .slice(-5)
        .map(m => `${m.role}: ${m.content}`);

      // Get AI response
      const response = await aiProvider.chat(content, context);

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, ensureProvider]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
  };
}
