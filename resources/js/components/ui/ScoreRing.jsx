import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Score ring — easy rise Stitch design.
 * Large circular gauge (120px) with arc and centre score.
 * Three slim sub-score bars beneath.
 * Used in Niche Fit Scorer result (Screen 08).
 */
export function ScoreRing({
  score = 0,
  max = 100,
  subScores = [],
  label,
  className,
}) {
  const size = 120;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1D6FF2"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[32px] font-bold text-brand font-bn">{score}</span>
        </div>
      </div>

      {label && (
        <p className="text-[14px] font-semibold text-ink text-center font-bn">{label}</p>
      )}

      {/* Sub-scores */}
      {subScores.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {subScores.map((sub, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[12px] text-muted w-24 text-right font-bn">{sub.label}</span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-border-rest">
                <div
                  className={cn('h-full rounded-full', sub.color || 'bg-brand')}
                  style={{ width: `${sub.value}%` }}
                />
              </div>
              <span className="text-[12px] font-bold text-ink w-8 font-bn">{sub.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
