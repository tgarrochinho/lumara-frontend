/**
 * Tests for AI Provider Types
 */

import { describe, it, expect } from 'vitest';
import {
  NoProviderAvailableError,
  ProviderInitializationError,
} from '../types';

describe('AI Provider Error Classes', () => {
  describe('NoProviderAvailableError', () => {
    it('should create error with default message', () => {
      const error = new NoProviderAvailableError();
      expect(error.message).toBe('No AI provider available');
      expect(error.name).toBe('NoProviderAvailableError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with custom message', () => {
      const customMessage = 'Custom error message';
      const error = new NoProviderAvailableError(customMessage);
      expect(error.message).toBe(customMessage);
      expect(error.name).toBe('NoProviderAvailableError');
    });
  });

  describe('ProviderInitializationError', () => {
    it('should create error with provider name', () => {
      const providerName = 'test-provider';
      const error = new ProviderInitializationError(providerName);
      expect(error.message).toBe(`Failed to initialize provider: ${providerName}`);
      expect(error.name).toBe('ProviderInitializationError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should store cause when provided', () => {
      const providerName = 'test-provider';
      const cause = new Error('Original error');
      const error = new ProviderInitializationError(providerName, cause);
      expect(error.cause).toBe(cause);
    });
  });
});
