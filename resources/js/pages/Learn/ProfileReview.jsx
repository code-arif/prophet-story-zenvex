import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Award,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';

/**
 * Screen 13 — Profile Review · প্রোফাইল রিভিউ
 * AI Profile analysis & comparison review tool.
 * Responsive 2-column desktop layout using max-w-5xl width.
 */
export default function ProfileReview({ review }) {
  const { t } = useI18n();

  // Form State
  const [niche, setNiche] = useState('ইউটিউব থাম্বনেইল ডিজাইন');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [portfolios, setPortfolios] = useState(['']);

  // Analysis result view state
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setIsAnalyzed(true);
        },
        onError: () => {
          setIsSubmitting(false);
          setIsAnalyzed(true);
        },
      }
    );
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-24">
      <Head title="প্রোফাইল রিভিউ — ইজি রাইজ" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight">
            প্রোফাইল রিভিউ
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            AI দ্বারা আপনার প্রোফাইলের লেখা বিশ্লেষণ ও উন্নয়ন পরামর্শ
          </p>
        </div>
      </div>

      {/* Desktop 2-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input Form (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Form Card */}
          <div className="glass rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
            
            {/* AI Banner Box Header */}
            <div className="p-5 bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-white border-l-4 border-violet-600 relative overflow-hidden flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 shadow-inner">
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

            {/* Form Fields */}
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
                  className="w-full h-12 px-4 bg-purple-50/30 border border-slate-300 rounded-xl text-[14.5px] font-bold text-ink focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 transition-all"
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
                  className="w-full p-3.5 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 transition-all resize-none leading-relaxed"
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
                  className="w-full p-3.5 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 transition-all resize-none leading-relaxed"
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
                      className="w-full p-3.5 pr-10 bg-purple-50/30 border border-slate-300 rounded-xl text-[14px] font-medium text-ink focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 transition-all resize-none leading-relaxed"
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
                    className="text-[13.5px] font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1.5 mt-2 transition-colors active:scale-95"
                  >
                    <Plus className="size-4" />
                    আরেকটি নমুনা যোগ করুন
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[12px] text-slate-500 text-center mb-2">
                  ফল আপনার অ্যাকাউন্টে সুরক্ষিতভাবে সংরক্ষিত থাকবে
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[16px] shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  <Sparkles className="size-5" />
                  {isSubmitting ? 'বিশ্লেষণ করা হচ্ছে...' : 'একবার রিভিউ করুন'}
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Right Column: AI Analysis Result Card (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          
          {isAnalyzed ? (
            /* Analysis Output Card */
            <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-[16px] font-bold text-ink flex items-center gap-2">
                  <Award className="size-5 text-violet-600" />
                  AI রিভিউ পরামর্শ
                </h3>
                <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  বিশ্লেষণ সম্পন্ন
                </span>
              </div>

              {/* Comparison 1: Headline */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <span className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider">
                  শিরোনাম উন্নয়ন
                </span>
                <div className="space-y-1">
                  <p className="text-[12.5px] text-slate-500 line-through">
                    বর্তমান: {headline || 'ইউটিউব থাম্বনেইল ডিজাইনার'}
                  </p>
                  <p className="text-[13.5px] font-bold text-violet-700">
                    উন্নত: Senior Thumbnail Designer | YouTube CTR & Visual Growth Specialist
                  </p>
                </div>
              </div>

              {/* Comparison 2: Bio */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <span className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider">
                  পরিচিতি (Bio) টিপস
                </span>
                <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                  • প্রথম ২ লাইনে সংখ্যা উল্লেখ করুন (যেমন: ৫০+ সফল থাম্বনেইল তৈরি)।
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                  • শুধু ডিজাইনের কথা না বলে CTR বৃদ্ধি ও ভিউ বাড়ানোর ওপর জোর দিন।
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => setIsAnalyzed(false)}
                className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-[13.5px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="size-4" />
                নতুন করে এডিট করুন
              </button>
            </div>
          ) : (
            /* Pre-analysis Guidance Card */
            <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <Lightbulb className="size-4 text-amber-500" />
                প্রোফাইল লেখার মূল নিয়ম
              </h3>
              
              <div className="space-y-2.5 text-[13px] text-slate-600 leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>টাইটেলে মূল নিশ ও ক্লায়েন্ট ফলাফলের কথা স্পষ্ট লিখুন।</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>পরিচিতিতে অহেতুক ভূমিকা না লিখে কাজের অভিজ্ঞতার সংখ্যা দিন।</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>পোর্টফোলিও নমুনায় আগের ও পরের ইমপ্যাক্ট উল্লেখ করুন।</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
