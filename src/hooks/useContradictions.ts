/**
 * useContradictions Hook
 *
 * React hook for detecting contradictions between memories.
 * Uses semantic similarity and AI analysis to find conflicts.
 */

import { useState, useCallback } from 'react';
import { db } from '../lib/db';
import { detectContradictions, type ContradictionResult } from '../lib/ai/utils/contradiction';
import { selectProvider } from '../lib/ai/registry';
import { getProviderConfig } from '../lib/ai/config';

export interface UseContradictionsReturn {
  contradictions: ContradictionResult[];
  isChecking: boolean;
  checkForContradictions: (newMemory: { id: number; content: string; embedding: number[] }) => Promise<void>;
  clearContradictions: () => void;
}

/**
 * Hook for detecting contradictions between memories
 *
 * @returns Contradiction detection state and actions
 *
 * @example
 * ```tsx
 * function MemoryForm() {
 *   const { contradictions, checkForContradictions } = useContradictions();
 *
 *   const handleSubmit = async (memory) => {
 *     await checkForContradictions(memory);
 *     if (contradictions.length > 0) {
 *       // Show resolution UI
 *     }
 *   };
 * }
 * ```
 */
export function useContradictions(): UseContradictionsReturn {
  const [contradictions, setContradictions] = useState<ContradictionResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkForContradictions = useCallback(async (newMemory: {
    id: number;
    content: string;
    embedding: number[];
  }) => {
    // Query memories directly to always get fresh data without recreating callback
    const allMemories = await db.memories.toArray();

    if (!allMemories || allMemories.length === 0) {
      setContradictions([]);
      return;
    }

    setIsChecking(true);

    try {
      // Get AI provider
      const config = getProviderConfig();
      const aiProvider = await selectProvider(config.provider, config);

      // Prepare existing memories for contradiction detection
      const memoriesWithEmbeddings = allMemories
        .filter(m => m.embedding && m.id !== newMemory.id)
        .map(m => ({
          id: String(m.id),
          content: m.content,
          embedding: m.embedding!,
        }));

      // Detect contradictions
      const detected = await detectContradictions(
        String(newMemory.id),
        newMemory.content,
        newMemory.embedding,
        memoriesWithEmbeddings,
        aiProvider
      );

      setContradictions(detected);
    } catch (error) {
      console.error('Error checking for contradictions:', error);
      setContradictions([]);
    } finally {
      setIsChecking(false);
    }
  }, []); // No dependencies - always uses fresh data from DB

  const clearContradictions = useCallback(() => {
    setContradictions([]);
  }, []);

  return {
    contradictions,
    isChecking,
    checkForContradictions,
    clearContradictions,
  };
}
