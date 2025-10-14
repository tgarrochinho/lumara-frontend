/**
 * Vitest Type Declarations
 *
 * Extends Vitest's Assertion interface with jest-dom custom matchers.
 * This provides TypeScript support for matchers like toBeInTheDocument(),
 * toHaveClass(), etc.
 */

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends jest.Expect {}
}
