/**
 * Contradiction Detection Utilities
 *
 * Provides semantic analysis to detect contradictions and duplicates
 * between memories using AI-powered analysis combined with similarity metrics.
 */

import { findSimilar } from './similarity';
import type { SimilarityMatch } from './similarity';
import type { AIProvider } from '../types';

/**
 * Result of a contradiction analysis
 */
export interface ContradictionResult {
  /** Whether the memories contradict each other */
  contradicts: boolean;

  /** Confidence level (0-100) in the contradiction assessment */
  confidence: number;

  /** Human-readable explanation of the contradiction or lack thereof */
  explanation: string;

  /** ID of the first memory */
  memory1Id: string;

  /** ID of the second memory */
  memory2Id: string;
}

/**
 * A candidate memory that might contradict the new memory
 */
export interface ContradictionCandidate {
  /** The similar memory that might contradict */
  memory: SimilarityMatch;

  /** Whether it's semantically similar enough to check for contradiction */
  semanticallySimilar: boolean;
}

/**
 * Detect contradictions between a new memory and existing memories
 *
 * Process:
 * 1. Find semantically similar memories (>0.70 similarity)
 * 2. Use AI to analyze each similar memory for contradictions
 * 3. Return all detected contradictions with confidence scores
 *
 * @param newMemoryId - ID of the new memory being checked
 * @param newMemoryContent - Content of the new memory
 * @param newMemoryEmbedding - Embedding vector of the new memory
 * @param existingMemories - Array of existing memories to check against
 * @param aiProvider - AI provider for semantic analysis
 * @returns Array of detected contradictions
 *
 * @example
 * const contradictions = await detectContradictions(
 *   'mem-123',
 *   'I love coffee',
 *   embedding,
 *   existingMemories,
 *   aiProvider
 * );
 * // May return: [{ contradicts: true, confidence: 85, explanation: '...', ... }]
 */
export async function detectContradictions(
  newMemoryId: string,
  newMemoryContent: string,
  newMemoryEmbedding: number[],
  existingMemories: Array<{ id: string; content: string; embedding: number[] }>,
  aiProvider: AIProvider
): Promise<ContradictionResult[]> {
  // Step 1: Find semantically similar memories (>0.70 similarity)
  const similar = await findSimilar(
    newMemoryEmbedding,
    existingMemories,
    { threshold: 0.70, excludeIds: [newMemoryId] }
  );

  if (similar.length === 0) {
    return [];
  }

  // Step 2: Use AI to analyze each similar memory for contradiction
  const contradictions: ContradictionResult[] = [];

  for (const match of similar) {
    const analysis = await analyzeContradiction(
      newMemoryContent,
      match.content,
      aiProvider
    );

    if (analysis.contradicts) {
      contradictions.push({
        ...analysis,
        memory1Id: newMemoryId,
        memory2Id: match.id,
      });
    }
  }

  return contradictions;
}

/**
 * Analyze two texts for contradictions using AI
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @param aiProvider - AI provider for analysis
 * @returns Contradiction analysis result
 */
async function analyzeContradiction(
  text1: string,
  text2: string,
  aiProvider: AIProvider
): Promise<Omit<ContradictionResult, 'memory1Id' | 'memory2Id'>> {
  const prompt = `Analyze if these two statements contradict each other:

Statement 1: "${text1}"
Statement 2: "${text2}"

Respond in JSON format:
{
  "contradicts": true/false,
  "confidence": 0-100,
  "explanation": "brief explanation of why they do or don't contradict"
}

Consider:
- Direct contradictions (X is true vs X is false)
- Contextual contradictions (may be true in different contexts)
- Complementary statements (both can be true)

Examples:
- "I love coffee" vs "I hate coffee" = CONTRADICTS (confidence: 95)
- "I drink coffee in the morning" vs "I avoid caffeine at night" = NO CONTRADICTION (confidence: 90)
- "My favorite color is blue" vs "My favorite color is red" = CONTRADICTS (confidence: 100)
- "I work at Google" vs "I work in tech" = NO CONTRADICTION (confidence: 95)

Only mark as contradiction if the statements cannot both be true at the same time.`;

  try {
    const response = await aiProvider.chat(prompt);

    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        contradicts: result.contradicts === true,
        confidence: Math.min(100, Math.max(0, result.confidence || 0)),
        explanation: result.explanation || 'No explanation provided',
      };
    }

    // If no JSON found, try to parse a simpler format
    const simpleMatch = response.toLowerCase();
    if (simpleMatch.includes('contradict')) {
      return {
        contradicts: true,
        confidence: 50,
        explanation: 'Likely contradiction detected in response',
      };
    }
  } catch (error) {
    console.error('Error analyzing contradiction:', error);
  }

  // Fallback if AI analysis fails
  return {
    contradicts: false,
    confidence: 0,
    explanation: 'Could not analyze for contradiction',
  };
}

/**
 * Detect duplicate memories based on high similarity
 *
 * Finds memories that are nearly identical (>85% similarity by default).
 * These are likely duplicates that should be merged or deduplicated.
 *
 * @param newMemoryEmbedding - Embedding of the new memory
 * @param existingMemories - Existing memories to check against
 * @param threshold - Similarity threshold for duplicates (default: 0.85)
 * @returns Array of potential duplicate memories
 *
 * @example
 * const duplicates = await detectDuplicates(
 *   embedding,
 *   existingMemories,
 *   0.85
 * );
 * // Returns memories with >85% similarity
 */
export async function detectDuplicates(
  newMemoryEmbedding: number[],
  existingMemories: Array<{ id: string; content: string; embedding: number[] }>,
  threshold = 0.85
): Promise<SimilarityMatch[]> {
  return findSimilar(newMemoryEmbedding, existingMemories, { threshold });
}

/**
 * Get contradiction candidates for manual review
 *
 * Returns memories that are semantically similar enough to potentially
 * contradict, but haven't been analyzed yet. Useful for batch processing.
 *
 * @param newMemoryEmbedding - Embedding of the new memory
 * @param existingMemories - Existing memories to check
 * @returns Array of contradiction candidates
 */
export async function getContradictionCandidates(
  newMemoryEmbedding: number[],
  existingMemories: Array<{ id: string; content: string; embedding: number[] }>
): Promise<ContradictionCandidate[]> {
  const similar = await findSimilar(
    newMemoryEmbedding,
    existingMemories,
    { threshold: 0.70 }
  );

  return similar.map(memory => ({
    memory,
    semanticallySimilar: true,
  }));
}

/**
 * Batch analyze multiple memory pairs for contradictions
 *
 * More efficient than calling detectContradictions multiple times.
 * Processes all pairs and returns results in bulk.
 *
 * @param pairs - Array of memory pairs to analyze
 * @param aiProvider - AI provider for analysis
 * @returns Array of contradiction results
 */
export async function batchAnalyzeContradictions(
  pairs: Array<{
    id1: string;
    content1: string;
    id2: string;
    content2: string;
  }>,
  aiProvider: AIProvider
): Promise<ContradictionResult[]> {
  const results: ContradictionResult[] = [];

  for (const pair of pairs) {
    const analysis = await analyzeContradiction(
      pair.content1,
      pair.content2,
      aiProvider
    );

    results.push({
      ...analysis,
      memory1Id: pair.id1,
      memory2Id: pair.id2,
    });
  }

  return results;
}
