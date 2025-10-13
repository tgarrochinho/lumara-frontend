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
      // Schema structure to be defined:
      // - memories: for storing user memories
      // - reflections: for storing AI-generated reflections
      // - tags: for organizing content
      // - settings: for user preferences
      //
      // Example future schema:
      // memories: '++id, title, createdAt, updatedAt, userId',
      // reflections: '++id, memoryId, content, createdAt',
      // tags: '++id, name, color',
      // settings: 'key, value'
    })
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
