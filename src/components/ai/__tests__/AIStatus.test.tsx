/**
 * Tests for AIStatus component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIStatus } from '../AIStatus';
import * as useAIStatusModule from '@/hooks/useAIStatus';

// Mock the useAIStatus hook
vi.mock('@/hooks/useAIStatus');

describe('AIStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Status States', () => {
    it('should show uninitialized status', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'uninitialized',
        provider: null,
        error: null,
        progress: 0,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: false,
      });

      render(<AIStatus />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI system is offline');
      expect(screen.getByText('AI Offline')).toBeInTheDocument();
    });

    it('should show initializing status', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'initializing',
        provider: null,
        error: null,
        progress: 50,
        progressMessage: 'Loading...',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: true,
      });

      render(<AIStatus />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI system is initializing');
      expect(screen.getByText('AI Loading...')).toBeInTheDocument();
    });

    it('should show ready status', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: {
          name: 'Chrome AI',
          type: 'chrome-ai',
        } as any,
        error: null,
        progress: 100,
        progressMessage: 'Ready',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI system is ready');
      expect(screen.getByText('AI Ready')).toBeInTheDocument();
    });

    it('should show error status', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'error',
        provider: null,
        error: new Error('Test error'),
        progress: 0,
        progressMessage: 'Failed',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: false,
      });

      render(<AIStatus />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI system has an error');
      expect(screen.getByText('AI Error')).toBeInTheDocument();
    });

    it('should show degraded status', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'degraded',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: false,
      });

      render(<AIStatus />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI system is running with limited functionality');
      expect(screen.getByText('AI Degraded')).toBeInTheDocument();
    });
  });

  describe('Provider Display', () => {
    it('should show provider name when showProvider is true', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: {
          name: 'Chrome AI',
          type: 'chrome-ai',
        } as any,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus showProvider />);

      expect(screen.getByText('Chrome AI')).toBeInTheDocument();
    });

    it('should hide provider name when showProvider is false', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: {
          name: 'Chrome AI',
          type: 'chrome-ai',
        } as any,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus showProvider={false} />);

      expect(screen.queryByText('Chrome AI')).not.toBeInTheDocument();
    });

    it('should not show provider when provider is null', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'uninitialized',
        provider: null,
        error: null,
        progress: 0,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: false,
      });

      render(<AIStatus showProvider />);

      expect(screen.queryByText('Chrome AI')).not.toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should hide status text in compact mode', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus compact />);

      expect(screen.queryByText('AI Ready')).not.toBeInTheDocument();
    });

    it('should show status text in non-compact mode', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus compact={false} />);

      expect(screen.getByText('AI Ready')).toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus onClick={onClick} />);

      const status = screen.getByRole('status');
      await user.click(status);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible when onClick is provided', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus onClick={onClick} />);

      const status = screen.getByRole('status');
      status.focus();

      // Press Enter
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('should have tabIndex when onClick is provided', () => {
      const onClick = vi.fn();

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus onClick={onClick} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('tabIndex', '0');
    });

    it('should not have tabIndex when onClick is not provided', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      render(<AIStatus />);

      const status = screen.getByRole('status');
      expect(status).not.toHaveAttribute('tabIndex');
    });
  });

  describe('CSS Classes', () => {
    it('should apply status color class', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      const { container } = render(<AIStatus />);

      const status = container.querySelector('.ai-status-green');
      expect(status).toBeInTheDocument();
    });

    it('should apply compact class when compact is true', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      const { container } = render(<AIStatus compact />);

      const status = container.querySelector('.ai-status-compact');
      expect(status).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: true,
        isLoading: false,
      });

      const { container } = render(<AIStatus className="custom-class" />);

      const status = container.querySelector('.custom-class');
      expect(status).toBeInTheDocument();
    });
  });

  describe('Auto-initialization', () => {
    it('should not auto-initialize from status indicator', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'uninitialized',
        provider: null,
        error: null,
        progress: 0,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: vi.fn(),
        isReady: false,
        isLoading: false,
      });

      render(<AIStatus />);

      expect(useAIStatusModule.useAIStatus).toHaveBeenCalledWith(false);
    });
  });
});
