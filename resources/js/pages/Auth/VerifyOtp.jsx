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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData.length > 0) {
      onChange(pastedData);
      
      // Focus on the corresponding input box after pasting
      const targetIndex = Math.min(pastedData.length, length - 1);
      inputs.current[targetIndex]?.focus();
    }
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
              onPaste={handlePaste}
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
    <div className="min-h-screen bg-[#F6F7FB] text-[#14172B] flex font-['Noto_Sans_Bengali','Inter',sans-serif] relative overflow-hidden">
      <Head title="কোড যাচাই করুন" />

      <style>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Decorative Blur Elements for the background (Visible behind desktop card / mobile background) */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 opacity-15 pointer-events-none bg-[#2B59C3] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 opacity-10 pointer-events-none bg-[#2B59C3] rounded-full blur-3xl" />

      {/* LEFT COLUMN: Premium Introduction Panel (Desktop/Tablet Only) */}
      <section className="hidden md:flex md:w-[50%] lg:w-[55%] relative overflow-hidden bg-[#14172B] text-white flex-col justify-between p-12 lg:p-16 select-none">
        {/* Background Visual Enhancements (Glow/Blobs) */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#2B59C3]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#2B59C3]/15 blur-[100px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

        {/* Top Header Section */}
        <div className="flex items-center gap-3 z-10">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="size-11 rounded-full bg-white object-cover shadow-md ring-2 ring-white/20"
            />
          ) : null}
          {brandName ? (
            <span className="text-xl font-bold tracking-tight text-white/95">{brandName}</span>
          ) : null}
        </div>

        {/* Core Marketing Copy */}
        <div className="my-auto space-y-6 z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#85a8ff] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/5">
            ✨ Language Learning Hub
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.25] tracking-tight">
            শিখুন ইংরেজি সহজে <br />
            <span className="bg-gradient-to-r from-[#5F8BFA] to-[#B3C8FC] bg-clip-text text-transparent">এবং কার্যকরভাবে</span>
          </h2>
          <p className="text-base lg:text-lg text-white/70 leading-relaxed font-normal">
            আপনার ভাষা শেখার যাত্রা শুরু হোক আজই। আমাদের রয়েছে ইন্টারেক্টিভ লেসন, এআই টিউটর এবং প্রতিদিনের প্র্যাকটিস সেশন।
          </p>
          
          <div className="pt-6 space-y-4 border-t border-white/10">
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>ব্যক্তিগতকৃত শিখন পথ (Personalized Learning Path)</span>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>এআই চ্যাট এবং প্র্যাকটিস অ্যাসিস্ট্যান্ট</span>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-[#2B59C3] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#2B59C3]/50">✓</span>
              <span>বিশদ অগ্রগতি ট্র্যাকিং এবং বিশ্লেষণ</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-white/40 z-10">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </section>

      {/* RIGHT COLUMN: OTP Card Container (Mobile & Desktop Form) */}
      <section className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        
        {/* Absolute Back Navigation Link */}
        <header className="absolute top-4 left-4 z-50">
          <button
            aria-label="Back"
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-sm border border-black/5 hover:bg-black/5 transition-all duration-200 active:scale-95"
            onClick={() => window.history.back()}
          >
            <span className="material-symbols-outlined text-[#14172B] text-xl">arrow_back</span>
          </button>
        </header>

        {/* Core Card Container - Shifts to white surface with shadow/border on desktop */}
        <main className="w-full max-w-[390px] flex-1 flex flex-col justify-between md:justify-center md:flex-none md:bg-white md:rounded-2xl md:shadow-[0px_10px_35px_rgba(20,23,43,0.04)] md:border md:border-black/5 md:p-8 lg:p-10 md:my-auto animate-fade-in">
          
          <div>
            {/* Brand Logo & Name (Mobile Only - Hidden on Desktop to avoid repetition) */}
            {(logoUrl || brandName) && (
              <div className="mb-6 flex flex-col items-center text-center animate-fade-in md:hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="mb-2 size-16 rounded-full bg-white object-cover shadow-sm ring-1 ring-black/10"
                  />
                ) : null}
                {brandName ? (
                  <div className="text-xl font-bold text-[#14172B] tracking-tight">{brandName}</div>
                ) : null}
              </div>
            )}

            {/* Flash Alerts */}
            {flash?.error && (
              <div className="mb-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
                {flash.error}
              </div>
            )}
            {flash?.status && (
              <div className="mb-5 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
                {flash.status}
              </div>
            )}

            {/* Heading Section */}
            <div className="space-y-2 mb-8">
              <h1 className="text-[22px] leading-[30px] font-extrabold text-[#14172B] tracking-tight">কোড যাচাই করুন</h1>
              <p className="text-[#6B7280] text-[13px] leading-[18px]">
                {pending ? `${pending} নম্বরে পাঠানো ৬ সংখ্যার কোডটি লিখুন` : 'পাঠানো ৬ সংখ্যার কোডটি লিখুন'}
                <Link href="/login" className="text-[#2B59C3] font-semibold ml-2 hover:underline transition-colors">
                  বদলান
                </Link>
              </p>
            </div>

            {/* OTP Input Form */}
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
              className="space-y-6"
            >
              <OtpBoxes
                value={form.data.otp}
                onChange={(v) => form.setData('otp', v)}
                length={6}
                hasError={hasError}
              />

              {/* Error Message */}
              {form.errors.otp && (
                <p className="text-[#E5484D] text-[13px] flex items-center gap-1.5 pl-1">
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
                    className="text-[#2B59C3] font-semibold hover:text-[#1F4BB5] hover:underline cursor-pointer transition-colors"
                  >
                    কোড আবার পাঠান
                  </button>
                )}
              </div>

              {/* Primary Action */}
              <button
                type="submit"
                disabled={isSubmitting || form.processing || form.data.otp.length < 6}
                className={`w-full h-12 rounded-[14px] font-semibold text-[15px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] shadow-md ${
                  form.data.otp.length === 6 && !form.processing && !isSubmitting
                    ? 'bg-[#2B59C3] text-white shadow-[0px_8px_20px_rgba(43,89,195,0.18)] hover:bg-[#1F4BB5] hover:shadow-[0px_8px_24px_rgba(43,89,195,0.25)] cursor-pointer'
                    : 'bg-[#C9CED6] text-white cursor-not-allowed'
                }`}
              >
                {form.processing ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : (
                  'যাচাই করুন'
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-[#8C94A0]">
            OTP expires in 5 minutes.
          </div>
        </main>
      </section>
    </div>
  );
}
