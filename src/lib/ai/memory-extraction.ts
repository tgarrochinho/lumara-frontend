/**
 * Memory Extraction from Conversations
 *
 * Uses AI to analyze conversations and extract structured memory data.
 * Implements edit-before-save workflow to ensure quality.
 */

import { selectProvider } from './registry';
import type { MemoryType } from '../db';

/**
 * Extracted memory structure
 *
 * Represents a memory extracted from conversation, ready for user review.
 */
export interface ExtractedMemory {
  content: string;
  type: MemoryType;
  tags: string[];
  confidence: number;
  reasoning?: string;
}

/**
 * Extract memory from conversation using AI
 *
 * Analyzes conversation context and extracts structured memory data.
 * Returns null if extraction fails or confidence is too low.
 *
 * @param messages - Recent conversation messages
 * @returns ExtractedMemory or null if extraction failed
 *
 * @example
 * ```typescript
 * const messages = [
 *   { role: 'user', content: 'I learned React hooks today' },
 *   { role: 'assistant', content: 'Great! Hooks simplify state management' }
 * ];
 * const extracted = await extractMemoryFromConversation(messages);
 * ```
 */
export async function extractMemoryFromConversation(
  messages: Array<{ role: string; content: string }>
): Promise<ExtractedMemory | null> {
  try {
    // Try to get the best available provider
    const provider = await selectProvider();

    if (!provider) {
      console.error('No AI provider available for extraction');
      return null;
    }

    // Build extraction prompt
    const conversationContext = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const extractionPrompt = `
Analyze this conversation and extract a memory that should be saved.

CONVERSATION:
${conversationContext}

Extract a memory following these rules:

1. CONTENT: The core fact, insight, or experience (1-2 sentences, clear and self-contained)
2. TYPE: Classify as one of:
   - "knowledge": Facts, concepts, how things work
   - "experience": Personal experiences, events, observations
   - "method": Approaches, strategies, workflows
3. TAGS: 2-5 relevant keywords (lowercase, hyphenated)
4. CONFIDENCE: Your confidence this is worth remembering (0.0-1.0)
5. REASONING: Brief explanation of why this is memorable

Respond ONLY with valid JSON:
{
  "content": "...",
  "type": "knowledge|experience|method",
  "tags": ["tag1", "tag2"],
  "confidence": 0.85,
  "reasoning": "..."
}

If nothing memorable was discussed, respond with:
{"confidence": 0.0}
`;

    const response = await provider.chat(extractionPrompt);

    // Parse JSON response
    const extracted = parseExtractionResponse(response);

    if (!extracted || extracted.confidence < 0.5) {
      return null;
    }

    return extracted;
  } catch (error) {
    console.error('Memory extraction failed:', error);
    return null;
  }
}

/**
 * Parse AI response into ExtractedMemory
 *
 * Handles both JSON and text responses, extracting JSON from markdown or plain text.
 *
 * @param response - Raw AI response text
 * @returns Parsed ExtractedMemory or null if parsing failed
 */
function parseExtractionResponse(response: string): ExtractedMemory | null {
  try {
    // Try to find JSON in response (handles markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const data = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (typeof data.confidence !== 'number') return null;
    if (data.confidence < 0.5) return null;

    if (!data.content || !data.type || !Array.isArray(data.tags)) {
      return null;
    }

    // Validate type
    const validTypes: MemoryType[] = ['knowledge', 'experience', 'method'];
    if (!validTypes.includes(data.type)) {
      data.type = 'knowledge'; // Default fallback
    }

    return {
      content: data.content.trim(),
      type: data.type as MemoryType,
      tags: data.tags.map((t: string) => t.toLowerCase().trim()),
      confidence: data.confidence,
      reasoning: data.reasoning,
    };
  } catch (error) {
    console.error('Failed to parse extraction response:', error);
    return null;
  }
}

/**
 * Determine if conversation warrants memory extraction
 *
 * Uses heuristics to avoid unnecessary extraction attempts:
 * - At least 2 messages
 * - Last message from assistant
 * - Some substantive content (>50 chars)
 *
 * @param messages - Conversation messages to evaluate
 * @returns True if extraction should be attempted
 *
 * @example
 * ```typescript
 * const messages = [
 *   { role: 'user', content: 'Hi' },
 *   { role: 'assistant', content: 'Hello!' }
 * ];
 * shouldExtractMemory(messages); // false - too short
 * ```
 */
export function shouldExtractMemory(
  messages: Array<{ role: string; content: string }>
): boolean {
  if (messages.length < 2) return false;

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== 'assistant') return false;

  const totalContent = messages
    .map(m => m.content)
    .join(' ')
    .trim();

  return totalContent.length > 50;
}
