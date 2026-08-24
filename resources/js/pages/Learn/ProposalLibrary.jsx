import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  X,
  BookOpen,
  Lightbulb,
  FileText,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 10 — Proposal Structure Library · প্রস্তাব কাঠামো লাইব্রেরি
 * Category tabs, 6 timeline proposal parts, sample snippets, copy button, and AI draft CTA.
 * Responsive 2-column desktop layout utilizing max-w-5xl width.
 */
export default function ProposalLibrary({ structures = [] }) {
  const { t } = useI18n();

  // Fallback default structures if controller prop is empty
  const defaultStructures = [
    {
      id: 'design',
      labelBn: 'ওয়েব ডিজাইন',
      parts: [
        {
          id: '1',
          labelBn: 'শুভেচ্ছা ও বোঝাপড়া',
          descBn: 'প্রথম বাক্যেই দেখানো হচ্ছে আপনি বিজ্ঞাপনটা পড়েছেন — এটাই পড়া চালিয়ে যাওয়ার কারণ',
          sampleBn: '"Your listing says the current thumbnails get low click-through — that is usually a contrast problem, not a design problem."',
        },
        {
          id: '2',
          labelBn: 'প্রাসঙ্গিক পোর্টফোলিও',
          descBn: 'ক্লায়েন্টের মূল সমস্যা যে আপনি সঠিকভাবে বুঝেছেন তার স্পষ্ট প্রমাণ ও নমুনা দিন',
          sampleBn: 'এখানে ২-৩টি অনুরূপ প্রজেক্ট আছে: [লিংক]। দেখুন কীভাবে আমি [নির্দিষ্ট চ্যালেঞ্জ] সমাধান করেছি।',
        },
        {
          id: '3',
          labelBn: 'পদ্ধতি ও সময়সীমা',
          descBn: 'কীভাবে সমাধান করবেন তার একটি পরিষ্কার ধাপভিত্তিক ধারণাসমূহ',
          sampleBn: 'আমার পদ্ধতি: ১) ওয়্যারফ্রেম পর্যালোচনা, ২) ডিজাইন মকআপ (২ রাউন্ড), ৩) রেসপন্সিভ বাস্তবায়ন। সময়সীমা: [X] দিন।',
        },
        {
          id: '4',
          labelBn: 'ডেলিভারেবল',
          descBn: 'প্রজেক্ট শেষে ক্লায়েন্টকে যা যা হস্তান্তর করবেন',
          sampleBn: 'আপনি পাবেন: Figma সোর্স ফাইল, সমস্ত অ্যাসেট, ২ রাউন্ড রিভিশন অন্তর্ভুক্ত।',
        },
        {
          id: '5',
          labelBn: 'সময় ও দর',
          descBn: 'কত সময়ে শেষ করবেন এবং প্রজেক্টের আনুমানিক খরচ কত',
          sampleBn: '২৪ ঘণ্টার মধ্যে প্রথম ড্রাফট পাবেন। সম্পূর্ণ বাজেট: ৳ ১,৫০০।',
        },
        {
          id: '6',
          labelBn: 'শেষ প্রশ্ন',
          descBn: 'এমন একটি প্রশ্ন যা ক্লায়েন্টকে দ্রুত উত্তর দিতে আগ্রহী করবে',
          sampleBn: 'আপনার কাছে কি কোনো নির্দিষ্ট ব্র্যান্ড ফন্ট ফাইল বা কালার কোড আছে?',
        },
      ],
      dontsBn: [
        'নিজের পরিচয় দিয়ে শুরু করবেন না',
        'একই লেখা সব কাজে পাঠাবেন না',
        'দাম নিয়ে ক্ষমা চাইবেন না',
      ],
    },
    {
      id: 'logo',
      labelBn: 'লোগো ডিজাইন',
      parts: [
        {
          id: '1',
          labelBn: 'শুভেচ্ছা ও ভিজ্যুয়াল কনসেপ্ট',
          descBn: 'ক্লায়েন্টের ব্র্যান্ড নেম ও মেইন ভ্যালু উল্লেখ করুন',
          sampleBn: '"Hi [Client Name], I love the concept of [brand name]. Here\'s how I\'d approach creating a memorable identity."',
        },
        {
          id: '2',
          labelBn: 'লোগো পোর্টফোলিও',
          descBn: 'অনুরূপ ব্র্যান্ডিং বা লোগো ডিজাইনের নমুনা',
          sampleBn: 'এখানে অনুরূপ শিল্পের জন্য আমি যেসব লোগো ডিজাইন করেছি: [লিংক]।',
        },
        {
          id: '3',
          labelBn: 'ডিজাইন প্রক্রিয়া',
          descBn: '১) ব্র্যান্ড আবিষ্কার, ২) ৩টি প্রাথমিক ধারণা, ৩) পরিমার্জনা',
          sampleBn: 'প্রক্রিয়া: ১) ব্র্যান্ড আবিষ্কার, ২) ৩টি প্রাথমিক ধারণা, ৩) পরিমার্জনা, ৪) চূড়ান্ত ফাইল। সময়সীমা: ৩ দিন।',
        },
        {
          id: '4',
          labelBn: 'ডেলিভারেবল',
          descBn: 'সোর্স ফাইল ফরম্যাটসমূহ',
          sampleBn: 'চূড়ান্ত ডেলিভারি: AI, EPS, SVG, PNG ফাইল। সম্পূর্ণ মালিকানা হস্তান্তর অন্তর্ভুক্ত।',
        },
        {
          id: '5',
          labelBn: 'পেশাদার সমাপ্তি',
          descBn: 'আপনার কাজের প্যাশন ও অভিজ্ঞতা',
          sampleBn: 'এমন লোগো তৈরি করতে আমি আগ্রহী যেটি একটি গল্প বলে। আপনার দৃষ্টি নিয়ে কথা বলি।',
        },
        {
          id: '6',
          labelBn: 'সমাপ্তির প্রশ্ন',
          descBn: 'কালার স্কিম বা ফন্ট প্রশ্ন',
          sampleBn: 'আপনার কি কোনো বিদ্যমান ব্র্যান্ড উপাদান (রঙ, ফন্ট) আছে যেটা আমি অন্তর্ভুক্ত করতে পারি?',
        },
      ],
      dontsBn: [
        'না জিজ্ঞাসা করে একাধিক ধারণা পাঠাবেন না',
        'ক্লিপআর্ট বা জেনেরিক প্রতীক ব্যবহার করবেন না',
        'অসীম রিভিশন প্রতিশ্রুতি দিবেন না',
      ],
    },
    {
      id: 'wordpress',
      labelBn: 'ওয়ার্ডপ্রেস',
      parts: [
        {
          id: '1',
          labelBn: 'শুভেচ্ছা ও সমস্যা ফিক্সিং',
          descBn: 'ওয়েবসাইট স্পিড বা কাস্টমাইজেশন চাহিদা ধরা',
          sampleBn: '"Hi [Client Name], I see you need a WordPress site. I\'ve built 20+ WordPress sites for businesses."',
        },
        {
          id: '2',
          labelBn: 'টেকনিক্যাল পোর্টফোলিও',
          descBn: 'কাস্টম কোডেড রেসপন্সিভ সাইটের লিংক',
          sampleBn: 'সাম্প্রতিক ওয়ার্ডপ্রেস প্রজেক্ট: [লিংক]। সব কাস্টম-কোডেড, মোবাইল-রেসপন্সিভ, এবং অপ্টিমাইজড।',
        },
        {
          id: '3',
          labelBn: 'ডেভেলপমেন্ট পদ্ধতি',
          descBn: 'পারফরম্যান্স ও স্টেজিং সাইট প্ল্যান',
          sampleBn: 'আমি পারফরম্যান্সের জন্য ক্লিন কোড ব্যবহার করব। লাইভ হওয়ার আগে আপনার পর্যালোচনার জন্য স্টেজিং সাইট।',
        },
        {
          id: '4',
          labelBn: 'ডেলিভারেবল',
          descBn: 'সাইট, সাপোর্ট ও ডকস',
          sampleBn: 'সম্পূর্ণ কার্যকর সাইট, ১ মাস ফ্রি সাপোর্ট, ডকুমেন্টেশন, এবং প্রশিক্ষণ।',
        },
        {
          id: '5',
          labelBn: 'সময় ও দর',
          descBn: 'শুরু করার জন্য প্রস্তুত',
          sampleBn: 'আমি আজই শুরু করতে পারব। বিস্তারিত নিয়ে কথা বলতে একটি ছোট কলে খুশি।',
        },
        {
          id: '6',
          labelBn: 'সমাপ্তির প্রশ্ন',
          descBn: 'হোস্টিং সংক্রান্ত প্রশ্ন',
          sampleBn: 'আপনার কি হোস্টিং প্রস্তুত আছে, নাকি আমি একটি বিশ্বস্ত প্রদানকারীর সুপারিশ করতে চান?',
        },
      ],
      dontsBn: [
        'এসইও র্যাঙ্কিং বা ট্রাফিকের ভুয়া গ্যারান্টি দিবেন না',
        'নুলড বা পাইরেটেড থিম ব্যবহার করবেন না',
        'নিরাপত্তা ও সিকিউরিটি প্যাচ বাদ দিবেন না',
      ],
    },
    {
      id: 'mobile',
      labelBn: 'মোবাইল অ্যাপ',
      parts: [
        {
          id: '1',
          labelBn: 'শুভেচ্ছা ও অ্যাপ আইডিয়া',
          descBn: 'iOS/Android প্লাটফর্ম ফিটনেস',
          sampleBn: '"Hi [Client Name], I understand you need a cross-platform app. This aligns perfectly with my expertise."',
        },
        {
          id: '2',
          labelBn: 'অ্যাপ পোর্টফোলিও',
          descBn: 'প্লে স্টোর ও অ্যাপ স্টোর লিঙ্ক',
          sampleBn: 'আমার সাম্প্রতিক অ্যাপস: [App Store/Play Store এ লিংক]। ৫,০০০+ ডাউনলোড, ৪.৮ রেটিং।',
        },
        {
          id: '3',
          labelBn: 'ডেভেলপমেন্ট পদ্ধতি',
          descBn: 'React Native / Flutter প্রসেস',
          sampleBn: 'টেক স্ট্যাক: Flutter। অ্যাজাইল স্প্রিন্ট, সাপ্তাহিক ডেমো, দিন এক থেকে টেস্ট ডেলিভারি।',
        },
        {
          id: '4',
          labelBn: 'ডেলিভারেবল',
          descBn: 'সোর্স কোড ও সাবমিশন',
          sampleBn: 'সোর্স কোড, App Store জমা, ২ মাস বাগ-ফিক্স সাপোর্ট, ডিপ্লয়মেন্ট ডকস।',
        },
        {
          id: '5',
          labelBn: 'সমাপ্তি',
          descBn: 'প্রজেক্ট ডুরেশন',
          sampleBn: 'আপনার অ্যাপের ধারণা বিস্তারিত নিয়ে কথা বলতে চাই। এই সপ্তাহে যেকোনো সময় কলের জন্য প্রস্তুত।',
        },
        {
          id: '6',
          labelBn: 'সমাপ্তির প্রশ্ন',
          descBn: 'ওয়্যারফ্রেম প্রশ্ন',
          sampleBn: 'আপনার কি ওয়্যারফ্রেম বা ডিজাইন প্রস্তুত আছে, নাকি আমাকে ডিজাইন পর্যায় থেকে শুরু করতে হবে?',
        },
      ],
      dontsBn: [
        'ডেভেলপমেন্ট সময় কম মূল্যায়ন করবেন না',
        'টেস্টিং এবং QA বাদ দিবেন না',
        'App Store নির্দেশিকা উপেক্ষা করবেন না',
      ],
    },
    {
      id: 'writing',
      labelBn: 'কন্টেন্ট রাইটিং',
      parts: [
        {
          id: '1',
          labelBn: 'শুভেচ্ছা ও অডিয়েন্স ফোকাস',
          descBn: 'নিশ কন্টেন্ট স্পেশালাইজেশন',
          sampleBn: '"Hi [Client Name], I\'d love to help with SEO content. I specialize in engaging B2B articles."',
        },
        {
          id: '2',
          labelBn: 'রাইটিং পোর্টফোলিও',
          descBn: 'প্রকাশিত ব্লগের লিঙ্ক',
          sampleBn: 'প্রকাশিত নমুনা: [লিংক]। আমি গভীর গবেষণা সহ প্রতি দিন ১৫০০ শব্দ লিখি।',
        },
        {
          id: '3',
          labelBn: 'রাইটিং প্রক্রিয়া',
          descBn: 'রিসার্চ ও আউটলাইন',
          sampleBn: 'প্রক্রিয়া: ১) গবেষণা ও রূপরেখা, ২) প্রথম খসড়া, ৩) প্রতিক্রিয়ার ভিত্তিতে পরিমার্জনা, ৪) পলিশ।',
        },
        {
          id: '4',
          labelBn: 'ডেলিভারেবল',
          descBn: 'এসইও অপ্টিমাইজড টেক্সট',
          sampleBn: 'SEO-অপ্টিমাইজড কন্টেন্ট, প্ল্যাগিয়ারিজম-ফ্রি গ্যারান্টি, ১ রাউন্ড রিভিশন অন্তর্ভুক্ত।',
        },
        {
          id: '5',
          labelBn: 'পেশাদার সমাপ্তি',
          descBn: 'ক্যালেন্ডার সেটআপ',
          sampleBn: 'রূপান্তরকারী কন্টেন্ট তৈরি করতে আমি আগ্রহী। আপনার লক্ষ্য নিয়ে কথা বলি।',
        },
        {
          id: '6',
          labelBn: 'সমাপ্তির প্রশ্ন',
          descBn: 'কন্টেন্ট ক্যালেন্ডার প্রশ্ন',
          sampleBn: 'আপনার কি একটি কন্টেন্ট ক্যালেন্ডার বা নির্দিষ্ট বিষয় মনে আছে, নাকি আমি সুপারিশ করব?',
        },
      ],
      dontsBn: [
        'এসইও গ্যারান্টি বা ট্রাফিক প্রতিশ্রুতি দিবেন না',
        'খুলে না বলে AI-জেনারেটেড কন্টেন্ট ব্যবহার করবেন না',
        'কীওয়ার্ড গবেষণা বাদ দিবেন না',
      ],
    },
  ];

  // Raw data source
  const dataList = structures.length > 0 ? structures : defaultStructures;

  // Active Category Chip Index
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Selected Category
  const currentCategory = dataList[activeCategoryIndex] || dataList[0];

  // Clipboard Copied State
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="প্রস্তাব কাঠামো লাইব্রেরি — ইজি রাইজ" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রস্তাব কাঠামো লাইব্রেরি
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            যে প্রস্তাব ক্লায়েন্ট গুরুত্ব সহকারে পড়ে তার সুবিন্যস্ত গঠন
          </p>
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none">
        {dataList.map((cat, idx) => (
          <button
            key={cat.id || idx}
            type="button"
            onClick={() => setActiveCategoryIndex(idx)}
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all active:scale-95 shrink-0 shadow-sm ${
              activeCategoryIndex === idx
                ? 'bg-brand text-white shadow-brand/20'
                : 'glass text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.labelBn || cat.label || `ক্যাটাগরি ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Desktop 2-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 6 Step Proposal Cards & Warnings (8 cols on desktop) */}
        <div className="lg:col-span-8 relative flex flex-col gap-4">
          {/* Connecting Vertical Line */}
          <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-brand/20 -z-10" />

          {/* Render 6 Proposal Parts */}
          {currentCategory.parts &&
            currentCategory.parts.map((part, index) => {
              const stepNum = index + 1;
              const partTitle = part.labelBn || part.label || `ধাপ ${stepNum}`;
              const partDesc =
                part.descBn ||
                part.descriptionBn ||
                part.description ||
                'এই ধাপে ক্লায়েন্টকে নির্দিষ্ট বার্তা দিন';
              const sampleText =
                part.sampleBn ||
                part.templateBn ||
                part.template ||
                'টেমপ্লেট বার্তা এখানে প্রদর্শন করা হবে';

              return (
                <React.Fragment key={part.id || index}>
                  <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-slate-200/80 transition-all">
                    {/* Step Number Circle */}
                    <div
                      className={`size-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-[14px] shadow-sm z-10 ${
                        index === 0
                          ? 'bg-brand/10 text-brand border border-brand/30'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {toBnDigits(stepNum)}
                    </div>

                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div>
                        <h3 className="text-[16px] font-bold text-ink">
                          {partTitle}
                        </h3>
                        <p className="text-[13px] text-muted leading-relaxed mt-0.5">
                          {partDesc}
                        </p>
                      </div>

                      {/* Sample Template Box */}
                      {sampleText && (
                        <div className="bg-[#EDF3FF] p-3.5 rounded-xl border border-[#E2E8F0] flex items-start justify-between gap-3 group relative">
                          <p className="text-[13.5px] text-ink leading-snug font-medium">
                            {sampleText}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopy(part.id || index, sampleText)}
                            className="text-slate-400 hover:text-brand shrink-0 transition-colors p-1.5 rounded-lg hover:bg-white/60 active:scale-95"
                            title="লেখাটি কপি করুন"
                          >
                            {copiedId === (part.id || index) ? (
                              <Check className="size-4 text-emerald-600 stroke-[3]" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Don'ts Warning Card Insert after Step 3 */}
                  {index === 2 && currentCategory.dontsBn && (
                    <div className="bg-amber-50/90 border border-amber-200/80 p-4 rounded-2xl relative pl-12 shadow-sm my-1">
                      <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-amber-600 rounded-r-md" />
                      <h4 className="font-bold text-[15px] text-amber-900 mb-2.5 flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                        যা করবেন না
                      </h4>
                      <ul className="space-y-2">
                        {currentCategory.dontsBn.map((dontText, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-[13.5px] text-amber-900 font-medium">
                            <X className="size-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                            <span>{dontText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>

        {/* Right Column: AI Assistant Card & Best Practice Guide (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          {/* Violet AI Action Card */}
          <div className="glass p-5 rounded-2xl border border-violet-100 shadow-sm space-y-4 bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 text-white relative overflow-hidden">
            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h3 className="text-[17px] font-bold text-white">
                প্রস্তাব খসড়া তৈরি করুন
              </h3>
              <p className="text-[12.5px] text-violet-100 mt-1 leading-relaxed">
                এই নির্বাচিত কাঠামোর সাহায্যে AI সহকারীর মাধ্যমে ক্লায়েন্টের জন্য আকর্ষণীয় কভার লেটার লিখুন।
              </p>
            </div>

            <Link
              href="/assistant"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-violet-50 text-violet-700 font-bold text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
            >
              <Zap className="size-4 text-violet-700" />
              এই কাঠামোয় খসড়া লিখুন
            </Link>
          </div>

          {/* Proposal Writing Tips */}
          <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-[15px] font-bold text-ink flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-500" />
              প্রস্তাব লেখার সেরা পরামর্শ
            </h4>
            
            <div className="space-y-2 text-[12.5px] text-slate-600 leading-relaxed">
              <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                • প্রথম ২ লাইনেই ক্লায়েন্টের প্রজেক্ট প্রবলেম ফোকাস করুন।
              </p>
              <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                • নিজের দীর্ঘ আত্মজীবনী না লিখে সমাধান ও পোর্টফোলিও দেখান।
              </p>
              <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                • শেষে এমন ১টি প্রাসঙ্গিক প্রশ্ন করুন যা উত্তর দিতে ক্লায়েন্ট বাধ্য হয়।
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Action Button for Mobile only */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-2xl mx-auto lg:hidden">
        <Link
          href="/assistant"
          className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[16px] shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Sparkles className="size-5" />
          এই কাঠামোয় খসড়া লিখুন
        </Link>
      </div>
    </div>
  );
}
