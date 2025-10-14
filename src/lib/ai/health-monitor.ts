/**
 * AI Health Monitoring
 *
 * Provides continuous health monitoring for AI providers including:
 * - Periodic health checks
 * - Provider availability tracking
 * - Uptime calculation
 * - Degradation detection
 */

import type { AIProvider } from './types';

/**
 * Health status information for an AI provider
 */
export interface HealthStatus {
  /** Name of the provider being monitored (null if not initialized) */
  provider: string | null;

  /** Current health status */
  status: 'healthy' | 'degraded' | 'unavailable';

  /** When the last health check was performed */
  lastCheck: Date;

  /** Number of consecutive failed health checks */
  consecutiveFailures: number;

  /** Uptime percentage based on recent health checks */
  uptime: number;

  /** Optional message with additional status details */
  message?: string;
}

/**
 * Individual health check result
 */
interface HealthCheckResult {
  /** Whether the check succeeded */
  success: boolean;

  /** When the check was performed */
  timestamp: Date;

  /** Optional message from the check */
  message?: string;
}

/**
 * Configuration options for health monitoring
 */
export interface HealthMonitorOptions {
  /** Interval between health checks in milliseconds */
  checkIntervalMs?: number;

  /** Maximum number of check results to retain for uptime calculation */
  maxCheckHistory?: number;

  /** Number of consecutive failures before marking as unavailable */
  failureThreshold?: number;

  /** Callback invoked when status changes */
  onStatusChange?: (status: HealthStatus) => void;
}

/**
 * Health monitoring system for AI providers
 *
 * Continuously monitors provider health with periodic checks,
 * tracks uptime, and detects service degradation.
 */
export class HealthMonitor {
  private status: HealthStatus = {
    provider: null,
    status: 'unavailable',
    lastCheck: new Date(),
    consecutiveFailures: 0,
    uptime: 100,
  };

  private checkInterval: number | null = null;
  private checks: HealthCheckResult[] = [];
  private options: Required<HealthMonitorOptions>;
  private provider: AIProvider | null = null;

  constructor(options: HealthMonitorOptions = {}) {
    this.options = {
      checkIntervalMs: options.checkIntervalMs ?? 60000, // 1 minute default
      maxCheckHistory: options.maxCheckHistory ?? 100,
      failureThreshold: options.failureThreshold ?? 3,
      onStatusChange: options.onStatusChange ?? (() => {}),
    };
  }

  /**
   * Start monitoring a provider's health
   *
   * @param provider - The AI provider to monitor
   * @param intervalMs - Optional custom interval (overrides constructor option)
   */
  startMonitoring(provider: AIProvider, intervalMs?: number): void {
    // Stop any existing monitoring
    this.stopMonitoring();

    this.provider = provider;
    this.status.provider = provider.name;

    const interval = intervalMs ?? this.options.checkIntervalMs;

    // Perform initial check immediately
    this.performCheck();

    // Schedule periodic checks
    this.checkInterval = window.setInterval(() => {
      this.performCheck();
    }, interval);

    if (import.meta.env.DEV) {
      console.log(`[Health Monitor] Started monitoring "${provider.name}" (interval: ${interval}ms)`);
    }
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;

      if (import.meta.env.DEV && this.status.provider) {
        console.log(`[Health Monitor] Stopped monitoring "${this.status.provider}"`);
      }
    }

    this.provider = null;
  }

  /**
   * Perform a health check on the current provider
   */
  private async performCheck(): Promise<void> {
    if (!this.provider) {
      return;
    }

    const previousStatus = this.status.status;

    try {
      const health = await this.provider.healthCheck();

      // Record check result
      this.recordCheck({
        success: health.available,
        timestamp: new Date(),
        message: health.message,
      });

      // Update status based on result
      if (health.available) {
        this.status.status = 'healthy';
        this.status.consecutiveFailures = 0;
        this.status.message = health.message;
      } else {
        this.status.consecutiveFailures++;
        this.status.status = this.status.consecutiveFailures >= this.options.failureThreshold
          ? 'unavailable'
          : 'degraded';
        this.status.message = health.message || 'Provider reported unavailable';
      }
    } catch (error) {
      // Health check itself failed
      this.recordCheck({
        success: false,
        timestamp: new Date(),
        message: error instanceof Error ? error.message : 'Health check failed',
      });

      this.status.consecutiveFailures++;
      this.status.status = this.status.consecutiveFailures >= this.options.failureThreshold
        ? 'unavailable'
        : 'degraded';
      this.status.message = error instanceof Error ? error.message : 'Health check error';

      if (import.meta.env.DEV) {
        console.error('[Health Monitor] Health check failed:', error);
      }
    }

    this.status.lastCheck = new Date();
    this.status.uptime = this.calculateUptime();

    // Notify if status changed
    if (previousStatus !== this.status.status) {
      if (import.meta.env.DEV) {
        console.log(
          `[Health Monitor] Status changed: ${previousStatus} -> ${this.status.status}`
        );
      }
      this.options.onStatusChange(this.getStatus());
    }
  }

  /**
   * Record a health check result
   */
  private recordCheck(result: HealthCheckResult): void {
    this.checks.push(result);

    // Keep only the most recent checks
    if (this.checks.length > this.options.maxCheckHistory) {
      this.checks.shift();
    }
  }

  /**
   * Calculate uptime percentage based on recent checks
   */
  private calculateUptime(): number {
    if (this.checks.length === 0) {
      return 100;
    }

    const successCount = this.checks.filter(c => c.success).length;
    return Math.round((successCount / this.checks.length) * 100 * 100) / 100; // Round to 2 decimals
  }

  /**
   * Get the current health status (returns a copy)
   */
  getStatus(): HealthStatus {
    return { ...this.status };
  }

  /**
   * Get the full health check history
   */
  getCheckHistory(): HealthCheckResult[] {
    return [...this.checks];
  }

  /**
   * Manually trigger a health check
   */
  async checkNow(): Promise<HealthStatus> {
    await this.performCheck();
    return this.getStatus();
  }

  /**
   * Reset the health monitor state
   */
  reset(): void {
    this.checks = [];
    this.status = {
      provider: this.status.provider,
      status: 'unavailable',
      lastCheck: new Date(),
      consecutiveFailures: 0,
      uptime: 100,
    };
  }

  /**
   * Check if the provider is currently healthy
   */
  isHealthy(): boolean {
    return this.status.status === 'healthy';
  }

  /**
   * Check if the provider is degraded
   */
  isDegraded(): boolean {
    return this.status.status === 'degraded';
  }

  /**
   * Check if the provider is unavailable
   */
  isUnavailable(): boolean {
    return this.status.status === 'unavailable';
  }

  /**
   * Get the number of recent failures
   */
  getConsecutiveFailures(): number {
    return this.status.consecutiveFailures;
  }

  /**
   * Get the uptime percentage
   */
  getUptime(): number {
    return this.status.uptime;
  }

  /**
   * Check if monitoring is currently active
   */
  isMonitoring(): boolean {
    return this.checkInterval !== null;
  }
}

/**
 * Default global health monitor instance
 */
export const healthMonitor = new HealthMonitor();
