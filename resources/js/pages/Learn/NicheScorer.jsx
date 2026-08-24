import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Info,
  Minus,
  Plus,
  BarChart2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 08 — Niche Scorer · নিশ ফিট স্কোরার
 * Evaluates niche viability using real marketplace numbers.
 * Responsive 2-column grid layout on desktop, stacked on mobile.
 */
export default function NicheScorer({ niches = [] }) {
  const { t } = useI18n();

  // Niche Form State
  const [nicheName, setNicheName] = useState('ইউটিউব থাম্বনেইল ডিজাইন');
  const [profilesCount, setProfilesCount] = useState(320);
  const [jobs7Days, setJobs7Days] = useState(18);
  const [minRate, setMinRate] = useState(600);
  const [maxRate, setMaxRate] = useState(4500);
  const [skillRating, setSkillRating] = useState(4);

  // Saved Niches State with fallback
  const initialNiches = niches.length > 0
    ? niches.map(n => ({ name: n.name, score: n.score, band: n.score >= 75 ? 'উচ্চ সম্ভাবনা' : n.score >= 55 ? 'মাঝারি' : 'উচ্চ প্রতিযোগিতা' }))
    : [
        { name: 'ইউটিউব থাম্বনেইল ডিজাইন', score: 78, band: 'উচ্চ সম্ভাবনা' },
        { name: 'লোগো ডিজাইন', score: 65, band: 'মাঝারি' },
        { name: 'ওয়েবসাইট ডিজাইন', score: 52, band: 'উচ্চ প্রতিযোগিতা' },
      ];

  const [savedNiches, setSavedNiches] = useState(initialNiches);

  // Dynamic Score Calculation
  const calculateScore = () => {
    const demandRatio = profilesCount > 0 ? (jobs7Days / profilesCount) * 100 : 0;
    const demandScore = Math.min(40, Math.round(demandRatio * 4));
    const avgRate = (Number(minRate) + Number(maxRate)) / 2;
    const rateScore = Math.min(30, Math.round((avgRate / 2500) * 30));
    const skillScore = (skillRating / 5) * 30;

    return Math.min(100, Math.max(15, Math.round(demandScore + rateScore + skillScore)));
  };

  const currentScore = calculateScore();

  // Score Classification
  const getScoreBand = (s) => {
    if (s >= 75) return { text: 'উচ্চ সম্ভাবনাযুক্ত নিশ', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (s >= 55) return { text: 'মাঝারি সম্ভাবনাময় নিশ', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { text: 'উচ্চ প্রতিযোগিতা / ঝুঁকি', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
  };

  const scoreBand = getScoreBand(currentScore);

  const handleSaveNiche = () => {
    if (!nicheName.trim()) return;
    
    // Save to DB via Inertia POST
    router.post('/learn/niche', {
      name: nicheName,
      rate_min: minRate,
      rate_max: maxRate,
      score: currentScore,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        const newNiche = {
          name: nicheName,
          score: currentScore,
          band: scoreBand.text,
        };
        setSavedNiches((prev) => [newNiche, ...prev.filter((n) => n.name !== nicheName)]);
      },
      onError: () => {
        const newNiche = {
          name: nicheName,
          score: currentScore,
          band: scoreBand.text,
        };
        setSavedNiches((prev) => [newNiche, ...prev.filter((n) => n.name !== nicheName)]);
      }
    });
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto">
      <Head title="নিশ ফিট স্কোরার — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            {t('নিশ ফিট স্কোরার')}
          </h1>
          <p className="text-[14px] text-muted font-medium">
            বাস্তব সংখ্যা দিয়ে নিশের লাভজনকতা যাচাই করুন
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-brand/10 text-brand px-3.5 py-1.5 rounded-full text-[13px] font-bold">
          <BarChart2 className="size-4" />
          সংখ্যাভিত্তিক গাণিতিক স্কোর
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Inputs (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Instruction Card */}
          <div className="glass p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 bg-gradient-to-r from-sky-50/60 to-white">
            <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-slate-700 font-medium">
              মার্কেটপ্লেসে নিজে খুঁজে সংখ্যাগুলো গুনে নিন — অনুমান বা ধারণার ওপর নির্ভর করবেন না।
            </p>
          </div>

          {/* Form Card */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            {/* Niche Name Input */}
            <div className="space-y-2">
              <label className="block text-[13.5px] font-bold text-ink">
                নিশের নাম
              </label>
              <input
                type="text"
                value={nicheName}
                onChange={(e) => setNicheName(e.target.value)}
                placeholder="যেমন: ইউটিউব থাম্বনেইল ডিজাইন"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-[15px] font-bold text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="h-px bg-slate-100" />

            {/* Stepper Inputs */}
            <div className="space-y-4">
              {/* Row 1: Profiles count */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-ink">
                  কতগুলো প্রোফাইল পেলেন
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setProfilesCount((p) => Math.max(0, p - 10))}
                    className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    value={profilesCount}
                    onChange={(e) => setProfilesCount(Number(e.target.value))}
                    className="w-14 text-center font-bold text-[15px] bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setProfilesCount((p) => p + 10)}
                    className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: 7 days jobs count */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-ink">
                  গত ৭ দিনে কতগুলো কাজ পোস্ট হয়েছে
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setJobs7Days((j) => Math.max(0, j - 1))}
                    className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    value={jobs7Days}
                    onChange={(e) => setJobs7Days(Number(e.target.value))}
                    className="w-14 text-center font-bold text-[15px] bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setJobs7Days((j) => j + 1)}
                    className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              {/* Row 3: Min Rate */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-ink">
                  দেখা সর্বনিম্ন দর
                </span>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-300">
                  <span className="font-bold text-brand text-[15px]">
                    ৳{' '}
                    <input
                      type="number"
                      step="50"
                      value={minRate}
                      onChange={(e) => setMinRate(Number(e.target.value))}
                      className="w-20 bg-transparent text-right outline-none font-bold"
                    />
                  </span>
                </div>
              </div>

              {/* Row 4: Max Rate */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-ink">
                  দেখা সর্বোচ্চ দর
                </span>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-300">
                  <span className="font-bold text-brand text-[15px]">
                    ৳{' '}
                    <input
                      type="number"
                      step="100"
                      value={maxRate}
                      onChange={(e) => setMaxRate(Number(e.target.value))}
                      className="w-20 bg-transparent text-right outline-none font-bold"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Skill Rating 1-5 */}
            <div className="space-y-2.5">
              <label className="block text-[14px] font-semibold text-ink">
                এই কাজে আপনার বর্তমান দক্ষতা (১-৫)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSkillRating(lvl)}
                    className={`h-11 rounded-xl font-extrabold text-[15px] transition-all active:scale-95 border ${
                      skillRating === lvl
                        ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toBnDigits(lvl)}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveNiche}
              className="w-full h-12 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-[15px] transition-all active:scale-[0.98] shadow-md shadow-brand/20 flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="size-4" />
              স্কোর সংরক্ষণ করুন
            </button>
          </div>

        </div>

        {/* Right Column: Score Results & Saved Niches (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Score Result Gauge Card */}
          <div className="glass p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <h3 className="text-[14px] font-bold text-muted uppercase tracking-wider">
              নিশ ফিট স্কোর ফলাফল
            </h3>

            {/* Large Score Ring */}
            <div className="relative size-32 flex items-center justify-center my-2">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="fill-none stroke-slate-200 stroke-[8]"
                  cx="50"
                  cy="50"
                  r="42"
                />
                <circle
                  className="fill-none stroke-brand stroke-[8] stroke-linecap-round transition-all duration-700"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * (currentScore / 100))}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[34px] font-black text-brand leading-none">
                  {toBnDigits(currentScore)}
                </span>
                <span className="text-[12px] font-bold text-muted mt-0.5">/ ১০০</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-full border text-[13px] font-bold ${scoreBand.bg} ${scoreBand.color}`}>
              {scoreBand.text}
            </div>

            <p className="text-[12.5px] text-slate-600 leading-relaxed px-2">
              গত ৭ দিনে {toBnDigits(jobs7Days)}টি জবের বিপরীতে {toBnDigits(profilesCount)}টি প্রোফাইল থাকায় এই নিশের চাহিদা-ভারসাম্য যথেষ্ট ভালো।
            </p>
          </div>

          {/* Saved Niches List */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-[15px] font-bold text-ink">
              সংরক্ষিত নিচ তালিকা
            </h3>

            <div className="space-y-2.5">
              {savedNiches.map((niche, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-ink truncate">
                      {niche.name}
                    </h4>
                    <p className="text-[11.5px] text-muted truncate mt-0.5">
                      {niche.band}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-[13px] font-extrabold shrink-0">
                    {toBnDigits(niche.score)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
