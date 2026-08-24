import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Phone, ShieldCheck, Sparkles, Lock, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function PhoneLogin({ brandName = 'easy rise', logoUrl, guestModeEnabled, appChargeText }) {
  const form = useForm({
    msisdn: '',
  });
  const { flash } = usePage().props;

  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [unsubscribeInfo, setUnsubscribeInfo] = useState(null);

  // Parse error message for manual unsubscribe instructions
  useEffect(() => {
    if (flash?.error && flash.error.includes('send SMS')) {
      const match = flash.error.match(/send SMS:\s*(.+?)\s*to\s*(\d+)/i);
      if (match) {
        setUnsubscribeInfo({
          message: flash.error.split('Please send SMS')[0].trim() + '.',
          instruction: `${match[1]} to ${match[2]}`,
        });
        setShowUnsubscribeModal(true);
      }
    }
  }, [flash?.error]);

  const rawDigits = (form.data.msisdn || '').replace(/\D/g, '');
  const isValidLength = rawDigits.length >= 10;

  return (
    <div className="min-h-dvh bg-[#F6F8FE] text-ink flex font-sans relative overflow-hidden selection:bg-brand selection:text-white">
      <Head title="লগইন — easy rise" />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[500px] opacity-20 pointer-events-none bg-brand rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[450px] opacity-15 pointer-events-none bg-ai rounded-full blur-[130px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Main Split Layout Card Container */}
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0px_20px_60px_rgba(14,22,38,0.06)] flex flex-col md:flex-row min-h-[600px]">
          
          {/* LEFT COLUMN: Light Theme Branding & Platform Features Panel */}
          <section className="hidden md:flex md:w-[50%] lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-[#F8FAFC] to-[#EDF3FF] text-ink flex-col justify-between p-8 lg:p-12 border-r border-border-rest/80 select-none">
            {/* Background Glow Overlay */}
            <div className="absolute top-[-20%] left-[-20%] size-[80%] rounded-full bg-brand/12 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[60%] rounded-full bg-ai/10 blur-[80px] pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center gap-3 z-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand via-blue-600 to-brand-dark text-sm font-bold text-white shadow-md shadow-brand/20 transition-transform group-hover:scale-105">
                  eR
                </div>
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

          {/* RIGHT COLUMN: Phone Input Form Panel */}
          <section className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 bg-white font-bn relative">
            
            {/* Top Back Navigation to Home */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-muted hover:text-brand transition-colors"
              >
                <ArrowLeft className="size-4" />
                হোমপেজে ফিরুন
              </Link>
            </div>

            <div className="my-auto max-w-sm mx-auto w-full">
              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="text-[24px] font-black tracking-tight text-ink mb-1">ফোন নম্বর দিন</h1>
                <p className="text-[13px] leading-relaxed text-muted">
                  আপনার একাউন্ট ও সার্ভিস আপডেট এই নম্বরের সাথে সুরক্ষিত থাকবে
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

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.post('/login/send-otp');
                }}
                className="space-y-4"
              >
                <div>
                  <div className="flex h-13 items-center overflow-hidden rounded-xl border-2 border-border-rest bg-[#F8FAFC] transition-colors focus-within:border-brand focus-within:bg-white">
                    <div className="flex h-full items-center justify-center border-r border-border-rest bg-slate-100/80 px-3.5">
                      <Phone className="size-4 text-muted" />
                      <span className="ml-2 text-[14px] font-bold text-ink">+৮৮০</span>
                    </div>
                    <input
                      id="phoneInput"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="১৭XXXXXXXX"
                      value={form.data.msisdn}
                      onChange={(e) => form.setData('msisdn', e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full flex-1 bg-transparent px-4 py-3 text-[15px] font-bold tracking-widest text-ink placeholder:tracking-normal placeholder:font-normal placeholder:text-muted/60 focus:outline-none"
                    />
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-[11px] text-muted">
                    <Info className="size-3.5 text-brand" />
                    এসএমএসে ৬ সংখ্যার একটি ভেরিফিকেশন কোড পাঠানো হবে
                  </p>

                  {form.errors.msisdn ? (
                    <p className="mt-1 text-[12px] font-bold text-rose-600">{form.errors.msisdn}</p>
                  ) : null}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValidLength || form.processing}
                  className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    isValidLength && !form.processing
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0px_8px_22px_rgba(29,111,242,0.3)] hover:shadow-[0px_10px_26px_rgba(29,111,242,0.4)]'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {form.processing ? (
                    'কোড পাঠানো হচ্ছে...'
                  ) : (
                    <>
                      কোড পাঠান
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security info */}
              <div className="mt-5 rounded-xl border border-border-rest bg-[#F8FAFC] p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted">
                  <Lock className="size-3.5 text-emerald-600" />
                  আপনার ডাটা ডিভাইসে সম্পূর্ণ লোকালি সুরক্ষিত
                </p>
                {appChargeText ? (
                  <p className="mt-1 text-[10px] text-muted/80">{appChargeText}</p>
                ) : null}
              </div>

              {/* Guest login */}
              {guestModeEnabled && (
                <p className="mt-4 text-center">
                  <Link
                    href="/guest"
                    className="text-[13px] font-bold text-brand hover:underline"
                  >
                    গেস্ট মোডে প্রবেশ করুন
                  </Link>
                </p>
              )}
            </div>

            {/* Terms Footer */}
            <p className="mt-6 text-center text-[11px] text-muted">
              চালিয়ে গেলে আপনি easy rise-এর{' '}
              <a href="#" className="font-bold text-brand underline">
                ব্যবহারের শর্তাবলী
              </a>{' '}
              মেনে নিচ্ছেন
            </p>
          </section>

        </div>
      </div>

      {/* Manual Unsubscribe Modal */}
      {showUnsubscribeModal && unsubscribeInfo && (
        <UnsubscribeManualModal
          message={unsubscribeInfo.message}
          instruction={unsubscribeInfo.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </div>
  );
}
