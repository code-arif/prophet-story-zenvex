import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Clock,
  Settings,
  Plus,
  Minus,
  X,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 20 — Capacity Meter · কাজের চাপ মিটার
 * Semi-circle SVG Arc gauge + Project workload breakdown + AI pressure relief tips.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function CapacityMeter({
  weeklyHours = 25,
  committedHours = 32,
  committed = [],
  available = 0,
}) {
  const { t } = useI18n();

  // State for capacity modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetHours, setTargetHours] = useState(weeklyHours);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync prop changes to local target hours
  useEffect(() => {
    setTargetHours(weeklyHours);
  }, [weeklyHours]);

  const used = Number(committedHours) || 32;
  const max = Number(weeklyHours) || 25;
  const isOverCapacity = used > max;
  const overHours = Math.max(0, used - max);

  // Gauge needle rotation calculation (-70deg to +70deg)
  const needleRotation = isOverCapacity
    ? 70
    : Math.round(((used / (max || 1)) * 140) - 70);

  // Project breakdown rows matching UI spec
  const projectBreakdown = [
    {
      id: 1,
      title: 'লোগো ডিজাইন',
      client: 'Ahmed Traders',
      deadline: '৩ দিন বাকি',
      deadline_is_urgent: false,
      hours: 12,
      pct: 40,
      is_over_warning: true,
    },
    {
      id: 2,
      title: 'ব্যানার সেট',
      client: 'Nabila Store',
      deadline: 'আজ',
      deadline_is_urgent: true,
      hours: 8,
      pct: 25,
      is_over_warning: true,
    },
    {
      id: 3,
      title: 'সোশ্যাল মিডিয়া পোস্ট',
      client: 'Travel Bee',
      deadline: 'পরের সপ্তাহ',
      deadline_is_urgent: false,
      hours: 6,
      pct: 20,
      is_over_warning: false,
    },
  ];

  // AI suggestions list
  const suggestions = [
    {
      id: 1,
      title: 'লোগো ডিজাইন',
      client: 'Ahmed Traders',
      suggestionText: 'Ahmed Traders এর সময়সীমা ৩ দিন পেছালে ৬ ঘণ্টা মুক্ত হয়',
      link: '/work/jobs/1',
    },
    {
      id: 2,
      title: 'ব্যানার সেট',
      client: 'Nabila Store',
      suggestionText: 'Nabila Store পরের সপ্তাহে সরালে ৫ ঘণ্টা মুক্ত হয়',
      link: '/work/jobs/2',
    },
  ];

  // Stepper handlers
  const handleIncreaseTarget = () => setTargetHours((prev) => Math.min(80, prev + 5));
  const handleDecreaseTarget = () => setTargetHours((prev) => Math.max(5, prev - 5));

  // Save Capacity Settings Handler
  const handleSaveCapacity = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    router.post(
      '/work/capacity',
      { weekly_hours: targetHours },
      {
        preserveScroll: true,
        onSuccess: () => setIsModalOpen(false),
        onFinish: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="কাজের চাপ মিটার — ইজি রাইজ" />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            কাজের চাপ মিটার
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            সাপ্তাহিক ওয়ার্কলোড, কাজের ঘণ্টা ট্র্যাকিং ও ক্যাপাসিটি ব্যালেন্স
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Settings className="size-4" />
          সাপ্তাহিক ঘণ্টা বদলান
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Gauge Card, Project Breakdown, AI Suggestions (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Capacity SVG Gauge Card */}
          <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-amber-50/30 to-white">
            {/* Decorative background glow behind gauge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/10 blur-2xl rounded-full" />

            <div className="relative w-56 h-28 mt-4 flex justify-center items-end">
              {/* SVG Half Circle Gauge Arc */}
              <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 50">
                {/* Background Track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#E1E2ED"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                {/* Filled Track (Amber for over capacity / Brand blue for normal) */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke={isOverCapacity ? '#D97706' : '#1D6FF2'}
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{
                    strokeDasharray: 283,
                    strokeDashoffset: isOverCapacity ? 0 : 50,
                    transition: 'stroke-dashoffset 1s ease-out',
                  }}
                />
              </svg>

              {/* Rotating Gauge Needle */}
              <div
                className="absolute bottom-[-4px] left-1/2 w-[2.5px] h-20 bg-slate-800 origin-bottom -translate-x-1/2 transition-transform duration-1000 ease-out z-10"
                style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 absolute bottom-0 -left-[3.5px]" />
              </div>

              {/* Central Values Display */}
              <div className="z-20 text-center mb-[-8px]">
                <span className="text-[32px] font-black text-ink leading-none">
                  {toBnDigits(used)} <span className="text-amber-600">/ {toBnDigits(max)}</span>
                </span>
              </div>
            </div>

            <p className="text-[12.5px] font-semibold text-slate-500 mt-4">
              এই সপ্তাহে দরকার / আপনি দিতে পারবেন (ঘণ্টা)
            </p>

            {/* Warning Strip */}
            {isOverCapacity ? (
              <div className="mt-4 py-2.5 px-4 bg-amber-500/10 border border-amber-200 rounded-xl w-full flex items-center justify-center gap-2">
                <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                <p className="text-[13.5px] font-bold text-amber-900">
                  ক্ষমতার {toBnDigits(overHours)} ঘণ্টা বেশি নেওয়া হয়েছে
                </p>
              </div>
            ) : (
              <div className="mt-4 py-2.5 px-4 bg-emerald-500/10 border border-emerald-200 rounded-xl w-full flex items-center justify-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <p className="text-[13.5px] font-bold text-emerald-900">
                  কাজের চাপ স্বাভাবিক সীমার ভেতরে রয়েছে
                </p>
              </div>
            )}
          </div>

          {/* Project Demand Breakdown Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-[17.5px] font-bold text-ink">
              কোন কাজ কত চাইছে
            </h2>

            <div className="space-y-4">
              {projectBreakdown.map((row) => (
                <div key={row.id} className="flex flex-col gap-1.5 relative pl-3.5">
                  {/* Left Edge Indicator Line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                      row.is_over_warning ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                  />

                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[14.5px] text-ink">
                      {row.title}
                    </span>
                    <span
                      className={`text-[12px] font-bold ${
                        row.deadline_is_urgent ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {row.deadline}
                    </span>
                  </div>

                  <span className="text-[12px] font-medium text-slate-400 -mt-1">
                    {row.client}
                  </span>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        row.is_over_warning ? 'bg-amber-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>

                  <span className="text-[12px] font-bold text-slate-600 text-right">
                    {toBnDigits(row.hours)} ঘণ্টা
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pressure Relief Suggestions Card */}
          <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/40 to-white">
            <div className="flex items-center gap-2 text-sky-700">
              <Lightbulb className="size-5 fill-sky-700/20" />
              <h2 className="text-[16px] font-bold">চাপ কমাতে AI পরামর্শ</h2>
            </div>

            <div className="space-y-2.5">
              {suggestions.map((sug) => (
                <Link
                  key={sug.id}
                  href={sug.link}
                  className="flex items-center justify-between text-left p-3.5 rounded-xl bg-white hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-all group cursor-pointer shadow-2xs"
                >
                  <p className="text-[13px] font-medium text-slate-700 pr-3 leading-relaxed">
                    <span className="font-bold text-ink">{sug.title}</span> — {sug.suggestionText}
                  </p>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
                </Link>
              ))}
            </div>

            <p className="text-[11.5px] font-medium text-slate-400 text-center pt-1">
              কোন কাজটি সরাবেন সেটা আপনার চূড়ান্ত সিদ্ধান্ত
            </p>
          </div>

          {/* Bottom Action Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-brand text-brand hover:bg-brand/5 active:scale-[0.98] font-bold text-[14.5px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Settings className="size-4" />
            <span>সাপ্তাহিক ঘণ্টা বদলান</span>
          </button>

        </div>

        {/* Right Sidebar Column: Target Settings & Workload Advice (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Target Capacity Stepper Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-[15.5px] font-bold text-ink flex items-center gap-2">
              <Clock className="size-4 text-brand" />
              সাপ্তাহিক টার্গেট ক্যাপাসিটি
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-slate-500">আপনার টার্গেট</p>
                <p className="text-[24px] font-black text-brand leading-none mt-1">
                  {toBnDigits(targetHours)} ঘণ্টা
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white text-[12.5px] font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                পরিবর্তন
              </button>
            </div>
          </div>

          {/* Workload Balance Advice */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-600" />
              ওয়ার্কলোড ব্যালেন্স টিপস
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                সাপ্তাহিক ২৫–৩০ ঘণ্টার বেশি নতুন কাজ নেওয়া ঝুঁকিপূর্ণ।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                বড় প্রজেক্টের মাঝখানে ২০% সময় বাফার হিসেবে রাখুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                বার্নআউট এড়াতে অতিরিক্ত চাহিদায় ডাইন আউট করুন।
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Edit Target Capacity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-bn relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-[18px] font-bold text-ink">
                সাপ্তাহিক ঘণ্টা সেট করুন
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCapacity} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700">
                  প্রতি সপ্তাহে কত ঘণ্টা কাজ করতে চান?
                </label>
                
                <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <button
                    type="button"
                    onClick={handleDecreaseTarget}
                    className="size-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Minus className="size-5" />
                  </button>

                  <div className="text-center min-w-[90px]">
                    <span className="text-[32px] font-black text-brand leading-none">
                      {toBnDigits(targetHours)}
                    </span>
                    <p className="text-[12px] font-bold text-slate-500">ঘণ্টা / সপ্তাহ</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleIncreaseTarget}
                    className="size-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-[13.5px] cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[13.5px] shadow-md shadow-brand/20 cursor-pointer flex items-center gap-2 disabled:opacity-70 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
