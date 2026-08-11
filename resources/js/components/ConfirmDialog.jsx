import React from 'react';
import { AlertTriangle, HelpCircle, Info, X } from 'lucide-react';

/**
 * Professional, promise-based replacement for window.confirm().
 *
 * Mount <ConfirmProvider> once at the app root (app.jsx), then in any page:
 *
 *   const confirm = useConfirm();
 *
 *   async function handleDelete() {
 *     const ok = await confirm({
 *       title: 'Delete?',
 *       message: 'This cannot be undone.',
 *       confirmLabel: 'Delete',
 *       cancelLabel: 'Cancel',
 *       danger: true,      // red confirm button + alert icon
 *     });
 *     if (!ok) return;
 *     // …perform the action
 *   }
 *
 * Confirms are queued: if several fire in quick succession they resolve one
 * at a time. Dismissing (overlay / ✕ / cancel) resolves with false, matching
 * window.confirm semantics. Styled with the learner design tokens.
 */

const ConfirmContext = React.createContext(null);

const DEFAULT_OPTIONS = {
  title: 'Are you sure?',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
  hideCancel: false, // single-button info/notice mode (like alert())
};

export function ConfirmProvider({ children }) {
  const [queue, setQueue] = React.useState([]);
  const currentRef = React.useRef(null);

  const confirm = React.useCallback((options = {}) => {
    return new Promise((resolve) => {
      setQueue((q) => [...q, { ...DEFAULT_OPTIONS, ...options, resolve }]);
    });
  }, []);

  const settle = React.useCallback((result) => {
    const pending = currentRef.current;
    currentRef.current = null;
    if (!pending) return; // guards against double-settle from onOpenChange
    pending.resolve(result);
    setQueue((q) => q.slice(1));
  }, []);

  const current = queue[0] ?? null;
  // Latest-ref pattern: let settle() read the head of the queue from events.
  currentRef.current = current;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialogView current={current} onConfirm={() => settle(true)} onCancel={() => settle(false)} />
    </ConfirmContext.Provider>
  );
}

function ConfirmDialogView({ current, onConfirm, onCancel }) {
  const open = Boolean(current);
  const { title, message, confirmLabel, cancelLabel, danger, hideCancel } = current ?? DEFAULT_OPTIONS;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0B0D19]/60 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-[20px] bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3.5">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
              danger ? 'bg-[#E5484D]/10 text-[#E5484D]' : 'bg-[#2b59c3]/10 text-[#2b59c3]'
            }`}
          >
            {danger ? <AlertTriangle className="size-5" /> : hideCancel ? <Info className="size-5" /> : <HelpCircle className="size-5" />}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-bold text-[#171a2e] leading-snug">{title}</h2>
            {message ? (
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#434653]">{message}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#434653] transition-colors hover:bg-[#F6F7FB]"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="mt-5 flex gap-2.5">
          {!hideCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#c3c6d5] bg-white text-sm font-semibold text-[#171a2e] transition-colors hover:bg-[#F6F7FB]"
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex h-12 flex-1 items-center justify-center rounded-xl text-sm font-semibold text-white transition-colors ${
              danger ? 'bg-[#E5484D] hover:bg-[#D13B40]' : 'bg-[#2b59c3] hover:bg-[#0040a8]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Returns the confirm(options) → Promise<boolean> function. */
export function useConfirm() {
  const confirm = React.useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within <ConfirmProvider>');
  }
  return confirm;
}
