import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef } from 'react';

import { Button } from '../../components/ui/button';

function OtpBoxes({ value, onChange, length = 6 }) {
  const inputs = useRef([]);

  const chars = useMemo(() => {
    const clean = String(value || '').replace(/\D/g, '').slice(0, length);
    return Array.from({ length }, (_, i) => clean[i] || '');
  }, [value, length]);

  useEffect(() => {
    inputs.current = inputs.current.slice(0, length);
  }, [length]);

  const setAt = (index, digit) => {
    const next = chars.slice();
    next[index] = digit;
    onChange(next.join(''));
  };

  return (
    <div className="flex gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={c}
          onChange={(e) => {
            const d = (e.target.value || '').replace(/\D/g, '').slice(-1);
            setAt(i, d);
            if (d && inputs.current[i + 1]) inputs.current[i + 1].focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && inputs.current[i - 1]) {
              inputs.current[i - 1].focus();
            }
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="h-12 w-11 rounded-2xl bg-[hsl(var(--card))] text-center text-lg font-semibold text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
      ))}
    </div>
  );
}

export default function VerifyOtp({ brandName, pending, logoUrl }) {
  const form = useForm({ otp: '' });
  const { flash } = usePage().props;

  return (
    <div className="min-h-dvh bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Head title="Verify OTP" />

      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="size-12 rounded-full bg-white/5 object-cover ring-1 ring-[hsl(var(--border))]"
              />
            ) : null}
            <div className="text-xl font-semibold">{brandName}</div>
          </div>
          <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Enter the 6-digit code sent to <span className="text-[hsl(var(--foreground))]">{pending}</span>
          </div>
        </div>

        {/* Flash messages */}
        {flash?.error && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
            {flash.error}
          </div>
        )}
        {flash?.status && (
          <div className="mb-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400 ring-1 ring-green-500/20">
            {flash.status}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.post('/login/verify');
          }}
          className="space-y-4"
        >
          <OtpBoxes value={form.data.otp} onChange={(v) => form.setData('otp', v)} length={6} />

          {form.errors.otp ? (
            <div className="text-sm text-red-400">{form.errors.otp}</div>
          ) : null}

          <Button type="submit" className="w-full" disabled={form.processing}>
            Verify & continue
          </Button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.post('/login/send-otp', {
              data: { msisdn: pending },
              preserveScroll: true,
            });
          }}
          className="mt-4"
        >
          <Button type="submit" variant="secondary" className="w-full">
            Resend OTP
          </Button>
        </form>

        <div className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">OTP expires in 5 minutes.</div>

        <a
          href="/"
          className="mt-auto pt-10 text-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          Change phone
        </a>
      </div>
    </div>
  );
}
