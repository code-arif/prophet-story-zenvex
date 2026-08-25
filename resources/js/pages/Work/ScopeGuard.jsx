import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  Clock,
  Calendar,
  MoreVertical,
  Minus,
  X,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 17 — Scope Guard · স্কোপ ও রিভিশন গার্ড
 * Clean 2-column desktop grid (max-w-5xl).
 * Comparison bento card + stacked bar + amber warn strip + extra items list + modal.
 */
export default function ScopeGuard({
  job = null,
  jobId = 1,
  agreed = [],
  extra = [],
  items = [],
}) {
  const { t } = useI18n();

  // Fallback demo job details
  const activeJob = job ? {
    id: job.id,
    title: job.title,
    client_name: job.client ? job.client.name : 'Ahmed Traders',
  } : {
    id: jobId || 1,
    title: 'লোগো ডিজাইন — ৩টি কনসেপ্ট',
    client_name: 'Ahmed Traders',
  };

  // Fallback extra scope items matching UI specification
  const defaultExtraItems = [
    {
      id: 101,
      date_formatted: '২০ জুন',
      description: 'সোশ্যাল মিডিয়ার জন্য আরও ২টি সাইজ',
      hours: 1.5,
    },
    {
      id: 102,
      date_formatted: '১৮ জুন',
      description: 'কালার প্যালেটে পরিবর্তন',
      hours: 1.0,
    },
    {
      id: 103,
      date_formatted: '১৬ জুন',
      description: 'অতিরিক্ত ফন্ট ট্রায়াল',
      hours: 2.0,
    },
  ];

  // Initialize local state from props or fallback defaults for instantaneous responsiveness
  const [extraRequests, setExtraRequests] = useState(() => {
    return extra && extra.length > 0
      ? extra.map((item) => ({
          id: item.id,
          date_formatted: item.date ? new Date(item.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }) : '২০ জুন',
          description: item.description,
          hours: item.hours || 1.0,
        }))
      : defaultExtraItems;
  });

  // Sync state when Inertia reloads with new extra props
  React.useEffect(() => {
    if (extra && extra.length > 0) {
      setExtraRequests(
        extra.map((item) => ({
          id: item.id,
          date_formatted: item.date ? new Date(item.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }) : '২০ জুন',
          description: item.description,
          hours: item.hours || 1.0,
        }))
      );
    }
  }, [extra]);

  // Calculate total overage metrics
  const overageCount = extraRequests.length;
  const totalOverageHours = extraRequests.reduce((acc, i) => acc + Number(i.hours || 0), 0);

  // Modal / Bottom Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newHours, setNewHours] = useState(1.0);
  const [copiedScript, setCopiedScript] = useState(false);

  // Stepper handlers
  const handleIncreaseHours = () => setNewHours((prev) => Math.min(24, Math.round((prev + 0.5) * 10) / 10));
  const handleDecreaseHours = () => setNewHours((prev) => Math.max(0.5, Math.round((prev - 0.5) * 10) / 10));

  const handleAddExtraRequest = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newItem = {
      id: Date.now(),
      date_formatted: 'আজ',
      description: newDesc.trim(),
      hours: newHours,
    };

    // Instant state update
    setExtraRequests((prev) => [newItem, ...prev]);
    setIsSheetOpen(false);

    // Send to backend
    router.post(
      `/work/jobs/${activeJob.id}/scope`,
      {
        description: newDesc.trim(),
        hours: newHours,
        is_extra: true,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setNewDesc('');
          setNewHours(1.0);
        },
        onError: () => {
          // Keep local item
        },
      }
    );
  };

  const copyNegotiationScript = () => {
    const scriptText = `প্রিয় ক্লায়েন্ট, আমাদের প্রাথমিক চুক্তিতে ২টি রিভিশন ও ১৮ ঘণ্টার কাজ নির্ধারিত ছিল। অতিরিক্ত অনুরোধগুলো সম্পন্ন করতে আরও ${toBnDigits(totalOverageHours || 4.5)} ঘণ্টা সময় ও আলাদা বাজেটের প্রয়োজন হবে।`;
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="স্কোপ ও রিভিশন গার্ড — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[20px] font-black text-ink tracking-tight leading-tight">
            স্কোপ ও রিভিশন গার্ড
          </h1>
          <p className="text-[12.5px] text-muted font-medium">
            {activeJob.client_name} — {activeJob.title}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="size-4" />
          নতুন অনুরোধ
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Comparison Card, Alert Strip, Requests List (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Bento Comparison Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="grid grid-cols-2 divide-x divide-slate-200/80 items-stretch">
              
              {/* Left Column: Agreed Scope */}
              <div className="pr-4 flex flex-col justify-between">
                <span className="text-[12.5px] font-bold text-slate-500">
                  যা সম্মত হয়েছিল
                </span>
                <div className="mt-3 space-y-1">
                  <p className="text-[18px] font-bold text-ink leading-tight">
                    ৩টি কনসেপ্ট
                  </p>
                  <p className="text-[15px] font-bold text-slate-700 leading-tight">
                    ২টি রিভিশন
                  </p>
                  <p className="text-[12px] font-semibold text-muted mt-1">
                    ১৮ ঘণ্টা
                  </p>
                </div>
              </div>

              {/* Right Column: Overage Scope */}
              <div className="pl-4 flex flex-col justify-between items-end text-right">
                <span className="text-[12.5px] font-bold text-slate-500">
                  যা বাড়তি চাওয়া হয়েছে
                </span>
                <div className="mt-3 flex flex-col items-end">
                  <span className="text-[32px] font-black text-amber-600 leading-none">
                    {toBnDigits(overageCount)}
                  </span>
                  <span className="inline-block text-[12px] font-extrabold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full mt-1.5">
                    {toBnDigits(totalOverageHours)} ঘণ্টা
                  </span>
                </div>
              </div>

            </div>

            {/* Stacked Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
                <div
                  className="bg-brand h-full transition-all duration-500"
                  style={{ width: '80%' }}
                  title="সম্মত কাজ (৮০%)"
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: '25%' }}
                  title="বাড়তি কাজ (২৫%)"
                />
              </div>
              <p className="text-[12px] text-center font-bold text-slate-500">
                সম্মত কাজের ২৫% বাড়তি হয়ে গেছে
              </p>
            </div>
          </div>

          {/* Amber Alert Warning Strip */}
          <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 flex items-start gap-3 backdrop-blur-xs">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold text-amber-950 leading-snug">
                সম্মত রিভিশন শেষ — এরপরের অনুরোধ আলাদা করে ধরা উচিত
              </p>
            </div>
            <button
              type="button"
              onClick={copyNegotiationScript}
              className="text-[12.5px] font-extrabold text-brand hover:underline shrink-0 flex items-center gap-1"
            >
              {copiedScript ? <Check className="size-3.5 text-emerald-600 stroke-[3]" /> : null}
              {copiedScript ? 'কপি হয়েছে' : 'কী লিখবেন দেখুন'}
            </button>
          </div>

          {/* Overage Requests List Section */}
          <div className="space-y-3">
            <h3 className="text-[17px] font-bold text-ink px-1">
              বাড়তি অনুরোধের তালিকা
            </h3>

            <div className="space-y-2.5">
              {extraRequests.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="glass p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Date Badge Circle */}
                    <div className="size-11 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 leading-none">
                        জুন
                      </span>
                      <span className="text-[13.5px] font-black text-ink leading-none mt-0.5">
                        {toBnDigits(item.date_formatted.replace(/[^0-9]/g, '') || 20)}
                      </span>
                    </div>

                    <p className="text-[14px] font-bold text-ink truncate leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[12px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                      {toBnDigits(item.hours)} ঘণ্টা
                    </span>
                    <button
                      type="button"
                      className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Scope Dashed Button */}
              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className="w-full h-14 border-2 border-dashed border-slate-300 hover:border-brand rounded-2xl flex items-center justify-center gap-2 text-brand font-bold text-[14px] hover:bg-brand/5 transition-all"
              >
                <Plus className="size-4" />
                <span>নতুন অনুরোধ যোগ করুন</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column: Negotiation Assistant & Scope Rules (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Client Negotiation Script Box */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <FileText className="size-4 text-purple-600" />
              ক্লায়েন্ট রেসপন্স টেমপ্লেট
            </h3>
            
            <p className="text-[12.5px] text-muted leading-relaxed">
              স্কোপক্রিপ এড়াতে ক্লায়েন্টকে পাঠানোর উপযোগী তৈরি বার্তা:
            </p>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-[12.5px] text-purple-950 leading-relaxed font-medium">
              "প্রিয় ক্লায়েন্ট, আমাদের প্রাথমিক চুক্তিতে ২টি রিভিশন ও ১৮ ঘণ্টার কাজ নির্ধারিত ছিল। অতিরিক্ত অনুরোধগুলো সম্পন্ন করতে আরও {toBnDigits(totalOverageHours || 4.5)} ঘণ্টা সময় ও আলাদা বাজেটের প্রয়োজন হবে।"
            </div>

            <button
              type="button"
              onClick={copyNegotiationScript}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedScript ? <Check className="size-4 stroke-[3]" /> : <Copy className="size-4" />}
              {copiedScript ? 'টেমপ্লেট কপি করা হয়েছে' : 'মেসেজ কপি করুন'}
            </button>
          </div>

          {/* Scope Protection Advice */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <ShieldAlert className="size-4 text-amber-600" />
              স্কোপ গার্ড নিয়মাবলী
            </h3>
            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-1.5 font-medium">
              <li>• প্রতিটি অতিরিক্ত পরিবর্তনের অনুরোধ লিখে রেকর্ড রাখুন।</li>
              <li>• সরাসরি 'না' না বলে কাজ অনুযায়ী অতিরিক্ত ফি অফার করুন।</li>
              <li>• ছোট কাজের ক্ষেত্রেও ক্লায়েন্ট সম্মতি নিন।</li>
            </ul>
          </div>

        </div>

      </div>

      {/* New Extra Request Modal / Bottom Sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-bn relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-[18px] font-bold text-ink">
                নতুন অনুরোধ
              </h2>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddExtraRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">
                  কী বাড়তি চাওয়া হয়েছে?
                </label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="যেমন: নতুন লোগো কনসেপ্ট"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Hours Stepper */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    ঘণ্টা
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl h-11 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecreaseHours}
                      className="px-3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-ink text-[14px]">
                      {toBnDigits(newHours)}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseHours}
                      className="px-3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-[13.5px]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-[13.5px] shadow-md shadow-brand/20"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
