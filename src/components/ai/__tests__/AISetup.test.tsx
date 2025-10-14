/**
 * Tests for AISetup component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AISetup } from '../AISetup';
import * as useAIStatusModule from '@/hooks/useAIStatus';

// Mock the useAIStatus hook
vi.mock('@/hooks/useAIStatus');

describe('AISetup', () => {
  const mockRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Uninitialized State', () => {
    it('should show uninitialized UI when status is uninitialized', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'uninitialized',
        provider: null,
        error: null,
        progress: 0,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: false,
      });

      render(<AISetup autoInitialize={false} />);

      expect(screen.getByText('AI Not Initialized')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /initialize ai/i })).toBeInTheDocument();
    });
  });

  describe('Initializing State', () => {
    it('should show loading state when initializing', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'initializing',
        provider: null,
        error: null,
        progress: 50,
        progressMessage: 'Loading models...',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: true,
      });

      render(<AISetup />);

      expect(screen.getByText('Setting up AI')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('Loading models...')).toBeInTheDocument();
    });

    it('should show different status messages based on progress', () => {
      const { rerender } = render(<AISetup />);

      // Early progress
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'initializing',
        provider: null,
        error: null,
        progress: 10,
        progressMessage: 'Starting...',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: true,
      });
      rerender(<AISetup />);
      expect(screen.getByText(/Connecting to AI provider/i)).toBeInTheDocument();

      // Mid progress
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'initializing',
        provider: null,
        error: null,
        progress: 50,
        progressMessage: 'Loading...',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: true,
      });
      rerender(<AISetup />);
      expect(screen.getByText(/This may take a minute/i)).toBeInTheDocument();

      // Late progress
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'initializing',
        provider: null,
        error: null,
        progress: 95,
        progressMessage: 'Finishing...',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: true,
      });
      rerender(<AISetup />);
      expect(screen.getByText(/Almost ready/i)).toBeInTheDocument();
    });
  });

  describe('Ready State', () => {
    it('should show success state when ready', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: {
          name: 'Chrome AI',
          type: 'chrome-ai',
        } as any,
        error: null,
        progress: 100,
        progressMessage: 'AI system ready',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: true,
        isLoading: false,
      });

      render(<AISetup />);

      expect(screen.getByText('AI Ready!')).toBeInTheDocument();
      expect(screen.getByText(/Everything runs on your device/i)).toBeInTheDocument();
      expect(screen.getByText(/100% on-device processing/i)).toBeInTheDocument();
      expect(screen.getByText(/Your data never leaves your browser/i)).toBeInTheDocument();
    });

    it('should call onComplete when ready', async () => {
      const onComplete = vi.fn();

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: 'Ready',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: true,
        isLoading: false,
      });

      render(<AISetup onComplete={onComplete} />);

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error State', () => {
    it('should show error state when error occurs', () => {
      const error = new Error('Test error');

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'error',
        provider: null,
        error,
        progress: 0,
        progressMessage: 'Initialization failed',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: false,
      });

      render(<AISetup />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('AI Setup Failed')).toBeInTheDocument();
    });

    it('should call onError when error occurs', async () => {
      const onError = vi.fn();
      const error = new Error('Test error');

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'error',
        provider: null,
        error,
        progress: 0,
        progressMessage: 'Failed',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: false,
      });

      render(<AISetup onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Degraded State', () => {
    it('should show degraded state when system is degraded', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'degraded',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: false,
        isLoading: false,
      });

      render(<AISetup />);

      expect(screen.getByText(/AI Running with Limited Functionality/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reinitialize/i })).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should respect autoInitialize prop', () => {
      const initialize = vi.fn();

      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'uninitialized',
        provider: null,
        error: null,
        progress: 0,
        progressMessage: '',
        health: null,
        initialize,
        retry: mockRetry,
        isReady: false,
        isLoading: false,
      });

      render(<AISetup autoInitialize={false} />);

      expect(useAIStatusModule.useAIStatus).toHaveBeenCalledWith(false);
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
        retry: mockRetry,
        isReady: true,
        isLoading: false,
      });

      const { container } = render(<AISetup className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Feature List', () => {
    it('should show all feature highlights in ready state', () => {
      vi.mocked(useAIStatusModule.useAIStatus).mockReturnValue({
        status: 'ready',
        provider: null,
        error: null,
        progress: 100,
        progressMessage: '',
        health: null,
        initialize: vi.fn(),
        retry: mockRetry,
        isReady: true,
        isLoading: false,
      });

      render(<AISetup />);

      expect(screen.getByText(/100% on-device processing/i)).toBeInTheDocument();
      expect(screen.getByText(/Your data never leaves your browser/i)).toBeInTheDocument();
      expect(screen.getByText(/Fast and responsive/i)).toBeInTheDocument();
    });
  });
});
