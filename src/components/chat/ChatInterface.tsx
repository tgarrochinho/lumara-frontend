import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useMemoryCreation } from '@/hooks/useMemoryCreation';
import { useAIStatus } from '@/hooks/useAIStatus';
import type { MemoryType } from '@/lib/db';

/**
 * ChatInterface Component
 *
 * Main chat interface that integrates AI provider, chat functionality,
 * and memory creation with contradiction/duplicate detection.
 *
 * Features:
 * - Real-time chat with AI
 * - Message history
 * - Memory creation from chat messages
 * - Contradiction and duplicate warnings
 * - Loading states and error handling
 *
 * @example
 * ```tsx
 * function App() {
 *   return <ChatInterface />;
 * }
 * ```
 */
export function ChatInterface() {
  const { status: aiStatus, error: aiError, isReady, progress, progressMessage } = useAIStatus();
  const { messages, sendMessage, isLoading: isChatLoading, error: chatError } = useChat();
  const {
    checkForIssues,
    createMemory,
    isCheckingIssues,
    isCreating,
    contradiction,
    duplication,
    clearWarnings,
  } = useMemoryCreation();

  const [input, setInput] = useState('');
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(false);
  const [pendingMemoryContent, setPendingMemoryContent] = useState<string>('');
  const [pendingEmbedding, setPendingEmbedding] = useState<number[]>([]);
  const [memoryType, setMemoryType] = useState<MemoryType>('knowledge');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !isReady || isChatLoading) return;

    try {
      await sendMessage(input);
      setInput('');

      // After AI response, ask if user wants to save as memory
      setShowMemoryPrompt(true);
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInitiateSaveMemory = async () => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'assistant') return;

    setPendingMemoryContent(lastMessage.content);

    try {
      // Check for contradictions/duplicates
      const { embedding, hasIssues } = await checkForIssues(lastMessage.content);
      setPendingEmbedding(embedding);

      if (hasIssues) {
        // Show warnings, let user decide
        return;
      }

      // If no issues, proceed to save
      await handleSaveMemory(lastMessage.content, embedding);
    } catch (error) {
      console.error('Error checking memory issues:', error);
    }
  };

  const handleSaveMemory = async (content?: string, embedding?: number[]) => {
    const memoryContent = content || pendingMemoryContent;
    const memoryEmbedding = embedding || pendingEmbedding;

    if (!memoryContent || !memoryEmbedding.length) return;

    try {
      await createMemory(
        {
          content: memoryContent,
          type: memoryType,
        },
        memoryEmbedding
      );

      // Reset state
      setShowMemoryPrompt(false);
      setPendingMemoryContent('');
      setPendingEmbedding([]);
      clearWarnings();
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  };

  const handleCancelMemory = () => {
    setShowMemoryPrompt(false);
    setPendingMemoryContent('');
    setPendingEmbedding([]);
    clearWarnings();
  };

  const handleOverrideWarnings = async () => {
    await handleSaveMemory();
  };

  return (
    <div className="chat-interface" style={styles.container}>
      {/* Header */}
      <div className="chat-header" style={styles.header}>
        <h2 style={styles.title}>Chat with Lumara</h2>
        <div style={styles.statusContainer}>
          {aiStatus === 'initializing' && (
            <span style={{ ...styles.status, ...styles.statusLoading }}>
              {progressMessage} ({progress.toFixed(0)}%)
            </span>
          )}
          {aiStatus === 'ready' && (
            <span style={{ ...styles.status, ...styles.statusReady }}>AI Ready</span>
          )}
          {aiStatus === 'error' && (
            <span style={{ ...styles.status, ...styles.statusError }}>
              AI Error: {aiError?.message}
            </span>
          )}
          {aiStatus === 'degraded' && (
            <span style={{ ...styles.status, ...styles.statusError }}>
              AI Degraded
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p>Start a conversation with Lumara</p>
            <p style={styles.emptyStateHint}>
              Ask questions, share thoughts, or create memories
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message message-${message.role}`}
            style={{
              ...styles.message,
              ...(message.role === 'user' ? styles.messageUser : styles.messageAssistant),
              ...(message.error ? styles.messageError : {}),
            }}
          >
            <div style={styles.messageRole}>
              {message.role === 'user' ? 'You' : 'Lumara'}
            </div>
            <div style={styles.messageContent}>{message.content}</div>
            <div style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div
            className="message-loading"
            style={{ ...styles.message, ...styles.messageAssistant }}
          >
            <div style={styles.messageRole}>Lumara</div>
            <div style={styles.messageContent}>Thinking...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Memory Creation Prompt */}
      {showMemoryPrompt && (
        <div className="memory-prompt" style={styles.memoryPrompt}>
          <div style={styles.memoryPromptContent}>
            <p style={styles.memoryPromptText}>
              Save the last response as a memory?
            </p>

            <div style={styles.memoryTypeSelector}>
              <label style={styles.label}>
                Memory Type:
                <select
                  value={memoryType}
                  onChange={(e) => setMemoryType(e.target.value as MemoryType)}
                  style={styles.select}
                  disabled={isCheckingIssues || isCreating}
                >
                  <option value="knowledge">Knowledge</option>
                  <option value="experience">Experience</option>
                  <option value="method">Method</option>
                </select>
              </label>
            </div>

            {/* Contradiction Warning */}
            {contradiction?.exists && (
              <div className="contradiction-warning" style={styles.warning}>
                <strong>Warning: Potential Contradictions</strong>
                <p>
                  This memory contradicts {contradiction.contradictions.length}{' '}
                  existing memory(ies):
                </p>
                <ul style={styles.warningList}>
                  {contradiction.contradictions.map((c, idx) => (
                    <li key={idx}>
                      {c.explanation} (Confidence: {c.confidence}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duplication Warning */}
            {duplication?.exists && (
              <div className="duplication-warning" style={styles.warning}>
                <strong>Warning: Similar Memories Found</strong>
                <p>
                  Found {duplication.duplicates.length} similar memory(ies):
                </p>
                <ul style={styles.warningList}>
                  {duplication.duplicates.map((d, idx) => (
                    <li key={idx}>
                      {d.content.substring(0, 80)}...{' '}
                      (Similarity: {(d.similarity * 100).toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.memoryPromptActions}>
              {(contradiction?.exists || duplication?.exists) ? (
                <>
                  <button
                    onClick={handleOverrideWarnings}
                    disabled={isCreating}
                    style={styles.buttonWarning}
                  >
                    {isCreating ? 'Saving...' : 'Save Anyway'}
                  </button>
                  <button
                    onClick={handleCancelMemory}
                    disabled={isCreating}
                    style={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleInitiateSaveMemory}
                    disabled={isCheckingIssues || isCreating}
                    style={styles.buttonPrimary}
                  >
                    {isCheckingIssues
                      ? 'Checking...'
                      : isCreating
                      ? 'Saving...'
                      : 'Yes, Save'}
                  </button>
                  <button
                    onClick={handleCancelMemory}
                    disabled={isCheckingIssues || isCreating}
                    style={styles.buttonSecondary}
                  >
                    No
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Error */}
      {chatError && (
        <div style={styles.errorBanner}>
          Error: {chatError.message}
        </div>
      )}

      {/* Input */}
      <div className="chat-input" style={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isReady || isChatLoading}
          style={styles.input}
        />
        <button
          onClick={handleSend}
          disabled={!isReady || isChatLoading || !input.trim()}
          style={{
            ...styles.button,
            ...((!isReady || isChatLoading || !input.trim()) && styles.buttonDisabled),
          }}
        >
          {isChatLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

// Inline styles for simplicity - can be moved to CSS modules later
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderLeft: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  statusContainer: {
    fontSize: '0.875rem',
  },
  status: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
  statusLoading: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusReady: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  messages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    margin: 'auto',
  },
  emptyStateHint: {
    fontSize: '0.875rem',
    color: '#999',
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    maxWidth: '80%',
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  messageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    color: '#333',
  },
  messageError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  messageRole: {
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    opacity: 0.8,
  },
  messageContent: {
    fontSize: '0.9375rem',
    lineHeight: 1.5,
  },
  messageTime: {
    fontSize: '0.625rem',
    marginTop: '0.25rem',
    opacity: 0.6,
  },
  memoryPrompt: {
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
    padding: '1rem',
  },
  memoryPromptContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  memoryPromptText: {
    margin: 0,
    fontWeight: 500,
  },
  memoryTypeSelector: {
    display: 'flex',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  select: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.875rem',
  },
  warning: {
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    fontSize: '0.875rem',
  },
  warningList: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.5rem',
  },
  memoryPromptActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  buttonPrimary: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonWarning: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: '#000',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  errorBanner: {
    padding: '0.75rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderTop: '1px solid #f5c6cb',
    fontSize: '0.875rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.9375rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};
