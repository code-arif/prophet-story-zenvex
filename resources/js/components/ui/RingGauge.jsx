import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Ring gauge — easy rise Stitch design.
 * Circular progress ring with centre value.
 * Used in Learn hub, Document Readiness.
 */
export function RingGauge({
  value = 0,
  max = 100,
  size = 80,
  stroke = 8,
  label,
  className,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={stroke}
          />
          {/* Value ring */}
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
            className="transition-all duration-500"
          />
        </svg>
        {/* Centre value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[18px] font-bold text-brand font-bn">{value}%</span>
        </div>
      </div>
      {label && (
        <span className="text-[12px] text-muted text-center font-bn">{label}</span>
      )}
    </div>
  );
}
