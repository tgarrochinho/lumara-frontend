/**
 * AI Error Handling
 *
 * Provides comprehensive error handling for the AI system including:
 * - Custom error types with detailed context
 * - Retry logic with exponential backoff
 * - User-friendly error messages
 * - Development vs production logging
 */

/**
 * Base error class for all AI-related errors
 */
export class AIError extends Error {
  code: string;
  recoverable: boolean;
  cause?: Error;

  constructor(
    message: string,
    code: string,
    recoverable: boolean = false,
    cause?: Error
  ) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.recoverable = recoverable;
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AIError);
    }
  }
}

/**
 * Error thrown when an AI provider is not available
 */
export class ProviderUnavailableError extends AIError {
  constructor(providerName: string, cause?: Error) {
    super(
      `AI provider "${providerName}" is not available`,
      'PROVIDER_UNAVAILABLE',
      true,
      cause
    );
    this.name = 'ProviderUnavailableError';
  }
}

/**
 * Error thrown when a model fails to load
 */
export class ModelLoadError extends AIError {
  constructor(modelName: string, cause?: Error) {
    super(
      `Failed to load model "${modelName}"`,
      'MODEL_LOAD_FAILED',
      true,
      cause
    );
    this.name = 'ModelLoadError';
  }
}

/**
 * Error thrown when embedding generation fails
 */
export class EmbeddingError extends AIError {
  constructor(message: string, cause?: Error) {
    super(
      `Embedding generation failed: ${message}`,
      'EMBEDDING_FAILED',
      true,
      cause
    );
    this.name = 'EmbeddingError';
  }
}

/**
 * Error thrown when network operations fail
 */
export class NetworkError extends AIError {
  constructor(message: string, cause?: Error) {
    super(
      `Network error: ${message}`,
      'NETWORK_ERROR',
      true,
      cause
    );
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when a chat operation fails
 */
export class ChatError extends AIError {
  constructor(message: string, cause?: Error) {
    super(
      `Chat error: ${message}`,
      'CHAT_FAILED',
      true,
      cause
    );
    this.name = 'ChatError';
  }
}

/**
 * Error thrown when initialization fails
 */
export class InitializationError extends AIError {
  constructor(component: string, cause?: Error) {
    super(
      `Failed to initialize ${component}`,
      'INITIALIZATION_FAILED',
      false,
      cause
    );
    this.name = 'InitializationError';
  }
}

/**
 * Error thrown when a required dependency is not available
 */
export class DependencyError extends AIError {
  constructor(dependency: string, cause?: Error) {
    super(
      `Required dependency not available: ${dependency}`,
      'DEPENDENCY_UNAVAILABLE',
      false,
      cause
    );
    this.name = 'DependencyError';
  }
}

/**
 * Configuration options for retry logic
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts?: number;

  /** Initial delay in milliseconds before first retry */
  delayMs?: number;

  /** Multiplier for exponential backoff (delay *= backoffMultiplier after each attempt) */
  backoffMultiplier?: number;

  /** Maximum delay in milliseconds (caps exponential growth) */
  maxDelayMs?: number;

  /** Custom function to determine if an error should trigger a retry */
  shouldRetry?: (error: Error) => boolean;

  /** Callback invoked before each retry attempt */
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Default retry predicate - determines which errors are retryable
 */
const defaultShouldRetry = (error: Error): boolean => {
  // Retry on transient failures
  if (error instanceof NetworkError) return true;
  if (error instanceof ModelLoadError) return true;
  if (error instanceof EmbeddingError) return true;
  if (error instanceof ChatError) return true;

  // Don't retry on initialization or dependency errors (likely permanent)
  if (error instanceof InitializationError) return false;
  if (error instanceof DependencyError) return false;

  // Check if error is marked as recoverable
  if (error instanceof AIError) {
    return error.recoverable;
  }

  // Default: don't retry unknown errors
  return false;
};

/**
 * Executes a function with automatic retry logic and exponential backoff
 *
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the function
 * @throws The last error if all retry attempts fail
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => generateEmbedding(text),
 *   { maxAttempts: 3, delayMs: 1000 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    maxDelayMs = 10000,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = options;

  let lastError: Error;
  let delay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      const isLastAttempt = attempt === maxAttempts;
      const shouldAttemptRetry = !isLastAttempt && shouldRetry(lastError);

      if (!shouldAttemptRetry) {
        throw lastError;
      }

      // Invoke retry callback if provided
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Log retry in development mode
      if (import.meta.env.DEV) {
        console.warn(
          `[AI Retry] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`,
          lastError
        );
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelayMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}

/**
 * Centralized error handler for the AI system
 *
 * Provides:
 * - Error categorization and conversion
 * - Development/production logging
 * - User-friendly error messages
 * - Support information
 */
export class AIErrorHandler {
  private static instance: AIErrorHandler;

  private constructor() {}

  /**
   * Get the singleton instance of the error handler
   */
  static getInstance(): AIErrorHandler {
    if (!this.instance) {
      this.instance = new AIErrorHandler();
    }
    return this.instance;
  }

  /**
   * Handle an error and convert it to an AIError
   *
   * @param error - The error to handle
   * @param context - Optional context about where the error occurred
   * @returns A properly typed AIError
   */
  handle(error: Error, context?: string): AIError {
    // Log error (dev mode only)
    if (import.meta.env.DEV) {
      console.error(`[AI Error${context ? ` - ${context}` : ''}]:`, error);
      if (error instanceof AIError && error.cause) {
        console.error('Caused by:', error.cause);
      }
    }

    // Return if already an AIError
    if (error instanceof AIError) {
      return error;
    }

    // Categorize and convert to AIError based on message content
    const message = error.message.toLowerCase();

    // Provider availability errors
    if (message.includes('chrome ai not available') ||
        message.includes('provider') && message.includes('not available')) {
      return new ProviderUnavailableError('Chrome AI', error);
    }

    // Chat errors (check before network errors to avoid false positives)
    if (message.includes('chat') ||
        message.includes('completion')) {
      return new ChatError(error.message, error);
    }

    // Embedding errors (check before model errors)
    if (message.includes('embedding') ||
        message.includes('tokenize') ||
        message.includes('pipeline')) {
      return new EmbeddingError(error.message, error);
    }

    // Model loading errors
    if (message.includes('model') ||
        message.includes('load') ||
        message.includes('download')) {
      return new ModelLoadError('unknown', error);
    }

    // Network errors (check after more specific errors)
    if (message.includes('network') ||
        message.includes('fetch') ||
        message.includes('timeout') ||
        message.includes('connection')) {
      return new NetworkError(error.message, error);
    }

    // Initialization errors
    if (message.includes('initialize') ||
        message.includes('setup') ||
        message.includes('config')) {
      return new InitializationError('AI system', error);
    }

    // Generic AI error
    return new AIError(
      error.message || 'Unknown AI error',
      'UNKNOWN',
      false,
      error
    );
  }

  /**
   * Get a user-friendly error message suitable for display in the UI
   *
   * @param error - The AIError to get a message for
   * @returns A user-friendly error message
   */
  getUserMessage(error: AIError): string {
    switch (error.code) {
      case 'PROVIDER_UNAVAILABLE':
        return 'AI is currently unavailable. Please check that you are using Chrome Canary/Dev with the Prompt API enabled.';

      case 'MODEL_LOAD_FAILED':
        return 'Failed to download AI models. Please check your internet connection and try again.';

      case 'EMBEDDING_FAILED':
        return 'Could not process your text. Please try again.';

      case 'NETWORK_ERROR':
        return 'Network connection issue. Please check your internet connection.';

      case 'CHAT_FAILED':
        return 'Unable to generate a response. Please try again.';

      case 'INITIALIZATION_FAILED':
        return 'Failed to start the AI system. Please refresh the page and try again.';

      case 'DEPENDENCY_UNAVAILABLE':
        return 'Required AI components are not available. Please ensure you are using a supported browser.';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get technical support information for the error
   *
   * @param error - The AIError to get support info for
   * @returns Support information string
   */
  getSupportInfo(error: AIError): string {
    const lines = [
      `Error Code: ${error.code}`,
      `Recoverable: ${error.recoverable}`,
      `Error Type: ${error.name}`,
    ];

    if (import.meta.env.DEV && error.cause) {
      lines.push(`Cause: ${error.cause.message}`);
    }

    lines.push('');
    lines.push('For support: https://github.com/yourusername/lumara/issues');

    return lines.join('\n');
  }

  /**
   * Check if an error is recoverable and can be retried
   *
   * @param error - The error to check
   * @returns True if the error is recoverable
   */
  isRecoverable(error: Error): boolean {
    if (error instanceof AIError) {
      return error.recoverable;
    }
    return false;
  }
}

/**
 * Singleton instance of the error handler
 */
export const errorHandler = AIErrorHandler.getInstance();
