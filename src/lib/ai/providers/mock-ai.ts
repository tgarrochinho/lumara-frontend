/**
 * Mock AI Provider
 *
 * Simple mock provider for development and testing.
 * Returns canned responses to simulate AI behavior.
 */

import type { AIProvider, AICapabilities, ProviderConfig, ProviderHealth } from '../types';

export class MockAIProvider implements AIProvider {
  readonly name = 'Mock AI';
  readonly type = 'local' as const;
  readonly requiresApiKey = false;

  capabilities: AICapabilities = {
    chat: true,
    embeddings: false,
    streaming: false,
    multimodal: false,
  };

  private responses = [
    "That's interesting! I've noted that down as a memory.",
    "I understand. Let me remember that for you.",
    "Got it! I'll keep that in mind for our future conversations.",
    "Interesting perspective! I've captured that as a memory.",
    "Thanks for sharing! I'll remember that detail.",
  ];

  async initialize(_config?: ProviderConfig): Promise<void> {
    // Mock provider is always ready
    console.log('[MockAI] Provider initialized');
  }

  async dispose(): Promise<void> {
    // Nothing to clean up
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      available: true,
      latency: 50,
      lastCheck: new Date(),
    };
  }

  async chat(message: string, _context?: string[]): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Return a random canned response
    const response = this.responses[Math.floor(Math.random() * this.responses.length)];

    console.log('[MockAI] Responding to:', message.slice(0, 50));
    return response;
  }

  async embed(_text: string): Promise<number[]> {
    throw new Error('Mock provider does not support embeddings');
  }
}
