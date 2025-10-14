/**
 * Tests for AI Health Monitor
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HealthMonitor, healthMonitor } from '../health-monitor';
import type { AIProvider, ProviderHealth } from '../types';

// Mock AI Provider
class MockProvider implements AIProvider {
  name = 'MockProvider';
  type = 'local' as const;
  requiresApiKey = false;
  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  healthCheckFn = vi.fn();

  async chat(_message: string, _context?: string[]): Promise<string> {
    return `Mock response`;
  }

  async embed(_text: string): Promise<number[]> {
    return new Array(384).fill(0.5);
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async dispose(): Promise<void> {
    return Promise.resolve();
  }

  async healthCheck(): Promise<ProviderHealth> {
    return this.healthCheckFn();
  }
}

describe('HealthMonitor', () => {
  let monitor: HealthMonitor;
  let provider: MockProvider;

  beforeEach(() => {
    vi.useFakeTimers();
    monitor = new HealthMonitor();
    provider = new MockProvider();
  });

  afterEach(() => {
    monitor.stopMonitoring();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create monitor with default options', () => {
      const mon = new HealthMonitor();
      expect(mon.getStatus().status).toBe('unavailable');
      expect(mon.isMonitoring()).toBe(false);
    });

    it('should accept custom options', () => {
      const onStatusChange = vi.fn();
      const mon = new HealthMonitor({
        checkIntervalMs: 5000,
        maxCheckHistory: 50,
        failureThreshold: 5,
        onStatusChange,
      });
      expect(mon).toBeDefined();
    });
  });

  describe('startMonitoring', () => {
    it('should start monitoring with initial check', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 60000);

      // Wait for initial check
      await vi.advanceTimersByTimeAsync(0);

      expect(provider.healthCheckFn).toHaveBeenCalledTimes(1);
      expect(monitor.isMonitoring()).toBe(true);
      expect(monitor.getStatus().provider).toBe('MockProvider');
    });

    it('should perform periodic checks', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 10000);

      // Initial check
      await vi.advanceTimersByTimeAsync(0);
      expect(provider.healthCheckFn).toHaveBeenCalledTimes(1);

      // First periodic check
      await vi.advanceTimersByTimeAsync(10000);
      expect(provider.healthCheckFn).toHaveBeenCalledTimes(2);

      // Second periodic check
      await vi.advanceTimersByTimeAsync(10000);
      expect(provider.healthCheckFn).toHaveBeenCalledTimes(3);
    });

    it('should stop previous monitoring when starting new', async () => {
      const provider2 = new MockProvider();
      provider2.name = 'MockProvider2';

      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      provider2.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 10000);
      await vi.advanceTimersByTimeAsync(0);

      monitor.startMonitoring(provider2 as AIProvider, 10000);
      await vi.advanceTimersByTimeAsync(0);

      expect(monitor.getStatus().provider).toBe('MockProvider2');
    });
  });

  describe('stopMonitoring', () => {
    it('should stop periodic checks', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 10000);
      await vi.advanceTimersByTimeAsync(0);

      monitor.stopMonitoring();

      // No more checks after stopping
      await vi.advanceTimersByTimeAsync(10000);
      expect(provider.healthCheckFn).toHaveBeenCalledTimes(1); // Only initial check
      expect(monitor.isMonitoring()).toBe(false);
    });
  });

  describe('health check results', () => {
    it('should mark as healthy when provider is available', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const status = monitor.getStatus();
      expect(status.status).toBe('healthy');
      expect(status.consecutiveFailures).toBe(0);
    });

    it('should mark as degraded after first failure', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: false,
        status: 'error',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const status = monitor.getStatus();
      expect(status.status).toBe('degraded');
      expect(status.consecutiveFailures).toBe(1);
    });

    it('should mark as unavailable after threshold failures', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: false,
        status: 'error',
        lastChecked: new Date(),
      });

      monitor = new HealthMonitor({ failureThreshold: 3 });
      monitor.startMonitoring(provider as AIProvider, 1000);

      // Initial check
      await vi.advanceTimersByTimeAsync(0);
      expect(monitor.getStatus().status).toBe('degraded');

      // Second failure
      await vi.advanceTimersByTimeAsync(1000);
      expect(monitor.getStatus().status).toBe('degraded');

      // Third failure - should be unavailable
      await vi.advanceTimersByTimeAsync(1000);
      expect(monitor.getStatus().status).toBe('unavailable');
    });

    it('should reset consecutive failures on success', async () => {
      provider.healthCheckFn
        .mockResolvedValueOnce({
          available: false,
          status: 'error',
          lastChecked: new Date(),
        })
        .mockResolvedValue({
          available: true,
          status: 'ready',
          lastChecked: new Date(),
        });

      monitor.startMonitoring(provider as AIProvider, 1000);

      // First check fails
      await vi.advanceTimersByTimeAsync(0);
      expect(monitor.getStatus().consecutiveFailures).toBe(1);

      // Second check succeeds
      await vi.advanceTimersByTimeAsync(1000);
      expect(monitor.getStatus().consecutiveFailures).toBe(0);
      expect(monitor.getStatus().status).toBe('healthy');
    });

    it('should handle health check exceptions', async () => {
      provider.healthCheckFn.mockRejectedValue(new Error('Network error'));

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const status = monitor.getStatus();
      expect(status.status).toBe('degraded');
      expect(status.consecutiveFailures).toBe(1);
    });
  });

  describe('uptime calculation', () => {
    it('should start at 100%', () => {
      expect(monitor.getUptime()).toBe(100);
    });

    it('should calculate uptime from checks', async () => {
      provider.healthCheckFn
        .mockResolvedValueOnce({
          available: true,
          status: 'ready',
          lastChecked: new Date(),
        })
        .mockResolvedValueOnce({
          available: false,
          status: 'error',
          lastChecked: new Date(),
        })
        .mockResolvedValueOnce({
          available: true,
          status: 'ready',
          lastChecked: new Date(),
        })
        .mockResolvedValueOnce({
          available: true,
          status: 'ready',
          lastChecked: new Date(),
        });

      monitor.startMonitoring(provider as AIProvider, 1000);

      // 4 checks: 3 success, 1 failure = 75%
      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(1000);

      expect(monitor.getUptime()).toBe(75);
    });

    it('should limit history for uptime calculation', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor = new HealthMonitor({ maxCheckHistory: 5 });
      monitor.startMonitoring(provider as AIProvider, 100);

      // Perform 10 checks
      for (let i = 0; i < 10; i++) {
        await vi.advanceTimersByTimeAsync(100);
      }

      // Only last 5 checks should be kept
      const history = monitor.getCheckHistory();
      expect(history.length).toBe(5);
    });
  });

  describe('getStatus', () => {
    it('should return copy of status', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const status1 = monitor.getStatus();
      const status2 = monitor.getStatus();

      expect(status1).toEqual(status2);
      expect(status1).not.toBe(status2); // Different objects
    });

    it('should include all status fields', async () => {
      const status = monitor.getStatus();

      expect(status).toHaveProperty('provider');
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('lastCheck');
      expect(status).toHaveProperty('consecutiveFailures');
      expect(status).toHaveProperty('uptime');
    });
  });

  describe('getCheckHistory', () => {
    it('should return copy of history', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const history1 = monitor.getCheckHistory();
      const history2 = monitor.getCheckHistory();

      expect(history1).toEqual(history2);
      expect(history1).not.toBe(history2); // Different arrays
    });
  });

  describe('checkNow', () => {
    it('should perform immediate check', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 60000);
      await vi.advanceTimersByTimeAsync(0);

      provider.healthCheckFn.mockClear();

      await monitor.checkNow();

      expect(provider.healthCheckFn).toHaveBeenCalledTimes(1);
    });

    it('should return updated status', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      const status = await monitor.checkNow();
      expect(status.status).toBe('healthy');
    });
  });

  describe('reset', () => {
    it('should reset state', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: false,
        status: 'error',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      monitor.reset();

      const status = monitor.getStatus();
      expect(status.consecutiveFailures).toBe(0);
      expect(status.uptime).toBe(100);
      expect(monitor.getCheckHistory()).toEqual([]);
    });
  });

  describe('status helpers', () => {
    it('isHealthy should return correct value', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      expect(monitor.isHealthy()).toBe(true);
      expect(monitor.isDegraded()).toBe(false);
      expect(monitor.isUnavailable()).toBe(false);
    });

    it('isDegraded should return correct value', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: false,
        status: 'error',
        lastChecked: new Date(),
      });

      monitor = new HealthMonitor({ failureThreshold: 5 });
      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      expect(monitor.isHealthy()).toBe(false);
      expect(monitor.isDegraded()).toBe(true);
      expect(monitor.isUnavailable()).toBe(false);
    });

    it('isUnavailable should return correct value', async () => {
      provider.healthCheckFn.mockResolvedValue({
        available: false,
        status: 'error',
        lastChecked: new Date(),
      });

      monitor = new HealthMonitor({ failureThreshold: 1 });
      monitor.startMonitoring(provider as AIProvider);
      await vi.advanceTimersByTimeAsync(0);

      expect(monitor.isHealthy()).toBe(false);
      expect(monitor.isDegraded()).toBe(false);
      expect(monitor.isUnavailable()).toBe(true);
    });
  });

  describe('onStatusChange callback', () => {
    it('should call callback when status changes', async () => {
      const onStatusChange = vi.fn();
      monitor = new HealthMonitor({ onStatusChange });

      provider.healthCheckFn
        .mockResolvedValueOnce({
          available: true,
          status: 'ready',
          lastChecked: new Date(),
        })
        .mockResolvedValueOnce({
          available: false,
          status: 'error',
          lastChecked: new Date(),
        });

      monitor.startMonitoring(provider as AIProvider, 1000);

      // Initial check - unavailable -> healthy
      await vi.advanceTimersByTimeAsync(0);
      expect(onStatusChange).toHaveBeenCalledTimes(1);
      expect(onStatusChange).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'healthy' })
      );

      // Second check - healthy -> degraded
      await vi.advanceTimersByTimeAsync(1000);
      expect(onStatusChange).toHaveBeenCalledTimes(2);
      expect(onStatusChange).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'degraded' })
      );
    });

    it('should not call callback when status stays same', async () => {
      const onStatusChange = vi.fn();
      monitor = new HealthMonitor({ onStatusChange });

      provider.healthCheckFn.mockResolvedValue({
        available: true,
        status: 'ready',
        lastChecked: new Date(),
      });

      monitor.startMonitoring(provider as AIProvider, 1000);

      await vi.advanceTimersByTimeAsync(0);
      expect(onStatusChange).toHaveBeenCalledTimes(1);

      onStatusChange.mockClear();

      // Status remains healthy
      await vi.advanceTimersByTimeAsync(1000);
      expect(onStatusChange).not.toHaveBeenCalled();
    });
  });
});

describe('healthMonitor singleton', () => {
  it('should export default instance', () => {
    expect(healthMonitor).toBeInstanceOf(HealthMonitor);
  });
});
