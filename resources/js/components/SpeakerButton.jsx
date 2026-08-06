import React from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { speak } from '../lib/speech';

const SIZES = {
  sm: 'size-12 [&>svg]:size-5',
  md: 'size-12 [&>svg]:size-5',
  lg: 'size-14 [&>svg]:size-6',
};

/**
 * Circular speaker button — speaks `text` via speechSynthesis using the
 * subscriber's saved voice + reading-speed preferences (device voice,
 * offline when a matching voice exists). No network fallback.
 */
export function SpeakerButton({ text, size = 'md', tone = 'blue', className, ...props }) {
  const handleSpeak = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!text) return;
    speak(text);
  };

  return (
    <button
      type="button"
      aria-label="শুনুন"
      onClick={handleSpeak}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95',
        SIZES[size] || SIZES.md,
        tone === 'blue'
          ? 'bg-learn-primary-tint text-learn-primary'
          : 'bg-learn-structure text-learn-muted',
        className
      )}
      {...props}
    >
      <Volume2 strokeWidth={2} />
    </button>
  );
}
