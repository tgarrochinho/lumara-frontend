/**
 * Unit tests for Dexie database schema with embeddings support
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  db,
  Memory,
  MemoryType,
  saveMemoryWithEmbedding,
  updateMemoryEmbedding,
  getMemoriesWithEmbeddings,
  getMemoriesWithoutEmbeddings,
  batchUpdateEmbeddings,
  ensureMemoryHasEmbedding,
  ensureAllMemoriesHaveEmbeddings,
} from '../db'

// Mock the embeddings module
vi.mock('../ai/embeddings/transformers', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(new Array(384).fill(0.5)),
}))

describe('Dexie Database Schema Extension', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete()
    await db.open()
  })

  afterEach(async () => {
    // Clean up after each test
    await db.close()
    vi.clearAllMocks()
  })

  describe('Database Schema', () => {
    it('initializes with version 2', () => {
      expect(db.verno).toBe(2)
    })

    it('has memories table defined', () => {
      expect(db.memories).toBeDefined()
      expect(db.memories.name).toBe('memories')
    })

    it('memories table has correct schema', () => {
      const schema = db.memories.schema
      expect(schema.primKey.name).toBe('id')
      expect(schema.primKey.auto).toBe(true)
    })
  })

  describe('Memory Interface', () => {
    it('creates memory without embedding', async () => {
      const memory: Omit<Memory, 'id'> = {
        content: 'Test memory without embedding',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const id = await db.memories.add(memory)
      const retrieved = await db.memories.get(id)

      expect(retrieved).toBeDefined()
      expect(retrieved?.content).toBe(memory.content)
      expect(retrieved?.type).toBe('knowledge')
      expect(retrieved?.embedding).toBeUndefined()
    })

    it('creates memory with embedding', async () => {
      const embedding = new Array(384).fill(0.5)
      const memory: Omit<Memory, 'id'> = {
        content: 'Test memory with embedding',
        type: 'experience',
        embedding,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const id = await db.memories.add(memory)
      const retrieved = await db.memories.get(id)

      expect(retrieved).toBeDefined()
      expect(retrieved?.embedding).toHaveLength(384)
      expect(retrieved?.embedding).toEqual(embedding)
    })

    it('supports all memory types', async () => {
      const types: MemoryType[] = ['knowledge', 'experience', 'method']

      for (const type of types) {
        const memory: Omit<Memory, 'id'> = {
          content: `Test ${type} memory`,
          type,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const id = await db.memories.add(memory)
        const retrieved = await db.memories.get(id)

        expect(retrieved?.type).toBe(type)
      }
    })

    it('supports optional tags', async () => {
      const memory: Omit<Memory, 'id'> = {
        content: 'Memory with tags',
        type: 'knowledge',
        tags: ['important', 'work', 'project'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const id = await db.memories.add(memory)
      const retrieved = await db.memories.get(id)

      expect(retrieved?.tags).toEqual(['important', 'work', 'project'])
    })

    it('supports optional metadata', async () => {
      const metadata = {
        source: 'book',
        author: 'John Doe',
        confidence: 0.95,
      }

      const memory: Omit<Memory, 'id'> = {
        content: 'Memory with metadata',
        type: 'knowledge',
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const id = await db.memories.add(memory)
      const retrieved = await db.memories.get(id)

      expect(retrieved?.metadata).toEqual(metadata)
    })
  })

  describe('saveMemoryWithEmbedding', () => {
    it('saves memory with embedding', async () => {
      const embedding = new Array(384).fill(0.7)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test memory', type: 'knowledge' },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory).toBeDefined()
      expect(memory?.embedding).toHaveLength(384)
      expect(memory?.embedding).toEqual(embedding)
      expect(memory?.createdAt).toBeInstanceOf(Date)
      expect(memory?.updatedAt).toBeInstanceOf(Date)
    })

    it('validates embedding dimensions', async () => {
      const invalidEmbedding = new Array(256).fill(0.5) // Wrong size

      await expect(
        saveMemoryWithEmbedding(
          { content: 'Test', type: 'knowledge' },
          invalidEmbedding
        )
      ).rejects.toThrow('Invalid embedding dimensions: expected 384, got 256')
    })

    it('saves memory with tags and metadata', async () => {
      const embedding = new Array(384).fill(0.5)
      const id = await saveMemoryWithEmbedding(
        {
          content: 'Test memory',
          type: 'experience',
          tags: ['test', 'important'],
          metadata: { source: 'test' },
        },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.tags).toEqual(['test', 'important'])
      expect(memory?.metadata).toEqual({ source: 'test' })
    })

    it('sets timestamps automatically', async () => {
      const embedding = new Array(384).fill(0.5)
      const beforeSave = new Date()

      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge' },
        embedding
      )

      const afterSave = new Date()
      const memory = await db.memories.get(id)

      expect(memory?.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime())
      expect(memory?.createdAt.getTime()).toBeLessThanOrEqual(afterSave.getTime())
      expect(memory?.updatedAt).toEqual(memory?.createdAt)
    })
  })

  describe('updateMemoryEmbedding', () => {
    it('updates embedding for existing memory', async () => {
      // Create memory without embedding
      const id = await db.memories.add({
        content: 'Test memory',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Update with embedding
      const embedding = new Array(384).fill(0.8)
      await updateMemoryEmbedding(id, embedding)

      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(embedding)
    })

    it('replaces existing embedding', async () => {
      const embedding1 = new Array(384).fill(0.5)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge' },
        embedding1
      )

      const embedding2 = new Array(384).fill(0.9)
      await updateMemoryEmbedding(id, embedding2)

      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(embedding2)
    })

    it('updates updatedAt timestamp', async () => {
      const id = await db.memories.add({
        content: 'Test',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10))

      const beforeUpdate = new Date()
      const embedding = new Array(384).fill(0.5)
      await updateMemoryEmbedding(id, embedding)
      const afterUpdate = new Date()

      const memory = await db.memories.get(id)
      expect(memory?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime())
      expect(memory?.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime())
    })

    it('validates embedding dimensions', async () => {
      const id = await db.memories.add({
        content: 'Test',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const invalidEmbedding = new Array(100).fill(0.5)

      await expect(updateMemoryEmbedding(id, invalidEmbedding)).rejects.toThrow(
        'Invalid embedding dimensions'
      )
    })
  })

  describe('getMemoriesWithEmbeddings', () => {
    it('returns only memories with embeddings', async () => {
      // Create memories with embeddings
      const embedding = new Array(384).fill(0.5)
      await saveMemoryWithEmbedding({ content: 'Memory 1', type: 'knowledge' }, embedding)
      await saveMemoryWithEmbedding({ content: 'Memory 2', type: 'experience' }, embedding)

      // Create memory without embedding
      await db.memories.add({
        content: 'Memory 3',
        type: 'method',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const memoriesWithEmbeddings = await getMemoriesWithEmbeddings()
      expect(memoriesWithEmbeddings).toHaveLength(2)
      expect(memoriesWithEmbeddings.every((m) => m.embedding !== undefined)).toBe(true)
    })

    it('returns empty array when no embeddings exist', async () => {
      await db.memories.add({
        content: 'Memory 1',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const memoriesWithEmbeddings = await getMemoriesWithEmbeddings()
      expect(memoriesWithEmbeddings).toHaveLength(0)
    })
  })

  describe('getMemoriesWithoutEmbeddings', () => {
    it('returns only memories without embeddings', async () => {
      // Create memory with embedding
      const embedding = new Array(384).fill(0.5)
      await saveMemoryWithEmbedding({ content: 'Memory 1', type: 'knowledge' }, embedding)

      // Create memories without embeddings
      await db.memories.add({
        content: 'Memory 2',
        type: 'experience',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await db.memories.add({
        content: 'Memory 3',
        type: 'method',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const memoriesWithoutEmbeddings = await getMemoriesWithoutEmbeddings()
      expect(memoriesWithoutEmbeddings).toHaveLength(2)
      expect(memoriesWithoutEmbeddings.every((m) => m.embedding === undefined)).toBe(true)
    })

    it('returns empty array when all have embeddings', async () => {
      const embedding = new Array(384).fill(0.5)
      await saveMemoryWithEmbedding({ content: 'Memory 1', type: 'knowledge' }, embedding)
      await saveMemoryWithEmbedding({ content: 'Memory 2', type: 'experience' }, embedding)

      const memoriesWithoutEmbeddings = await getMemoriesWithoutEmbeddings()
      expect(memoriesWithoutEmbeddings).toHaveLength(0)
    })
  })

  describe('batchUpdateEmbeddings', () => {
    it('updates multiple memories in a transaction', async () => {
      // Create memories without embeddings
      const id1 = await db.memories.add({
        content: 'Memory 1',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const id2 = await db.memories.add({
        content: 'Memory 2',
        type: 'experience',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const id3 = await db.memories.add({
        content: 'Memory 3',
        type: 'method',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Batch update embeddings
      const embedding1 = new Array(384).fill(0.1)
      const embedding2 = new Array(384).fill(0.2)
      const embedding3 = new Array(384).fill(0.3)

      await batchUpdateEmbeddings([
        { id: id1, embedding: embedding1 },
        { id: id2, embedding: embedding2 },
        { id: id3, embedding: embedding3 },
      ])

      // Verify all embeddings were updated
      const memory1 = await db.memories.get(id1)
      const memory2 = await db.memories.get(id2)
      const memory3 = await db.memories.get(id3)

      expect(memory1?.embedding).toEqual(embedding1)
      expect(memory2?.embedding).toEqual(embedding2)
      expect(memory3?.embedding).toEqual(embedding3)
    })

    it('validates all embeddings before updating', async () => {
      const id = await db.memories.add({
        content: 'Memory',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const validEmbedding = new Array(384).fill(0.5)
      const invalidEmbedding = new Array(100).fill(0.5)

      await expect(
        batchUpdateEmbeddings([
          { id, embedding: validEmbedding },
          { id, embedding: invalidEmbedding },
        ])
      ).rejects.toThrow('Invalid embedding dimensions')

      // Original memory should be unchanged
      const memory = await db.memories.get(id)
      expect(memory?.embedding).toBeUndefined()
    })

    it('handles empty array', async () => {
      await expect(batchUpdateEmbeddings([])).resolves.not.toThrow()
    })

    it('updates timestamps for all memories', async () => {
      const id1 = await db.memories.add({
        content: 'Memory 1',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const id2 = await db.memories.add({
        content: 'Memory 2',
        type: 'experience',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await new Promise((resolve) => setTimeout(resolve, 10))

      const beforeUpdate = new Date()
      const embedding = new Array(384).fill(0.5)
      await batchUpdateEmbeddings([
        { id: id1, embedding },
        { id: id2, embedding },
      ])
      const afterUpdate = new Date()

      const memory1 = await db.memories.get(id1)
      const memory2 = await db.memories.get(id2)

      expect(memory1?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime())
      expect(memory1?.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime())
      expect(memory2?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime())
      expect(memory2?.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime())
    })
  })

  describe('ensureMemoryHasEmbedding', () => {
    it('returns existing embedding if available', async () => {
      const embedding = new Array(384).fill(0.7)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test memory', type: 'knowledge' },
        embedding
      )

      const result = await ensureMemoryHasEmbedding(id)
      expect(result).toEqual(embedding)
    })

    it('generates and stores embedding if missing', async () => {
      const id = await db.memories.add({
        content: 'Test memory',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await ensureMemoryHasEmbedding(id)

      expect(result).toHaveLength(384)

      // Verify it was stored
      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(result)
    })

    it('throws error for non-existent memory', async () => {
      await expect(ensureMemoryHasEmbedding(99999)).rejects.toThrow(
        'Memory 99999 not found'
      )
    })

    it('updates updatedAt when generating embedding', async () => {
      const id = await db.memories.add({
        content: 'Test memory',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await new Promise((resolve) => setTimeout(resolve, 10))

      const beforeGenerate = new Date()
      await ensureMemoryHasEmbedding(id)
      const afterGenerate = new Date()

      const memory = await db.memories.get(id)
      expect(memory?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeGenerate.getTime())
      expect(memory?.updatedAt.getTime()).toBeLessThanOrEqual(afterGenerate.getTime())
    })
  })

  describe('ensureAllMemoriesHaveEmbeddings', () => {
    it('generates embeddings for all memories without them', async () => {
      // Create memories: some with embeddings, some without
      const embedding = new Array(384).fill(0.5)
      await saveMemoryWithEmbedding({ content: 'Memory 1', type: 'knowledge' }, embedding)

      await db.memories.add({
        content: 'Memory 2',
        type: 'experience',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await db.memories.add({
        content: 'Memory 3',
        type: 'method',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await ensureAllMemoriesHaveEmbeddings()

      const allMemories = await db.memories.toArray()
      expect(allMemories).toHaveLength(3)
      expect(allMemories.every((m) => m.embedding !== undefined)).toBe(true)
      expect(allMemories.every((m) => m.embedding?.length === 384)).toBe(true)
    })

    it('calls progress callback correctly', async () => {
      // Create memories without embeddings
      await db.memories.add({
        content: 'Memory 1',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await db.memories.add({
        content: 'Memory 2',
        type: 'experience',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await db.memories.add({
        content: 'Memory 3',
        type: 'method',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const progressCalls: Array<{ current: number; total: number }> = []
      await ensureAllMemoriesHaveEmbeddings((current, total) => {
        progressCalls.push({ current, total })
      })

      expect(progressCalls).toHaveLength(3)
      expect(progressCalls[0]).toEqual({ current: 1, total: 3 })
      expect(progressCalls[1]).toEqual({ current: 2, total: 3 })
      expect(progressCalls[2]).toEqual({ current: 3, total: 3 })
    })

    it('handles empty database', async () => {
      await expect(ensureAllMemoriesHaveEmbeddings()).resolves.not.toThrow()
    })

    it('handles database with all embeddings already present', async () => {
      const embedding = new Array(384).fill(0.5)
      await saveMemoryWithEmbedding({ content: 'Memory 1', type: 'knowledge' }, embedding)
      await saveMemoryWithEmbedding({ content: 'Memory 2', type: 'experience' }, embedding)

      const progressCalls: number[] = []
      await ensureAllMemoriesHaveEmbeddings((current, total) => {
        progressCalls.push(current)
      })

      expect(progressCalls).toHaveLength(0)
    })
  })

  describe('Migration and Data Integrity', () => {
    it('preserves existing data during migration', async () => {
      // Simulate pre-migration memory (manually add without embedding)
      const memory: Omit<Memory, 'id'> = {
        content: 'Pre-migration memory',
        type: 'knowledge',
        tags: ['old', 'legacy'],
        metadata: { source: 'v1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const id = await db.memories.add(memory)
      const retrieved = await db.memories.get(id)

      expect(retrieved?.content).toBe(memory.content)
      expect(retrieved?.type).toBe(memory.type)
      expect(retrieved?.tags).toEqual(memory.tags)
      expect(retrieved?.metadata).toEqual(memory.metadata)
      expect(retrieved?.embedding).toBeUndefined()
    })

    it('allows queries on memories without embeddings', async () => {
      await db.memories.add({
        content: 'Memory without embedding',
        type: 'knowledge',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const memories = await db.memories.toArray()
      expect(memories).toHaveLength(1)
      expect(memories[0].embedding).toBeUndefined()
    })
  })

  describe('Performance', () => {
    it('handles bulk inserts efficiently', async () => {
      const startTime = performance.now()
      const embedding = new Array(384).fill(0.5)

      const promises = []
      for (let i = 0; i < 100; i++) {
        promises.push(
          saveMemoryWithEmbedding(
            { content: `Memory ${i}`, type: 'knowledge' },
            embedding
          )
        )
      }

      await Promise.all(promises)
      const duration = performance.now() - startTime

      const count = await db.memories.count()
      expect(count).toBe(100)
      expect(duration).toBeLessThan(5000) // Should complete in reasonable time
    })

    it('queries embeddings efficiently', async () => {
      // Add test data
      const embedding = new Array(384).fill(0.5)
      for (let i = 0; i < 50; i++) {
        await saveMemoryWithEmbedding(
          { content: `Memory ${i}`, type: 'knowledge' },
          embedding
        )
      }

      const startTime = performance.now()
      const memories = await getMemoriesWithEmbeddings()
      const duration = performance.now() - startTime

      expect(memories).toHaveLength(50)
      expect(duration).toBeLessThan(100) // Should be fast (<10ms target, but allowing for test overhead)
    })

    it('batch updates are faster than individual updates', async () => {
      // Create test memories
      const ids = []
      for (let i = 0; i < 20; i++) {
        const id = await db.memories.add({
          content: `Memory ${i}`,
          type: 'knowledge',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        ids.push(id)
      }

      const embedding = new Array(384).fill(0.5)

      // Measure batch update
      const batchStart = performance.now()
      await batchUpdateEmbeddings(ids.map((id) => ({ id, embedding })))
      const batchDuration = performance.now() - batchStart

      // Verify batch update worked
      const allHaveEmbeddings = await getMemoriesWithEmbeddings()
      expect(allHaveEmbeddings).toHaveLength(20)

      // Batch should complete in reasonable time
      expect(batchDuration).toBeLessThan(1000)
    })
  })

  describe('Edge Cases', () => {
    it('handles very long content', async () => {
      const longContent = 'a'.repeat(10000)
      const embedding = new Array(384).fill(0.5)

      const id = await saveMemoryWithEmbedding(
        { content: longContent, type: 'knowledge' },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.content).toHaveLength(10000)
      expect(memory?.embedding).toHaveLength(384)
    })

    it('handles special characters in content', async () => {
      const specialContent = 'Special: @#$%^&*() 你好 مرحبا 🎉'
      const embedding = new Array(384).fill(0.5)

      const id = await saveMemoryWithEmbedding(
        { content: specialContent, type: 'knowledge' },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.content).toBe(specialContent)
    })

    it('handles empty tags array', async () => {
      const embedding = new Array(384).fill(0.5)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge', tags: [] },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.tags).toEqual([])
    })

    it('handles empty metadata object', async () => {
      const embedding = new Array(384).fill(0.5)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge', metadata: {} },
        embedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.metadata).toEqual({})
    })

    it('handles embeddings with all zeros', async () => {
      const zeroEmbedding = new Array(384).fill(0)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge' },
        zeroEmbedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(zeroEmbedding)
    })

    it('handles embeddings with negative values', async () => {
      const negativeEmbedding = new Array(384).fill(-0.5)
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge' },
        negativeEmbedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(negativeEmbedding)
    })

    it('handles mixed positive and negative embedding values', async () => {
      const mixedEmbedding = Array.from({ length: 384 }, (_, i) =>
        i % 2 === 0 ? 0.5 : -0.5
      )
      const id = await saveMemoryWithEmbedding(
        { content: 'Test', type: 'knowledge' },
        mixedEmbedding
      )

      const memory = await db.memories.get(id)
      expect(memory?.embedding).toEqual(mixedEmbedding)
    })
  })
})
