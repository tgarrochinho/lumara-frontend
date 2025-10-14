import { useState, useCallback } from 'react';
import { generateEmbedding } from '@/lib/ai/embeddings/transformers';
import {
  detectContradictions,
  detectDuplicates,
  type ContradictionResult,
} from '@/lib/ai/utils/contradiction';
import type { SimilarityMatch } from '@/lib/ai/utils/similarity';
import {
  saveMemoryWithEmbedding,
  getMemoriesWithEmbeddings,
  type Memory,
  type MemoryType,
} from '@/lib/db';
import { useAIStatus } from './useAIStatus';

/**
 * Memory creation options
 */
export interface MemoryCreationOptions {
  content: string;
  type: MemoryType;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Contradiction warning state
 */
export interface ContradictionWarning {
  exists: boolean;
  contradictions: ContradictionResult[];
}

/**
 * Duplication warning state
 */
export interface DuplicationWarning {
  exists: boolean;
  duplicates: SimilarityMatch[];
}

/**
 * Memory issues check result
 */
export interface MemoryIssuesResult {
  embedding: number[];
  hasIssues: boolean;
  contradictions: ContradictionResult[];
  duplicates: SimilarityMatch[];
}

/**
 * Memory creation hook with embeddings and detection
 *
 * Manages memory creation flow with automatic:
 * - Embedding generation
 * - Contradiction detection
 * - Duplicate detection
 * - Storage with embeddings
 *
 * @returns Memory creation functions and state
 *
 * @example
 * ```tsx
 * function MemoryForm() {
 *   const {
 *     checkForIssues,
 *     createMemory,
 *     isCreating,
 *     isCheckingIssues,
 *     contradiction,
 *     duplication,
 *   } = useMemoryCreation();
 *
 *   const handleSubmit = async () => {
 *     const { embedding, hasIssues } = await checkForIssues(content);
 *
 *     if (hasIssues) {
 *       // Show warnings, let user decide
 *       return;
 *     }
 *
 *     await createMemory({ content, type: 'knowledge' }, embedding);
 *   };
 * }
 * ```
 */
export function useMemoryCreation() {
  const { provider } = useAIStatus();
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingIssues, setIsCheckingIssues] = useState(false);
  const [contradiction, setContradiction] = useState<ContradictionWarning | null>(null);
  const [duplication, setDuplication] = useState<DuplicationWarning | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Check for contradictions and duplicates
   *
   * Generates embedding and checks against existing memories.
   * This should be called before createMemory to warn users.
   *
   * @param content Memory content to check
   * @returns Embedding and issue detection results
   * @throws {Error} If embedding generation fails
   */
  const checkForIssues = useCallback(
    async (content: string): Promise<MemoryIssuesResult> => {
      setIsCheckingIssues(true);
      setError(null);

      try {
        if (!content.trim()) {
          throw new Error('Memory content cannot be empty');
        }

        // Generate embedding for the new memory
        const embedding = await generateEmbedding(content);

        // Get existing memories with embeddings
        const existingMemories = await getMemoriesWithEmbeddings();

        // Convert to the format expected by contradiction detection
        const existingMemoriesForCheck = existingMemories.map(mem => ({
          id: mem.id?.toString() || 'unknown',
          content: mem.content,
          embedding: mem.embedding!,
        }));

        let contradictionResults: ContradictionResult[] = [];
        let duplicateResults: SimilarityMatch[] = [];

        // Check for contradictions (requires AI provider)
        if (provider) {
          try {
            contradictionResults = await detectContradictions(
              'new-memory',
              content,
              embedding,
              existingMemoriesForCheck,
              provider
            );
          } catch (err) {
            console.warn('Contradiction detection failed:', err);
            // Continue without contradiction detection
          }
        }

        // Check for duplicates (doesn't require AI)
        try {
          duplicateResults = await detectDuplicates(
            embedding,
            existingMemoriesForCheck,
            0.85
          );
        } catch (err) {
          console.warn('Duplicate detection failed:', err);
          // Continue without duplicate detection
        }

        // Update state
        setContradiction({
          exists: contradictionResults.length > 0,
          contradictions: contradictionResults,
        });

        setDuplication({
          exists: duplicateResults.length > 0,
          duplicates: duplicateResults,
        });

        return {
          embedding,
          hasIssues: contradictionResults.length > 0 || duplicateResults.length > 0,
          contradictions: contradictionResults,
          duplicates: duplicateResults,
        };
      } catch (err) {
        console.error('Error checking for issues:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsCheckingIssues(false);
      }
    },
    [provider]
  );

  /**
   * Create a new memory with embedding
   *
   * Saves the memory to the database with its embedding.
   * Should be called after checkForIssues.
   *
   * @param options Memory creation options
   * @param embedding Pre-generated embedding from checkForIssues
   * @returns The ID of the newly created memory
   * @throws {Error} If memory creation fails
   */
  const createMemory = useCallback(
    async (options: MemoryCreationOptions, embedding: number[]): Promise<number> => {
      setIsCreating(true);
      setError(null);

      try {
        if (!options.content.trim()) {
          throw new Error('Memory content cannot be empty');
        }

        if (!embedding || embedding.length === 0) {
          throw new Error('Embedding is required');
        }

        // Save memory with embedding
        const memoryId = await saveMemoryWithEmbedding(
          {
            content: options.content,
            type: options.type,
            tags: options.tags || [],
            metadata: options.metadata,
          },
          embedding
        );

        // Clear warnings after successful creation
        setContradiction(null);
        setDuplication(null);

        return memoryId;
      } catch (err) {
        console.error('Error creating memory:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /**
   * Create memory without issue checking
   *
   * Convenience method that generates embedding and creates memory
   * in one step, without checking for contradictions/duplicates.
   * Use when warnings are not needed.
   *
   * @param options Memory creation options
   * @returns The ID of the newly created memory
   */
  const createMemoryDirect = useCallback(
    async (options: MemoryCreationOptions): Promise<number> => {
      const embedding = await generateEmbedding(options.content);
      return createMemory(options, embedding);
    },
    [createMemory]
  );

  /**
   * Clear warnings
   *
   * Resets contradiction and duplication warnings.
   * Useful when user dismisses warnings or starts a new memory.
   */
  const clearWarnings = useCallback(() => {
    setContradiction(null);
    setDuplication(null);
    setError(null);
  }, []);

  return {
    // Main functions
    checkForIssues,
    createMemory,
    createMemoryDirect,
    clearWarnings,

    // State
    isCreating,
    isCheckingIssues,
    isWorking: isCreating || isCheckingIssues,
    error,

    // Warnings
    contradiction,
    duplication,
    hasContradictions: contradiction?.exists || false,
    hasDuplicates: duplication?.exists || false,
    hasWarnings:
      (contradiction?.exists || false) || (duplication?.exists || false),
  };
}
