import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

/**
 * Bottom sheet — easy rise Stitch design.
 * 28px top radius, drag handle, backdrop, full-width actions.
 * Used for add job, add income, add scope item, confirm delete.
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 inset-x-0 z-10',
          'rounded-t-[28px] bg-white p-4 pb-8',
          'shadow-[0_-8px_32px_rgba(14,22,38,0.12)]',
          'animate-slide-up',
          className
        )}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-rest" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-ink font-bn">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-black/5"
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
