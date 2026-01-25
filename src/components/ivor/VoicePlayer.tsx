import React, { useState, useRef, useEffect } from 'react';

interface VoicePlayerProps {
  audioUrl: string;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * VoicePlayer Component
 *
 * WCAG 2.1 AA compliant audio player for IVOR voice responses
 * Features:
 * - Keyboard accessible (Space/Enter to play/pause)
 * - Screen reader support
 * - Visual feedback for loading and playing states
 * - Volume control
 * - Error handling with fallback to text
 */
export function VoicePlayer({ audioUrl, onError, className = '' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Event listeners
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = (e: ErrorEvent) => {
      const errorMsg = 'Unable to play audio. Displaying text instead.';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
      console.error('[VoicePlayer] Audio error:', e);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Set initial volume
    audio.volume = volume;

    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current = null;
    };
  }, [audioUrl, volume, onError]);

  // Play/pause handler
  const togglePlayPause = () => {
    if (!audioRef.current || error) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        const errorMsg = 'Failed to play audio. Please try again.';
        setError(errorMsg);
        onError?.(errorMsg);
        console.error('[VoicePlayer] Play error:', err);
      });
    }
  };

  // Volume change handler
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      togglePlayPause();
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If error, return null (parent can show text fallback)
  if (error) {
    return null;
  }

  return (
    <div
      className={`voice-player ${className}`}
      role="region"
      aria-label="Audio player for IVOR response"
    >
      <div className="voice-player__controls">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !!error}
          className="voice-player__play-button"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          aria-pressed={isPlaying}
          type="button"
        >
          {isLoading ? (
            <span className="voice-player__loading" aria-live="polite">
              Loading...
            </span>
          ) : isPlaying ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="voice-player__progress">
          <div
            className="voice-player__progress-bar"
            role="progressbar"
            aria-valuenow={duration > 0 ? (currentTime / duration) * 100 : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Audio playback progress"
          >
            <div
              className="voice-player__progress-fill"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="voice-player__time" aria-live="off">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="voice-player__volume">
          <label htmlFor="voice-volume" className="voice-player__volume-label">
            <span className="sr-only">Volume</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          </label>
          <input
            id="voice-volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="voice-player__volume-slider"
            aria-label="Volume control"
            aria-valuetext={`${Math.round(volume * 100)}%`}
          />
        </div>
      </div>

      {/* Hidden text for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isPlaying && 'Audio playing'}
        {isLoading && 'Audio loading'}
      </div>
    </div>
  );
}

// CSS for VoicePlayer (add to global styles or component styles)
export const voicePlayerStyles = `
.voice-player {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.voice-player__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.voice-player__play-button {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: #6d28d9;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.voice-player__play-button:hover:not(:disabled) {
  background: #5b21b6;
}

.voice-player__play-button:focus-visible {
  outline: 2px solid #6d28d9;
  outline-offset: 2px;
}

.voice-player__play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-player__loading {
  font-size: 0.75rem;
}

.voice-player__progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.voice-player__progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e5e5;
  border-radius: 3px;
  overflow: hidden;
}

.voice-player__progress-fill {
  height: 100%;
  background: #6d28d9;
  transition: width 0.1s linear;
}

.voice-player__time {
  font-size: 0.75rem;
  color: #666;
  display: flex;
  gap: 0.25rem;
}

.voice-player__volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.voice-player__volume-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.voice-player__volume-slider {
  width: 80px;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .voice-player__play-button {
    border: 2px solid currentColor;
  }

  .voice-player__progress-bar {
    border: 1px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .voice-player__progress-fill {
    transition: none;
  }

  .voice-player__play-button {
    transition: none;
  }
}
`;
