/**
 * AI Provider Registry
 *
 * Central registry for all AI providers. Handles provider selection,
 * initialization, and fallback logic.
 */

import type { AIProvider } from './types';
import { NoProviderAvailableError } from './types';
import { ChromeAIProvider } from './providers/chrome-ai';
import { GeminiProvider } from './providers/gemini';
import { MockAIProvider } from './providers/mock-ai';

/**
 * Registry of available provider implementations
 *
 * New providers can be added here as they are implemented.
 * Each key corresponds to a ProviderType and maps to a provider class constructor.
 *
 * When you specify a preferred provider, NO FALLBACK will occur by default.
 * Use allowFallback=true if you want automatic fallback behavior.
 */
export const providerRegistry = {
  'gemini': GeminiProvider, // Google Gemini API (cloud, requires API key)
  'chrome-ai': ChromeAIProvider, // Chrome 141+ with global LanguageModel API (local)
  'mock-ai': MockAIProvider, // Mock provider for development/testing
  // Future providers:
  // 'lm-studio': LMStudioProvider,
  // 'openai': OpenAIProvider,
  // 'claude': ClaudeProvider,
} as const;

/**
 * Type for provider class constructors
 */
type ProviderConstructor = new (...args: any[]) => AIProvider;

/**
 * Registry type derived from the actual registry object
 */
export type RegisteredProvider = keyof typeof providerRegistry;

/**
 * Select and initialize an AI provider
 *
 * This function tries to find an available provider using the following strategy:
 * 1. If a preferred provider is specified, ONLY try that provider (no fallback)
 * 2. If no preferred provider specified, try all registered providers in order
 * 3. Throw NoProviderAvailableError if no provider works
 *
 * @param preferredProvider - Optional preferred provider (if specified, no fallback will occur)
 * @param providerConfig - Configuration for the provider (API key, etc.)
 * @param allowFallback - If true and preferred provider fails, try others (default: false)
 * @returns An initialized and ready-to-use AI provider
 * @throws NoProviderAvailableError if no provider is available
 *
 * @example
 * ```typescript
 * // Try Gemini with API key
 * const provider = await selectProvider('gemini', { apiKey: 'your-key' });
 *
 * // Try Chrome AI (no API key needed)
 * const provider = await selectProvider('chrome-ai');
 * ```
 */
export async function selectProvider(
  preferredProvider?: RegisteredProvider,
  providerConfig?: any,
  allowFallback = false
): Promise<AIProvider> {
  const errors: Array<{ provider: string; error: unknown }> = [];

  // Strategy 1: Try preferred provider first
  if (preferredProvider && providerRegistry[preferredProvider]) {
    const result = await tryProvider(
      preferredProvider,
      providerRegistry[preferredProvider],
      providerConfig
    );
    if (result.success) {
      return result.provider;
    }
    errors.push({ provider: preferredProvider, error: result.error });

    // If preferred provider specified and fallback not allowed, fail immediately
    if (!allowFallback) {
      const error = result.error;
      const message = error instanceof Error ? error.message : String(error);
      throw new NoProviderAvailableError(
        `Preferred provider '${preferredProvider}' failed: ${message}`
      );
    }
  }

  // Strategy 2: Try all providers in order (only if no preferred provider or fallback allowed)
  const providerEntries = Object.entries(providerRegistry) as Array<[RegisteredProvider, ProviderConstructor]>;
  for (const [name, ProviderClass] of providerEntries) {
    // Skip if this was already tried as preferred provider
    if (name === preferredProvider) {
      continue;
    }

    const result = await tryProvider(name, ProviderClass, providerConfig);
    if (result.success) {
      return result.provider;
    }
    errors.push({ provider: name, error: result.error });
  }

  // No provider worked - throw detailed error
  const errorMessages = errors
    .map(({ provider, error }) => {
      const message = error instanceof Error ? error.message : String(error);
      return `  - ${provider}: ${message}`;
    })
    .join('\n');

  throw new NoProviderAvailableError(
    `No AI provider available. Tried ${errors.length} provider(s):\n${errorMessages}`
  );
}

/**
 * Try to initialize a specific provider
 *
 * @param name - Provider name for logging
 * @param ProviderClass - Provider class constructor
 * @param config - Configuration for the provider (e.g., API key for Gemini)
 * @returns Result object with success status
 */
async function tryProvider(
  name: string,
  ProviderClass: ProviderConstructor,
  config?: any
): Promise<
  | { success: true; provider: AIProvider }
  | { success: false; error: unknown }
> {
  try {
    // Create provider instance - pass API key to Gemini constructor
    let provider: AIProvider;
    if (name === 'gemini' && config?.apiKey) {
      provider = new ProviderClass(config.apiKey);
    } else {
      provider = new ProviderClass();
    }

    // Try to initialize with remaining config (systemPrompt, temperature, etc.)
    await provider.initialize(config);

    // Verify it's actually available via health check
    const health = await provider.healthCheck();
    if (!health.available) {
      await provider.dispose();
      return {
        success: false,
        error: new Error(`Provider not available: ${health.message || 'Unknown reason'}`),
      };
    }

    return { success: true, provider };
  } catch (error) {
    console.warn(`Provider ${name} failed initialization:`, error);
    return { success: false, error };
  }
}

/**
 * Get a list of all registered provider names
 *
 * @returns Array of provider names
 */
export function getAvailableProviders(): RegisteredProvider[] {
  return Object.keys(providerRegistry) as RegisteredProvider[];
}

/**
 * Check which providers are currently available without initializing them
 *
 * This is a quick check that doesn't fully initialize providers.
 * Useful for UI to show which providers might work.
 *
 * @returns Map of provider names to basic availability status
 */
export async function checkProviderAvailability(): Promise<
  Map<RegisteredProvider, boolean>
> {
  const availability = new Map<RegisteredProvider, boolean>();

  const providerEntries = Object.entries(providerRegistry) as Array<[RegisteredProvider, ProviderConstructor]>;
  for (const [name, ProviderClass] of providerEntries) {
    try {
      const provider = new ProviderClass();
      const health = await provider.healthCheck();
      availability.set(name, health.available);
      await provider.dispose();
    } catch {
      availability.set(name, false);
    }
  }

  return availability;
}

/**
 * Create a specific provider instance without automatic selection
 *
 * Useful when you want to manually handle provider initialization.
 *
 * @param providerName - Name of the provider to create
 * @returns New provider instance (not initialized)
 * @throws Error if provider name is not registered
 */
export function createProvider(providerName: RegisteredProvider): AIProvider {
  const ProviderClass = providerRegistry[providerName];
  if (!ProviderClass) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return new ProviderClass();
}
