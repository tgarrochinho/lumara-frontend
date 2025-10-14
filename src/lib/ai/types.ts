/**
 * AI Provider Types
 *
 * Defines the core interfaces and types for the AI provider abstraction system.
 * All providers must implement the AIProvider interface to ensure consistent
 * behavior across different AI backends (Chrome AI, Gemini API, LM Studio, etc.)
 */

/**
 * Core AI provider interface that all providers must implement
 */
export interface AIProvider {
  /** Human-readable name of the provider */
  readonly name: string;

  /** Provider type indicating where computation occurs */
  readonly type: 'local' | 'cloud' | 'hosted';

  /** Whether this provider requires an API key for authentication */
  readonly requiresApiKey: boolean;

  /** Capabilities supported by this provider */
  capabilities: AICapabilities;

  // Core operations
  /**
   * Chat with the AI provider
   * @param message - The user's message
   * @param context - Optional context from previous conversations or relevant memories
   * @returns The AI's response
   */
  chat(message: string, context?: string[]): Promise<string>;

  /**
   * Generate embeddings for text
   * @param text - The text to embed
   * @returns Vector representation of the text
   */
  embed(text: string): Promise<number[]>;

  // Lifecycle methods
  /**
   * Initialize the provider with optional configuration
   * @param config - Provider-specific configuration
   */
  initialize(config?: ProviderConfig): Promise<void>;

  /**
   * Clean up resources used by the provider
   */
  dispose(): Promise<void>;

  /**
   * Check if the provider is available and healthy
   * @returns Health status information
   */
  healthCheck(): Promise<ProviderHealth>;
}

/**
 * Capabilities that a provider may support
 */
export interface AICapabilities {
  /** Can the provider handle chat/text generation? */
  chat: boolean;

  /** Can the provider generate embeddings? */
  embeddings: boolean;

  /** Does the provider support streaming responses? */
  streaming: boolean;

  /** Can the provider handle multimodal inputs (images, audio, etc.)? */
  multimodal: boolean;
}

/**
 * Configuration options for initializing a provider
 */
export interface ProviderConfig {
  /** API key for cloud providers (if required) */
  apiKey?: string;

  /** Specific model name to use (e.g., "gemini-pro", "gpt-4") */
  modelName?: string;

  /** Temperature for text generation (0.0 = deterministic, 1.0 = creative) */
  temperature?: number;

  /** Maximum number of tokens to generate */
  maxTokens?: number;

  /** Additional provider-specific options */
  [key: string]: unknown;
}

/**
 * Health status information for a provider
 */
export interface ProviderHealth {
  /** Is the provider currently available? */
  available: boolean;

  /** Current status of the provider */
  status: 'ready' | 'initializing' | 'error' | 'unavailable';

  /** Optional message with additional status details */
  message?: string;

  /** When this health check was performed */
  lastChecked: Date;
}

/**
 * Type for provider registry keys
 */
export type ProviderType = 'chrome-ai' | 'gemini' | 'lm-studio' | 'openai' | 'claude';

/**
 * Error thrown when no AI provider is available
 */
export class NoProviderAvailableError extends Error {
  constructor(message = 'No AI provider available') {
    super(message);
    this.name = 'NoProviderAvailableError';
  }
}

/**
 * Error thrown when a provider fails to initialize
 */
export class ProviderInitializationError extends Error {
  constructor(providerName: string, cause?: unknown) {
    super(`Failed to initialize provider: ${providerName}`);
    this.name = 'ProviderInitializationError';
    this.cause = cause;
  }
}
