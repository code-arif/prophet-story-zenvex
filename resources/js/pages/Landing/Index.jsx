import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Wallet,
  BookOpen,
  Bot,
  CheckCircle2,
  Smartphone,
  Globe,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Zap,
  Users,
  BarChart3,
  FileCheck,
  Sparkles,
  Lock,
  PieChart,
  Clock,
  ArrowUpRight,
  Calculator,
  HelpCircle,
  Check,
  X,
  ChevronDown,
  Layers,
  Award,
  Activity,
  Compass,
  FileText,
  DollarSign,
  ShieldCheck,
  Sparkle,
  Terminal,
  Cpu,
  AlertTriangle,
  Send,
  Download,
  Flame,
  CheckSquare,
  Sliders,
  RefreshCw,
  Eye,
  Building,
} from 'lucide-react';

/* ── Motion Variants & Animation Helpers ──────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.05, ease: [0.34, 1.4, 0.64, 1] },
  }),
};

function Animate({ children, variants = fadeUp, custom = 0, className = '', ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      custom={custom}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Ambient Floating Glows ───────────────────────────────────── */

function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-brand/10 via-blue-400/8 to-ai/6 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-ai/10 via-purple-400/6 to-brand/6 blur-[110px]"
        animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Top Navigation Bar ───────────────────────────────────────── */

function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 right-0 left-0 z-50 px-3 py-2 sm:px-6 sm:py-3"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border border-white/90 shadow-[0_6px_24px_rgba(14,22,38,0.05)] rounded-full backdrop-blur-xl bg-white/85">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="easy rise logo"
              className="size-8 sm:size-9 object-contain rounded-xl shadow-md shadow-brand/20 transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] sm:text-[15px] font-bold leading-tight tracking-tight text-ink">easy rise</p>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-brand">OS 2.0</span>
              </div>
              <p className="text-[10px] sm:text-[11px] leading-tight text-muted font-bn">ইজি রাইজ প্ল্যাটফর্ম</p>
            </div>
          </Link>

          {/* Nav Links — Desktop */}
          <div className="hidden items-center gap-6 lg:flex">
            <a href="#features" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              ফিচারসমূহ
            </a>
            <a href="#scope-guard" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              স্কোপ গার্ড
            </a>
            <a href="#ladder" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              রাইজ ল্যাডার
            </a>
            <a href="#ai-assistant" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              AI অ্যাসিস্ট্যান্ট
            </a>
            <a href="#calculator" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              আয় ক্যালকুলেটর
            </a>
            <a href="#faq" className="text-[13px] font-semibold text-muted transition-colors hover:text-brand font-bn">
              প্রশ্নাবলী
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-[13px] sm:text-[14px] font-bold text-ink transition-colors hover:text-brand font-bn px-2.5 py-1.5"
            >
              লগইন
            </Link>
            <Link
              href="/login"
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-2 sm:px-5 sm:py-2.5 text-[12px] sm:text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(29,111,242,0.25)] transition-all hover:shadow-[0_6px_18px_rgba(29,111,242,0.35)] active:scale-[0.98] font-bn"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                শুরু করুন
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

/* ── REFINED LIGHT THEME HERO SECTION ─────────────────────────── */

function Hero() {
  const [activeTab, setActiveTab] = useState('today');

  const tabPreviews = {
    today: {
      title: 'আজকের ড্যাশবোর্ড (Today Hub)',
      subtitle: 'দৈনিক কাজ, বকেয়া পেমেন্ট এবং কাজের সমাহার সব এক স্ক্রিনে।',
      metric1: { label: 'আজকের পেন্ডিং কাজ', val: '৩ টি', sub: '২ টি হাই প্রায়োরিটি' },
      metric2: { label: 'চলতি মাসের নেট আয়', val: '৳৭৮,৫০০', sub: '+২৮% গত মাসের চেয়ে' },
      badge: 'লাইভ প্রজেক্ট ট্র্যাকার',
      progressPct: 80,
      clientName: 'Client: Apex Software US ($650)',
    },
    work: {
      title: 'ওয়ার্ক পাইপলাইন & স্কোপ গার্ড',
      subtitle: 'ক্লায়েন্টের অতিরিক্ত কাজের চাহিদার বিরুদ্ধে অটোমেশন ট্র্যাকিং।',
      metric1: { label: 'এক্টিভ জব পাইপলাইন', val: '৫ টি', sub: '২ টি ডেলিভারি অপেক্ষায়' },
      metric2: { label: 'সুরক্ষিত স্কোপ ভ্যালু', val: '৳২৭,০০০', sub: 'স্কোপ লিকেজ রোধ' },
      badge: 'স্কোপ গার্ড একটিভ',
      progressPct: 45,
      clientName: 'Client: FinTech App ($1,200)',
    },
    money: {
      title: 'টাকা ও ট্রু আওয়ারলি ক্যালকুলেটর',
      subtitle: 'প্রকৃত ঘণ্টা ভিত্তিক নেট লাভ হিসাব করুন সহজে।',
      metric1: { label: 'ট্রু আওয়ারলি লাভ', val: '$২৮.৫০ /ঘণ্টা', sub: 'নেট প্রফিট হিসাব' },
      metric2: { label: 'ফাইন্যান্সিয়াল রানওয়ে', val: '৫.৪ মাস', sub: 'সেফটি ফান্ড গ্যারান্টি' },
      badge: 'ব্যাংক প্রুফ জেনারেটেড',
      progressPct: 95,
      clientName: 'A4 Income Statement Active',
    },
    ai: {
      title: 'AI কভার লেটার & স্ক্রিপ্ট জেনারেটর',
      subtitle: 'কাজ পাওয়ার সম্ভাবনা বাড়াতে মুহূর্তেই কাস্টম কভার লেটার।',
      metric1: { label: 'জেনারেটেড প্রপোজাল', val: '১৮ টি', sub: '৮৮% উইন রেট' },
      metric2: { label: 'রেসপন্স রেট', val: '৩.৫x বেশি', sub: 'স্মার্ট ক্লায়েন্ট রিপ্লাই' },
      badge: 'AI প্রপোজাল তৈরি',
      progressPct: 100,
      clientName: 'Upwork Proposal Engine',
    },
  };

  const currentPreview = tabPreviews[activeTab];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF4FF] via-white to-[#F6F8FE] pt-24 sm:pt-28 pb-14 sm:pb-20">
      <FloatingBlobs />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #1D6FF2 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero Top Copy */}
        <div className="mx-auto max-w-3xl text-center">
          <Animate variants={fadeUp} custom={0}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-brand shadow-sm font-bn">
              <Sparkles className="size-3.5 text-brand animate-pulse" />
              <span>বাংলাদেশি ফ্রিল্যান্সার ও রিমোট ওয়ার্কারদের জন্য অল-ইন-ওয়ান সিস্টেম</span>
            </div>
          </Animate>

          <Animate variants={fadeUp} custom={1}>
            <h1 className="mb-4 font-bn text-[28px] leading-[1.2] font-black tracking-tight text-ink sm:text-[38px] md:text-[46px]">
              অতিরিক্ত কাজের চাপ বন্ধ করুন —
              <br />
              <span className="bg-gradient-to-r from-brand via-blue-600 to-ai bg-clip-text text-transparent">
                স্মার্ট পাইপলাইন ও ক্যারিয়ার সুরক্ষা
              </span>
            </h1>
          </Animate>

          <Animate variants={fadeUp} custom={2}>
            <p className="mb-7 text-[15px] leading-relaxed text-muted font-bn sm:text-[17px] max-w-2xl mx-auto font-medium">
              প্রজেক্ট ট্র্যাকিং, স্কোপ গার্ড, ট্রু আওয়ারলি রেট এবং ব্যাংক-রেডি ইনকাম প্রুফ — সবকিছু সহজ বাংলায়, লোকাল ডিভাইস ডাটাবেজে।
            </p>
          </Animate>

          <Animate variants={fadeUp} custom={3}>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-blue-600 to-brand-dark px-7 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(29,111,242,0.3)] transition-all hover:shadow-[0_10px_28px_rgba(29,111,242,0.4)] active:scale-[0.98] font-bn"
              >
                এখনই শুরু করুন
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#scope-guard"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-border-outline/80 bg-white/90 px-7 text-[14px] font-bold text-ink backdrop-blur-md transition-all hover:border-brand/40 hover:bg-white active:scale-[0.98] font-bn shadow-sm"
              >
                <ShieldCheck className="size-4 text-emerald-600" />
                স্কোপ গার্ড দেখুন
              </a>
            </div>
          </Animate>

          <Animate variants={fadeUp} custom={4}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[12px] sm:text-[13px] font-semibold text-muted font-bn">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                ২ মিনিটে ইনস্ট্যান্ট সেটআপ
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                ফোন নম্বর দিয়েই সাইনইন
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                নিরাপদ IndexedDB ডাটা সেভ
              </span>
            </div>
          </Animate>
        </div>

        {/* Orbiting Telemetry Badges & App Console Showcase */}
        <Animate variants={scaleIn} custom={5} className="mt-12 sm:mt-14 relative">
          {/* Floating Telemetry Badge 1 - Left */}
          <motion.div
            className="absolute -top-5 -left-3 z-30 hidden lg:flex items-center gap-2.5 rounded-2xl border border-emerald-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-4" />
            </div>
            <div className="font-bn text-left">
              <p className="text-[10px] font-bold text-emerald-700">স্কোপ গার্ড প্রোটেকশন</p>
              <p className="text-[12px] font-extrabold text-ink">৩ টি অতিরিক্ত কাজ আটকানো হয়েছে</p>
            </div>
          </motion.div>

          {/* Floating Telemetry Badge 2 - Right */}
          <motion.div
            className="absolute -bottom-5 -right-3 z-30 hidden lg:flex items-center gap-2.5 rounded-2xl border border-brand/20 bg-white/95 p-3 shadow-lg backdrop-blur-xl"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <TrendingUp className="size-4" />
            </div>
            <div className="font-bn text-left">
              <p className="text-[10px] font-bold text-brand">ট্রু আওয়ারলি রেট</p>
              <p className="text-[12px] font-extrabold text-ink">$২৮.৫০ /ঘণ্টা (প্রকৃত লাভ)</p>
            </div>
          </motion.div>

          {/* Main Work Console Frame */}
          <div className="relative mx-auto max-w-4xl rounded-[24px] sm:rounded-[28px] border border-white/90 bg-white/85 p-3 sm:p-5 shadow-[0_16px_50px_rgba(14,22,38,0.08)] backdrop-blur-2xl">
            {/* Top Console Bar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border-rest/60 pb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-rose-400" />
                  <div className="size-2.5 rounded-full bg-amber-400" />
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-1.5 text-[11px] font-bold text-muted tracking-wide uppercase font-bn flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-brand" /> easy rise app workspace console
                </span>
              </div>

              {/* Tab Selector Buttons — Scrollable on Mobile */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/60 overflow-x-auto max-w-full">
                {[
                  { id: 'today', label: 'আজ', icon: Zap },
                  { id: 'work', label: 'কাজ', icon: Briefcase },
                  { id: 'money', label: 'টাকা', icon: Wallet },
                  { id: 'ai', label: 'AI সহায়ক', icon: Bot },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-bold transition-all whitespace-nowrap font-bn ${
                        isActive
                          ? 'bg-white text-brand shadow-sm'
                          : 'text-muted hover:text-ink hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`size-3 ${isActive ? 'text-brand' : 'text-muted'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Console Preview Window */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] p-4 sm:p-6 border border-border-rest/60"
              >
                <div className="grid gap-5 md:grid-cols-12 items-center">
                  {/* Specs Left */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand border border-brand/20 font-bn">
                      <Sparkle className="size-3" />
                      {currentPreview.badge}
                    </div>
                    <h3 className="font-bn text-[20px] sm:text-[24px] font-extrabold text-ink leading-snug">
                      {currentPreview.title}
                    </h3>
                    <p className="font-bn text-[13px] sm:text-[14px] text-muted leading-relaxed">
                      {currentPreview.subtitle}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="rounded-xl border border-border-rest/80 bg-white p-3 shadow-sm">
                        <p className="text-[11px] text-muted font-bn">{currentPreview.metric1.label}</p>
                        <p className="text-[17px] sm:text-[19px] font-extrabold text-ink tracking-tight mt-0.5">{currentPreview.metric1.val}</p>
                        <p className="text-[10px] font-bold text-emerald-600 font-bn mt-0.5">{currentPreview.metric1.sub}</p>
                      </div>
                      <div className="rounded-xl border border-border-rest/80 bg-white p-3 shadow-sm">
                        <p className="text-[11px] text-muted font-bn">{currentPreview.metric2.label}</p>
                        <p className="text-[17px] sm:text-[19px] font-extrabold text-brand tracking-tight mt-0.5">{currentPreview.metric2.val}</p>
                        <p className="text-[10px] font-bold text-brand/80 font-bn mt-0.5">{currentPreview.metric2.sub}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Interactive Mockup Window */}
                  <div className="md:col-span-5">
                    <div className="rounded-xl border border-brand/15 bg-white p-4 shadow-[0_8px_24px_rgba(29,111,242,0.06)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            <Activity className="size-3.5" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-ink font-bn">স্ট্যাটাস মনিটর</p>
                            <p className="text-[10px] text-muted font-bn">{currentPreview.clientName}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 font-bn">
                          একটিভ
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold font-bn text-ink">
                          <span>সম্পন্ন অগ্রগতি</span>
                          <span className="text-brand">{currentPreview.progressPct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            className="h-full bg-gradient-to-r from-brand via-blue-600 to-ai rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentPreview.progressPct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-muted font-bn">
                          <span>অফলাইন লোকাল ডাটা (Dexie)</span>
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Animate>
      </div>
    </section>
  );
}

/* ── Platform Telemetry Strip ─────────────────────────────────── */

const PLATFORM_STATS = [
  { val: '২,৪০০+', label: 'সক্রিয় বাংলাদেশি ফ্রিল্যান্সার', icon: Users },
  { val: '৳৪.৮ কোটি+', label: 'মোট ট্র্যাক করা আয়', icon: Wallet },
  { val: '১৮,০০০+', label: 'অটো সেভড স্কোপ গার্ড', icon: ShieldCheck },
  { val: '৯৯.৯%', label: 'অফলাইন ডাটা সেফটি', icon: Lock },
];

function PlatformStatsStrip() {
  return (
    <section className="bg-white border-y border-border-rest/60 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center font-bn">
          {PLATFORM_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-2xl border border-border-rest/70 bg-[#F8FAFC] p-4 sm:p-5 shadow-sm">
                <div className="mx-auto mb-1.5 flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-4.5" />
                </div>
                <p className="text-[20px] sm:text-[24px] font-black text-ink">{stat.val}</p>
                <p className="text-[12px] sm:text-[13px] font-semibold text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Interactive Scope Guard Simulator ────────────────────────── */

const SCOPE_ITEMS = [
  { id: 'extra_page', label: 'নতুন ১টি পেজ ডিজাইন অতিরিক্ত চাই', extraCost: '$১০০', warning: 'স্কোপের বাইরে! অতিরিক্ত চার্জ দরকার।' },
  { id: 'weekend_support', label: 'উইকেন্ডে জরুরি রেসপন্স দিতে হবে', extraCost: '$৭৫', warning: 'অফ-আওয়ার সার্ভিস ফি প্রযোজ্য।' },
  { id: 'unlimited_revisions', label: 'আনলিমিটেড কালার ও ফন্ট ভ্যারিয়েশন', extraCost: '$৫০', warning: 'সর্বোচ্চ ২টির বেশি হলে বাড়তি ফি।' },
];

function InteractiveScopeGuard() {
  const [selectedItems, setSelectedItems] = useState(['extra_page']);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedLeakage = selectedItems.length * 75;

  return (
    <section id="scope-guard" className="bg-white py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-[12px] font-bold text-rose-600 border border-rose-200 font-bn">
              <AlertTriangle className="size-3.5" />
              লাইভ স্কোপ গার্ড টেস্ট করুন
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              অনাকাঙ্ক্ষিত সার্ভিস চাওয়া ক্লায়েন্টকে সহজেই চার্জ করুন
            </h2>
            <p className="mt-2 font-bn text-[14px] sm:text-[15px] text-muted max-w-2xl mx-auto">
              নিচে ক্লায়েন্টের অতিরিক্ত আবদারগুলোতে টিক দিন এবং দেখুন easy rise কীভাবে সেগুলো সামলায়:
            </p>
          </div>
        </Animate>

        <div className="mx-auto max-w-4xl rounded-3xl border border-border-rest bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-5 sm:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-12 items-center font-bn">
            {/* Options Checkbox Left */}
            <div className="md:col-span-7 space-y-2.5">
              <p className="text-[12px] font-bold text-muted uppercase tracking-wider mb-1.5">
                ক্লায়েন্ট অতিরিক্ত কী চেয়েছেন?
              </p>
              {SCOPE_ITEMS.map((item) => {
                const isChecked = selectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'border-rose-300 bg-rose-50/70 text-ink shadow-sm'
                        : 'border-border-rest bg-white text-muted hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex size-5 items-center justify-center rounded-md border ${isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {isChecked && <Check className="size-3.5" />}
                      </div>
                      <span className="text-[13px] sm:text-[14px] font-bold text-ink">{item.label}</span>
                    </div>
                    <span className="text-[12px] font-extrabold text-rose-600">{item.extraCost}</span>
                  </button>
                );
              })}
            </div>

            {/* Guarded Result Output Right */}
            <div className="md:col-span-5">
              <div className="rounded-xl border border-rose-200 bg-white p-5 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-[13px]">
                  <ShieldCheck className="size-4.5" />
                  <span>স্কোপ গার্ড রেসপন্স ইঞ্জিন</span>
                </div>

                <div className="border-y border-slate-100 py-2.5">
                  <p className="text-[11px] text-muted">অতিরিক্ত স্কোপ মূল্য:</p>
                  <p className="text-[24px] font-black text-rose-600">${calculatedLeakage} USD</p>
                  <p className="text-[10px] text-muted mt-0.5">কাজের সময় আনুমানিক +৮ ঘণ্টা</p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] sm:text-[12px] text-ink space-y-1 border border-slate-100">
                  <p className="font-bold text-brand">স্মার্ট ক্লায়েন্ট মেসেজ ড্রাফট:</p>
                  <p className="italic text-muted">
                    "Hi! I'd love to help with this additional request. As per our Scope Guard agreement, this comes to +${calculatedLeakage}. Shall I add a custom offer?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 90-Day Rise Ladder Career Roadmap ───────────────────────── */

const LADDER_STAGES = [
  {
    stage: 'লেভেল ০০',
    title: 'নবাগত ফ্রিল্যান্সার (Rookie)',
    rate: '$৫ - $১০/ঘণ্টা',
    desc: 'প্রথম কাজ খোঁজা, কভার লেটার লেখার অভ্যাস এবং নিচ পছন্দ করা।',
    icon: Compass,
    tools: ['নিচ স্কোরার', 'প্রোফাইল চেকলিস্ট', 'AI অ্যাসিস্ট্যান্ট'],
  },
  {
    stage: 'লেভেল ০১',
    title: 'প্রফেশনাল অপারেটর (Pro)',
    rate: '$১৫ - $২৫/ঘণ্টা',
    desc: 'স্থায়ী ক্লায়েন্ট তৈরি, সময়মতো ডেলিভারি এবং নিয়মিত স্কোপ ট্র্যাকিং।',
    icon: Briefcase,
    tools: ['ওয়ার্ক পাইপলাইন', 'স্কোপ গার্ড', 'ট্রু আওয়ারলি'],
  },
  {
    stage: 'লেভেল ০২',
    title: 'সোলো এজেন্সি হেড (Solo Agency)',
    rate: '$৩৫ - $৭০+/ঘণ্টা',
    desc: 'উচ্চ মূল্যের প্রজেক্ট, টিম আউটসোর্সিং এবং অফিশিয়াল ব্যাংক ইনকাম প্রুফ।',
    icon: Award,
    tools: ['ইনকাম প্রুফ', 'রানিং রানওয়ে', 'টিম ক্যাপাসিটি'],
  },
];

function RiseLadderRoadmap() {
  return (
    <section id="ladder" className="bg-[#F8FAFC] py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-[12px] font-bold text-brand border border-brand/20 font-bn">
              <TrendingUp className="size-3.5" />
              রাইজ ল্যাডার রোডম্যাপ
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              আপনার ক্যারিয়ারের পরবর্তী ধাপে ওঠার ধাপে ধাপ গাইড
            </h2>
            <p className="mt-2 font-bn text-[14px] sm:text-[15px] text-muted max-w-2xl mx-auto">
              রাইজ ল্যাডারের সাহায্যে মাত্র ৯০ দিনে আপনার আওয়ারলি রেট বৃদ্ধি করুন।
            </p>
          </div>
        </Animate>

        <div className="grid gap-5 md:grid-cols-3 font-bn">
          {LADDER_STAGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Animate key={item.stage} variants={scaleIn} custom={idx}>
                <div className="relative h-full rounded-2xl border border-border-rest/80 bg-white p-5 flex flex-col justify-between hover:border-brand/40 transition-all shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-extrabold text-brand border border-brand/20">
                        {item.stage}
                      </span>
                      <div className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <Icon className="size-4.5" />
                      </div>
                    </div>

                    <h3 className="text-[17px] font-bold text-ink mb-1">{item.title}</h3>
                    <p className="text-[13px] font-extrabold text-amber-600 mb-2">{item.rate}</p>
                    <p className="text-[12px] sm:text-[13px] text-muted leading-relaxed mb-4">{item.desc}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">আনলকড টুলস:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tools.map((t) => (
                        <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-ink border border-slate-200/60">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Animate>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── AI Assistant Interactive Chat Simulator ──────────────────── */

const AI_SCENARIOS = [
  { id: 'proposal', name: 'কভার লেটার জেনারেট', input: 'মার্কেটপ্লেস: Upwork | জব: Figma UI Design' },
  { id: 'discount', name: 'ডিসকাউন্ট কমানোর কৌশল', input: 'ক্লায়েন্ট ৫০% দাম কমাতে চান' },
  { id: 'reminder', name: 'পেমেন্ট তাগাদা মেসেজ', input: 'কাজ জমা দিয়েছি ৩ দিন পার হলো' },
];

function AiAssistantShowcase() {
  const [activeScenario, setActiveScenario] = useState('proposal');

  const scenarioOutputs = {
    proposal: 'Hello! I noticed you are looking for a sleek Figma UI design. I have designed 20+ responsive web platforms. Here is my proposed workflow...',
    discount: 'I appreciate your budget limits! Rather than cutting the rate, we can streamline the project scope to match your target price perfectly.',
    reminder: 'Hi! Just following up to make sure you received the completed deliverables. Please review and release the milestone at your convenience!',
  };

  return (
    <section id="ai-assistant" className="bg-white py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ai/10 px-3.5 py-1 text-[12px] font-bold text-ai border border-ai/20 font-bn">
              <Bot className="size-3.5" />
              AI সহায়কের স্মার্ট ক্ষমতা
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              যেকোনো পরিস্থিতিতে পারফেক্ট মেসেজ ও প্রপোজাল তৈরি করুন
            </h2>
          </div>
        </Animate>

        <div className="mx-auto max-w-4xl rounded-3xl border border-border-rest bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-5 sm:p-7 font-bn shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-border-rest/60 pb-3 mb-5 overflow-x-auto">
            {AI_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={`rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all whitespace-nowrap ${
                  activeScenario === sc.id
                    ? 'bg-ai text-white shadow-sm'
                    : 'bg-white text-muted hover:bg-slate-100 hover:text-ink'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="rounded-xl bg-white p-3.5 border border-border-rest flex items-start gap-2.5 shadow-sm">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Send className="size-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted">ইনপুট প্রম্পট:</p>
                <p className="text-[13px] font-semibold text-ink">{AI_SCENARIOS.find((s) => s.id === activeScenario)?.input}</p>
              </div>
            </div>

            <div className="rounded-xl bg-ai/8 p-4 border border-ai/20 flex items-start gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ai text-white">
                <Bot className="size-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-ai">AI জেনারেটেড মেসেজ:</p>
                <p className="text-[13px] font-medium text-ink leading-relaxed italic">
                  "{scenarioOutputs[activeScenario]}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Bento Grid Feature Showcase ──────────────────────────────── */

const BENTO_ITEMS = [
  {
    colSpan: 'md:col-span-8',
    badge: 'প্রজেক্ট কন্ট্রোল',
    title: 'ওয়ার্ক পাইপলাইন ও ক্লায়েন্ট স্কোপ কন্ট্রোল',
    desc: 'ক্লায়েন্টের অনাকাঙ্ক্ষিত রিভিশন চাওয়া ঠেকানোর জন্য স্মার্ট স্কোপ গার্ড এবং স্টেজ ট্র্যাকার।',
    icon: Briefcase,
    gradient: 'from-brand/10 via-brand/5 to-transparent',
    accentColor: 'text-brand',
    visual: (
      <div className="mt-3 rounded-xl border border-border-rest bg-white p-3 font-bn space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-bold text-ink">প্রজেক্ট: মোবাইল অ্যাপ UI ডিজাইন</span>
          <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">স্কোপ চালিত</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          মূল কাজ: ৫টি পেজ ডিজাইন (সম্পন্ন)
        </div>
      </div>
    ),
  },
  {
    colSpan: 'md:col-span-4',
    badge: 'আয় হিসাব',
    title: 'ট্রু আওয়ারলি & রানওয়ে',
    desc: 'বিদ্যুৎ বিল ও লিভিং কস্ট বাদ দিয়ে আসল ঘণ্টা ভিত্তিক লাভ কত?',
    icon: Wallet,
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    accentColor: 'text-emerald-600',
    visual: (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3 text-center font-bn shadow-sm">
        <p className="text-[10px] text-muted">প্রকৃত নিট লাভ</p>
        <p className="text-[22px] font-black text-emerald-600 mt-0.5">$২৮.৫০ /ঘণ্টা</p>
      </div>
    ),
  },
  {
    colSpan: 'md:col-span-4',
    badge: 'AI প্রপোজাল',
    title: 'স্মার্ট প্রপোজাল জেনারেটর',
    desc: 'মার্কেটপ্লেসের জন্য উচ্চ উইন-রেটের কভার লেটার ড্রাফট তৈরি করুন।',
    icon: Bot,
    gradient: 'from-ai/10 via-ai/5 to-transparent',
    accentColor: 'text-ai',
    visual: (
      <div className="mt-3 rounded-xl border border-ai/20 bg-white p-2.5 font-bn text-[11px] text-ink shadow-sm">
        <p className="font-bold text-ai">Upwork Proposal Engine</p>
      </div>
    ),
  },
  {
    colSpan: 'md:col-span-4',
    badge: 'ব্যাংক প্রুফ',
    title: 'ইনকাম প্রুফ & ব্যাংক রেডি',
    desc: 'ব্যাংক লোন বা ভিসার জন্য সার্টিফাইড A4 ইনকাম প্রুফ জেনারেটর।',
    icon: ShieldCheck,
    gradient: 'from-blue-600/10 via-blue-600/5 to-transparent',
    accentColor: 'text-blue-600',
    visual: (
      <div className="mt-3 rounded-xl border border-blue-200 bg-white p-2.5 flex items-center justify-between font-bn shadow-sm">
        <div className="flex items-center gap-1.5">
          <FileText className="size-4 text-blue-600" />
          <span className="text-[11px] font-bold text-ink">A4 Income Sheet</span>
        </div>
      </div>
    ),
  },
  {
    colSpan: 'md:col-span-4',
    badge: 'দক্ষতা স্কেলিং',
    title: 'রাইজ ল্যাডার & নিচ স্কোরার',
    desc: 'আপনার দক্ষতা অনুযায়ী চাহিদাসম্পন্ন সঠিক নিচ বেছে নিন।',
    icon: TrendingUp,
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    accentColor: 'text-amber-600',
    visual: (
      <div className="mt-3 rounded-xl border border-amber-200 bg-white p-2.5 font-bn shadow-sm">
        <span className="text-[11px] font-bold text-amber-700">স্কোর: ৮৮/১০০ (উচ্চ চাহিদা)</span>
      </div>
    ),
  },
];

function BentoFeatures() {
  return (
    <section id="features" className="bg-[#F8FAFC] py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-[12px] font-bold text-brand border border-brand/20 font-bn">
              <Zap className="size-3.5" />
              কেন easy rise বেছে নেবেন?
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              আপনার ফ্রিল্যান্সিং ক্যারিয়ারের সম্পূর্ণ অল-ইন-ওয়ান সিস্টেম
            </h2>
          </div>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {BENTO_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Animate key={item.title} variants={scaleIn} custom={idx} className={item.colSpan}>
                <div className="group relative h-full rounded-2xl border border-border-rest/80 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-muted font-bn border border-slate-200">
                        {item.badge}
                      </span>
                      <div className={`flex size-9 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm ${item.accentColor}`}>
                        <Icon className="size-4.5" />
                      </div>
                    </div>

                    <h3 className="font-bn text-[17px] font-bold text-ink mb-1.5">{item.title}</h3>
                    <p className="font-bn text-[13px] text-muted leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="relative z-10 pt-1.5">{item.visual}</div>
                </div>
              </Animate>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Interactive Freelancer Earning Estimator ────────────────── */

function InteractiveEstimator() {
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(20);

  const monthlyGross = Math.round(weeklyHours * hourlyRate * 4.33 * 120);
  const savedScopeLeakage = Math.round(monthlyGross * 0.18);

  return (
    <section id="calculator" className="bg-white py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-[12px] font-bold text-emerald-600 border border-emerald-200 font-bn">
              <Calculator className="size-3.5" />
              স্মার্ট ইনকাম ও লাভ ক্যালকুলেটর
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              আপনার সম্ভাব্য আয় ও টাকা বাঁচানোর হিসাব দেখুন
            </h2>
          </div>
        </Animate>

        <div className="mx-auto max-w-4xl rounded-3xl border border-border-rest bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-5 sm:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-12 items-center font-bn">
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-bold text-ink">সপ্তাহে মোট কাজ (ঘণ্টা)</label>
                  <span className="text-[15px] font-black text-brand">{weeklyHours} ঘণ্টা</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-bold text-ink">ঘণ্টার রেট (USD $)</label>
                  <span className="text-[15px] font-black text-brand">${hourlyRate} /ঘণ্টা</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand"
                />
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="rounded-2xl border border-brand/20 bg-white p-5 space-y-3 shadow-md">
                <div className="border-b border-slate-100 pb-2.5">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">মাসিক আনুমানিক গ্রস আয়</p>
                  <p className="text-[26px] font-black text-ink">৳ {monthlyGross.toLocaleString('bn-BD')}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted">স্কোপ গার্ড দিয়ে বাঁচানো টাকা</p>
                    <p className="text-[16px] font-black text-emerald-600">৳ {savedScopeLeakage.toLocaleString('bn-BD')}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    +১৮% সেভিং
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ Section (Accordion) ─────────────────────────────────── */

const FAQS = [
  {
    q: 'easy rise ব্যবহার করতে কি কোনো টাকা লাগবে?',
    a: 'easy rise প্ল্যাটফর্মটি সহজ সেটআপে সরাসরি ব্রাউজার থেকে ব্যবহার করতে পারবেন।',
  },
  {
    q: 'আমার ডাটা কি নিরাপদ থাকবে?',
    a: 'হ্যাঁ, easy rise একটি অফলাইন-ফার্স্ট অ্যাপ্লিকেশন। আপনার সমস্ত স্পর্শকাতর ডাটা সরাসরি আপনার ব্রাউজারের ডেক্সি ডাটায় লোকালি সংরক্ষিত থাকে।',
  },
  {
    q: 'স্কোপ গার্ড (Scope Guard) কীভাবে কাজ করে?',
    a: 'চুক্তির বাইরের অনাকাঙ্ক্ষিত কাজ চাওয়া ঠেকায় এবং অটোমেটিক অতিরিক্ত সার্ভিস ফি যুক্ত মেসেজ তৈরি করে দেয়।',
  },
  {
    q: 'আমি কীভাবে ইনকাম প্রুফ (Income Proof) তৈরি করব?',
    a: 'Money ট্যাব থেকে এক ক্লিকে অফিশিয়াল A4 ইনকাম স্টেটমেন্ট PDF ফরম্যাটে ডাউনলোড করতে পারবেন।',
  },
];

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="bg-[#F8FAFC] py-16 sm:py-20 border-b border-border-rest/60">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Animate variants={fadeUp}>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-[12px] font-bold text-brand border border-brand/20 font-bn">
              <HelpCircle className="size-3.5" />
              সাধারণ প্রশ্নাবলী
            </span>
            <h2 className="mt-2.5 font-bn text-[26px] font-black text-ink sm:text-[34px]">
              আপনার মনে আসা যেকোনো প্রশ্নের উত্তর
            </h2>
          </div>
        </Animate>

        <div className="space-y-2.5 font-bn">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <Animate key={i} variants={fadeUp} custom={i}>
                <div className="rounded-xl border border-border-rest bg-white overflow-hidden transition-colors shadow-sm">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-[14px] sm:text-[15px] text-ink hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4.5 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-4 pb-4 text-[13px] text-muted leading-relaxed border-t border-slate-100 pt-2.5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Animate>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Conversion CTA Banner ────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-blue-600 to-brand-dark py-16 sm:py-20 text-white">
      <FloatingBlobs />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center font-bn">
        <Animate variants={fadeUp}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[12px] font-bold backdrop-blur-md mb-4 border border-white/20">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>আজই শুরু করুন আপনার নতুন ফ্রিল্যান্সিং জীবন</span>
          </div>

          <h2 className="text-[28px] sm:text-[38px] font-black leading-snug mb-4">
            স্মার্ট ও নিরাপদ ক্যারিয়ার গড়ে তুলুন easy rise দিয়ে
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
            সরাসরি ব্রাউজার থেকে মাত্র ২ মিনিটে আপনার ফ্রিল্যান্সিং ড্যাশবোর্ড সেটআপ করুন।
          </p>
        </Animate>

        <Animate variants={scaleIn} custom={1}>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[16px] font-black text-brand shadow-xl transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            অ্যাকাউন্ট তৈরি করুন
            <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Animate>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */

function LandingFooter() {
  return (
    <footer className="border-t border-border-rest bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row font-bn text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="easy rise logo"
              className="size-8 object-contain rounded-xl shadow-sm"
            />
            <div>
              <p className="text-[14px] font-bold text-ink">easy rise</p>
              <p className="text-[11px] text-muted">ইজি রাইজ — বাংলাদেশ OS 2.0</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-[12px] sm:text-[13px] font-semibold text-muted">
            <a href="#features" className="hover:text-ink transition-colors">ফিচারসমূহ</a>
            <a href="#scope-guard" className="hover:text-ink transition-colors">স্কোপ গার্ড</a>
            <a href="#ladder" className="hover:text-ink transition-colors">রাইজ ল্যাডার</a>
            <a href="#ai-assistant" className="hover:text-ink transition-colors">AI সহায়কের ক্ষমতা</a>
            <a href="#faq" className="hover:text-ink transition-colors">প্রশ্নাবলী</a>
          </div>

          <p className="text-[11px] sm:text-[12px] text-muted">
            © ২০২৬ easy rise। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Landing Component Export ────────────────────────────── */

export default function Landing() {
  return (
    <>
      <Head>
        <title>easy rise OS 2.0 — স্মার্ট ফ্রিল্যান্সিং প্ল্যাটফর্ম</title>
        <meta
          name="description"
          content="কাজ ট্র্যাকিং, স্কোপ গার্ড, ট্রু আওয়ারলি রেট হিসাব, ইনকাম প্রুফ জেনারেটর এবং AI কভার লেটার — সহজ বাংলা ইন্টারফেসে।"
        />
      </Head>

      <div className="min-h-dvh bg-white font-sans text-ink antialiased selection:bg-brand selection:text-white overflow-x-hidden">
        <LandingNav />
        <Hero />
        <PlatformStatsStrip />
        <InteractiveScopeGuard />
        <RiseLadderRoadmap />
        <AiAssistantShowcase />
        <BentoFeatures />
        <InteractiveEstimator />
        <FaqSection />
        <CtaSection />
        <LandingFooter />
      </div>
    </>
  );
}
