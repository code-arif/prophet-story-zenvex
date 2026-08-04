import React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90',
        secondary:
          'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90',
        outline:
          'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
        ghost: 'bg-transparent hover:bg-[hsl(var(--muted))]',
        destructive:
          'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90',
        // ── "Learn English" (learner UI) variants — additive, admin-safe ──
        ai: 'bg-learn-ai text-white hover:opacity-90',
        outlineBlue:
          'border-2 border-learn-primary bg-transparent text-learn-primary hover:bg-learn-primary-tint',
        outlineViolet:
          'border-2 border-learn-ai bg-transparent text-learn-ai hover:bg-learn-ai-tint',
        soft: 'bg-learn-primary-tint text-learn-primary hover:opacity-90',
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-9 px-3',
        lg: 'h-12 px-5 text-base',
        icon: 'size-11',
        // Learner primary action: 52px tall, full width (Stitch design).
        learner: 'h-[52px] w-full rounded-[14px] px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});

export { Button, buttonVariants };
