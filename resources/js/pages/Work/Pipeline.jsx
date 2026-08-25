import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Briefcase,
  Plus,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  UserCheck,
  Calendar,
  Filter,
  Sparkles,
  X,
  ArrowUpRight,
  GripVertical,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 15 — Pipeline · পাইপলাইন (Work Hub)
 * Dynamic pipeline layout based on Easy Rise UI specs & theme tokens.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function Pipeline({ jobs = [], stats = {}, clients = [] }) {
  const { t } = useI18n();

  // Active filter tab: 'all', 'proposal', 'active', 'submitted', 'payment_due', 'completed'
  const [filter, setFilter] = useState('all');

  // Modal State for adding new job
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newStatus, setNewStatus] = useState('active');

  // Fallback Jobs if DB empty
  const defaultJobs = [
    {
      id: 1,
      title: 'লোগো ডিজাইন — ৩টি কনসেপ্ট',
      client_name: 'Ahmed Traders',
      amount: 12000,
      deadline: '৩ দিন বাকি',
      source: 'সরাসরি',
      status: 'active',
    },
    {
      id: 2,
      title: 'ওয়েবসাইট রিডিজাইন (ফ্রন্টএন্ড)',
      client_name: 'Tech Nova BD',
      amount: 25000,
      deadline: '৫ দিন বাকি',
      source: 'আপওয়ার্ক',
      status: 'proposal',
    },
    {
      id: 3,
      title: 'সোশ্যাল মিডিয়া ব্যানার (৫টি)',
      client_name: 'Boutique 360',
      amount: 5000,
      deadline: 'আজ পেমেন্ট বকেয়া',
      source: 'ফাইবার',
      status: 'payment_due',
      isOverdue: true,
    },
    {
      id: 4,
      title: 'ইউটিউব থাম্বনেইল কভার প্যাক',
      client_name: 'নাবিলা স্টোর',
      amount: 4500,
      deadline: 'জমা দেওয়া হয়েছে',
      source: 'সরাসরি',
      status: 'submitted',
    },
    {
      id: 5,
      title: 'মোবাইল অ্যাপ UI ইউজার ফ্লো',
      client_name: 'আজমাইন টেক',
      amount: 18500,
      deadline: 'সম্পন্ন',
      source: 'আপওয়ার্ক',
      status: 'completed',
    },
  ];

  // Raw Job List
  const rawJobsList = jobs && jobs.length > 0
    ? jobs.map((j) => ({
        id: j.id,
        title: j.title,
        client_name: j.client ? j.client.name : (j.client_name || 'ক্লায়েন্ট'),
        amount: j.amount || j.budget || 0,
        deadline: j.deadline ? `${new Date(j.deadline).toLocaleDateString('bn-BD')}` : 'নির্ধারিত নয়',
        source: j.source || 'সরাসরি',
        status: j.status === 'awaiting_payment' ? 'payment_due' : (j.status === 'closed' ? 'completed' : j.status),
      }))
    : defaultJobs;

  // Filter Jobs
  const filteredJobs = filter === 'all'
    ? rawJobsList
    : rawJobsList.filter((j) => {
        if (filter === 'proposal') return j.status === 'proposal' || j.status === 'applied';
        if (filter === 'active') return j.status === 'active';
        if (filter === 'submitted') return j.status === 'submitted';
        if (filter === 'payment_due') return j.status === 'payment_due' || j.status === 'awaiting_payment';
        if (filter === 'completed') return j.status === 'completed' || j.status === 'closed';
        return true;
      });

  // Calculate dynamic stats from backend or list
  const proposalCount = stats.proposals_sent !== undefined ? stats.proposals_sent : rawJobsList.filter((j) => j.status === 'proposal' || j.status === 'applied').length;
  const activeCount = stats.active !== undefined ? stats.active : rawJobsList.filter((j) => j.status === 'active').length;
  const submittedCount = stats.submitted !== undefined ? stats.submitted : rawJobsList.filter((j) => j.status === 'submitted').length;
  const dueJobs = rawJobsList.filter((j) => j.status === 'payment_due' || j.status === 'awaiting_payment');
  const dueCount = stats.awaiting_payment !== undefined ? stats.awaiting_payment : dueJobs.length;
  const dueTotalAmount = stats.due_total_amount !== undefined ? stats.due_total_amount : dueJobs.reduce((acc, j) => acc + Number(j.amount || 0), 0);
  const completedCount = stats.completed !== undefined ? stats.completed : rawJobsList.filter((j) => j.status === 'completed' || j.status === 'closed').length;

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    router.post(
      '/work/jobs',
      {
        title: newJobTitle,
        client_name: newClientName || 'নতুন ক্লায়েন্ট',
        amount: newAmount,
        status: newStatus,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewJobTitle('');
          setNewClientName('');
          setNewAmount('');
        },
        onError: () => {
          setIsAddModalOpen(false);
        },
      }
    );
  };

  // Status Styling Configuration
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'চলছে',
          badgeClass: 'bg-brand/10 text-brand border border-brand/20',
          barClass: 'bg-brand',
        };
      case 'proposal':
      case 'applied':
        return {
          label: 'প্রস্তাব পাঠানো',
          badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
          barClass: 'bg-slate-300',
        };
      case 'submitted':
        return {
          label: 'জমা দেওয়া',
          badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
          barClass: 'bg-blue-500',
        };
      case 'payment_due':
      case 'awaiting_payment':
        return {
          label: 'টাকা বকেয়া',
          badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200 font-extrabold',
          barClass: 'bg-amber-500',
        };
      case 'completed':
      case 'closed':
        return {
          label: 'শেষ',
          badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          barClass: 'bg-emerald-500',
        };
      default:
        return {
          label: 'চলছে',
          badgeClass: 'bg-brand/10 text-brand border border-brand/20',
          barClass: 'bg-brand',
        };
    }
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="পাইপলাইন — ইজি রাইজ" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            পাইপলাইন
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            আপনার কাজের অগ্রগতি, ক্লায়েন্ট ডিউ ও ইনভয়েস ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/work/screener"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-ink hover:text-brand text-[13px] font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ShieldCheck className="size-4 text-emerald-600" />
            ক্লায়েন্ট যাচাই করুন
          </Link>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13px] font-bold shadow-md shadow-brand/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="size-4" />
            নতুন কাজ
          </button>
        </div>
      </div>

      {/* Summary Strip (Stats Cards) */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x snap-mandatory">
        {/* Card 1: Proposal Sent */}
        <div
          onClick={() => setFilter('proposal')}
          className={`glass min-w-[135px] flex-1 p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all active:scale-95 snap-start ${
            filter === 'proposal' ? 'border-slate-400 bg-slate-50/90' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <span className="text-[12.5px] font-bold text-slate-500">প্রস্তাব পাঠানো</span>
          <span className="text-[26px] font-black text-ink mt-2 leading-none">
            {toBnDigits(proposalCount)}
          </span>
        </div>

        {/* Card 2: Active (In Progress) */}
        <div
          onClick={() => setFilter('active')}
          className={`glass min-w-[135px] flex-1 p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all active:scale-95 snap-start border-l-4 border-l-brand ${
            filter === 'active' ? 'border-brand/40 bg-brand/5' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <span className="text-[12.5px] font-bold text-slate-500">চলছে</span>
          <span className="text-[26px] font-black text-ink mt-2 leading-none">
            {toBnDigits(activeCount)}
          </span>
        </div>

        {/* Card 3: Submitted */}
        <div
          onClick={() => setFilter('submitted')}
          className={`glass min-w-[135px] flex-1 p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all active:scale-95 snap-start ${
            filter === 'submitted' ? 'border-blue-400 bg-blue-50/40' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <span className="text-[12.5px] font-bold text-slate-500">জমা দেওয়া</span>
          <span className="text-[26px] font-black text-ink mt-2 leading-none">
            {toBnDigits(submittedCount)}
          </span>
        </div>

        {/* Card 4: Payment Due (Amber Accent) */}
        <div
          onClick={() => setFilter('payment_due')}
          className={`glass min-w-[165px] flex-1 p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all active:scale-95 snap-start border-l-4 border-l-amber-500 ${
            filter === 'payment_due' ? 'border-amber-400 bg-amber-50/50' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <span className="text-[12.5px] font-bold text-slate-500">টাকা বকেয়া</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[26px] font-black text-ink leading-none">
              {toBnDigits(dueCount)}
            </span>
            <span className="text-[12px] font-black text-amber-700">
              ৳ {toBnDigits(dueTotalAmount > 0 ? dueTotalAmount : 18500)}
            </span>
          </div>
        </div>

        {/* Card 5: Completed */}
        <div
          onClick={() => setFilter('completed')}
          className={`glass min-w-[135px] flex-1 p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all active:scale-95 snap-start ${
            filter === 'completed' ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <span className="text-[12.5px] font-bold text-slate-500">শেষ</span>
          <span className="text-[26px] font-black text-ink mt-2 leading-none">
            {toBnDigits(completedCount)}
          </span>
        </div>
      </div>

      {/* Filter Row Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'সব কাজ' },
          { id: 'active', label: 'চলছে' },
          { id: 'proposal', label: 'প্রস্তাব পাঠানো' },
          { id: 'submitted', label: 'জমা দেওয়া' },
          { id: 'payment_due', label: 'টাকা বকেয়া' },
          { id: 'completed', label: 'শেষ' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-[13.5px] font-bold transition-all active:scale-95 shrink-0 ${
              filter === f.id
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'glass text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Job Cards List (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3.5">
          {filteredJobs.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl border border-slate-100 text-muted space-y-2">
              <Briefcase className="size-10 text-slate-300 mx-auto" />
              <p className="text-[15px] font-bold text-ink">
                এই অবস্থায় কোনো কাজ পাওয়া যায়নি
              </p>
              <p className="text-[13px] text-muted">
                অন্য ফিল্টার নির্বাচন করুন অথবা নতুন কাজ যুক্ত করুন।
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const statusInfo = getStatusBadge(job.status);

              return (
                <div
                  key={job.id}
                  className="glass p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all flex flex-col gap-3"
                >
                  {/* Left Color Accent Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${statusInfo.barClass}`} />

                  {/* Header Row: Client Name & Status Badge */}
                  <div className="flex justify-between items-center pl-2">
                    <h3 className="text-[16px] font-bold text-ink group-hover:text-brand transition-colors">
                      {job.client_name}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Job Title Description */}
                  <p className="pl-2 text-[14.5px] font-semibold text-slate-700 leading-snug">
                    {job.title}
                  </p>

                  {/* Meta Details Row */}
                  <div className="pl-2 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-2 items-center text-[12.5px]">
                      {/* Amount */}
                      {job.amount > 0 && (
                        <span className="flex items-center gap-1 bg-slate-100/90 text-slate-800 px-2.5 py-1 rounded-lg font-bold border border-slate-200/60">
                          ৳ {toBnDigits(job.amount)}
                        </span>
                      )}

                      {/* Deadline / Time */}
                      {job.deadline && (
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold ${
                            job.status === 'payment_due'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100/90 text-slate-700 border border-slate-200/60'
                          }`}
                        >
                          <Clock className="size-3.5" />
                          {job.deadline}
                        </span>
                      )}

                      {/* Source */}
                      {job.source && (
                        <span className="bg-slate-100/70 text-slate-500 px-2.5 py-1 rounded-lg font-medium border border-slate-200/50">
                          {job.source}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/work/jobs/${job.id}`}
                        className="text-[12.5px] font-bold text-brand hover:underline flex items-center gap-0.5"
                      >
                        বিস্তারিত <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Workload & Due Payments Sidebar Widgets (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Overdue Payment Alert Widget */}
          <div className="glass p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3.5 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30">
            <div className="flex justify-between items-center">
              <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <AlertTriangle className="size-4.5 text-amber-600" />
                বকেয়া পেমেন্ট অ্যালার্ট
              </h3>
              <span className="text-[11px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {toBnDigits(dueCount)}টি বাকি
              </span>
            </div>

            <div>
              <p className="text-[12px] text-muted">মোট পাওনা রাশি</p>
              <p className="text-[24px] font-black text-amber-700 leading-tight">
                ৳ {toBnDigits(dueTotalAmount > 0 ? dueTotalAmount : 18500)}
              </p>
            </div>

            <Link
              href="/work/payments"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              পেমেন্ট ফলো-আপ দেখুন
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          {/* Weekly Workload & Capacity Meter */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <Clock className="size-4 text-brand" />
                সাপ্তাহিক কাজের চাপ
              </h3>
              <span className="text-[12px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                ২০ / ২৫ ঘণ্টা
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
              <div className="bg-brand h-full rounded-full w-[80%]" />
            </div>

            <div className="flex justify-between items-center text-[12px] pt-1">
              <span className="text-muted">আর ৫ ঘণ্টা নেওয়া যাবে</span>
              <Link href="/work/capacity" className="font-bold text-brand hover:underline">
                ক্যাপাসিটি মিটার →
              </Link>
            </div>
          </div>

          {/* Proposal Library Quick Shortcut */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <FileText className="size-4 text-purple-600" />
              প্রস্তাব কাঠামো লাইব্রেরি
            </h3>
            <p className="text-[12.5px] text-muted leading-relaxed">
              ক্লায়েন্টকে পাঠানোর আগে কভার লেটার টেমপ্লেট যাচাই করে নিন।
            </p>
            <Link
              href="/work/proposals"
              className="block text-center py-2.5 rounded-xl border border-purple-600 text-purple-700 hover:bg-purple-50 font-bold text-[13px] transition-all"
            >
              প্রস্তাব লাইব্রেরি দেখুন
            </Link>
          </div>

        </div>

      </div>

      {/* Floating Action Button for Mobile */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-[90px] right-5 size-14 rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-transform lg:hidden"
      >
        <Plus className="size-7" />
      </button>

      {/* Add New Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-bn relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-[18px] font-bold text-ink">
                নতুন কাজ যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[13px] font-bold text-ink">
                  কাজের শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="যেমন: লোগো ডিজাইন প্যাকেজ"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[13px] font-bold text-ink">
                  ক্লায়েন্টের নাম
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="যেমন: Ahmed Traders"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-ink">
                    বাজেট / ফি (৳)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="১২০০০"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-ink">
                    বর্তমান অবস্থা
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-[14px] font-bold text-ink focus:outline-none focus:border-brand"
                  >
                    <option value="active">চলছে</option>
                    <option value="proposal">প্রস্তাব পাঠানো</option>
                    <option value="submitted">জমা দেওয়া</option>
                    <option value="payment_due">টাকা বকেয়া</option>
                    <option value="completed">শেষ</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-[13.5px]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-[13.5px] shadow-md shadow-brand/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
