import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Frosted glass card — easy rise Stitch design.
 * White at 92% opacity, backdrop-blur, 24px radius (28px tall, 20px row),
 * 1px white top-left highlight, soft wide shadow.
 * **Never drop below 88% opacity** — Bengali conjuncts break below that.
 */
export function GlassCard({
  variant = 'default', // 'default' | 'tall' | 'row'
  children,
  className,
  ...props
}) {
  const radiusClass =
    variant === 'tall'
      ? 'rounded-[18px]'
      : variant === 'row'
      ? 'rounded-lg'
      : 'rounded-xl';

  return (
    <div
      className={cn(
        'glass p-4',
        radiusClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
