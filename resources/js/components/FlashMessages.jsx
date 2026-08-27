import React from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

function Banner({ variant, message, onClose }) {
  const isError = variant === 'error';

  return (
    <div
      className={`rounded-2xl p-4 border shadow-sm backdrop-blur-md transition-all font-bn flex items-center justify-between gap-3 ${
        isError
          ? 'bg-rose-50/95 border-rose-200 text-rose-950'
          : 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
            isError ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isError ? (
            <AlertCircle className="size-5 stroke-[2.5]" />
          ) : (
            <CheckCircle2 className="size-5 stroke-[2.5]" />
          )}
        </div>
        <p className="text-[14px] font-bold leading-snug truncate">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className={`p-1.5 rounded-xl transition-colors shrink-0 cursor-pointer ${
          isError
            ? 'text-rose-700 hover:bg-rose-100'
            : 'text-emerald-700 hover:bg-emerald-100'
        }`}
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export default function FlashMessages({ className = '' }) {
  const { flash } = usePage().props;
  const status = typeof flash?.status === 'string' ? flash.status : (typeof flash?.success === 'string' ? flash.success : '');
  const error = typeof flash?.error === 'string' ? flash.error : '';

  const [dismissed, setDismissed] = React.useState({ status: false, error: false });

  React.useEffect(() => {
    setDismissed({ status: false, error: false });
  }, [status, error]);

  React.useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setDismissed((d) => ({ ...d, status: true })), 4000);
    return () => clearTimeout(id);
  }, [status]);

  const showError = !!error && !dismissed.error;
  const showStatus = !!status && !dismissed.status;

  if (!showError && !showStatus) return null;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {showError ? (
        <Banner
          variant="error"
          message={error}
          onClose={() => setDismissed((d) => ({ ...d, error: true }))}
        />
      ) : null}
      {showStatus ? (
        <Banner
          variant="success"
          message={status}
          onClose={() => setDismissed((d) => ({ ...d, status: true }))}
        />
      ) : null}
    </div>
  );
}
