/**
 * Tests for AIErrorBoundary Component
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIErrorBoundary } from '../AIErrorBoundary';
import {
  AIError,
  ProviderUnavailableError,
  NetworkError,
  InitializationError,
} from '@/lib/ai/error-handler';

// Component that throws an error
function ThrowError({ error }: { error: Error }): null {
  throw error;
}

// Component that doesn't throw
function NoError() {
  return <div>Content</div>;
}

describe('AIErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('normal rendering', () => {
    it('should render children when no error', () => {
      render(
        <AIErrorBoundary>
          <NoError />
        </AIErrorBoundary>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should not show error UI when no error', () => {
      render(
        <AIErrorBoundary>
          <NoError />
        </AIErrorBoundary>
      );

      expect(screen.queryByText(/AI System Error/i)).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should catch AIError and show error UI', () => {
      const error = new AIError('Test error', 'TEST_ERROR', true);

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/AI System Error/i)).toBeInTheDocument();
    });

    it('should convert regular Error to AIError', () => {
      const error = new Error('Regular error');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/AI System Error/i)).toBeInTheDocument();
    });

    it('should display user-friendly error message for ProviderUnavailableError', () => {
      const error = new ProviderUnavailableError('Chrome AI');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/AI is currently unavailable/i)).toBeInTheDocument();
    });

    it('should display user-friendly error message for NetworkError', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/Network connection issue/i)).toBeInTheDocument();
    });

    it('should display user-friendly error message for InitializationError', () => {
      const error = new InitializationError('AI Provider');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/Failed to start the AI system/i)).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('should show Try Again button for recoverable errors', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });

    it('should not show Try Again button for non-recoverable errors', () => {
      const error = new InitializationError('provider');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.queryByRole('button', { name: /Try Again/i })).not.toBeInTheDocument();
    });

    it('should reset error state when Try Again is clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;
      const error = new NetworkError('timeout');

      function ConditionalError() {
        if (shouldThrow) {
          throw error;
        }
        return <div>Recovered</div>;
      }

      render(
        <AIErrorBoundary>
          <ConditionalError />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/AI System Error/i)).toBeInTheDocument();

      // Stop throwing error
      shouldThrow = false;

      // Click Try Again
      const button = screen.getByRole('button', { name: /Try Again/i });
      await user.click(button);

      // Should show recovered content
      expect(screen.getByText('Recovered')).toBeInTheDocument();
      expect(screen.queryByText(/AI System Error/i)).not.toBeInTheDocument();
    });
  });

  describe('custom fallback', () => {
    it('should render custom fallback ReactNode', () => {
      const error = new NetworkError('timeout');
      const customFallback = <div>Custom Error UI</div>;

      render(
        <AIErrorBoundary fallback={customFallback}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText(/AI System Error/i)).not.toBeInTheDocument();
    });

    it('should render custom fallback function', () => {
      const error = new NetworkError('timeout');
      const customFallback = (err: AIError, reset: () => void) => (
        <div>
          <div>Custom: {err.code}</div>
          <button onClick={reset}>Reset</button>
        </div>
      );

      render(
        <AIErrorBoundary fallback={customFallback}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/Custom: NETWORK_ERROR/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    });

    it('should call reset function from custom fallback', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;
      const error = new NetworkError('timeout');

      function ConditionalError() {
        if (shouldThrow) {
          throw error;
        }
        return <div>Recovered</div>;
      }

      const customFallback = (_err: AIError, reset: () => void) => (
        <button onClick={reset}>Custom Reset</button>
      );

      render(
        <AIErrorBoundary fallback={customFallback}>
          <ConditionalError />
        </AIErrorBoundary>
      );

      shouldThrow = false;

      const button = screen.getByRole('button', { name: /Custom Reset/i });
      await user.click(button);

      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });
  });

  describe('onError callback', () => {
    it('should call onError callback when error is caught', () => {
      const onError = vi.fn();
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary onError={onError}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should not call onError when no error', () => {
      const onError = vi.fn();

      render(
        <AIErrorBoundary onError={onError}>
          <NoError />
        </AIErrorBoundary>
      );

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('technical details', () => {
    it('should show technical details when showDetails is true', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary showDetails={true}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      const details = screen.getByText(/Technical Details/i);
      expect(details).toBeInTheDocument();
    });

    it('should hide technical details when showDetails is false', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary showDetails={false}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.queryByText(/Technical Details/i)).not.toBeInTheDocument();
    });

    it('should show error code in technical details', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary showDetails={true}>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      // Click to expand details
      const summary = screen.getByText(/Technical Details/i);
      expect(summary.closest('details')).toBeInTheDocument();

      // Check for error code in pre element
      const pre = summary.closest('details')?.querySelector('pre');
      expect(pre?.textContent).toContain('NETWORK_ERROR');
    });
  });

  describe('accessibility', () => {
    it('should have role="alert" on error UI', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have button accessible by role', () => {
      const error = new NetworkError('timeout');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });

  describe('multiple errors', () => {
    it('should handle consecutive errors', () => {
      let errorToThrow: Error | null = new NetworkError('first');

      function DynamicError() {
        if (errorToThrow) {
          throw errorToThrow;
        }
        return <div>No error</div>;
      }

      const { rerender } = render(
        <AIErrorBoundary>
          <DynamicError />
        </AIErrorBoundary>
      );

      expect(screen.getByText(/Network connection issue/i)).toBeInTheDocument();

      // Change error type
      errorToThrow = new ProviderUnavailableError('Chrome AI');

      rerender(
        <AIErrorBoundary>
          <DynamicError />
        </AIErrorBoundary>
      );

      // Should still show error UI (but won't re-catch without reset)
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('nested error boundaries', () => {
    it('should allow nested error boundaries', () => {
      const innerError = new ProviderUnavailableError('Chrome AI');

      function InnerThrow(): null {
        throw innerError;
      }

      function SafeContent() {
        return <div>Safe Content</div>;
      }

      render(
        <AIErrorBoundary fallback={<div>Outer Error</div>}>
          <SafeContent />
          <AIErrorBoundary fallback={<div>Inner Error</div>}>
            <InnerThrow />
          </AIErrorBoundary>
        </AIErrorBoundary>
      );

      // Inner boundary should catch inner error
      expect(screen.getByText('Inner Error')).toBeInTheDocument();
      // Outer boundary should not catch it
      expect(screen.getByText('Safe Content')).toBeInTheDocument();
      expect(screen.queryByText('Outer Error')).not.toBeInTheDocument();
    });
  });
});
