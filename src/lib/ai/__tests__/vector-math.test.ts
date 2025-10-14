/**
 * Tests for Vector Math Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  dotProduct,
  magnitude,
  normalize,
  add,
  subtract,
  scale,
  distance,
} from '../utils/vector-math';

describe('Vector Math Utilities', () => {
  describe('dotProduct', () => {
    it('calculates dot product correctly for simple vectors', () => {
      expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    it('returns 0 for orthogonal vectors', () => {
      expect(dotProduct([1, 0, 0], [0, 1, 0])).toBe(0);
    });

    it('handles negative values', () => {
      expect(dotProduct([1, -2, 3], [4, 5, -6])).toBe(-24); // 1*4 + (-2)*5 + 3*(-6)
    });

    it('handles zero vectors', () => {
      expect(dotProduct([0, 0, 0], [1, 2, 3])).toBe(0);
    });

    it('throws error for mismatched vector lengths', () => {
      expect(() => dotProduct([1, 2], [1, 2, 3])).toThrow('Vector dimension mismatch');
    });

    it('works with single-element vectors', () => {
      expect(dotProduct([5], [3])).toBe(15);
    });

    it('works with large vectors', () => {
      const a = Array(1000).fill(1);
      const b = Array(1000).fill(2);
      expect(dotProduct(a, b)).toBe(2000);
    });
  });

  describe('magnitude', () => {
    it('calculates magnitude for simple vectors', () => {
      expect(magnitude([3, 4])).toBe(5); // sqrt(9 + 16) = 5
    });

    it('calculates magnitude for 3D vectors', () => {
      expect(magnitude([1, 2, 2])).toBe(3); // sqrt(1 + 4 + 4) = 3
    });

    it('returns 0 for zero vector', () => {
      expect(magnitude([0, 0, 0])).toBe(0);
    });

    it('returns absolute value for 1D vector', () => {
      expect(magnitude([5])).toBe(5);
      expect(magnitude([-5])).toBe(5);
    });

    it('handles unit vectors', () => {
      expect(magnitude([1, 0, 0])).toBe(1);
      expect(magnitude([0, 1, 0])).toBe(1);
      expect(magnitude([0, 0, 1])).toBe(1);
    });

    it('handles negative values', () => {
      expect(magnitude([-3, -4])).toBe(5);
    });
  });

  describe('normalize', () => {
    it('normalizes vector to unit length', () => {
      const result = normalize([3, 4]);
      expect(result[0]).toBeCloseTo(0.6);
      expect(result[1]).toBeCloseTo(0.8);
      expect(magnitude(result)).toBeCloseTo(1);
    });

    it('normalizes 3D vector', () => {
      const result = normalize([1, 2, 2]);
      expect(magnitude(result)).toBeCloseTo(1);
    });

    it('preserves direction for unit vectors', () => {
      const result = normalize([1, 0, 0]);
      expect(result).toEqual([1, 0, 0]);
    });

    it('throws error for zero vector', () => {
      expect(() => normalize([0, 0, 0])).toThrow('Cannot normalize zero vector');
    });

    it('handles negative vectors', () => {
      const result = normalize([-3, -4]);
      expect(magnitude(result)).toBeCloseTo(1);
      expect(result[0]).toBeCloseTo(-0.6);
      expect(result[1]).toBeCloseTo(-0.8);
    });

    it('creates new array (does not mutate original)', () => {
      const original = [3, 4];
      const result = normalize(original);
      expect(original).toEqual([3, 4]); // Original unchanged
      expect(result).not.toBe(original); // Different array reference
    });
  });

  describe('add', () => {
    it('adds two vectors element-wise', () => {
      expect(add([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
    });

    it('handles zero vectors', () => {
      expect(add([1, 2, 3], [0, 0, 0])).toEqual([1, 2, 3]);
    });

    it('handles negative values', () => {
      expect(add([1, -2, 3], [-1, 2, -3])).toEqual([0, 0, 0]);
    });

    it('throws error for mismatched lengths', () => {
      expect(() => add([1, 2], [1, 2, 3])).toThrow('Vector dimension mismatch');
    });
  });

  describe('subtract', () => {
    it('subtracts two vectors element-wise', () => {
      expect(subtract([5, 7, 9], [1, 2, 3])).toEqual([4, 5, 6]);
    });

    it('handles zero result', () => {
      expect(subtract([1, 2, 3], [1, 2, 3])).toEqual([0, 0, 0]);
    });

    it('handles negative values', () => {
      expect(subtract([1, 2, 3], [4, 5, 6])).toEqual([-3, -3, -3]);
    });

    it('throws error for mismatched lengths', () => {
      expect(() => subtract([1, 2], [1, 2, 3])).toThrow('Vector dimension mismatch');
    });
  });

  describe('scale', () => {
    it('scales vector by scalar', () => {
      expect(scale([1, 2, 3], 2)).toEqual([2, 4, 6]);
    });

    it('handles zero scalar', () => {
      expect(scale([1, 2, 3], 0)).toEqual([0, 0, 0]);
    });

    it('handles negative scalar', () => {
      expect(scale([1, 2, 3], -1)).toEqual([-1, -2, -3]);
    });

    it('handles fractional scalar', () => {
      expect(scale([2, 4, 6], 0.5)).toEqual([1, 2, 3]);
    });

    it('handles identity scalar', () => {
      expect(scale([1, 2, 3], 1)).toEqual([1, 2, 3]);
    });
  });

  describe('distance', () => {
    it('calculates Euclidean distance correctly', () => {
      expect(distance([0, 0], [3, 4])).toBe(5);
    });

    it('returns 0 for identical vectors', () => {
      expect(distance([1, 2, 3], [1, 2, 3])).toBe(0);
    });

    it('handles 3D vectors', () => {
      expect(distance([0, 0, 0], [1, 1, 1])).toBeCloseTo(Math.sqrt(3));
    });

    it('handles negative coordinates', () => {
      expect(distance([-1, -1], [1, 1])).toBeCloseTo(Math.sqrt(8));
    });

    it('is symmetric', () => {
      const d1 = distance([1, 2, 3], [4, 5, 6]);
      const d2 = distance([4, 5, 6], [1, 2, 3]);
      expect(d1).toBe(d2);
    });

    it('throws error for mismatched lengths', () => {
      expect(() => distance([1, 2], [1, 2, 3])).toThrow('Vector dimension mismatch');
    });

    it('handles high-dimensional vectors', () => {
      const a = Array(100).fill(0);
      const b = Array(100).fill(1);
      expect(distance(a, b)).toBe(10); // sqrt(100 * 1^2) = 10
    });
  });

  describe('Performance', () => {
    it('handles large vectors efficiently', () => {
      const size = 10000;
      const a = Array(size).fill(1);
      const b = Array(size).fill(2);

      const start = performance.now();
      dotProduct(a, b);
      magnitude(a);
      const end = performance.now();

      expect(end - start).toBeLessThan(10); // Should complete in <10ms
    });
  });

  describe('Edge Cases', () => {
    it('handles empty vectors', () => {
      expect(dotProduct([], [])).toBe(0);
      expect(magnitude([])).toBe(0);
      expect(add([], [])).toEqual([]);
    });

    it('handles very small numbers', () => {
      const small = 1e-10;
      expect(dotProduct([small], [small])).toBeCloseTo(small * small);
    });

    it('handles very large numbers', () => {
      const large = 1e10;
      const result = dotProduct([large], [large]);
      expect(result).toBeGreaterThan(0);
    });
  });
});
