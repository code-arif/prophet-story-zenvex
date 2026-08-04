import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

const ToastContext = React.createContext(null);

const TONES = {
  success: { icon: CheckCircle2, ring: 'ring-learn-success/30', text: 'text-learn-success' },
  info: { icon: Info, ring: 'ring-learn-info/30', text: 'text-learn-info' },
  warn: { icon: AlertTriangle, ring: 'ring-learn-warn/40', text: 'text-learn-warn' },
};

/**
 * Minimal toast system for the learner UI.
 * Wrap the app in <ToastProvider> and call show(message, tone) from useToast().
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const show = React.useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-5">
        {toasts.map((t) => {
          const tone = TONES[t.tone] || TONES.success;
          const Icon = tone.icon;
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-[14px] bg-white px-4 py-3 text-[13px] font-semibold text-learn-ink shadow-[0_8px_24px_rgba(20,23,43,0.12)] ring-1 animate-fade-in',
                tone.ring
              )}
            >
              <Icon className={cn('size-5 shrink-0', tone.text)} />
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}
