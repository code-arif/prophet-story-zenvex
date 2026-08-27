import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle2,
  Printer,
  Sparkles,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

export default function Terms() {
  const pageProps = usePage().props;
  const auth = pageProps?.auth;
  const subscriber = pageProps?.subscriber;
  const user = pageProps?.user;
  const isLoggedIn = Boolean(auth?.isLoggedIn || auth?.user || user || subscriber);

  const lastUpdated = '২৫ আগস্ট, ২০২৬';

  const sections = [
    {
      id: 'introduction',
      title: '১. ভূমিকা ও প্ল্যাটফর্ম পরিচিতি',
      icon: Sparkles,
      content: [
        'easy rise (ইজি রাইজ) প্ল্যাটফর্মে আপনাকে স্বাগতম। এই অ্যাপ বা সার্ভিসটি ব্যবহারের মাধ্যমে আপনি এখানে বর্ণিত ব্যবহারের শর্তাবলী (Terms of Service) মেনে নিতে সম্মতি প্রদান করছেন।',
        'easy rise হলো ফ্রিল্যান্সারদের জন্য একটি স্মার্ট অপারেটিং সিস্টেম, যা প্রজেক্ট ম্যানেজমেন্ট, ট্রু আওয়ারলি রেট ক্যালকুলেটর, ইনকাম প্রুফ জেনারেটর এবং AI এসিস্ট্যান্ট সার্ভিস প্রদান করে থাকে।',
      ],
    },
    {
      id: 'verification',
      title: '২. একাউন্ট তৈরি ও ভেরিফিকেশন',
      icon: Lock,
      content: [
        'অ্যাপের সেবাসমূহ ব্যবহার করতে আপনার সঠিক বাংলাদেশি মোবাইল নম্বর দিয়ে এসএমএস ওটিপি (OTP) ভেরিফিকেশনের মাধ্যমে একাউন্ট অ্যাক্সেস করতে হবে।',
        'আপনার মোবাইল নম্বর ও সেশন সিকিউরিটির সম্পূর্ণ দায়িত্ব আপনার। কোনো অননুমোদিত অ্যাক্সেস রোধে আপনার ডিভাইসটি সুরক্ষিত রাখুন।',
        'গেস্ট মোড (Guest Mode) ব্যবহারকারীদের জন্য কিছু সীমিত ফিচার উন্মুক্ত থাকবে, যা যেকোনো সময় নীতিমালার অধীনে পরিবর্তিত হতে পারে।',
      ],
    },
    {
      id: 'subscription',
      title: '৩. সার্ভিস ও সাবস্ক্রিপশন নীতিমালা',
      icon: Clock,
      content: [
        'easy rise অ্যাপের প্রিমিয়াম ফিচারসমূহের জন্য দৈনিক/মাসিক সাবস্ক্রিপশন চার্জ প্রযোজ্য হতে পারে। ভ্যাট, এসডি এবং সারচার্জ যুক্ত হয়ে এই চার্জ নির্ধারিত টেলিকম অপারেটর এর মাধ্যমে কাটা হতে পারে।',
        'যেকোনো সময় ইউজার চাইলে SMS (যেমন: STOP E1351) পাঠানোর মাধ্যমে অথবা অ্যাপের সেটিংস থেকে সাবস্ক্রিপশন বাতিল বা আনসাবস্ক্রাইব করতে পারবেন।',
        'সাবস্ক্রিপশন সফলভাবে বাতিল হওয়ার পর পরবর্তী কোনো অটো-রিনিউয়াল চার্জ কাটা হবে না।',
      ],
    },
    {
      id: 'privacy',
      title: '৪. ডাটা সিকিউরিটি ও গোপনীয়তা',
      icon: ShieldCheck,
      content: [
        'আপনার ক্লায়েন্ট ইনফরমেশন, ইনকাম হিস্টোরি এবং কাজের রেকর্ডসমূহ আপনার ডিভাইসে ও এনক্রিপ্টেড ডাটাবেজে সুরক্ষিত রাখা হয়।',
        'আমরা কখনো আপনার ব্যক্তিগত ক্লায়েন্ট ডাটা বা ফাইন্যান্সিয়াল রেকর্ড কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না।',
        'আপনার সম্মতিক্রমে অ্যাপের কার্যকারিতা বজায় রাখার জন্য প্রয়োজনীয় ডাটা প্রসেস করা হয়ে থাকে।',
      ],
    },
    {
      id: 'ai-tools',
      title: '৫. AI টুলস ও স্কোপ গার্ড ব্যবহারবিধি',
      icon: Scale,
      content: [
        'easy rise-এর AI কভার লেটার ড্রাফটার, স্কোপ গার্ড এবং স্মার্ট প্রপোজাল টুলস আপনার কাজের সহায়তার জন্য আউটপুট জেনারেট করে।',
        'AI আউটপুট চূড়ান্তভাবে ক্লায়েন্টকে পাঠানোর আগে রিভিউ করে নেওয়া ইউজারের নিজের দায়িত্ব।',
        'অ্যাপের কোনো ফিচার বা AI সার্ভিস অনৈতিক, বেআইনি বা কোনো স্প্যাম কাজের জন্য ব্যবহার করা কঠোরভাবে নিষিদ্ধ।',
      ],
    },
    {
      id: 'liability',
      title: '৬. দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)',
      icon: FileText,
      content: [
        'easy rise ফ্রিল্যান্সারদের কাজের গতি বৃদ্ধি ও হিসাব সংরক্ষণে সহায়তা প্রদান করে, তবে কোনো থার্ড-পার্টি ফ্রিল্যান্স মার্কেটপ্লেসের সিদ্ধান্ত বা ইনকামের নিশ্চয়তা প্রদান করে না।',
        'টেলিকম নেটওয়ার্কের ত্রুটি বা ডিভাইসের প্রযুক্তিগত সমস্যার কারণে সাময়িক সার্ভিস ব্যাঘাত ঘটলে কর্তৃপক্ষ দ্রুত তা সমাধানের চেষ্টা করবে।',
      ],
    },
    {
      id: 'changes',
      title: '৭. শর্তাবলী পরিবর্তন ও যোগাযোগ',
      icon: HelpCircle,
      content: [
        'easy rise যেকোনো সময় এই ব্যবহারের শর্তাবলী সংশোধন বা আপডেট করার অধিকার সংরক্ষণ করে। পরিবর্তিত শর্তাবলী প্ল্যাটফর্মে প্রকাশের সাথে সাথেই কার্যকর হবে।',
        'যেকোনো নিয়মাবলী বা সাবস্ক্রিপশন সংক্রান্ত জিজ্ঞাসার জন্য আমাদের সাপোর্ট সেন্টারে বা ইমেইলে (support@easyrise.dev) যোগাযোগ করতে পারেন।',
      ],
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-dvh bg-[#F6F8FE] text-ink font-sans selection:bg-brand selection:text-white relative overflow-hidden font-bn">
      <Head title="ব্যবহারের শর্তাবলী — easy rise" />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -z-10 size-[500px] opacity-20 pointer-events-none bg-brand rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 -z-10 size-[450px] opacity-15 pointer-events-none bg-ai rounded-full blur-[130px]" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border-rest/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="easy rise logo"
              className="size-9 object-contain rounded-xl shadow-md shadow-brand/20 transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-ink">easy rise</span>
                <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand">OS 2.0</span>
              </div>
              <span className="text-[10px] text-muted block -mt-0.5">ব্যবহারের শর্তাবলী</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-rest bg-white text-[12px] font-bold text-muted hover:text-brand hover:border-brand/30 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              প্রিন্ট করুন
            </button>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand text-white text-[12px] font-bold hover:bg-brand-dark transition-colors shadow-sm"
              >
                <ArrowLeft className="size-3.5" />
                লগইন পেজ
              </Link>
            ) : (
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand text-white text-[12px] font-bold hover:bg-brand-dark transition-colors shadow-sm"
              >
                <ArrowLeft className="size-3.5" />
                হোম পেজ
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Banner Card */}
        <div className="rounded-2xl border border-white/90 bg-gradient-to-br from-white via-blue-50/40 to-white p-6 sm:p-8 shadow-[0px_10px_30px_rgba(14,22,38,0.04)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-rest/60 pb-6 mb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold">
                <Scale className="size-3.5" />
                আইনি নীতিমালা ও টার্মস
              </div>
              <h1 className="text-[26px] sm:text-[32px] font-black text-ink tracking-tight">
                ব্যবহারের শর্তাবলী (Terms of Service)
              </h1>
            </div>
            <div className="text-[12px] text-muted flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg shrink-0">
              <Clock className="size-3.5 text-brand" />
              সর্বশেষ আপডেট: {lastUpdated}
            </div>
          </div>

          <p className="text-[14px] sm:text-[15px] leading-relaxed text-muted font-medium">
            easy rise (ইজি রাইজ) অ্যাপ্লিকেশনটি ব্যবহারের পূর্বে অনুগ্রহ করে নিচের শর্তাবলী ভালো করে পড়ে নিন। এই শর্তাবলী আমাদের প্ল্যাটফর্ম ব্যবহারের নিয়মকানুন, ইউজার অধিকার এবং সিকিউরিটি নীতিমালা নির্দেশ করে।
          </p>

          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border-rest/60">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border-rest/70 text-[12px] font-bold text-ink">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>নিরাপদ ডাটা এনক্রিপশন</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border-rest/70 text-[12px] font-bold text-ink">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>সহজ সাবস্ক্রিপশন ক্যানসেল</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border-rest/70 text-[12px] font-bold text-ink">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>২৪/৭ স্বচ্ছ নীতিমালা</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="space-y-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className="rounded-2xl border border-white/90 bg-white p-6 sm:p-8 shadow-[0px_8px_24px_rgba(14,22,38,0.03)] transition-all hover:shadow-[0px_12px_32px_rgba(14,22,38,0.05)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-ink">{sec.title}</h2>
                </div>

                <div className="space-y-3 pl-0 sm:pl-13 text-[13px] sm:text-[14px] leading-relaxed text-muted font-medium">
                  {sec.content.map((paragraph, index) => (
                    <p key={index} className="flex items-start gap-2">
                      <ChevronRight className="size-4 text-brand shrink-0 mt-1" />
                      <span>{paragraph}</span>
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Callout & Back to Home/Login Action */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand via-blue-600 to-brand-dark text-white p-6 sm:p-8 shadow-lg shadow-brand/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-[18px] font-bold">শর্তাবলী বিষয়ে সম্মত আছেন?</h3>
            <p className="text-[13px] text-white/80">
              {isLoggedIn
                ? 'easy rise ব্যবহার অব্যাহত রেখে ক্যারিয়ার গতিময় রাখুন'
                : 'আপনার ফোন নম্বর দিয়ে সহজেই লগইন করে এখনই শুরু করুন easy rise'}
            </p>
          </div>
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand text-[14px] font-bold hover:bg-slate-50 transition-transform active:scale-95 shadow-md shrink-0"
            >
              লগইন পেজে যান
              <ArrowLeft className="size-4 rotate-180" />
            </Link>
          ) : (
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand text-[14px] font-bold hover:bg-slate-50 transition-transform active:scale-95 shadow-md shrink-0"
            >
              হোম পেজে যান
              <ArrowLeft className="size-4 rotate-180" />
            </Link>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-8 text-center text-[12px] text-muted space-y-1">
          <p>© {new Date().getFullYear()} easy rise OS 2.0। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-[11px] text-muted/70">হেল্প ও সাপোর্টের জন্য মেইল করুন: support@easyrise.dev</p>
        </footer>
      </main>
    </div>
  );
}
