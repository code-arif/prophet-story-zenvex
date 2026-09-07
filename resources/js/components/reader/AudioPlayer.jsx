import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { cn } from '../../lib/utils';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * AudioPlayer — narrated-audio control for a chapter.
 *
 * Simple native Audio API (no custom waveform): play/pause + skip back 10s,
 * with a slim progress bar and time readout. `variant="kid"` renders a big,
 * Palm Green, thumb-friendly control — younger children may rely on audio
 * more than reading, so Kid Mode positions it prominently.
 */
export default function AudioPlayer({ src, variant = 'standard', className }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const isKid = variant === 'kid';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => {
      setDuration(audio.duration || 0);
      setError(false);
    };
    const onEnd = () => setPlaying(false);
    const onError = () => setError(true);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
    };
  }, [src]);

  // Reset UI state when the chapter (and therefore the src) changes.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setError(false);
  }, [src]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setError(true);
    }
  }

  function skipBack() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    setCurrent(audio.currentTime);
  }

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div
      role="group"
      aria-label="অডিও শোনা"
      className={cn(
        'select-none',
        isKid
          ? 'rounded-3xl border-2 border-kid/25 bg-kid/10 p-4 shadow-md shadow-kid/10'
          : 'rounded-2xl border border-primary/15 bg-white/70 px-4 py-3',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3 sm:gap-4">
        {isKid && (
          <span className="flex items-center gap-1.5 text-[14px] font-black text-kid">
            <Volume2 className="size-5" strokeWidth={2.4} />
            শুনুন
          </span>
        )}

        {/* Skip back 10s */}
        <button
          type="button"
          onClick={skipBack}
          aria-label="১০ সেকেন্ড পেছান"
          className={cn(
            'flex items-center justify-center rounded-full font-black transition-colors active:scale-95',
            isKid
              ? 'size-12 bg-white text-kid shadow-sm ring-2 ring-kid/30 hover:bg-kid/10'
              : 'size-9 text-primary hover:bg-primary/10'
          )}
        >
          <RotateCcw className={isKid ? 'size-6' : 'size-4.5'} strokeWidth={2.6} />
          <span className={cn('font-black leading-none', isKid ? 'text-[10px] -ml-0.5' : 'text-[8px] ml-0.5')}>10</span>
        </button>

        {/* Play / pause */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'থামান' : 'শুনুন'}
          className={cn(
            'flex items-center justify-center rounded-full text-white transition-all active:scale-95',
            isKid
              ? 'size-16 shrink-0 bg-kid shadow-lg shadow-kid/40 hover:bg-kid/90'
              : 'size-11 shrink-0 bg-primary shadow-md shadow-primary/25 hover:bg-primary/90'
          )}
        >
          {playing ? (
            <Pause className={isKid ? 'size-8 fill-current' : 'size-5 fill-current'} />
          ) : (
            <Play className={cn('fill-current', isKid ? 'size-8' : 'size-5')} />
          )}
        </button>

        {/* Progress + time */}
        <div className="min-w-0 flex-1">
          <div className={cn('h-1.5 w-full overflow-hidden rounded-full', isKid ? 'bg-kid/20' : 'bg-primary/15')}>
            <div
              className={cn('h-full rounded-full transition-[width]', isKid ? 'bg-kid' : 'bg-primary')}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={cn('mt-1 flex items-center justify-between text-[11px] font-bold tabular-nums', isKid ? 'text-kid' : 'text-muted')}>
            <span>{formatTime(current)}</span>
            <span>{duration > 0 ? formatTime(duration) : error ? 'চালানো যাচ্ছে না' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}