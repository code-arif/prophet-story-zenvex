import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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


  return (
    <div className="flex justify-between items-center gap-2">
      {Array.from({ length }, (_, i) => {
        const char = chars[i] || '';
        const isFocused = focusedIndex === i;

        let borderClass = 'border border-[#c3c6d5]';
        if (hasError) {
          borderClass = 'border border-[#E5484D] text-[#E5484D]';
        } else if (isFocused) {
          borderClass = 'border-2 border-[#2B59C3] shadow-sm';
        } else if (char) {
          borderClass = 'border border-[#c3c6d5] text-[#14172B]';
        }

        return (
          <div
            key={i}
            className={`w-[48px] h-[56px] bg-white rounded-[12px] flex items-center justify-center text-[20px] font-semibold transition-all relative ${borderClass}`}
            onClick={() => inputs.current[i]?.focus()}
          >
            <input
              ref={(el) => (inputs.current[i] = el)}
              value={char}
              onChange={(e) => {
                const d = (e.target.value || '').replace(/\D/g, '').slice(-1);
                setAt(i, d);
                if (d && inputs.current[i + 1]) {
                  inputs.current[i + 1].focus();
                }
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
              onFocus={() => setFocusedIndex(i)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="absolute inset-0 opacity-0 w-full h-full cursor-text text-center"
            />
            {char ? (
              char
            ) : isFocused ? (
              <div className="w-[2px] h-[24px] bg-[#2B59C3] animate-[blink_1s_step-end_infinite]" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyOtp({ brandName, pending, logoUrl }) {
  const form = useForm({ otp: '' });
  const { flash } = usePage().props;

  // Countdown timer logic
  const [seconds, setSeconds] = useState(45);
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const toBnDigits = (num) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const formatted = num < 10 ? `0${num}` : `${num}`;
    return formatted.split('').map((d) => bnDigits[parseInt(d, 10)] ?? d).join('');
  };

  const handleResend = (e) => {
    e.preventDefault();
    form.post('/login/send-otp', {
      data: { msisdn: pending },
      preserveScroll: true,
      onSuccess: () => setSeconds(45),
    });
  };

  const hasError = Boolean(form.errors.otp || flash?.error);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#14172B] flex flex-col font-['Noto_Sans_Bengali','Inter',sans-serif] relative overflow-x-hidden">
      <Head title="কোড যাচাই করুন" />

      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Top App Bar */}
      <header className="flex justify-between items-center h-14 px-5 w-full fixed top-0 z-50 bg-transparent max-w-[390px] mx-auto left-0 right-0">
        <button
          aria-label="Back"
          type="button"
          onClick={() => window.history.back()}
          className="w-10 h-10 flex items-center justify-start rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[#14172B]">arrow_back</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col px-5 pb-10 max-w-[390px] mx-auto w-full pt-24">
        {/* Logo / Brand Header if present */}
        {(logoUrl || brandName) && (
          <div className="mb-4 flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="size-10 rounded-full bg-white object-cover ring-1 ring-black/10"
              />
            ) : null}
            {brandName ? <div className="text-lg font-bold text-[#14172B]">{brandName}</div> : null}
          </div>
        )}

        {/* Flash messages */}
        {flash?.error && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
            {flash.error}
          </div>
        )}
        {flash?.status && (
          <div className="mb-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
            {flash.status}
          </div>
        )}

        {/* Heading Section */}
        <section className="space-y-2">
          <h1 className="text-[22px] leading-[30px] font-bold text-[#14172B]">কোড যাচাই করুন</h1>
          <p className="text-[#6B7280] text-[13px] leading-[18px]">
            {pending ? `${pending} নম্বরে পাঠানো ৬ সংখ্যার কোডটি লিখুন` : 'পাঠানো ৬ সংখ্যার কোডটি লিখুন'}
            <Link href="/" className="text-[#2B59C3] font-semibold ml-2 hover:underline">
              বদলান
            </Link>
          </p>
        </section>

        {/* OTP Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.post('/login/verify');
          }}
          className="mt-8 space-y-6"
        >
          <OtpBoxes
            value={form.data.otp}
            onChange={(v) => form.setData('otp', v)}
            length={6}
            hasError={hasError}
          />

          {/* Error Message */}
          {form.errors.otp && (
            <p className="text-[#E5484D] text-[13px] flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {form.errors.otp}
            </p>
          )}

          {/* Timer / Resend Section */}
          <div className="flex justify-center text-[13px] text-[#6B7280]">
            {seconds > 0 ? (
              <p>
                কোড আবার পাঠান —{' '}
                <span className="text-[#2B59C3] font-semibold">০০:{toBnDigits(seconds)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={form.processing}
                className="text-[#2B59C3] font-semibold hover:underline cursor-pointer"
              >
                কোড আবার পাঠান
              </button>
            )}
          </div>

          {/* Primary Action */}
          <button
            type="submit"
            disabled={form.processing || form.data.otp.length < 6}
            className={`w-full h-[52px] rounded-[14px] font-semibold text-[16px] flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md ${
              form.data.otp.length === 6 && !form.processing
                ? 'bg-[#2B59C3] text-white cursor-pointer'
                : 'bg-[#C9CED6] text-white cursor-not-allowed'
            }`}
          >
            {form.processing ? (
              <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            ) : (
              'যাচাই করুন'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#6B7280]">OTP expires in 5 minutes.</div>
      </main>

      {/* Decorative Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#2B59C3] rounded-full blur-3xl" />
        <div className="absolute top-[40%] -left-10 w-64 h-64 bg-[#715fe9] rounded-full blur-3xl" />
      </div>
    </div>
  );
}
