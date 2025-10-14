import { useState, useCallback } from 'react';
import { useAIStatus } from './useAIStatus';
import { AIError } from '@/lib/ai';

/**
 * Chat message interface
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

/**
 * Chat hook with AI provider integration
 *
 * Manages chat messages and AI provider communication.
 * Handles message state, loading states, and error handling.
 *
 * @returns Chat state and message sending function
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { messages, sendMessage, isLoading, error } = useChat();
 *
 *   const handleSend = async (text: string) => {
 *     await sendMessage(text);
 *   };
 *
 *   return (
 *     <div>
 *       {messages.map(msg => (
 *         <div key={msg.id}>{msg.content}</div>
 *       ))}
 *       {isLoading && <div>Loading...</div>}
 *       {error && <div>Error: {error.message}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChat() {
  const { provider, status } = useAIStatus();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Send a message and get AI response
   *
   * @param content User message content
   * @throws {AIError} If AI provider is not ready or response fails
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!provider || status !== 'ready') {
        throw new AIError('AI not ready', 'PROVIDER_NOT_READY');
      }

      if (!content.trim()) {
        throw new Error('Message content cannot be empty');
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Build context from previous messages (last 5 for context window)
        const recentMessages = messages.slice(-5);
        const context = recentMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        // Get AI response
        const response = await provider.chat(content, context);

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        console.error('Chat error:', err);

        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        // Add error message to chat
        const errorChatMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: new Date(),
          error: true,
        };

        setMessages(prev => [...prev, errorChatMessage]);
        setError(err instanceof Error ? err : new Error('Unknown error'));

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [provider, status, messages]
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Remove a specific message
   */
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    removeMessage,
    isLoading,
    error,
    canSend: status === 'ready' && !isLoading,
  };
}
