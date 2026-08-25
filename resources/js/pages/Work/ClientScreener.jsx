import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Info,
  ChevronLeft,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 21 — Client Screener · ক্লায়েন্ট ঝুঁকি স্ক্রিনার
 * 12-question interactive risk assessment tool with real-time scoring, verdict band & rule triggers.
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function ClientScreener({
  questions = [],
  verdictBands = [],
  rules = [],
}) {
  const { t } = useI18n();

  // Fallback 12 risk assessment questions matching UI spec
  const defaultQuestions = [
    {
      id: 'q1',
      questionBn: 'চুক্তি হওয়ার আগেই কি প্ল্যাটফর্মের বাইরে যেতে বলছেন?',
      subtext: 'এটি একটি সাধারণ অন-হ্যান্ড প্রতারণার কৌশল হতে পারে।',
      type: 'yes_no',
      weight: 3,
    },
    {
      id: 'q2',
      questionBn: 'ক্লায়েন্টের পেমেন্ট পদ্ধতি কি যাচাইকৃত (Verified)?',
      subtext: 'পেমেন্ট মেথড ভেরিফাইড না থাকলে বকেয়া পাওয়ার ঝুঁকি বাড়ে।',
      type: 'yes_no',
      weight: 2,
    },
    {
      id: 'q3',
      questionBn: 'প্রজেক্টের স্কোপ কি স্পষ্টভাবে সংজ্ঞায়িত করা আছে?',
      subtext: 'অস্পষ্ট স্কোপ পরবর্তীতে অনাকাঙ্ক্ষিত বাড়তি কাজ ডেকে আনে।',
      type: 'yes_no',
      weight: 2,
    },
    {
      id: 'q4',
      questionBn: 'ক্লায়েন্ট কি আগে থেকে বিনামূল্যে কাজ বা টেস্ট ডেমো চাইছেন?',
      subtext: 'বিনামূল্যে স্পেক ওয়ার্ক চাওয়া মার্কেটপ্লেস নীতির পরিপন্থী।',
      type: 'yes_no',
      weight: 3,
    },
    {
      id: 'q5',
      questionBn: 'ক্লায়েন্টের কি পূর্ববর্তী অন্য ফ্রিল্যান্সারদের ভালো রিভিউ আছে?',
      subtext: 'কমপক্ষে ৩টি ইতিবাচক রিভিউ থাকলে পেমেন্টের নিশ্চয়তা বাড়ে।',
      type: 'yes_no',
      weight: 2,
    },
    {
      id: 'q6',
      questionBn: 'বাজেট এবং কাজের পরিমাণ কি সামঞ্জস্যপূর্ণ?',
      subtext: 'বাজারের হারের চেয়ে অনেক কম দাম কাজের অবমূল্যায়ন করে।',
      type: 'yes_no',
      weight: 1,
    },
    {
      id: 'q7',
      questionBn: 'সময়সীমা কি কাজ শেষ করার জন্য বাস্তবসম্মত?',
      subtext: 'অপ্রয়োজনে অতিরিক্ত তাড়া ভুল বোঝাবুঝি সৃষ্টি করে।',
      type: 'yes_no',
      weight: 1,
    },
    {
      id: 'q8',
      questionBn: 'ক্লায়েন্টের যোগাযোগের ভাষা কি পেশাদার এবং স্পষ্ট?',
      subtext: 'শ্রদ্ধাশীল যোগাযোগ সফল প্রজেক্টের পূর্বশর্ত।',
      type: 'yes_no',
      weight: 1,
    },
    {
      id: 'q9',
      questionBn: 'কাজের আগেই কি মাইলস্টোন ক্রিয়েট / ডিপোজিট করা হয়েছে?',
      subtext: 'এসক্রো ফান্ড থাকলে পেমেন্ট সম্পূর্ণ সুরক্ষিত থাকে।',
      type: 'yes_no',
      weight: 2,
    },
    {
      id: 'q10',
      questionBn: 'ক্লায়েন্ট কি দীর্ঘমেয়াদী কাজের সুযোগের আশ্বাস দিচ্ছেন?',
      subtext: 'ভবিষ্যতের আশ্বাসে বর্তমান কাজের দাম কমানো অনুচিত।',
      type: 'yes_no',
      weight: 1,
    },
    {
      id: 'q11',
      questionBn: 'ক্লায়েন্ট কি আগে বাংলাদেশ থেকে ফ্রিল্যান্সারদের সাথে কাজ করেছেন?',
      subtext: 'অভিজ্ঞ ক্লায়েন্টদের সাথে টাইমজোন মিলানো সহজ হয়।',
      type: 'yes_no',
      weight: 1,
    },
    {
      id: 'q12',
      questionBn: 'আপনি কি এই ক্লায়েন্টের সাথে কাজ করতে স্বাচ্ছন্দ্য বোধ করছেন?',
      subtext: 'আপনার ভেতরের অনুভূতির ওপর আস্থা রাখুন।',
      type: 'yes_no',
      weight: 1,
    },
  ];

  const questionList = questions && questions.length > 0
    ? questions.map((q, idx) => ({
        id: q.id || `q${idx + 1}`,
        questionBn: q.questionBn || q.question || defaultQuestions[idx]?.questionBn,
        subtext: defaultQuestions[idx]?.subtext || 'এটি একটি সাধারণ ঝুঁকি মূল্যায়ন প্রশ্ন।',
        type: 'yes_no',
        weight: q.weight || 2,
      }))
    : defaultQuestions;

  // Active question index state (0 to 11)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { q1: 'yes', q2: 'no', ... }
  const [showResult, setShowResult] = useState(false);

  const currentQ = questionList[currentIndex] || questionList[0];
  const totalQuestions = questionList.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Score Calculation
  const calculateScore = () => {
    let riskScore = 0;
    Object.keys(answers).forEach((qId) => {
      const ans = answers[qId];
      // Questions where 'yes' increases risk (q1, q4) vs questions where 'no' increases risk
      if (qId === 'q1' || qId === 'q4') {
        if (ans === 'yes') riskScore += 3;
      } else {
        if (ans === 'no') riskScore += 2;
      }
    });
    return riskScore;
  };

  const currentRiskScore = calculateScore();

  // Answer Handlers
  const handleSelectAnswer = (value) => {
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(updatedAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSkip = () => {
    const updatedAnswers = { ...answers, [currentQ.id]: 'skipped' };
    setAnswers(updatedAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowResult(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  };

  // Verdict band interpretation
  const getVerdict = () => {
    if (currentRiskScore >= 6) {
      return {
        label: 'উচ্চ ঝুঁকি (High Risk)',
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        badge: 'বিপদজনক',
        icon: <ShieldAlert className="size-6 text-rose-600" />,
        advice: 'এই প্রজেক্টে পেমেন্ট হারানো বা অনাকাঙ্ক্ষিত প্রতারণার উচ্চ ঝুঁকি রয়েছে। অফারের আগে ডিপোজিট দাবি করুন অথবা সরাসরি এড়িয়ে যান।',
      };
    } else if (currentRiskScore >= 3) {
      return {
        label: 'মাঝারি সতর্ক (Medium Caution)',
        color: 'bg-amber-100 text-amber-900 border-amber-200',
        badge: 'সতর্কতা প্রয়োজন',
        icon: <AlertTriangle className="size-6 text-amber-600" />,
        advice: 'কাজে এগোনোর আগে পেমেন্ট মেথড ভেরিফাই করুন এবং চুক্তিপত্রের প্রতিটি শর্ত ও মাইলস্টোন স্পষ্টভাবে লিখিত রাখুন।',
      };
    }
    return {
      label: 'কম ঝুঁকি (Low Risk)',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      badge: 'নিরাপদ প্রজেক্ট',
      icon: <ShieldCheck className="size-6 text-emerald-600" />,
      advice: 'ক্লায়েন্ট প্রোফাইল ও শর্তাবলী অত্যন্ত নিরাপদ। নিশ্চিন্তে আত্মবিশ্বাসের সাথে প্রজেক্টের কাজ শুরু করুন।',
    };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="ক্লায়েন্ট ঝুঁকি স্ক্রিনার — ইজি রাইজ" />

      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            ক্লায়েন্ট ঝুঁকি স্ক্রিনার
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            ক্লায়েন্ট ঝুঁকি মূল্যায়ন ও প্রতারণা প্রতিরোধের সহজ প্রশ্নমালা
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[13px] font-bold transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="size-4" />
          পুনরায় শুরু করুন
        </button>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Info Card, Stepper Question Canvas or Result (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header Info Card */}
          <div className="glass p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium text-slate-700 leading-relaxed flex-1">
                কাজ নেওয়ার আগে কয়েকটি প্রশ্ন — উত্তরগুলো আপনার ডিভাইসেই সম্পূর্ণ গোপন থাকবে।
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[12.5px] font-bold">
                <span className="text-slate-400">প্রগতি</span>
                <span className="text-brand">
                  {toBnDigits(currentIndex + 1)} / {toBnDigits(totalQuestions)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Question Card or Result Screen */}
          {!showResult ? (
            <div className="glass p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-200">
              {/* Question Title & Description */}
              <div className="space-y-2">
                <h2 className="text-[20px] font-extrabold text-ink leading-snug">
                  {currentQ.questionBn}
                </h2>
                <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed">
                  {currentQ.subtext}
                </p>
              </div>

              {/* Binary Answer Options (হ্যাঁ / না) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer('yes')}
                  className={`h-14 rounded-2xl flex items-center justify-center font-bold text-[16px] transition-all cursor-pointer ${
                    answers[currentQ.id] === 'yes'
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'bg-slate-50 border border-slate-300 text-ink hover:bg-brand/5 hover:border-brand'
                  }`}
                >
                  হ্যাঁ
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer('no')}
                  className={`h-14 rounded-2xl flex items-center justify-center font-bold text-[16px] transition-all cursor-pointer ${
                    answers[currentQ.id] === 'no'
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'bg-white border-2 border-brand text-brand hover:bg-brand/5'
                  }`}
                >
                  না
                </button>
              </div>

              {/* Skip Option */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[13px] font-bold text-slate-400 hover:text-brand transition-colors cursor-pointer"
                >
                  নিশ্চিত নই — এড়িয়ে যান
                </button>
              </div>

              {/* Canvas Stepper Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="size-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="পূর্ববর্তী প্রশ্ন"
                >
                  <ChevronLeft className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 h-11 rounded-full bg-brand hover:bg-brand-dark text-white font-bold text-[13.5px] shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>
                    {currentIndex === totalQuestions - 1 ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Final Verdict Result Display */
            <div className="glass p-6 rounded-3xl border border-slate-100 shadow-md space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  {verdict.icon}
                  <div>
                    <h2 className="text-[20px] font-black text-ink">
                      স্ক্রিনিং ফলাফল: {verdict.label}
                    </h2>
                    <p className="text-[12.5px] font-bold text-slate-400 mt-0.5">
                      মোট উত্তর দেওয়া হয়েছে: {toBnDigits(Object.keys(answers).length)}টি প্রশ্ন
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[12px] font-extrabold border ${verdict.color}`}>
                  {verdict.badge}
                </span>
              </div>

              {/* Advice Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <h3 className="text-[14px] font-extrabold text-ink">
                  পরামর্শ ও পদক্ষেপ:
                </h3>
                <p className="text-[13.5px] font-medium text-slate-700 leading-relaxed">
                  {verdict.advice}
                </p>
              </div>

              {/* Safety Rules Breakdown */}
              <div className="space-y-3">
                <h3 className="text-[15px] font-bold text-ink">
                  নিরাপত্তা নির্দেশিকা
                </h3>

                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>প্ল্যাটফর্মের ভেতরেই সবসময় মেসেজ এবং ফাইল বিনিময় নিশ্চিত করুন।</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">
                    <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                    <span>কাজ শুরুর আগে নির্দিষ্ট বাজেট ও মাইলস্টোন নিশ্চিত করুন।</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-brand text-white font-bold text-[14px] shadow-md shadow-brand/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  নতুন স্ক্রিনিং করুন
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Column: Live Risk Score & Safety Advice (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Real-time Risk Score Meter */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-[15.5px] font-bold text-ink flex items-center gap-2">
              <Zap className="size-4 text-brand fill-current" />
              লাইভ ঝুঁকি স্কোর
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <p className="text-[32px] font-black text-brand leading-none">
                {toBnDigits(currentRiskScore)} <span className="text-[16px] text-slate-400 font-normal">/ ১২</span>
              </p>
              <p className="text-[12px] font-bold text-slate-500">
                {currentRiskScore >= 6 ? 'উচ্চ ঝুঁকি চিহ্নিত' : currentRiskScore >= 3 ? 'মাঝারি ঝুঁকি' : 'কম ঝুঁকি'}
              </p>
            </div>
          </div>

          {/* Scam Protection Guidelines */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-600" />
              প্রতারণা প্রতিরোধের ৩ টি নিয়ম
            </h3>

            <ul className="text-[12.5px] text-slate-600 leading-relaxed space-y-2 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                চুক্তির আগে কখনো টেলিগ্রাম বা হোয়াটসঅ্যাপে যাবেন না।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                বিনামূল্যে টেস্ট প্রজেক্ট বা নমুনা কাজ করে দেবেন না।
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                বাইরের মাধ্যমে নিরাপত্তা ফি বা সিকিউরিটি পে করবেন না।
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
