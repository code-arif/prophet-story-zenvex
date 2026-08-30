import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Sparkles, RefreshCw, Wrench } from 'lucide-react';

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
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData.length > 0) {
      onChange(pastedData);
      const targetIndex = Math.min(pastedData.length, length - 1);
      inputs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between items-center gap-2">
      {Array.from({ length }, (_, i) => {
        const char = chars[i] || '';
        const isFocused = focusedIndex === i;

        let borderClass = 'border-2 border-slate-200 bg-[#F8FAFC] text-[#37474F]';
        if (hasError) {
          borderClass = 'border-2 border-rose-500 bg-rose-50/50 text-rose-600';
        } else if (isFocused) {
          borderClass = 'border-2 border-[#37474F] bg-white shadow-md text-[#37474F]';
        } else if (char) {
          borderClass = 'border-2 border-slate-400 bg-white text-[#37474F]';
        }

        return (
          <div
            key={i}
            className={`size-11 sm:size-12 rounded-2xl flex items-center justify-center text-[18px] sm:text-[20px] font-black transition-all relative ${borderClass}`}
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
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(i)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="absolute inset-0 opacity-0 size-full cursor-text text-center"
            />
            {char ? (
              char
            ) : isFocused ? (
              <div className="w-[2px] h-5 bg-[#37474F] animate-[blink_1s_step-end_infinite]" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyOtp({ brandName = 'Mistri Call', pending, logoUrl }) {
  const form = useForm({ otp: '' });
  const { flash } = usePage().props;
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-dvh bg-[#F7F8FA] text-[#37474F] flex font-sans relative overflow-hidden selection:bg-[#FFC300] selection:text-[#37474F]">
      <Head title="কোড যাচাই করুন — Mistri Call (মিস্ত্রি কল)" />

      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[500px] opacity-15 pointer-events-none bg-[#37474F] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[450px] opacity-15 pointer-events-none bg-[#FFC300] rounded-full blur-[130px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Shared Split Layout Card Container */}
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col md:flex-row min-h-[600px]">
          
          {/* LEFT COLUMN: Mistri Call Branding Panel */}
          <section className="hidden md:flex md:w-[50%] lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#37474F] via-[#2c383f] to-[#1f282d] text-white flex-col justify-between p-8 lg:p-12 select-none">
            {/* Background Glow Overlay */}
            <div className="absolute top-[-20%] left-[-20%] size-[80%] rounded-full bg-[#FFC300]/15 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[60%] rounded-full bg-[#00B894]/15 blur-[80px] pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center gap-3 z-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-[#FFC300] text-[#37474F] font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Wrench className="w-5 h-5 text-[#37474F]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[17px] font-black leading-tight tracking-tight text-white">Mistri Call</p>
                    <span className="rounded-full bg-[#FFC300] text-[#37474F] px-2 py-0.5 text-[10px] font-bold">মিস্ত্রি কল</span>
                  </div>
                  <p className="text-[11px] leading-tight text-white/70">বিশ্বস্ত ঘরোয়া সার্ভিস প্ল্যাটফর্ম</p>
                </div>
              </Link>
            </div>

            {/* Core Value Proposition Copy */}
            <div className="my-auto space-y-5 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FFC300] text-[12px] font-bold border border-white/15 shadow-sm backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#FFC300] animate-pulse" />
                নিরাপদ ভেরিফিকেশন প্যানেল
              </div>

              <h2 className="text-[28px] lg:text-[34px] font-black leading-[1.25] tracking-tight text-white">
                আপনার নম্বরটি <br />
                <span className="text-[#FFC300]">
                  যাচাই করুন
                </span>
              </h2>

              <p className="text-[13px] sm:text-[14px] leading-relaxed text-white/80 font-normal">
                আপনার প্রদত্ত নম্বরে পাঠানো ৬ সংখ্যার ভেরিফিকেশন কোডটি প্রবেশ করিয়ে সার্ভিস বুকিং শুরু করুন।
              </p>

              {/* Feature Checklist */}
              <div className="pt-4 space-y-3 border-t border-white/10 text-[13px]">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>নিরাপদ সেশন ভেরিফিকেশন</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>আপনার বুকিং ডাটা এনক্রিপ্টেড</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>সরাসরি মিস্ত্রিদের সাথে যোগাযোগ ও ট্র্যাকিং</span>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-[11px] text-white/50 z-10">
              © {new Date().getFullYear()} Mistri Call. All rights reserved.
            </div>
          </section>

          {/* RIGHT COLUMN: OTP Form Panel */}
          <section className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 bg-white relative">
            
            {/* Top Back Navigation to Phone Login */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-[#37474F] transition-colors"
              >
                <ArrowLeft className="size-4" />
                নম্বর পরিবর্তন করুন
              </Link>
            </div>

            <div className="my-auto max-w-sm mx-auto w-full">
              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="text-[24px] font-black tracking-tight text-[#37474F] mb-1">কোড যাচাই করুন</h1>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  {pending ? `${pending} নম্বরে পাঠানো ৬ সংখ্যার OTP লিখুন` : 'পাঠানো ৬ সংখ্যার OTP লিখুন'}
                </p>
              </div>

              {/* Flash Alerts */}
              {flash?.error && (
                <div className="mb-4 rounded-xl bg-rose-500/10 p-3.5 text-[13px] font-semibold text-rose-600 border border-rose-500/20">
                  {flash.error}
                </div>
              )}
              {flash?.status && (
                <div className="mb-4 rounded-xl bg-[#00B894]/10 p-3.5 text-[13px] font-semibold text-[#00B894] border border-[#00B894]/20">
                  {flash.status}
                </div>
              )}

              {/* OTP Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isSubmitting || form.processing || form.data.otp.length < 6) return;
                  setIsSubmitting(true);
                  form.post('/login/verify', {
                    onFinish: () => setIsSubmitting(false),
                    onError: () => setIsSubmitting(false),
                  });
                }}
                className="space-y-5"
              >
                <OtpBoxes
                  value={form.data.otp}
                  onChange={(v) => form.setData('otp', v)}
                  length={6}
                  hasError={hasError}
                />

                {/* Error Message */}
                {form.errors.otp && (
                  <p className="text-[12px] font-bold text-rose-600 pl-1">{form.errors.otp}</p>
                )}

                {/* Timer / Resend */}
                <div className="flex justify-center text-[13px] text-slate-500">
                  {seconds > 0 ? (
                    <p>
                      কোড আবার পাঠান —{' '}
                      <span className="text-[#37474F] font-bold">০০:{toBnDigits(seconds)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={form.processing}
                      className="inline-flex items-center gap-1 text-[#37474F] font-bold hover:underline"
                    >
                      <RefreshCw className="size-3.5" />
                      কোড আবার পাঠান
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || form.processing || form.data.otp.length < 6}
                  className={`flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-black transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    form.data.otp.length === 6 && !form.processing && !isSubmitting
                      ? 'bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] shadow-lg shadow-[#FFC300]/25'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {form.processing || isSubmitting ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন'}
                </button>
              </form>

              {/* Security info */}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <Lock className="size-3.5 text-[#00B894]" />
                  কোডটি ৫ মিনিটের জন্য কার্যকর থাকবে
                </p>
              </div>
            </div>

            {/* Terms Footer */}
            <p className="mt-6 text-center text-[11px] text-slate-500">
              সমস্যা হচ্ছে?{' '}
              <Link href="/login" className="font-bold text-[#37474F] underline">
                আবার চেষ্টা করুন
              </Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
