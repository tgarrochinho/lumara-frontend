/**
 * Chrome AI Provider (Gemini Nano)
 *
 * Implementation of AIProvider for Chrome's built-in Gemini Nano model.
 * Requires Chrome Canary/Dev with the Origin Trial token enabled.
 *
 * @see https://developer.chrome.com/docs/ai/built-in
 */

import { BaseProvider } from './base';
import type { AICapabilities, ProviderConfig, ProviderHealth } from '../types';
import { ProviderInitializationError } from '../types';

/**
 * Type definitions for Chrome AI API
 * These are not yet in TypeScript's standard library
 */
declare global {
  // Latest API (Chrome 141+) - Global LanguageModel
  const LanguageModel: {
    availability: () => Promise<'readily' | 'after-download' | 'no'>;
    params: () => Promise<{
      defaultTemperature: number;
      defaultTopK: number;
      maxTopK: number;
    }>;
    create: (options?: AILanguageModelCreateOptions) => Promise<AILanguageModel>;
  } | undefined;

  interface Window {
    ai?: {
      // Legacy API (Chrome <141)
      canCreateTextSession?: () => Promise<AISessionAvailability>;
      createTextSession?: (options?: AISessionOptions) => Promise<AITextSession>;

      // Transitional API (Chrome 128-140)
      languageModel?: {
        capabilities: () => Promise<AILanguageModelCapabilities>;
        create: (options?: AILanguageModelOptions) => Promise<AILanguageModel>;
      };
    };
  }
}

type AISessionAvailability = 'readily' | 'after-download' | 'no';

interface AISessionOptions {
  temperature?: number;
  topK?: number;
}

interface AITextSession {
  prompt: (input: string) => Promise<string>;
  promptStreaming?: (input: string) => AsyncIterable<string>;
  destroy?: () => void;
}

// Transitional API types (Chrome 128-140)
interface AILanguageModelCapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
}

interface AILanguageModelOptions {
  temperature?: number;
  topK?: number;
  systemPrompt?: string;
  initialPrompts?: Array<{ role: string; content: string }>;
  language?: string; // Required in newer versions: 'en', 'es', 'ja'
}

// Latest API types (Chrome 141+)
interface AILanguageModelCreateOptions {
  temperature?: number;
  topK?: number;
  systemPrompt?: string;
  initialPrompts?: Array<{ role: string; content: string }>;
}

interface AILanguageModel {
  prompt: (input: string) => Promise<string>;
  promptStreaming?: (input: string) => AsyncIterable<string>;
  destroy?: () => void;
}

/**
 * Chrome AI Provider implementation using Gemini Nano
 *
 * This provider runs entirely locally in the browser without requiring
 * an API key or network connection (after initial model download).
 *
 * Capabilities:
 * - Chat: Yes (via Gemini Nano)
 * - Embeddings: No (use Transformers.js separately)
 * - Streaming: No (not yet implemented)
 * - Multimodal: No
 */
export class ChromeAIProvider extends BaseProvider {
  readonly name = 'Chrome AI (Gemini Nano)';
  readonly type = 'local' as const;
  readonly requiresApiKey = false;

  capabilities: AICapabilities = {
    chat: true,
    embeddings: false, // Embeddings handled by Transformers.js (Task #26)
    streaming: false, // Could be implemented in future
    multimodal: false,
  };

  /** The active Chrome AI session (legacy or new API) */
  private session: AITextSession | AILanguageModel | null = null;

  /** Track which API version we're using */
  private usingNewAPI = false;

  /**
   * Initialize the Chrome AI provider
   *
   * Checks if Chrome AI is available and creates a text session.
   *
   * @param config - Optional configuration (temperature, etc.)
   * @throws ProviderInitializationError if Chrome AI is not available
   */
  async initialize(config?: ProviderConfig): Promise<void> {
    try {
      // Try latest API first (Chrome 141+) - Global LanguageModel
      if (typeof LanguageModel !== 'undefined') {
        console.log('[ChromeAI] Using latest global LanguageModel API (Chrome 141+)');
        this.usingNewAPI = true;

        // Check availability
        const availability = await LanguageModel.availability();

        if (availability === 'no') {
          throw new Error(
            'Chrome AI is not available on this device. Your device may not support on-device AI.'
          );
        }

        if (availability === 'after-download') {
          throw new Error(
            'Chrome AI model needs to be downloaded. Please wait for the download to complete and try again.'
          );
        }

        // Create language model session
        const modelOptions: AILanguageModelCreateOptions = {};

        if (config?.temperature !== undefined) {
          modelOptions.temperature = config.temperature;
        }

        this.session = await LanguageModel.create(modelOptions);
        this.initialized = true;
        this.config = config;

        console.log(`${this.name} initialized successfully (latest global API)`);
        return;
      }

      // Try transitional API (Chrome 128-140)
      if (window.ai?.languageModel) {
        console.log('[ChromeAI] Using new languageModel API (Chrome 141+)');
        this.usingNewAPI = true;

        // Check capabilities
        const capabilities = await window.ai.languageModel.capabilities();

        if (capabilities.available === 'no') {
          throw new Error(
            'Chrome AI is not available on this device. Your device may not support on-device AI.'
          );
        }

        if (capabilities.available === 'after-download') {
          throw new Error(
            'Chrome AI model needs to be downloaded. Please wait for the download to complete and try again.'
          );
        }

        // Create language model session with language parameter
        const modelOptions: AILanguageModelOptions = {
          language: 'en', // Required in newer versions
        };

        if (config?.temperature !== undefined) {
          modelOptions.temperature = config.temperature;
        }

        this.session = await window.ai.languageModel.create(modelOptions);
        this.initialized = true;
        this.config = config;

        console.log(`${this.name} initialized successfully (new API)`);
      }
      // Fall back to legacy API (Chrome <141)
      else if (window.ai.canCreateTextSession && window.ai.createTextSession) {
        console.log('[ChromeAI] Using legacy API (Chrome <141)');
        this.usingNewAPI = false;

        // Check if the model is ready
        const availability = await window.ai.canCreateTextSession();

        if (availability === 'no') {
          throw new Error(
            'Chrome AI is not available on this device. Your device may not support on-device AI.'
          );
        }

        if (availability === 'after-download') {
          throw new Error(
            'Chrome AI model needs to be downloaded. Please wait for the download to complete and try again.'
          );
        }

        // Create a text session
        const sessionOptions: AISessionOptions = {};
        if (config?.temperature !== undefined) {
          sessionOptions.temperature = config.temperature;
        }

        this.session = await window.ai.createTextSession(sessionOptions);
        this.initialized = true;
        this.config = config;

        console.log(`${this.name} initialized successfully (legacy API)`);
      } else {
        throw new Error(
          'No compatible Chrome AI API found. Please update Chrome or enable flags.'
        );
      }
    } catch (error) {
      this.initialized = false;
      throw new ProviderInitializationError(this.name, error);
    }
  }

  /**
   * Enhanced health check for Chrome AI
   *
   * Checks both initialization status and API availability.
   *
   * @returns Current health status
   */
  async healthCheck(): Promise<ProviderHealth> {
    const now = new Date();

    // Check if API is available
    if (!window.ai) {
      return {
        available: false,
        status: 'unavailable',
        message: 'Chrome AI API not available. Use Chrome Canary/Dev with Origin Trial.',
        lastChecked: now,
      };
    }

    // Check model availability
    try {
      const availability = await window.ai.canCreateTextSession();

      if (availability === 'no') {
        return {
          available: false,
          status: 'unavailable',
          message: 'Chrome AI is not supported on this device.',
          lastChecked: now,
        };
      }

      if (availability === 'after-download') {
        return {
          available: false,
          status: 'initializing',
          message: 'Chrome AI model is downloading. Please wait.',
          lastChecked: now,
        };
      }

      // Check if we have an active session
      if (!this.initialized || !this.session) {
        return {
          available: true,
          status: 'ready',
          message: 'Chrome AI is available but not initialized. Call initialize() first.',
          lastChecked: now,
        };
      }

      return {
        available: true,
        status: 'ready',
        message: 'Chrome AI is ready',
        lastChecked: now,
      };
    } catch (error) {
      return {
        available: false,
        status: 'error',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastChecked: now,
      };
    }
  }

  /**
   * Chat with Chrome AI (Gemini Nano)
   *
   * @param message - The user's message
   * @param context - Optional context to include in the prompt
   * @returns The AI's response
   * @throws Error if not initialized or if the chat fails
   */
  async chat(message: string, context?: string[]): Promise<string> {
    // Ensure we're initialized
    if (!this.initialized || !this.session) {
      await this.initialize(this.config);
    }

    if (!this.session) {
      throw new Error('Failed to create Chrome AI session');
    }

    try {
      // Build the prompt with optional context
      let prompt = message;
      if (context && context.length > 0) {
        prompt = `Context:\n${context.join('\n\n')}\n\nUser: ${message}`;
      }

      // Get response from Chrome AI
      // Latest API (Chrome 141+) simplified the prompt method
      const response = await this.session.prompt(prompt);

      return response;
    } catch (error) {
      throw new Error(
        `Chrome AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate embeddings - NOT SUPPORTED
   *
   * Chrome AI does not support embeddings generation.
   * Use Transformers.js for embeddings (see Task #26).
   *
   * @throws Error always, as embeddings are not supported
   */
  async embed(_text: string): Promise<number[]> {
    throw new Error(
      'ChromeAIProvider does not support embeddings. Use the browser embeddings system (Transformers.js) instead.'
    );
  }

  /**
   * Clean up the Chrome AI session
   *
   * Destroys the active session and resets state.
   */
  async dispose(): Promise<void> {
    if (this.session && 'destroy' in this.session) {
      this.session.destroy?.();
    }
    this.session = null;
    this.initialized = false;
    this.config = undefined;

    console.log(`${this.name} disposed`);
  }
}
