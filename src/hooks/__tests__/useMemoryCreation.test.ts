/**
 * Integration tests for useMemoryCreation hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMemoryCreation } from '../useMemoryCreation';
import { db } from '@/lib/db';
import { selectProvider } from '@/lib/ai/registry';
import type { ChromeAIProvider } from '@/lib/ai/providers/chrome-ai';

// Mock modules
vi.mock('@/lib/ai/registry', () => ({
  selectProvider: vi.fn(),
}));

vi.mock('@/lib/ai/embeddings/transformers', () => ({
  generateEmbedding: vi.fn(),
  embeddingsService: {
    initialize: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
  },
}));

import { generateEmbedding } from '@/lib/ai/embeddings/transformers';

describe('useMemoryCreation', () => {
  const mockEmbedding = Array(384).fill(0.1);

  const mockProvider = {
    name: 'Chrome AI',
    version: '1.0.0',
    capabilities: {
      chat: true,
      embeddings: false,
      streaming: false,
    },
    chat: vi.fn(),
    initialize: vi.fn().mockResolvedValue(undefined),
    checkHealth: vi.fn().mockResolvedValue({
      healthy: true,
      latencyMs: 10,
    }),
    dispose: vi.fn(),
  } as unknown as ChromeAIProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(selectProvider).mockResolvedValue(mockProvider);
    vi.mocked(generateEmbedding).mockResolvedValue(mockEmbedding);

    // Clear database
    await db.memories.clear();
  });

  afterEach(async () => {
    await db.memories.clear();
  });

  it('should initialize with clean state', () => {
    const { result } = renderHook(() => useMemoryCreation());

    expect(result.current.isCreating).toBe(false);
    expect(result.current.isCheckingIssues).toBe(false);
    expect(result.current.contradiction).toBeNull();
    expect(result.current.duplication).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should check for issues and find no problems', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    const issues = await result.current.checkForIssues('Test memory content');

    await waitFor(() => {
      expect(result.current.isCheckingIssues).toBe(false);
    });

    expect(issues.embedding).toEqual(mockEmbedding);
    expect(issues.hasIssues).toBe(false);
    expect(issues.contradictions).toHaveLength(0);
    expect(issues.duplicates).toHaveLength(0);
  });

  it('should detect duplicates', async () => {
    // Add existing memory with similar embedding
    await db.memories.add({
      content: 'Existing memory',
      type: 'knowledge',
      embedding: mockEmbedding, // Same embedding = duplicate
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { result } = renderHook(() => useMemoryCreation());

    const issues = await result.current.checkForIssues('Test memory');

    await waitFor(() => {
      expect(result.current.duplication?.exists).toBe(true);
    });

    expect(issues.hasIssues).toBe(true);
    expect(issues.duplicates.length).toBeGreaterThan(0);
    expect(result.current.hasDuplicates).toBe(true);
  });

  it('should detect contradictions with AI', async () => {
    // Add existing memory
    await db.memories.add({
      content: 'I love coffee',
      type: 'knowledge',
      embedding: Array(384).fill(0.15), // Similar enough
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock AI to detect contradiction
    mockProvider.chat = vi
      .fn()
      .mockResolvedValue(
        '{"contradicts": true, "confidence": 90, "explanation": "These statements contradict"}'
      );

    const { result } = renderHook(() => useMemoryCreation());

    const issues = await result.current.checkForIssues('I hate coffee');

    await waitFor(() => {
      expect(result.current.contradiction?.exists).toBe(true);
    });

    expect(issues.hasIssues).toBe(true);
    expect(issues.contradictions.length).toBeGreaterThan(0);
    expect(result.current.hasContradictions).toBe(true);
  });

  it('should create memory with embedding', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    const memoryId = await result.current.createMemory(
      {
        content: 'Test memory',
        type: 'knowledge',
        tags: ['test'],
      },
      mockEmbedding
    );

    expect(memoryId).toBeDefined();

    // Verify memory was saved
    const memory = await db.memories.get(memoryId);
    expect(memory).toBeDefined();
    expect(memory?.content).toBe('Test memory');
    expect(memory?.type).toBe('knowledge');
    expect(memory?.tags).toEqual(['test']);
    expect(memory?.embedding).toEqual(mockEmbedding);
  });

  it('should create memory directly without checking', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    const memoryId = await result.current.createMemoryDirect({
      content: 'Direct memory',
      type: 'experience',
    });

    expect(memoryId).toBeDefined();

    // Verify memory was saved with embedding
    const memory = await db.memories.get(memoryId);
    expect(memory).toBeDefined();
    expect(memory?.content).toBe('Direct memory');
    expect(memory?.embedding).toEqual(mockEmbedding);
  });

  it('should handle empty content', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    await expect(result.current.checkForIssues('')).rejects.toThrow(
      'Memory content cannot be empty'
    );

    await expect(
      result.current.createMemory(
        {
          content: '',
          type: 'knowledge',
        },
        mockEmbedding
      )
    ).rejects.toThrow('Memory content cannot be empty');
  });

  it('should handle missing embedding', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    await expect(
      result.current.createMemory(
        {
          content: 'Test',
          type: 'knowledge',
        },
        []
      )
    ).rejects.toThrow('Embedding is required');
  });

  it('should clear warnings', async () => {
    // Create a duplicate scenario
    await db.memories.add({
      content: 'Existing',
      type: 'knowledge',
      embedding: mockEmbedding,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { result } = renderHook(() => useMemoryCreation());

    await result.current.checkForIssues('Test');

    await waitFor(() => {
      expect(result.current.duplication?.exists).toBe(true);
    });

    result.current.clearWarnings();

    expect(result.current.contradiction).toBeNull();
    expect(result.current.duplication).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle embedding generation failure', async () => {
    vi.mocked(generateEmbedding).mockRejectedValueOnce(new Error('Embedding failed'));

    const { result } = renderHook(() => useMemoryCreation());

    await expect(result.current.checkForIssues('Test')).rejects.toThrow('Embedding failed');

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('should handle memory creation failure', async () => {
    const { result } = renderHook(() => useMemoryCreation());

    // Use invalid embedding dimensions to trigger error
    const invalidEmbedding = [0.1, 0.2, 0.3]; // Wrong size

    await expect(
      result.current.createMemory(
        {
          content: 'Test',
          type: 'knowledge',
        },
        invalidEmbedding
      )
    ).rejects.toThrow();
  });

  it('should set loading states appropriately', async () => {
    let resolveEmbedding: ((value: number[]) => void) | undefined;
    const embeddingPromise = new Promise<number[]>((resolve) => {
      resolveEmbedding = resolve;
    });

    vi.mocked(generateEmbedding).mockReturnValueOnce(embeddingPromise);

    const { result } = renderHook(() => useMemoryCreation());

    const checkPromise = result.current.checkForIssues('Test');

    // Should be checking
    await waitFor(() => {
      expect(result.current.isCheckingIssues).toBe(true);
      expect(result.current.isWorking).toBe(true);
    });

    // Resolve
    resolveEmbedding?.(mockEmbedding);
    await checkPromise;

    // Should no longer be checking
    await waitFor(() => {
      expect(result.current.isCheckingIssues).toBe(false);
      expect(result.current.isWorking).toBe(false);
    });
  });

  it('should clear warnings after successful creation', async () => {
    // Create duplicate scenario
    await db.memories.add({
      content: 'Existing',
      type: 'knowledge',
      embedding: mockEmbedding,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { result } = renderHook(() => useMemoryCreation());

    await result.current.checkForIssues('Test');

    await waitFor(() => {
      expect(result.current.duplication?.exists).toBe(true);
    });

    // Create anyway
    await result.current.createMemory(
      {
        content: 'Test',
        type: 'knowledge',
      },
      mockEmbedding
    );

    // Warnings should be cleared
    await waitFor(() => {
      expect(result.current.contradiction).toBeNull();
      expect(result.current.duplication).toBeNull();
    });
  });

  it('should handle contradiction detection failure gracefully', async () => {
    await db.memories.add({
      content: 'Existing',
      type: 'knowledge',
      embedding: Array(384).fill(0.15),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockProvider.chat = vi.fn().mockRejectedValue(new Error('AI failed'));

    const { result } = renderHook(() => useMemoryCreation());

    // Should not throw, just skip contradiction detection
    const issues = await result.current.checkForIssues('Test');

    expect(issues.contradictions).toHaveLength(0);
  });
});
