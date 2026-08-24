import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Target,
  Route,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 12 — 90-Day Plan · আমার ৯০ দিনের পরিকল্পনা
 * Dual Mode: Form Setup OR Plan Details View (Niches list + 12-Week Interactive Timeline).
 * Responsive 2-column desktop layout using max-w-5xl width.
 */
export default function Plan90Days({ items = [] }) {
  const { t } = useI18n();

  // Active plan saved in database
  const activePlan = items && items.length > 0 ? items[0] : null;

  // View state: 'details' if active plan exists, else 'setup'
  const [viewMode, setViewMode] = useState(activePlan ? 'details' : 'setup');

  // Form State
  const [skills, setSkills] = useState(['গ্রাফিক ডিজাইন', 'থাম্বনেইল', 'ব্যানার']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [hours, setHours] = useState(25);
  const [experience, setExperience] = useState('none');
  const [englishLevel, setEnglishLevel] = useState(2);
  const [incomeGoalDays, setIncomeGoalDays] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Details View State
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({ task1: false, task2: true });

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills((prev) => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmitPlan = (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    router.post(
      '/learn/plan',
      {
        skills,
        hours,
        experience,
        english_level: englishLevel,
        income_goal_days: incomeGoalDays,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          setViewMode('details');
        },
        onError: () => {
          setIsSubmitting(false);
          setViewMode('details');
        },
      }
    );
  };

  // 12 Weeks Dynamic Timeline Roadmap Data
  const twelveWeeksRoadmap = [
    { week: 1, title: 'সপ্তাহ ১: প্রস্তুতি', desc: 'বেসিক পোর্টফোলিও সেটআপ', status: 'done' },
    { week: 2, title: 'সপ্তাহ ২: প্রোফাইল অপটিমাইজেশন', desc: 'আপওয়ার্ক প্রোফাইল ১০০% সম্পূর্ণ করা', status: 'done' },
    { week: 3, title: 'সপ্তাহ ৩: প্রথম বিডিং', desc: 'কভার লেটার টেমপ্লেট তৈরি', status: 'done' },
    {
      week: 4,
      title: 'সপ্তাহ ৪: ক্লায়েন্ট রিচআউট',
      desc: 'চলমান বিডিং ও মেসেজিং কার্যক্রম',
      status: 'active',
      tasks: [
        { id: 'task1', text: 'প্রতিদিন ৫টি জব প্রপোজাল পাঠান', progress: '৩/৫' },
        { id: 'task2', text: 'লিংকডইনে ২ জন সম্ভাব্য ক্লায়েন্টকে মেসেজ দিন', progress: '১/২' },
      ],
    },
    { week: 5, title: 'সপ্তাহ ৫: প্রথম সাক্ষাৎকার', desc: 'ক্লায়েন্ট ইন্টারভিউ ও প্রশ্নের উত্তর প্রদান', status: 'pending' },
    { week: 6, title: 'সপ্তাহ ৬: প্রজেক্ট ডেলিভারি', desc: 'সময়মতো নিখুঁত প্রথম প্রজেক্ট জমা প্রদান', status: 'pending' },
    { week: 7, title: 'সপ্তাহ ৭: রিভিউ সংগ্রহ', desc: 'ক্লায়েন্টের ৫-স্টার রিভিউ নিশ্চিতকরণ', status: 'pending' },
    { week: 8, title: 'সপ্তাহ ৮: স্কিল উন্নয়ন', desc: 'অ্যাডভান্সড ডিজাইন টেকনিক অনুশীলন', status: 'pending' },
    { week: 9, title: 'সপ্তাহ ৯: রেট বৃদ্ধি', desc: 'কাজের রেট ২০% বৃদ্ধি করে বিড শুরু', status: 'pending' },
    { week: 10, title: 'সপ্তাহ ১০: দীর্ঘমেয়াদী ক্লায়েন্ট', desc: 'মাসিক রিটেইনার চুক্তির প্রস্তাব পাঠাল', status: 'pending' },
    { week: 11, title: 'সপ্তাহ ১১: ব্যক্তিগত ব্র্যান্ডিং', desc: 'সোশ্যাল মিডিয়ায় কাজ শেয়ার করা', status: 'pending' },
    { week: 12, title: 'সপ্তাহ ১২: ৯০ দিনের লক্ষ্য অর্জন', desc: 'প্রথম স্থায়ী ক্লায়েন্ট ও আয়ের লক্ষ্য অর্জন', status: 'pending' },
  ];

  const visibleWeeks = showAllWeeks ? twelveWeeksRoadmap : twelveWeeksRoadmap.slice(0, 4);

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="আমার ৯০ দিনের পরিকল্পনা — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            আমার ৯০ দিনের পরিকল্পনা
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            আপনার সুবিধা ও লক্ষ্য অনুযায়ী সুবিন্যস্ত ১২ সপ্তাহের ফ্রিল্যান্সিং গাইড
          </p>
        </div>
      </div>

      {/* Conditional Rendering: Details View vs Setup Form */}
      {viewMode === 'details' ? (
        /* Plan Details View (HTML Template Match) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Details Cards (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Header Status Card */}
            <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  আমার ৯০ দিনের পরিকল্পনা
                </p>
                <h2 className="text-[20px] font-bold text-ink mt-1">
                  তৈরি হয়েছে {activePlan?.created_at ? new Date(activePlan.created_at).toLocaleDateString('bn-BD') : '১২ জুন'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('setup')}
                className="h-11 px-4 rounded-xl border border-brand text-brand hover:bg-brand/5 font-bold text-[13.5px] flex items-center gap-2 transition-all active:scale-95 shrink-0"
              >
                <RefreshCw className="size-4" />
                নতুন করে তৈরি করুন
              </button>
            </div>

            {/* Section 1: Possible Niches Card */}
            <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[17px] font-bold text-ink flex items-center gap-2">
                <Target className="size-5 text-purple-600" />
                সম্ভাব্য নিশ
              </h3>

              <div className="space-y-3">
                {/* Niche 1 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="size-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-[15px] shrink-0">
                    ১
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-ink">
                      ইউটিউব থাম্বনেইল ডিজাইন
                    </h4>
                    <p className="text-[13px] text-slate-600 font-medium mt-1 leading-snug">
                      চাহিদা বাড়ছে, আপনার গ্রাফিক্স অভিজ্ঞতার সাথে দারুণভাবে মিলে যায়।
                    </p>
                  </div>
                </div>

                {/* Niche 2 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="size-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-[15px] shrink-0">
                    ২
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-ink">
                      সোশ্যাল মিডিয়া ম্যানেজমেন্ট
                    </h4>
                    <p className="text-[13px] text-slate-600 font-medium mt-1 leading-snug">
                      দীর্ঘমেয়াদী ক্লায়েন্ট পাওয়ার সম্ভাবনা বেশি, শিখতে সহজ।
                    </p>
                  </div>
                </div>

                {/* Niche 3 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="size-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-[15px] shrink-0">
                    ৩
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-ink">
                      ভার্চুয়াল অ্যাসিস্ট্যান্ট (ডেটা এন্ট্রি)
                    </h4>
                    <p className="text-[13px] text-slate-600 font-medium mt-1 leading-snug">
                      প্রাথমিক কাজ শুরু করার জন্য উপযুক্ত, তবে প্রতিযোগিতা বেশি।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: 12 Weeks Path Card */}
            <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-[17px] font-bold text-ink flex items-center gap-2">
                <Route className="size-5 text-brand" />
                ১২ সপ্তাহের পথ
              </h3>

              {/* Vertical Timeline Wrapper */}
              <div className="relative pl-3 space-y-4">
                {/* Vertical Line */}
                <div className="absolute left-[21px] top-4 bottom-6 w-[2px] bg-slate-200 rounded-full" />

                {visibleWeeks.map((wItem) => {
                  if (wItem.status === 'done') {
                    return (
                      <div key={wItem.week} className="relative flex items-start gap-4 opacity-75">
                        <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 z-10 shadow-xs">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14.5px] font-bold text-ink">
                            {wItem.title}
                          </h4>
                          <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
                            {wItem.desc}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (wItem.status === 'active') {
                    return (
                      <div key={wItem.week} className="relative flex items-start gap-4">
                        <div className="size-6 rounded-full bg-white border-4 border-brand flex items-center justify-center shrink-0 mt-1 z-10 shadow-sm">
                          <div className="size-2 rounded-full bg-brand" />
                        </div>

                        <div className="flex-1 bg-brand/5 rounded-xl p-4 border border-brand/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[15px] font-bold text-brand flex items-center gap-2">
                              {wItem.title}
                            </h4>
                            <span className="px-2.5 py-0.5 bg-brand/10 text-brand font-bold text-[11px] rounded-full">
                              চলমান
                            </span>
                          </div>

                          {/* Task List Within Active Node */}
                          <div className="space-y-2">
                            {wItem.tasks?.map((tsk) => (
                              <label
                                key={tsk.id}
                                className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={!!checkedTasks[tsk.id]}
                                  onChange={() =>
                                    setCheckedTasks((prev) => ({
                                      ...prev,
                                      [tsk.id]: !prev[tsk.id],
                                    }))
                                  }
                                  className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
                                />
                                <span
                                  className={`text-[13px] font-medium flex-1 ${
                                    checkedTasks[tsk.id] ? 'line-through text-slate-400' : 'text-ink'
                                  }`}
                                >
                                  {tsk.text}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {tsk.progress}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={wItem.week} className="relative flex items-start gap-4 opacity-50">
                      <div className="size-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 z-10">
                        <div className="size-1.5 rounded-full bg-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-bold text-ink">
                          {wItem.title}
                        </h4>
                        <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
                          {wItem.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Collapse / Expand Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAllWeeks(!showAllWeeks)}
                  className="w-full pt-2 flex items-center justify-center gap-1.5 text-[13.5px] font-bold text-brand hover:text-brand-dark transition-colors"
                >
                  <span>{showAllWeeks ? 'সংক্ষিপ্ত ভিউ দেখুন' : 'বাকি সপ্তাহগুলো দেখুন (৫-১২)'}</span>
                  {showAllWeeks ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: AI Assistant Quick Card (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="glass p-5 rounded-2xl border border-violet-100 shadow-sm space-y-4 bg-gradient-to-br from-violet-600 to-purple-800 text-white">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Sparkles className="size-5" />
              </div>

              <div>
                <h3 className="text-[17px] font-bold text-white">
                  চলমান সপ্তাহের জন্য AI গাইড
                </h3>
                <p className="text-[12.5px] text-violet-100 mt-1 leading-relaxed">
                  সপ্তাহ ৪ এর লক্ষ্য অর্জনে AI সহকারীর সাহায্য নিয়ে দ্রুত প্রপোজাল তৈরি করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.get('/assistant')}
                className="w-full py-3 px-4 rounded-xl bg-white text-violet-700 font-bold text-[14px] hover:bg-violet-50 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="size-4 text-violet-700" />
                সহায়কের সাথে কথা বলুন
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Setup Form Mode (HTML Template 1 Match) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="glass rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden space-y-6">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-700" />

              <div className="flex items-start gap-3 pl-2">
                <div className="mt-1 size-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Target className="size-4" />
                </div>
                <h2 className="text-[18px] font-bold text-ink leading-snug">
                  একবার তৈরি হবে, তারপর আপনার ডিভাইসে থেকে যাবে
                </h2>
              </div>

              <form onSubmit={handleSubmitPlan} className="space-y-6 pl-2">
                
                {/* Skills Chips */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    কী কী কাজ পারেন
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[14px] font-bold text-ink flex items-center gap-1.5 shadow-2xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <X className="size-3.5 stroke-[2.5]" />
                        </button>
                      </span>
                    ))}

                    {showAddSkillInput ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          placeholder="স্কিল লিখুন..."
                          className="px-3 py-1 bg-white border border-purple-600 rounded-full text-[13.5px] font-bold text-ink focus:outline-none w-32"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-2.5 py-1 bg-purple-600 text-white rounded-full text-[12px] font-bold"
                        >
                          যোগ
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddSkillInput(true)}
                        className="px-3.5 py-1.5 bg-transparent border border-dashed border-purple-400 rounded-full text-[13.5px] font-bold text-purple-700 flex items-center gap-1 hover:bg-purple-50 transition-colors active:scale-95"
                      >
                        <Plus className="size-4" /> যোগ করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* Weekly Hours Stepper */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    সপ্তাহে কত ঘণ্টা সময় দেবেন
                  </label>

                  <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-2 w-max shadow-sm">
                    <button
                      type="button"
                      onClick={() => setHours((h) => Math.max(5, h - 5))}
                      className="size-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-ink active:scale-95 transition-all"
                    >
                      <Minus className="size-5" />
                    </button>

                    <span className="text-[20px] font-black w-12 text-center text-purple-700">
                      {toBnDigits(hours)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setHours((h) => Math.min(80, h + 5))}
                      className="size-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center active:scale-95 transition-all shadow-md shadow-purple-600/20"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    আগের অভিজ্ঞতা
                  </label>

                  <div className="flex gap-2.5 w-full">
                    {[
                      { id: 'none', label: 'একদম নেই' },
                      { id: 'some', label: 'কিছু আছে' },
                      { id: 'lots', label: 'অনেক আছে' },
                    ].map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setExperience(exp.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all active:scale-95 ${
                          experience === exp.id
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* English Comfort Rating Scale */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                      ইংরেজিতে স্বাচ্ছন্দ্য (১ - ৫)
                    </label>
                    <span className="text-[13px] font-bold text-purple-700">
                      স্কোর: {toBnDigits(englishLevel)} / ৫
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEnglishLevel(lvl)}
                        className={`size-8 rounded-full font-bold text-[13px] transition-all flex items-center justify-center active:scale-95 ${
                          englishLevel === lvl
                            ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 shadow-sm'
                            : lvl < englishLevel
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {toBnDigits(lvl)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Income Goal Horizon */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    প্রথম আয় কত দিনের মধ্যে দরকার
                  </label>

                  <div className="flex gap-2.5 w-full">
                    {[30, 60, 90].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setIncomeGoalDays(days)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all active:scale-95 ${
                          incomeGoalDays === days
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {toBnDigits(days)} দিন
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[12px] text-slate-500 text-center mb-2">
                    একবার তৈরি হয়; নতুন করে বানাতে চাইলে যেকোনো সময় পরিবর্তন করা যাবে
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[52px] bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-[16px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-700/25 active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    <Sparkles className="size-5" />
                    {isSubmitting ? 'পরিকল্পনা তৈরি হচ্ছে...' : 'পরিকল্পনা তৈরি করুন'}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
