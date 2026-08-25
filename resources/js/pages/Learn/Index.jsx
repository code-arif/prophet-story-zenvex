import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Store,
  BarChart3,
  CheckSquare,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Bot,
  Award,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 06 — Learn Hub · শেখা
 * Freelancing OS 2.0 Foundation modules & AI tools.
 * Responsive 2-column grid layout on desktop, stacked on mobile.
 */
export default function LearnIndex({
  progressPct = 0,
  completedCount = 0,
  totalCount = 5,
  checklistDone = 0,
  checklistTotal = 12,
  marketplaceDone = false,
  nicheDone = false,
  nicheCount = 0,
  proposalsDone = false,
  scriptsDone = false,
  planCreated = false,
  planDate = null,
  reviewCreated = false,
  reviewDate = null,
}) {
  const { t } = useI18n();

  const overallPct = progressPct;
  const completedModules = completedCount;
  const totalModules = totalCount;

  // 5 Core Foundation Modules — Fully Dynamic Statuses
  const foundationModules = [
    {
      id: 'compare',
      title: 'মার্কেটপ্লেস তুলনা',
      subtitle: 'কোন প্ল্যাটফর্মে বিরোধ হলে কে সিদ্ধান্ত নেয় (Upwork vs Fiverr vs Direct)',
      icon: Store,
      badgeText: marketplaceDone ? 'শেষ' : 'শুরু করুন',
      badgeStyle: marketplaceDone
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-slate-100 text-slate-600',
      href: '/learn/marketplace',
    },
    {
      id: 'niche',
      title: 'নিশ ফিট স্কোরার',
      subtitle: nicheCount > 0 ? `${toBnDigits(nicheCount)}টি নিশ মূল্যায়ন করা হয়েছে` : 'নিজের গোনা সংখ্যা দিয়ে ক্লায়েন্ট মার্কেট চাহিদা যাচাই',
      icon: BarChart3,
      badgeText: nicheDone ? 'শেষ' : 'শুরু করুন',
      badgeStyle: nicheDone
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-slate-100 text-slate-600',
      href: '/learn/niche',
    },
    {
      id: 'checklist',
      title: 'প্রোফাইল ও পোর্টফোলিও চেকলিস্ট',
      subtitle: 'ক্লায়েন্ট আসলে যা দেখেন এবং বিচার করেন',
      icon: CheckSquare,
      badgeText: `${toBnDigits(checklistDone)}/${toBnDigits(checklistTotal)}`,
      badgeStyle: checklistDone === checklistTotal && checklistTotal > 0
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-brand/10 text-brand border border-brand/20',
      href: '/learn/checklist',
    },
    {
      id: 'proposals',
      title: 'প্রস্তাব কাঠামো লাইব্রেরি',
      subtitle: 'যে প্রস্তাব ক্লায়েন্ট গুরুত্ব সহকারে পড়ে তার গঠন',
      icon: BookOpen,
      badgeText: proposalsDone ? 'শেষ' : 'শুরু করুন',
      badgeStyle: proposalsDone
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-slate-100 text-slate-600',
      href: '/learn/proposals',
    },
    {
      id: 'scripts',
      title: 'ক্লায়েন্ট কথোপকথন স্ক্রিপ্ট',
      subtitle: 'কঠিন কথা ও বাজেট নেগোসিয়েশন কীভাবে লিখবেন',
      icon: MessageSquare,
      badgeText: scriptsDone ? 'শেষ' : 'শুরু করুন',
      badgeStyle: scriptsDone
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-slate-100 text-slate-600',
      href: '/learn/scripts',
    },
  ];

  // Personal AI Guides / Artifacts — Fully Dynamic
  const personalArtifacts = [
    {
      id: 'plan90',
      title: 'আমার ৯০ দিনের পরিকল্পনা',
      subtitle: planCreated ? (planDate ? `তৈরি হয়েছে ${planDate}` : 'পরিকল্পনা তৈরি আছে') : 'এখনো তৈরি হয়নি',
      buttonText: planCreated ? 'দেখুন' : 'তৈরি করুন',
      isCreated: planCreated,
      href: '/learn/plan-90',
    },
    {
      id: 'review',
      title: 'প্রোফাইল রিভিউ',
      subtitle: reviewCreated ? (reviewDate ? `রিভিউ সম্পূর্ণ (${reviewDate})` : 'রিভিউ সম্পূর্ণ') : 'এখনো তৈরি হয়নি',
      buttonText: reviewCreated ? 'দেখুন' : 'তৈরি করুন',
      isCreated: reviewCreated,
      href: '/learn/profile-review',
    },
  ];

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto">
      <Head title="শেখা — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            {t('শেখা')}
          </h1>
          <p className="text-[14px] text-muted font-medium">
            ফ্রিল্যান্সিং গাইডলাইন ও স্মার্ট লার্নিং হাব
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-brand/10 text-brand px-3.5 py-1.5 rounded-full text-[13px] font-bold">
          <Award className="size-4" />
          ভিত্তি মডিউল
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Progress Card & Personal AI Artifacts (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Top Progress Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            {/* Ring Gauge SVG */}
            <div className="relative size-16 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  className="fill-none stroke-slate-200 stroke-[6]"
                  cx="32"
                  cy="32"
                  r="28"
                />
                <circle
                  className="fill-none stroke-brand stroke-[6] stroke-linecap-round transition-all duration-1000"
                  cx="32"
                  cy="32"
                  r="28"
                  strokeDasharray="175.93"
                  strokeDashoffset={175.93 - (175.93 * (overallPct / 100))}
                />
              </svg>
              <span className="absolute text-[15px] font-black text-brand font-bn">
                {toBnDigits(overallPct)}%
              </span>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-ink leading-tight">
                শেখার অগ্রগতি
              </h2>
              <p className="text-[13px] text-muted mt-1 font-medium">
                {toBnDigits(totalModules)}টির মধ্যে {toBnDigits(completedModules)}টি শেষ
              </p>
            </div>
          </div>

          {/* Section: আপনার নিজের জন্য (Personal AI Artifacts) */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-muted uppercase tracking-wider px-1">
              আপনার নিজের জন্য
            </h3>

            <div className="space-y-3">
              {personalArtifacts.map((art) => (
                <div
                  key={art.id}
                  className="glass p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col gap-3 group hover:border-violet-200 transition-all"
                >
                  {/* Left Violet Accent Strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-violet-600" />

                  <div className="flex justify-between items-start pl-2">
                    <div className="flex items-center gap-1.5 text-violet-600">
                      <Bot className="size-4" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">
                        AI সহায়ক
                      </span>
                    </div>
                  </div>

                  <div className="pl-2 flex items-end justify-between gap-3">
                    <div>
                      <h4 className="text-[16px] font-bold text-ink leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-[12.5px] text-muted mt-0.5">
                        {art.subtitle}
                      </p>
                    </div>

                    <Link
                      href={art.href}
                      className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all active:scale-95 shrink-0 ${
                        art.isCreated
                          ? 'text-brand bg-brand/10 hover:bg-brand/20'
                          : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20'
                      }`}
                    >
                      {art.buttonText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: 5 Foundation Modules (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-[13px] font-bold text-muted uppercase tracking-wider px-1">
            ভিত্তি দক্ষতা
          </h3>

          <div className="space-y-3">
            {foundationModules.map((module) => {
              const IconComponent = module.icon;

              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 text-left group hover:bg-slate-50/80 transition-all active:scale-[0.99] block"
                >
                  <div className="size-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <IconComponent className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-ink truncate group-hover:text-brand transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-[12.5px] text-muted truncate mt-0.5">
                      {module.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`px-2.5 py-1 text-[12px] font-bold rounded-full ${module.badgeStyle}`}
                    >
                      {module.badgeText}
                    </span>
                    <ChevronRight className="size-5 text-slate-400 group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
