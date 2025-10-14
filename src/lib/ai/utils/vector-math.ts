/**
 * Vector Math Utilities
 *
 * Provides core vector operations for similarity calculations and embeddings.
 * All functions are optimized for performance with large vectors.
 */

/**
 * Calculate the dot product of two vectors
 *
 * The dot product measures how similar two vectors are in direction.
 * Used as a component in cosine similarity calculations.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Dot product (sum of element-wise products)
 * @throws Error if vectors have different lengths
 *
 * @example
 * dotProduct([1, 2, 3], [4, 5, 6]) // Returns 32 (1*4 + 2*5 + 3*6)
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Calculate the magnitude (length) of a vector
 *
 * The magnitude is the Euclidean length of the vector.
 * Used to normalize vectors and calculate cosine similarity.
 *
 * @param vector - The vector to measure
 * @returns The magnitude (non-negative number)
 *
 * @example
 * magnitude([3, 4]) // Returns 5 (sqrt(3^2 + 4^2))
 */
export function magnitude(vector: number[]): number {
  let sumOfSquares = 0;
  for (let i = 0; i < vector.length; i++) {
    sumOfSquares += vector[i] * vector[i];
  }
  return Math.sqrt(sumOfSquares);
}

/**
 * Normalize a vector to unit length
 *
 * Converts a vector to have magnitude 1 while preserving direction.
 * Useful for making vectors comparable regardless of their original scale.
 *
 * @param vector - The vector to normalize
 * @returns A new normalized vector
 * @throws Error if vector has zero magnitude
 *
 * @example
 * normalize([3, 4]) // Returns [0.6, 0.8]
 */
export function normalize(vector: number[]): number[] {
  const mag = magnitude(vector);

  if (mag === 0) {
    throw new Error('Cannot normalize zero vector');
  }

  return vector.map(val => val / mag);
}

/**
 * Add two vectors element-wise
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns New vector with element-wise sum
 * @throws Error if vectors have different lengths
 *
 * @example
 * add([1, 2, 3], [4, 5, 6]) // Returns [5, 7, 9]
 */
export function add(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  return a.map((val, i) => val + b[i]);
}

/**
 * Subtract vector b from vector a element-wise
 *
 * @param a - First vector
 * @param b - Second vector to subtract
 * @returns New vector with element-wise difference
 * @throws Error if vectors have different lengths
 *
 * @example
 * subtract([5, 7, 9], [1, 2, 3]) // Returns [4, 5, 6]
 */
export function subtract(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  return a.map((val, i) => val - b[i]);
}

/**
 * Scale a vector by a scalar multiplier
 *
 * @param vector - The vector to scale
 * @param scalar - The scalar to multiply by
 * @returns New scaled vector
 *
 * @example
 * scale([1, 2, 3], 2) // Returns [2, 4, 6]
 */
export function scale(vector: number[], scalar: number): number[] {
  return vector.map(val => val * scalar);
}

/**
 * Calculate the Euclidean distance between two vectors
 *
 * Measures the straight-line distance between two points in n-dimensional space.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Distance between vectors
 * @throws Error if vectors have different lengths
 *
 * @example
 * distance([0, 0], [3, 4]) // Returns 5
 */
export function distance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let sumOfSquares = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sumOfSquares += diff * diff;
  }
  return Math.sqrt(sumOfSquares);
}
