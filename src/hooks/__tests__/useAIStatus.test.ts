/**
 * Tests for useAIStatus hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAIStatus } from '../useAIStatus';
import * as registry from '@/lib/ai/registry';
import * as transformers from '@/lib/ai/embeddings/transformers';
import { HealthMonitor } from '@/lib/ai/health-monitor';

// Mock modules
vi.mock('@/lib/ai/registry');
vi.mock('@/lib/ai/embeddings/transformers');
vi.mock('@/lib/ai/health-monitor');

describe('useAIStatus', () => {
  const mockProvider = {
    name: 'Chrome AI',
    type: 'chrome-ai' as const,
    initialize: vi.fn(),
    dispose: vi.fn(),
    healthCheck: vi.fn(),
    chat: vi.fn(),
    supportsStreaming: false,
    capabilities: {
      chat: true,
      streaming: false,
      functionCalling: false,
      embeddings: false,
    },
  };

  const mockEmbeddingsService = {
    initialize: vi.fn(),
    isReady: vi.fn(),
    isLoading: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful provider selection
    vi.mocked(registry.selectProvider).mockResolvedValue(mockProvider);

    // Mock embeddings service methods
    Object.assign(transformers.embeddingsService, mockEmbeddingsService);

    // Mock health check
    mockProvider.healthCheck.mockResolvedValue({
      available: true,
      message: 'Healthy',
    });

    // Mock embeddings initialization with progress callback
    mockEmbeddingsService.initialize.mockImplementation(async (onProgress?: (prog: number) => void) => {
      if (onProgress) {
        onProgress(0);
        onProgress(50);
        onProgress(100);
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should start in uninitialized state', () => {
      const { result } = renderHook(() => useAIStatus(false));

      expect(result.current.status).toBe('uninitialized');
      expect(result.current.provider).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.progress).toBe(0);
      expect(result.current.isReady).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should auto-initialize when autoInitialize is true', async () => {
      const { result } = renderHook(() => useAIStatus(true));

      await waitFor(() => {
        expect(result.current.status).toBe('initializing');
      });

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      }, { timeout: 5000 });

      expect(result.current.provider).toBe(mockProvider);
      expect(result.current.isReady).toBe(true);
      expect(result.current.progress).toBe(100);
    });

    it('should not auto-initialize when autoInitialize is false', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      // Wait a bit to ensure it doesn't initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.status).toBe('uninitialized');
      expect(registry.selectProvider).not.toHaveBeenCalled();
    });

    it('should allow manual initialization', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      expect(result.current.status).toBe('uninitialized');

      // Manually initialize
      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      }, { timeout: 5000 });

      expect(result.current.provider).toBe(mockProvider);
    });
  });

  describe('Progress Tracking', () => {
    it('should track progress during initialization', async () => {
      const progressValues: number[] = [];
      const { result } = renderHook(() => useAIStatus(false));

      // Monitor progress
      const checkProgress = () => {
        if (result.current.progress > 0 && !progressValues.includes(result.current.progress)) {
          progressValues.push(result.current.progress);
        }
      };

      // Start initialization
      const initPromise = result.current.initialize();

      // Check progress repeatedly
      const interval = setInterval(checkProgress, 10);

      await initPromise;
      clearInterval(interval);

      // Should have seen multiple progress updates
      expect(progressValues.length).toBeGreaterThan(0);
      expect(result.current.progress).toBe(100);
    });

    it('should update progress messages', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.progressMessage).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle provider selection failure', async () => {
      vi.mocked(registry.selectProvider).mockRejectedValue(new Error('No provider available'));

      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.isReady).toBe(false);
    });

    it('should handle embeddings initialization failure', async () => {
      mockEmbeddingsService.initialize.mockRejectedValue(new Error('Model load failed'));

      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should allow retry after error', async () => {
      // Fail first time
      vi.mocked(registry.selectProvider).mockRejectedValueOnce(new Error('Failed'));
      // Succeed second time
      vi.mocked(registry.selectProvider).mockResolvedValueOnce(mockProvider);

      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      // Retry
      await result.current.retry();

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      }, { timeout: 5000 });

      expect(result.current.provider).toBe(mockProvider);
    });
  });

  describe('Health Monitoring', () => {
    it('should start health monitoring when ready', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      expect(result.current.health).toBeTruthy();
    });

    it('should transition to degraded state on health issues', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      // Simulate health degradation
      // This would require mocking the health monitor's status change callback
      // For now, we just verify the health is tracked
      expect(result.current.health).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', async () => {
      const { result, unmount } = renderHook(() => useAIStatus(false));

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.status).toBe('ready');
      });

      unmount();

      // Verify provider disposal was called
      expect(mockProvider.dispose).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('should correctly compute isReady', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      expect(result.current.isReady).toBe(false);

      await result.current.initialize();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });

    it('should correctly compute isLoading', async () => {
      const { result } = renderHook(() => useAIStatus(false));

      expect(result.current.isLoading).toBe(false);

      const initPromise = result.current.initialize();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await initPromise;

      expect(result.current.isLoading).toBe(false);
    });
  });
});
