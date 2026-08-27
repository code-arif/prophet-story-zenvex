import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 27 (Result State) — Remittance Incentive Eligibility Result · প্রণোদনা যোগ্যতা ফলাফল
 * Displays eligibility status, blocking reasons, computation block, condition details & advice card.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function IncentiveResult({
  isEligible = false,
  amountBdt = 53775,
  incentiveRatePct = 0.0,
  incentiveCalculated = 0,
  blockingReason = 'টাকাটি অনানুষ্ঠানিক (Hundi) পথে এসেছে বলে মনে হচ্ছে',
  conditions = [
    { label: 'ব্যাংকিং চ্যানেলের প্রমাণ নেই', matched: false },
    { label: 'ফ্রিল্যান্সিং কাজের প্রমাণ আছে', matched: true },
  ],
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="প্রণোদনা যোগ্যতা ফলাফল — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            যোগ্যতা ফলাফল
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            সরকারি ২.৫% প্রণোদনা পাওয়ার চূড়ান্ত ফলাফল ও পর্যালোচনা
          </p>
        </div>

        <Link
          href="/money/incentive"
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          ← আবার নতুন করে যাচাই করুন
        </Link>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Result Card, Advice Card, Footnote (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Result Card */}
          <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col font-bn">
            
            {/* Top Status Banner */}
            <div
              className={`p-5 flex items-center gap-3 border-b ${
                isEligible
                  ? 'bg-emerald-50/90 border-emerald-100 text-emerald-950'
                  : 'bg-amber-50/90 border-amber-100 text-amber-950'
              }`}
            >
              <div
                className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  isEligible ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {isEligible ? (
                  <CheckCircle2 className="size-6 stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="size-6 stroke-[2.5]" />
                )}
              </div>
              <div>
                <h2
                  className={`text-[20px] font-black leading-tight ${
                    isEligible ? 'text-emerald-900' : 'text-amber-900'
                  }`}
                >
                  {isEligible ? 'এই প্রাপ্তিটি সম্পূর্ণ যোগ্য!' : 'এই প্রাপ্তিটি যোগ্য নয়'}
                </h2>
                <p className="text-[12.5px] font-semibold opacity-80 mt-0.5">
                  {isEligible
                    ? 'সরকারি ২.৫% নগদ প্রণোদনা দাবির জন্য প্রস্তুত থাকুন'
                    : 'ব্যাংকিং চ্যানেলের শর্ত পূরণ না হওয়ায় প্রণোদনা প্রযোজ্য নয়'}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Highlighted Blocking Reason (If Ineligible) */}
              {!isEligible && blockingReason && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl border-y border-r border-amber-200/80 space-y-1">
                  <p className="text-[14px] font-extrabold text-amber-950 leading-snug">
                    {blockingReason}
                  </p>
                  <p className="text-[12px] font-medium text-amber-800">
                    অনানুষ্ঠানিক বা হুন্ডি মাধ্যমে আসা আয়ের ওপর সরকার কোনো প্রণোদনা প্রদান করে না।
                  </p>
                </div>
              )}

              {/* Computation Block */}
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-brand/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13.5px] font-medium text-slate-600">প্রাপ্ত অঙ্ক</span>
                  <span className="text-[15.5px] font-black text-ink">
                    ৳ {toBnDigits(amountBdt.toLocaleString())}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13.5px] font-medium text-slate-600">প্রণোদনার হার</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-extrabold border ${
                      isEligible
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {toBnDigits(incentiveRatePct)}%
                  </span>
                </div>

                <div className="h-[1px] bg-slate-200/80 w-full" />

                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[15px] font-black text-ink">প্রাপ্য প্রণোদনা</span>
                  <span
                    className={`text-[24px] font-black ${
                      isEligible ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    ৳ {toBnDigits(incentiveCalculated.toLocaleString())}
                  </span>
                </div>
              </div>

              {/* Conditions Detail */}
              <div className="space-y-3">
                <h3 className="text-[13.5px] font-extrabold text-slate-400 uppercase tracking-wider">
                  শর্তের বিস্তারিত
                </h3>

                <ul className="space-y-2.5">
                  {conditions.map((cond, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {cond.matched ? (
                        <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="size-5 text-amber-600 shrink-0" />
                      )}
                      <span className="text-[14px] font-bold text-slate-800">
                        {cond.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Advice Card */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[16px] font-black text-brand flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-500 fill-current" />
              করণীয় ও পরামর্শ
            </h3>

            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
              {isEligible
                ? 'পরবর্তী ধাপে ইনওয়ার্ড রেমিট্যান্স সার্টিফিকেট সংগ্রহ করে আপনার ব্যাংকে জমা দিন।'
                : 'পরের বার বৈধ ব্যাংকিং বা অনুমোদিত MFS চ্যানেলে টাকা আনার ধাপগুলো দেখুন।'}
            </p>

            <Link
              href="/money/channels"
              className="w-full py-3 rounded-2xl bg-brand hover:bg-brand-dark text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer block text-center"
            >
              টাকা দেশে আনার চ্যানেল দেখুন →
            </Link>
          </div>

          {/* Footnote Notice */}
          <p className="text-center text-[12.5px] font-bold text-slate-400 pt-2">
            নিয়ম বদলায় — দাবি করার আগে ব্যাংকে মিলিয়ে নিন
          </p>

        </div>

        {/* Right Sidebar Column: Guidance & Info (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Govt Policy Reminder Card */}
          <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/50 to-white">
            <h3 className="text-[15px] font-extrabold text-sky-950 flex items-center gap-2">
              <ShieldCheck className="size-5 text-sky-600" />
              বাংলাদেশ ব্যাংক নীতি
            </h3>

            <ul className="text-[12.5px] text-sky-900 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-600 font-bold">•</span>
                বৈধ ব্যাংকিং চ্যানেলে আয়ের বিপরীতে সরকারি ২.৫% নগদ সাহায্য সরাসরি প্রদান করা হয়।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-600 font-bold">•</span>
                আয়কর মুক্ত রেমিট্যান্স প্রফ সার্টিফিকেট সংগ্রহ করে রাখা বাধ্যতামূলক।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
