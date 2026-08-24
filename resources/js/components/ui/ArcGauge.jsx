import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Arc gauge — easy rise Stitch design.
 * Semi-circular gauge with needle. Fill: #1D6FF2 → #D97706 past 100%.
 * Centre: "current / max" in bold.
 * Used in Capacity Meter (Screen 20).
 */
export function ArcGauge({
  value = 0,
  max = 100,
  size = 200,
  className,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const isOver = value > max;
  const strokeColor = isOver ? '#D97706' : '#1D6FF2';

  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          {/* Background arc */}
          <path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-[28px] font-bold text-ink font-bn">
            {value} / {max}
          </span>
          <span className="text-[13px] text-muted font-bn">ঘণ্টা</span>
        </div>
      </div>
    </div>
  );
}
