import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  AlertTriangle,
  FileText,
  BadgeCheck,
  Receipt,
  PlusCircle,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 27 — Remittance Incentive Calculator · প্রণোদনা
 * Step progress card + Interactive question card + Computation result card + Claim requirements.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function Incentive({ latestIncome = null, rules = [], eligibility = [] }) {
  const { t } = useI18n();

  // Question Stepper State
  const [currentStep, setCurrentStep] = useState(3);
  const totalSteps = 6;
  const [isBankingChannel, setIsBankingChannel] = useState(true);
  const [amountUsd, setAmountUsd] = useState(latestIncome?.amount_usd || 450);
  const [amountBdt, setAmountBdt] = useState(latestIncome?.amount_bdt || 53775);
  const [addedDocsChecklist, setAddedDocsChecklist] = useState(false);

  // Computed 2.5% Cash Incentive (2.5% of amountBdt)
  const incentiveCalculated = Math.round(amountBdt * 0.025);

  const handleFetchFromLedger = () => {
    if (latestIncome) {
      setAmountBdt(latestIncome.amount_bdt || 53775);
      setAmountUsd(latestIncome.amount_usd || Math.round((latestIncome.amount_bdt || 53775) / 119.5));
    } else {
      setAmountUsd(950);
      setAmountBdt(112500);
    }
  };

  const handleAddDocsChecklist = () => {
    router.post(
      '/money/channels/add-doc',
      {
        channel_name: '২.৫% প্রণোদনা দাবি',
        doc_name: 'ব্যাংক সার্টিফিকেট ও ইনভয়েস ডকুমেন্ট',
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setAddedDocsChecklist(true);
          setTimeout(() => setAddedDocsChecklist(false), 3000);
        },
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="প্রণোদনা — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রণোদনা
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            সরকারি ২.৫% প্রণোদনার যোগ্যতা যাচাই ও ক্যাশ ব্যাক হিসাব
          </p>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Progress Card, Question Card, Result Card, Footnote (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header Progress Card */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[13px] font-extrabold text-brand">
                ধাপ {toBnDigits(currentStep)} / {toBnDigits(totalSteps)}
              </span>
              <span className="text-[12px] font-bold text-slate-400">
                যোগ্যতা যাচাই
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            <p className="text-[13.5px] font-medium text-slate-600">
              কয়েকটি প্রশ্নের উত্তর দিলে যোগ্যতা মিলিয়ে দেখা হবে
            </p>
          </div>

          {/* Interactive Question Card */}
          <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden space-y-5">
            
            {/* Context Amount Box */}
            <div className="bg-slate-50/90 rounded-2xl p-3.5 flex justify-between items-center border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-slate-400">প্রাপ্ত অঙ্ক</div>
                  <div className="text-[17px] font-black text-ink leading-tight">
                    USD {toBnDigits(amountUsd)} (৳ {toBnDigits(amountBdt.toLocaleString())})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFetchFromLedger}
                className="text-[12.5px] font-extrabold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-xl border border-brand/20 transition-all cursor-pointer"
              >
                খাতা থেকে নিন
              </button>
            </div>

            {/* Question Heading */}
            <div className="space-y-1">
              <h2 className="text-[19px] font-black text-ink leading-tight">
                টাকাটি কি ব্যাংকিং চ্যানেলে এসেছে?
              </h2>
              <p className="text-[13px] font-medium text-slate-500">
                সরাসরি ব্যাংক ট্রান্সফার বা পেমেন্ট গেটওয়ের মাধ্যমে আসা টাকা কি না।
              </p>
            </div>

            {/* Answer Action Toggle Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsBankingChannel(true)}
                className={`flex-1 h-12 rounded-2xl font-bold text-[14.5px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBankingChannel
                    ? 'bg-brand text-white shadow-brand/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="size-5" />
                হ্যাঁ
              </button>

              <button
                type="button"
                onClick={() => setIsBankingChannel(false)}
                className={`flex-1 h-12 rounded-2xl font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isBankingChannel
                    ? 'bg-amber-600 text-white shadow-amber-600/20'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <XCircle className="size-5" />
                না
              </button>
            </div>

          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-2 opacity-60">
            <div className="h-[1px] bg-slate-300 flex-1" />
            <span className="text-[12px] font-extrabold text-slate-400">ফলাফল প্রিভিউ</span>
            <div className="h-[1px] bg-slate-300 flex-1" />
          </div>

          {/* Result State Card */}
          <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col font-bn">
            
            {/* Top Status Band */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3.5 flex items-center gap-2.5">
              <div className="size-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Check className="size-4 stroke-[3]" />
              </div>
              <span className="text-[15px] font-black text-emerald-800">
                {isBankingChannel ? 'এই প্রাপ্তিটি যোগ্য' : 'এই প্রাপ্তিটি অনানুষ্ঠানিক (অযোগ্য)'}
              </span>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Computation Block */}
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-brand/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13.5px] font-medium text-slate-600">প্রাপ্ত অঙ্ক</span>
                  <span className="text-[15px] font-extrabold text-ink">
                    ৳ {toBnDigits(amountBdt.toLocaleString())}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13.5px] font-medium text-slate-600">প্রণোদনার হার</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-[11.5px] font-extrabold border border-emerald-200">
                    <CheckCircle2 className="size-3.5 text-emerald-700" />
                    ২.৫% সরকারি নগদ সহায়তা
                  </span>
                </div>

                <div className="h-[1px] bg-slate-200/80 w-full" />

                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[15px] font-black text-ink">প্রণোদনা</span>
                  <span className="text-[22px] font-black text-brand">
                    ৳ {toBnDigits(incentiveCalculated.toLocaleString())}
                  </span>
                </div>
              </div>

              <p className="text-[11.5px] font-bold text-slate-400 text-center">
                বাংলাদেশ ব্যাংকের সার্কুলার অনুযায়ী সরকারি ২.৫% প্রণোদনা হার প্রযোজ্য
              </p>

              {/* Rules Matched Section */}
              <div className="space-y-2.5">
                <h3 className="text-[14px] font-extrabold text-ink">যে শর্তগুলো মিলেছে</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span className="text-[13.5px] font-bold text-slate-700">বৈধ চ্যানেলে প্রাপ্তি</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span className="text-[13.5px] font-bold text-slate-700">ফ্রিল্যান্সিং সার্ভিসের বিপরীতে</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                    <span className="text-[13.5px] font-bold text-amber-800">পেমেন্ট গেটওয়ের তথ্য অসম্পূর্ণ</span>
                  </div>
                </div>
              </div>

              {/* Claim Requirements */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <h3 className="text-[14px] font-extrabold text-ink">দাবি করতে যা লাগবে</h3>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-bold text-slate-700 flex items-center gap-1.5 border border-slate-200">
                    <FileText className="size-3.5 text-slate-500" /> ব্যাংক সার্টিফিকেট
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-bold text-slate-700 flex items-center gap-1.5 border border-slate-200">
                    <BadgeCheck className="size-3.5 text-slate-500" /> ট্যাক্স আইডি
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-bold text-slate-700 flex items-center gap-1.5 border border-slate-200">
                    <Receipt className="size-3.5 text-slate-500" /> ইনভয়েস কপি
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddDocsChecklist}
                  className="w-full py-2.5 rounded-2xl border-2 border-brand text-brand hover:bg-brand/5 font-bold text-[13.5px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mt-2"
                >
                  {addedDocsChecklist ? (
                    <>
                      <Check className="size-4 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">কাগজপত্র তালিকায় যুক্ত হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-4" />
                      <span>কাগজপত্র প্রস্তুতিতে যোগ করুন</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/money/incentive/result?is_banking=${isBankingChannel ? 1 : 0}&amount_bdt=${amountBdt}`}
                  className="w-full py-3 rounded-2xl bg-brand hover:bg-brand-dark text-white font-bold text-[13.5px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-3 block text-center"
                >
                  পূর্ণাঙ্গ ফলাফল পেজ দেখুন →
                </Link>
              </div>

            </div>
          </div>

          {/* Footnote Notice */}
          <p className="text-center text-[12.5px] font-bold text-slate-400 pt-2">
            নিয়ম বদলায় — দাবি করার আগে ব্যাংকে মিলিয়ে নিন
          </p>

        </div>

        {/* Right Sidebar Column: 2.5% Remittance Incentive Policy Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Govt Incentive Policy Overview Card */}
          <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/50 to-white">
            <h3 className="text-[15.5px] font-extrabold text-sky-950 flex items-center gap-2">
              <Zap className="size-4 text-sky-600 fill-current" />
              ২.৫% প্রণোদনা সহায়িকা
            </h3>

            <p className="text-[12.5px] text-sky-900 leading-relaxed font-medium">
              বাংলাদেশ ব্যাংকের সার্কুলার অনুযায়ী আইটি ও ফ্রিল্যান্সিং আয়ের ওপর ২.৫% নগদ সহায়তা সরকারিভাবে প্রদান করা হয়।
            </p>

            <Link
              href="/money/documents"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[13px] flex items-center justify-center gap-1 shadow-xs transition-all block text-center cursor-pointer"
            >
              প্রয়োজনীয় ডকুমেন্ট দেখুন →
            </Link>
          </div>

          {/* Claim Instructions Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <BookOpen className="size-4 text-brand" />
              প্রণোদনা পাওয়ার নিয়মাবলী
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                আইটিইএস (ITES) সার্ভিসের পেমেন্ট অবশ্যই বাংলাদেশ ব্যাংকের অনুমোদিত চ্যানেলে আসতে হবে।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                ইনওয়ার্ড রেমিট্যান্স সার্টিফিকেট সংগ্রহ করে আপনার ব্যাংকে আবেদন জমা দিন।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
