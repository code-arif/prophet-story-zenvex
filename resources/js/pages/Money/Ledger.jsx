import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ChevronDown,
  ArrowUpDown,
  Landmark,
  CreditCard,
  Globe,
  Plus,
  X,
  Loader2,
  FileCheck,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 23 — Income Ledger · আয়ের খাতা
 * Filter pills + Total summary strip + Month-grouped income entry cards + Add Income Modal.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function Ledger({ entries = [], totalBdt = 784000 }) {
  const { t } = useI18n();

  // Filter & Sort States
  const [timeFilter, setTimeFilter] = useState('12m');
  const [channelFilter, setChannelFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [amountBdt, setAmountBdt] = useState('');
  const [source, setSource] = useState('Upwork Direct');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback demo month-grouped income records matching UI HTML specs
  const defaultGroups = [
    {
      monthLabel: 'জুন ২০২৬',
      totalFormatted: '৳ ৯২,০০০',
      entries: [
        {
          id: 1,
          day: '১৫',
          monthName: 'জুন',
          client: 'TechNova Solutions',
          channel: 'Upwork Direct',
          iconType: 'bank',
          amountFormatted: '৳ ৫৩,৭৭৫',
          subtext: 'USD ৪৫০ · রেট ১১৯.৫০',
          rawDate: '2026-06-15',
          rawPaisa: 5377500,
        },
        {
          id: 2,
          day: '০২',
          monthName: 'জুন',
          client: 'Local Startup XYZ',
          channel: 'bKash',
          iconType: 'card',
          amountFormatted: '৳ ৩৮,২২৫',
          subtext: 'BDT · লোকাল প্রজেক্ট',
          rawDate: '2026-06-02',
          rawPaisa: 3822500,
        },
      ],
    },
    {
      monthLabel: 'মে ২০২৬',
      totalFormatted: '৳ ১,১২,৫০০',
      entries: [
        {
          id: 3,
          day: '২৮',
          monthName: 'মে',
          client: 'Global Design Agency',
          channel: 'Payoneer',
          iconType: 'globe',
          amountFormatted: '৳ ১,১২,৫০০',
          subtext: 'USD ৯৫০ · রেট ১১৮.৪২',
          rawDate: '2026-05-28',
          rawPaisa: 11250000,
        },
      ],
    },
    {
      monthLabel: 'এপ্রিল ২০২৬',
      totalFormatted: 'কোনো প্রাপ্তি নেই',
      entries: [], // Empty Gap State
    },
  ];

  // Filter & sort logic for backend Eloquent `entries` or default demo
  const filteredEntries = (() => {
    let list = entries && entries.length > 0 ? [...entries] : null;

    if (!list) return null; // Use demo groups if no DB entries exist

    const now = new Date();

    // Timeframe Filter
    if (timeFilter === '12m') {
      const cut = new Date(now.getFullYear(), now.getMonth() - 12, 1);
      list = list.filter((e) => new Date(e.date) >= cut);
    } else if (timeFilter === '6m') {
      const cut = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      list = list.filter((e) => new Date(e.date) >= cut);
    } else if (timeFilter === '3m') {
      const cut = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      list = list.filter((e) => new Date(e.date) >= cut);
    } else if (timeFilter === 'this_month') {
      const cut = new Date(now.getFullYear(), now.getMonth(), 1);
      list = list.filter((e) => new Date(e.date) >= cut);
    }

    // Channel Filter
    if (channelFilter !== 'all') {
      list = list.filter((e) =>
        (e.channel || '').toLowerCase().includes(channelFilter.toLowerCase())
      );
    }

    // Sort Order
    list.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dB - dA : dA - dB;
    });

    return list;
  })();

  // Map real filtered entries into month groups
  const groupedData = (() => {
    if (!filteredEntries) return defaultGroups;

    const groupsMap = {};
    const monthNamesBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    filteredEntries.forEach((entry) => {
      const d = new Date(entry.date);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const monthKey = `${monthNamesBn[mIdx]} ${toBnDigits(yr)}`;

      if (!groupsMap[monthKey]) {
        groupsMap[monthKey] = {
          monthLabel: monthKey,
          totalPaisa: 0,
          entries: [],
        };
      }

      const bdt = entry.amount_paisa ? Math.round(entry.amount_paisa / 100) : 0;
      groupsMap[monthKey].totalPaisa += entry.amount_paisa || 0;

      groupsMap[monthKey].entries.push({
        id: entry.id,
        day: toBnDigits(String(d.getDate()).padStart(2, '0')),
        monthName: monthNamesBn[mIdx].substring(0, 3),
        client: entry.job ? entry.job.title : (entry.channel || 'প্রজেক্ট আয়'),
        channel: entry.channel || 'Upwork Direct',
        iconType: (entry.channel || '').toLowerCase().includes('bkash') ? 'card' : 'bank',
        amountFormatted: `৳ ${bdt.toLocaleString()}`,
        subtext: entry.notes || `BDT · প্রজেক্ট পেমেন্ট`,
      });
    });

    return Object.values(groupsMap).map((g) => ({
      monthLabel: g.monthLabel,
      totalFormatted: `৳ ${Math.round(g.totalPaisa / 100).toLocaleString()}`,
      entries: g.entries,
    }));
  })();

  const grandTotal = filteredEntries
    ? Math.round(filteredEntries.reduce((acc, e) => acc + (e.amount_paisa || 0), 0) / 100)
    : totalBdt;

  const totalReceiptsCount = filteredEntries ? filteredEntries.length : 23;

  // Save Income Handler
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

  const getChannelIcon = (type) => {
    if (type === 'card') return <CreditCard className="size-3.5 text-slate-500" />;
    if (type === 'globe') return <Globe className="size-3.5 text-slate-500" />;
    return <Landmark className="size-3.5 text-slate-500" />;
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="আয়ের খাতা — ইজি রাইজ" />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            আয়ের খাতা
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            প্রাপ্তির তালিকা, ফিল্টারিং ও মাসভিত্তিক আয় ট্র্যাকিং
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4 stroke-[3]" />
          নতুন প্রাপ্তি যোগ করুন
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Filter Bar, Summary Strip, Grouped Month Cards (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Filter & Sort Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Timeframe Filter Dropdown */}
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="glass rounded-full pl-4 pr-8 py-2 border border-slate-200 hover:border-brand/40 text-[13px] font-bold text-ink cursor-pointer transition-all shadow-2xs appearance-none focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="12m">গত ১২ মাস</option>
                  <option value="6m">গত ৬ মাস</option>
                  <option value="3m">গত ৩ মাস</option>
                  <option value="this_month">এই মাস</option>
                  <option value="all">সব সময়</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Channel Filter Dropdown */}
              <div className="relative">
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="glass rounded-full pl-4 pr-8 py-2 border border-slate-200 hover:border-brand/40 text-[13px] font-bold text-ink cursor-pointer transition-all shadow-2xs appearance-none focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="all">সব চ্যানেল</option>
                  <option value="upwork">Upwork Direct</option>
                  <option value="bkash">bKash</option>
                  <option value="payoneer">Payoneer</option>
                  <option value="fiverr">Fiverr Revenue</option>
                  <option value="bank">Direct Bank Wire</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort Toggle Button */}
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className={`glass rounded-full size-9 flex items-center justify-center border transition-all cursor-pointer shadow-2xs ${
                sortOrder === 'asc'
                  ? 'border-brand text-brand bg-brand/10'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
              title={sortOrder === 'desc' ? 'সর্বশেষ আগে' : 'পুরানো আগে'}
            >
              <ArrowUpDown className="size-4" />
            </button>
          </div>

          {/* Summary Strip Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center bg-gradient-to-r from-blue-50/30 to-white">
            <div>
              <p className="text-[12.5px] font-bold text-slate-500">
                মোট আয় (নির্বাচিত সময়)
              </p>
              <h2 className="text-[28px] font-black text-brand leading-none mt-1">
                ৳ {toBnDigits(grandTotal.toLocaleString())}
              </h2>
            </div>

            <div className="text-right">
              <span className="bg-brand/10 text-brand border border-brand/20 px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold inline-block">
                {toBnDigits(totalReceiptsCount)}টি প্রাপ্তি
              </span>
            </div>
          </div>

          {/* Grouped Month Income Records */}
          <div className="space-y-6">
            {groupedData.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                {/* Sticky Month Header */}
                <div className="sticky top-20 z-10 bg-slate-100/90 backdrop-blur-md py-2 px-4 rounded-xl border border-slate-200/60 flex justify-between items-center">
                  <h3 className="text-[14px] font-extrabold text-slate-700">
                    {group.monthLabel} — {toBnDigits(group.totalFormatted)}
                  </h3>
                </div>

                {/* Entry Rows or Empty State */}
                {group.entries.length > 0 ? (
                  <div className="space-y-3">
                    {group.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="glass p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs hover:border-slate-200 transition-all flex items-center gap-4"
                      >
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center min-w-[48px] text-center">
                          <span className="text-[16px] font-black text-ink leading-tight">
                            {entry.day}
                          </span>
                          <span className="text-[11.5px] font-bold text-slate-400">
                            {entry.monthName}
                          </span>
                        </div>

                        {/* Middle Info Block (Border Left Divider) */}
                        <div className="flex-1 border-l border-slate-200/80 pl-4 space-y-1 min-w-0">
                          <p className="text-[15px] font-extrabold text-ink truncate">
                            {entry.client}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            {getChannelIcon(entry.iconType)}
                            <span className="text-[12px] font-bold text-slate-600">
                              {entry.channel}
                            </span>
                          </div>
                        </div>

                        {/* Right Amount Block */}
                        <div className="text-right shrink-0">
                          <p className="text-[15px] font-black text-ink">
                            {toBnDigits(entry.amountFormatted)}
                          </p>
                          <p className="text-[11.5px] font-bold text-slate-400 mt-0.5">
                            {entry.subtext}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty Gap Month State */
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center justify-center bg-slate-50/50">
                    <p className="text-[13px] font-bold text-slate-400 italic">
                      এই মাসে কোনো আয়ের রেকর্ড নেই
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar Column: Ledger Quick Actions & Supporting Certificate Link (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Income Proof Link Card */}
          <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/40 to-white">
            <h3 className="text-[15px] font-bold text-sky-950 flex items-center gap-2">
              <FileCheck className="size-4 text-sky-600" />
              আয়ের প্রমাণপত্র সনদ
            </h3>

            <p className="text-[12.5px] text-sky-900 leading-relaxed font-medium">
              আপনার ব্যাংকে জমা হওয়া প্রাপ্তির তথ্যের ওপর ভিত্তি করে ব্যাংক বা দূতাবাসের জন্য ইনকাম সার্টিফিকেট ডাউনলোড করুন।
            </p>

            <Link
              href="/money/proof"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-xs transition-all block text-center cursor-pointer"
            >
              সনদ তৈরি করুন →
            </Link>
          </div>

          {/* Ledger Management Guidance */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <Zap className="size-4 text-brand fill-current" />
              সঠিক হিসাব সংরক্ষণের সুবিধা
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                প্রতিটি রেমিটেন্স ঢোকার সাথেই আয়ের খাতায় ইন্ট্রি দিন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand font-bold">•</span>
                ব্যাংক বা ফিনান্সিয়াল ডকুমেন্টের জন্য প্রকৃত ডলার রেট যুক্ত করুন।
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 size-14 bg-brand hover:bg-brand-dark text-white rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 z-40 cursor-pointer border-2 border-white"
        title="নতুন প্রাপ্তি যোগ করুন"
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
                    <option value="Upwork Direct">Upwork Direct</option>
                    <option value="bKash">bKash</option>
                    <option value="Payoneer">Payoneer</option>
                    <option value="Direct Bank Wire">Direct Bank Wire</option>
                    <option value="Fiverr Revenue">Fiverr Revenue</option>
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
                  placeholder="যেমন: USD ৪৫০ · রেট ১১৯.৫০"
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
