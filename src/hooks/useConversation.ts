/**
 * useConversation Hook
 *
 * React hook for managing conversation with AI provider.
 * Maintains message history and typing state.
 * Supports streaming responses when available (Chrome AI).
 */

import { useCallback, useState } from 'react';
import { selectProvider } from '../lib/ai/registry';
import { getProviderConfig } from '../lib/ai/config';
import type { AIProvider } from '../lib/ai/types';
import type { Memory } from '../lib/db';
import { searchMemories } from '../lib/db/memories';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UseConversationReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string, memories?: Memory[]) => Promise<void>;
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
      // Get provider configuration (API key, system prompt, etc.)
      const config = getProviderConfig();

      // Initialize the configured provider with config (includes API key)
      const newProvider = await selectProvider(config.provider, config);

      setProvider(newProvider);
      return newProvider;
    } catch (error) {
      console.error('Failed to initialize AI provider:', error);
      throw new Error('No AI provider available');
    }
  }, [provider]);

  const sendMessage = useCallback(async (content: string, memories?: Memory[]) => {
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
      // Detect if user is asking a question or sharing information
      const isQuestion = content.trim().endsWith('?') ||
        /^(what|how|why|when|where|who|can|could|would|should|is|are|do|does|did|tell me|show me|explain)/i.test(content.trim());

      // Get AI provider with adjusted config
      const aiProvider = await ensureProvider();

      // Build context from recent messages (last 5)
      let context = messages
        .slice(-5)
        .map(m => `${m.role}: ${m.content}`);

      // For questions: Search memories using semantic similarity
      if (isQuestion && memories && memories.length > 0) {
        try {
          // Use semantic search with embeddings (RAG)
          // Threshold: 0.15 (15% similarity) - accounts for semantic gap between questions and statements
          // Example: "What TV shows?" vs "User likes Big Bang Theory" only scores 16%
          // Limit: 5 most relevant memories
          const relevantMemories = await searchMemories(content, 0.15, 5);

          if (relevantMemories.length > 0) {
            // Found relevant memories - use them in context
            const memoryContext = relevantMemories
              .map(m => `Memory (${m.type}, ${(m.score * 100).toFixed(0)}% match): ${m.content}`)
              .join('\n');

            context = [`Relevant memories:\n${memoryContext}`, ...context];
          } else {
            // No relevant memories - ask for permission to explore
            const confirmationMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: 'I don\'t have any memories about this topic yet. Would you like me to explore this using my general knowledge, or would you prefer to share what you know first?',
              timestamp: new Date(),
            };

            setMessages(prev => [...prev, confirmationMessage]);
            setIsTyping(false);
            return;
          }
        } catch (error) {
          console.error('Semantic search failed, skipping memory retrieval:', error);
          // Continue without memory context if search fails
        }
      }

      // Stream AI response
      let fullResponse = '';
      let firstChunkReceived = false;
      const assistantMessageId = `assistant-${Date.now()}`;

      try {
        // Try streaming if available
        if (aiProvider.capabilities.streaming && aiProvider.chatStream) {
          for await (const chunk of aiProvider.chatStream(content, context)) {
            // On first chunk, create message and stop typing indicator
            if (!firstChunkReceived) {
              const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, assistantMessage]);
              setIsTyping(false);
              firstChunkReceived = true;
            }

            fullResponse += chunk;

            // Update message content with accumulated response
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            );
          }
        } else {
          // Fallback to non-streaming
          const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);

          fullResponse = await aiProvider.chat(content, context);
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullResponse }
                : msg
            )
          );
        }
      } catch (streamError) {
        // If streaming fails, try non-streaming fallback
        console.warn('Streaming failed, falling back to regular chat:', streamError);

        // Create message if not already created
        if (!firstChunkReceived) {
          const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
        }

        fullResponse = await aiProvider.chat(content, context);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
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
