import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      {...props}
      ref={ref}
    />
  );
});

const SheetContent = React.forwardRef(function SheetContent(
  { side = 'left', className, children, hideHeader = false, ...props },
  ref
) {
  const sideClass =
    side === 'left'
      ? 'left-0 top-0 h-dvh w-[82%] max-w-sm'
      : side === 'right'
        ? 'right-0 top-0 h-dvh w-[82%] max-w-sm'
        : side === 'bottom'
          ? 'bottom-0 left-0 right-0 top-auto max-h-[85dvh] w-full rounded-t-[20px]'
          : 'left-0 right-0 top-0';

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))] data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideClass,
          className
        )}
        {...props}
      >
        <div className="flex h-full flex-col">
          {!hideHeader && (
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-4">
              <div className="text-base font-semibold">Menu</div>
              <SheetClose className="inline-flex size-10 items-center justify-center rounded-xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          )}
          <div className={cn('flex-1 overflow-auto', hideHeader ? '' : 'p-4')}>{children}</div>
        </div>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});

export { Sheet, SheetTrigger, SheetClose, SheetContent };
