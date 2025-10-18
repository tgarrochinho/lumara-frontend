/**
 * Memory Extraction Tests
 *
 * Tests for AI-powered memory extraction from conversations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  extractMemoryFromConversation,
  shouldExtractMemory,
} from '../memory-extraction';
import * as registry from '../registry';

// Mock the AI provider
vi.mock('../registry', () => ({
  selectProvider: vi.fn(),
}));

describe('extractMemoryFromConversation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('extracts memory with valid JSON response', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue(JSON.stringify({
        content: 'React hooks run on every render',
        type: 'knowledge',
        tags: ['react', 'hooks'],
        confidence: 0.9,
        reasoning: 'Clear technical fact',
      })),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const messages = [
      { role: 'user', content: 'Tell me about React hooks' },
      { role: 'assistant', content: 'Hooks run on every render' },
    ];

    const result = await extractMemoryFromConversation(messages);

    expect(result).not.toBeNull();
    expect(result!.content).toBe('React hooks run on every render');
    expect(result!.type).toBe('knowledge');
    expect(result!.confidence).toBe(0.9);
    expect(result!.tags).toEqual(['react', 'hooks']);
    expect(result!.reasoning).toBe('Clear technical fact');
  });

  it('handles JSON wrapped in markdown code blocks', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue(`Sure! Here's the memory:

\`\`\`json
{
  "content": "TypeScript generics enable type-safe reusable code",
  "type": "knowledge",
  "tags": ["typescript", "generics"],
  "confidence": 0.85,
  "reasoning": "Important concept"
}
\`\`\`

Let me know if you'd like to adjust anything!`),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const messages = [
      { role: 'user', content: 'Explain TypeScript generics' },
      { role: 'assistant', content: 'Generics provide type safety...' },
    ];

    const result = await extractMemoryFromConversation(messages);

    expect(result).not.toBeNull();
    expect(result!.content).toBe('TypeScript generics enable type-safe reusable code');
    expect(result!.type).toBe('knowledge');
    expect(result!.confidence).toBe(0.85);
  });

  it('returns null for low confidence (<0.5)', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue(JSON.stringify({
        confidence: 0.3,
      })),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const result = await extractMemoryFromConversation([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello' },
    ]);

    expect(result).toBeNull();
  });

  it('handles malformed JSON gracefully', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue('Not JSON at all, just random text'),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const result = await extractMemoryFromConversation([
      { role: 'user', content: 'Test' },
      { role: 'assistant', content: 'Response' },
    ]);

    expect(result).toBeNull();
  });

  it('defaults to knowledge type for invalid types', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue(JSON.stringify({
        content: 'Some content',
        type: 'invalid-type',
        tags: ['test'],
        confidence: 0.8,
      })),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const result = await extractMemoryFromConversation([
      { role: 'user', content: 'Test' },
      { role: 'assistant', content: 'Response' },
    ]);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('knowledge'); // Fallback to knowledge
  });

  it('returns null when no provider is available', async () => {
    vi.mocked(registry.selectProvider).mockRejectedValue(new Error('No provider'));

    const result = await extractMemoryFromConversation([
      { role: 'user', content: 'Test' },
      { role: 'assistant', content: 'Response' },
    ]);

    expect(result).toBeNull();
  });

  it('trims content and tags', async () => {
    const mockProvider = {
      chat: vi.fn().mockResolvedValue(JSON.stringify({
        content: '  Content with spaces  ',
        type: 'experience',
        tags: ['  TAG1  ', 'Tag2  '],
        confidence: 0.75,
      })),
      initialize: vi.fn(),
      dispose: vi.fn(),
      healthCheck: vi.fn(),
      embed: vi.fn(),
      name: 'mock',
      type: 'local' as const,
      requiresApiKey: false,
      capabilities: { chat: true, embeddings: false, streaming: false, multimodal: false },
    };

    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    const result = await extractMemoryFromConversation([
      { role: 'user', content: 'Test' },
      { role: 'assistant', content: 'Response' },
    ]);

    expect(result).not.toBeNull();
    expect(result!.content).toBe('Content with spaces');
    expect(result!.tags).toEqual(['tag1', 'tag2']); // Lowercase and trimmed
  });
});

describe('shouldExtractMemory', () => {
  it('returns true for substantive conversation ending with assistant', () => {
    const messages = [
      { role: 'user', content: 'Tell me about TypeScript generics and how they work' },
      { role: 'assistant', content: 'Generics allow type parameters to create reusable, type-safe code components...' },
    ];

    expect(shouldExtractMemory(messages)).toBe(true);
  });

  it('returns false for conversations with <2 messages', () => {
    const messages = [
      { role: 'user', content: 'Hello there!' },
    ];

    expect(shouldExtractMemory(messages)).toBe(false);
  });

  it('returns false if last message is from user', () => {
    const messages = [
      { role: 'user', content: 'Question one about React hooks' },
      { role: 'assistant', content: 'Answer about hooks running on render' },
      { role: 'user', content: 'Follow-up question about useEffect' },
    ];

    expect(shouldExtractMemory(messages)).toBe(false);
  });

  it('returns false for very short conversations (<50 chars)', () => {
    const messages = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello!' },
    ];

    expect(shouldExtractMemory(messages)).toBe(false);
  });

  it('returns true when total content exceeds 50 chars', () => {
    const messages = [
      { role: 'user', content: 'What is React?' },
      { role: 'assistant', content: 'React is a JavaScript library for building user interfaces.' },
    ];

    const totalLength = messages.map(m => m.content).join(' ').length;
    expect(totalLength).toBeGreaterThan(50);
    expect(shouldExtractMemory(messages)).toBe(true);
  });

  it('returns true for exactly 2 messages with assistant last and enough content', () => {
    const messages = [
      { role: 'user', content: 'Explain dependency injection' },
      { role: 'assistant', content: 'Dependency injection is a design pattern for loose coupling' },
    ];

    expect(messages.length).toBe(2);
    expect(messages[messages.length - 1].role).toBe('assistant');
    expect(shouldExtractMemory(messages)).toBe(true);
  });
});
