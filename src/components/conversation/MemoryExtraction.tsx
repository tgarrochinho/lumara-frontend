/**
 * Memory Extraction Component
 *
 * Preview and edit AI-extracted memory before saving.
 * Shows confidence score, allows editing all fields, and handles save/cancel.
 */

import { useState } from 'react';
import { useMemories } from '../../hooks/useMemories';
import type { ExtractedMemory } from '../../lib/ai/memory-extraction';
import type { MemoryType } from '../../lib/db';

export interface MemoryExtractionProps {
  extracted: ExtractedMemory;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Memory preview and edit component
 *
 * Allows user to review and edit AI-extracted memory before saving.
 * Shows confidence score and extraction reasoning.
 *
 * @example
 * ```typescript
 * <MemoryExtraction
 *   extracted={{
 *     content: 'React hooks run on every render',
 *     type: 'knowledge',
 *     tags: ['react', 'hooks'],
 *     confidence: 0.9
 *   }}
 *   onSave={() => console.log('saved')}
 *   onCancel={() => console.log('cancelled')}
 * />
 * ```
 */
export function MemoryExtraction({
  extracted,
  onSave,
  onCancel,
}: MemoryExtractionProps) {
  const { createMemory } = useMemories();

  const [content, setContent] = useState(extracted.content);
  const [type, setType] = useState<MemoryType>(extracted.type);
  const [tags, setTags] = useState<string[]>(extracted.tags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      await createMemory({
        content: content.trim(),
        type,
        tags,
      });

      onSave();
    } catch (error) {
      console.error('Failed to save memory:', error);
      alert('Failed to save memory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Color coding by confidence
  const confidenceColor =
    extracted.confidence >= 0.8 ? 'green' :
    extracted.confidence >= 0.6 ? 'yellow' : 'orange';

  return (
    <div
      className="border-t border-gray-200 bg-blue-50 p-4"
      data-testid="memory-extraction"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Review Memory
            </h3>
            <p className="text-sm text-gray-600">
              I noticed something worth remembering — want to save it?
            </p>
          </div>

          {/* Confidence Badge */}
          <div className={`rounded-full px-3 py-1 text-xs font-medium
            ${confidenceColor === 'green' ? 'bg-green-100 text-green-800' : ''}
            ${confidenceColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${confidenceColor === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
          `}>
            {Math.round(extracted.confidence * 100)}% confident
          </div>
        </div>

        {/* Reasoning (if available) */}
        {extracted.reasoning && (
          <div className="text-sm text-gray-600 italic">
            "{extracted.reasoning}"
          </div>
        )}

        {/* Content Editor */}
        <div>
          <label
            htmlFor="memory-content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="memory-content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2
                       focus:border-blue-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500"
            data-testid="memory-content-input"
          />
        </div>

        {/* Type Selector */}
        <div>
          <label
            htmlFor="memory-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="memory-type"
            value={type}
            onChange={e => setType(e.target.value as MemoryType)}
            className="rounded-lg border border-gray-300 px-3 py-2
                       focus:border-blue-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500"
            data-testid="memory-type-select"
          >
            <option value="knowledge">Knowledge</option>
            <option value="experience">Experience</option>
            <option value="method">Method</option>
          </select>
        </div>

        {/* Tags Editor */}
        <div>
          <label
            htmlFor="memory-tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>

          {/* Tag List */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full
                           bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              id="memory-tags"
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tag..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2
                         focus:border-blue-500 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              data-testid="tag-input"
            />
            <button
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium
                         hover:bg-gray-300 disabled:opacity-50
                         disabled:cursor-not-allowed"
              data-testid="add-tag-button"
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 px-4 py-2
                       text-sm font-medium text-gray-700 hover:bg-gray-50
                       disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium
                       text-white hover:bg-blue-700 disabled:opacity-50
                       disabled:cursor-not-allowed"
            data-testid="save-button"
          >
            {isSaving ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </div>
    </div>
  );
}
