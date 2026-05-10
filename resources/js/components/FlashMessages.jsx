import React from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

function Banner({ variant, title, message, onClose }) {
  const isError = variant === 'error';

  const icon = isError ? (
    <AlertCircle className="mt-0.5 size-5 text-red-400" />
  ) : (
    <CheckCircle2 className="mt-0.5 size-5 text-emerald-400" />
  );

  const border = isError ? 'border-red-500/60' : 'border-emerald-500/60';

  return (
    <div className={`rounded-2xl border-l-4 ${border} bg-[hsl(var(--card))] p-3 ring-1 ring-[hsl(var(--border))] shadow-elevated`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          {title ? <div className="text-sm font-semibold">{title}</div> : null}
          <div className="mt-0.5 text-sm text-[hsl(var(--foreground))]">{message}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-8 items-center justify-center rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function FlashMessages({ className = '' }) {
  const { flash } = usePage().props;
  const status = typeof flash?.status === 'string' ? flash.status : '';
  const error = typeof flash?.error === 'string' ? flash.error : '';

  const [dismissed, setDismissed] = React.useState({ status: false, error: false });

  React.useEffect(() => {
    // reset dismiss state when messages change
    setDismissed({ status: false, error: false });
  }, [status, error]);

  React.useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setDismissed((d) => ({ ...d, status: true })), 5000);
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
          title="Error"
          message={error}
          onClose={() => setDismissed((d) => ({ ...d, error: true }))}
        />
      ) : null}
      {showStatus ? (
        <Banner
          variant="success"
          title="Success"
          message={status}
          onClose={() => setDismissed((d) => ({ ...d, status: true }))}
        />
      ) : null}
    </div>
  );
}
