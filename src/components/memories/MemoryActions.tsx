/**
 * Memory Actions Component
 *
 * Dropdown menu for memory card actions (edit, delete).
 * Provides edit modal and delete confirmation.
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { type Memory } from '@/lib/db';

export interface MemoryActionsProps {
  memory: Memory;
  onEdit: (id: number, updates: Partial<Memory>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

/**
 * Memory actions dropdown menu
 *
 * @param props - Memory and action handlers
 * @returns Dropdown with edit/delete actions
 */
export function MemoryActions({ memory, onEdit, onDelete }: MemoryActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(memory.id!);
      setIsDeleteConfirmOpen(false);
      toast.success('Memory deleted successfully');
    } catch (error) {
      console.error('Failed to delete memory:', error);
      toast.error('Failed to delete memory. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Three-dot Menu Button */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          aria-label="Memory actions"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Items */}
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditMemoryModal
          memory={memory}
          onSave={async (updates) => {
            await onEdit(memory.id!, updates);
            setIsEditModalOpen(false);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <DeleteConfirmModal
          memoryContent={memory.content}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </>
  );
}

/**
 * Edit Memory Modal
 */
interface EditMemoryModalProps {
  memory: Memory;
  onSave: (updates: Partial<Memory>) => Promise<void>;
  onCancel: () => void;
}

function EditMemoryModal({ memory, onSave, onCancel }: EditMemoryModalProps) {
  const [content, setContent] = useState(memory.content);
  const [type, setType] = useState(memory.type);
  const [tags, setTags] = useState(memory.tags?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Memory content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        content: content.trim(),
        type,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('Memory updated successfully');
    } catch (error) {
      console.error('Failed to save memory:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Memory</h2>

        <div className="space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Memory content..."
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Memory['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="knowledge">🧠 Knowledge</option>
              <option value="experience">📅 Experience</option>
              <option value="method">📋 Method</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="react, hooks, state"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Delete Confirmation Modal
 */
interface DeleteConfirmModalProps {
  memoryContent: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ memoryContent, isDeleting, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Memory?</h2>

        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this memory? This action cannot be undone.
        </p>

        <div className="bg-gray-50 rounded p-3 mb-4 border border-gray-200">
          <p className="text-sm text-gray-600 line-clamp-3">
            {memoryContent}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
