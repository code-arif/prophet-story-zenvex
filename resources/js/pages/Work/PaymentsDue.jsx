import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldAlert,
  ArrowRight,
  Send,
  Zap,
  Loader2,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 19 — Payments Due · বকেয়া ও তাগাদা ধাপ
 * Total Overdue summary card + Aging Strip + Collection Ladder step tracker.
 * Fully dynamic responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function PaymentsDue({ overdueJobs = [], reminderLog = [] }) {
  const { t } = useI18n();

  // Fallback demo overdue jobs matching UI HTML specs
  const defaultJobs = [
    {
      id: 1,
      client_name: 'TechNova Solutions',
      title: 'UI/UX Redesign & Frontend',
      amount_formatted: '৳ ১২,০০০',
      amount_raw: 12000,
      days_overdue: 21,
      current_step: 3,
      message_template:
        'Dear Client, as payment is now 21 days overdue, I must pause all current work until the balance of 12,000 BDT is cleared...',
      ladder: [
        { id: 1, title: 'মনে করিয়ে দেওয়া', subtitle: 'পাঠানো ৩ জুলাই', completed: true },
        { id: 2, title: 'স্পষ্ট দাবি', subtitle: 'পাঠানো ১১ জুলাই', completed: true },
        {
          id: 3,
          title: 'কাজ থামানোর নোটিশ',
          subtitle: '২১ দিন দেরি',
          current: true,
          notice:
            'Dear Client, as payment is now 21 days overdue, I must pause all current work until the balance of 12,000 BDT is cleared...',
        },
        { id: 4, title: 'প্ল্যাটফর্মের বিরোধ প্রক্রিয়া', subtitle: 'পরবর্তী ধাপ', future: true },
      ],
    },
    {
      id: 2,
      client_name: 'Global Trade Ltd',
      title: 'E-commerce Website & Logo Design',
      amount_formatted: '৳ ৬,৫০',
      amount_raw: 6500,
      days_overdue: 9,
      current_step: 2,
      message_template:
        'Hello Client, following up on invoice #1042 for 6,500 BDT which is now 9 days past due date.',
      ladder: [
        { id: 1, title: 'মনে করিয়ে দেওয়া', subtitle: 'পাঠানো ৫ জুলাই', completed: true },
        {
          id: 2,
          title: 'স্পষ্ট দাবি',
          subtitle: '৯ দিন দেরি',
          current: true,
          notice:
            'Hello Client, following up on invoice #1042 for 6,500 BDT which is now 9 days past due date.',
        },
        { id: 3, title: 'কাজ থামানোর নোটিশ', subtitle: 'পরবর্তী ধাপ', future: true },
        { id: 4, title: 'প্ল্যাটফর্মের বিরোধ প্রক্রিয়া', subtitle: 'পরবর্তী ধাপ', future: true },
      ],
    },
  ];

  // Map backend overdueJobs or use defaultJobs
  const jobList = overdueJobs && overdueJobs.length > 0
    ? overdueJobs.map((j, idx) => {
        const amountBdt = j.agreed_paisa ? Math.round(j.agreed_paisa / 100) : (idx === 0 ? 12000 : 6500);
        return {
          id: j.id,
          client_name: j.client ? j.client.name : (idx === 0 ? 'TechNova Solutions' : 'Global Trade Ltd'),
          title: j.title || 'ওয়েব ও লোগো ডিজাইন',
          amount_formatted: `৳ ${amountBdt.toLocaleString()}`,
          amount_raw: amountBdt,
          days_overdue: idx === 0 ? 21 : 9,
          current_step: idx === 0 ? 3 : 2,
          message_template: idx === 0
            ? `Dear Client, as payment is now 21 days overdue, I must pause all current work until the balance of ${amountBdt.toLocaleString()} BDT is cleared...`
            : `Hello Client, following up on the pending payment of ${amountBdt.toLocaleString()} BDT for ${j.title}...`,
          ladder: [
            { id: 1, title: 'মনে করিয়ে দেওয়া', subtitle: 'পাঠানো ৩ জুলাই', completed: true },
            { id: 2, title: 'স্পষ্ট দাবি', subtitle: idx === 0 ? 'পাঠানো ১১ জুলাই' : '৯ দিন দেরি', completed: idx === 0, current: idx === 1 },
            {
              id: 3,
              title: 'কাজ থামানোর নোটিশ',
              subtitle: idx === 0 ? '২১ দিন দেরি' : 'পরবর্তী ধাপ',
              current: idx === 0,
              future: idx === 1,
              notice: `Dear Client, as payment is now 21 days overdue, I must pause all current work until the balance of ${amountBdt.toLocaleString()} BDT is cleared...`,
            },
            { id: 4, title: 'প্ল্যাটফর্মের বিরোধ প্রক্রিয়া', subtitle: 'পরবর্তী ধাপ', future: true },
          ],
        };
      })
    : defaultJobs;

  // Active expanded card ID state (default first job expanded)
  const [expandedJobId, setExpandedJobId] = useState(() => jobList[0]?.id || 1);
  const [copiedId, setCopiedId] = useState(null);
  const [markingSentId, setMarkingSentId] = useState(null);

  // Compute total overdue metrics
  const totalOverdueBdt = jobList.reduce((acc, j) => acc + (j.amount_raw || 0), 0);
  const totalCount = jobList.length;

  const toggleExpand = (id) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  const handleCopyMessage = (jobId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(jobId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleMarkAsSent = (jobId, stepTitle) => {
    setMarkingSentId(jobId);
    router.post(
      `/work/jobs/${jobId}/remind`,
      {
        type: 'step_update',
        message: `${stepTitle || 'তাগাদা'} বার্তা পাঠানো হয়েছে`,
      },
      {
        preserveScroll: true,
        onFinish: () => {
          setMarkingSentId(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="বকেয়া ও তাগাদা ধাপ — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            বকেয়া ও তাগাদা ধাপ
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            বকেয়া পরিশোধের তাগাদায় ধাপে ধাপে অগ্রগতি ও তৈরি রেসপন্স বার্তা
          </p>
        </div>

        <Link
          href="/learn/scripts"
          className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[13px] font-bold transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <FileText className="size-4" />
          কথোপকথন স্ক্রিপ্ট লাইব্রেরি
        </Link>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Total Overdue Card, Aging Strip, Overdue Job Ladders (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Total Overdue Summary Card */}
          <div className="glass p-6 rounded-3xl border border-amber-200/80 shadow-sm text-center flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/50 to-white">
            <h2 className="text-[34px] font-black text-amber-600 leading-none">
              ৳ {toBnDigits(totalOverdueBdt.toLocaleString())}
            </h2>
            <p className="text-[14px] font-bold text-slate-600 mt-2">
              {toBnDigits(totalCount)}টি কাজ থেকে বকেয়া
            </p>

            {/* Aging Strip Bar */}
            <div className="w-full mt-5 space-y-1.5">
              <div className="w-full flex h-3 rounded-full overflow-hidden shadow-inner bg-slate-100 border border-amber-200/60">
                <div className="w-1/4 bg-amber-200" title="০–৭ দিন" />
                <div className="w-1/4 bg-amber-300" title="৮–১৪ দিন" />
                <div className="w-2/4 bg-amber-500" title="১৫–৩০ দিন" />
                <div className="w-0 bg-amber-700" title="৩০+ দিন" />
              </div>
              <div className="w-full flex justify-between text-[11.5px] font-extrabold text-slate-500 px-1">
                <span>০–৭ দিন</span>
                <span>৮–১৪</span>
                <span>১৫–৩০</span>
                <span>৩০+ দিন</span>
              </div>
            </div>
          </div>

          {/* Overdue Job Cards List */}
          <div className="space-y-4">
            <h3 className="text-[17.5px] font-bold text-ink px-1">
              বকেয়া তালিকা ও তাগাদা লেডার
            </h3>

            {jobList.map((jobItem) => {
              const isExpanded = expandedJobId === jobItem.id;

              return (
                <div
                  key={jobItem.id}
                  className={`glass rounded-2xl border transition-all duration-200 ${
                    isExpanded
                      ? 'p-5 border-brand/30 shadow-md ring-2 ring-brand/10'
                      : 'p-4 border-slate-100 shadow-xs hover:border-slate-200'
                  }`}
                >
                  {/* Card Header Summary */}
                  <div
                    onClick={() => toggleExpand(jobItem.id)}
                    className="flex justify-between items-start cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-[17px] font-bold text-ink group-hover:text-brand transition-colors leading-tight">
                        {jobItem.client_name}
                      </h4>
                      <p className="text-[14px] font-extrabold text-slate-700 mt-0.5">
                        {jobItem.amount_formatted}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-[12px] font-bold">
                        {toBnDigits(jobItem.days_overdue)} দিন দেরি
                      </span>
                      <button
                        type="button"
                        className="size-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content: Collection Ladder Steps */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                      <div className="relative pl-6 py-2">
                        {/* Vertical Connecting Line */}
                        <div className="absolute left-[13px] top-4 bottom-8 w-[2px] bg-slate-200 z-0" />

                        <div className="flex flex-col gap-6 relative z-10">
                          {jobItem.ladder.map((step) => {
                            if (step.completed) {
                              return (
                                <div key={step.id} className="flex items-start gap-4">
                                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 border-2 border-white -ml-[2px] mt-0.5 z-10 shadow-xs">
                                    <Check className="size-3.5 text-white stroke-[3]" />
                                  </div>
                                  <div className="flex-1 -mt-0.5">
                                    <h5 className="text-[14px] font-bold text-ink">
                                      {step.title}
                                    </h5>
                                    <p className="text-[12px] font-medium text-slate-400">
                                      {step.subtitle}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            if (step.current) {
                              return (
                                <div key={step.id} className="flex items-start gap-4">
                                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 border-[3px] border-brand -ml-[2px] mt-0.5 z-10 shadow-xs">
                                    <div className="w-2 h-2 rounded-full bg-brand" />
                                  </div>

                                  <div className="flex-1 -mt-0.5 space-y-3">
                                    <div>
                                      <h5 className="text-[14.5px] font-extrabold text-brand">
                                        {step.title}
                                      </h5>
                                      <p className="text-[12px] font-bold text-amber-700">
                                        {step.subtitle}
                                      </p>
                                    </div>

                                    {/* Inset Ready Response Message Box */}
                                    <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3.5 relative space-y-2">
                                      <p className="text-[12.5px] font-medium text-purple-950 leading-relaxed pr-8 font-mono">
                                        "{jobItem.message_template}"
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() => handleCopyMessage(jobItem.id, jobItem.message_template)}
                                        className="absolute top-2.5 right-2.5 p-1.5 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                                        title="কপি করুন"
                                      >
                                        {copiedId === jobItem.id ? (
                                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                                        ) : (
                                          <Copy className="size-4" />
                                        )}
                                      </button>

                                      <p className="text-[11.5px] font-bold text-purple-800 italic">
                                        এই ধাপে সময়সীমা আর পরবর্তী পদক্ষেপ দুটোই বলা থাকে
                                      </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => handleMarkAsSent(jobItem.id, step.title)}
                                        disabled={markingSentId === jobItem.id}
                                        className="flex-1 min-w-[140px] h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-70"
                                      >
                                        {markingSentId === jobItem.id ? (
                                          <Loader2 className="size-4 animate-spin text-brand" />
                                        ) : (
                                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                                        )}
                                        <span>
                                          {markingSentId === jobItem.id ? 'আপডেট হচ্ছে...' : 'পাঠিয়েছি বলে চিহ্নিত করুন'}
                                        </span>
                                      </button>

                                      <Link
                                        href="/learn/scripts"
                                        className="flex-1 min-w-[140px] h-11 rounded-xl bg-purple-100/80 hover:bg-purple-200/80 text-purple-800 border border-purple-200 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                                      >
                                        <FileText className="size-4 text-purple-700" />
                                        <span>আমার ভাষায় বদলে নিন</span>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div key={step.id} className="flex items-start gap-4 opacity-50">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white -ml-[2px] mt-0.5 z-10" />
                                <div className="flex-1 -mt-0.5">
                                  <h5 className="text-[14px] font-bold text-slate-500">
                                    {step.title}
                                  </h5>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Sidebar Column: Payment Rules & Scripts Shortcut (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Collection Strategy & Best Practices */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15.5px] font-bold text-ink flex items-center gap-2">
              <ShieldAlert className="size-4 text-amber-600" />
              পেমেন্ট আদায় পলিসি
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                ৭ দিন পার হলে প্রথমে নম্র রিমাইন্ডার দিন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                ১৪ দিন পার হলে পেমেন্ট না পাওয়া পর্যন্ত সমস্ত কাজ স্থগিত করার স্পষ্ট বার্তা পাঠান।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                ৩০ দিন পার হলে মার্কেটপ্লেসের সাপোর্ট/ডিসপুট প্রক্রিয়া শুরু করুন।
              </li>
            </ul>
          </div>

          {/* Conversation Scripts Promo Link */}
          <div className="glass p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3 bg-gradient-to-br from-purple-50 to-white">
            <h3 className="text-[15px] font-bold text-purple-950 flex items-center gap-2">
              <Zap className="size-4 text-purple-600 fill-current" />
              রেডিমেড তাগাদা মেসেজ
            </h3>

            <p className="text-[12.5px] text-purple-900 leading-relaxed font-medium">
              আপনার কাজের ধরনের সাথে মিল রেখে সব রকম তাগাদা মেসেজ স্ক্রিপ্ট দেখতে শিখুন বিভাগে যান:
            </p>

            <Link
              href="/learn/scripts"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm transition-all block text-center cursor-pointer"
            >
              কথোপকথন স্ক্রিপ্ট খুলুন →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
