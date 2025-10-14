/**
 * Unit tests for progress tracking utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressTracker, embeddingProgress } from '../utils/progress';

describe('ProgressTracker', () => {
  let tracker: ProgressTracker;

  beforeEach(() => {
    tracker = new ProgressTracker();
  });

  describe('subscribe', () => {
    it('calls callback on progress updates', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.update(50, 'Half done');

      expect(callback).toHaveBeenCalledWith(50, 'Half done');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('calls multiple subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      tracker.subscribe(callback1);
      tracker.subscribe(callback2);

      tracker.update(75, 'Almost done');

      expect(callback1).toHaveBeenCalledWith(75, 'Almost done');
      expect(callback2).toHaveBeenCalledWith(75, 'Almost done');
    });

    it('returns unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = tracker.subscribe(callback);

      tracker.update(30);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      tracker.update(60);
      expect(callback).toHaveBeenCalledTimes(1); // Not called again
    });

    it('sends current progress to new subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      tracker.subscribe(callback1);
      tracker.update(40, 'In progress');

      // New subscriber should receive current progress
      tracker.subscribe(callback2);

      expect(callback2).toHaveBeenCalledWith(40, 'In progress');
    });
  });

  describe('update', () => {
    it('updates progress without message', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.update(25);

      expect(callback).toHaveBeenCalledWith(25, undefined);
    });

    it('updates progress with message', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.update(90, 'Nearly complete');

      expect(callback).toHaveBeenCalledWith(90, 'Nearly complete');
    });

    it('tracks current progress', () => {
      tracker.update(45, 'Test message');

      const progress = tracker.getProgress();

      expect(progress.progress).toBe(45);
      expect(progress.message).toBe('Test message');
    });
  });

  describe('complete', () => {
    it('sets progress to 100 with default message', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.complete();

      expect(callback).toHaveBeenCalledWith(100, 'Complete');
    });

    it('sets progress to 100 with custom message', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.complete('All done!');

      expect(callback).toHaveBeenCalledWith(100, 'All done!');
    });
  });

  describe('error', () => {
    it('reports error with progress -1', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      tracker.error('Something went wrong');

      expect(callback).toHaveBeenCalledWith(-1, 'Error: Something went wrong');
    });
  });

  describe('reset', () => {
    it('resets progress to 0', () => {
      tracker.update(50, 'Half done');
      tracker.reset();

      const progress = tracker.getProgress();

      expect(progress.progress).toBe(0);
      expect(progress.message).toBeUndefined();
    });
  });

  describe('getProgress', () => {
    it('returns current progress state', () => {
      tracker.update(33, 'One third');

      const progress = tracker.getProgress();

      expect(progress.progress).toBe(33);
      expect(progress.message).toBe('One third');
    });

    it('returns initial state', () => {
      const progress = tracker.getProgress();

      expect(progress.progress).toBe(0);
      expect(progress.message).toBeUndefined();
    });
  });

  describe('hasSubscribers', () => {
    it('returns false when no subscribers', () => {
      expect(tracker.hasSubscribers()).toBe(false);
    });

    it('returns true when has subscribers', () => {
      tracker.subscribe(() => {});

      expect(tracker.hasSubscribers()).toBe(true);
    });

    it('updates after unsubscribe', () => {
      const unsubscribe = tracker.subscribe(() => {});

      expect(tracker.hasSubscribers()).toBe(true);

      unsubscribe();

      expect(tracker.hasSubscribers()).toBe(false);
    });
  });

  describe('Multiple progress updates', () => {
    it('handles rapid updates', () => {
      const callback = vi.fn();
      tracker.subscribe(callback);

      for (let i = 0; i <= 100; i += 10) {
        tracker.update(i, `Progress: ${i}%`);
      }

      expect(callback).toHaveBeenCalledTimes(11);
      expect(callback).toHaveBeenLastCalledWith(100, 'Progress: 100%');
    });
  });
});

describe('embeddingProgress singleton', () => {
  beforeEach(() => {
    embeddingProgress.reset();
  });

  it('is a ProgressTracker instance', () => {
    expect(embeddingProgress).toBeInstanceOf(ProgressTracker);
  });

  it('can be used globally', () => {
    const callback = vi.fn();
    embeddingProgress.subscribe(callback);

    embeddingProgress.update(50, 'Global progress');

    expect(callback).toHaveBeenCalledWith(50, 'Global progress');
  });
});
