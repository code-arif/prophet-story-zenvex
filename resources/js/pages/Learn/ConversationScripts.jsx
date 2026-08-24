import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  History,
  RefreshCw,
  Clock,
  CreditCard,
  Scale,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 11 — Client Conversation Scripts · ক্লায়েন্ট কথোপকথন স্ক্রিপ্ট
 * 5 client situations × 3 tone levels, rationale breakdown, avoid words, and AI Assistant customization.
 * Responsive 2-column desktop layout using max-w-5xl.
 */
export default function ConversationScripts({ scripts = [] }) {
  const { t } = useI18n();

  // 5 Real Freelance Client Situations
  const situations = [
    {
      id: 'scope-creep',
      title: 'বাড়তি কাজের অনুরোধ',
      icon: History,
    },
    {
      id: 'revision-abuse',
      title: 'রিভিশন বেশি হয়ে যাচ্ছে',
      icon: RefreshCw,
    },
    {
      id: 'delivery-delay',
      title: 'কাজ দিতে দেরি হবে',
      icon: Clock,
    },
    {
      id: 'payment-delay',
      title: 'টাকা বকেয়া',
      icon: CreditCard,
    },
    {
      id: 'dispute',
      title: 'বিরোধ শুরু হয়েছে',
      icon: Scale,
      isFullWidth: true,
    },
  ];

  // 3 Tone Levels
  const toneLevels = [
    { key: 0, label: 'নরম (Soft)' },
    { key: 1, label: 'স্পষ্ট (Direct)' },
    { key: 2, label: 'শেষ ধাপ (Serious)' },
  ];

  // Default Script Data Mapping
  const scriptContentMap = {
    'scope-creep': [
      {
        message:
          'Hi [Client], happy to add the extra banner designs! Just to note, this falls outside our agreed scope. Would you like me to send a separate quote for these additional items?',
        messageBn:
          'হাই [ক্লায়েন্ট], বাড়তি ব্যানার ডিজাইনগুলো করতে পেরে আনন্দিত! শুধু জানিয়ে রাখছি, এটি আমাদের মূল চুক্তির বাইরে। এই অতিরিক্ত কাজের জন্য কি আমি আলাদা কোটেশন পাঠাব?',
        whyPoints: [
          'সরাসরি "না" না বলে পেশাদারভাবে অতিরিক্ত কাজের কথা বলা হয়েছে',
          'বাজেট বা স্কোপের বাইরে কাজ শুরু করার আগে স্পষ্ট আলোচনা জরুরি',
          'সিদ্ধান্ত নেয়ার সুযোগ ক্লায়েন্টের হাতে ছেড়ে দেয়া হয়েছে',
        ],
        avoidWords: ['I am sorry', 'Maybe next time', 'If you want'],
      },
      {
        message:
          'Happy to add the extra two banners. That falls outside the agreed scope, so it would be an additional 40 USD and two more days — shall I send the updated timeline?',
        messageBn:
          'অতিরিক্ত দুইটি ব্যানার যুক্ত করতে পেরে খুশি। তবে এটি সম্মত স্কোপের বাইরে, তাই অতিরিক্ত ৪০ ডলার এবং আরও ২ দিন সময় লাগবে — আমি কি আপডেট সময়সীমা পাঠাব?',
        whyPoints: [
          'সময়সীমা আর দাম একসাথে স্পষ্ট বলা হয়েছে, কোনো অস্পষ্টতা রাখা হয়নি',
          'অপশনটি ক্লায়েন্টের ওপর ছেড়ে দেয়া হয়েছে যাতে তিনি হিসাব বুঝে সিদ্ধান্ত নিতে পারেন',
          'অনভিপ্রেত ফ্রি কাজ করার ঝুঁকি বন্ধ করা হয়েছে',
        ],
        avoidWords: ['I am sorry', 'My mistake', 'Free for this time'],
      },
      {
        message:
          'Dear [Client], I must respectfully decline further work outside the agreed scope. The current requests significantly exceed our original contract. Let\'s stick to the agreed deliverables or issue a formal change order.',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], সম্মত স্কোপের বাইরে আরও কাজ করা আমার পক্ষে সম্ভব হচ্ছে না। বর্তমান অনুরোধগুলো মূল চুক্তিকে অতিক্রান্ত করে। আসুন আমরা চুক্তিবদ্ধ কাজে ফোকাস করি অথবা পরিবর্তন অর্ডার তৈরি করি।',
        whyPoints: [
          'কঠোর কিন্তু অত্যন্ত প্রফেশনাল সীমান্ত রক্ষা করা হয়েছে',
          'প্রজেক্টের ক্ষতি এড়াতে অতিরিক্ত ফ্রি কাজ স্থগিতের নোটিশ দেওয়া হয়েছে',
          'চুক্তি রক্ষার আইনি বাধ্যবাধকতা স্মরণ করানো হয়েছে',
        ],
        avoidWords: ['Sorry again', 'Don\'t be angry', 'Please don\'t complain'],
      },
    ],
    'revision-abuse': [
      {
        message:
          'Hi [Client], happy to make this revision! Just a heads-up, this is revision 3 of 3 included in our agreement. Future revisions will be billed at standard hourly rate.',
        messageBn:
          'হাই [ক্লায়েন্ট], এই রিভিশনটি করতে পেরে খুশি! জানিয়ে রাখছি, এটি চুক্তির ৩টি রিভিশনের শেষটি। পরবর্তী অতিরিক্ত পরিবর্তনের জন্য স্বাভাবিক ঘণ্টা-হার প্রযোজ্য হবে।',
        whyPoints: [
          'বিনয়ীভাবে চুক্তির অন্তর্ভুক্ত শেষ ফ্রি রিভিশনের কথা স্মরণ করিয়ে দেওয়া হয়েছে',
          'পরবর্তী পরিবর্তনের খরচ কত হতে পারে তার আগাম ধারণা দেওয়া হয়েছে',
        ],
        avoidWords: ['No problem', 'Unlimited revisions', 'Anything you say'],
      },
      {
        message:
          'Hi [Client], we\'ve completed 4 rounds of revisions so far. Our contract covered 2 rounds. To maintain quality and schedule, further revisions will require an extra 30 USD fee.',
        messageBn:
          'হাই [ক্লায়েন্ট], আমরা এ পর্যন্ত ৪ রাউন্ড রিভিশন সম্পন্ন করেছি। আমাদের চুক্তিতে ২ রাউন্ড অন্তর্ভুক্ত ছিল। মান ও সময় বজায় রাখতে অতিরিক্ত পরিবর্তনের জন্য ৩০ ডলার ফি প্রযোজ্য হবে।',
        whyPoints: [
          'পরিসংখ্যান দিয়ে অতিরিক্ত রিভিশনের পরিমাণ নির্দিষ্ট করা হয়েছে',
          'অতিরিক্ত ফি ও সময়সীমা স্পষ্ট করে রিভিশন অপব্যবহার রোধ করা হয়েছে',
        ],
        avoidWords: ['I am sorry', 'It\'s okay', 'I will do for free'],
      },
      {
        message:
          'Dear [Client], I must decline further revisions beyond the agreed terms. We have completed 6 revisions which changed the original concept. I will finalize the current version as per contract.',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], চুক্তিকৃত শর্তের বাইরে অতিরিক্ত রিভিশন করতে আমি বিনয়ীভাবে অপারগতা প্রকাশ করছি। আমরা ৬টি রিভিশন করেছি যা মূল কনসেপ্ট বদলে ফেলেছে। চুক্তিমতে বর্তমান ভার্সনটি ফাইনাল করা হচ্ছে।',
        whyPoints: [
          'প্রজেক্ট শেষ না হওয়ার অসীম চক্র বা লুপ বন্ধ করা হয়েছে',
          'চূড়ান্ত সংস্করণ ডেলিভারি করার শক্ত সিদ্ধান্ত জানানো হয়েছে',
        ],
        avoidWords: ['I am very sorry', 'Please forgive me', 'Bad review'],
      },
    ],
    'delivery-delay': [
      {
        message:
          'Hi [Client], I am making great progress on your project! To ensure top quality, I need one extra day for testing. The final version will be sent tomorrow by 5 PM.',
        messageBn:
          'হাই [ক্লায়েন্ট], প্রজেক্টে দারুণ অগ্রগতি হচ্ছে! সর্বোত্তম মান নিশ্চিত করতে টেস্টিংয়ের জন্য আমার ১টি দিন অতিরিক্ত প্রয়োজন। কাল বিকেল ৫টার মধ্যে ফাইনাল ডেলিভারি পাবেন।',
        whyPoints: [
          'দেরি হওয়ার কারণ হিসেবে "কাজের মান রক্ষা" উল্লেখ করা হয়েছে',
          'নির্দিষ্ট পরবর্তী ডেলিভারি সময় উল্লেখ করা হয়েছে',
        ],
        avoidWords: ['I was busy', 'Personal problems', 'Forgot'],
      },
      {
        message:
          'Hi [Client], due to unexpected technical issues with [module], the delivery will be delayed by 24 hours. I apologize for the inconvenience and am prioritizing this to finish today.',
        messageBn:
          'হাই [ক্লায়েন্ট], [মডিউল] নিয়ে অপ্রত্যাশিত কারিগরি জটিলতার কারণে ডেলিভারি ২৪ ঘণ্টা বিলম্বিত হচ্ছে। এই সাময়িক অসুবিধার জন্য দুঃখিত, আজই কাজ শেষ করতে সর্বোচ্চ গুরুত্ব দিচ্ছি।',
        whyPoints: [
          'সমস্যা লুকিয়ে না রেখে আগেই ক্লায়েন্টকে সতর্ক করা হয়েছে',
          'অজুহাত না দিয়ে কারিগরি কারণ স্পষ্ট ব্যাখ্যা করা হয়েছে',
        ],
        avoidWords: ['Power failure', 'Family issue', 'Not my fault'],
      },
      {
        message:
          'Dear [Client], I want to provide a transparent update on the project timeline. We encountered an architectural block requiring 2 more days to resolve correctly. Revised deadline is [Date].',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], প্রজেক্টের সময়সীমা নিয়ে একটি স্বচ্ছ আপডেট দিতে চাই। আমরা কারিগরি ব্লকারের মুখোমুখি হয়েছি যা ঠিক করতে আরও ২ দিন লাগবে। সংশোধিত ডেডলাইন [তারিখ]।',
        whyPoints: [
          'কাজের পেশাদার স্বচ্ছতা বজায় রাখা হয়েছে',
          'ক্লায়েন্টের আস্থা অক্ষুণ্ণ রাখতে রিভাইজড ডেডলাইন লিখিত দেওয়া হয়েছে',
        ],
        avoidWords: ['Don\'t cancel', 'Extremely sorry', 'Please wait'],
      },
    ],
    'payment-delay': [
      {
        message:
          'Hi [Client], hope you are doing well! Just a gentle reminder regarding Invoice #[number] for [project], which was due on [date]. Please let me know once processed.',
        messageBn:
          'হাই [ক্লায়েন্ট], আশা করি ভালো আছেন! [প্রজেক্ট] এর ইনভয়েস #[নম্বর] সংক্রান্ত একটি সাধারণ স্মারক, যার মেয়াদ [তারিখ] শেষ হয়েছে। প্রসেস হলে জানালে উপকৃত হব।',
        whyPoints: [
          'প্রথম তাগাদায় সুসম্পর্ক রেখে বিনয়ী কথা বলা হয়েছে',
          'ইনভয়েস নম্বর ও ডেডলাইন স্পষ্টভাবে উল্লেখ করা হয়েছে',
        ],
        avoidWords: ['Where is money', 'Pay now', 'Urgent money needed'],
      },
      {
        message:
          'Hi [Client], following up on Invoice #[number] ([amount]) which is now 7 days overdue. Could you please confirm when payment will be released?',
        messageBn:
          'হাই [ক্লায়েন্ট], ইনভয়েস #[নম্বর] ([পরিমাণ]) সম্পর্কে ফলো-আপ, যা ৭ দিন ধরে বকেয়া রয়েছে। পেমেন্ট কখন সম্পন্ন হবে তা কনফার্ম করবেন কি?',
        whyPoints: [
          'কত দিন বিলম্বিত হয়েছে তা সংখ্যা দিয়ে স্পষ্ট উল্লেখ করা হয়েছে',
          'পেমেন্টের সুনির্দিষ্ট তারিখ ও কনফার্মেশন চাওয়া হয়েছে',
        ],
        avoidWords: ['Why late', 'I need money today', 'Bad client'],
      },
      {
        message:
          'Dear [Client], Invoice #[number] remains unpaid for 21 days despite multiple reminders. Please note that active project files and support will be paused until this balance is cleared.',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], একাধিক স্মারক সত্ত্বেও ইনভয়েস #[নম্বর] ২১ দিন ধরে অপরিশোধিত রয়েছে। পেমেন্ট সম্পন্ন না হওয়া পর্যন্ত প্রজেক্ট ফাইল ও সাপোর্ট স্থগিত থাকবে।',
        whyPoints: [
          'বকেয়া আদায়ে কাজের ফাইল ও সাপোর্ট সাময়িক স্থগিতের শক্ত পদক্ষেপ',
          'পেমেন্ট না পাওয়া পর্যন্ত প্রজেক্ট পরবর্তী ধাপে যাবে না তা সুনির্দিষ্ট করা',
        ],
        avoidWords: ['I will report you', 'Scammer', 'Poverty'],
      },
    ],
    dispute: [
      {
        message:
          'Hi [Client], I noticed your concern regarding [issue]. I want to ensure you are 100% satisfied. Let\'s schedule a quick 10-min call to resolve this together.',
        messageBn:
          'হাই [ক্লায়েন্ট], [বিষয়] নিয়ে আপনার চিন্তার বিষয়টি দেখেছি। আপনার পূর্ণ সন্তুষ্টি আমার লক্ষ্য। আসুন এটি সমাধানে একটি ১০ মিনিটের সংক্ষিপ্ত কলে কথা বলি।',
        whyPoints: [
          'বিতণ্ডা না বাড়িয়ে সরাসরি যোগাযোগের উদ্যোগ নেওয়া হয়েছে',
          'ক্লায়েন্টের উদ্বেগকে মূল্যায়ন করা হয়েছে',
        ],
        avoidWords: ['You are wrong', 'Read contract', 'I don\'t care'],
      },
      {
        message:
          'Dear [Client], all work was delivered strictly according to the agreed brief on [date]. I have documented all progress and delivery files. Let\'s find an amicable middle ground.',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], সমস্ত কাজ [তারিখ] তারিখে চুক্তিকৃত ব্রিফ অনুযায়ী জমা দেওয়া হয়েছে। ডেলিভারির সব নথি আমার কাছে সংগৃহীত রয়েছে। আসুন একটি সৌহার্দ্যপূর্ণ সমাধানে আসি।',
        whyPoints: [
          'প্রমাণ ও নথিপত্রের কথা স্মরণ করিয়ে দেওয়া হয়েছে',
          'একপেশে যুক্তি না দিয়ে সম্মানজনক আপসের প্রস্তাব করা হয়েছে',
        ],
        avoidWords: ['Fraud', 'Liar', 'Going to court'],
      },
      {
        message:
          'Dear [Client], since we cannot reach an agreement, I am submitting this case to platform support for formal dispute resolution with all delivery proofs attached.',
        messageBn:
          'প্রিয় [ক্লায়েন্ট], যেহেতু আমরা সমাধানে পৌঁছাতে পারছি না, তাই আমি চুক্তি ও ডেলিভারির যাবতীয় প্রমাণ সহ বিষয়টি প্ল্যাটফর্ম বিরোধ নিষ্পত্তিতে জমা দিচ্ছি।',
        whyPoints: [
          'অহেতুক তর্কে সময় নষ্ট না করে অফিসিয়াল প্ল্যাটফর্ম ডিসপিউটে যাওয়া',
          'প্রমাণপত্র প্রস্তুত রেখে সংঘাত এড়ানো',
        ],
        avoidWords: ['Curse you', 'Stealing work', 'Threats'],
      },
    ],
  };

  // State Management
  const [selectedSituationIndex, setSelectedSituationIndex] = useState(0);
  const [selectedToneIndex, setSelectedToneIndex] = useState(1); // Default 1: Clear/Direct
  const [copied, setCopied] = useState(false);

  const currentSituation = situations[selectedSituationIndex];
  const currentScripts =
    scriptContentMap[currentSituation.id] || scriptContentMap['scope-creep'];
  const currentScript = currentScripts[selectedToneIndex] || currentScripts[0];

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentScript.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="ক্লায়েন্ট কথোপকথন স্ক্রিপ্ট — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            ক্লায়েন্ট কথোপকথন স্ক্রিপ্ট
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            কঠিন পরিস্থিতিতে প্রফেশনাল বার্তা পাঠানোর রেডিমেড টেমপ্লেট
          </p>
        </div>
      </div>

      {/* Responsive 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 5 Situation Cards Grid, Tone Selector, Avoid Words (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Situation Grid */}
          <div className="space-y-2">
            <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider px-1">
              পরিস্থিতি বেছে নিন
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {situations.map((sit, idx) => {
                const IconComp = sit.icon;
                const isSelected = selectedSituationIndex === idx;

                return (
                  <button
                    key={sit.id}
                    type="button"
                    onClick={() => setSelectedSituationIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all active:scale-[0.98] flex flex-col items-center justify-center text-center gap-2.5 shadow-sm ${
                      sit.isFullWidth ? 'col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-brand/10 border-brand text-brand ring-2 ring-brand/20'
                        : 'glass border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-brand text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComp className="size-5" />
                    </div>
                    <span className="text-[14px] font-bold leading-tight">
                      {sit.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selector Segment Bar */}
          <div className="space-y-2">
            <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider px-1">
              বার্তার টোন বা মাত্রা
            </h2>

            <div className="flex p-1 bg-slate-100/80 rounded-full border border-slate-200 shadow-inner">
              {toneLevels.map((tLevel) => (
                <button
                  key={tLevel.key}
                  type="button"
                  onClick={() => setSelectedToneIndex(tLevel.key)}
                  className={`flex-1 py-2 text-[13.5px] font-bold rounded-full transition-all active:scale-95 ${
                    selectedToneIndex === tLevel.key
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  {tLevel.label}
                </button>
              ))}
            </div>
          </div>

          {/* Avoid Words Box */}
          <div className="bg-amber-50/90 border border-amber-200/80 p-4 rounded-2xl space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-[14.5px]">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span>যে শব্দগুলো এড়িয়ে চলবেন</span>
            </div>

            <div className="flex flex-wrap gap-2 text-[13px]">
              {currentScript.avoidWords.map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="line-through bg-white/80 border border-amber-200 px-2.5 py-1 rounded-lg font-medium text-amber-900 shadow-2xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Script Message Card & Action CTAs (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          
          {/* Main Script Display Card */}
          <div className="glass rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
            
            {/* Script Text Container */}
            <div className="p-5 bg-slate-50/90 border-b border-slate-100 relative group">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand bg-brand/10 px-2.5 py-1 rounded-md mb-2 inline-block">
                রেডিমেড ক্লায়েন্ট বার্তা
              </span>

              <p className="text-[14.5px] leading-relaxed font-medium text-ink pr-8 mt-1">
                "{currentScript.message}"
              </p>

              <button
                type="button"
                onClick={handleCopyText}
                className="absolute top-4 right-4 text-slate-400 hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-white active:scale-95"
                title="কপি করুন"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>

            {/* Why This Works Section */}
            <div className="p-5 space-y-3 bg-white">
              <h3 className="text-[14.5px] font-bold text-ink">
                কেন এভাবে লেখা হয়েছে
              </h3>

              <ul className="space-y-2">
                {currentScript.whyPoints.map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 space-y-2.5 bg-white">
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full h-11 border-2 border-brand text-brand hover:bg-brand/5 font-bold text-[14px] rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {copied ? <Check className="size-4 stroke-[3]" /> : <Copy className="size-4" />}
                {copied ? 'কপি হয়েছে!' : 'কপি করুন'}
              </button>

              <Link
                href="/assistant"
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-violet-600/20"
              >
                <Sparkles className="size-4" />
                আমার কাজের জন্য বদলে নিন
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
