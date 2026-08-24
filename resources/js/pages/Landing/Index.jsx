import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
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
} from 'lucide-react';

/* ── Animation helpers ─────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function Animate({ children, variants = fadeUp, custom = 0, className = '', ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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

/* ── Floating background blobs ─────────────────────────────────── */

function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-ai/8 blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-[350px] w-[350px] rounded-full bg-success/8 blur-[100px]"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Navigation ────────────────────────────────────────────────── */

function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 right-0 left-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-5 py-4">
        <div className="glass-row flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
              eR
            </div>
            <div>
              <p className="text-[15px] font-semibold leading-tight text-ink">easy rise</p>
              <p className="text-[11px] leading-tight text-muted font-bn">ইজি রাইজ</p>
            </div>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[14px] text-muted transition-colors hover:text-ink">
              বৈশিষ্ট্য
            </a>
            <a href="#how-it-works" className="text-[14px] text-muted transition-colors hover:text-ink">
              কীভাবে কাজ করে
            </a>
            <a href="#stats" className="text-[14px] text-muted transition-colors hover:text-ink">
              পরিসংখ্যান
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(29,111,242,0.25)] transition-all hover:bg-brand-dark hover:shadow-[0_6px_20px_rgba(29,111,242,0.35)] active:scale-[0.97]"
          >
            শুরু করুন
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ── Hero Section ──────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#EEF3FF] via-white to-[#F0F0FF] pt-24">
      <FloatingBlobs />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #1D6FF2 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-96px)] max-w-6xl flex-col items-center justify-center px-5 pb-16 pt-10 md:flex-row md:gap-16 md:pt-0">
        {/* Left — Copy */}
        <div className="flex-1 text-center md:text-left">
          <Animate variants={fadeUp} custom={0}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-[13px] font-medium text-brand">
              <Sparkles className="size-3.5" />
              ফ্রিল্যান্সারদের জন্য বাংলাদেশের প্রথম প্ল্যাটফর্ম
            </div>
          </Animate>

          <Animate variants={fadeUp} custom={1}>
            <h1 className="mb-5 font-bn text-[36px] font-bold leading-[1.2] tracking-tight text-ink sm:text-[44px] md:text-[52px]">
              প্রথম কাজ থেকে
              <br />
              <span className="bg-gradient-to-r from-brand to-ai bg-clip-text text-transparent">
                নিজের ব্যবসা
              </span>{' '}
              পর্যন্ত
            </h1>
          </Animate>

          <Animate variants={fadeUp} custom={2}>
            <p className="mb-8 max-w-lg text-[17px] leading-relaxed text-muted font-bn md:text-[18px]">
              শেখা, কাজ খোঁজা, প্রস্তাব পাঠানো, টাকা হিসাব — সব এক জায়গায়। আপনার
              ফ্রিল্যান্সিং যাত্রার প্রতিটি ধাপে পাশে আছে easy rise।
            </p>
          </Animate>

          <Animate variants={fadeUp} custom={3}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="flex h-14 items-center justify-center gap-2 rounded-[18px] bg-brand px-8 text-[17px] font-bold text-white shadow-[0_8px_24px_rgba(29,111,242,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(29,111,242,0.4)] active:scale-[0.98] font-bn"
              >
                বিনামূল্যে শুরু করুন
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/login"
                className="flex h-14 items-center justify-center gap-2 rounded-[18px] border border-border-rest bg-white/60 px-8 text-[16px] font-medium text-ink backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-white/80 active:scale-[0.98] font-bn"
              >
                আগে থেকেই কাজ করছি
              </Link>
            </div>
          </Animate>

          <Animate variants={fadeUp} custom={4}>
            <div className="mt-8 flex items-center gap-4 text-[13px] text-muted font-bn md:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                ক্রেডিট কার্ড লাগে না
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                ২ মিনিটে সেটআপ
              </span>
            </div>
          </Animate>
        </div>

        {/* Right — Phone mockup */}
        <Animate variants={slideFromRight} custom={1} className="mt-12 flex-shrink-0 md:mt-0">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 -m-8 rounded-[40px] bg-brand/10 blur-[60px]" />

            {/* Phone frame */}
            <div className="relative w-[280px] rounded-[36px] border-[3px] border-ink/10 bg-white p-2 shadow-[0_20px_60px_rgba(14,22,38,0.12)] sm:w-[300px]">
              {/* Status bar */}
              <div className="flex items-center justify-between px-4 pb-2 pt-3">
                <span className="text-[12px] font-semibold text-ink">9:41</span>
                <div className="flex gap-1">
                  <div className="size-1 rounded-full bg-ink/40" />
                  <div className="size-1 rounded-full bg-ink/40" />
                  <div className="size-1 rounded-full bg-ink/40" />
                </div>
              </div>

              {/* App screen content */}
              <div className="overflow-hidden rounded-[24px] bg-gradient-to-b from-[#EEF3FF] to-[#F7F9FF] p-4">
                {/* Top bar */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted font-bn">শুভ সকাল</p>
                    <p className="text-[15px] font-semibold text-ink font-bn">আরিফুল</p>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full bg-brand/10">
                    <Bot className="size-4 text-brand" />
                  </div>
                </div>

                {/* Quick stats */}
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                    <p className="text-[10px] text-muted font-bn">আজকের কাজ</p>
                    <p className="text-[18px] font-bold text-ink">৩টি</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                    <p className="text-[10px] text-muted font-bn">আয় এই মাস</p>
                    <p className="text-[18px] font-bold text-success">৳৪৫,০০০</p>
                  </div>
                </div>

                {/* Job card */}
                <div className="rounded-xl border border-brand/10 bg-white/90 p-3 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="size-6 rounded-lg bg-brand/10" />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-ink font-bn">লোগো ডিজাইন</p>
                      <p className="text-[9px] text-muted font-bn">ClientCo · $১৫০</p>
                    </div>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-medium text-success font-bn">
                      চলছে
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-brand/10">
                    <motion.div
                      className="h-full rounded-full bg-brand"
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Bottom nav hint */}
                <div className="mt-3 flex items-center justify-around rounded-xl bg-white/60 p-2">
                  {['আজ', 'শেখা', 'কাজ', 'টাকা'].map((label) => (
                    <div key={label} className="text-center">
                      <div className="mx-auto mb-0.5 size-1 rounded-full bg-ink/20" />
                      <p className="text-[8px] text-muted font-bn">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Home indicator */}
              <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-ink/10" />
            </div>
          </div>
        </Animate>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] tracking-widest text-muted/60 uppercase font-bn">স্ক্রল</span>
          <div className="size-5 rounded-full border-2 border-muted/20 p-0.5">
            <motion.div
              className="mx-auto size-1.5 rounded-full bg-brand"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Features Section ──────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Briefcase,
    title: 'কাজ ও ক্লায়েন্ট ম্যানেজমেন্ট',
    description: 'পাইপলাইন, প্রস্তাব ট্র্যাকার, স্কোপ গার্ড ও ক্লায়েন্ট স্ক্রিনার — সব এক জায়গায়।',
    color: 'brand',
    gradient: 'from-brand/10 to-brand/5',
  },
  {
    icon: Wallet,
    title: 'আয় ও খরচ হিসাব',
    description: 'লেজার, ট্রু আওয়ারলি, রানওয়ে ও পেমেন্ট চ্যানেল — নিয়মিত আয়ের হিসাব রাখুন।',
    color: 'success',
    gradient: 'from-success/10 to-success/5',
  },
  {
    icon: BookOpen,
    title: 'শেখা ও গাইড',
    description: 'মার্কেটপ্লেস তুলনা, নিচ স্কোরার, প্রোফাইল চেকলিস্ট ও ৯০ দিনের পরিকল্পনা।',
    color: 'ai',
    gradient: 'from-ai/10 to-ai/5',
  },
  {
    icon: Bot,
    title: 'AI সহায়ক',
    description: 'কথা বলুন, লিখুন, পরামর্শ নিন — আপনার ফ্রিল্যান্সিং যাত্রায় ২৪/৭ সঙ্গী।',
    color: 'ai',
    gradient: 'from-ai/10 to-ai/5',
  },
  {
    icon: Shield,
    title: 'কাগজ ও ডকুমেন্ট',
    description: 'ইনকাম প্রুফ, ডকুমেন্ট রেডিনেস ও ট্যাক্স প্রস্তুতি — আইনসম্মতভাবে টাকা আনুন।',
    color: 'warn',
    gradient: 'from-warn/10 to-warn/5',
  },
  {
    icon: TrendingUp,
    title: 'রাইজ ল্যাডার',
    description: 'আপনার অগ্রগতি ট্র্যাক করুন — প্রতিটি ধাপে পরবর্তী মাইলফলক দেখুন।',
    color: 'brand',
    gradient: 'from-brand/10 to-brand/5',
  },
];

function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-white py-24">
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-5">
        <Animate variants={fadeUp}>
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/5 px-4 py-1.5 text-[13px] font-medium text-brand font-bn">
              <Zap className="size-3.5" />
              বৈশিষ্ট্যসমূহ
            </span>
          </div>
          <h2 className="mb-4 text-center font-bn text-[30px] font-bold text-ink sm:text-[36px]">
            ফ্রিল্যান্সিংয়ের প্রতিটি ধাপে
            <br className="hidden sm:block" /> আপনার পাশে easy rise
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-[16px] text-muted font-bn">
            কাজ খোঁজা থেকে টাকা আনা পর্যন্ত — সবকিছু একটি অ্যাপে, আপনার ভাষায়।
          </p>
        </Animate>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Animate key={feature.title} variants={scaleIn} custom={i}>
              <div className="group relative h-full rounded-[20px] border border-border-rest/60 bg-white p-6 shadow-[0_2px_8px_rgba(14,22,38,0.04)] transition-all duration-300 hover:border-brand/20 hover:shadow-[0_8px_30px_rgba(14,22,38,0.08)] hover:-translate-y-1">
                <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                  <feature.icon className={`size-6 text-${feature.color}`} />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-ink font-bn">{feature.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted font-bn">{feature.description}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works Section ──────────────────────────────────────── */

const STEPS = [
  {
    number: '০১',
    title: 'ফোন নম্বর দিয়ে শুরু করুন',
    description: 'OTP যাচাই করে মাত্র ২ মিনিটে সেটআপ শেষ। কোনো ক্রেডিট কার্ড লাগে না।',
    icon: Smartphone,
  },
  {
    number: '০২',
    title: 'আপনার প্রোফাইল তৈরি করুন',
    description: 'দক্ষতা, অভিজ্ঞতা ও পোর্টফোলিও যোগ করুন। AI সহায়ক সাহায্য করবে।',
    icon: Users,
  },
  {
    number: '০৩',
    title: 'কাজ খুঁজুন ও আয় করুন',
    description: 'মার্কেটপ্লেস বিশ্লেষণ, প্রস্তাব পাঠানো থেকে পেমেন্ট — সব ট্র্যাক করুন।',
    icon: BarChart3,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-[#F7F9FF] to-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Animate variants={fadeUp}>
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ai/5 px-4 py-1.5 text-[13px] font-medium text-ai font-bn">
              <Sparkles className="size-3.5" />
              কীভাবে কাজ করে
            </span>
          </div>
          <h2 className="mb-16 text-center font-bn text-[30px] font-bold text-ink sm:text-[36px]">
            মাত্র ৩টি ধাপে শুরু করুন
          </h2>
        </Animate>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 right-0 left-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-brand/20 via-ai/20 to-success/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <Animate key={step.number} variants={fadeUp} custom={i}>
                <div className="relative text-center">
                  {/* Step number */}
                  <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/10 to-ai/10 blur-xl" />
                    <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-brand/20 bg-white shadow-[0_4px_20px_rgba(29,111,242,0.1)]">
                      <step.icon className="size-8 text-brand" />
                    </div>
                  </div>

                  <span className="mb-2 block text-[13px] font-bold text-brand/60 font-bn">{step.number}</span>
                  <h3 className="mb-3 text-[18px] font-semibold text-ink font-bn">{step.title}</h3>
                  <p className="text-[14px] leading-relaxed text-muted font-bn">{step.description}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Section ─────────────────────────────────────────────── */

const STATS = [
  { value: '১০,০০০+', label: 'সক্রিয় ফ্রিল্যান্সার', icon: Users },
  { value: '৳২ কোটি+', label: 'মোট আয়', icon: Wallet },
  { value: '৫০০+', label: 'সম্পন্ন প্রজেক্ট', icon: CheckCircle2 },
  { value: '৪.৮', label: 'গড় রেটিং', icon: Star },
];

function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden bg-ink py-24">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-ai/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <Animate variants={fadeUp}>
          <h2 className="mb-4 text-center font-bn text-[30px] font-bold text-white sm:text-[36px]">
            যারা ইতিমধ্যে বিশ্বাস করছেন
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-[16px] text-white/60 font-bn">
            সারা বাংলাদেশের ফ্রিল্যান্সাররা প্রতিদিন easy rise ব্যবহার করছেন।
          </p>
        </Animate>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Animate key={stat.label} variants={scaleIn} custom={i}>
              <div className="group rounded-[20px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-brand/30 hover:bg-white/10">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand/10">
                  <stat.icon className="size-6 text-brand" />
                </div>
                <p className="mb-1 text-[28px] font-bold text-white sm:text-[32px]">{stat.value}</p>
                <p className="text-[13px] text-white/60 font-bn">{stat.label}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials Section ──────────────────────────────────────── */

const TESTIMONIALS = [
  {
    name: 'রাফসান আহমেদ',
    location: 'ঢাকা',
    text: 'easy rise দিয়ে ক্লায়েন্ট খোঁজা আর প্রস্তাব পাঠানো অনেক সহজ হয়েছে। আয়ের হিসাবও এখন স্মার্টভাবে রাখতে পারি।',
    avatar: 'RA',
  },
  {
    name: 'নুসরাত জাহান',
    location: 'চট্টগ্রাম',
    text: 'AI সহায়ক সত্যিই দারুণ। প্রস্তাব লেখায় সাহায্য করে, আর ডকুমেন্ট রেডিনেস ফিচারটা অসাধারণ।',
    avatar: 'NJ',
  },
  {
    name: 'তানভীর হাসান',
    location: 'সিলেট',
    text: 'প্রথমবার ফ্রিল্যান্সিং শুরু করার সময় অনেক ভয় পেতাম। easy rise সবকিছু সহজ করে দিয়েছে।',
    avatar: 'TH',
  },
];

function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F7F9FF] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Animate variants={fadeUp}>
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/5 px-4 py-1.5 text-[13px] font-medium text-success font-bn">
              <Star className="size-3.5" />
              ব্যবহারকারীদের কথা
            </span>
          </div>
          <h2 className="mb-16 text-center font-bn text-[30px] font-bold text-ink sm:text-[36px]">
            তারা কী বলছেন
          </h2>
        </Animate>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Animate key={t.name} variants={fadeUp} custom={i}>
              <div className="group relative h-full rounded-[20px] border border-border-rest/60 bg-white p-6 shadow-[0_2px_8px_rgba(14,22,38,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,22,38,0.08)]">
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="size-4 fill-warn text-warn" />
                  ))}
                </div>

                <p className="mb-6 text-[14px] leading-relaxed text-ink/80 font-bn">"{t.text}"</p>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink font-bn">{t.name}</p>
                    <p className="text-[12px] text-muted font-bn">{t.location}</p>
                  </div>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ───────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-[#0A2D6B] py-24">
      <FloatingBlobs />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <Animate variants={fadeUp}>
          <h2 className="mb-5 font-bn text-[32px] font-bold text-white sm:text-[40px]">
            আজই শুরু করুন
          </h2>
          <p className="mb-10 text-[17px] leading-relaxed text-white/80 font-bn">
            আপনার ফ্রিল্যান্সিং যাত্রার প্রথম ধাপটি নিন। বিনামূল্যে শুরু করুন, কোনো ক্রেডিট
            কার্ড লাগে না।
          </p>
        </Animate>

        <Animate variants={scaleIn} custom={1}>
          <Link
            href="/login"
            className="inline-flex h-16 items-center gap-2.5 rounded-[20px] bg-white px-10 text-[18px] font-bold text-brand shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:bg-white/95 active:scale-[0.98] font-bn"
          >
            বিনামূল্যে শুরু করুন
            <ArrowRight className="size-5" />
          </Link>
        </Animate>

        <Animate variants={fadeUp} custom={2}>
          <p className="mt-6 text-[13px] text-white/50 font-bn">
            প্রথম পাঠ সম্পূর্ণ বিনামূল্যে — মাত্র ২ মিনিটে সেটআপ
          </p>
        </Animate>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────────── */

function LandingFooter() {
  return (
    <footer className="border-t border-border-rest bg-white py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
              eR
            </div>
            <div>
              <p className="text-[15px] font-semibold text-ink">easy rise</p>
              <p className="text-[11px] text-muted font-bn">ইজি রাইজ</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-[13px] text-muted font-bn">
            <a href="#features" className="transition-colors hover:text-ink">বৈশিষ্ট্য</a>
            <a href="#how-it-works" className="transition-colors hover:text-ink">কীভাবে কাজ করে</a>
            <a href="#stats" className="transition-colors hover:text-ink">পরিসংখ্যান</a>
          </div>

          {/* Copyright */}
          <p className="text-[12px] text-muted/60 font-bn">
            © ২০২৬ easy rise। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Landing Page ─────────────────────────────────────────── */

export default function Landing() {
  return (
    <>
      <Head>
        <title>easy rise — ফ্রিল্যান্সারদের জন্য বাংলাদেশের প্ল্যাটফর্ম</title>
        <meta
          name="description"
          content="শেখা, কাজ খোঁজা, প্রস্তাব পাঠানো, টাকা হিসাব — সব এক জায়গায়। ফ্রিল্যান্সিংয়ের প্রতিটি ধাপে আপনার পাশে easy rise।"
        />
      </Head>

      <div className="min-h-dvh bg-white font-sans text-ink">
        <LandingNav />
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CtaSection />
        <LandingFooter />
      </div>
    </>
  );
}
