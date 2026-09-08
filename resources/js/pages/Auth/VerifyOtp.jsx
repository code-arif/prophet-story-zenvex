import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, RefreshCw, BookOpen, Info } from 'lucide-react';

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

        let borderClass = 'border-2 border-border-rest bg-bg-from/50 text-ink';
        if (hasError) {
          borderClass = 'border-2 border-danger bg-danger/5 text-danger';
        } else if (isFocused) {
          borderClass = 'border-2 border-ink bg-white shadow-md text-ink';
        } else if (char) {
          borderClass = 'border-2 border-muted/40 bg-white text-ink';
        }

        return (
          <div
            key={i}
            className={`size-11 sm:size-12 rounded-xl flex items-center justify-center text-[18px] sm:text-[20px] font-black transition-all relative ${borderClass}`}
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
              <div className="w-[2px] h-5 bg-ink animate-[blink_1s_step-end_infinite]" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyOtp({ brandName: _brandName = 'Prophet Stories', pending, logoUrl: _logoUrl, appChargeText: propChargeText }) {
  const form = useForm({ otp: '' });
  const { flash, settings } = usePage().props;
  const chargeText = propChargeText || settings?.appChargeText || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-dvh bg-gradient-to-b from-bg-from to-bg-to text-ink flex font-sans relative overflow-hidden selection:bg-primary selection:text-white">
      <Head title="কোড যাচাই — Prophet Stories" />

      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[400px] opacity-10 pointer-events-none bg-primary rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[350px] opacity-10 pointer-events-none bg-secondary rounded-full blur-[110px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main Split Layout Card */}
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border-rest bg-white shadow-2xl flex flex-col md:flex-row">

          {/* LEFT: Branding Panel */}
          <section className="hidden md:flex md:w-[48%] lg:w-[50%] relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-[#111820] text-white flex-col justify-between p-7 lg:p-10 select-none">
            <div className="absolute top-[-20%] left-[-20%] size-[80%] rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[60%] rounded-full bg-accent/10 blur-[70px] pointer-events-none" />

            {/* Brand Header */}
            <div className="z-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-primary text-white font-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[15px] font-black leading-tight tracking-tight text-white">Prophet Stories</p>
                  <p className="text-[10px] leading-tight text-white/60">নবীদের গল্প</p>
                </div>
              </Link>
            </div>

            {/* Value Proposition */}
            <div className="my-auto space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary text-[11px] font-bold border border-white/15 shadow-sm backdrop-blur-md">
                <ShieldCheck className="size-3 text-primary" />
                নিরাপদ ভেরিফিকেশন
              </div>

              <h2 className="text-[24px] lg:text-[30px] font-black leading-[1.2] tracking-tight text-white">
                আপনার নম্বরটি<br />
                <span className="text-primary">যাচাই করুন</span>
              </h2>

              <p className="text-[12px] sm:text-[13px] leading-relaxed text-white/70 font-normal">
                প্রদত্ত নম্বরে পাঠানো ৬ সংখ্যার কোড লিখে লগইন সম্পন্ন করুন।
              </p>

              {/* Feature Checklist */}
              <div className="pt-3 space-y-2.5 border-t border-white/10 text-[12px]">
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>নিরাপদ সেশন ভেরিফিকেশন</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>আপনার ডাটা এনক্রিপ্টেড ও সুরক্ষিত</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>দ্রুত লগইন — পাসওয়ার্ড প্রয়োজন নেই</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-white/40 z-10">
              © {new Date().getFullYear()} Prophet Stories
            </div>
          </section>

          {/* RIGHT: OTP Form */}
          <section className="w-full md:w-[52%] lg:w-[50%] flex flex-col justify-between p-5 sm:p-8 bg-white relative">

            {/* Back link */}
            <div className="mb-5">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                নম্বর পরিবর্তন করুন
              </Link>
            </div>

            <div className="my-auto max-w-[320px] mx-auto w-full">
              {/* Heading */}
              <div className="mb-5">
                <h1 className="text-[20px] font-black tracking-tight text-ink mb-1">কোড যাচাই করুন</h1>
                <p className="text-[12px] leading-relaxed text-muted">
                  {pending ? `${pending} নম্বরে পাঠানো ৬ সংখ্যার OTP লিখুন` : 'পাঠানো ৬ সংখ্যার OTP লিখুন'}
                </p>
              </div>

              {/* Flash Alerts */}
              {flash?.error && (
                <div className="mb-3 rounded-xl bg-danger/10 p-3 text-[12px] font-semibold text-danger border border-danger/20">
                  {flash.error}
                </div>
              )}
              {flash?.status && (
                <div className="mb-3 rounded-xl bg-success/10 p-3 text-[12px] font-semibold text-success border border-success/20">
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
                className="space-y-4"
              >
                <OtpBoxes
                  value={form.data.otp}
                  onChange={(v) => form.setData('otp', v)}
                  length={6}
                  hasError={hasError}
                />

                {/* Error */}
                {form.errors.otp && (
                  <p className="text-[11px] font-bold text-danger pl-1">{form.errors.otp}</p>
                )}

                {/* Timer / Resend */}
                <div className="flex justify-center text-[12px] text-muted">
                  {seconds > 0 ? (
                    <p>
                      কোড আবার পাঠান —{' '}
                      <span className="text-ink font-bold">০০:{toBnDigits(seconds)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={form.processing}
                      className="inline-flex items-center gap-1 text-ink font-bold hover:underline"
                    >
                      <RefreshCw className="size-3.5" />
                      কোড আবার পাঠান
                    </button>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || form.processing || form.data.otp.length < 6}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-black transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    form.data.otp.length === 6 && !form.processing && !isSubmitting
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {form.processing || isSubmitting ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন'}
                </button>
              </form>

              {/* Charging Information */}
              {chargeText && (
                <div className="mt-3.5 rounded-2xl border border-amber-500/25 bg-amber-50/90 p-3 text-[11px] leading-relaxed text-amber-950 flex items-start gap-2.5 shadow-sm">
                  <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">চার্জিং সংক্রান্ত তথ্য:</span>
                    <span className="text-amber-900/90 font-medium">{chargeText}</span>
                  </div>
                </div>
              )}

              {/* Security */}
              <div className="mt-4 rounded-xl border border-border-rest bg-bg-from/50 p-2.5 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted">
                  <Lock className="size-3 text-success" />
                  কোডটি ৫ মিনিটের জন্য কার্যকর থাকবে
                </p>
              </div>
            </div>

            {/* Help */}
            <p className="mt-5 text-center text-[10px] text-muted">
              সমস্যা হচ্ছে?{' '}
              <Link href="/login" className="font-bold text-ink underline">
                আবার চেষ্টা করুন
              </Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
