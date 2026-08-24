import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, ChevronRight, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

/**
 * Screen 05 — Rise Ladder · রাইজ ল্যাডার
 * Shows current stage, criteria for each stage, and actionable next steps.
 * Responsive 2-column layout on desktop, stacked on mobile.
 */
export default function RiseLadder() {
  const { t } = useI18n();
  const [showFutureStages, setShowFutureStages] = useState(false);

  // 4 Stages Definition
  const stages = [
    {
      id: 1,
      name: 'ছোট কাজের দরপত্র',
      status: 'completed',
      badge: 'প্রাথমিক ধাপ সম্পন্ন',
    },
    {
      id: 2,
      name: 'নিয়মিত সরাসরি ক্লায়েন্ট',
      status: 'current',
      badge: 'বর্তমান লক্ষ্য',
    },
    {
      id: 3,
      name: 'বিশেষায়িত বেশি দামের কাজ',
      status: 'future',
      badge: 'পরবর্তী ধাপ',
    },
    {
      id: 4,
      name: 'নিজের ছোট দল',
      status: 'future',
      badge: 'চূড়ান্ত লক্ষ্য',
    },
  ];

  // Current stage (Stage 2) conditions/criteria
  const currentCriteria = [
    {
      title: '১০টি কাজ শেষ',
      progress: '১২ / ১০',
      status: 'completed',
    },
    {
      title: 'প্রকৃত ঘণ্টা-আয় ৳ ৮০০ ছাড়ানো',
      progress: '৳ ৭৪০ / ৳ ৮০০',
      status: 'in_progress',
    },
    {
      title: '৩ জন পুনরায় আসা ক্লায়েন্ট',
      progress: '১ / ৩',
      status: 'pending',
    },
  ];

  // Actionable next tasks for Stage 2
  const nextTasks = [
    {
      title: 'শেষ হওয়া ২ জন ক্লায়েন্টকে পরের কাজের প্রস্তাব দিন',
      href: '/work',
    },
    {
      title: 'প্রোফাইল পোর্টফোলিও আপডেট করুন',
      href: '/learn',
    },
    {
      title: 'নতুন প্রপোজাল টেমপ্লেট তৈরি করুন',
      href: '/learn',
    },
  ];

  // Future stage details for accordion
  const futureStagesData = [
    {
      id: 3,
      name: 'বিশেষায়িত বেশি দামের কাজ',
      criteria: [
        'মাসিক মোট আয় ৳ ৫০,০০০+ অর্জন',
        '৫টি ডিরেক্ট লং-টার্ম চুক্তি',
        'গড় রিভিউ রেটিং ৪.৮+',
      ],
    },
    {
      id: 4,
      name: 'নিজের ছোট দল (Agency / Team)',
      criteria: [
        '২-৩ জন জুনিয়ার ফ্রিল্যান্সার টিম পরিচালনা',
        'প্রতি মাসে ৳ ১,০০,০০০+ টিম রিভিনিউ',
        'স্বয়ংক্রিয় ক্লায়েন্ট অনবোর্ডিং ব্যবস্থা',
      ],
    },
  ];

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto">
      <Head title="রাইজ ল্যাডার — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            {t('রাইজ ল্যাডার')}
          </h1>
          <p className="text-[14px] text-muted font-medium">
            আপনার ক্যারিয়ার বৃদ্ধির ৪-ধাপের গাইডলাইন
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-brand/10 text-brand px-3.5 py-1.5 rounded-full text-[13px] font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </span>
          ধাপ ২: প্রস্তুত অবস্থা
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Ladder Track & Accordion (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: ল্যাডার একনজরে */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-[17px] font-bold text-ink mb-5 flex items-center justify-between">
              <span>ল্যাডার একনজরে</span>
              <span className="text-[12px] font-semibold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                ৪ ধাপ
              </span>
            </h2>

            <div className="relative pl-2">
              {/* Vertical Connector Line */}
              <div className="absolute left-[23px] top-[18px] bottom-[32px] w-[2px] bg-slate-200" />

              <div className="space-y-6 relative">
                {stages.map((stage) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.id} className="flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`relative z-10 size-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-white text-white shadow-sm'
                            : isCurrent
                            ? 'bg-brand border-white text-white ring-4 ring-brand/20 shadow-md scale-105'
                            : 'bg-slate-50 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="size-4 stroke-[3]" />
                        ) : isCurrent ? (
                          <div className="size-2 bg-white rounded-full" />
                        ) : (
                          <span className="text-[12px] font-bold">{stage.id}</span>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="pt-0.5">
                        <h3
                          className={`text-[15px] font-bold leading-tight ${
                            isCurrent ? 'text-brand font-extrabold' : 'text-ink'
                          }`}
                        >
                          {stage.name}
                        </h3>
                        <p
                          className={`text-[12px] mt-0.5 ${
                            isCurrent
                              ? 'text-brand font-semibold'
                              : isCompleted
                              ? 'text-emerald-600 font-medium'
                              : 'text-muted'
                          }`}
                        >
                          {stage.badge}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 4: Collapsed Accordion */}
          <div className="glass p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50/80">
            <button
              type="button"
              onClick={() => setShowFutureStages(!showFutureStages)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-[14px] font-bold text-ink flex items-center gap-2">
                <Eye className="size-4 text-brand" />
                পরের ধাপগুলো বিস্তারিত দেখুন
              </h2>
              {showFutureStages ? (
                <ChevronUp className="size-5 text-muted" />
              ) : (
                <ChevronDown className="size-5 text-muted" />
              )}
            </button>

            {showFutureStages && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in-0 duration-200">
                {futureStagesData.map((fStage) => (
                  <div key={fStage.id} className="bg-slate-50/80 p-3.5 rounded-xl space-y-2 border border-slate-200/60">
                    <h4 className="text-[13px] font-bold text-ink flex items-center gap-2">
                      <span className="size-5 rounded-full bg-brand/10 text-brand text-[11px] flex items-center justify-center font-bold">
                        {fStage.id}
                      </span>
                      {fStage.name}
                    </h4>
                    <ul className="space-y-1 pl-7 text-[12px] text-slate-600 list-disc">
                      {fStage.criteria.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Conditions & Next Tasks (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 2: এই ধাপ পার হওয়ার শর্ত */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ink">
                এই ধাপ পার হওয়ার শর্ত (ধাপ ২)
              </h2>
              <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                ১/৩ সম্পন্ন
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {currentCriteria.map((item, idx) => {
                const isMet = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <React.Fragment key={idx}>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        {/* Icon Indicator */}
                        {isMet ? (
                          <div className="size-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        ) : isInProgress ? (
                          <div className="size-6 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center shrink-0">
                            <div className="size-2 bg-amber-500 rounded-full" />
                          </div>
                        ) : (
                          <div className="size-6 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                        <span className="text-[14px] font-semibold text-ink">
                          {item.title}
                        </span>
                      </div>

                      <span
                        className={`text-[13px] font-bold ${
                          isMet
                            ? 'text-emerald-600'
                            : isInProgress
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.progress}
                      </span>
                    </div>
                    {idx < currentCriteria.length - 1 && (
                      <div className="h-px bg-slate-100" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <p className="text-[12px] text-muted text-center pt-2 italic">
              * সংখ্যাগুলো আপনার নিজের রেকর্ড থেকে হিসাব হয়েছে
            </p>
          </div>

          {/* Card 3: পরের ধাপের জন্য করণীয় */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-[17px] font-bold text-ink">
              পরের ধাপের জন্য করণীয়
            </h2>

            <div className="space-y-2.5">
              {nextTasks.map((task, idx) => (
                <Link
                  key={idx}
                  href={task.href}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded border border-slate-300 group-hover:border-brand transition-colors shrink-0 flex items-center justify-center text-brand font-bold text-[11px]">
                      {idx + 1}
                    </div>
                    <span className="text-[14px] font-semibold text-ink leading-tight">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-brand flex items-center gap-0.5 shrink-0 pl-2">
                    দেখুন
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
