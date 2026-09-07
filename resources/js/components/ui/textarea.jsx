import React from 'react';

import { cn } from '../../lib/utils';

const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-base text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export { Textarea };