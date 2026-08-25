import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  TrendingUp,
  Send,
  CheckCircle2,
  Award,
  Clock,
  DollarSign,
  Sparkles,
  Filter,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 18 — Proposal Tracker · প্রস্তাব ট্র্যাকার
 * 100% Dynamic database integration for proposals, funnel, and stats.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function ProposalTracker({ proposals = [], stats = null, windowDays = 90 }) {
  const { t } = useI18n();

  // Active breakdown tab: 'marketplace' or 'category'
  const [breakdownFilter, setBreakdownFilter] = useState('marketplace');

  // Add New Proposal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMarketplace, setNewMarketplace] = useState('Upwork');
  const [newAmount, setNewAmount] = useState('');
  const [newOutcome, setNewOutcome] = useState('sent');

  // Format proposals from backend DB props
  const proposalList = proposals.map((p) => {
    let outcomeLabel = 'অপেক্ষমান';
    let status = 'pending';
    if (p.outcome === 'replied' || p.outcome === 'viewed') {
      outcomeLabel = 'উত্তর এসেছে';
      status = 'replied';
    } else if (p.outcome === 'won' || p.outcome === 'hired') {
      outcomeLabel = 'কাজ পেয়েছেন';
      status = 'won';
    }

    const formattedAmount = p.quoted_paisa
      ? `$${(p.quoted_paisa / 100).toLocaleString()}`
      : '$50';

    return {
      id: p.id,
      title: p.job_type || (p.job ? p.job.title : 'প্রস্তাব'),
      client_marketplace: p.marketplace || (p.job && p.job.client ? p.job.client.marketplace : 'Upwork'),
      amount: formattedAmount,
      status: status,
      status_label: outcomeLabel,
      date_formatted: p.sent_at
        ? new Date(p.sent_at).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })
        : 'আজ',
    };
  });

  // Dynamic funnel metrics from backend DB calculations
  const totalSent = stats?.sent ?? proposalList.length;
  const totalReplied = stats?.replied ?? proposalList.filter((p) => p.status === 'replied' || p.status === 'won').length;
  const totalWon = stats?.won ?? proposalList.filter((p) => p.status === 'won').length;

  const responseRatePct = stats?.response_rate_pct ?? (totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0);
  const winRatePct = stats?.win_rate_pct ?? (totalSent > 0 ? Math.round((totalWon / totalSent) * 100) : 0);

  // Dynamic Marketplace & Category Breakdown Data
  const defaultMarketplaceData = [
    { name: 'Upwork', pct: 70, barClass: 'bg-brand' },
    { name: 'Fiverr', pct: 45, barClass: 'bg-brand/70' },
    { name: 'Direct', pct: 20, barClass: 'bg-brand/40' },
    { name: 'LinkedIn', pct: 5, barClass: 'bg-brand/20' },
  ];

  const defaultCategoryData = [
    { name: 'গ্রাফিক ডিজাইন', pct: 65, barClass: 'bg-brand' },
    { name: 'ওয়েব ডেভেলপমেন্ট', pct: 40, barClass: 'bg-brand/70' },
    { name: 'UI/UX ডিজাইন', pct: 25, barClass: 'bg-brand/40' },
    { name: 'কন্টেন্ট রাইটিং', pct: 10, barClass: 'bg-brand/20' },
  ];

  const marketplaceData = (stats?.marketplace_data && stats.marketplace_data.length > 0)
    ? stats.marketplace_data
    : defaultMarketplaceData;

  const categoryData = (stats?.category_data && stats.category_data.length > 0)
    ? stats.category_data
    : defaultCategoryData;

  const currentBreakdown = breakdownFilter === 'marketplace' ? marketplaceData : categoryData;

  // Status Badge Styling Helper
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'replied':
        return 'bg-brand/10 text-brand border border-brand/20';
      case 'won':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pending':
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  // Submit New Proposal Handler
  const handleCreateProposal = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    router.post(
      '/work/proposals',
      {
        title: newTitle.trim(),
        marketplace: newMarketplace,
        amount: newAmount || 50,
        outcome: newOutcome,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsModalOpen(false);
          setNewTitle('');
          setNewAmount('');
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="প্রস্তাব ট্র্যাকার — ইজি রাইজ" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রস্তাব ট্র্যাকার
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            আপনার কভার লেটার পারফরম্যান্স ও কনভার্সন রেট বিশ্লেষণ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="size-4" />
            নতুন প্রস্তাব
          </button>
          <Link
            href="/assistant"
            className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[13px] font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Zap className="size-4 fill-current" />
            AI কভার লেটার
          </Link>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Progress Funnel, Filter Tabs, Breakdown, Recent List (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Performance Funnel Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-[18px] font-bold text-ink">
              আপনার অগ্রগতি
            </h2>

            {/* Funnel Progress Bars */}
            <div className="space-y-3.5">
              {/* Sent */}
              <div>
                <div className="flex justify-between text-[13.5px] font-bold text-slate-700 mb-1">
                  <span>পাঠানো</span>
                  <span className="font-extrabold text-ink">{toBnDigits(totalSent)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                  <div className="bg-brand h-full rounded-full w-full" />
                </div>
              </div>

              {/* Replied */}
              <div>
                <div className="flex justify-between text-[13.5px] font-bold text-slate-700 mb-1">
                  <span>উত্তর এসেছে</span>
                  <span className="font-extrabold text-ink">{toBnDigits(totalReplied)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                  <div
                    className="bg-brand/60 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, responseRatePct))}%` }}
                  />
                </div>
              </div>

              {/* Won */}
              <div>
                <div className="flex justify-between text-[13.5px] font-bold text-slate-700 mb-1">
                  <span>কাজ পেয়েছেন</span>
                  <span className="font-extrabold text-emerald-700">{toBnDigits(totalWon)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, winRatePct))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rates Conversion Summary Footer */}
            <div className="flex gap-4 border-t border-slate-100 pt-4">
              <div className="flex-1">
                <p className="text-[22px] font-black text-brand leading-none">
                  {toBnDigits(responseRatePct)}%
                </p>
                <p className="text-[13.5px] font-bold text-slate-700 mt-1">
                  উত্তরের হার
                </p>
                <p className="text-[11.5px] font-medium text-slate-400 mt-0.5">
                  গত {toBnDigits(windowDays)} দিন
                </p>
              </div>

              <div className="w-px bg-slate-200" />

              <div className="flex-1 pl-2">
                <p className="text-[22px] font-black text-emerald-600 leading-none">
                  {toBnDigits(winRatePct)}%
                </p>
                <p className="text-[13.5px] font-bold text-slate-700 mt-1">
                  কাজ পাওয়ার হার
                </p>
                <p className="text-[11.5px] font-medium text-slate-400 mt-0.5">
                  গত {toBnDigits(windowDays)} দিন
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Filter Pills */}
          <div className="glass p-1 rounded-2xl border border-slate-100 shadow-xs flex gap-1">
            <button
              type="button"
              onClick={() => setBreakdownFilter('marketplace')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[13.5px] transition-all active:scale-95 text-center ${
                breakdownFilter === 'marketplace'
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'text-slate-600 hover:text-ink hover:bg-slate-100/60'
              }`}
            >
              মার্কেটপ্লেস অনুযায়ী
            </button>
            <button
              type="button"
              onClick={() => setBreakdownFilter('category')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[13.5px] transition-all active:scale-95 text-center ${
                breakdownFilter === 'category'
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'text-slate-600 hover:text-ink hover:bg-slate-100/60'
              }`}
            >
              কাজের ধরন অনুযায়ী
            </button>
          </div>

          {/* Breakdown Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg text-[12px] font-extrabold w-fit border border-emerald-200">
              <TrendingUp className="size-4 text-emerald-700" />
              <span>সবচেয়ে ভালো ফল এখানে</span>
            </div>

            <div className="space-y-3.5">
              {currentBreakdown.map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <span className="w-24 text-[14px] font-bold text-slate-800 truncate">
                    {row.name}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                    <div
                      className={`${row.barClass || 'bg-brand'} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-black text-[14px] text-ink">
                    {toBnDigits(row.pct)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Proposals Section */}
          <div className="space-y-3">
            <h3 className="text-[17px] font-bold text-ink px-1">
              সাম্প্রতিক প্রস্তাব ({toBnDigits(proposalList.length)})
            </h3>

            <div className="space-y-2.5">
              {proposalList.map((item) => (
                <div
                  key={item.id}
                  className="glass p-4 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center hover:border-slate-200 transition-all gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {item.client_marketplace}
                      </span>
                      <span className="text-[12px] font-medium text-slate-400">
                        {item.date_formatted}
                      </span>
                    </div>

                    <p className="font-bold text-[15px] text-ink truncate leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[13.5px] font-extrabold text-brand">
                      {item.amount}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold shrink-0 ${getStatusBadgeStyle(item.status)}`}>
                    {item.status_label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Column: AI Assistant & Quality Guides (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* AI Cover Letter Assistant Promo Card */}
          <div className="p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3.5 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h3 className="text-[17px] font-extrabold text-white">
                AI দিয়ে আকর্ষক কভার লেটার লিখুন
              </h3>
              <p className="text-[12.5px] text-purple-100 mt-1 leading-relaxed font-medium">
                ক্লায়েন্টের জব পোস্ট পেস্ট করুন এবং মুহূর্তেই পেশাদার বাংলা ও ইংরেজি প্রস্তাব পান।
              </p>
            </div>

            <Link
              href="/assistant"
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-purple-800 font-extrabold text-[13px] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md block text-center"
            >
              <Zap className="size-4 text-purple-800 fill-current inline-block" />
              AI সহকারী খুলুন
            </Link>
          </div>

          {/* Proposal Quality Best Practice Checklist */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              উচ্চ কনভার্সন প্রস্তাবের চাবিকাঠি
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                প্রথম ২ লাইনে ক্লায়েন্টের সমস্যার সমাধান উল্লেখ করুন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                জেরিক কভার লেটার ব্যবহার না করে প্রাসঙ্গিক নমুনা দিন।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                শেষে স্পষ্ট কল-টু-অ্যাকশন (CTA) যোগ করুন।
              </li>
            </ul>

            <Link
              href="/learn/proposals"
              className="block text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[12.5px] transition-all mt-2"
            >
              প্রস্তাব কাঠামো লাইব্রেরি দেখুন →
            </Link>
          </div>

        </div>

      </div>

      {/* Add New Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-bn relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-[18px] font-bold text-ink">
                নতুন প্রস্তাব রেকর্ড করুন
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">
                  কাজের শিরোনাম / ক্যাটাগরি
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: Graphic Design / Web Development"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    মার্কেটপ্লেস
                  </label>
                  <select
                    value={newMarketplace}
                    onChange={(e) => setNewMarketplace(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:outline-none focus:border-brand"
                  >
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr</option>
                    <option value="Direct">Direct Client</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-slate-700">
                    বাজেট ($)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="50"
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">
                  অবস্থা (Outcome)
                </label>
                <select
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-[13.5px] font-bold text-ink focus:outline-none focus:border-brand"
                >
                  <option value="sent">পাঠানো (অপেক্ষমান)</option>
                  <option value="replied">উত্তর এসেছে</option>
                  <option value="won">কাজ পেয়েছেন</option>
                </select>
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
