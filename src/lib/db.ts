import Dexie from 'dexie'

/**
 * LumaraDatabase
 *
 * IndexedDB database configuration for Lumara using Dexie.js.
 * Provides local-first data persistence for memories, reflections, and user data.
 *
 * @see https://dexie.org/docs/
 *
 * Database name: LumaraDB
 * Current version: 1
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
 *   title: 'My Memory',
 *   content: 'Memory content...',
 *   createdAt: new Date()
 * });
 * ```
 */
export class LumaraDatabase extends Dexie {
  // Table definitions will be added here as the schema evolves.
  // For now, we're starting with an empty schema to establish the foundation.

  /**
   * Initialize the Lumara database with version 1.
   *
   * The schema is intentionally minimal at this stage to allow for
   * iterative development. Tables will be added as features are implemented.
   */
  constructor() {
    super('LumaraDB')

    // Version 1: Initial empty schema
    // Tables will be added in subsequent versions as features are developed
    this.version(1).stores({
      // Empty schema - foundation for iterative development
    })

    /**
     * Future Schema Roadmap (for development guidance)
     *
     * Version 2: Core Memories System
     * this.version(2).stores({
     *   memories: '++id, title, content, createdAt, updatedAt, userId, *tags',
     * })
     *
     * Memory Properties:
     * - id: number - Auto-incremented primary key
     * - title: string - Memory title/heading
     * - content: string - Full memory content (supports Markdown)
     * - createdAt: Date - Creation timestamp
     * - updatedAt: Date - Last modification timestamp
     * - userId: string - User identifier (for future multi-user support)
     * - tags: string[] - Array of tag names (multi-entry index with *)
     * - metadata?: { emotion?: string, location?: string, context?: string }
     *
     * Version 3: AI Reflections System
     * this.version(3).stores({
     *   memories: '++id, title, content, createdAt, updatedAt, userId, *tags',
     *   reflections: '++id, memoryId, content, type, createdAt, userId',
     * })
     *
     * Reflection Properties:
     * - id: number - Auto-incremented primary key
     * - memoryId: number - Foreign key reference to memories.id
     * - content: string - The reflection text/insight
     * - type: 'ai-insight' | 'user-note' | 'question'
     * - createdAt: Date - Creation timestamp
     * - userId: string - User identifier
     * - metadata?: { modelUsed?: string, confidence?: number }
     *
     * Version 4: Tags & Organization
     * this.version(4).stores({
     *   memories: '++id, title, content, createdAt, updatedAt, userId, *tags',
     *   reflections: '++id, memoryId, content, type, createdAt, userId',
     *   tags: '++id, &name, color, category, userId, usageCount',
     * })
     *
     * Tag Properties:
     * - id: number - Auto-incremented primary key
     * - name: string - Unique tag name (& creates unique constraint)
     * - color: string - Hex color code for UI (#6366F1)
     * - category: 'emotion' | 'topic' | 'person' | 'location' | 'custom'
     * - userId: string - User identifier
     * - usageCount: number - Times this tag has been used
     *
     * Version 5: User Settings & Preferences
     * this.version(5).stores({
     *   memories: '++id, title, content, createdAt, updatedAt, userId, *tags',
     *   reflections: '++id, memoryId, content, type, createdAt, userId',
     *   tags: '++id, &name, color, category, userId, usageCount',
     *   settings: '&key, value, updatedAt',
     * })
     *
     * Settings Properties:
     * - key: string - Unique setting key (e.g., 'theme', 'ai-model')
     * - value: any - JSON-serializable setting value
     * - updatedAt: Date - Last modification timestamp
     *
     * Index Notation Guide:
     * - '++id'          : Auto-incrementing primary key
     * - '&name'         : Unique index (only one entry with this value)
     * - '*tags'         : Multi-entry index (for array values)
     * - 'createdAt'     : Regular index (for sorting/filtering)
     * - '[userId+name]' : Compound index (for multi-column queries)
     *
     * Query Examples:
     * ```typescript
     * // Get all memories sorted by date
     * await db.memories.orderBy('createdAt').reverse().toArray()
     *
     * // Find memories with specific tag
     * await db.memories.where('tags').equals('work').toArray()
     *
     * // Get memory with reflections
     * const memory = await db.memories.get(memoryId)
     * const reflections = await db.reflections
     *   .where('memoryId').equals(memoryId)
     *   .toArray()
     * ```
     *
     * Migration Strategy:
     * - Use .upgrade() for data transformations between versions
     * - Always test migrations with sample data
     * - Keep old data intact when possible
     *
     * @see https://dexie.org/docs/Version/Version.stores()
     * @see https://dexie.org/docs/Version/Version.upgrade()
     * @see https://dexie.org/docs/Tutorial/Design
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
