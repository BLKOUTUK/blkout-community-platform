/// <reference types="jest" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VoicePlayer } from '../VoicePlayer';

// Mock HTMLAudioElement
class MockAudio {
  src = '';
  volume = 0.8;
  currentTime = 0;
  duration = 0;
  paused = true;

  private listeners: { [key: string]: Function[] } = {};

  play = jest.fn(() => {
    this.paused = false;
    this.dispatchEvent('play');
    return Promise.resolve();
  });

  pause = jest.fn(() => {
    this.paused = true;
    this.dispatchEvent('pause');
  });

  addEventListener = jest.fn((event: string, handler: Function) => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  });

  removeEventListener = jest.fn((event: string, handler: Function) => {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    }
  });

  dispatchEvent(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((handler) => handler(data || {}));
    }
  }
}

// Replace global Audio
(global as any).Audio = MockAudio;

describe('VoicePlayer Component', () => {
  const mockAudioUrl = 'https://example.com/audio.mp3';
  const mockText = 'Hello, I am IVOR.';
  let mockAudio: MockAudio;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAudio = new MockAudio();
    (global as any).Audio = jest.fn(() => mockAudio);
  });

  describe('Rendering', () => {
    test('should render play button', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button', { name: /play audio/i });
      expect(playButton).toBeInTheDocument();
    });

    test('should render volume control', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const volumeSlider = screen.getByRole('slider', { name: /volume control/i });
      expect(volumeSlider).toBeInTheDocument();
    });

    test('should render progress bar', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    test('should apply custom className', () => {
      const { container } = render(
        <VoicePlayer audioUrl={mockAudioUrl} text={mockText} className="custom-class" />
      );

      const player = container.querySelector('.voice-player');
      expect(player).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');
      expect(playButton).toHaveAttribute('aria-label', 'Play audio');

      const volumeSlider = screen.getByRole('slider');
      expect(volumeSlider).toHaveAttribute('aria-label', 'Volume control');

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Audio playback progress');
    });

    test('should support keyboard navigation', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');

      // Press Space key
      fireEvent.keyDown(playButton, { key: ' ' });
      expect(mockAudio.play).toHaveBeenCalled();

      // Press Enter key
      fireEvent.keyDown(playButton, { key: 'Enter' });
      expect(mockAudio.play).toHaveBeenCalledTimes(2);
    });

    test('should have screen reader announcements', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const liveRegion = screen.getByText(/audio playing|audio loading/i);
      expect(liveRegion.parentElement).toHaveAttribute('aria-live', 'polite');
    });

    test('should mark decorative icons as aria-hidden', () => {
      const { container } = render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const icons = container.querySelectorAll('svg');
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Play/Pause Functionality', () => {
    test('should play audio on button click', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(mockAudio.play).toHaveBeenCalled();
      });
    });

    test('should pause audio when playing', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');

      // Start playing
      fireEvent.click(playButton);
      mockAudio.dispatchEvent('play');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause audio/i })).toBeInTheDocument();
      });

      // Pause
      fireEvent.click(playButton);
      expect(mockAudio.pause).toHaveBeenCalled();
    });

    test('should update button label when playing', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');

      expect(playButton).toHaveAttribute('aria-label', 'Play audio');

      fireEvent.click(playButton);
      mockAudio.dispatchEvent('play');

      await waitFor(() => {
        expect(playButton).toHaveAttribute('aria-label', 'Pause audio');
      });
    });

    test('should update aria-pressed state', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const playButton = screen.getByRole('button');

      expect(playButton).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(playButton);
      mockAudio.dispatchEvent('play');

      await waitFor(() => {
        expect(playButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Volume Control', () => {
    test('should change volume on slider input', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const volumeSlider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      expect(mockAudio.volume).toBe(0.5);
    });

    test('should update aria-valuetext on volume change', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const volumeSlider = screen.getByRole('slider') as HTMLInputElement;
      fireEvent.change(volumeSlider, { target: { value: '0.3' } });

      expect(volumeSlider).toHaveAttribute('aria-valuetext', '30%');
    });

    test('should have correct volume range', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      const volumeSlider = screen.getByRole('slider') as HTMLInputElement;

      expect(volumeSlider).toHaveAttribute('min', '0');
      expect(volumeSlider).toHaveAttribute('max', '1');
      expect(volumeSlider).toHaveAttribute('step', '0.1');
    });
  });

  describe('Progress Tracking', () => {
    test('should update progress bar on timeupdate', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      // Simulate canplay event with duration
      mockAudio.duration = 60;
      mockAudio.dispatchEvent('canplay');

      // Simulate time update
      mockAudio.currentTime = 30;
      mockAudio.dispatchEvent('timeupdate');

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      });
    });

    test('should display formatted time', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.duration = 125; // 2:05
      mockAudio.dispatchEvent('canplay');

      mockAudio.currentTime = 65; // 1:05
      mockAudio.dispatchEvent('timeupdate');

      await waitFor(() => {
        expect(screen.getByText('1:05')).toBeInTheDocument();
        expect(screen.getByText('2:05')).toBeInTheDocument();
      });
    });

    test('should reset on audio end', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.currentTime = 60;
      mockAudio.dispatchEvent('timeupdate');

      mockAudio.dispatchEvent('ended');

      await waitFor(() => {
        const playButton = screen.getByRole('button', { name: /play audio/i });
        expect(playButton).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    test('should show loading indicator', () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.dispatchEvent('loadstart');

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should disable button while loading', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.dispatchEvent('loadstart');

      const playButton = screen.getByRole('button');
      expect(playButton).toBeDisabled();
    });

    test('should hide loading when ready', async () => {
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.dispatchEvent('loadstart');
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      mockAudio.dispatchEvent('canplay');

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should call onError callback on audio error', async () => {
      const onError = jest.fn();
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} onError={onError} />);

      mockAudio.dispatchEvent('error', new ErrorEvent('error'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.stringContaining('Unable to play audio')
        );
      });
    });

    test('should not render player on error', async () => {
      const { container } = render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      mockAudio.dispatchEvent('error', new ErrorEvent('error'));

      await waitFor(() => {
        expect(container.querySelector('.voice-player')).not.toBeInTheDocument();
      });
    });

    test('should handle play promise rejection', async () => {
      const onError = jest.fn();
      render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} onError={onError} />);

      mockAudio.play = jest.fn(() => Promise.reject(new Error('Play failed')));

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Cleanup', () => {
    test('should pause and cleanup on unmount', () => {
      const { unmount } = render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      unmount();

      expect(mockAudio.pause).toHaveBeenCalled();
      expect(mockAudio.removeEventListener).toHaveBeenCalled();
    });

    test('should cleanup event listeners', () => {
      const { unmount } = render(<VoicePlayer audioUrl={mockAudioUrl} text={mockText} />);

      unmount();

      const events = ['loadstart', 'canplay', 'play', 'pause', 'ended', 'error', 'timeupdate'];
      events.forEach((event) => {
        expect(mockAudio.removeEventListener).toHaveBeenCalledWith(event, expect.any(Function));
      });
    });
  });
});
