/**
 * Memory Extraction from Conversations
 *
 * Uses AI to analyze conversations and extract structured memory data.
 *
 * Confidence-based workflow:
 * - High confidence (≥0.8): Auto-save silently with notification
 * - Medium confidence (0.5-0.8): Show review UI for user confirmation
 * - Low confidence (<0.5): Discard, don't interrupt conversation
 */

import { selectProvider } from './registry';
import { getProviderConfig } from './config';
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
    // Get provider configuration and initialize
    const config = getProviderConfig();
    const provider = await selectProvider(config.provider, config);

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

IMPORTANT - DO NOT extract memories from:
- Questions (e.g., "what are my preferences?", "how do I...?")
- Greetings or small talk
- Requests for information
- Meta-conversation about the system itself

ONLY extract memories from:
- User stating facts about themselves (preferences, experiences, knowledge)
- User sharing personal insights or realizations
- User describing their methods or approaches

Extract a memory following these rules:

1. CONTENT: ONE SHORT SENTENCE summarizing the key fact/insight
   - Maximum 15 words
   - NO explanations, NO context, NO details
   - Just the core insight
   - Examples:
     * "User prefers working in the morning"
     * "React hooks run on every render"
     * "User's debugging approach is to check console first"

2. TYPE: Classify as one of:
   - "knowledge": Facts, concepts, how things work
   - "experience": Personal experiences, events, observations
   - "method": Approaches, strategies, workflows

3. TAGS: 2-3 relevant keywords (lowercase, hyphenated)

4. CONFIDENCE: Your confidence this is worth remembering (0.0-1.0)

5. REASONING: Brief explanation (max 10 words)

Respond ONLY with valid JSON:
{
  "content": "...",
  "type": "knowledge|experience|method",
  "tags": ["tag1", "tag2"],
  "confidence": 0.85,
  "reasoning": "..."
}

If nothing memorable was discussed (e.g., just a question or small talk), respond with:
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

  // Get the last user message to check if it's just a question
  const lastUserMessage = [...messages]
    .reverse()
    .find(m => m.role === 'user');

  if (lastUserMessage) {
    const userContent = lastUserMessage.content.trim();

    // Universal heuristic: Skip if it's just a simple question without declarative content
    // Works across languages by checking for:
    // 1. Ends with question mark (universal)
    // 2. Is short (<10 words)
    // 3. Doesn't contain first-person indicators (language-agnostic approach)
    const hasQuestionMark = userContent.endsWith('?');
    const isShort = userContent.split(/\s+/).length < 10;

    // Simple check: if it's a short question, skip it
    // The AI prompt will handle more nuanced cases
    if (hasQuestionMark && isShort) {
      return false;
    }
  }

  const totalContent = messages
    .map(m => m.content)
    .join(' ')
    .trim();

  return totalContent.length > 50;
}
