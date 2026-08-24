import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

/**
 * Screen 02 — Phone Verification · ফোন যাচাই
 * Onboarding. No bottom navigation.
 * Two states: phone entry → OTP entry.
 * Reuses existing Laravel auth routes (FirstLoginController).
 */

function OtpBoxes({ value, onChange, length = 6, hasError = false }) {
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted.length > 0) {
      onChange(pasted);
      const target = Math.min(pasted.length, length - 1);
      inputs.current[target]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }, (_, i) => {
        const char = chars[i] || '';
        const isFocused = focusedIndex === i;

        let borderClass = 'border border-border-rest';
        if (hasError) {
          borderClass = 'border border-warn';
        } else if (isFocused) {
          borderClass = 'border-2 border-brand shadow-sm';
        } else if (char) {
          borderClass = 'border border-border-rest';
        }

        return (
          <div
            key={i}
            className={`flex size-12 items-center justify-center rounded-[14px] bg-white text-[18px] font-bold transition-all ${borderClass}`}
            onClick={() => inputs.current[i]?.focus()}
          >
            <input
              ref={(el) => (inputs.current[i] = el)}
              value={char}
              onChange={(e) => {
                const d = (e.target.value || '').replace(/\D/g, '').slice(-1);
                setAt(i, d);
                if (d && inputs.current[i + 1]) inputs.current[i + 1].focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  if (!chars[i] && inputs.current[i - 1]) {
                    inputs.current[i - 1].focus();
                  } else {
                    setAt(i, '');
                  }
                }
              }}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(i)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="absolute inset-0 cursor-text opacity-0"
            />
            {char || (isFocused && <div className="size-0.5 animate-pulse bg-brand" />)}
          </div>
        );
      })}
    </div>
  );
}

export default function PhoneVerify() {
  const { t } = useI18n();
  const { flash } = usePage().props;
  const phoneForm = useForm({ msisdn: '' });
  const otpForm = useForm({ otp: '' });
  const [phase, setPhase] = useState('phone'); // 'phone' | 'otp'
  const [pendingNumber, setPendingNumber] = useState('');
  const [seconds, setSeconds] = useState(45);

  // Countdown
  useEffect(() => {
    if (phase !== 'otp' || seconds <= 0) return;
    const iv = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(iv);
  }, [phase, seconds]);

  const toBn = (n) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).padStart(2, '0').split('').map((d) => bn[+d]).join('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    phoneForm.post('/login/send-otp', {
      onSuccess: () => {
        setPendingNumber(phoneForm.data.msisdn);
        setPhase('otp');
        setSeconds(45);
      },
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    otpForm.post('/login/verify');
  };

  const handleResend = () => {
    otpForm.post('/login/send-otp', {
      data: { msisdn: pendingNumber },
      preserveScroll: true,
      onSuccess: () => setSeconds(45),
    });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-bg-from via-[#F0F0FF] to-bg-to">
      <Head title="ফোন যাচাই — ইজি রাইজ" />

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-ai/20 blur-[120px]" />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        {/* Back button */}
        <div className="absolute left-4 top-4">
          <button
            type="button"
            onClick={() => (phase === 'otp' ? setPhase('phone') : window.history.back())}
            className="flex size-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 active:scale-95"
          >
            <ArrowLeft className="size-6" strokeWidth={2} />
          </button>
        </div>

        {/* Glass card */}
        <div className="glass-tall w-full max-w-sm p-6">
          {phase === 'phone' ? (
            /* ── Phone entry state ── */
            <form onSubmit={handleSendOtp}>
              <h1 className="mb-1 text-[22px] font-bold text-ink font-bn">
                {t('আপনার ফোন নম্বর')}
              </h1>
              <p className="mb-5 text-[14px] text-muted font-bn">
                {t('একটি ছয় অঙ্কের কোড পাঠানো হবে')}
              </p>

              {/* Flash errors */}
              {flash?.error && (
                <div className="mb-4 rounded-xl bg-warn/10 px-4 py-3 text-[13px] text-warn font-bn">
                  {flash.error}
                </div>
              )}

              {/* Phone input */}
              <div className="mb-4 flex h-14 items-center overflow-hidden rounded-2xl border border-border-rest bg-white transition-colors focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="flex h-full items-center border-r border-border-rest bg-inset-blue px-3.5">
                  <span className="text-[15px] font-semibold text-ink font-bn">+৮৮০</span>
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="১৭XXXXXXXX"
                  value={phoneForm.data.msisdn}
                  onChange={(e) => phoneForm.setData('msisdn', e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full flex-1 bg-transparent px-4 py-2.5 text-[15px] tracking-widest text-ink placeholder:tracking-normal placeholder:text-muted focus:outline-none"
                />
              </div>

              {phoneForm.errors.msisdn && (
                <p className="mb-3 text-[13px] text-warn font-bn">{phoneForm.errors.msisdn}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={phoneForm.data.msisdn.replace(/\D/g, '').length < 10 || phoneForm.processing}
                className="flex h-14 w-full items-center justify-center rounded-[18px] bg-brand text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bn"
              >
                {phoneForm.processing ? 'পাঠানো হচ্ছে…' : t('কোড পাঠান')}
              </button>
            </form>
          ) : (
            /* ── OTP entry state ── */
            <form onSubmit={handleVerify}>
              <h1 className="mb-1 text-[22px] font-bold text-ink font-bn">
                {t('কোড লিখুন')}
              </h1>
              <p className="mb-5 text-[14px] text-muted font-bn">
                {pendingNumber} নম্বরে পাঠানো হয়েছে{' '}
                <button type="button" onClick={() => setPhase('phone')} className="text-brand font-semibold">
                  {t('বদলান')}
                </button>
              </p>

              {/* Flash errors */}
              {(otpForm.errors.otp || flash?.error) && (
                <div className="mb-4 rounded-xl bg-warn/10 px-4 py-3 text-[13px] text-warn font-bn">
                  {otpForm.errors.otp || flash?.error}
                </div>
              )}

              {/* OTP boxes */}
              <div className="mb-5">
                <OtpBoxes
                  value={otpForm.data.otp}
                  onChange={(v) => otpForm.setData('otp', v)}
                  length={6}
                  hasError={Boolean(otpForm.errors.otp || flash?.error)}
                />
              </div>

              {/* Timer / Resend */}
              <div className="mb-5 text-center text-[13px] text-muted font-bn">
                {seconds > 0 ? (
                  <span>আবার পাঠান — <span className="font-semibold text-brand">০০:{toBn(seconds)}</span></span>
                ) : (
                  <button type="button" onClick={handleResend} disabled={otpForm.processing} className="font-semibold text-brand hover:underline">
                    {t('কোড আবার পাঠান')}
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={otpForm.data.otp.length < 6 || otpForm.processing}
                className="flex h-14 w-full items-center justify-center rounded-[18px] bg-brand text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] transition-all hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bn"
              >
                {otpForm.processing ? 'যাচাই হচ্ছে…' : t('যাচাই করুন')}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
