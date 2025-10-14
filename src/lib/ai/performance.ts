/**
 * Performance Monitoring Utilities
 *
 * Provides tools for tracking and analyzing AI operation performance,
 * including timing measurements, statistics, and memory usage tracking.
 */

/**
 * Performance statistics for a metric
 */
export interface PerformanceStats {
  /** Number of measurements recorded */
  count: number;

  /** Minimum duration in milliseconds */
  min: number;

  /** Maximum duration in milliseconds */
  max: number;

  /** Average duration in milliseconds */
  avg: number;

  /** Median duration in milliseconds */
  median: number;

  /** 95th percentile duration in milliseconds */
  p95: number;

  /** 99th percentile duration in milliseconds */
  p99: number;
}

/**
 * Memory usage information
 */
export interface MemoryInfo {
  /** Used heap size in bytes */
  usedHeapSize?: number;

  /** Total heap size in bytes */
  totalHeapSize?: number;

  /** Heap size limit in bytes */
  heapSizeLimit?: number;

  /** Memory usage as percentage (0-100) */
  usagePercent?: number;
}

/**
 * Performance monitoring class
 *
 * Tracks execution times for different operations and provides
 * statistical analysis of performance metrics.
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private readonly maxMeasurements: number = 100;

  /**
   * Measure the execution time of an async function
   *
   * @param name - Metric name for tracking
   * @param fn - Async function to measure
   * @returns Result of the function
   *
   * @example
   * const result = await monitor.measure('embedding-generation', async () => {
   *   return await generateEmbedding(text);
   * });
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();

    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.record(name, duration);
    }
  }

  /**
   * Measure the execution time of a sync function
   *
   * @param name - Metric name for tracking
   * @param fn - Sync function to measure
   * @returns Result of the function
   */
  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now();

    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.record(name, duration);
    }
  }

  /**
   * Record a duration for a metric
   *
   * @param name - Metric name
   * @param duration - Duration in milliseconds
   */
  record(name: string, duration: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const measurements = this.metrics.get(name)!;
    measurements.push(duration);

    // Keep only the most recent measurements
    if (measurements.length > this.maxMeasurements) {
      measurements.shift();
    }
  }

  /**
   * Get statistics for a specific metric
   *
   * @param name - Metric name
   * @returns Performance statistics or null if no data exists
   */
  getStats(name: string): PerformanceStats | null {
    const measurements = this.metrics.get(name) || [];

    if (measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const sum = measurements.reduce((a, b) => a + b, 0);

    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / measurements.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get statistics for all tracked metrics
   *
   * @returns Object mapping metric names to their statistics
   */
  getAllStats(): Record<string, PerformanceStats | null> {
    const stats: Record<string, PerformanceStats | null> = {};

    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }

    return stats;
  }

  /**
   * Get the most recent measurements for a metric
   *
   * @param name - Metric name
   * @param limit - Maximum number of measurements to return
   * @returns Array of recent measurements in milliseconds
   */
  getRecent(name: string, limit: number = 10): number[] {
    const measurements = this.metrics.get(name) || [];
    return measurements.slice(-limit);
  }

  /**
   * Check if a metric exceeds a threshold
   *
   * @param name - Metric name
   * @param threshold - Threshold in milliseconds
   * @param percentile - Which percentile to check (default: 'avg')
   * @returns True if the metric exceeds the threshold
   */
  exceeds(
    name: string,
    threshold: number,
    percentile: 'min' | 'avg' | 'median' | 'p95' | 'p99' | 'max' = 'avg'
  ): boolean {
    const stats = this.getStats(name);
    if (!stats) return false;

    return stats[percentile] > threshold;
  }

  /**
   * Clear measurements for a specific metric
   *
   * @param name - Metric name to clear
   */
  clearMetric(name: string): void {
    this.metrics.delete(name);
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Get a list of all tracked metric names
   *
   * @returns Array of metric names
   */
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * Get the number of metrics being tracked
   *
   * @returns Number of unique metrics
   */
  getMetricCount(): number {
    return this.metrics.size;
  }

  /**
   * Export all metrics data
   *
   * @returns Object containing all raw measurement data
   */
  export(): Record<string, number[]> {
    const data: Record<string, number[]> = {};

    for (const [name, measurements] of this.metrics) {
      data[name] = [...measurements];
    }

    return data;
  }

  /**
   * Import metrics data
   *
   * @param data - Object containing measurement data
   */
  import(data: Record<string, number[]>): void {
    for (const [name, measurements] of Object.entries(data)) {
      this.metrics.set(name, [...measurements]);
    }
  }
}

/**
 * Singleton instance of the performance monitor
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Get memory usage information
 *
 * @returns Memory usage information or null if not available
 */
export function getMemoryInfo(): MemoryInfo | null {
  // Check if performance.memory is available (Chrome-only)
  const perfMemory = (performance as any).memory;

  if (!perfMemory) {
    return null;
  }

  const usedHeapSize = perfMemory.usedJSHeapSize;
  const totalHeapSize = perfMemory.totalJSHeapSize;
  const heapSizeLimit = perfMemory.jsHeapSizeLimit;

  return {
    usedHeapSize,
    totalHeapSize,
    heapSizeLimit,
    usagePercent: heapSizeLimit > 0 ? (usedHeapSize / heapSizeLimit) * 100 : 0,
  };
}

/**
 * Check if memory usage is within acceptable limits
 *
 * @param maxMB - Maximum memory in megabytes (default: 500MB)
 * @returns True if memory usage is within limits
 */
export function isMemoryWithinLimits(maxMB: number = 500): boolean {
  const memInfo = getMemoryInfo();

  if (!memInfo || !memInfo.usedHeapSize) {
    // If we can't determine memory usage, assume it's OK
    return true;
  }

  const usedMB = memInfo.usedHeapSize / (1024 * 1024);
  return usedMB <= maxMB;
}

/**
 * Format bytes to a human-readable string
 *
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format milliseconds to a human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted string (e.g., "1.5s" or "150ms")
 */
export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Create a performance mark
 *
 * @param name - Mark name
 */
export function mark(name: string): void {
  performance.mark(name);
}

/**
 * Measure the time between two marks
 *
 * @param name - Measure name
 * @param startMark - Start mark name
 * @param endMark - End mark name (optional, defaults to now)
 * @returns Duration in milliseconds
 */
export function measureMark(
  name: string,
  startMark: string,
  endMark?: string
): number {
  performance.measure(name, startMark, endMark);

  const entries = performance.getEntriesByName(name, 'measure');
  if (entries.length === 0) return 0;

  const entry = entries[entries.length - 1];
  return entry.duration;
}

/**
 * Clear all performance marks and measures
 */
export function clearMarks(): void {
  performance.clearMarks();
  performance.clearMeasures();
}
