/**
 * MemoryExtraction Component Tests
 *
 * Tests for the memory preview and edit UI component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryExtraction } from '../MemoryExtraction';
import * as useMemoriesModule from '../../../hooks/useMemories';

// Mock the useMemories hook
vi.mock('../../../hooks/useMemories');

describe('MemoryExtraction', () => {
  const mockExtracted = {
    content: 'Test memory content that should be saved',
    type: 'knowledge' as const,
    tags: ['test', 'memory'],
    confidence: 0.85,
    reasoning: 'Clear and memorable information',
  };

  const mockCreateMemory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMemoriesModule.useMemories).mockReturnValue({
      memories: [],
      isLoading: false,
      createMemory: mockCreateMemory,
      updateMemory: vi.fn(),
      deleteMemory: vi.fn(),
      searchMemories: vi.fn(),
    });
  });

  it('renders extracted memory for review', () => {
    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('Test memory content that should be saved')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('memory')).toBeInTheDocument();
    expect(screen.getByText(/85% confident/i)).toBeInTheDocument();
  });

  it('displays reasoning when provided', () => {
    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/"Clear and memorable information"/i)).toBeInTheDocument();
  });

  it('does not display reasoning section when not provided', () => {
    const extractedWithoutReasoning = {
      ...mockExtracted,
      reasoning: undefined,
    };

    render(
      <MemoryExtraction
        extracted={extractedWithoutReasoning}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.queryByText(/Clear and memorable/i)).not.toBeInTheDocument();
  });

  it('shows green badge for high confidence (≥0.8)', () => {
    const highConfidence = { ...mockExtracted, confidence: 0.9 };

    render(
      <MemoryExtraction
        extracted={highConfidence}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const badge = screen.getByText(/90% confident/i);
    expect(badge.className).toContain('bg-green-100');
    expect(badge.className).toContain('text-green-800');
  });

  it('shows yellow badge for medium confidence (0.6-0.79)', () => {
    const mediumConfidence = { ...mockExtracted, confidence: 0.7 };

    render(
      <MemoryExtraction
        extracted={mediumConfidence}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const badge = screen.getByText(/70% confident/i);
    expect(badge.className).toContain('bg-yellow-100');
    expect(badge.className).toContain('text-yellow-800');
  });

  it('shows orange badge for low confidence (<0.6)', () => {
    const lowConfidence = { ...mockExtracted, confidence: 0.55 };

    render(
      <MemoryExtraction
        extracted={lowConfidence}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const badge = screen.getByText(/55% confident/i);
    expect(badge.className).toContain('bg-orange-100');
    expect(badge.className).toContain('text-orange-800');
  });

  it('allows editing content', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByTestId('memory-content-input');
    await user.clear(input);
    await user.type(input, 'Edited content');

    expect(input).toHaveValue('Edited content');
  });

  it('allows changing memory type', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const select = screen.getByTestId('memory-type-select');
    expect(select).toHaveValue('knowledge');

    await user.selectOptions(select, 'experience');
    expect(select).toHaveValue('experience');
  });

  it('allows adding new tags', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const tagInput = screen.getByTestId('tag-input');
    const addButton = screen.getByTestId('add-tag-button');

    await user.type(tagInput, 'new-tag');
    await user.click(addButton);

    expect(screen.getByText('new-tag')).toBeInTheDocument();
    expect(tagInput).toHaveValue('');
  });

  it('allows adding tags with Enter key', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const tagInput = screen.getByTestId('tag-input');

    await user.type(tagInput, 'enter-tag{Enter}');

    expect(screen.getByText('enter-tag')).toBeInTheDocument();
    expect(tagInput).toHaveValue('');
  });

  it('prevents duplicate tags', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const tagInput = screen.getByTestId('tag-input');
    const addButton = screen.getByTestId('add-tag-button');

    // Try to add a tag that already exists
    await user.type(tagInput, 'test');
    await user.click(addButton);

    // Should only have one instance
    const testTags = screen.getAllByText('test');
    expect(testTags).toHaveLength(1);
  });

  it('allows removing tags', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('test')).toBeInTheDocument();

    const removeButton = screen.getByLabelText('Remove tag test');
    await user.click(removeButton);

    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  it('saves memory with createMemory hook', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    mockCreateMemory.mockResolvedValue(1);

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={onSave}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(mockCreateMemory).toHaveBeenCalledWith({
        content: 'Test memory content that should be saved',
        type: 'knowledge',
        tags: ['test', 'memory'],
      });
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('saves edited memory', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    mockCreateMemory.mockResolvedValue(1);

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={onSave}
        onCancel={vi.fn()}
      />
    );

    // Edit content
    const input = screen.getByTestId('memory-content-input');
    await user.clear(input);
    await user.type(input, 'New edited content');

    // Change type
    await user.selectOptions(screen.getByTestId('memory-type-select'), 'method');

    // Add a tag
    await user.type(screen.getByTestId('tag-input'), 'new{Enter}');

    // Save
    await user.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(mockCreateMemory).toHaveBeenCalledWith({
        content: 'New edited content',
        type: 'method',
        tags: ['test', 'memory', 'new'],
      });
      expect(onSave).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancelled', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByTestId('cancel-button'));

    expect(onCancel).toHaveBeenCalled();
    expect(mockCreateMemory).not.toHaveBeenCalled();
  });

  it('disables save button when content is empty', async () => {
    const user = userEvent.setup();

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeEnabled();

    const input = screen.getByTestId('memory-content-input');
    await user.clear(input);

    expect(saveButton).toBeDisabled();
  });

  it('disables buttons while saving', async () => {
    const user = userEvent.setup();
    mockCreateMemory.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const saveButton = screen.getByTestId('save-button');
    const cancelButton = screen.getByTestId('cancel-button');

    await user.click(saveButton);

    expect(saveButton).toHaveTextContent('Saving...');
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('handles save errors gracefully', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockCreateMemory.mockRejectedValue(new Error('Save failed'));

    render(
      <MemoryExtraction
        extracted={mockExtracted}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to save memory. Please try again.');
      expect(screen.getByTestId('save-button')).not.toHaveTextContent('Saving...');
    });

    alertSpy.mockRestore();
  });
});
