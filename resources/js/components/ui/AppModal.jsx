import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

/**
 * Global responsive modal.
 * Mobile (< lg): bottom-sheet style with slide-up.
 * Desktop (lg+): centered dialog with backdrop blur.
 */
export default function AppModal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full bg-white overflow-hidden',
          'rounded-t-[28px] lg:rounded-[24px]',
          'max-h-[85dvh] lg:max-h-[80dvh]',
          'lg:mx-auto lg:w-full lg:max-w-[480px]',
          'shadow-[0_-8px_32px_rgba(14,22,38,0.12)] lg:shadow-[0_16px_48px_rgba(14,22,38,0.16)]',
          'animate-slide-up lg:animate-fade-in',
          className
        )}
      >
        {/* Drag handle (mobile) */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border-rest lg:hidden" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-rest">
            <h3 className="text-[17px] font-bold text-ink font-bn">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-black/5 active:scale-95 transition-all"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85dvh-60px)] lg:max-h-[calc(80dvh-60px)] px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
