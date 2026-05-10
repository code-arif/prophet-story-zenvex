import React from 'react';
import { Button } from './ui/button';
import { X, AlertCircle } from 'lucide-react';

export default function UnsubscribeManualModal({ message, instruction, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold">Manual Unsubscription Required</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {message}
          </p>

          <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
              Send this SMS:
            </div>
            <div className="font-mono text-base font-semibold text-[hsl(var(--foreground))] select-all">
              {instruction}
            </div>
          </div>

          <div className="rounded-xl bg-blue-500/10 px-4 py-3 text-sm text-blue-400 ring-1 ring-blue-500/20">
            <strong>Note:</strong> After sending the SMS, you can login again with OTP.
          </div>

          <Button onClick={onClose} className="w-full">
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
