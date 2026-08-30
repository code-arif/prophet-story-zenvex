import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle2, Phone, ShieldCheck, Sparkles, Lock, Info, ArrowRight, ArrowLeft, Zap, ThumbsUp, Calendar } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function PhoneLogin({ brandName = 'Mistri Call', logoUrl, guestModeEnabled, appChargeText }) {
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
    <div className="min-h-dvh bg-[#F7F8FA] text-[#37474F] flex font-sans relative overflow-hidden selection:bg-[#FFC300] selection:text-[#37474F]">
      <Head title="লগইন — Mistri Call (মিস্ত্রি কল)" />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[500px] opacity-15 pointer-events-none bg-[#37474F] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[450px] opacity-15 pointer-events-none bg-[#FFC300] rounded-full blur-[130px]" />

      <div className="flex w-full min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Main Split Layout Card Container */}
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col md:flex-row min-h-[600px]">
          
          {/* LEFT COLUMN: Mistri Call Branding & Platform Features Panel */}
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
                বাংলাদেশের ১ নম্বর ঘরোয়া সার্ভিস নেটওয়ার্ক
              </div>

              <h2 className="text-[28px] lg:text-[34px] font-black leading-[1.25] tracking-tight text-white">
                ঘরের যেকোনো মেরামত,<br />
                <span className="text-[#FFC300]">
                  বিশ্বস্ত মিস্ত্রি
                </span> এখন এক ক্লিকেই!
              </h2>

              <p className="text-[13px] sm:text-[14px] leading-relaxed text-white/80 font-normal">
                ইলেকট্রিশিয়ান, প্লাম্বার, এসি মেকানিক বা পেইন্টার — কাজের আগেই দেখুন ভিজিট ফি ও কাস্টমার রিভিউ।
              </p>

              {/* Feature Checklist */}
              <div className="pt-4 space-y-3 border-t border-white/10 text-[13px]">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>স্বচ্ছ আপফ্রন্ট ভিজিট ও ঘণ্টাভিত্তিক রেট</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>জাতীয় এনআইডি ভেরিফাইড কারিগর</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>কাস্টমারদের সততা ও প্রাইস ফেয়ারনেস স্কোর</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="size-4 text-[#00B894] shrink-0" />
                  <span>ক্যাশ, বিকাশ বা নগদ সহজে পেমেন্ট সুবিধা</span>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-[11px] text-white/50 z-10">
              © {new Date().getFullYear()} Mistri Call. All rights reserved.
            </div>
          </section>

          {/* RIGHT COLUMN: Phone Input Form Panel */}
          <section className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-between p-6 sm:p-10 bg-white relative">
            
            {/* Top Back Navigation to Home */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-[#37474F] transition-colors"
              >
                <ArrowLeft className="size-4" />
                হোমপেজে ফিরুন
              </Link>
            </div>

            <div className="my-auto max-w-sm mx-auto w-full">
              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="text-[24px] font-black tracking-tight text-[#37474F] mb-1">ফোন নম্বর দিন</h1>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  আপনার মোবাইল নম্বর দিয়ে দ্রুত লগইন বা অ্যাকাউন্ট তৈরি করুন
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

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.post('/login/send-otp');
                }}
                className="space-y-4"
              >
                <div>
                  <div className="flex h-13 items-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-[#F8FAFC] transition-colors focus-within:border-[#37474F] focus-within:bg-white">
                    <div className="flex h-full items-center justify-center border-r border-slate-200 bg-slate-100/80 px-3.5">
                      <Phone className="size-4 text-slate-400" />
                      <span className="ml-2 text-[14px] font-bold text-[#37474F]">+৮৮০</span>
                    </div>
                    <input
                      id="phoneInput"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="১৭XXXXXXXX"
                      value={form.data.msisdn}
                      onChange={(e) => form.setData('msisdn', e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full flex-1 bg-transparent px-4 py-3 text-[15px] font-bold tracking-widest text-[#37474F] placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                    <Info className="size-3.5 text-[#37474F]" />
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
                  className={`flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-black transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    isValidLength && !form.processing
                      ? 'bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] shadow-lg shadow-[#FFC300]/25'
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
              <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <Lock className="size-3.5 text-[#00B894]" />
                  আপনার তথ্য সম্পূর্ণ সুরক্ষিত ও গোপন থাকবে
                </p>
              </div>

              {/* Guest login */}
              {guestModeEnabled && (
                <p className="mt-4 text-center">
                  <Link
                    href="/guest"
                    className="text-[13px] font-bold text-[#37474F] hover:underline"
                  >
                    গেস্ট মোডে প্রবেশ করুন
                  </Link>
                </p>
              )}
            </div>

            {/* Terms Footer */}
            <p className="mt-6 text-center text-[11px] text-slate-500">
              চালিয়ে গেলে আপনি Mistri Call-এর{' '}
              <Link href="/terms" className="font-bold text-[#37474F] underline hover:text-black transition-colors">
                ব্যবহারের শর্তাবলী
              </Link>{' '}
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
