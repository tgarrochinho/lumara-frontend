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
  var LanguageModel: {
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
  language?: string; // Output language code: 'en', 'es', 'ja'
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
    streaming: true, // Now supported via promptStreaming
    multimodal: false,
  };

  /** The active Chrome AI session (Chrome 141+ API) */
  private session: AITextSession | AILanguageModel | null = null;

  /** Download progress callback (reserved for future use when Chrome exposes progress events) */
  // @ts-expect-error - Reserved for future API support
  private downloadProgressCallback?: (loaded: number, total: number) => void;

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
      // Check for secure context (HTTPS required)
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        throw new Error(
          'Chrome AI requires a secure context (HTTPS). Please access this page over HTTPS.'
        );
      }

      // Only use Chrome 141+ global LanguageModel API
      if (typeof globalThis.LanguageModel === 'undefined' || !globalThis.LanguageModel) {
        throw new Error(
          'Chrome AI global LanguageModel API not found. ' +
          'This app requires Chrome 141+ with the latest Gemini Nano API. ' +
          'Please update Chrome and enable chrome://flags/#prompt-api-for-gemini-nano'
        );
      }

      // Check availability
      const availability = await globalThis.LanguageModel.availability();

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
      const modelOptions: AILanguageModelCreateOptions = {
        // Always specify output language (required for optimal quality)
        language: 'en', // Default to English
      };

      // Chrome AI requires both topK and temperature, or neither
      if (config?.temperature !== undefined && config?.topK !== undefined) {
        modelOptions.temperature = config.temperature;
        modelOptions.topK = config.topK;
      }

      // Add system prompt if provided (supported in Chrome 141+)
      if ((config as any)?.systemPrompt) {
        modelOptions.systemPrompt = (config as any).systemPrompt;
      }

      this.session = await globalThis.LanguageModel.create(modelOptions);
      this.initialized = true;
      this.config = config;
    } catch (error) {
      this.initialized = false;
      throw new ProviderInitializationError(this.name, error);
    }
  }

  /**
   * Enhanced health check for Chrome AI
   *
   * Checks both initialization status and API availability.
   * Only supports Chrome 141+ global LanguageModel API.
   *
   * @returns Current health status
   */
  async healthCheck(): Promise<ProviderHealth> {
    const now = new Date();

    // Check for secure context
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      return {
        available: false,
        status: 'unavailable',
        message: 'Chrome AI requires HTTPS (secure context).',
        lastChecked: now,
      };
    }

    try {
      // Only check Chrome 141+ global API
      if (typeof globalThis.LanguageModel === 'undefined' || !globalThis.LanguageModel) {
        return {
          available: false,
          status: 'unavailable',
          message: 'Chrome AI global LanguageModel API not found. Requires Chrome 141+.',
          lastChecked: now,
        };
      }

      const availability = await globalThis.LanguageModel.availability();

      // Check availability status
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
        message: 'Chrome AI is ready (Chrome 141+)',
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
   * Chat with Chrome AI using streaming
   *
   * Streams the response token by token for better UX.
   *
   * @param message - The user's message
   * @param context - Optional context to include in the prompt
   * @returns AsyncIterable that yields response chunks
   * @throws Error if not initialized or if streaming is not supported
   */
  async *chatStream(message: string, context?: string[]): AsyncIterable<string> {
    // Ensure we're initialized
    if (!this.initialized || !this.session) {
      await this.initialize(this.config);
    }

    if (!this.session) {
      throw new Error('Failed to create Chrome AI session');
    }

    // Check if streaming is supported
    if (!this.session.promptStreaming) {
      throw new Error('Streaming is not supported by this Chrome AI API version');
    }

    try {
      // Build the prompt with optional context
      let prompt = message;
      if (context && context.length > 0) {
        prompt = `Context:\n${context.join('\n\n')}\n\nUser: ${message}`;
      }

      // Stream response from Chrome AI
      const stream = this.session.promptStreaming(prompt);

      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      throw new Error(
        `Chrome AI streaming chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
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
   * Set a callback to monitor model download progress
   *
   * Note: Chrome AI doesn't expose direct download progress.
   * This is a placeholder for future API support.
   *
   * @param callback - Function called with (loaded, total) bytes
   */
  setDownloadProgressCallback(callback: (loaded: number, total: number) => void): void {
    this.downloadProgressCallback = callback;
  }

  /**
   * Trigger model download if needed
   *
   * Attempts to download the Chrome AI model if it's not available.
   * This will throw if the model status is 'no' (not supported).
   * Only supports Chrome 141+ global LanguageModel API.
   *
   * @returns Status after attempting download
   */
  async downloadModel(): Promise<'readily' | 'after-download' | 'no'> {
    try {
      // Only use Chrome 141+ global API
      if (typeof globalThis.LanguageModel === 'undefined' || !globalThis.LanguageModel) {
        throw new Error('Chrome AI global LanguageModel API not found. Requires Chrome 141+.');
      }

      const availability = await globalThis.LanguageModel.availability();

      if (availability === 'after-download') {
        // Creating a session triggers the download
        const session = await globalThis.LanguageModel.create();
        session.destroy?.();
        return 'readily';
      }

      return availability;
    } catch (error) {
      console.error('[ChromeAI] Download model failed:', error);
      throw error;
    }
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
    this.downloadProgressCallback = undefined;
  }
}
