/**
 * AI Provider System
 *
 * Main entry point for the AI provider abstraction layer.
 * Exports all public types, interfaces, and functions.
 */

// Core types and interfaces
export type {
  AIProvider,
  AICapabilities,
  ProviderConfig,
  ProviderHealth,
  ProviderType,
} from './types';

export {
  NoProviderAvailableError,
  ProviderInitializationError,
} from './types';

// Base provider class for extending
export { BaseProvider } from './providers/base';

// Concrete provider implementations
export { ChromeAIProvider } from './providers/chrome-ai';

// Registry and provider selection
export {
  providerRegistry,
  selectProvider,
  getAvailableProviders,
  checkProviderAvailability,
  createProvider,
  type RegisteredProvider,
} from './registry';

// Error handling
export {
  AIError,
  ProviderUnavailableError,
  ModelLoadError,
  EmbeddingError,
  NetworkError,
  ChatError,
  InitializationError,
  DependencyError,
  withRetry,
  AIErrorHandler,
  errorHandler,
  type RetryOptions,
} from './error-handler';

// Health monitoring
export {
  HealthMonitor,
  healthMonitor,
  type HealthStatus,
  type HealthMonitorOptions,
} from './health-monitor';
