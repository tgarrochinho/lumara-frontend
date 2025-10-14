/**
 * Mock AI Provider for Testing
 *
 * A testing-only provider that simulates AI behavior without requiring
 * Chrome AI API or any external dependencies. Perfect for CI/CD environments
 * and unit testing.
 */

import { BaseProvider } from './base';
import type { ProviderConfig, ProviderHealth } from '../types';

/**
 * Mock AI Provider implementation for testing
 *
 * Features:
 * - No external dependencies (works in CI/CD)
 * - Configurable responses for chat
 * - Configurable embeddings
 * - Predictable behavior for testing
 * - Fast initialization and execution
 *
 * @example
 * ```typescript
 * const provider = new MockAIProvider();
 * await provider.initialize();
 *
 * // Configure custom responses
 * provider.setResponse('hello', 'Hi there!');
 * const response = await provider.chat('hello');
 * // Returns: 'Hi there!'
 *
 * // Configure custom embeddings
 * const embedding = new Array(384).fill(0.5);
 * provider.setEmbedding('test', embedding);
 * const result = await provider.embed('test');
 * // Returns: [0.5, 0.5, 0.5, ...]
 * ```
 */
export class MockAIProvider extends BaseProvider {
  /** Provider name */
  name = 'Mock AI Provider';

  /** Provider type - local since it runs in-memory */
  type = 'local' as const;

  /** No API key required for mock provider */
  requiresApiKey = false;

  /** Mock provider capabilities */
  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  /** Storage for configured chat responses */
  private responses: Map<string, string> = new Map();

  /** Storage for configured embeddings */
  private embeddings: Map<string, number[]> = new Map();

  /** Track number of chat calls for testing */
  private chatCallCount = 0;

  /** Track number of embed calls for testing */
  private embedCallCount = 0;

  /** Simulate initialization delay (in ms, default 0) */
  private initDelay = 0;

  /** Simulate chat delay (in ms, default 0) */
  private chatDelay = 0;

  /** Simulate embed delay (in ms, default 0) */
  private embedDelay = 0;

  /**
   * Configure a custom chat response for a specific prompt
   *
   * @param prompt - The prompt to match (exact match)
   * @param response - The response to return
   */
  setResponse(prompt: string, response: string): void {
    this.responses.set(prompt, response);
  }

  /**
   * Configure a custom embedding for a specific text
   *
   * @param text - The text to match (exact match)
   * @param embedding - The embedding vector to return
   */
  setEmbedding(text: string, embedding: number[]): void {
    if (embedding.length !== 384) {
      throw new Error('Mock embeddings must be 384-dimensional');
    }
    this.embeddings.set(text, embedding);
  }

  /**
   * Set simulation delays for testing async behavior
   *
   * @param delays - Object with optional delay values in milliseconds
   */
  setDelays(delays: {
    init?: number;
    chat?: number;
    embed?: number;
  }): void {
    if (delays.init !== undefined) this.initDelay = delays.init;
    if (delays.chat !== undefined) this.chatDelay = delays.chat;
    if (delays.embed !== undefined) this.embedDelay = delays.embed;
  }

  /**
   * Get call statistics for testing
   *
   * @returns Object with call counts
   */
  getStats() {
    return {
      chatCalls: this.chatCallCount,
      embedCalls: this.embedCallCount,
      configuredResponses: this.responses.size,
      configuredEmbeddings: this.embeddings.size,
    };
  }

  /**
   * Initialize the mock provider
   *
   * @param config - Optional configuration (not used by mock)
   */
  async initialize(config?: ProviderConfig): Promise<void> {
    // Simulate initialization delay if configured
    if (this.initDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.initDelay));
    }

    this.storeConfig(config);
    this.markInitialized();
  }

  /**
   * Generate a chat response
   *
   * If a response was configured via setResponse(), returns that.
   * Otherwise, returns a generic mock response.
   *
   * @param message - The user's message
   * @param context - Optional context (not used by mock)
   * @returns Mock chat response
   */
  async chat(message: string, context?: string[]): Promise<string> {
    this.ensureInitialized();
    this.chatCallCount++;

    // Simulate chat delay if configured
    if (this.chatDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.chatDelay));
    }

    // Check for configured response
    const configuredResponse = this.responses.get(message);
    if (configuredResponse) {
      return configuredResponse;
    }

    // Check for pattern-based responses
    for (const [pattern, response] of this.responses.entries()) {
      if (message.includes(pattern)) {
        return response;
      }
    }

    // Default mock response includes the message for debugging
    const contextInfo = context && context.length > 0
      ? ` (with ${context.length} context messages)`
      : '';
    return `Mock response to: ${message}${contextInfo}`;
  }

  /**
   * Generate an embedding for text
   *
   * If an embedding was configured via setEmbedding(), returns that.
   * Otherwise, generates a deterministic pseudo-random 384-dimensional vector
   * based on the text content (same text always produces same embedding).
   *
   * @param text - The text to embed
   * @returns 384-dimensional embedding vector
   */
  async embed(text: string): Promise<number[]> {
    this.ensureInitialized();
    this.embedCallCount++;

    // Simulate embed delay if configured
    if (this.embedDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.embedDelay));
    }

    // Check for configured embedding
    const configuredEmbedding = this.embeddings.get(text);
    if (configuredEmbedding) {
      return configuredEmbedding;
    }

    // Generate deterministic pseudo-random embedding based on text
    return this.generateDeterministicEmbedding(text);
  }

  /**
   * Health check for mock provider
   *
   * @returns Health status
   */
  async healthCheck(): Promise<ProviderHealth> {
    return {
      available: this.initialized,
      status: this.initialized ? 'ready' : 'unavailable',
      message: this.initialized
        ? 'Mock provider is ready'
        : 'Mock provider is not initialized',
      lastChecked: new Date(),
    };
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    this.responses.clear();
    this.embeddings.clear();
    this.chatCallCount = 0;
    this.embedCallCount = 0;
    this.initDelay = 0;
    this.chatDelay = 0;
    this.embedDelay = 0;
    this.resetState();
  }

  /**
   * Generate a deterministic embedding based on text content
   *
   * Uses a simple hash function to create consistent embeddings for testing.
   * Same text will always produce the same embedding.
   *
   * @param text - The text to generate embedding for
   * @returns 384-dimensional normalized vector
   */
  private generateDeterministicEmbedding(text: string): number[] {
    const embedding = new Array(384);

    // Simple hash function for deterministic values
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use hash as seed for pseudo-random number generator
    let seed = Math.abs(hash);
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Generate embedding values
    for (let i = 0; i < 384; i++) {
      embedding[i] = random() * 2 - 1; // Range: -1 to 1
    }

    // Normalize the vector (make magnitude = 1)
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );

    return embedding.map(val => val / magnitude);
  }

  /**
   * Clear all configured responses
   */
  clearResponses(): void {
    this.responses.clear();
  }

  /**
   * Clear all configured embeddings
   */
  clearEmbeddings(): void {
    this.embeddings.clear();
  }

  /**
   * Reset all call counters
   */
  resetStats(): void {
    this.chatCallCount = 0;
    this.embedCallCount = 0;
  }
}
