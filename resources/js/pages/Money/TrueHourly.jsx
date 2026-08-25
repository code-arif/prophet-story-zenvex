import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
  Briefcase,
  ChevronDown,
  TrendingDown,
  Save,
  Check,
  Loader2,
  HelpCircle,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 24 — Rate & True Hourly Rate Calculator · রেট ও প্রকৃত ঘণ্টা-আয়
 * Completed job context picker + Work hours breakdown + Deductions + Expected vs Actual rate comparison + Target verdict track.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function TrueHourly({ jobs = [] }) {
  const { t } = useI18n();

  // Fallback demo jobs matching UI HTML specs
  const defaultJobs = [
    {
      id: 1,
      title: 'লোগো ডিজাইন',
      client_name: 'Ahmed Traders',
      agreed_bdt: 12000,
      core_hours: 18,
      revision_hours: 4.5,
      communication_hours: 3,
      proposal_hours: 2,
      conversion_loss_bdt: 360,
    },
    {
      id: 2,
      title: 'ইউআই/ইউএক্স রিডিজাইন',
      client_name: 'TechNova Solutions',
      agreed_bdt: 25000,
      core_hours: 30,
      revision_hours: 6,
      communication_hours: 4,
      proposal_hours: 3,
      conversion_loss_bdt: 750,
    },
  ];

  const jobOptions = jobs && jobs.length > 0
    ? jobs.map((j, idx) => ({
        id: j.id,
        title: j.title || (idx === 0 ? 'লোগো ডিজাইন' : 'ইউআই/ইউএক্স রিডিজাইন'),
        client_name: j.client ? j.client.name : (idx === 0 ? 'Ahmed Traders' : 'TechNova Solutions'),
        agreed_bdt: j.agreed_paisa ? Math.round(j.agreed_paisa / 100) : (idx === 0 ? 12000 : 25000),
        core_hours: idx === 0 ? 18 : 30,
        revision_hours: idx === 0 ? 4.5 : 6,
        communication_hours: idx === 0 ? 3 : 4,
        proposal_hours: idx === 0 ? 2 : 3,
        conversion_loss_bdt: idx === 0 ? 360 : 750,
      }))
    : defaultJobs;

  // Selected Job State
  const [selectedJobId, setSelectedJobId] = useState(jobOptions[0]?.id || 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [minTargetRate, setMinTargetRate] = useState(800);

  const activeJob = jobOptions.find((j) => j.id === selectedJobId) || jobOptions[0];

  // Core Math Calculations
  const agreedBdt = activeJob.agreed_bdt || 12000;
  const coreHours = activeJob.core_hours || 18;
  const revHours = activeJob.revision_hours || 4.5;
  const commHours = activeJob.communication_hours || 3;
  const propHours = activeJob.proposal_hours || 2;
  const conversionLoss = activeJob.conversion_loss_bdt || 360;

  const totalActualHours = coreHours + revHours + commHours + propHours;
  const netEarningsBdt = Math.max(0, agreedBdt - conversionLoss);

  // Expected rate vs Actual true rate
  const expectedRate = Math.round(agreedBdt / (coreHours || 1));
  const actualTrueRate = Math.round(netEarningsBdt / (totalActualHours || 1));

  const pctDrop = Math.max(0, Math.round(((expectedRate - actualTrueRate) / expectedRate) * 100));
  const isBelowTarget = actualTrueRate < minTargetRate;

  // Track Dot Position Percentage (clamp between 10% and 90%)
  const dotTrackPct = Math.min(90, Math.max(10, Math.round((actualTrueRate / (minTargetRate * 1.6)) * 100)));

  const handleSaveCalculation = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="রেট ও প্রকৃত ঘণ্টা-আয় — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            রেট ও প্রকৃত ঘণ্টা-আয়
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            প্রজেক্টে সময় ও হিডেন কস্ট হিসেব করে প্রকৃত ঘণ্টা-আয় বের করুন
          </p>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Context Selector, Input Card, Result Card, Verdict Area, Save Button (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Context Selector (Finished Job Picker) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Briefcase className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-ink group-hover:text-brand transition-colors">
                    {activeJob.title} — {activeJob.client_name}
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400">
                    শেষ হওয়া কাজ থেকে বেছে নিন
                  </p>
                </div>
              </div>

              <ChevronDown className="size-5 text-slate-400 group-hover:text-ink transition-colors" />
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 divide-y divide-slate-100 overflow-hidden font-bn animate-in fade-in duration-150">
                {jobOptions.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedJobId === job.id ? 'bg-blue-50/50 font-bold text-brand' : 'text-ink'
                    }`}
                  >
                    <span className="text-[14px]">
                      {job.title} — {job.client_name}
                    </span>
                    <span className="text-[12.5px] font-extrabold text-slate-500">
                      ৳ {toBnDigits(job.agreed_bdt.toLocaleString())}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Card: কাজের তথ্য */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-[16px] font-bold text-ink">কাজের তথ্য</h2>

            <div className="space-y-2.5">
              {/* Field 1: সম্মত দর */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                <span className="text-[13.5px] font-medium text-slate-700">সম্মত দর</span>
                <span className="text-[15px] font-black text-brand">
                  ৳ {toBnDigits(agreedBdt.toLocaleString())}
                </span>
              </div>

              {/* Field 2: কাজের ঘণ্টা */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                <span className="text-[13.5px] font-medium text-slate-700">কাজের ঘণ্টা</span>
                <span className="text-[15px] font-black text-slate-800">
                  {toBnDigits(coreHours)}
                </span>
              </div>

              {/* Field 3: রিভিশনের ঘণ্টা */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[13.5px] font-medium text-slate-700">রিভিশনের ঘণ্টা</span>
                </div>
                <span className="text-[15px] font-black text-slate-800">
                  {toBnDigits(revHours)}
                </span>
              </div>

              {/* Field 4: যোগাযোগ ও তাগাদার ঘণ্টা */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[13.5px] font-medium text-slate-700">
                    যোগাযোগ ও তাগাদার ঘণ্টা
                  </span>
                </div>
                <span className="text-[15px] font-black text-slate-800">
                  {toBnDigits(commHours)}
                </span>
              </div>

              {/* Field 5: এই কাজ পেতে প্রস্তাব লেখার ঘণ্টা */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[13.5px] font-medium text-slate-700">
                    এই কাজ পেতে প্রস্তাব লেখার ঘণ্টা
                  </span>
                </div>
                <span className="text-[15px] font-black text-slate-800">
                  {toBnDigits(propHours)}
                </span>
              </div>
            </div>

            {/* Deductions Inset Box */}
            <div className="bg-blue-50/70 rounded-2xl p-4 space-y-3 border border-blue-200/60">
              <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider">
                কর্তনসমূহ (Hidden Costs)
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-700">মার্কেটপ্লেস ফি</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 text-[11.5px] font-extrabold">
                  <Clock className="size-3.5 mr-1 text-amber-700" />
                  TODO — যাচাই বাকি
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-700">রূপান্তরের ক্ষতি</span>
                <span className="text-[13px] font-bold text-slate-800">
                  ৳ {toBnDigits(conversionLoss)}
                </span>
              </div>
            </div>
          </div>

          {/* Result Comparison Card */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Expected Rate */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[12px] font-bold text-slate-400 mb-1">
                  যা ভেবেছিলেন
                </span>
                <span className="text-[26px] font-black text-slate-500 leading-none">
                  ৳ {toBnDigits(expectedRate)}
                </span>
                <span className="text-[12px] font-bold text-slate-400 mt-1">/ ঘণ্টা</span>
              </div>

              {/* Center Divider Line */}
              <div className="w-[1px] h-14 bg-slate-200" />

              {/* Actual Rate */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[12.5px] font-extrabold text-ink mb-1">
                  আসলে যা হলো
                </span>
                <span className="text-[26px] font-black text-amber-600 leading-none">
                  ৳ {toBnDigits(actualTrueRate)}
                </span>
                <span className="text-[12px] font-bold text-ink mt-1">/ ঘণ্টা</span>
              </div>
            </div>

            {/* Warning Drop Badge */}
            <div className="bg-amber-100/60 rounded-xl p-2.5 flex items-center justify-center gap-2 border border-amber-200/80">
              <TrendingDown className="size-4 text-amber-700" />
              <span className="text-[13px] font-bold text-amber-900">
                {toBnDigits(pctDrop)}% কম ঘণ্টা-আয়
              </span>
            </div>
          </div>

          {/* Verdict Area & Track */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-[15px] font-extrabold text-ink">
              {isBelowTarget ? 'আপনার নিজের সর্বনিম্ন হারের নিচে' : 'আপনার টার্গেট হারের উপরে'}
            </h3>

            {/* Visualization Track Bar */}
            <div className="relative h-12 w-full mt-2">
              {/* Background Track */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-slate-200 rounded-full" />

              {/* Target Marker Line (at 50%) */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-[2px] h-6 bg-slate-500 -ml-[1px] z-10" />
              <span className="absolute top-8 left-[50%] -translate-x-1/2 text-[11.5px] font-bold text-slate-500 whitespace-nowrap">
                সর্বনিম্ন ৳ {toBnDigits(minTargetRate)}
              </span>

              {/* Calculated Rate Dot Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 size-4 bg-amber-600 rounded-full shadow-md z-20 border-2 border-white -ml-2 transition-all duration-700"
                style={{ left: `${dotTrackPct}%` }}
                title={`প্রকৃত ঘণ্টা-আয় ৳ ${actualTrueRate}`}
              />
            </div>

            {/* History Chips */}
            <div className="pt-2 space-y-2">
              <span className="text-[12px] font-bold text-slate-400 block">
                পূর্ববর্তী কাজসমূহ
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 font-mono">
                {['৪১০', '৪৫০', '৪৩৫', '৫২০'].map((chip, i) => (
                  <div
                    key={i}
                    className={`shrink-0 bg-white border border-slate-200 rounded-full px-3 py-1 text-[12px] font-bold ${
                      i === 3 ? 'text-slate-400 opacity-60' : 'text-slate-700'
                    }`}
                  >
                    ৳ {chip}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <button
            type="button"
            onClick={handleSaveCalculation}
            disabled={isSaving}
            className="w-full h-13 rounded-2xl border-2 border-brand text-brand hover:bg-brand/5 active:scale-[0.98] font-bold text-[14.5px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="size-5 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">হিসাব সফলভাবে সংরক্ষিত হয়েছে!</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>এই হিসাব সংরক্ষণ করুন</span>
              </>
            )}
          </button>

        </div>

        {/* Right Sidebar Column: Minimum Target Rate Stepper & Strategy Guide (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Target Hourly Rate Stepper */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15.5px] font-bold text-ink flex items-center gap-2">
              <Clock className="size-4 text-brand" />
              আপনার সর্বনিম্ন ঘণ্টার রেট
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <p className="text-[28px] font-black text-brand leading-none">
                ৳ {toBnDigits(minTargetRate)} <span className="text-[14px] text-slate-400 font-normal">/ ঘণ্টা</span>
              </p>
              <p className="text-[12px] font-bold text-slate-500">
                এর নিচে কাজ করা লাভজনক নয়
              </p>
            </div>
          </div>

          {/* True Hourly Rate Strategy Guide */}
          <div className="glass p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-3 bg-gradient-to-br from-amber-50/40 to-white">
            <h3 className="text-[15px] font-bold text-amber-950 flex items-center gap-2">
              <Zap className="size-4 text-amber-600 fill-current" />
              হিডেন আওয়ার্স কমানোর উপায়
            </h3>

            <ul className="text-[12.5px] text-amber-900 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                কাজের চুক্তিতে সর্বোচ্চ ২টি রিভিশন অন্তর্ভুক্ত রাখুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                যোগাযোগের জন্য দিনে নির্দিষ্ট ১৫ মিনিট বরাদ্দ রাখুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                প্রস্তাব লেখার সময় কাস্টম টেমপ্লেট ব্যবহার করে সময় বাঁচান।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
