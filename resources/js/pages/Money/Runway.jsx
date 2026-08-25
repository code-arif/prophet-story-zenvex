import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
  ShieldCheck,
  TrendingDown,
  Info,
  Edit2,
  Check,
  Zap,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 25 — Financial Stability & Runway · স্থিতিশীলতা ও রানওয়ে
 * 12-month income bar chart with reference lines + Editable essential expense & savings inputs + 3 Result cards + Emergency guide.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function Runway({ monthlyIncome = [], expenses = 32000, savings = 135000 }) {
  const { t } = useI18n();

  // Editable Form Inputs State
  const [essentialExpense, setEssentialExpense] = useState(expenses || 32000);
  const [currentSavings, setCurrentSavings] = useState(savings || 135000);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [isEditingSavings, setIsEditingSavings] = useState(false);

  // Fallback demo 12-month bar chart data matching UI HTML specs
  const defaultBars = [
    { month: 'মে', heightPct: 70, amount: 68000, isLow: false },
    { month: 'জুন', heightPct: 85, amount: 82000, isLow: false },
    { month: 'জুলাই', heightPct: 60, amount: 58000, isLow: false },
    { month: 'আগস্ট', heightPct: 15, amount: 15000, isLow: true },
    { month: 'সেপ্টেম্বর', heightPct: 90, amount: 88000, isLow: false },
    { month: 'অক্টোবর', heightPct: 55, amount: 53000, isLow: false },
    { month: 'নভেম্বর', heightPct: 10, amount: 9000, isLow: true, isWorst: true }, // Worst
    { month: 'ডিসেম্বর', heightPct: 75, amount: 72000, isLow: false },
    { month: 'জানুয়ারি', heightPct: 45, amount: 44000, isLow: false },
    { month: 'ফেব্রুয়ারি', heightPct: 80, amount: 78000, isLow: false },
    { month: 'মার্চ', heightPct: 20, amount: 20000, isLow: true },
    { month: 'এপ্রিল', heightPct: 65, amount: 63000, isLow: false },
  ];

  // Map real backend Eloquent monthlyIncome or fallback demo
  const chartBars = monthlyIncome && monthlyIncome.length > 0
    ? monthlyIncome.map((item, idx) => {
        const amt = item.total ? Math.round(item.total / 100) : 45000;
        return {
          month: item.month ? String(item.month) : `ম-${idx + 1}`,
          heightPct: Math.min(100, Math.max(10, Math.round((amt / 100000) * 100))),
          amount: amt,
          isLow: amt < 30000,
          isWorst: amt === 9000,
        };
      })
    : defaultBars;

  const avgIncomeBdt = 65300;
  const worstMonthBdt = 9000;

  // Dynamic Runway Calculation Math
  const safeExpenseLimitBdt = 37000; // Safe monthly expense cap
  const runwayMonths = (currentSavings / (essentialExpense || 1)).toFixed(1);
  const additionalNeededBdt = Math.max(0, safeExpenseLimitBdt * 6 - currentSavings);
  const progressBarWidthPct = Math.min(100, Math.max(10, Math.round((parseFloat(runwayMonths) / 5) * 100)));

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="স্থিতিশীলতা ও রানওয়ে — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            স্থিতিশীলতা ও রানওয়ে
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            আয়ের অনিশ্চয়তা ও খারাপ মাস সামলানোর প্রস্তুতি
          </p>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Bar Chart, Editable Input Card, 3 Result Cards, Footer Note (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Income Analysis Card ("মাসিক আয় বিশ্লেষণ") */}
          <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden space-y-4">
            <h2 className="text-[18px] font-bold text-ink">মাসিক আয় বিশ্লেষণ</h2>

            {/* 12-Month Bar Chart Container */}
            <div className="relative h-44 w-full flex items-end justify-between gap-1 mt-6 mb-2">
              
              {/* Average Reference Line */}
              <div className="absolute left-0 right-0 top-[35%] h-[1px] border-t border-dashed border-slate-400/60 z-10">
                <span className="absolute -top-5 right-0 text-[10.5px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  গড় ৳ {toBnDigits(avgIncomeBdt.toLocaleString())}
                </span>
              </div>

              {/* Worst Month Reference Line */}
              <div className="absolute left-0 right-0 top-[85%] h-[1px] border-t border-dotted border-slate-400/50 z-10">
                <span className="absolute -top-5 right-0 text-[10.5px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  সবচেয়ে খারাপ মাস ৳ {toBnDigits(worstMonthBdt.toLocaleString())}
                </span>
              </div>

              {/* Bars (12 months) */}
              {chartBars.map((bar, idx) => (
                <div key={idx} className="w-full flex flex-col items-center h-full justify-end relative z-20 group">
                  <div
                    className={`w-full rounded-t-md transition-all group-hover:bg-brand-dark ${
                      bar.isLow ? 'bg-brand/40' : 'bg-brand'
                    }`}
                    style={{ height: `${bar.heightPct}%` }}
                    title={`${bar.month}: ৳ ${bar.amount.toLocaleString()}`}
                  />
                </div>
              ))}
            </div>

            <p className="text-[12px] font-bold text-slate-400 text-center">
              ১২ মাসের তথ্য দিয়ে হিসাব
            </p>
          </div>

          {/* Input Card: Essential Expense & Hand Savings */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            {/* Field 1: monthly essential expense */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[14px] font-bold text-ink">
                মাসিক অপরিহার্য খরচ
              </span>
              <div className="flex items-center gap-2 bg-blue-50/70 px-3.5 py-1.5 rounded-xl border border-slate-200">
                {isEditingExpense ? (
                  <input
                    type="number"
                    autoFocus
                    value={essentialExpense}
                    onChange={(e) => setEssentialExpense(Number(e.target.value))}
                    onBlur={() => setIsEditingExpense(false)}
                    className="w-24 bg-transparent text-[14px] font-black text-brand outline-none"
                  />
                ) : (
                  <span className="text-[14px] font-black text-brand">
                    ৳ {toBnDigits(essentialExpense.toLocaleString())}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingExpense((prev) => !prev)}
                  className="text-slate-400 hover:text-brand cursor-pointer p-0.5"
                >
                  {isEditingExpense ? <Check className="size-4 text-emerald-600" /> : <Edit2 className="size-4" />}
                </button>
              </div>
            </div>

            {/* Field 2: hand savings */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[14px] font-bold text-ink">
                হাতে থাকা সঞ্চয়
              </span>
              <div className="flex items-center gap-2 bg-blue-50/70 px-3.5 py-1.5 rounded-xl border border-slate-200">
                {isEditingSavings ? (
                  <input
                    type="number"
                    autoFocus
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    onBlur={() => setIsEditingSavings(false)}
                    className="w-28 bg-transparent text-[14px] font-black text-brand outline-none"
                  />
                ) : (
                  <span className="text-[14px] font-black text-brand">
                    ৳ {toBnDigits(currentSavings.toLocaleString())}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingSavings((prev) => !prev)}
                  className="text-slate-400 hover:text-brand cursor-pointer p-0.5"
                >
                  {isEditingSavings ? <Check className="size-4 text-emerald-600" /> : <Edit2 className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3 Result Cards */}
          <div className="space-y-4">
            
            {/* Card 1: Safe Expense Limit */}
            <div className="glass p-5 rounded-2xl border border-emerald-100 shadow-2xs flex items-start justify-between bg-gradient-to-r from-emerald-50/40 to-white">
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-slate-800">
                  নিরাপদ মাসিক খরচের সীমা
                </span>
                <span className="text-[12px] font-medium text-slate-500 mt-0.5">
                  সবচেয়ে খারাপ মাস ধরে হিসাব করা
                </span>
              </div>
              <span className="text-[22px] font-black text-emerald-600 shrink-0">
                ৳ {toBnDigits(safeExpenseLimitBdt.toLocaleString())}
              </span>
            </div>

            {/* Card 2: Runway Progress Bar */}
            <div className="glass p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[14px] font-extrabold text-slate-800">
                  বর্তমান সঞ্চয়ে চলবে
                </span>
                <span className="text-[24px] font-black text-brand leading-none">
                  {toBnDigits(runwayMonths)} মাস
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-brand rounded-full transition-all duration-700"
                  style={{ width: `${progressBarWidthPct}%` }}
                />
              </div>

              {/* Scale Markers */}
              <div className="flex justify-between text-[11px] font-extrabold text-slate-400 px-1">
                <span>১</span>
                <span>২</span>
                <span>৩</span>
                <span className="text-brand font-black">৪</span>
                <span>৫+</span>
              </div>
            </div>

            {/* Card 3: Need More for Bad Month */}
            <div className="glass p-5 rounded-2xl border border-amber-100 shadow-2xs flex items-start justify-between bg-gradient-to-r from-amber-50/40 to-white">
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-slate-800">
                  একটি খারাপ মাস সামলাতে আরও দরকার
                </span>
                <span className="text-[12px] font-medium text-slate-500 mt-0.5">
                  গড় নয়, খারাপ মাসের ভিত্তিতে
                </span>
              </div>
              <span className="text-[20px] font-black text-amber-600 shrink-0">
                ৳ {toBnDigits(additionalNeededBdt.toLocaleString())}
              </span>
            </div>

          </div>

          {/* Footer Note Card */}
          <div className="glass p-3.5 rounded-xl border border-sky-200/60 flex items-start gap-2.5 bg-sky-50/40">
            <Info className="size-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-[12px] font-bold text-sky-900 leading-tight">
              ৬ মাসের কম তথ্য থাকলে সংখ্যাগুলো নড়বড়ে থাকে
            </p>
          </div>

        </div>

        {/* Right Sidebar Column: Financial Health Assessment & Emergency Fund Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Financial Health Score Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" />
              রানওয়ে হেলথ স্ট্যাটাস
            </h3>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center space-y-1">
              <p className="text-[26px] font-black text-emerald-700 leading-none">
                {toBnDigits(runwayMonths)} মাস রানওয়ে
              </p>
              <p className="text-[12px] font-bold text-emerald-800">
                নিরাপদ (৩-৬ মাস সেফটি বাফার)
              </p>
            </div>
          </div>

          {/* Emergency Fund Guidelines */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <Zap className="size-4 text-brand fill-current" />
              রানওয়ে বাড়ানোর কৌশল
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                মাসিক অনাবশ্যক সাবস্ক্রিপশন ফি বন্ধ করুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                কমপক্ষে ৩ মাসের মূল খরচের সমপরিমাণ টাকা আলাদা সেভিংস একাউন্টে রাখুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                ভালো আয়ের মাসে অতিরিক্ত অর্থ রানওয়ে ফান্ডে রিফিল করুন।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
