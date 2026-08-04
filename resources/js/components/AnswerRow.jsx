import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const STATES = {
  idle: {
    row: 'border border-learn-border bg-white',
    circle: 'bg-learn-bg text-learn-muted',
  },
  selected: {
    row: 'border-2 border-learn-primary bg-learn-primary-tint',
    circle: 'bg-learn-primary text-white',
  },
  correct: {
    row: 'border border-learn-success bg-learn-success-tint',
    circle: 'bg-learn-success text-white',
  },
  wrong: {
    row: 'border border-learn-danger bg-learn-danger-tint',
    circle: 'bg-learn-danger text-white',
  },
};

/**
 * 56px full-width answer/option row with a letter circle (Stitch design).
 * `state`: "idle" | "selected" | "correct" | "wrong".
 */
export function AnswerRow({ letter, label, state = 'idle', disabled, onClick, className }) {
  const s = STATES[state] || STATES.idle;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-14 w-full items-center gap-3 rounded-[14px] px-3 text-left transition-all duration-150 active:scale-[0.99]',
        s.row,
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
          s.circle
        )}
      >
        {state === 'correct' ? <Check className="size-4" /> : state === 'wrong' ? <X className="size-4" /> : letter}
      </span>
      <span className="text-[15px] font-medium text-learn-ink">{label}</span>
    </button>
  );
}
