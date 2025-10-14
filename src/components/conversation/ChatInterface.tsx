/**
 * Chat Interface Component
 *
 * Main conversational interface for interacting with Lumara's AI.
 * Displays message history and provides input for new messages.
 */

import { useRef, useEffect } from 'react';
import { useConversation, type Message } from '../../hooks/useConversation';
import { InputField } from './InputField';
import { formatTime } from '../../lib/utils/date';

/**
 * Main chat interface component
 *
 * Orchestrates conversation flow between user and AI.
 * Uses useConversation hook for state management.
 */
export function ChatInterface() {
  const { messages, isTyping, sendMessage } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Message List Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        data-testid="message-list"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

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
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time
          className={`text-xs mt-1 block ${
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
