import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

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

        let borderClass = 'border-2 border-border-rest bg-[#F8FAFC] text-ink';
        if (hasError) {
          borderClass = 'border-2 border-rose-500 bg-rose-50/50 text-rose-600';
        } else if (isFocused) {
          borderClass = 'border-2 border-brand bg-white shadow-md text-brand';
        } else if (char) {
          borderClass = 'border-2 border-slate-300 bg-white text-ink';
        }

        return (
          <div
            key={i}
            className={`size-11 sm:size-12 rounded-xl flex items-center justify-center text-[18px] sm:text-[20px] font-black transition-all relative font-bn ${borderClass}`}
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
              <div className="w-[2px] h-5 bg-brand animate-[blink_1s_step-end_infinite]" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyOtp({ brandName = 'easy rise', pending, logoUrl }) {
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
    <div className="min-h-dvh bg-[#F6F8FE] text-ink flex font-sans relative overflow-hidden selection:bg-brand selection:text-white">
      <Head title="কোড যাচাই করুন — easy rise" />

      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[500px] opacity-20 pointer-events-none bg-brand rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[450px] opacity-15 pointer-events-none bg-ai rounded-full blur-[130px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Shared Split Layout Card Container */}
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0px_20px_60px_rgba(14,22,38,0.06)] flex flex-col md:flex-row min-h-[600px]">
          
          {/* LEFT COLUMN: Light Theme Branding & Platform Features Panel */}
          <section className="hidden md:flex md:w-[50%] lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-[#F8FAFC] to-[#EDF3FF] text-ink flex-col justify-between p-8 lg:p-12 border-r border-border-rest/80 select-none">
            {/* Background Glow Overlay */}
            <div className="absolute top-[-20%] left-[-20%] size-[80%] rounded-full bg-brand/12 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[60%] rounded-full bg-ai/10 blur-[80px] pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center gap-3 z-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <img
                  src="/logo.png"
                  alt="easy rise logo"
                  className="size-10 object-contain rounded-xl shadow-md shadow-brand/20 transition-transform group-hover:scale-105"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[16px] font-bold leading-tight tracking-tight text-ink">easy rise</p>
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">OS 2.0</span>
                  </div>
                  <p className="text-[11px] leading-tight text-muted font-bn">ইজি রাইজ প্ল্যাটফর্ম</p>
                </div>
              </Link>
            </div>

            {/* Core Value Proposition Copy */}
            <div className="my-auto space-y-5 z-10 font-bn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold border border-brand/20 shadow-sm">
                <Sparkles className="size-3.5 text-brand animate-pulse" />
                স্মার্ট ফ্রিল্যান্সিং অপারেটিং সিস্টেম
              </div>

              <h2 className="text-[28px] lg:text-[34px] font-black leading-[1.2] tracking-tight text-ink">
                প্রথম কাজ থেকে <br />
                <span className="bg-gradient-to-r from-brand via-blue-600 to-ai bg-clip-text text-transparent">
                  নিরাপদ ও সফল ক্যারিয়ার
                </span>
              </h2>

              <p className="text-[14px] leading-relaxed text-muted font-medium">
                প্রজেক্ট ট্র্যাকিং, স্কোপ গার্ড, ট্রু আওয়ারলি রেট এবং ব্যাংক-রেডি ইনকাম প্রুফ — সবকিছু এক অ্যাপে।
              </p>

              {/* Feature Checklist */}
              <div className="pt-4 space-y-3 border-t border-border-rest/80 text-[13px]">
                <div className="flex items-center gap-3 text-ink font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>ওয়ার্ক পাইপলাইন & স্কোপ গার্ড সুবিধা</span>
                </div>
                <div className="flex items-center gap-3 text-ink font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>ট্রু আওয়ারলি রেট ও রানওয়ে ক্যালকুলেটর</span>
                </div>
                <div className="flex items-center gap-3 text-ink font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>AI কভার লেটার & প্রপোজাল ড্রাফটার</span>
                </div>
                <div className="flex items-center gap-3 text-ink font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>ভেরিফাইড A4 ব্যাংক ইনকাম প্রুফ জেনারেটর</span>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-[11px] text-muted z-10 font-bn">
              © {new Date().getFullYear()} easy rise। সর্বস্বত্ব সংরক্ষিত।
            </div>
          </section>

          {/* RIGHT COLUMN: OTP Form Panel */}
          <section className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 bg-white font-bn relative">
            
            {/* Top Back Navigation to Phone Login */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-muted hover:text-brand transition-colors"
              >
                <ArrowLeft className="size-4" />
                নম্বর পরিবর্তন করুন
              </Link>
            </div>

            <div className="my-auto max-w-sm mx-auto w-full">
              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="text-[24px] font-black tracking-tight text-ink mb-1">কোড যাচাই করুন</h1>
                <p className="text-[13px] leading-relaxed text-muted">
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
                <div className="mb-4 rounded-xl bg-emerald-500/10 p-3.5 text-[13px] font-semibold text-emerald-700 border border-emerald-500/20">
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
                <div className="flex justify-center text-[13px] text-muted">
                  {seconds > 0 ? (
                    <p>
                      কোড আবার পাঠান —{' '}
                      <span className="text-brand font-bold">০০:{toBnDigits(seconds)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={form.processing}
                      className="inline-flex items-center gap-1 text-brand font-bold hover:underline"
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
                  className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    form.data.otp.length === 6 && !form.processing && !isSubmitting
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0px_8px_22px_rgba(29,111,242,0.3)] hover:shadow-[0px_10px_26px_rgba(29,111,242,0.4)]'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {form.processing || isSubmitting ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন'}
                </button>
              </form>

              {/* Security info */}
              <div className="mt-5 rounded-xl border border-border-rest bg-[#F8FAFC] p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted">
                  <Lock className="size-3.5 text-emerald-600" />
                  কোডটি ৫ মিনিটের জন্য কার্যকর থাকবে
                </p>
              </div>
            </div>

            {/* Terms Footer */}
            <p className="mt-6 text-center text-[11px] text-muted">
              সমস্যা হচ্ছে?{' '}
              <Link href="/login" className="font-bold text-brand underline">
                আবার চেষ্টা করুন
              </Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
