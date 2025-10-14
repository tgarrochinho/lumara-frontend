import { useState } from 'react';
import { useMemoryCreation } from '@/hooks/useMemoryCreation';
import type { MemoryType } from '@/lib/db';

/**
 * MemoryCreationFlow Component
 *
 * Standalone component for creating memories with:
 * - Content input
 * - Memory type selection
 * - Tag management
 * - Contradiction detection
 * - Duplicate detection
 * - Loading states
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <MemoryCreationFlow
 *       onMemoryCreated={(id) => console.log('Created:', id)}
 *     />
 *   );
 * }
 * ```
 */
export interface MemoryCreationFlowProps {
  /** Callback when memory is successfully created */
  onMemoryCreated?: (memoryId: number) => void;
  /** Callback when creation is cancelled */
  onCancel?: () => void;
  /** Initial content for the memory */
  initialContent?: string;
  /** Initial memory type */
  initialType?: MemoryType;
}

export function MemoryCreationFlow({
  onMemoryCreated,
  onCancel,
  initialContent = '',
  initialType = 'knowledge',
}: MemoryCreationFlowProps) {
  const {
    checkForIssues,
    createMemory,
    isCheckingIssues,
    isCreating,
    contradiction,
    duplication,
    clearWarnings,
    error,
  } = useMemoryCreation();

  const [content, setContent] = useState(initialContent);
  const [type, setType] = useState<MemoryType>(initialType);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [pendingEmbedding, setPendingEmbedding] = useState<number[]>([]);
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCheckMemory = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      const result = await checkForIssues(content);
      setPendingEmbedding(result.embedding);
      setStep('review');
    } catch (err) {
      console.error('Error checking memory:', err);
    }
  };

  const handleSaveMemory = async () => {
    try {
      const memoryId = await createMemory(
        {
          content,
          type,
          tags,
        },
        pendingEmbedding
      );

      // Reset form
      setContent('');
      setType('knowledge');
      setTags([]);
      setPendingEmbedding([]);
      setStep('input');
      clearWarnings();

      onMemoryCreated?.(memoryId);
    } catch (err) {
      console.error('Error saving memory:', err);
    }
  };

  const handleCancelReview = () => {
    setStep('input');
    setPendingEmbedding([]);
    clearWarnings();
  };

  const handleCancel = () => {
    setContent('');
    setType('knowledge');
    setTags([]);
    setPendingEmbedding([]);
    setStep('input');
    clearWarnings();
    onCancel?.();
  };

  return (
    <div className="memory-creation-flow" style={styles.container}>
      <h2 style={styles.title}>Create Memory</h2>

      {step === 'input' && (
        <div style={styles.inputStep}>
          {/* Content */}
          <div style={styles.field}>
            <label style={styles.label}>Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter memory content..."
              rows={6}
              style={styles.textarea}
              disabled={isCheckingIssues}
            />
          </div>

          {/* Type */}
          <div style={styles.field}>
            <label style={styles.label}>Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MemoryType)}
              style={styles.select}
              disabled={isCheckingIssues}
            >
              <option value="knowledge">Knowledge</option>
              <option value="experience">Experience</option>
              <option value="method">Method</option>
            </select>
          </div>

          {/* Tags */}
          <div style={styles.field}>
            <label style={styles.label}>Tags</label>
            <div style={styles.tagsContainer}>
              {tags.map((tag) => (
                <span key={tag} style={styles.tag}>
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    style={styles.tagRemove}
                    disabled={isCheckingIssues}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={styles.tagInputContainer}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add tag..."
                style={styles.input}
                disabled={isCheckingIssues}
              />
              <button
                onClick={handleAddTag}
                style={styles.buttonSecondary}
                disabled={!tagInput.trim() || isCheckingIssues}
              >
                Add
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBanner}>
              Error: {error.message}
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            <button
              onClick={handleCheckMemory}
              disabled={!content.trim() || isCheckingIssues}
              style={{
                ...styles.buttonPrimary,
                ...(!content.trim() || isCheckingIssues ? styles.buttonDisabled : {}),
              }}
            >
              {isCheckingIssues ? 'Checking...' : 'Next'}
            </button>
            {onCancel && (
              <button
                onClick={handleCancel}
                disabled={isCheckingIssues}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'review' && (
        <div style={styles.reviewStep}>
          {/* Content Preview */}
          <div style={styles.field}>
            <label style={styles.label}>Content</label>
            <div style={styles.contentPreview}>{content}</div>
          </div>

          {/* Type & Tags Preview */}
          <div style={styles.metadataPreview}>
            <div>
              <strong>Type:</strong> {type}
            </div>
            {tags.length > 0 && (
              <div>
                <strong>Tags:</strong> {tags.join(', ')}
              </div>
            )}
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
              <p>Found {duplication.duplicates.length} similar memory(ies):</p>
              <ul style={styles.warningList}>
                {duplication.duplicates.map((d, idx) => (
                  <li key={idx}>
                    {d.content.substring(0, 100)}...{' '}
                    (Similarity: {(d.similarity * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Issues */}
          {!contradiction?.exists && !duplication?.exists && (
            <div style={styles.successBanner}>
              No contradictions or duplicates found. Ready to save!
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.errorBanner}>
              Error: {error.message}
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            <button
              onClick={handleSaveMemory}
              disabled={isCreating}
              style={{
                ...styles.buttonPrimary,
                ...(isCreating ? styles.buttonDisabled : {}),
              }}
            >
              {isCreating ? 'Saving...' : 'Save Memory'}
            </button>
            <button
              onClick={handleCancelReview}
              disabled={isCreating}
              style={styles.buttonSecondary}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    padding: '1.5rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#333',
  },
  inputStep: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  reviewStep: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#555',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.875rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.875rem',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    minHeight: '32px',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  tagRemove: {
    border: 'none',
    background: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0 0.25rem',
  },
  tagInputContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  contentPreview: {
    padding: '0.75rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap' as const,
  },
  metadataPreview: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
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
  successBanner: {
    padding: '0.75rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
    fontSize: '0.875rem',
  },
  errorBanner: {
    padding: '0.75rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    fontSize: '0.875rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  buttonPrimary: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};
