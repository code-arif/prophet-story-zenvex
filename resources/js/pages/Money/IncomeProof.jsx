import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Landmark,
  Home,
  Globe,
  MoreHorizontal,
  Printer,
  ArrowLeft,
  Calendar,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 29 — Income Proof · আয়ের প্রমাণপত্র
 * Setup form (Range selector, Name field, Purpose selector, Client name toggle) + A4 Certificate Preview & Print.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function IncomeProof({
  personName = 'Md. Rubel Hossain',
  totalEarningsBdt = 635000,
  entries = [],
}) {
  const { t } = useI18n();

  const [phase, setPhase] = useState('setup'); // 'setup' | 'preview'
  const [selectedRange, setSelectedRange] = useState('12'); // '6' | '12' | 'all' | 'custom'
  const [nameInput, setNameInput] = useState(personName || 'Md. Rubel Hossain');
  const [selectedPurpose, setSelectedPurpose] = useState('bank'); // 'bank' | 'rent' | 'embassy' | 'other'
  const [showClientNames, setShowClientNames] = useState(true);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);

  const PURPOSE_OPTIONS = [
    { key: 'bank', label: 'ব্যাংক', icon: <Landmark className="size-4" /> },
    { key: 'rent', label: 'বাড়ি ভাড়া', icon: <Home className="size-4" /> },
    { key: 'embassy', label: 'দূতাবাস', icon: <Globe className="size-4" /> },
    { key: 'other', label: 'অন্য', icon: <MoreHorizontal className="size-4" /> },
  ];

  const getPurposeLabel = (key) => {
    const p = PURPOSE_OPTIONS.find((o) => o.key === key);
    return p ? p.label : 'ব্যাংক';
  };

  const getRangeLabel = (key) => {
    if (key === '6') return 'গত ৬ মাস';
    if (key === 'all') return 'সর্বমোট সময়কাল';
    if (key === 'custom') return `${customFrom || 'শুরু'} — ${customTo || 'শেষ'}`;
    return 'গত ১২ মাস';
  };

  const handleGenerate = () => {
    if (!nameInput.trim()) return;
    setPhase('preview');
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="আয়ের প্রমাণপত্র — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            আয়ের প্রমাণপত্র
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            ব্যাংক, বাড়ি ভাড়া বা ভিসার জন্য প্রাতিষ্ঠানিক আয়ের সনদ জেনারেটর
          </p>
        </div>

        {phase === 'preview' && (
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] inline-flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>সেটিংস পরিবর্তন করুন</span>
          </button>
        )}
      </div>

      {phase === 'setup' ? (
        /* SETUP FORM PHASE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Setup Glass Card (8 cols) */}
          <div className="lg:col-span-8">
            <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              
              {/* Range Selector */}
              <div className="space-y-2.5">
                <label className="block text-[14.5px] font-black text-ink">
                  সময়কাল
                </label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRange('6');
                      setShowCustomRangePicker(false);
                    }}
                    className={`flex-1 py-2.5 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                      selectedRange === '6'
                        ? 'bg-brand text-white shadow-2xs font-extrabold'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ৬ মাস
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRange('12');
                      setShowCustomRangePicker(false);
                    }}
                    className={`flex-1 py-2.5 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                      selectedRange === '12'
                        ? 'bg-brand text-white shadow-2xs font-extrabold'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ১২ মাস
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRange('all');
                      setShowCustomRangePicker(false);
                    }}
                    className={`flex-1 py-2.5 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                      selectedRange === 'all'
                        ? 'bg-brand text-white shadow-2xs font-extrabold'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    সব
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRange('custom');
                      setShowCustomRangePicker(!showCustomRangePicker);
                    }}
                    className="text-brand text-[12.5px] font-bold hover:underline cursor-pointer"
                  >
                    নিজে বেছে নিন
                  </button>
                </div>

                {showCustomRangePicker && (
                  <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[11.5px] font-bold text-slate-500 block mb-1">হতে</span>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-[13px] font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11.5px] font-bold text-slate-500 block mb-1">পর্যন্ত</span>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-[13px] font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-[14.5px] font-black text-ink">
                  যে নামে দেবেন
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন..."
                  className="w-full bg-blue-50/60 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-bold text-ink focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                />
              </div>

              {/* Purpose Selector (Grid 2x2) */}
              <div className="space-y-2.5">
                <label className="block text-[14.5px] font-black text-ink">
                  উদ্দেশ্য
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PURPOSE_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedPurpose(option.key)}
                      className={`py-3 rounded-full text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedPurpose === option.key
                          ? 'bg-brand text-white shadow-2xs font-extrabold'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Name Toggle */}
              <div className="flex items-start justify-between pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[14.5px] font-black text-ink">
                    ক্লায়েন্টের নাম দেখাবেন?
                  </label>
                  <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                    বন্ধ রাখলে শুধু ক্রমিক নম্বর দেখাবে
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={showClientNames}
                    onChange={(e) => setShowClientNames(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                </label>
              </div>

              {/* Submit Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!nameInput.trim()}
                className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-[15px] py-4 rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-2 block text-center"
              >
                প্রমাণপত্র তৈরি করুন
              </button>

            </div>
          </div>

          {/* Right Sidebar: Instructions (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="glass p-5 rounded-2xl border border-sky-200/80 shadow-sm space-y-3 bg-gradient-to-br from-sky-50/50 to-white">
              <h3 className="text-[15px] font-extrabold text-sky-950 flex items-center gap-2">
                <FileCheck className="size-5 text-sky-600" />
                সান্নিধ্য প্রমাণপত্র সহায়িকা
              </h3>
              <p className="text-[12.5px] text-sky-900 leading-relaxed font-medium">
                এই জেনারেটরটি আপনার এন্ট্রি করা আয়ের খাতা থেকে সরাসরি অফিসিয়াল A4 ফরম্যাটের আয়ের সনদ তৈরি করে দেয়, যা যেকোনো ব্যাংক বা দূতাবাসে জমা দেওয়া সম্ভব।
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* PRINTABLE A4 PREVIEW PHASE */
        <div className="space-y-6 max-w-3xl mx-auto">
          
          {/* Action Bar Above Preview */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[14px] font-extrabold text-ink">
              সনদটি প্রিন্ট বা PDF হিসেবে সেভ করার জন্য প্রস্তুত
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-[13px] text-slate-700 cursor-pointer"
              >
                সম্পাদনা করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[13px] flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="size-4" />
                <span>প্রিন্ট / PDF ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Official A4 Certificate Preview Document */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-xl space-y-8 font-bn print:border-none print:shadow-none print:p-0">
            
            {/* Header */}
            <div className="text-center border-b-2 border-brand/40 pb-6 space-y-1">
              <h2 className="text-[26px] font-black text-brand tracking-tight">
                আয়ের সনদপত্র · INCOME PROOF CERTIFICATE
              </h2>
              <p className="text-[13px] font-bold text-slate-500">
                ইজি রাইজ (Easy Rise) আইটিইএস ও ফ্রিল্যান্সিং আয় ট্র্যাকার
              </p>
              <p className="text-[11.5px] font-semibold text-slate-400">
                সনদ নম্বর: ER-INC-{toBnDigits(Date.now().toString().slice(-6))}
              </p>
            </div>

            {/* Applicant Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-[14px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">আবেদনকারীর নাম: </span>
                  <span className="font-extrabold text-ink">{nameInput}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">সনদের উদ্দেশ্য: </span>
                  <span className="font-extrabold text-brand">{getPurposeLabel(selectedPurpose)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">প্রযোজ্য সময়কাল: </span>
                  <span className="font-bold text-ink">{getRangeLabel(selectedRange)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">সর্বমোট প্রাপ্তি: </span>
                  <span className="font-black text-emerald-700">৳ {toBnDigits(totalEarningsBdt.toLocaleString())}</span>
                </div>
              </div>
            </div>

            {/* Income Entries Table */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-extrabold text-ink">
                আয়ের বিবরণী (Income Ledger Statement):
              </h3>

              <div className="w-full text-[13px] border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                <div className="grid grid-cols-12 bg-slate-100 p-3 font-extrabold text-slate-700">
                  <div className="col-span-1 text-center">ক্রমিক</div>
                  <div className="col-span-3">তারিখ</div>
                  <div className="col-span-4">{showClientNames ? 'ক্লায়েন্ট / উৎস' : 'উৎস কোড'}</div>
                  <div className="col-span-2">চ্যানেল</div>
                  <div className="col-span-2 text-right">পরিমাণ (BDT)</div>
                </div>

                {entries && entries.length > 0 ? (
                  entries.map((entry, idx) => (
                    <div key={entry.id || idx} className="grid grid-cols-12 p-3 items-center font-medium">
                      <div className="col-span-1 text-center font-bold text-slate-500">
                        {toBnDigits(idx + 1)}
                      </div>
                      <div className="col-span-3 text-slate-700">
                        {toBnDigits(entry.date)}
                      </div>
                      <div className="col-span-4 font-bold text-ink truncate">
                        {showClientNames ? entry.client_name : `CL-${toBnDigits(100 + idx)}`}
                      </div>
                      <div className="col-span-2 text-slate-600 text-[12px]">
                        {entry.channel}
                      </div>
                      <div className="col-span-2 text-right font-black text-ink">
                        ৳ {toBnDigits(entry.amount_bdt.toLocaleString())}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 font-bold">
                    কোনো আয়ের রেকর্ড পাওয়া যায়নি।
                  </div>
                )}
              </div>
            </div>

            {/* Declaration & Signature Block */}
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
                প্রত্যয়ন করা যাচ্ছে যে, উপরোক্ত তথ্যাবলী আবেদনকারীর ইজি রাইজ ডিজিটাল খাতার রেকর্ড অনুযায়ী সত্য ও সঠিক।
              </p>

              <div className="flex justify-between items-end pt-8 text-[13px] font-bold text-slate-700">
                <div className="space-y-1">
                  <div className="border-b border-slate-400 w-48 mb-1"></div>
                  <p>আবেদনকারীর স্বাক্ষর</p>
                  <p className="text-[11px] text-slate-400 font-normal">তারিখ: {toBnDigits(new Date().toLocaleDateString('bn-BD'))}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="border-b border-slate-400 w-48 mb-1 ml-auto"></div>
                  <p className="font-extrabold text-brand">ইজি রাইজ (Easy Rise) সিস্টেম</p>
                  <p className="text-[11px] text-slate-400 font-normal">ডিজিটাল ভেরিফায়েড রিপোর্ট</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
