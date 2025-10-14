/**
 * Input Field Component
 *
 * Multiline textarea for composing messages with send button.
 * Supports Enter to send, Shift+Enter for new lines.
 */

import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface InputFieldProps {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Multiline input field for chat messages
 *
 * Features:
 * - Enter to send, Shift+Enter for new line
 * - Auto-resize as user types
 * - Disabled state while AI is responding
 * - Auto-focus on mount
 */
export function InputField({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: InputFieldProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSend = async () => {
    if (!value.trim() || disabled) return;

    const content = value.trim();
    setValue(''); // Clear immediately for better UX

    await onSend(content);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
        aria-label="Message input"
        data-testid="message-input"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Send message"
        data-testid="send-button"
      >
        Send
      </button>
    </div>
  );
}
