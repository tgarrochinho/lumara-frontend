/**
 * Progress tracking utilities for async operations like model downloads
 */

export type ProgressCallback = (progress: number, message?: string) => void;

/**
 * Tracks and broadcasts progress updates for async operations
 */
export class ProgressTracker {
  private callbacks: ProgressCallback[] = [];
  private currentProgress: number = 0;
  private currentMessage?: string;

  /**
   * Subscribe to progress updates
   * @param callback Function to call on progress updates
   * @returns Unsubscribe function
   */
  subscribe(callback: ProgressCallback): () => void {
    this.callbacks.push(callback);

    // Immediately send current progress to new subscriber
    if (this.currentProgress > 0) {
      callback(this.currentProgress, this.currentMessage);
    }

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Update progress and notify all subscribers
   * @param progress Progress value (0-100, or -1 for error)
   * @param message Optional progress message
   */
  update(progress: number, message?: string): void {
    this.currentProgress = progress;
    this.currentMessage = message;
    this.callbacks.forEach((cb) => cb(progress, message));
  }

  /**
   * Mark operation as complete (100%)
   * @param message Optional completion message
   */
  complete(message: string = 'Complete'): void {
    this.update(100, message);
  }

  /**
   * Report an error
   * @param message Error message
   */
  error(message: string): void {
    this.update(-1, `Error: ${message}`);
  }

  /**
   * Reset progress tracker
   */
  reset(): void {
    this.currentProgress = 0;
    this.currentMessage = undefined;
  }

  /**
   * Get current progress
   */
  getProgress(): { progress: number; message?: string } {
    return {
      progress: this.currentProgress,
      message: this.currentMessage,
    };
  }

  /**
   * Check if there are active subscribers
   */
  hasSubscribers(): boolean {
    return this.callbacks.length > 0;
  }
}

/**
 * Global progress tracker for embedding model loading
 */
export const embeddingProgress = new ProgressTracker();
