import React from 'react';
import { cn } from '../lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';

/**
 * Bottom sheet — the learner app's replacement for modals (design rule).
 * Built on the shared ui/sheet primitive (side="bottom", header hidden).
 *
 * Usage:
 *   <BottomSheet open={open} onOpenChange={setOpen} title="শব্দের অর্থ">
 *     ...content...
 *   </BottomSheet>
 *   or trigger-based: <BottomSheet trigger={<button>…</button>}>…</BottomSheet>
 */
export function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  className,
  ...props
}) {
  const content = (
    <SheetContent side="bottom" hideHeader className="px-5 pb-8 pt-2" {...props}>
      <div className="mx-auto w-full max-w-[960px]">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-learn-border" />
        {title && (
          <h2 className="mb-3 text-[16px] font-bold text-learn-ink">{title}</h2>
        )}
        <div className={cn('text-learn-ink', className)}>{children}</div>
      </div>
    </SheetContent>
  );

  if (trigger) {
    return (
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        {content}
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {content}
    </Sheet>
  );
}

export { SheetClose as BottomSheetClose };
