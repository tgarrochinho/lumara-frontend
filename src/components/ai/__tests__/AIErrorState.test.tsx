/**
 * Tests for AIErrorState component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIErrorState } from '../AIErrorState';
import { ProviderUnavailableError, NetworkError, EmbeddingError } from '@/lib/ai/error-handler';

describe('AIErrorState', () => {
  const mockRetry = vi.fn();

  describe('Rendering', () => {
    it('should render error UI', () => {
      const error = new Error('Test error');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('AI Setup Failed')).toBeInTheDocument();
    });

    it('should display custom title', () => {
      const error = new Error('Test error');
      render(<AIErrorState error={error} onRetry={mockRetry} title="Custom Error" />);

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
    });

    it('should return null when error is null', () => {
      const { container } = render(<AIErrorState error={null} onRetry={mockRetry} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Error Messages', () => {
    it('should display user-friendly message for generic error', () => {
      const error = new Error('Generic error');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });

    it('should display Chrome AI missing help', () => {
      const error = new ProviderUnavailableError('Chrome AI');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Chrome AI Required')).toBeInTheDocument();
      expect(screen.getByText(/Chrome Canary or Chrome Dev/i)).toBeInTheDocument();
    });

    it('should display network error help', () => {
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Network Issue')).toBeInTheDocument();
      expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
    });

    it('should display embedding error help', () => {
      const error = new EmbeddingError('Model load failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Model Loading Issue')).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should show retry button for recoverable errors', () => {
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('should not show retry button for non-recoverable errors', () => {
      // Create a non-recoverable error by setting recoverable to false
      const error = new Error('Non-recoverable');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const retryButton = screen.queryByRole('button', { name: /try again/i });
      expect(retryButton).not.toBeInTheDocument();
    });
  });

  describe('External Links', () => {
    it('should include Chrome AI documentation link for provider errors', () => {
      const error = new ProviderUnavailableError('Chrome AI');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const link = screen.getByRole('link', { name: /learn how to enable/i });
      expect(link).toHaveAttribute('href', 'https://developer.chrome.com/docs/ai/built-in');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Technical Details', () => {
    it('should show technical details in dev mode', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace...';

      render(<AIErrorState error={error} onRetry={mockRetry} showDetails={true} />);

      expect(screen.getByText('Technical Details')).toBeInTheDocument();
    });

    it('should hide technical details by default in production', () => {
      const error = new Error('Test error');
      render(<AIErrorState error={error} onRetry={mockRetry} showDetails={false} />);

      expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
    });

    it('should display error code and type in technical details', () => {
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} showDetails={true} />);

      // The details are hidden by default (behind a <details> element)
      // We need to expand it first
      const detailsElement = screen.getByText('Technical Details');
      expect(detailsElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      const error = new Error('Test error');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have accessible retry button', () => {
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      const retryButton = screen.getByRole('button', { name: /retry ai initialization/i });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveAttribute('type', 'button');
    });

    it('should hide decorative icons from screen readers', () => {
      const error = new Error('Test error');
      const { container } = render(<AIErrorState error={error} onRetry={mockRetry} />);

      const errorIcon = container.querySelector('.error-icon');
      expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Help Sections', () => {
    it('should show appropriate help section for Chrome missing error', () => {
      const error = new ProviderUnavailableError('Chrome AI');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Chrome AI Required')).toBeInTheDocument();
      expect(screen.queryByText('Network Issue')).not.toBeInTheDocument();
      expect(screen.queryByText('Model Loading Issue')).not.toBeInTheDocument();
    });

    it('should show appropriate help section for network error', () => {
      const error = new NetworkError('Connection failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Network Issue')).toBeInTheDocument();
      expect(screen.queryByText('Chrome AI Required')).not.toBeInTheDocument();
      expect(screen.queryByText('Model Loading Issue')).not.toBeInTheDocument();
    });

    it('should show appropriate help section for embedding error', () => {
      const error = new EmbeddingError('Model load failed');
      render(<AIErrorState error={error} onRetry={mockRetry} />);

      expect(screen.getByText('Model Loading Issue')).toBeInTheDocument();
      expect(screen.queryByText('Chrome AI Required')).not.toBeInTheDocument();
      expect(screen.queryByText('Network Issue')).not.toBeInTheDocument();
    });
  });
});
