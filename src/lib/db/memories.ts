/**
 * Memory CRUD Operations
 *
 * Provides ergonomic functions for creating, reading, updating, and deleting memories.
 * Automatically handles embedding generation and timestamp management.
 */

import { db, type Memory, type MemoryType } from '../db';
import { generateEmbedding } from '../ai/embeddings';
import { cosineSimilarity } from '../ai/utils/similarity';

/**
 * Create a new memory with automatic embedding generation
 * @param data - Memory data (excluding id and timestamps)
 * @returns Promise<number> - The ID of the created memory
 */
export async function createMemory(
  data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt' | 'embedding'>
): Promise<number> {
  const embedding = await generateEmbedding(data.content);
  const now = new Date();

  const id = await db.memories.add({
    ...data,
    embedding,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

/**
 * Update an existing memory (regenerates embedding if content changed)
 * @param id - Memory ID
 * @param data - Partial memory data to update
 */
export async function updateMemory(
  id: number,
  data: Partial<Omit<Memory, 'id' | 'createdAt'>>
): Promise<void> {
  const updates: Partial<Memory> = {
    ...data,
    updatedAt: new Date(),
  };

  // Regenerate embedding if content changed
  if (data.content) {
    updates.embedding = await generateEmbedding(data.content);
  }

  await db.memories.update(id, updates);
}

/**
 * Delete a memory
 * @param id - Memory ID
 */
export async function deleteMemory(id: number): Promise<void> {
  await db.memories.delete(id);
}

/**
 * Get a single memory by ID
 * @param id - Memory ID
 * @returns Promise<Memory | undefined>
 */
export async function getMemory(id: number): Promise<Memory | undefined> {
  return db.memories.get(id);
}

/**
 * Get all memories (reverse chronological)
 * @returns Promise<Memory[]>
 */
export async function getAllMemories(): Promise<Memory[]> {
  return db.memories.orderBy('createdAt').reverse().toArray();
}

/**
 * Filter memories by type
 * @param type - Memory type to filter by
 * @returns Promise<Memory[]>
 */
export async function filterMemories(type: MemoryType): Promise<Memory[]> {
  return db.memories
    .where('type')
    .equals(type)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Semantic search across all memories
 * @param query - Search query text
 * @param threshold - Similarity threshold (0.0-1.0), default 0.7
 * @param limit - Maximum results, default 20
 * @returns Promise<Array<Memory & { score: number }>>
 */
export async function searchMemories(
  query: string,
  threshold = 0.7,
  limit = 20
): Promise<Array<Memory & { score: number }>> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Get all memories with embeddings
  const allMemories = await db.memories.filter(m => m.embedding !== undefined).toArray();

  // Calculate similarities
  const results = allMemories
    .map(memory => ({
      ...memory,
      score: memory.embedding ? cosineSimilarity(queryEmbedding, memory.embedding) : 0,
    }))
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Get memories count
 * @returns Promise<number>
 */
export async function getMemoriesCount(): Promise<number> {
  return db.memories.count();
}
