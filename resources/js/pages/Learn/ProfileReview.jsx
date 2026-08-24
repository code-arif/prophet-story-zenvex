import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 13 — Profile Review · প্রোফাইল রিভিউ
 * Dual Mode: Form Input OR Review Output Results (Segmented Control Tabs: Headline, Bio, Samples).
 * Responsive 2-column desktop layout using max-w-5xl width.
 */
export default function ProfileReview({ review }) {
  const { t } = useI18n();

  // Mode state: 'results' if review exists or after submit, else 'form'
  const [mode, setMode] = useState(review ? 'results' : 'form');

  // Form State
  const [niche, setNiche] = useState('ইউটিউব থাম্বনেইল ডিজাইন');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [portfolios, setPortfolios] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Segmented Tab in Results Mode (0: Headline, 1: Bio, 2: Samples)
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const addPortfolioField = () => {
    if (portfolios.length < 5) {
      setPortfolios((prev) => [...prev, '']);
    }
  };

  const updatePortfolio = (index, value) => {
    setPortfolios((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removePortfolio = (index) => {
    setPortfolios((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    router.post(
      '/learn/profile-review',
      {
        niche,
        headline,
        bio,
        portfolio: JSON.stringify(portfolios),
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          setMode('results');
        },
        onError: () => {
          setIsSubmitting(false);
          setMode('results');
        },
      }
    );
  };

  // Results Content according to Active Tab (Headline, Bio, Samples)
  const tabContent = [
    {
      label: 'শিরোনাম',
      original: headline || 'I design thumbnails for youtube',
      rewritten:
        'High-CTR YouTube Thumbnail Design to Grow Your Views & Clicks',
      concerns: [
        'প্রথম বাক্যেই কাজের ফল পরিষ্কার নয়',
        'কীওয়ার্ডের অভাব রয়েছে',
        'অতিরিক্ত সাধারণ বর্ণনা',
      ],
    },
    {
      label: 'পরিচিতি',
      original:
        bio ||
        'I am a graphic designer working on youtube thumbnails and channel banners.',
      rewritten:
        'Help YouTube Creators increase CTR by 30% through high-impact thumbnail designs & visual branding. 50+ successful projects delivered.',
      concerns: [
        'কাজের ফলাফলের সংখ্যা বা মেট্রিক্স উল্লেখ নেই',
        'অভিজ্ঞতার সুনির্দিষ্ট প্রমাণ দেওয়া হয়নি',
      ],
    },
    {
      label: 'নমুনা',
      original:
        portfolios[0] || 'Here is my thumbnail work for gaming channel.',
      rewritten:
        'Case Study: Gaming Thumbnail Redesign that increased impressions by 45% in 7 days. [Portfolio Link]',
      concerns: [
        'পোর্টফোলিও বর্ণনায় কেস স্টাডি ফর্ম্যাট অনুপস্থিত',
        'পূর্বের ও পরের ইমপ্যাক্ট লিঙ্ক নেই',
      ],
    },
  ];

  const currentTabContent = tabContent[activeTab];

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="প্রোফাইল রিভিউ — ইজি রাইজ" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রোফাইল রিভিউ
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            AI দ্বারা আপনার প্রোফাইলের লেখা বিশ্লেষণ ও পেশাদার রূপান্তর
          </p>
        </div>
      </div>

      {/* Dual View Mode: Results View vs Input Form */}
      {mode === 'results' ? (
        /* Results View matching HTML Prompt Spec */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Segmented Control & Result Card (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Segmented Control Tabs */}
            <div className="glass rounded-xl p-1 flex justify-between gap-1 border border-slate-100 shadow-xs">
              {tabContent.map((tab, idx) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-[14px] text-center transition-all active:scale-95 ${
                    activeTab === idx
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-slate-600 hover:text-ink hover:bg-slate-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Result Card */}
            <div className="glass rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
              
              {/* Original User Text */}
              <div className="space-y-1.5">
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  আপনার লেখা
                </span>
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5">
                  <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                    {currentTabContent.original}
                  </p>
                </div>
              </div>

              {/* Rewritten Text */}
              <div className="space-y-1.5 relative">
                <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wider">
                  পুনর্লিখিত
                </span>
                <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 relative group shadow-2xs">
                  <p className="text-[14.5px] font-bold text-ink leading-relaxed pr-10">
                    {currentTabContent.rewritten}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentTabContent.rewritten)}
                    className="absolute bottom-3 right-3 size-9 rounded-full bg-white hover:bg-purple-50 text-purple-700 shadow-sm flex items-center justify-center transition-all active:scale-90"
                    title="কপি করুন"
                  >
                    {copied ? (
                      <Check className="size-4 stroke-[3] text-emerald-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <hr className="border-slate-100 my-2" />

              {/* Feedback Section: Client Concerns */}
              <div className="space-y-3">
                <h3 className="text-[14.5px] font-bold text-ink">
                  ক্লায়েন্ট কোথায় সন্দেহ করবেন
                </h3>

                <ul className="space-y-3">
                  {currentTabContent.concerns.map((concern, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <div className="flex-1 flex justify-between items-start gap-2">
                        <p className="text-[13.5px] text-slate-700 font-medium leading-snug flex-1">
                          {concern}
                        </p>
                        <Link
                          href="/learn/checklist"
                          className="text-[12.5px] font-bold text-purple-700 hover:underline shrink-0 flex items-center gap-0.5"
                        >
                          চেকলিস্টে দেখুন <ChevronRight className="size-3" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Re-create Action Button */}
            <div className="pt-2 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode('form')}
                className="w-full h-12 rounded-xl border-2 border-purple-600 text-purple-700 hover:bg-purple-50 font-bold text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RefreshCw className="size-4" />
                আবার তৈরি করুন
              </button>
              <span className="text-[12px] font-medium text-slate-400">
                আগেরটি মুছে যাবে
              </span>
            </div>

          </div>

          {/* Right Column: AI Assistant & Checklist Banner (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            
            <div className="glass p-5 rounded-2xl border border-violet-100 shadow-sm space-y-4 bg-gradient-to-br from-violet-600 to-purple-800 text-white">
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Sparkles className="size-5" />
              </div>

              <div>
                <h3 className="text-[17px] font-bold text-white">
                  সম্পূর্ণ প্রোফাইল ড্রাফট করুন
                </h3>
                <p className="text-[12.5px] text-violet-100 mt-1 leading-relaxed">
                  এই পুনর্লিখিত শিরোনাম ও পরিচিতি ব্যবহার করে AI সহকারীর সাহায্য নিন।
                </p>
              </div>

              <Link
                href="/assistant"
                className="w-full py-3 px-4 rounded-xl bg-white text-violet-700 font-bold text-[14px] hover:bg-violet-50 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="size-4 text-violet-700" />
                সহায়কের সাথে কথা বলুন
              </Link>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <Lightbulb className="size-4 text-amber-500" />
                পোর্টফোলিও চেকলিস্ট টিপস
              </h3>
              
              <div className="space-y-2 text-[13px] text-slate-600 leading-relaxed">
                <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  • শিরোনামে সবসময় ক্লায়েন্টের মূল সুফল ও কিওয়ার্ড যুক্ত করুন।
                </p>
                <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  • সাধারণ বর্ণনার বদলে সংখ্যা ও মেট্রিক্স দিয়ে পারফর্মেন্স দেখান।
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Form Input Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="glass rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
              
              <div className="p-5 bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-white border-l-4 border-purple-600 relative overflow-hidden flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-ink leading-tight">
                    নিজের লেখাটা বসিয়ে দিন
                  </h2>
                  <p className="text-[13px] text-slate-600 mt-1 font-medium">
                    AI আপনার বর্তমান প্রোফাইল পড়ে ক্লায়েন্ট আকর্ষণ করার পরামর্শ দেবে।
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="p-5 space-y-4 bg-white">
                
                {/* Input 1: Niche */}
                <div className="space-y-1.5">
                  <label className="block text-[13.5px] font-bold text-ink">
                    লক্ষ্য নিশ
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="যেমন: ইউটিউব থাম্বনেইল ডিজাইন"
                    className="w-full h-12 px-4 bg-purple-50/30 border border-slate-300 rounded-xl text-[14.5px] font-bold text-ink focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                  />
                </div>

                {/* Input 2: Headline */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13.5px] font-bold text-ink">
                      প্রোফাইলের শিরোনাম (Headline)
                    </label>
                    <span className="text-[12px] font-bold text-slate-400">
                      {toBnDigits(headline.length)}/১০০
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value.slice(0, 100))}
                    placeholder="এখন যা লেখা আছে হুবহু বসান"
                    className="w-full p-3.5 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Input 3: Bio */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13.5px] font-bold text-ink">
                      পরিচিতি (Bio)
                    </label>
                    <span className="text-[12px] font-bold text-slate-400">
                      {toBnDigits(bio.length)}/৫০০
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    placeholder="এখন যা লেখা আছে হুবহু বসান"
                    className="w-full p-3.5 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Input 4: Portfolio descriptions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13.5px] font-bold text-ink">
                      পোর্টফোলিওর বর্ণনা
                    </label>
                    <span className="text-[12px] font-bold text-slate-400">
                      {toBnDigits(portfolios.length)}/৩টি
                    </span>
                  </div>

                  {portfolios.map((pText, pIdx) => (
                    <div key={pIdx} className="relative">
                      <textarea
                        rows={2}
                        value={pText}
                        onChange={(e) => updatePortfolio(pIdx, e.target.value.slice(0, 300))}
                        placeholder={`নমুনা ${toBnDigits(pIdx + 1)} এর বিবরণ বসান`}
                        className="w-full p-3.5 pr-10 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all resize-none leading-relaxed"
                      />
                      {portfolios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePortfolio(pIdx)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="রিমুভ করুন"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {portfolios.length < 5 && (
                    <button
                      type="button"
                      onClick={addPortfolioField}
                      className="text-[13.5px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 mt-2 transition-colors active:scale-95"
                    >
                      <Plus className="size-4" />
                      আরেকটি নমুনা যোগ করুন
                    </button>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[12px] text-slate-500 text-center mb-2">
                    ফল আপনার অ্যাকাউন্টে সুরক্ষিতভাবে সংরক্ষিত থাকবে
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[16px] shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
                  >
                    <Sparkles className="size-5" />
                    {isSubmitting ? 'বিশ্লেষণ করা হচ্ছে...' : 'একবার রিভিউ করুন'}
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
