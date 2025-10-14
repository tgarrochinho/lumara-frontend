import Dexie from 'dexie'
import type { Table } from 'dexie'

/**
 * Memory type categories
 */
export type MemoryType = 'knowledge' | 'experience' | 'method'

/**
 * Memory interface with embedding support
 *
 * Represents a single memory stored in the Lumara database.
 * Embeddings are optional and generated lazily using Transformers.js.
 */
export interface Memory {
  id?: number // Auto-increment primary key
  content: string // Memory text content
  type: MemoryType // Memory category
  embedding?: number[] // 384-dimensional vector from Transformers.js (optional)
  createdAt: Date // Creation timestamp
  updatedAt: Date // Last modification timestamp
  tags?: string[] // Array of tag names
  metadata?: Record<string, any> // Additional metadata
}

/**
 * LumaraDatabase
 *
 * IndexedDB database configuration for Lumara using Dexie.js.
 * Provides local-first data persistence for memories, reflections, and user data.
 *
 * @see https://dexie.org/docs/
 *
 * Database name: LumaraDB
 * Current version: 2
 *
 * Usage:
 * ```typescript
 * import { db } from '@/lib/db';
 *
 * // Query the database
 * const allMemories = await db.memories.toArray();
 *
 * // Add new records
 * await db.memories.add({
 *   content: 'Memory content...',
 *   type: 'knowledge',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * });
 * ```
 */
export class LumaraDatabase extends Dexie {
  // Table definitions
  memories!: Table<Memory, number>

  /**
   * Initialize the Lumara database.
   *
   * Version 1: Initial empty schema (foundation)
   * Version 2: Core Memories System with embedding support
   */
  constructor() {
    super('LumaraDB')

    // Version 1: Initial empty schema
    // Kept for users who may have initialized the database before
    this.version(1).stores({
      // Empty schema - foundation for iterative development
    })

    // Version 2: Core Memories System with embedding support
    this.version(2)
      .stores({
        memories: '++id, content, type, createdAt, updatedAt, *tags',
      })
      .upgrade(async (trans) => {
        // Migration: existing memories get embedding = undefined
        // Embeddings will be generated lazily when needed
        console.log('Upgrading to v2: Adding memories table with embedding support')
        // No data transformation needed for new table
        // The embedding field is optional, so existing memories (if any) work as-is
      })

    /**
     * Future Schema Roadmap:
     * - Version 3: AI Reflections System
     * - Version 4: Tags & Organization
     * - Version 5: User Settings & Preferences
     *
     * @see https://dexie.org/docs/Version/Version.stores()
     * @see https://dexie.org/docs/Version/Version.upgrade()
     */
  }
}

/**
 * Singleton database instance.
 *
 * Import this instance throughout the application to interact with IndexedDB.
 * The database is initialized automatically when first imported.
 *
 * @example
 * ```typescript
 * import { db } from '@/lib/db';
 *
 * // Use in React components with dexie-react-hooks
 * import { useLiveQuery } from 'dexie-react-hooks';
 *
 * function MyComponent() {
 *   const memories = useLiveQuery(() => db.memories.toArray());
 *   // ...
 * }
 * ```
 */
export const db = new LumaraDatabase()

/**
 * Database type export for type inference in other modules.
 */
export type Database = LumaraDatabase

// =============================================================================
// Helper Functions for Memory Operations with Embeddings
// =============================================================================

/**
 * Save a new memory with its embedding
 *
 * @param memory Memory data (without id, createdAt, updatedAt)
 * @param embedding 384-dimensional embedding vector
 * @returns The ID of the newly created memory
 *
 * @example
 * ```typescript
 * const embedding = await generateEmbedding('My important memory');
 * const id = await saveMemoryWithEmbedding(
 *   { content: 'My important memory', type: 'knowledge' },
 *   embedding
 * );
 * ```
 */
export async function saveMemoryWithEmbedding(
  memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>,
  embedding: number[]
): Promise<number> {
  // Validate embedding dimensions
  if (embedding.length !== 384) {
    throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`)
  }

  const now = new Date()

  const id = await db.memories.add({
    ...memory,
    embedding,
    createdAt: now,
    updatedAt: now,
  })

  return id
}

/**
 * Update an existing memory's embedding
 *
 * @param memoryId The ID of the memory to update
 * @param embedding 384-dimensional embedding vector
 *
 * @example
 * ```typescript
 * const embedding = await generateEmbedding('Updated content');
 * await updateMemoryEmbedding(memoryId, embedding);
 * ```
 */
export async function updateMemoryEmbedding(
  memoryId: number,
  embedding: number[]
): Promise<void> {
  // Validate embedding dimensions
  if (embedding.length !== 384) {
    throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`)
  }

  await db.memories.update(memoryId, {
    embedding,
    updatedAt: new Date(),
  })
}

/**
 * Get all memories that have embeddings
 *
 * @returns Array of memories with embeddings
 *
 * @example
 * ```typescript
 * const memoriesWithEmbeddings = await getMemoriesWithEmbeddings();
 * console.log(`Found ${memoriesWithEmbeddings.length} memories with embeddings`);
 * ```
 */
export async function getMemoriesWithEmbeddings(): Promise<Memory[]> {
  return db.memories.filter((memory) => memory.embedding !== undefined).toArray()
}

/**
 * Get all memories that don't have embeddings yet
 *
 * @returns Array of memories without embeddings
 *
 * @example
 * ```typescript
 * const memoriesWithoutEmbeddings = await getMemoriesWithoutEmbeddings();
 * console.log(`Need to generate ${memoriesWithoutEmbeddings.length} embeddings`);
 * ```
 */
export async function getMemoriesWithoutEmbeddings(): Promise<Memory[]> {
  return db.memories.filter((memory) => memory.embedding === undefined).toArray()
}

/**
 * Batch update embeddings for multiple memories
 *
 * @param updates Array of memory ID and embedding pairs
 *
 * @example
 * ```typescript
 * await batchUpdateEmbeddings([
 *   { id: 1, embedding: [0.1, 0.2, ...] },
 *   { id: 2, embedding: [0.3, 0.4, ...] },
 * ]);
 * ```
 */
export async function batchUpdateEmbeddings(
  updates: Array<{ id: number; embedding: number[] }>
): Promise<void> {
  // Validate all embeddings first
  for (const { embedding } of updates) {
    if (embedding.length !== 384) {
      throw new Error(`Invalid embedding dimensions: expected 384, got ${embedding.length}`)
    }
  }

  await db.transaction('rw', db.memories, async () => {
    const now = new Date()
    for (const { id, embedding } of updates) {
      await db.memories.update(id, {
        embedding,
        updatedAt: now,
      })
    }
  })
}

/**
 * Ensure a memory has an embedding, generating it if needed
 *
 * @param memoryId The ID of the memory
 * @returns The embedding vector (existing or newly generated)
 *
 * @example
 * ```typescript
 * import { ensureMemoryHasEmbedding } from '@/lib/db';
 * const embedding = await ensureMemoryHasEmbedding(memoryId);
 * ```
 */
export async function ensureMemoryHasEmbedding(memoryId: number): Promise<number[]> {
  const memory = await db.memories.get(memoryId)

  if (!memory) {
    throw new Error(`Memory ${memoryId} not found`)
  }

  // Return existing embedding if available
  if (memory.embedding) {
    return memory.embedding
  }

  // Generate embedding - import dynamically to avoid circular dependencies
  const { generateEmbedding } = await import('./ai/embeddings/transformers')
  const embedding = await generateEmbedding(memory.content)

  // Store embedding
  await db.memories.update(memoryId, {
    embedding,
    updatedAt: new Date(),
  })

  return embedding
}

/**
 * Ensure all memories have embeddings, generating them as needed
 *
 * @param onProgress Optional callback to track progress
 *
 * @example
 * ```typescript
 * await ensureAllMemoriesHaveEmbeddings((current, total) => {
 *   console.log(`Progress: ${current}/${total}`);
 * });
 * ```
 */
export async function ensureAllMemoriesHaveEmbeddings(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const memoriesWithoutEmbeddings = await getMemoriesWithoutEmbeddings()

  for (let i = 0; i < memoriesWithoutEmbeddings.length; i++) {
    const memory = memoriesWithoutEmbeddings[i]

    if (memory.id) {
      await ensureMemoryHasEmbedding(memory.id)
    }

    if (onProgress) {
      onProgress(i + 1, memoriesWithoutEmbeddings.length)
    }
  }
}
