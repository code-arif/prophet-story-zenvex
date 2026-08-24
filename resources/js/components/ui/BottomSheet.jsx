import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

/**
 * BottomSheet / Responsive Modal — easy rise Stitch design.
 * On mobile (<sm): Bottom sheet attached to display bottom with top drag handle.
 * On desktop (>=sm): Centered floating modal in the middle of the screen.
 */
export function BottomSheet({ open, onClose, title, children, className }) {
  const sheetRef = useRef(null);

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet on Mobile / Centered Modal on Desktop */}
      <div
        ref={sheetRef}
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden',
          'rounded-t-[28px] sm:rounded-2xl bg-white p-5 sm:p-6',
          'shadow-[0_20px_60px_rgba(14,22,38,0.18)] border border-slate-100',
          'max-h-[90dvh] overflow-y-auto',
          'animate-slide-up sm:animate-in sm:fade-in-0 sm:zoom-in-95',
          className
        )}
      >
        {/* Drag handle on Mobile */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-bold text-ink font-bn">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
