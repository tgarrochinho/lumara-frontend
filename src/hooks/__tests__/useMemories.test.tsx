/**
 * useMemories Hook Tests
 *
 * Tests the useMemories hook including live query reactivity,
 * filtering, and CRUD operations.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock @xenova/transformers
vi.mock('@xenova/transformers', () => {
  const mockEmbedder = vi.fn().mockResolvedValue({
    data: new Float32Array(384).fill(0.1),
  });

  return {
    pipeline: vi.fn().mockResolvedValue(mockEmbedder),
    env: {
      allowLocalModels: false,
      allowRemoteModels: true,
      cacheDir: 'models',
    },
  };
});
import { renderHook, waitFor } from '@testing-library/react';
import { useMemories } from '../useMemories';
import { db } from '../../lib/db';

describe('useMemories hook', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterEach(async () => {
    await db.close();
  });

  it('returns empty array initially', async () => {
    const { result } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(result.current.memories).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('creates memory and updates list reactively', async () => {
    const { result } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.createMemory({
      content: 'Test memory',
      type: 'knowledge',
      tags: [],
    });

    await waitFor(() => {
      expect(result.current.memories).toHaveLength(1);
      expect(result.current.memories![0].content).toBe('Test memory');
    });
  });

  it('updates memory and reflects change reactively', async () => {
    const { result } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.createMemory({
      content: 'Original content',
      type: 'knowledge',
      tags: [],
    });

    await waitFor(() => {
      expect(result.current.memories).toHaveLength(1);
    });

    const memoryId = result.current.memories![0].id!;

    await result.current.updateMemory(memoryId, {
      content: 'Updated content',
    });

    await waitFor(() => {
      expect(result.current.memories![0].content).toBe('Updated content');
    });
  });

  it('deletes memory and updates list reactively', async () => {
    const { result } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.createMemory({
      content: 'To be deleted',
      type: 'knowledge',
      tags: [],
    });

    await waitFor(() => {
      expect(result.current.memories).toHaveLength(1);
    });

    const memoryId = result.current.memories![0].id!;

    await result.current.deleteMemory(memoryId);

    await waitFor(() => {
      expect(result.current.memories).toHaveLength(0);
    });
  });

  it('filters memories by type', async () => {
    const { result: allResult } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(allResult.current.isLoading).toBe(false);
    });

    await allResult.current.createMemory({
      content: 'Knowledge',
      type: 'knowledge',
      tags: [],
    });
    await allResult.current.createMemory({
      content: 'Experience',
      type: 'experience',
      tags: [],
    });

    const { result: filteredResult } = renderHook(() =>
      useMemories({ filter: 'knowledge' })
    );

    await waitFor(() => {
      expect(filteredResult.current.memories).toHaveLength(1);
      expect(filteredResult.current.memories![0].type).toBe('knowledge');
    });
  });

  it('searches memories semantically', async () => {
    const { result } = renderHook(() => useMemories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.createMemory({
      content: 'React is a JavaScript library for building user interfaces',
      type: 'knowledge',
      tags: [],
    });

    await result.current.createMemory({
      content: 'I had pizza for lunch today',
      type: 'experience',
      tags: [],
    });

    const searchResults = await result.current.searchMemories('frontend development');

    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].content).toContain('React');
  });
});
