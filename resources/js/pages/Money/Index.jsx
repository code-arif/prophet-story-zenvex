import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  FileText,
  Clock,
  TrendingUp,
  ShieldCheck,
  Landmark,
  Gift,
  FolderOpen,
  ChevronRight,
  Plus,
  X,
  Loader2,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 22 — Money Hub · টাকা
 * 12-month earnings bar chart + Inset summary tiles + 4 Accounts cards + Document channels list + Add Income FAB Modal.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function MoneyIndex({
  earnings12m = [],
  monthlyBarChart = [],
  total12mBdt = 784000,
  zeroIncomeMonths = 3,
  safeExpenseBdt = 37000,
  runwayMonths = 4.2,
  pendingDocCount = 2,
}) {
  const { t } = useI18n();

  // Add Income Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountBdt, setAmountBdt] = useState('');
  const [source, setSource] = useState('Upwork Escrow');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic 12-month bar chart dataset or fallback
  const chartItems = monthlyBarChart && monthlyBarChart.length > 0
    ? monthlyBarChart
    : [
        { shortLabel: 'মাস ১', heightPct: 40, totalBdt: 45000 },
        { shortLabel: 'মাস ২', heightPct: 60, totalBdt: 62000 },
        { shortLabel: 'মাস ৩', heightPct: 6, totalBdt: 0 },
        { shortLabel: 'মাস ৪', heightPct: 80, totalBdt: 85000 },
        { shortLabel: 'মাস ৫', heightPct: 50, totalBdt: 58000 },
        { shortLabel: 'মাস ৬', heightPct: 6, totalBdt: 0 },
        { shortLabel: 'মাস ৭', heightPct: 70, totalBdt: 72000 },
        { shortLabel: 'মাস ৮', heightPct: 90, totalBdt: 95000 },
        { shortLabel: 'মাস ৯', heightPct: 45, totalBdt: 68000 },
        { shortLabel: 'মাস ১০', heightPct: 6, totalBdt: 0 },
        { shortLabel: 'মাস ১১', heightPct: 65, totalBdt: 88000 },
        { shortLabel: 'মাস ১২', heightPct: 100, totalBdt: 150000 },
      ];

  const handleSaveIncome = (e) => {
    e.preventDefault();
    if (!amountBdt || isSubmitting) return;

    setIsSubmitting(true);
    router.post(
      '/money/income',
      {
        amount_bdt: amountBdt,
        source,
        date: incomeDate,
        note,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsModalOpen(false);
          setAmountBdt('');
          setNote('');
        },
        onFinish: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="টাকা — ইজি রাইজ" />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            টাকা
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            আয়ের সামারি, ট্র্যাকিং, চ্যানেল ও প্রয়োজনীয় সনদ
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4 stroke-[3]" />
          আয় যোগ করুন
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Frosted Earnings Card, 4 Accounts Cards, Documents Menu (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Top Section: Frosted Earnings Card */}
          <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 bg-gradient-to-b from-blue-50/40 to-white">
            <div>
              <p className="text-[13px] font-bold text-slate-500">
                গত ১২ মাসে দেশে এসেছে
              </p>
              <h2 className="text-[36px] font-black text-brand leading-tight mt-0.5">
                ৳ {toBnDigits(total12mBdt.toLocaleString())}
              </h2>
            </div>

            {/* Compact 12-Column Bar Chart */}
            <div className="h-24 w-full flex items-end justify-between gap-1.5 pt-2">
              {chartItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-t-sm transition-all duration-500 relative group cursor-pointer ${
                    item.heightPct <= 10
                      ? 'bg-brand/20 hover:bg-brand/40'
                      : 'bg-brand hover:bg-brand-dark'
                  }`}
                  style={{ height: `${item.heightPct}%` }}
                  title={`${item.monthLabel || `মাস ${toBnDigits(idx + 1)}`}: ৳ ${toBnDigits(item.totalBdt ? item.totalBdt.toLocaleString() : 0)}`}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                    {item.shortLabel}: ৳{toBnDigits(item.totalBdt ? item.totalBdt.toLocaleString() : 0)}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[12px] font-semibold text-slate-400">
              {toBnDigits(zeroIncomeMonths)}টি মাসে কোনো আয় আসেনি
            </p>

            {/* Inset Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <p className="text-[13px] font-bold text-slate-700">
                  নিরাপদ মাসিক খরচ ৳ {toBnDigits(safeExpenseBdt.toLocaleString())}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                <p className="text-[13px] font-bold text-slate-700">
                  রানওয়ে {toBnDigits(runwayMonths)} মাস
                </p>
              </div>
            </div>
          </div>

          {/* Section: হিসাব (4 Navigation Cards) */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-extrabold text-slate-400 px-1 uppercase tracking-wider">
              হিসাব
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: আয়ের খাতা */}
              <Link
                href="/money/ledger"
                className="glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between items-start group cursor-pointer h-28"
              >
                <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink group-hover:text-brand transition-colors">
                    আয়ের খাতা
                  </p>
                  <p className="text-[12px] font-medium text-slate-400 truncate">
                    প্রতিটি প্রাপ্তি লিখে রাখুন
                  </p>
                </div>
              </Link>

              {/* Card 2: রেট ও প্রকৃত ঘণ্টা-আয় */}
              <Link
                href="/money/true-hourly"
                className="glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between items-start group cursor-pointer h-28"
              >
                <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink group-hover:text-brand transition-colors">
                    রেট ও প্রকৃত ঘণ্টা-আয়
                  </p>
                  <p className="text-[12px] font-medium text-slate-400 truncate">
                    ঘণ্টায় আসলে কত এলো
                  </p>
                </div>
              </Link>

              {/* Card 3: স্থিতিশীলতা ও রানওয়ে */}
              <Link
                href="/money/runway"
                className="glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between items-start group cursor-pointer h-28"
              >
                <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink group-hover:text-brand transition-colors">
                    স্থিতিশীলতা ও রানওয়ে
                  </p>
                  <p className="text-[12px] font-medium text-slate-400 truncate">
                    কত মাস চলবে
                  </p>
                </div>
              </Link>

              {/* Card 4: আয়ের প্রমাণপত্র */}
              <Link
                href="/money/proof"
                className="glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand/30 transition-all flex flex-col justify-between items-start group cursor-pointer h-28"
              >
                <div className="size-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink group-hover:text-brand transition-colors">
                    আয়ের প্রমাণপত্র
                  </p>
                  <p className="text-[12px] font-medium text-slate-400 truncate">
                    ব্যাংক বা দূতাবাসের জন্য
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Section: দেশে আনা ও কাগজ (Stacked Menu List) */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-extrabold text-slate-400 px-1 uppercase tracking-wider">
              দেশে আনা ও কাগজ
            </h3>

            <div className="glass rounded-2xl border border-slate-100 shadow-2xs overflow-hidden divide-y divide-slate-100">
              <Link
                href="/money/channels"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Landmark className="size-5 text-slate-500 group-hover:text-brand transition-colors" />
                  <p className="text-[14.5px] font-bold text-ink group-hover:text-brand transition-colors">
                    টাকা দেশে আনার চ্যানেল
                  </p>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-brand transition-colors" />
              </Link>

              <Link
                href="/money/incentive"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Gift className="size-5 text-slate-500 group-hover:text-brand transition-colors" />
                  <p className="text-[14.5px] font-bold text-ink group-hover:text-brand transition-colors">
                    প্রণোদনা হিসাব ও যোগ্যতা
                  </p>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-brand transition-colors" />
              </Link>

              <Link
                href="/money/documents"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="size-5 text-slate-500 group-hover:text-brand transition-colors" />
                  <p className="text-[14.5px] font-bold text-ink group-hover:text-brand transition-colors">
                    কাগজপত্র প্রস্তুতি
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pendingDocCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                      {toBnDigits(pendingDocCount)}টি বাকি
                    </span>
                  )}
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-brand transition-colors" />
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column: Remittance Advice & Quick Add (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Quick Add Income Widget */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15.5px] font-bold text-ink flex items-center gap-2">
              <Zap className="size-4 text-brand fill-current" />
              ইনকাম ট্র্যাকার
            </h3>

            <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
              আপনার ফ্রিল্যান্সিং প্রাপ্তিগুলো লিখে রাখলে স্বয়ংক্রিয়ভাবে ব্যাংক ও ভিসা সাপোর্টিং আয় সনদ তৈরি করা যাবে।
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="size-4 stroke-[3]" />
              নতুন প্রাপ্তি রেকর্ড করুন
            </button>
          </div>

          {/* Bangladesh Remittance Incentive Summary Card */}
          <div className="glass p-5 rounded-2xl border border-emerald-200/80 shadow-sm space-y-3 bg-gradient-to-br from-emerald-50/40 to-white">
            <h3 className="text-[15px] font-bold text-emerald-950 flex items-center gap-2">
              <Gift className="size-4 text-emerald-600" />
              ২.৫% নগদ প্রণোদনা
            </h3>

            <ul className="text-[12.5px] text-emerald-900 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                বৈধ ব্যাংকিং চ্যানেলে রেমিটেন্স আনলে সরকার প্রদত্ত ২.৫% প্রণোদনা পাবেন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                আইটি ও ফ্রিল্যান্সিং রেমিটেন্স আয়ের ওপর বাংলাদেশ ব্যাংকের বিশেষ আয়কর ছাড় বহাল রয়েছে।
              </li>
            </ul>

            <Link
              href="/money/incentive"
              className="w-full py-2 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 font-bold text-[12.5px] flex items-center justify-center gap-1 transition-all block text-center cursor-pointer border border-emerald-200"
            >
              প্রণোদনা যোগ্যতা যাচাই করুন →
            </Link>
          </div>

        </div>

      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 size-14 bg-brand hover:bg-brand-dark text-white rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 z-40 cursor-pointer border-2 border-white"
        title="আয় যোগ করুন"
      >
        <Plus className="size-7 stroke-[2.5]" />
      </button>

      {/* Add Income Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-bn relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-[18px] font-bold text-ink">
                নতুন আয় রেকর্ড করুন
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIncome} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">
                  টাকার পরিমাণ (BDT) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">
                    ৳
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amountBdt}
                    onChange={(e) => setAmountBdt(e.target.value)}
                    placeholder="যেমন: ৫০,০০০"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-ink focus:bg-white focus:border-brand focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    উৎস / মাধ্যম
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-ink focus:bg-white focus:border-brand focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Upwork Escrow">Upwork Escrow</option>
                    <option value="Fiverr Revenue">Fiverr Revenue</option>
                    <option value="Payoneer Transfer">Payoneer Transfer</option>
                    <option value="Direct Bank Wire">Direct Bank Wire</option>
                    <option value="Local Client">Local Client</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-ink focus:bg-white focus:border-brand focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">
                  নোট / প্রজেক্ট বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="যেমন: মোবাইল অ্যাপ রিডিজাইন পেমেন্ট"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-ink focus:bg-white focus:border-brand focus:outline-none transition-all"
                />
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
