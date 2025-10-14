/**
 * Tests for AILoadingState component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AILoadingState } from '../AILoadingState';

describe('AILoadingState', () => {
  describe('Rendering', () => {
    it('should render loading UI', () => {
      render(<AILoadingState progress={50} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Setting up AI')).toBeInTheDocument();
    });

    it('should display progress percentage', () => {
      render(<AILoadingState progress={75} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should display custom message', () => {
      render(<AILoadingState progress={50} message="Downloading models..." />);

      expect(screen.getByText('Downloading models...')).toBeInTheDocument();
    });

    it('should display status message', () => {
      render(
        <AILoadingState
          progress={50}
          message="Loading..."
          statusMessage="This may take a minute..."
        />
      );

      expect(screen.getByText('This may take a minute...')).toBeInTheDocument();
    });

    it('should show privacy note', () => {
      render(<AILoadingState progress={50} />);

      expect(screen.getByText(/Models download once and stay on your device/i)).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar with correct width', () => {
      const { container } = render(<AILoadingState progress={60} />);

      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toHaveStyle({ width: '60%' });
    });

    it('should clamp progress to 0-100 range', () => {
      const { container, rerender } = render(<AILoadingState progress={-10} />);

      let progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toHaveStyle({ width: '0%' });

      rerender(<AILoadingState progress={150} />);
      progressFill = container.querySelector('.progress-fill');
      expect(progressFill).toHaveStyle({ width: '100%' });
    });

    it('should have correct ARIA attributes', () => {
      render(<AILoadingState progress={45} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '45');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(<AILoadingState progress={50} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have descriptive aria-label', () => {
      render(<AILoadingState progress={75} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Loading AI system: 75% complete');
    });

    it('should hide decorative elements from screen readers', () => {
      const { container } = render(<AILoadingState progress={50} />);

      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');

      const privacyIcon = container.querySelector('.privacy-icon');
      expect(privacyIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Progress Updates', () => {
    it('should update progress dynamically', () => {
      const { rerender } = render(<AILoadingState progress={25} />);

      expect(screen.getByText('25%')).toBeInTheDocument();

      rerender(<AILoadingState progress={75} />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should update messages dynamically', () => {
      const { rerender } = render(<AILoadingState progress={25} message="Starting..." />);

      expect(screen.getByText('Starting...')).toBeInTheDocument();

      rerender(<AILoadingState progress={75} message="Almost done..." />);

      expect(screen.getByText('Almost done...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0% progress', () => {
      render(<AILoadingState progress={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle 100% progress', () => {
      render(<AILoadingState progress={100} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should handle missing message', () => {
      render(<AILoadingState progress={50} />);

      expect(screen.getByText('Setting up AI')).toBeInTheDocument();
    });

    it('should round fractional progress', () => {
      render(<AILoadingState progress={45.7} />);

      expect(screen.getByText('46%')).toBeInTheDocument();
    });
  });
});
