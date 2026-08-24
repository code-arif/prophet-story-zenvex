import React from 'react';
import { cn } from '../../lib/utils';

/**
 * List row — easy rise Stitch design.
 * 76px height, 44px tinted icon container, title, subtitle,
 * trailing slot (StatusChip, Chevron, Pill, Value).
 * Touch target: entire row (48px min).
 */
export function ListRow({
  icon,
  iconBg = 'bg-inset-blue',
  iconColor = 'text-brand',
  title,
  subtitle,
  trailing,
  onClick,
  className,
  ...props
}) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex h-[76px] items-center gap-3 w-full text-left',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
      {...props}
    >
      {/* Icon container */}
      {icon && (
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            iconBg,
            iconColor
          )}
        >
          {icon}
        </div>
      )}

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink font-bn">{title}</p>
        {subtitle && (
          <p className="truncate text-[13px] text-muted font-bn">{subtitle}</p>
        )}
      </div>

      {/* Trailing */}
      {trailing && (
        <div className="shrink-0">{trailing}</div>
      )}
    </Tag>
  );
}
