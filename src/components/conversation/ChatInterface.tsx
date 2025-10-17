/**
 * Chat Interface Component
 *
 * Main conversational interface for interacting with Lumara's AI.
 * Displays message history and provides input for new messages.
 */

import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useConversation, type Message } from '../../hooks/useConversation';
import { useMemories } from '../../hooks/useMemories';
import { InputField } from './InputField';
import { MemoryExtraction } from './MemoryExtraction';
import { formatTime } from '../../lib/utils/date';
import {
  extractMemoryFromConversation,
  shouldExtractMemory,
  type ExtractedMemory,
} from '../../lib/ai/memory-extraction';

/**
 * Simple text similarity using Levenshtein-inspired comparison
 * Returns similarity score between 0 (completely different) and 1 (identical)
 */
function textSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  // Calculate word-level Jaccard similarity
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Main chat interface component
 *
 * Orchestrates conversation flow between user and AI.
 * Uses useConversation hook for state management.
 */
export function ChatInterface() {
  const { messages, isTyping, sendMessage } = useConversation();
  const { memories, createMemory } = useMemories();
  const [extractedMemory, setExtractedMemory] = useState<ExtractedMemory | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [autoSavedMemory, setAutoSavedMemory] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastProcessedMessageId = useRef<string | null>(null);
  const lastUserMessageIdRef = useRef<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detect scroll position and show/hide scroll-to-bottom button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Find the last message element
      const messageElements = container.querySelectorAll('[data-message-id]');
      if (messageElements.length === 0) {
        setShowScrollButton(false);
        return;
      }

      const lastMessageElement = messageElements[messageElements.length - 1] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const messageRect = lastMessageElement.getBoundingClientRect();

      // Show button if the last message's bottom is not visible in viewport
      // Small buffer of 20px to account for partial visibility
      const isLastMessageFullyVisible = messageRect.bottom <= containerRect.bottom + 20;
      setShowScrollButton(!isLastMessageFullyVisible);
    };

    container.addEventListener('scroll', handleScroll);
    // Also check on mount and when messages change
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  // Auto-scroll to latest user message immediately when sent
  useEffect(() => {
    // Scroll as soon as a new message is added
    if (messages.length > 0) {
      // Find the last user message
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

      // Only scroll when a NEW user message is added
      if (lastUserMessage && lastUserMessage.id !== lastUserMessageIdRef.current) {
        lastUserMessageIdRef.current = lastUserMessage.id;

        // Use requestAnimationFrame to ensure DOM layout is complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const container = scrollContainerRef.current;
              if (container) {
                // Find the element by data-message-id attribute
                const messageElement = container.querySelector(
                  `[data-message-id="${lastUserMessage.id}"]`
                ) as HTMLElement;

                if (messageElement) {
                  // Simply scroll to the element's offsetTop
                  // offsetTop is relative to the offsetParent (the container)
                  container.scrollTo({
                    top: messageElement.offsetTop,
                    behavior: 'smooth'
                  });
                }
              }
            });
          });
        });
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Find the last message element
    const messageElements = container.querySelectorAll('[data-message-id]');
    if (messageElements.length === 0) return;

    const lastMessageElement = messageElements[messageElements.length - 1] as HTMLElement;

    // Scroll to position the last message at the bottom of the viewport
    // Calculate: last message's bottom position minus container height
    const scrollPosition = lastMessageElement.offsetTop + lastMessageElement.offsetHeight - container.clientHeight;

    container.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });
  };

  // Auto-extract and save memory after AI responses
  useEffect(() => {
    const attemptExtraction = async () => {
      // Skip if conditions aren't met
      if (isTyping || extractedMemory || isExtracting) return;
      if (!shouldExtractMemory(messages)) return;

      // Skip if we already processed this conversation
      const lastMessage = messages[messages.length - 1];
      if (lastProcessedMessageId.current === lastMessage.id) return;

      // ONLY extract from user messages (not AI explanations)
      // Get the last USER message (not the AI response)
      const lastUserMessage = [...messages]
        .reverse()
        .find(m => m.role === 'user');

      if (!lastUserMessage) return;

      setIsExtracting(true);

      try {
        // ONLY analyze the USER's message for extraction
        // Don't extract from AI responses - they're explanations, not user knowledge
        const extracted = await extractMemoryFromConversation([{
          role: lastUserMessage.role,
          content: lastUserMessage.content,
        }]);

        if (extracted && extracted.confidence >= 0.8) {
          // Check for duplicates before saving
          const SIMILARITY_THRESHOLD = 0.7; // 70% similar = duplicate
          const isDuplicate = memories?.some(memory =>
            textSimilarity(memory.content, extracted.content) >= SIMILARITY_THRESHOLD
          );

          if (isDuplicate) {
            // Skip saving duplicate, just mark as processed
            lastProcessedMessageId.current = lastMessage.id;
            return;
          }

          // High confidence: auto-save without interruption
          try {
            await createMemory({
              content: extracted.content,
              type: extracted.type,
              tags: extracted.tags,
            });

            // Mark this message as processed
            lastProcessedMessageId.current = lastMessage.id;

            // Show subtle notification
            setAutoSavedMemory(extracted.content);
            setTimeout(() => setAutoSavedMemory(null), 5000); // Hide after 5 seconds
          } catch (error) {
            console.error('Failed to auto-save memory:', error);
            // Fall back to showing review UI on error
            setExtractedMemory(extracted);
          }
        } else if (extracted && extracted.confidence >= 0.5) {
          // Check for duplicates before showing review
          const SIMILARITY_THRESHOLD = 0.7;
          const isDuplicate = memories?.some(memory =>
            textSimilarity(memory.content, extracted.content) >= SIMILARITY_THRESHOLD
          );

          if (isDuplicate) {
            // Skip review for duplicate, just mark as processed
            lastProcessedMessageId.current = lastMessage.id;
            return;
          }

          // Medium confidence: show for review
          setExtractedMemory(extracted);
          // Mark as processed to prevent re-extraction
          lastProcessedMessageId.current = lastMessage.id;
        } else {
          // Low confidence: mark as processed so we don't retry
          lastProcessedMessageId.current = lastMessage.id;
        }
        // Low confidence (<0.5): discard silently
      } catch (error) {
        console.error('Memory extraction failed:', error);
        // Mark as processed even on error to prevent retry loop
        lastProcessedMessageId.current = lastMessage.id;
      } finally {
        setIsExtracting(false);
      }
    };

    attemptExtraction();
  }, [messages, isTyping, extractedMemory, isExtracting]);

  const handleMemorySaved = () => {
    setExtractedMemory(null);
    // Success message logged by MemoryExtraction component
  };

  const handleMemoryCancelled = () => {
    setExtractedMemory(null);
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content, memories);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Auto-save notification (toast) */}
      {autoSavedMemory && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">💾</span>
            <span className="text-green-800 font-medium">Saved:</span>
            <span className="text-green-700 flex-1">{autoSavedMemory}</span>
            <button
              onClick={() => setAutoSavedMemory(null)}
              className="text-green-600 hover:text-green-800"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message List Area */}
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-auto p-4 pb-[calc(100vh-16rem)] space-y-4 relative h-[calc(100vh-12rem)]"
        data-testid="message-list"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Messages in chronological order (oldest first, newest last) */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                data-message-id={message.id}
                className={index > 0 && message.role === 'user' ? 'pt-12' : ''}
              >
                <MessageBubble message={message} />
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Lumara is thinking...</span>
              </div>
            )}
          </>
        )}

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Memory Extraction Preview (if active) */}
      {extractedMemory && (
        <MemoryExtraction
          extracted={extractedMemory}
          onSave={handleMemorySaved}
          onCancel={handleMemoryCancelled}
        />
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <InputField
          onSend={handleSend}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

/**
 * Empty state when no messages exist
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Start a conversation
        </h2>
        <p className="text-gray-600">
          Tell me something you'd like to remember. I'll help you
          capture it as a memory you can reference later.
        </p>
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-2">Try asking:</p>
          <ul className="space-y-1 text-left">
            <li className="pl-4">• "I learned that React hooks run on every render"</li>
            <li className="pl-4">• "I prefer morning work sessions for deep focus"</li>
            <li className="pl-4">• "My debugging approach is to check the console first"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple message bubble (basic version, polish in Task 33)
 */
interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${message.role}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-left">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-left prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-p:text-left prose-ul:text-left prose-ol:text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <time
          className={`text-xs mt-2 block ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
          dateTime={message.timestamp.toISOString()}
        >
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
}
