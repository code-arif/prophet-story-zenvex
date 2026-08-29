import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  Plus,
  DollarSign,
  Bot,
  Zap,
  Briefcase,
  Wallet,
  Gauge,
  Sparkles,
  FileText,
  FileCheck,
  Building2,
  Target,
  Bell,
  ArrowUpRight,
  Lightbulb,
  Play,
  Award,
  UserCheck,
  PieChart,
  Gift,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 04 — Today Hub · আজ (Freelancing OS 2.0 Daily Driver)
 * Comprehensive feature-packed home dashboard for easy rise.
 */
export default function Today({
  jobsDue,
  moneyOwed,
  weeklyLoad,
  ladderStage,
}) {
  const { t } = useI18n();
  const { user, subscriber } = usePage().props;

  // Dynamic user name
  const userName = subscriber?.name || user?.name || 'ব্যবহারকারী';

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'শুভ সকাল'
      : hour < 17
      ? 'শুভ দুপুর'
      : 'শুভ সন্ধ্যা';

  // Format today's date in Bangla
  const now = new Date();
  const monthsBn = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];
  const dateStr = `${toBnDigits(now.getDate())} ${
    monthsBn[now.getMonth()]
  } ${toBnDigits(now.getFullYear())}`;

  // Weekly plan checkboxes state
  const [goals, setGoals] = useState({
    proposals: true,
    followup: false,
    proof: true,
  });

  const toggleGoal = (key) =>
    setGoals((prev) => ({ ...prev, [key]: !prev[key] }));

  // Comprehensive OS 2.0 Mock Dashboard Data
  const data = {
    // Metric 1: Active Jobs
    activeJobsCount: 3,
    agreedAmount: '৪২,০০০',

    // Metric 2: Overdue / Pending Money
    overdueAmount: '১৮,৫০০',
    overdueJobsCount: 2,
    maxLateDays: 21,

    // Metric 3: True Hourly Rate
    trueHourlyCurrent: 740,
    trueHourlyTarget: 800,

    // Metric 4: Financial Runway
    runwayMonths: 4.2,

    // Scope Guard Risk Alert
    scopeAlert: {
      active: true,
      jobName: 'লোগো ডিজাইন — Ahmed Traders',
      riskMessage: '৩টি অতিরিক্ত ফ্রি রিভিশন চাওয়া হয়েছে — নিট ঘণ্টা-রেট ৳ ৬৫০ এ নেমে যাওয়ার ঝুঁকি!',
      href: '/work/scope',
    },

    // Today's Jobs List
    todayJobs: [
      {
        id: 1,
        title: 'লোগো ডিজাইন — Ahmed Traders',
        dueText: 'আজ রাত ১০টা',
        isUrgent: true,
        href: '/work',
      },
      {
        id: 2,
        title: 'সোশ্যাল মিডিয়া পোস্ট — Nabila Store',
        dueText: 'আগামীকাল',
        isUrgent: false,
        href: '/work',
      },
      {
        id: 3,
        title: 'ওয়েবসাইট ব্যানার পেক — IT Solution',
        dueText: '৩ দিন বাকি',
        isUrgent: false,
        href: '/work',
      },
    ],

    // Weekly Capacity
    weeklyHoursUsed: 20,
    weeklyHoursMax: 25,

    // Rise Ladder
    ladderStage: 2,
    ladderStageTitle: 'নিয়মিত সরাসরি ক্লায়েন্ট',
    ladderNextRequirement: 'পরের ধাপে যেতে আর ২টি সরাসরি ক্লায়েন্ট রিভিউ দরকার',

    // Monthly Target & Incentive
    monthlyTarget: 50000,
    monthlyAchieved: 38500,
    incentiveEarned: '১,৫৪০',

    // Active Live Pace
    activeTimerJob: 'লোগো ডিজাইন — Ahmed Traders',
    activeTimerTime: '২ ঘণ্টা ৪৫ মিনিট',
    activeTimerRate: 720,

    // Daily Insight Tip
    dailyTip: 'স্কোপক্রিপ রোধে কাজ শুরু করার আগেই ৩টি ফ্রি রিভিশন সীমা ও লিখিত সম্মতি নিশ্চিত করুন।',

    // Client Trust Scores
    clientTrustScores: [
      { name: 'আজমাইন টেক', score: 92, status: 'সময়মতো পেমেন্ট', isGood: true },
      { name: 'আহমেদ ট্রেডার্স', score: 78, status: '১টি মাইলস্টোন বকেয়া', isGood: false },
    ],
  };

  const remainingHours = data.weeklyHoursMax - data.weeklyHoursUsed;
  const capacityPct = Math.round(
    (data.weeklyHoursUsed / data.weeklyHoursMax) * 100
  );

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto">
      <Head title="আজ — ইজি রাইজ" />

      {/* Header Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-black text-ink tracking-tight">
              {greeting}, {userName}
            </h1>
            <span className="bg-brand/10 text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              OS 2.0
            </span>
          </div>
          <p className="text-[13.5px] text-muted font-medium flex items-center gap-1.5 mt-1">
            <Calendar className="size-4 text-brand" />
            {dateStr} — ফ্রিল্যান্সিং ক্যারিয়ার ড্যাশবোর্ড
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/work"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white rounded-xl text-[13px] font-bold active:scale-95 transition-all shadow-md shadow-brand/20"
          >
            <Plus className="size-4" />
            নতুন কাজ
          </Link>
          <Link
            href="/money/ledger"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-bold active:scale-95 transition-all shadow-md shadow-emerald-600/20"
          >
            <DollarSign className="size-4" />
            আয় যোগ করুন
          </Link>
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white rounded-xl text-[13px] font-bold active:scale-95 transition-all shadow-md shadow-violet-600/20"
          >
            <Sparkles className="size-4" />
            AI সহকারী
          </Link>
        </div>
      </div>

      {/* Section: Monthly Target & Daily Freelancer Tip Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Goal Card */}
        <div className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2 bg-gradient-to-br from-emerald-50/40 via-white to-brand/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <PieChart className="size-4" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold text-ink">চলতি মাসের ইনকাম টার্গেট</h3>
                <p className="text-[11px] text-muted">লক্ষ্য: ৳ ৫০,০০০</p>
              </div>
            </div>
            <span className="text-[12px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ৭৭% অর্জিত
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/50">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: '77%' }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-0.5">
              <span>৳ ৩৮,৫০০ আয় হয়েছে</span>
              <Link href="/money/ledger" className="text-emerald-700 hover:underline">
                লেজার দেখুন →
              </Link>
            </div>
          </div>
        </div>

        {/* Daily Tip Card */}
        <div className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2 bg-gradient-to-br from-blue-50/40 via-white to-purple-50/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="text-[13.5px] font-bold text-ink">আজকের ফ্রিল্যান্সিং ইনসাইট</h3>
            </div>
            <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
              দৈনিক টিপ
            </span>
          </div>

          <p className="text-[12.5px] text-slate-700 leading-relaxed font-medium">
            {data.dailyTip}
          </p>

          <div className="pt-1 flex items-center justify-between text-[11px]">
            <Link href="/learn/scripts" className="font-semibold text-brand hover:underline flex items-center gap-1">
              কথোপকথন স্ক্রিপ্ট লাইব্রেরি
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scope Guard Risk Warning Banner */}
      {data.scopeAlert.active && (
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border border-rose-300/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-rose-600 uppercase tracking-wide">
                  স্কোপ গার্ড অ্যালার্ট
                </span>
                <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-[13.5px] font-bold text-ink mt-0.5">
                {data.scopeAlert.riskMessage}
              </p>
            </div>
          </div>
          <Link
            href={data.scopeAlert.href}
            className="text-[13px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all shrink-0 active:scale-95 shadow-md shadow-rose-600/20 flex items-center gap-1"
          >
            স্কোপ চেক করুন
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Section 1: 4 Key Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Active Jobs */}
        <Link
          href="/work"
          className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[125px] hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-muted">চলতি কাজ</h3>
            <Briefcase className="size-4 text-brand group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-1">
            <span className="text-[32px] font-black text-ink leading-none">
              {toBnDigits(data.activeJobsCount)}
            </span>
          </div>
          <p className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200/60">
            ৳ {data.agreedAmount} সম্মত
          </p>
        </Link>

        {/* Tile 2: Overdue / Pending Money */}
        <Link
          href="/money/ledger"
          className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[125px] hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-muted">বকেয়া টাকা</h3>
            <Wallet className="size-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-1">
            <span className="text-[26px] font-black text-amber-600 leading-none">
              ৳ {data.overdueAmount}
            </span>
          </div>
          <p className="text-[11.5px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-200/60 font-medium">
            {toBnDigits(data.overdueJobsCount)}টি কাজ, {toBnDigits(data.maxLateDays)} দিন দেরি
          </p>
        </Link>

        {/* Tile 3: True Hourly Rate */}
        <Link
          href="/money/true-hourly"
          className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[125px] hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-muted">প্রকৃত ঘণ্টা-আয়</h3>
            <Gauge className="size-4 text-brand group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-1">
            <span className="text-[24px] font-black text-ink leading-none">
              ৳ {toBnDigits(data.trueHourlyCurrent)}
              <span className="text-[12px] font-semibold text-slate-400">/ঘণ্টা</span>
            </span>
          </div>
          <p className="text-[11.5px] text-brand bg-brand/10 px-2.5 py-1 rounded-lg w-fit border border-brand/20 font-semibold">
            টার্গেট: ৳ {toBnDigits(data.trueHourlyTarget)}
          </p>
        </Link>

        {/* Tile 4: Financial Runway */}
        <Link
          href="/money/runway"
          className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[125px] hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-muted">রানওয়ে নিরাপত্তা</h3>
            <TrendingUp className="size-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-1">
            <span className="text-[26px] font-black text-indigo-600 leading-none">
              {toBnDigits(data.runwayMonths)} মাস
            </span>
          </div>
          <p className="text-[11.5px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-200/60 font-medium">
            জরুরি তহবিল প্রস্তুত
          </p>
        </Link>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Main Column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">

          {/* Section: Active Live Project Hours & Pace Tracker Card */}
          <div className="p-5 rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/10 via-blue-50/60 to-indigo-50/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-[14px] font-bold text-ink tracking-wide">
                  লাইভ প্রজেক্ট পেস মনিটর
                </h3>
              </div>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                এক্টিভ টাইমার
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="space-y-0.5">
                <p className="text-[15px] font-black text-ink">
                  {data.activeTimerJob}
                </p>
                <p className="text-[12.5px] text-muted font-medium">
                  আজকের ব্যয়িত সময়: <span className="font-bold text-emerald-600">{data.activeTimerTime}</span> | নিট রেট: <span className="font-bold text-brand">৳ {toBnDigits(data.activeTimerRate)}/ঘণ্টা</span>
                </p>
              </div>

              <Link
                href="/work/jobs/1"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-[13px] font-bold hover:bg-brand-dark transition-all active:scale-95 shrink-0 shadow-md shadow-brand/20"
              >
                <Play className="size-3.5 fill-current" />
                কাজে ফিরুন
              </Link>
            </div>
          </div>

          {/* Section: Today's Tasks Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ink flex items-center gap-2">
                <Clock className="size-4 text-brand" />
                আজকের কাজ ও অগ্রাধিকার
              </h2>
              <Link
                href="/work"
                className="text-[13px] font-bold text-brand hover:underline flex items-center gap-0.5"
              >
                সব কাজ দেখুন
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {data.todayJobs.map((job, idx) => (
                <React.Fragment key={job.id}>
                  <Link
                    href={job.href}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-3 rounded-full shrink-0 ${
                          job.isUrgent ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span className="text-[14px] font-semibold text-ink truncate">
                        {job.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${
                          job.isUrgent
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.dueText}
                      </span>
                      <ChevronRight className="size-4 text-slate-400 group-hover:text-brand transition-colors" />
                    </div>
                  </Link>
                  {idx < data.todayJobs.length - 1 && (
                    <div className="h-px bg-slate-100" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Section: AI Assistant Quick Launch Tools */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 bg-gradient-to-br from-violet-50/40 via-white to-purple-50/30">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ink flex items-center gap-2">
                <Bot className="size-5 text-violet-600" />
                সহায়ক AI টুলস
              </h2>
              <Link
                href="/assistant"
                className="text-[13px] font-bold text-violet-600 hover:underline flex items-center gap-0.5"
              >
                AI সহায়ক খুলুন
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/assistant"
                className="p-3.5 rounded-xl bg-white border border-violet-100 shadow-sm hover:border-violet-300 hover:shadow-md transition-all space-y-1 block group"
              >
                <div className="flex items-center justify-between text-violet-600">
                  <span className="text-[13px] font-bold flex items-center gap-1.5">
                    <Zap className="size-4" /> কভার লেটার ড্রাফট
                  </span>
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  জব ডেসক্রিপশন দিয়ে প্রফেশনাল কভার লেটার ড্রাফট করুন
                </p>
              </Link>

              <Link
                href="/assistant"
                className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all space-y-1 block group"
              >
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-[13px] font-bold flex items-center gap-1.5">
                    <FileText className="size-4" /> ক্লায়েন্ট মেসেজিং
                  </span>
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[12px] text-muted leading-relaxed">
                  পেমেন্ট তাগাদা বা রিভিশন মেসেজ তৈরি করুন
                </p>
              </Link>
            </div>
          </div>

          {/* Section: Weekly Goals Checklist */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h2 className="text-[17px] font-bold text-ink flex items-center gap-2">
              <FileCheck className="size-4 text-emerald-600" />
              এই সপ্তাহের ৩টি প্রধান লক্ষ্য
            </h2>

            <div className="space-y-2 pt-1">
              {/* Goal 1 */}
              <label className="flex items-start gap-3.5 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={goals.proposals}
                    onChange={() => toggleGoal('proposals')}
                    className="sr-only peer"
                  />
                  <div className="size-5 border-2 border-slate-300 rounded peer-checked:bg-brand peer-checked:border-brand transition-colors flex items-center justify-center">
                    {goals.proposals && <Check className="size-3.5 text-white stroke-[3]" />}
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[14px] font-semibold text-ink leading-tight">
                    ৫টি প্রপোজাল পাঠান — ৩/৫ সম্পন্ন হয়েছে
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand h-full rounded-full transition-all duration-300"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </label>

              {/* Goal 2 */}
              <label className="flex items-center gap-3.5 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={goals.followup}
                    onChange={() => toggleGoal('followup')}
                    className="sr-only peer"
                  />
                  <div className="size-5 border-2 border-slate-300 rounded peer-checked:bg-brand peer-checked:border-brand transition-colors flex items-center justify-center">
                    {goals.followup && <Check className="size-3.5 text-white stroke-[3]" />}
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-ink">
                  ২ জন পুরানো ক্লায়েন্টকে কাজের প্রস্তাব পাঠিয়ে ফলো-আপ দিন
                </span>
              </label>

              {/* Goal 3 */}
              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={goals.proof}
                    onChange={() => toggleGoal('proof')}
                    className="sr-only peer"
                  />
                  <div className="size-5 border-2 border-slate-300 rounded peer-checked:bg-brand peer-checked:border-brand transition-colors flex items-center justify-center">
                    {goals.proof && <Check className="size-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[14px] font-semibold text-ink">
                    A4 ব্যাংক-রেডি ইনকাম প্রুফ ডাউনলোড করুন
                  </span>
                </div>
                <Link
                  href="/money/income-proof"
                  className="text-[12px] font-bold text-brand hover:underline"
                >
                  ডাউনলোড
                </Link>
              </label>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">

          {/* Section: Weekly Capacity Pressure */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink">
                এই সপ্তাহের চাপ
              </h2>
              <span className="text-[13px] font-extrabold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                {toBnDigits(data.weeklyHoursUsed)} / {toBnDigits(data.weeklyHoursMax)} ঘণ্টা
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
              <div
                className="bg-brand h-full rounded-full transition-all duration-500"
                style={{ width: `${capacityPct}%` }}
              />
            </div>

            <p className="text-[12px] text-right font-medium text-slate-500">
              আর <span className="font-bold text-brand">{toBnDigits(remainingHours)} ঘণ্টা</span> নেওয়া যাবে
            </p>
          </div>

          {/* Section: Rise Ladder Career Strip */}
          <Link
            href="/home/ladder"
            className="glass p-5 rounded-2xl border border-slate-100 shadow-sm block space-y-3 hover:bg-slate-50/80 transition-all group"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <Layers className="size-4 text-brand" />
                রাইজ ল্যাডার অগ্রগতি
              </h2>
              <ChevronRight className="size-5 text-slate-400 group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* 4 Stage Segment Bar */}
            <div className="flex h-3 gap-1.5 w-full pt-1">
              <div className="flex-1 bg-brand rounded-l-full opacity-60" />
              <div className="flex-1 bg-brand rounded-sm shadow-sm" />
              <div className="flex-1 bg-slate-200 rounded-sm" />
              <div className="flex-1 bg-slate-200 rounded-r-full" />
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-extrabold text-brand">
                  ধাপ ২: {data.ladderStageTitle}
                </h3>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  ১/৩ সম্পন্ন
                </span>
              </div>
              <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                {data.ladderNextRequirement}
              </p>
            </div>
          </Link>

          {/* Section: Income Proof & Bank Readiness Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <Building2 className="size-4.5 text-emerald-600" />
                ব্যাংক-রেডি ইনকাম প্রুফ
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ৮৫% প্রস্তুত
              </span>
            </div>
            <p className="text-[12.5px] text-muted leading-relaxed">
              অফিসিয়াল A4 ফরম্যাটে ভেরিফাইড ব্যাংক ইনকাম স্টেটমেন্ট ও ইনভয়েস রেডি রয়েছে।
            </p>
            <div className="pt-1 flex items-center justify-between">
              <Link
                href="/money/proof"
                className="text-[12.5px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                প্রুফ স্টেটমেন্ট দেখুন
                <ArrowUpRight className="size-3.5" />
              </Link>
              <Link
                href="/money/documents"
                className="text-[11.5px] font-semibold text-slate-500 hover:text-brand"
              >
                ডকুমেন্ট তালিকা →
              </Link>
            </div>
          </div>

          {/* Section: High-Yield Niche & Market Insights Widget */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <Target className="size-4.5 text-brand" />
                টপ নিচ ও মার্কেটপ্লেস টিপস
              </h2>
              <Link href="/learn/niche" className="text-[12px] font-bold text-brand hover:underline">
                স্কোরিং
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">Figma SaaS UI/UX প্রোটোটাইপিং</span>
                <span className="text-[11px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded">
                  স্কোর: ৮৮/১০০
                </span>
              </div>
              <p className="text-[12px] text-muted">
                সরাসরি ক্লায়েন্টদের বাজেট গড়ে $৪০০ - $১২০০। এই সপ্তাহে ডিমান্ড ১৮% বৃদ্ধি পেয়েছে।
              </p>
            </div>

            <div className="flex items-center justify-between text-[12px] pt-1">
              <Link href="/learn/marketplace" className="font-semibold text-muted hover:text-brand flex items-center gap-1">
                মার্কেটপ্লেস তুলনা দেখুন
                <ChevronRight className="size-3.5" />
              </Link>
              <Link href="/learn/scripts" className="font-semibold text-violet-600 hover:underline">
                ক্লায়েন্ট স্ক্রিপ্ট →
              </Link>
            </div>
          </div>

          {/* Section: Client Follow-up & Reminders Quick Box */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <Bell className="size-4.5 text-amber-600" />
                ক্লায়েন্ট ফলো-আপ রিমাইন্ডার
              </h2>
              <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/70 text-[12.5px]">
                <div className="flex items-center gap-2 font-medium text-ink truncate">
                  <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="truncate">আহমেদ ট্রেডার্স — প্রপোজাল ফলো-আপ</span>
                </div>
                <Link href="/work/proposals" className="text-[11.5px] font-bold text-amber-700 hover:underline shrink-0 ml-2">
                  মেসেজ পাঠান
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/60 text-[12.5px]">
                <div className="flex items-center gap-2 font-medium text-ink truncate">
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">নাবিলা স্টোর — মাইলস্টোন রিভিশন</span>
                </div>
                <Link href="/work/payments" className="text-[11.5px] font-bold text-brand hover:underline shrink-0 ml-2">
                  পেমেন্ট দেখুন
                </Link>
              </div>
            </div>
          </div>

          {/* Section: Government 4% Remittance Incentive Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <Gift className="size-4.5 text-indigo-600" />
                সরকারি ৪% ইনসেন্টিভ
              </h2>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                ক্যাশব্যাক
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-100 shadow-xs">
              <div>
                <p className="text-[11px] text-muted">চলতি মাসে অর্জিত প্রণোদনা</p>
                <p className="text-[20px] font-black text-indigo-600 leading-tight">
                  ৳ {data.incentiveEarned}
                </p>
              </div>
              <Link
                href="/money/incentive"
                className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
              >
                ক্যালকুলেটর
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Section: Client Trust & Health Score Widget */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
                <UserCheck className="size-4.5 text-emerald-600" />
                ক্লায়েন্ট হেলথ & ট্রাস্ট স্কোর
              </h2>
              <Link href="/work/screener" className="text-[12px] font-bold text-brand hover:underline">
                স্ক্রিনার
              </Link>
            </div>

            <div className="space-y-2">
              {data.clientTrustScores.map((client, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[12.5px]"
                >
                  <div>
                    <p className="font-bold text-ink">{client.name}</p>
                    <p className="text-[11px] text-muted">{client.status}</p>
                  </div>
                  <span
                    className={`text-[12px] font-black px-2.5 py-1 rounded-lg ${
                      client.isGood
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    স্কোর: {toBnDigits(client.score)}/১০০
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
