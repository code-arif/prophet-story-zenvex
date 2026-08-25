import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  User,
  ChevronRight,
  Plus,
  RefreshCw,
  AlertTriangle,
  FileText,
  ArrowRight,
  MessageSquare,
  Edit3,
  ShieldCheck,
  Sparkles,
  MoreVertical,
  Settings,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 16 — Job Details · কাজের বিস্তারিত
 * Clean, structured 2-column layout (max-w-5xl).
 * 5-Step timeline track + 3 Segment Tabs (বিবরণ, স্কোপ, টাকা) + Status actions.
 */
export default function JobDetail({ job = null, scopeItems = [], payments = [] }) {
  const { t } = useI18n();

  // Fallback demo job object if empty
  const defaultJob = {
    id: 1,
    title: 'লোগো ডিজাইন — ৩টি কনসেপ্ট',
    client_name: 'Ahmed Traders',
    client_source: 'সরাসরি ক্লায়েন্ট',
    amount: 12000,
    deadline_formatted: '২৮ জুন',
    status: 'active',
    concepts: 3,
    revisions: 2,
    revisions_used: 2,
    hours_estimated: 18,
    hours_remaining: 6,
    started_at: '১৪ জুন',
    invoice_date: '২০ জুন',
    notes: 'ক্লায়েন্ট আধুনিক মিনিমালিস্ট ফন্ট ও নীল-বেগুনী কালার প্যালেট পছন্দ করেন।',
  };

  const activeJob = job ? {
    id: job.id,
    title: job.title,
    client_name: job.client ? job.client.name : 'Ahmed Traders',
    client_source: job.client ? (job.client.marketplace || job.client.source || 'সরাসরি') : 'সরাসরি ক্লায়েন্ট',
    amount: job.agreed_paisa ? Math.round(job.agreed_paisa / 100) : 12000,
    deadline_formatted: job.deadline ? new Date(job.deadline).toLocaleDateString('bn-BD') : '২৮ জুন',
    status: job.status || 'active',
    concepts: job.concepts || 3,
    revisions: job.revisions || 2,
    revisions_used: 2,
    hours_estimated: 18,
    hours_remaining: 6,
    started_at: '১৪ জুন',
    invoice_date: '২০ জুন',
    notes: job.notes || 'ক্লায়েন্ট আধুনিক মিনিমালিস্ট ফন্ট ও নীল-বেগুনী কালার প্যালেট পছন্দ করেন।',
  } : defaultJob;

  // Active Segmented Tab (0: বিবরণ, 1: স্কোপ, 2: টাকা)
  const [activeTab, setActiveTab] = useState(0);

  // Status Switcher Modal / Dropdown state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [notesText, setNotesText] = useState(activeJob.notes);

  // Fallback Scope Items
  const scopeList = scopeItems && scopeItems.length > 0
    ? scopeItems
    : [
        { id: 1, description: 'প্রাথমিক ৩টি কনসেপ্ট স্কেচ তৈরি', is_extra: false, done: true },
        { id: 2, description: 'ভেক্টর ইলাস্ট্রেশন ও কালার ট্রায়াল', is_extra: false, done: true },
        { id: 3, description: 'ব্র্যান্ড গাইডলাইন ও সোর্স ফাইল প্রদান', is_extra: false, done: false },
        { id: 4, description: 'অতিরিক্ত ৩D মকআপ রিভিশন (বাড়তি অনুরোধ)', is_extra: true, done: false, hours: 4.5 },
      ];

  // 5 Steps State Timeline Data
  const stepsTimeline = [
    { key: 'prospect', label: 'প্রস্তাব', stepNum: 1 },
    { key: 'active', label: 'চলছে', stepNum: 2 },
    { key: 'delivered', label: 'জমা দেওয়া', stepNum: 3 },
    { key: 'awaiting_payment', label: 'বকেয়া', stepNum: 4 },
    { key: 'closed', label: 'শেষ', stepNum: 5 },
  ];

  // Map job status to active step index (0 to 4)
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'prospect':
      case 'applied':
      case 'proposal':
        return 0;
      case 'active':
        return 1;
      case 'delivered':
      case 'submitted':
        return 2;
      case 'awaiting_payment':
      case 'payment_due':
        return 3;
      case 'closed':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const currentStepIdx = getActiveStepIndex(activeJob.status);

  const handleUpdateStatus = (newStatusKey) => {
    setIsStatusModalOpen(false);
    // In real app, trigger router.post/patch
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title={`${activeJob.title} — কাজের বিস্তারিত`} />

      {/* Top Header App Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[20px] font-black text-ink tracking-tight leading-tight">
            কাজের বিস্তারিত
          </h1>
          <p className="text-[12.5px] text-muted font-medium">
            {activeJob.client_name} — {activeJob.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/work/jobs/${activeJob.id}/scope`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-[12.5px] font-bold border border-purple-200 hover:bg-purple-100 transition-all"
          >
            <ShieldCheck className="size-4" />
            স্কোপ ম্যানেজার
          </Link>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Main Column: Header Card, Segmented Tabs, Active Tab View (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Main Job Overview Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div>
              <h2 className="text-[20px] font-black text-ink">
                {activeJob.client_name}
              </h2>
              <p className="text-[15px] font-bold text-slate-700 mt-0.5">
                {activeJob.title}
              </p>
            </div>

            {/* 5-Step Timeline State Track */}
            <div className="py-2 relative">
              {/* Timeline Connecting Line */}
              <div className="absolute top-[15px] left-[8%] right-[8%] h-[3px] bg-slate-200 rounded-full z-0" />
              <div
                className="absolute top-[15px] left-[8%] h-[3px] bg-brand rounded-full z-0 transition-all duration-500"
                style={{ width: `${(currentStepIdx / 4) * 84}%` }}
              />

              <div className="flex justify-between relative z-10">
                {stepsTimeline.map((step, sIdx) => {
                  const isDone = sIdx < currentStepIdx;
                  const isCurrent = sIdx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 w-12 text-center">
                      <div
                        className={`size-7 rounded-full flex items-center justify-center font-bold text-[12px] transition-all shadow-xs ${
                          isDone
                            ? 'bg-brand text-white'
                            : isCurrent
                            ? 'bg-white border-2 border-brand text-brand ring-4 ring-brand/15'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <Check className="size-4 stroke-[3]" />
                        ) : (
                          toBnDigits(step.stepNum)
                        )}
                      </div>
                      <span
                        className={`text-[11.5px] font-bold leading-tight ${
                          isCurrent ? 'text-brand' : isDone ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Badges Row */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <CreditCard className="size-4 text-brand" />
                <span>৳ {toBnDigits(activeJob.amount)}</span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <Clock className="size-4 text-amber-600" />
                <span>সময়সীমা: {activeJob.deadline_formatted}</span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <User className="size-4 text-emerald-600" />
                <span>{activeJob.client_source}</span>
              </div>
            </div>
          </div>

          {/* Segmented Control Bar */}
          <div className="glass p-1 rounded-2xl border border-slate-100 shadow-xs flex gap-1">
            {['বিবরণ', 'স্কোপ', 'টাকা'].map((tabLabel, idx) => (
              <button
                key={tabLabel}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-[14px] transition-all active:scale-95 text-center ${
                  activeTab === idx
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 hover:text-ink hover:bg-slate-100/60'
                }`}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          {/* Tab 0: বিবরণ (Job Specification & Private Notes) */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-[15px] font-bold text-ink border-b border-slate-100 pb-2">
                  কাজের বিবরণ ও শর্তাবলী
                </h3>

                <div className="space-y-3 divide-y divide-slate-100">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[13.5px] text-slate-500 font-medium">সম্মত ডেলিভারি</span>
                    <span className="text-[14px] font-bold text-ink">
                      {toBnDigits(activeJob.concepts)}টি কনসেপ্ট, {toBnDigits(activeJob.revisions)}টি রিভিশন
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-[13.5px] text-slate-500 font-medium">কাজ শুরুর তারিখ</span>
                    <span className="text-[14px] font-bold text-ink">{activeJob.started_at}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-[13.5px] text-slate-500 font-medium">আনুমানিক মোট ঘণ্টা</span>
                    <span className="text-[14px] font-bold text-ink">{toBnDigits(activeJob.hours_estimated)} ঘণ্টা</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-[13.5px] text-slate-500 font-medium">বাকি সময় (ঘণ্টা)</span>
                    <span className="text-[14px] font-extrabold text-brand">{toBnDigits(activeJob.hours_remaining)} ঘণ্টা</span>
                  </div>
                </div>

                {/* Private Notes Box */}
                <div className="pt-2">
                  <label className="block text-[13px] font-bold text-slate-500 mb-1.5">
                    সংক্ষিপ্ত নোট ও নির্দেশিকা
                  </label>
                  <textarea
                    rows={3}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="সংক্ষিপ্ত নোট লিখুন..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-medium text-ink focus:outline-none focus:border-brand leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: স্কোপ (Scope & Revision List) */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-ink">
                      স্কোপ এবং রিভিশন
                    </h3>
                    <p className="text-[12.5px] text-muted mt-0.5">
                      চুক্তিবদ্ধ টাস্ক ও অনাকাঙ্ক্ষিত স্কোপক্রিপ রোধ
                    </p>
                  </div>
                  <Link
                    href={`/work/jobs/${activeJob.id}/scope`}
                    className="text-[12.5px] font-bold text-purple-600 hover:underline flex items-center gap-0.5"
                  >
                    ম্যানেজার <ChevronRight className="size-3.5" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[13px]">
                    <span className="font-bold text-amber-900">রিভিশন ব্যবহার</span>
                    <span className="font-black text-amber-900">
                      {toBnDigits(activeJob.revisions_used)} / {toBnDigits(activeJob.revisions)}
                    </span>
                  </div>

                  {scopeList.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        item.is_extra
                          ? 'bg-purple-50/60 border-purple-200/80'
                          : 'bg-slate-50 border-slate-200/70'
                      }`}
                    >
                      <div
                        className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-[12px] ${
                          item.done
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'border-2 border-slate-300 bg-white text-slate-400'
                        }`}
                      >
                        {item.done ? <Check className="size-3.5 stroke-[3]" /> : toBnDigits(idx + 1)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold leading-snug ${item.done ? 'line-through text-slate-400' : 'text-ink'}`}>
                          {item.description}
                        </p>
                        {item.is_extra && (
                          <span className="inline-block mt-1 text-[11px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                            বাড়তি অনুরোধ (+{toBnDigits(item.hours || 3)} ঘণ্টা)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: টাকা (Money & Invoicing Details) */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-ink">
                      টাকা ও চালান বিবরণী
                    </h3>
                    <p className="text-[12.5px] text-muted mt-0.5">
                      চালান পাঠানো হয়েছে {activeJob.invoice_date}
                    </p>
                  </div>
                  <span className="text-[12px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    ইনভয়েস রেডি
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[14px]">
                    <span className="text-slate-600 font-medium">চুক্তিবদ্ধ মোট বাজেট</span>
                    <span className="font-extrabold text-ink">৳ {toBnDigits(activeJob.amount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[14px]">
                    <span className="text-slate-600 font-medium">অগ্রিম প্রাপ্ত পেমেন্ট</span>
                    <span className="font-extrabold text-emerald-600">৳ {toBnDigits(Math.round(activeJob.amount * 0.5))}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[14px]">
                    <span className="text-amber-900 font-bold">অবশিষ্ট বকেয়া পাওনা</span>
                    <span className="font-black text-amber-900">৳ {toBnDigits(Math.round(activeJob.amount * 0.5))}</span>
                  </div>
                </div>

                <Link
                  href="/money/true-hourly"
                  className="w-full py-3 rounded-xl bg-brand/10 hover:bg-brand/20 text-brand font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all"
                >
                  প্রকৃত ঘণ্টা-আয় দেখুন
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Column: Sticky Actions & Client Info (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Main Action Buttons Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[14.5px] font-bold text-ink">
              কাজের অ্যাকশন
            </h3>

            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl border border-brand text-brand hover:bg-brand/5 font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            >
              <RefreshCw className="size-4" />
              অবস্থা বদলান
            </button>

            <Link
              href={`/work/jobs/${activeJob.id}/scope`}
              className="w-full py-3 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-brand/20 block text-center"
            >
              <Plus className="size-4" />
              বাড়তি অনুরোধ যোগ করুন
            </Link>
          </div>

          {/* Client Details Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <User className="size-4 text-purple-600" />
              ক্লায়েন্ট তথ্য
            </h3>
            
            <div className="space-y-2 text-[13px] text-slate-700 font-medium">
              <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                • নাম: <span className="font-bold text-ink">{activeJob.client_name}</span>
              </p>
              <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                • সোর্স: <span className="font-bold text-brand">{activeJob.client_source}</span>
              </p>
            </div>

            <Link
              href="/work/screener"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[12.5px] flex items-center justify-center gap-1 transition-all"
            >
              ক্লায়েন্ট ট্রাস্ট স্কোর যাচাই
              <ChevronRight className="size-4" />
            </Link>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Actions Bar for Mobile Screens */}
      <div className="fixed bottom-[80px] left-0 right-0 p-4 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 lg:hidden">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            type="button"
            onClick={() => setIsStatusModalOpen(true)}
            className="flex-1 py-3 rounded-xl border border-brand text-brand font-bold text-[13.5px] active:scale-95 transition-all text-center"
          >
            অবস্থা বদলান
          </button>
          <Link
            href={`/work/jobs/${activeJob.id}/scope`}
            className="flex-1 py-3 rounded-xl bg-brand text-white font-bold text-[13.5px] shadow-md shadow-brand/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="size-4" />
            বাড়তি অনুরোধ
          </Link>
        </div>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 font-bn">
            <h3 className="text-[17px] font-bold text-ink">
              কাজের নতুন অবস্থা নির্বাচন করুন
            </h3>

            <div className="space-y-2">
              {[
                { id: 'prospect', label: '১. প্রস্তাব পাঠানো' },
                { id: 'active', label: '২. কাজ চলছে (Active)' },
                { id: 'delivered', label: '৩. কাজ জমা দেওয়া (Delivered)' },
                { id: 'awaiting_payment', label: '৪. টাকা বকেয়া (Payment Due)' },
                { id: 'closed', label: '৫. সম্পূর্ণ শেষ (Closed)' },
              ].map((sOption) => (
                <button
                  key={sOption.id}
                  type="button"
                  onClick={() => handleUpdateStatus(sOption.id)}
                  className={`w-full p-3 rounded-xl font-bold text-[14px] text-left transition-all ${
                    activeJob.status === sOption.id
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {sOption.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-[13.5px] mt-2"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
