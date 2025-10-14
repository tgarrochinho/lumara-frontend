/**
 * useAIStatus Hook
 *
 * Provides reactive AI system status management including:
 * - Provider initialization state
 * - Embeddings model loading progress
 * - Health monitoring
 * - Error handling and retry logic
 */

import { useState, useEffect, useCallback } from 'react';
import { selectProvider } from '@/lib/ai/registry';
import type { AIProvider } from '@/lib/ai/types';
import { embeddingsService } from '@/lib/ai/embeddings/transformers';
import { HealthMonitor } from '@/lib/ai/health-monitor';
import { errorHandler } from '@/lib/ai/error-handler';
import type { HealthStatus } from '@/lib/ai/health-monitor';

/**
 * AI system status states
 */
export type AIStatus =
  | 'uninitialized' // Not yet started
  | 'initializing' // Loading provider and models
  | 'ready' // Fully operational
  | 'error' // Failed to initialize
  | 'degraded'; // Running but with issues

/**
 * Return type for useAIStatus hook
 */
export interface UseAIStatusResult {
  /** Current AI system status */
  status: AIStatus;

  /** Active AI provider (null if not initialized) */
  provider: AIProvider | null;

  /** Error if initialization failed (null otherwise) */
  error: Error | null;

  /** Download/initialization progress (0-100) */
  progress: number;

  /** Current progress message */
  progressMessage: string;

  /** Health status from monitoring */
  health: HealthStatus | null;

  /** Initialize the AI system */
  initialize: () => Promise<void>;

  /** Retry after error */
  retry: () => Promise<void>;

  /** Check if AI is ready to use */
  isReady: boolean;

  /** Check if AI is currently loading */
  isLoading: boolean;
}

/**
 * Hook for managing AI system status and initialization
 *
 * Automatically initializes the AI system on mount and provides
 * reactive status updates, progress tracking, and error handling.
 *
 * @param autoInitialize - Whether to automatically initialize on mount (default: true)
 * @returns AI status and control functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { status, progress, error, retry } = useAIStatus();
 *
 *   if (status === 'initializing') {
 *     return <LoadingSpinner progress={progress} />;
 *   }
 *
 *   if (status === 'error') {
 *     return <ErrorMessage error={error} onRetry={retry} />;
 *   }
 *
 *   return <AIFeature />;
 * }
 * ```
 */
export function useAIStatus(autoInitialize: boolean = true): UseAIStatusResult {
  const [status, setStatus] = useState<AIStatus>('uninitialized');
  const [provider, setProvider] = useState<AIProvider | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [monitor] = useState(() => new HealthMonitor({
    checkIntervalMs: 60000,
    onStatusChange: (newHealth: HealthStatus) => {
      setHealth(newHealth);

      // Update status based on health
      if (newHealth.status === 'degraded') {
        setStatus('degraded');
      } else if (newHealth.status === 'unavailable') {
        setStatus('error');
        setError(new Error(newHealth.message || 'AI provider unavailable'));
      }
    },
  }));

  /**
   * Update progress with message
   */
  const updateProgress = useCallback((prog: number, message?: string) => {
    setProgress(Math.min(100, Math.max(0, prog)));
    if (message) {
      setProgressMessage(message);
    }
  }, []);

  /**
   * Initialize the AI system
   */
  const initialize = useCallback(async () => {
    setStatus('initializing');
    setError(null);
    setProgress(0);
    setProgressMessage('Starting AI initialization...');

    try {
      // Step 1: Select and initialize provider (20% of progress)
      updateProgress(0, 'Selecting AI provider...');
      const aiProvider = await selectProvider('chrome-ai');
      updateProgress(20, `Connected to ${aiProvider.name}`);

      // Step 2: Initialize embeddings with progress tracking (20% -> 90%)
      updateProgress(20, 'Loading embedding models...');

      await embeddingsService.initialize((prog, msg) => {
        // Map 0-100% of embeddings to 20-90% of total progress
        const totalProgress = 20 + (prog * 0.7);
        updateProgress(totalProgress, msg || 'Loading models...');
      });

      updateProgress(90, 'Starting health monitoring...');

      // Step 3: Start health monitoring
      monitor.startMonitoring(aiProvider);

      // Get initial health status
      const initialHealth = monitor.getStatus();
      setHealth(initialHealth);

      // Step 4: Complete
      setProvider(aiProvider);
      setStatus('ready');
      setProgress(100);
      setProgressMessage('AI system ready');

      if (import.meta.env.DEV) {
        console.log('[useAIStatus] Initialization complete');
      }
    } catch (err) {
      const handledError = errorHandler.handle(err as Error, 'useAIStatus.initialize');
      setError(handledError);
      setStatus('error');
      setProgressMessage('Initialization failed');

      if (import.meta.env.DEV) {
        console.error('[useAIStatus] Initialization failed:', handledError);
      }
    }
  }, [updateProgress, monitor]);

  /**
   * Retry after error
   */
  const retry = useCallback(async () => {
    if (import.meta.env.DEV) {
      console.log('[useAIStatus] Retrying initialization...');
    }
    await initialize();
  }, [initialize]);

  /**
   * Auto-initialize on mount
   */
  useEffect(() => {
    if (autoInitialize && status === 'uninitialized') {
      initialize();
    }
  }, [autoInitialize, initialize, status]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      monitor.stopMonitoring();
      if (provider) {
        provider.dispose();
      }
    };
  }, [provider, monitor]);

  return {
    status,
    provider,
    error,
    progress,
    progressMessage,
    health,
    initialize,
    retry,
    isReady: status === 'ready',
    isLoading: status === 'initializing',
  };
}
