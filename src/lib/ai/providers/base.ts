/**
 * Base Provider Abstract Class
 *
 * Provides common functionality and structure for all AI providers.
 * Concrete providers extend this class and implement the abstract methods.
 */

import type {
  AIProvider,
  AICapabilities,
  ProviderConfig,
  ProviderHealth,
} from '../types';

/**
 * Abstract base class for AI providers
 *
 * Implements common functionality like health checking and initialization tracking.
 * Concrete providers must implement the abstract methods for chat, embed, initialize, and dispose.
 */
export abstract class BaseProvider implements AIProvider {
  /** Provider name - must be defined by concrete class */
  abstract readonly name: string;

  /** Provider type - must be defined by concrete class */
  abstract readonly type: 'local' | 'cloud' | 'hosted';

  /** Whether API key is required - must be defined by concrete class */
  abstract readonly requiresApiKey: boolean;

  /** Provider capabilities - must be defined by concrete class */
  abstract capabilities: AICapabilities;

  /** Track initialization state */
  protected initialized = false;

  /** Store last health check result for caching */
  protected lastHealth: ProviderHealth | null = null;

  /** Store initialization configuration */
  protected config: ProviderConfig | undefined;

  /**
   * Default health check implementation
   *
   * Checks basic initialization status. Concrete providers can override
   * this method to perform more detailed health checks.
   *
   * @returns Current health status of the provider
   */
  async healthCheck(): Promise<ProviderHealth> {
    const now = new Date();

    // If we have a recent health check (within 10 seconds), return cached result
    if (
      this.lastHealth &&
      now.getTime() - this.lastHealth.lastChecked.getTime() < 10000
    ) {
      return this.lastHealth;
    }

    // Perform new health check
    const health: ProviderHealth = {
      available: this.initialized,
      status: this.initialized ? 'ready' : 'unavailable',
      message: this.initialized
        ? `${this.name} is ready`
        : `${this.name} is not initialized`,
      lastChecked: now,
    };

    this.lastHealth = health;
    return health;
  }

  /**
   * Check if the provider is initialized
   *
   * @throws Error if the provider is not initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        `${this.name} is not initialized. Call initialize() first.`
      );
    }
  }

  // Abstract methods that concrete providers must implement

  /**
   * Chat with the AI provider
   *
   * @param message - The user's message
   * @param context - Optional context from previous conversations
   * @returns The AI's response
   */
  abstract chat(message: string, context?: string[]): Promise<string>;

  /**
   * Generate embeddings for text
   *
   * @param text - The text to embed
   * @returns Vector representation of the text
   */
  abstract embed(text: string): Promise<number[]>;

  /**
   * Initialize the provider (abstract)
   *
   * Concrete implementations should call this via super after their initialization
   * to properly track config and state.
   *
   * @param config - Optional provider-specific configuration
   */
  abstract initialize(config?: ProviderConfig): Promise<void>;

  /**
   * Clean up resources used by the provider
   *
   * Concrete implementations should reset config and state after cleanup.
   */
  abstract dispose(): Promise<void>;

  /**
   * Store configuration for later use
   * Should be called by concrete initialize() implementations
   */
  protected storeConfig(config?: ProviderConfig): void {
    this.config = config;
  }

  /**
   * Mark provider as initialized
   * Should be called by concrete initialize() implementations
   */
  protected markInitialized(): void {
    this.initialized = true;
  }

  /**
   * Reset provider state
   * Should be called by concrete dispose() implementations
   */
  protected resetState(): void {
    this.initialized = false;
    this.config = undefined;
    this.lastHealth = null;
  }
}
