// Voice Recorder for Board EOI — Record your statement of interest
// Uses browser MediaRecorder API, uploads to Supabase Storage

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingRemoved: () => void;
  maxDurationSeconds?: number;
}

export default function VoiceRecorder({
  onRecordingComplete,
  onRecordingRemoved,
  maxDurationSeconds = 120,
}: VoiceRecorderProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;

        // Create audio element for playback
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }
        const audio = new Audio(URL.createObjectURL(blob));
        audio.onended = () => setIsPlaying(false);
        audioRef.current = audio;

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        setState('recorded');
        onRecordingComplete(blob);
      };

      recorder.start(250); // Collect data every 250ms
      setState('recording');
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= maxDurationSeconds) {
            recorder.stop();
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Could not start recording. Please check your microphone.');
      }
    }
  }, [maxDurationSeconds, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const removeRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    blobRef.current = null;
    setElapsed(0);
    setIsPlaying(false);
    setState('idle');
    onRecordingRemoved();
  }, [onRecordingRemoved]);

  const remaining = maxDurationSeconds - elapsed;
  const progress = (elapsed / maxDurationSeconds) * 100;

  return (
    <div className="bg-[#252547] border border-[#d4af37]/30 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-bold text-sm">
          Record Your Statement (Optional)
        </h4>
        <span className="text-gray-400 text-xs">
          Up to {Math.floor(maxDurationSeconds / 60)} minutes
        </span>
      </div>

      <p className="text-gray-400 text-xs mb-4">
        Prefer speaking to writing? Record a voice statement about why you want to join the board.
        Your voice matters — literally.
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-xs">{error}</p>
        </div>
      )}

      {/* Idle state — start button */}
      {state === 'idle' && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#d4af37]/10 border-2 border-dashed border-[#d4af37]/40 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all"
        >
          <Mic className="w-5 h-5" />
          <span className="font-medium">Tap to Record</span>
        </button>
      )}

      {/* Recording state */}
      {state === 'recording' && (
        <div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-700 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-red-400 text-sm font-medium">Recording</span>
            </div>
            <span className="text-gray-300 text-sm font-mono">
              {formatTime(elapsed)} / {formatTime(maxDurationSeconds)}
            </span>
          </div>

          {remaining <= 15 && (
            <p className="text-amber-400 text-xs mb-3">
              {remaining} seconds remaining
            </p>
          )}

          <button
            type="button"
            onClick={stopRecording}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </button>
        </div>
      )}

      {/* Recorded state — playback + controls */}
      {state === 'recorded' && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#e5c349] transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Voice Statement</p>
              <p className="text-gray-400 text-xs">{formatTime(elapsed)} recorded</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={removeRecording}
                title="Remove recording"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  removeRecording();
                  // Small delay then auto-start
                  setTimeout(startRecording, 100);
                }}
                title="Re-record"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-green-400 text-xs">
            Your voice recording will be submitted with your application.
          </p>
        </div>
      )}
    </div>
  );
}
