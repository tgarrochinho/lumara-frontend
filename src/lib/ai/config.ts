/**
 * AI Provider Configuration
 *
 * Centralized configuration for AI providers.
 * This ensures consistent API key handling across the app.
 */

/**
 * Get the configured AI provider configuration
 *
 * @returns Provider configuration including API key
 * @throws Error if API key is not configured
 */
export function getProviderConfig() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file. ' +
      'Get your API key from: https://aistudio.google.com/apikey'
    );
  }

  return {
    provider: 'gemini' as const,
    apiKey,
    systemPrompt: 'You are Lumara, a personal memory assistant. When the user shares information, give brief, warm acknowledgments (1-2 sentences). When answering questions, prioritize using the user\'s saved memories provided in context. Give comprehensive, detailed answers based on their memories. If memories are provided, reference them directly and build upon them.',
    temperature: 0.7,
    maxTokens: 200, // Default, will be adjusted based on message type
  };
}
