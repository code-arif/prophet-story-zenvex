import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Phone, Sparkles, Lock, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function PhoneLogin({ brandName: _brandName = 'Prophet Stories', logoUrl: _logoUrl, guestModeEnabled: _guestModeEnabled, appChargeText: propChargeText }) {
  const form = useForm({
    msisdn: '',
  });
  const { flash, settings } = usePage().props;
  const chargeText = propChargeText || settings?.appChargeText || '';

  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [unsubscribeInfo, setUnsubscribeInfo] = useState(null);

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
    <div className="min-h-dvh bg-gradient-to-b from-bg-from to-bg-to text-ink flex font-sans relative overflow-hidden selection:bg-primary selection:text-white">
      <Head title="লগইন — Prophet Stories" />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[400px] opacity-10 pointer-events-none bg-primary rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[350px] opacity-10 pointer-events-none bg-secondary rounded-full blur-[110px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main Split Layout Card */}
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border-rest bg-white shadow-2xl flex flex-col md:flex-row">

          {/* LEFT: Branding Panel */}
          <section className="hidden md:flex md:w-[48%] lg:w-[50%] relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-[#111820] text-white flex-col justify-between p-7 lg:p-10 select-none">
            {/* Glow overlays */}
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
                <Sparkles className="size-3 text-primary animate-pulse" />
                কুরআন ও সুন্নাহভিত্তিক — ১০০% নির্ভরযোগ্য
              </div>

              <h2 className="text-[24px] lg:text-[30px] font-black leading-[1.2] tracking-tight text-white">
                নবীদের <span className="text-primary">গল্প পড়ুন,</span><br />
                জীবনে <span className="text-accent">অনুপ্রেরণা</span> খুঁজুন
              </h2>

              <p className="text-[12px] sm:text-[13px] leading-relaxed text-white/70 font-normal">
                ২৫+ নবীর গল্প — বড়দের জন্য স্ট্যান্ডার্ড মোড, বাচ্চাদের জন্য কিড মোড।
              </p>

              {/* Feature Checklist */}
              <div className="pt-3 space-y-2.5 border-t border-white/10 text-[12px]">
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>কুরআন ও সহিহ হাদিস থেকে সংকলিত</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>বাচ্চাদের জন্য বিশেষায়িত কিড মোড</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>পেশাদার কণ্ঠে অডিও নারেশন</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 font-semibold">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span>পড়ার অগ্রগতি ট্র্যাকিং</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-white/40 z-10">
              © {new Date().getFullYear()} Prophet Stories
            </div>
          </section>

          {/* RIGHT: Phone Form */}
          <section className="w-full md:w-[52%] lg:w-[50%] flex flex-col justify-between p-5 sm:p-8 bg-white relative">

            {/* Back link */}
            <div className="mb-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                হোমপেজে ফিরুন
              </Link>
            </div>

            <div className="my-auto max-w-[320px] mx-auto w-full">
              {/* Heading */}
              <div className="mb-5">
                <h1 className="text-[20px] font-black tracking-tight text-ink mb-1">ফোন নম্বর দিন</h1>
                <p className="text-[12px] leading-relaxed text-muted">
                  মোবাইল নম্বর দিয়ে দ্রুত লগইন বা অ্যাকাউন্ট তৈরি করুন
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

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.post('/login/send-otp');
                }}
                className="space-y-3"
              >
                <div>
                  <div className="flex h-12 items-center overflow-hidden rounded-xl border-2 border-border-rest bg-bg-from/50 transition-colors focus-within:border-ink focus-within:bg-white">
                    <div className="flex h-full items-center justify-center border-r border-border-rest bg-slate-100/80 px-3">
                      <Phone className="size-3.5 text-muted" />
                      <span className="ml-1.5 text-[13px] font-bold text-ink">+৮৮০</span>
                    </div>
                    <input
                      id="phoneInput"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="১৭XXXXXXXX"
                      value={form.data.msisdn}
                      onChange={(e) => form.setData('msisdn', e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full flex-1 bg-transparent px-3 py-2.5 text-[14px] font-bold tracking-widest text-ink placeholder:tracking-normal placeholder:font-normal placeholder:text-muted focus:outline-none"
                    />
                  </div>

                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted">
                    <Info className="size-3 text-ink/50" />
                    এসএমএসে ৬ সংখ্যার ভেরিফিকেশন কোড পাঠানো হবে
                  </p>

                  {form.errors.msisdn && (
                    <p className="mt-1 text-[11px] font-bold text-danger">{form.errors.msisdn}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValidLength || form.processing}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-black transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    isValidLength && !form.processing
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25'
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
                  আপনার তথ্য সম্পূর্ণ সুরক্ষিত ও গোপনীয়
                </p>
              </div>

            </div>

            {/* Terms */}
            <p className="mt-5 text-center text-[10px] text-muted">
              চালিয়ে গেলে আপনি Prophet Stories-এর{' '}
              <Link href="/terms" className="font-bold text-ink underline hover:text-ink/70 transition-colors">
                ব্যবহারের শর্তাবলী
              </Link>{' '}
              মেনে নিচ্ছেন
            </p>
          </section>

        </div>
      </div>

      {/* Unsubscribe Modal */}
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
