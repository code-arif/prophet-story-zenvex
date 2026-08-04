import React from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

const SIZES = {
  sm: 'size-12 [&>svg]:size-5',
  md: 'size-12 [&>svg]:size-5',
  lg: 'size-14 [&>svg]:size-6',
};

/**
 * Circular speaker button — speaks `text` in English via speechSynthesis
 * (device voice, offline when an English voice exists). No network fallback.
 */
export function SpeakerButton({ text, size = 'md', tone = 'blue', className, ...props }) {
  const speak = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      aria-label="শুনুন"
      onClick={speak}
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
