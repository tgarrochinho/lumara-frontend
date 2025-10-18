/**
 * Gemini API Provider (Google AI Studio)
 *
 * Implementation of AIProvider using Google's Gemini API.
 * Supports chat, streaming, and follows instructions better than Chrome's local Nano model.
 */

import { GoogleGenAI } from '@google/genai';
import { BaseProvider } from './base';
import type { AICapabilities, ProviderConfig, ProviderHealth } from '../types';
import { ProviderInitializationError } from '../types';

/**
 * Gemini AI Provider implementation using Google AI Studio API
 *
 * This provider uses Google's cloud-based Gemini models which follow
 * instructions more reliably than the local Chrome AI.
 *
 * Capabilities:
 * - Chat: Yes (via Gemini Flash/Pro)
 * - Embeddings: Yes (via text-embedding model)
 * - Streaming: Yes (native support)
 * - Multimodal: Yes (can handle images, audio, etc.)
 */
export class GeminiProvider extends BaseProvider {
  readonly name = 'Gemini (Google AI)';
  readonly type = 'cloud' as const;
  readonly requiresApiKey = true;

  capabilities: AICapabilities = {
    chat: true,
    embeddings: true,
    streaming: true,
    multimodal: true,
  };

  private client: GoogleGenAI | null = null;
  private modelName = 'gemini-2.5-flash-lite'; // Fast, lightweight model

  /**
   * Constructor - No parameters required
   * API key should be provided via initialize() method
   */
  constructor() {
    super();
  }

  /**
   * Initialize the Gemini provider
   *
   * @param config - Configuration including API key (required)
   * @throws Error if API key is missing or invalid
   */
  async initialize(config?: ProviderConfig): Promise<void> {
    try {
      const apiKey = config?.apiKey;

      if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('Gemini API key is required. Get one from https://aistudio.google.com/apikey');
      }

      // Initialize Google GenAI client
      this.client = new GoogleGenAI({ apiKey });

      // Use custom model if specified
      if (config?.modelName) {
        this.modelName = config.modelName;
      }

      this.initialized = true;
      this.config = config;
    } catch (error) {
      this.initialized = false;
      throw new ProviderInitializationError(this.name, error);
    }
  }

  /**
   * Health check for Gemini API
   *
   * @returns Current health status
   */
  async healthCheck(): Promise<ProviderHealth> {
    const now = new Date();

    if (!this.initialized || !this.client) {
      return {
        available: false,
        status: 'unavailable',
        message: 'Gemini provider not initialized. Call initialize() with API key.',
        lastChecked: now,
      };
    }

    // Gemini API doesn't have a health endpoint, so we just check if initialized
    return {
      available: true,
      status: 'ready',
      message: `Gemini API ready (${this.modelName})`,
      lastChecked: now,
    };
  }

  /**
   * Chat with Gemini
   *
   * @param message - The user's message
   * @param context - Optional context to include in the prompt
   * @returns The AI's response
   * @throws Error if not initialized or if the chat fails
   */
  async chat(message: string, context?: string[]): Promise<string> {
    if (!this.initialized || !this.client) {
      throw new Error('Gemini provider not initialized');
    }

    try {
      // Build prompt with context
      let prompt = '';

      if (context && context.length > 0) {
        prompt += `Context:\n${context.join('\n\n')}\n\n`;
      }

      prompt += `User: ${message}`;

      // Build request with system prompt
      const requestPayload: any = {
        model: this.modelName,
        contents: prompt,
      };

      // Add system instruction if provided
      if ((this.config as any)?.systemPrompt) {
        requestPayload.systemInstruction = (this.config as any).systemPrompt;
      }

      // Add generation config
      requestPayload.generationConfig = {
        temperature: this.config?.temperature ?? 0.7,
        maxOutputTokens: this.config?.maxTokens ?? 2048,
      };

      const response = await this.client.models.generateContent(requestPayload);
      return response.text || '';
    } catch (error) {
      throw new Error(
        `Gemini chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Chat with Gemini using streaming
   *
   * @param message - The user's message
   * @param context - Optional context to include in the prompt
   * @returns AsyncIterable that yields response chunks
   * @throws Error if not initialized or if streaming fails
   */
  async *chatStream(message: string, context?: string[]): AsyncIterable<string> {
    if (!this.initialized || !this.client) {
      throw new Error('Gemini provider not initialized');
    }

    try {
      // Build prompt with context
      let prompt = '';

      if (context && context.length > 0) {
        prompt += `Context:\n${context.join('\n\n')}\n\n`;
      }

      prompt += `User: ${message}`;

      // Build request with system prompt
      const requestPayload: any = {
        model: this.modelName,
        contents: prompt,
      };

      // Add system instruction if provided
      if ((this.config as any)?.systemPrompt) {
        requestPayload.systemInstruction = (this.config as any).systemPrompt;
      }

      // Add generation config
      requestPayload.generationConfig = {
        temperature: this.config?.temperature ?? 0.7,
        maxOutputTokens: this.config?.maxTokens ?? 2048,
      };

      // Use streaming API
      const stream = await this.client.models.generateContentStream(requestPayload);

      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      throw new Error(
        `Gemini streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate embeddings with Gemini
   *
   * @param text - The text to embed
   * @returns Vector representation of the text
   * @throws Error if not initialized or if embedding fails
   */
  async embed(text: string): Promise<number[]> {
    if (!this.initialized || !this.client) {
      throw new Error('Gemini provider not initialized');
    }

    try {
      const response = await this.client.models.embedContent({
        model: 'text-embedding-004',
        contents: text,
      });

      // ContentEmbedding has a 'values' property containing the number array
      return response.embeddings?.[0]?.values || [];
    } catch (error) {
      throw new Error(
        `Gemini embedding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clean up the Gemini client
   */
  async dispose(): Promise<void> {
    this.client = null;
    this.initialized = false;
    this.config = undefined;
  }
}
