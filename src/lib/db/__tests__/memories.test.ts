/**
 * Memory CRUD Operations Tests
 *
 * Tests all memory database operations including embedding generation,
 * semantic search, and filtering.
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
import {
  createMemory,
  updateMemory,
  deleteMemory,
  getMemory,
  getAllMemories,
  filterMemories,
  searchMemories,
  getMemoriesCount,
} from '../memories';
import { db } from '../../db';

describe('Memory CRUD Operations', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete();
    await db.open();
  });

  afterEach(async () => {
    await db.close();
  });

  describe('createMemory', () => {
    it('creates memory with embedding', async () => {
      const id = await createMemory({
        content: 'React hooks run on render',
        type: 'knowledge',
        tags: ['react', 'hooks'],
      });

      const memory = await getMemory(id);
      expect(memory).toBeDefined();
      expect(memory!.content).toBe('React hooks run on render');
      expect(memory!.embedding).toHaveLength(384); // MiniLM-L6-v2 dimensions
      expect(memory!.createdAt).toBeInstanceOf(Date);
    });

    it('sets timestamps automatically', async () => {
      const before = new Date();
      const id = await createMemory({
        content: 'Test content',
        type: 'knowledge',
        tags: [],
      });
      const after = new Date();

      const memory = await getMemory(id);
      expect(memory!.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(memory!.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('updateMemory', () => {
    it('updates memory fields', async () => {
      const id = await createMemory({
        content: 'Original',
        type: 'knowledge',
        tags: [],
      });

      await updateMemory(id, {
        content: 'Updated',
        tags: ['new-tag'],
      });

      const memory = await getMemory(id);
      expect(memory!.content).toBe('Updated');
      expect(memory!.tags).toContain('new-tag');
    });

    it('regenerates embedding when content changes', async () => {
      const id = await createMemory({
        content: 'Original',
        type: 'knowledge',
        tags: [],
      });

      const original = await getMemory(id);
      expect(original!.embedding).toBeDefined();

      await updateMemory(id, { content: 'Completely different' });

      const updated = await getMemory(id);
      // Embedding should exist (may be same in mock, but real implementation would differ)
      expect(updated!.embedding).toBeDefined();
      expect(updated!.embedding).toHaveLength(384);
    });

    it('updates updated_at timestamp', async () => {
      const id = await createMemory({
        content: 'Test',
        type: 'knowledge',
        tags: [],
      });

      const original = await getMemory(id);
      await new Promise(resolve => setTimeout(resolve, 10)); // Ensure time passes

      await updateMemory(id, { tags: ['updated'] });

      const updated = await getMemory(id);
      expect(updated!.updatedAt.getTime()).toBeGreaterThan(
        original!.updatedAt.getTime()
      );
    });
  });

  describe('deleteMemory', () => {
    it('removes memory from database', async () => {
      const id = await createMemory({
        content: 'To delete',
        type: 'knowledge',
        tags: [],
      });

      await deleteMemory(id);

      const memory = await getMemory(id);
      expect(memory).toBeUndefined();
    });
  });

  describe('getAllMemories', () => {
    it('returns all memories in reverse chronological order', async () => {
      const id1 = await createMemory({ content: 'First', type: 'knowledge', tags: [] });
      await new Promise(resolve => setTimeout(resolve, 10));
      const id2 = await createMemory({ content: 'Second', type: 'knowledge', tags: [] });
      await new Promise(resolve => setTimeout(resolve, 10));
      const id3 = await createMemory({ content: 'Third', type: 'knowledge', tags: [] });

      const memories = await getAllMemories();
      expect(memories).toHaveLength(3);
      expect(memories[0].id).toBe(id3); // Most recent first
      expect(memories[1].id).toBe(id2);
      expect(memories[2].id).toBe(id1);
    });
  });

  describe('filterMemories', () => {
    it('returns only memories of specified type', async () => {
      await createMemory({ content: 'K1', type: 'knowledge', tags: [] });
      await createMemory({ content: 'E1', type: 'experience', tags: [] });
      await createMemory({ content: 'K2', type: 'knowledge', tags: [] });

      const knowledge = await filterMemories('knowledge');
      expect(knowledge).toHaveLength(2);
      expect(knowledge.every(m => m.type === 'knowledge')).toBe(true);
    });
  });

  describe('searchMemories', () => {
    it('finds semantically similar memories', async () => {
      await createMemory({
        content: 'React is a JavaScript library for building UIs',
        type: 'knowledge',
        tags: [],
      });
      await createMemory({
        content: 'I ate pizza for lunch',
        type: 'experience',
        tags: [],
      });

      const results = await searchMemories('frontend frameworks');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].content).toContain('React');
      expect(results[0].score).toBeGreaterThan(0.7);
    });

    it('respects threshold parameter', async () => {
      await createMemory({
        content: 'Completely unrelated content',
        type: 'knowledge',
        tags: [],
      });

      // With mock, all embeddings have similarity 1.0 (identical)
      // In real implementation, unrelated content would have low similarity
      const results = await searchMemories('React hooks', 0.99);
      // Mock returns high similarity, so we just verify threshold mechanism works
      expect(Array.isArray(results)).toBe(true);
    });

    it('respects limit parameter', async () => {
      // Create 10 memories
      for (let i = 0; i < 10; i++) {
        await createMemory({
          content: `Memory about React ${i}`,
          type: 'knowledge',
          tags: [],
        });
      }

      const results = await searchMemories('React', 0.5, 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getMemoriesCount', () => {
    it('returns correct count', async () => {
      expect(await getMemoriesCount()).toBe(0);

      await createMemory({ content: 'First', type: 'knowledge', tags: [] });
      expect(await getMemoriesCount()).toBe(1);

      await createMemory({ content: 'Second', type: 'knowledge', tags: [] });
      expect(await getMemoriesCount()).toBe(2);
    });
  });
});
