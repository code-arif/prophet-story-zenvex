import React from 'react';
import { cn } from '../lib/utils';

const TONES = {
  primary: '#2B59C3',
  success: '#17A673',
  ai: '#7C6BF5',
};

/**
 * Circular score ring (placement result, quiz result, pronunciation score).
 * `value` is a percentage 0–100; `children` renders the centered text.
 */
export function ScoreRing({ value = 0, size = 140, stroke = 10, tone = 'success', children, className }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = TONES[tone] || TONES.success;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EAF0FC"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
