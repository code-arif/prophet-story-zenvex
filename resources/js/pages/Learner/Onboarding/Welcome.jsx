import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  BatteryFull,
  BookOpen,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Flame,
  GraduationCap,
  Headphones,
  Home,
  Layers,
  Menu,
  MessageCircle,
  Mic,
  PenLine,
  PenTool,
  Quote,
  Rocket,
  Send,
  Shield,
  Signal,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  User,
  UserPlus,
  Wifi,
  X,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';

/**
 * Landing page (Screen 01 — স্বাগতম) for "Learn English" (শিখুন ইংরেজি).
 *
 * A business-grade marketing landing page — Bangla-first, built on the
 * learner design tokens (learn-*), props-driven so the backend can wire
 * real brand settings, stats and pricing in a later phase.
 *
 * Color roles (DESIGN_SYSTEM §3): violet is used ONLY for AI surfaces,
 * amber ONLY for connectivity notices, green ONLY for correct/completed.
 */
export default function Welcome({
  brandName = 'শিখুন ইংরেজি',
  logoUrl = null,
  stats = DEFAULT_STATS,
  // appChargeText = '', // only used by the commented-out pricing section
  // pricing = DEFAULT_PRICING, // only used by the commented-out pricing section
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <div className="min-h-screen bg-learn-bg font-learn-bn text-learn-ink antialiased">
      <Head title={`${brandName} — ইংরেজি শেখা এখন সহজ, মজার আর কার্যকর`} />

      {/* ── Sticky navigation ─────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#14172B]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          {/* Brand */}
          <Link href="/welcome" className="flex min-h-12 items-center gap-2.5" aria-label={brandName}>
            {logoUrl ? (
              <img src={logoUrl} alt="" className="size-8 rounded-full bg-white object-cover ring-1 ring-white/20" />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-learn-primary text-white shadow-[0_4px_14px_rgba(43,89,195,0.45)]">
                <GraduationCap className="size-4.5" strokeWidth={2.2} />
              </span>
            )}
            <span className="text-[16px] font-bold tracking-tight text-white">{brandName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="প্রধান মেনু">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex h-12 items-center rounded-full px-4 text-[14px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-12 items-center rounded-full px-4 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:flex"
            >
              লগইন
            </Link>
            <Link
              href="/welcome/profile"
              className="flex h-12 items-center gap-1.5 rounded-full bg-learn-primary px-5 text-[14px] font-bold text-white shadow-[0_6px_18px_rgba(43,89,195,0.4)] transition-all duration-200 hover:bg-learn-primary-dark active:scale-[0.97]"
            >
              শুরু করি
              <ArrowRight className="size-4" strokeWidth={2.4} />
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex size-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            aria-label="মোবাইল মেনু"
            className="animate-fade-in border-t border-white/10 bg-[#14172B]/95 px-5 pb-4 pt-2 backdrop-blur-md md:hidden"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center border-b border-white/5 text-[15px] font-medium text-white/85 last:border-0"
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center text-[15px] font-semibold text-white/85"
            >
              লগইন
            </Link>
          </nav>
        )}
      </header>

      {/* ── Hero (dark, premium) ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14172B] pt-28 pb-16 text-white lg:pt-36 lg:pb-24">
        {/* Background décor */}
        <div className="pointer-events-none absolute -top-[20%] -left-[15%] h-[85%] w-[85%] rounded-full bg-learn-primary/30 blur-[140px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-[25%] right-[-15%] h-[70%] w-[70%] rounded-full bg-learn-primary/15 blur-[120px]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:18px_18px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-[#9db4f0] ring-1 ring-white/10 backdrop-blur-sm">
              <GraduationCap className="size-4" strokeWidth={2.2} />
              বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি
            </span>

            <h1 className="mt-6 text-[34px] leading-[1.25] font-extrabold tracking-tight sm:text-5xl lg:text-[52px]">
              ইংরেজি শেখা এখন{' '}
              <span className="bg-gradient-to-r from-[#5F8BFA] via-[#8fa8f8] to-[#B3C8FC] bg-clip-text text-transparent">
                সহজ, মজার আর কার্যকর
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 lg:mx-0 lg:text-[17px]">
              পড়া, শোনা, বলা ও লেখা — চারটি দক্ষতাই এক জায়গায়। নিজের গতিতে, প্রতিদিনের
              ছোট ছোট লেসনে, ইন্টারনেট ছাড়াই অনুশীলন করুন।
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/welcome/profile"
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary px-7 text-[16px] font-bold text-white shadow-[0_10px_26px_rgba(43,89,195,0.45)] transition-all duration-200 hover:bg-learn-primary-dark hover:shadow-[0_12px_30px_rgba(43,89,195,0.55)] active:scale-[0.98] sm:w-auto"
              >
                ফ্রিতে শুরু করি
                <ArrowRight className="size-5" strokeWidth={2.4} />
              </Link>
              <Link
                href="/login"
                className="flex h-[52px] w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/5 px-7 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98] sm:w-auto"
              >
                আগে থেকে অ্যাকাউন্ট আছে
              </Link>
            </div>

            {/* Trust row — structural, honest claims */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              <span className="flex items-center gap-2 text-[13px] font-medium text-white/75">
                <CheckCircle2 className="size-4.5 text-[#5F8BFA]" strokeWidth={2.2} />
                ৪টি দক্ষতা এক জায়গায়
              </span>
              <span className="flex items-center gap-2 text-[13px] font-medium text-white/75">
                <Timer className="size-4.5 text-[#5F8BFA]" strokeWidth={2.2} />
                দৈনিক {toBnDigits(15)} মিনিট
              </span>
            </div>
          </div>

          {/* Phone mockup — decorative, mirrors the hero copy */}
          <div className="relative mx-auto w-full max-w-[320px] lg:max-w-none" aria-hidden="true">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Word marquee ───────────────────────────────────────────── */}
      <section className="border-y border-learn-border bg-white py-5" aria-label="শেখা শব্দের নমুনা">
        <div className="marquee-container">
          <div className="marquee-content gap-0">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {MARQUEE_WORDS.map(([en, bn]) => (
                  <span key={`${dup}-${en}`} className="flex items-center text-[14px]">
                    <span className="font-bold font-learn-en text-learn-ink">{en}</span>
                    <span className="mx-3 text-learn-muted">—</span>
                    <span className="text-learn-muted">{bn}</span>
                    <span className="mx-8 text-learn-border">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20" aria-label="পরিসংখ্যান">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ value, label, sub }) => (
            <div
              key={label}
              className="group rounded-[14px] border border-learn-border bg-white p-5 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_10px_24px_rgba(20,23,43,0.08)]"
            >
              <p className="text-[28px] font-extrabold tracking-tight text-learn-primary">{toBnDigits(value)}</p>
              <p className="mt-1 text-[14px] font-bold text-learn-ink">{label}</p>
              <p className="mt-0.5 text-[13px] text-learn-muted">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features: 4 skills ────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="যা শিখবেন"
            title="চারটি দক্ষতা, একটি অ্যাপে"
            desc="পড়া, শোনা, বলা আর লেখা — প্রতিটি দক্ষতার জন্য আলাদা পথ, আপনার গতিতে।"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map(({ Icon, title, desc, offline }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-[14px] border border-learn-border bg-learn-bg p-5 transition-all duration-200 hover:-translate-y-1 hover:border-learn-primary/40 hover:shadow-[0px_14px_30px_rgba(20,23,43,0.08)]"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-learn-primary-tint text-learn-primary transition-colors duration-200 group-hover:bg-learn-primary group-hover:text-white">
                  <Icon className="size-6" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-[16px] font-bold text-learn-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-learn-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core features grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="সব ফিচার"
          title="শেখার প্রতিটি ধাপে পাশে আছি"
          desc="অনুশীলন থেকে অগ্রগতি — দৈনন্দিন শেখার পুরো চক্র এক জায়গায়।"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-4 rounded-[14px] border border-learn-border bg-white p-5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_12px_28px_rgba(20,23,43,0.08)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-learn-primary-tint text-learn-primary transition-colors duration-200 group-hover:bg-learn-primary group-hover:text-white">
                <Icon className="size-5.5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-learn-ink">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-learn-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI tutor (violet = AI only) ────────────────────────────── */}
      <section id="ai" className="scroll-mt-20 bg-[#14172B] py-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-learn-ai px-3.5 py-1.5 text-[13px] font-bold text-white">
                <Sparkles className="size-4" strokeWidth={2.2} />
                AI টিউটর
              </span>
            </div>

            <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              আপনার ব্যক্তিগত{' '}
              <span className="bg-gradient-to-r from-[#9B8CFF] to-[#C9C0FF] bg-clip-text text-transparent">
                AI টিউটর
              </span>{' '}
              সবসময় পাশে
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              যেকোনো সময় ইংরেজিতে চ্যাট করুন, ভুল শুধরে নিন, আর লেখা জমা দিয়ে
              তাৎক্ষণিক ফিডব্যাক নিন — আপনার লেভেল অনুযায়ী।
            </p>

            <ul className="mt-7 space-y-4">
              {AI_FEATURES.map(({ Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-learn-ai/15 text-[#B3A8FF] ring-1 ring-learn-ai/20">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-white">{title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-white/65">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/ai"
              className="mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-learn-ai px-7 text-[16px] font-bold text-white shadow-[0_10px_26px_rgba(124,107,245,0.4)] transition-all duration-200 hover:bg-[#6B5AE6] active:scale-[0.98]"
            >
              AI টিউটরের সাথে দেখা করুন
              <ArrowRight className="size-5" strokeWidth={2.4} />
            </Link>
          </div>

          {/* AI chat mock — decorative preview of the AI surface */}
          <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-learn-ai/20 blur-3xl" aria-hidden="true" />
            <AiChatMock />
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section id="how" className="scroll-mt-20 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="কীভাবে কাজ করে"
            title="মাত্র তিনটি ধাপে শুরু"
            desc="কোনো ঝামেলা ছাড়াই — ফোন নম্বর দিয়েই সবকিছু।"
          />

          <div className="relative mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {/* connector line (desktop) */}
            <div className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-learn-border sm:block" aria-hidden="true" />
            {STEPS.map(({ Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-learn-primary text-white shadow-[0_10px_22px_rgba(43,89,195,0.3)]">
                  <Icon className="size-6.5" strokeWidth={2} />
                  <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-learn-ink text-[13px] font-bold text-white">
                    {toBnDigits(i + 1)}
                  </span>
                </div>
                <h3 className="mt-5 text-[16px] font-bold text-learn-ink">{title}</h3>
                <p className="mt-1.5 max-w-[260px] text-[13px] leading-relaxed text-learn-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="শিক্ষার্থীদের কথা"
          title="তারা শিখছেন, আপনিও পারবেন"
          desc="সারা বাংলাদেশের শিক্ষার্থীরা প্রতিদিন এই অ্যাপে অনুশীলন করছেন।"
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, city, quote }) => (
            <figure
              key={name}
              className="relative flex flex-col rounded-[14px] border border-learn-border bg-white p-6 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_14px_30px_rgba(20,23,43,0.08)]"
            >
              <Quote className="size-7 text-learn-primary/20" strokeWidth={2} />
              <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-learn-ink">"{quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-learn-border pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-learn-primary-tint text-[15px] font-bold text-learn-primary">
                  {name.charAt(0)}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-learn-ink">{name}</p>
                  <p className="text-[13px] text-learn-muted">{city}</p>
                </div>
                <span className="ml-auto flex items-center gap-0.5 text-learn-primary" aria-label="৫ স্টার">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-3.5 fill-learn-primary" strokeWidth={0} />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          Subscription / Pricing section — COMMENTED OUT (kept for later).
          To restore: uncomment this section and the pricing data below
          (constants DEFAULT_PRICING / PLAN_FREE / PLAN_PREMIUM), plus the
          pricing props in the Welcome signature and the #pricing nav links.
      ═════════════════════════════════════════════════════════════ */}
      {/* <section id="pricing" className="scroll-mt-20 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeader
            eyebrow="মূল্য"
            title="সাশ্রয়ী, স্বচ্ছ সাবস্ক্রিপশন"
            desc="সাবস্ক্রিপশন চার্জ আপনার মোবাইল অপারেটর বিলের সাথেই যুক্ত হবে।"
          />            <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
              <div className="flex flex-col rounded-[14px] border border-learn-border bg-learn-bg p-6 lg:p-7">
              <p className="text-[15px] font-bold text-learn-ink">ফ্রি</p>
              <p className="mt-1 text-[13px] text-learn-muted">শুরু করার জন্য যথেষ্ট</p>
              <p className="mt-5 text-[13px] font-bold uppercase tracking-wide text-learn-muted">যা পাবেন</p>
              <ul className="mt-3 flex-1 space-y-2.5">
                {PLAN_FREE.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-learn-ink">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-learn-primary" strokeWidth={2.2} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/welcome/profile"
                className="mt-6 flex h-[52px] items-center justify-center rounded-[14px] border-2 border-learn-primary text-[15px] font-bold text-learn-primary transition-all duration-200 hover:bg-learn-primary-tint active:scale-[0.98]"
              >
                ফ্রিতে শুরু করি
              </Link>
            </div>

            <div className="relative flex flex-col rounded-[14px] bg-learn-primary p-6 text-white shadow-[0_18px_40px_rgba(43,89,195,0.3)] lg:p-7">
              <span className="absolute -top-3 right-6 rounded-full bg-learn-ink px-3 py-1 text-[13px] font-bold text-white shadow-sm">
                জনপ্রিয়
              </span>
              <p className="text-[15px] font-bold">প্রিমিয়াম</p>
              <p className="mt-1 text-[13px] text-white/75">সব ফিচার আনলক করুন</p>
              <p className="mt-5 text-[13px] font-bold uppercase tracking-wide text-white/70">যা পাবেন</p>
              <ul className="mt-3 flex-1 space-y-2.5">
                {PLAN_PREMIUM.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-white">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-white" strokeWidth={2.2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-[14px] bg-white/10 px-4 py-3 text-center ring-1 ring-white/15">
                <p className="text-[14px] font-bold">
                  দৈনিক {toBnDigits(pricing.daily)} টাকা
                  <span className="mx-1.5 text-white/50">•</span>
                  <span className="font-semibold text-white/85">সাপ্তাহিক {toBnDigits(pricing.weekly)} টাকা</span>
                </p>
              </div>
              <Link
                href="/login"
                className="mt-4 flex h-[52px] items-center justify-center rounded-[14px] bg-white text-[15px] font-bold text-learn-primary transition-all duration-200 hover:bg-learn-primary-tint active:scale-[0.98]"
              >
                সাবস্ক্রাইব করুন
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-learn-muted">
            {appChargeText || 'SMS বা USSD দিয়ে সহজেই সাবস্ক্রিপশন; মূল্য অপারেটর অনুযায়ী ভিন্ন হতে পারে।'}
          </p>
        </div>
      </section> */}

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 mx-auto max-w-3xl px-5 py-14 lg:py-20">
        <SectionHeader
          eyebrow="প্রশ্নোত্তর"
          title="সাধারণ জিজ্ঞাসা"
          desc="আপনার মনে প্রশ্ন থাকলে — সম্ভবত উত্তর এখানেই আছে।"
        />

        <div className="mt-10 space-y-3">
          {FAQS.map(({ q, a }, i) => {
            const open = openFaq === i;
            return (
              <div
                key={q}
                className={cn(
                  'overflow-hidden rounded-[14px] border bg-white transition-all duration-200',
                  open ? 'border-learn-primary shadow-[0px_8px_20px_rgba(43,89,195,0.1)]' : 'border-learn-border'
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 text-left"
                >
                  <span className="text-[15px] font-bold text-learn-ink">{q}</span>
                  <ChevronDown
                    className={cn('size-5 shrink-0 text-learn-muted transition-transform duration-200', open && 'rotate-180 text-learn-primary')}
                    strokeWidth={2.2}
                  />
                </button>
                {open && (
                  <p className="animate-fade-in px-5 pb-5 text-[14px] leading-relaxed text-learn-muted">{a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#14172B] py-16 lg:py-24">
        <div className="pointer-events-none absolute top-[-60%] left-1/2 h-[120%] w-[80%] -translate-x-1/2 rounded-full bg-learn-primary/25 blur-[130px]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:18px_18px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#9db4f0] ring-1 ring-white/10">
            <Rocket className="size-4" strokeWidth={2.2} />
            আজই শুরু করুন
          </span>
          <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            আপনার ইংরেজি শেখার যাত্রা শুরু হোক আজই
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
            প্রথম পাঠ সম্পূর্ণ বিনামূল্যে — মাত্র {toBnDigits(15)} মিনিটে। ফোন নম্বর
            দিয়েই শুরু, কোনো ঝামেলা নেই।
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/welcome/profile"
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-learn-primary px-8 text-[16px] font-bold text-white shadow-[0_10px_26px_rgba(43,89,195,0.45)] transition-all duration-200 hover:bg-learn-primary-dark active:scale-[0.98] sm:w-auto"
            >
              ফ্রিতে শুরু করি
              <ArrowRight className="size-5" strokeWidth={2.4} />
            </Link>
            {/* Android app download button — commented out (kept for later).
            <Link
              href="/app"
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-8 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98] sm:w-auto"
            >
              <Download className="size-5" strokeWidth={2.2} />
              Android অ্যাপ ডাউনলোড
            </Link>
            */}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B0D19] pt-16 pb-8 text-white/80">
        {/* Subtle background glow for premium feel */}
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-learn-primary/10 blur-[80px]" aria-hidden="true" />

        <div className="mx-auto max-w-6xl px-5 lg:px-8 bg-transparent">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            
            {/* Column 1: Brand & Tagline */}
            <div className="flex flex-col gap-4">
              <Link href="/welcome" className="flex items-center gap-2.5" aria-label={brandName}>
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="size-8.5 rounded-full bg-white object-cover ring-1 ring-white/20" />
                ) : (
                  <span className="flex size-8.5 items-center justify-center rounded-full bg-learn-primary text-white shadow-[0_4px_10px_rgba(43,89,195,0.3)]">
                    <GraduationCap className="size-4.5" strokeWidth={2.2} />
                  </span>
                )}
                <span className="text-[16px] font-bold tracking-tight text-white">{brandName}</span>
              </Link>
              <p className="text-[13.5px] leading-relaxed text-white/60">
                বাংলাদেশের শিক্ষার্থীদের জন্য ইংরেজি শেখার সম্পূর্ণ সমাধান — পড়া, শোনা,
                বলা ও লেখা, এক অ্যাপে।
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[12.5px] text-white/70 ring-1 ring-white/10 w-fit">
                <Shield className="size-4 text-[#5f8bfa]" strokeWidth={2.2} />
                <span>ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত</span>
              </div>
            </div>

            {/* Column 2: Product (পণ্য) */}
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wider text-white">পণ্য</p>
              <ul className="mt-4 space-y-1">
                {FOOTER_PRODUCT.map(({ label, href }) => (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support (সহায়তা) */}
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wider text-white">সহায়তা</p>
              <ul className="mt-4 space-y-1">
                {FOOTER_SUPPORT.map(({ label, href }) => (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact / Company info */}
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wider text-white">যোগাযোগ</p>
              <p className="mt-4 text-[13.5px] text-white/60 leading-relaxed">
                আমাদের কার্যালয়:
              </p>
              <p className="mt-2 text-[14px] font-semibold text-white">
                পল্লবী, মিরপুর, ঢাকা
              </p>
              <p className="mt-1 text-[12.5px] text-white/50 font-learn-en">
                Pallabi, Mirpur, Dhaka
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Credits */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row">
            <p>
              © {toBnDigits(new Date().getFullYear())} {brandName} — সর্বস্বত্ব সংরক্ষিত
            </p>
            <p className="flex items-center gap-1">
              <span>Designed and developed by</span>
              <a 
                href="https://zenvex.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-[#5f8bfa] hover:underline"
              >
                Zenvex Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────── Sub-components ────────────────────────── */

/** Footer link: in-page anchors use plain <a>, routes use Inertia <Link>. */
function FooterLink({ href, children }) {
  const cls =
    'flex py-1.5 items-center text-[13.5px] text-white/60 transition-colors hover:text-white duration-150';
  if (href.startsWith('#')) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function SectionHeader({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-learn-primary-tint px-3.5 py-1.5 text-[13px] font-bold text-learn-primary">
        <Sparkles className="size-4" strokeWidth={2.2} />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight text-learn-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 text-[14px] leading-relaxed text-learn-muted sm:text-[15px]">{desc}</p>
    </div>
  );
}

/** Live app-style phone mockup built from the actual Home-hub design. */
function PhoneMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-learn-primary/25 blur-3xl" aria-hidden="true" />

      {/* Floating chips */}
      <div className="absolute -top-5 left-2 z-10 hidden animate-float items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 shadow-[0_12px_28px_rgba(20,23,43,0.25)] ring-1 ring-black/5 sm:flex">
        <Flame className="size-4 text-learn-warn" strokeWidth={2.4} />
        <span className="text-[13px] font-bold text-learn-ink">{toBnDigits(7)} দিনের ধারা</span>
      </div>
      <div className="absolute -bottom-4 right-0 z-10 hidden animate-float-delayed items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 shadow-[0_12px_28px_rgba(20,23,43,0.25)] ring-1 ring-black/5 sm:flex">
        <Star className="size-4 fill-learn-warn text-learn-warn" strokeWidth={0} />
        <span className="text-[13px] font-bold text-learn-ink">
          A2 <span className="text-learn-muted">→</span> B1
        </span>
      </div>

      {/* Frame */}
      <div className="relative mx-auto w-[262px] rounded-[40px] bg-learn-ink p-2.5 shadow-[0_36px_70px_rgba(20,23,43,0.5)] ring-1 ring-white/15 sm:w-[280px]">
        <div className="overflow-hidden rounded-[32px] bg-learn-bg text-left">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-learn-bg px-6 pt-4 pb-2 text-[13px] font-bold text-learn-ink">
            <span>{toBnDigits(9)}:৪১</span>
            <span className="flex items-center gap-1 text-learn-ink">
              <Signal className="size-3.5" strokeWidth={2.4} />
              <Wifi className="size-3.5" strokeWidth={2.4} />
              <BatteryFull className="size-4" strokeWidth={2.4} />
            </span>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-5 pt-1">
            <div className="leading-tight">
              <p className="text-[13px] text-learn-muted">শুভ সকাল</p>
              <p className="text-[15px] font-bold text-learn-ink">রিয়াদ</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-learn-warn-tint px-2.5 py-1 text-[13px] font-bold text-learn-warn">
              <Flame className="size-3.5" strokeWidth={2.4} />
              {toBnDigits(7)}
            </span>
          </div>

          {/* Today's lesson card */}
          <div className="mx-4 mt-3.5 rounded-[14px] bg-learn-primary p-4 text-white shadow-[0_8px_20px_rgba(43,89,195,0.3)]">
            <p className="text-[13px] font-semibold text-white/85">আজকের পড়া — দিন {toBnDigits(9)}</p>
            <p className="mt-0.5 text-[14px] font-bold font-learn-en">Unit 3: Daily Routine</p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-[60%] rounded-full bg-white" />
            </div>
            <div className="mt-3 flex justify-end">
              <span className="inline-flex h-8 items-center rounded-full bg-white px-3 text-[13px] font-bold text-learn-primary">
                চালিয়ে যান
              </span>
            </div>
          </div>

          {/* Word of the day */}
          <div className="mx-4 mt-3 rounded-[14px] bg-white p-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-learn-muted">আজকের শব্দ</p>
                <p className="text-[15px] font-bold font-learn-en text-learn-ink">reliable</p>
                <p className="text-[13px] text-learn-muted">নির্ভরযোগ্য</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-full bg-learn-primary-tint text-learn-primary">
                <Mic className="size-4" strokeWidth={2.2} />
              </span>
            </div>
          </div>

          {/* Weekly progress */}
          <div className="mx-4 mt-3 rounded-[14px] bg-white p-3.5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <p className="text-[13px] font-bold text-learn-ink">এই সপ্তাহের অগ্রগতি</p>
            <div className="mt-2.5 flex items-end justify-between px-1">
              {MOCK_SKILLS.map(({ bn, pct }) => (
                <div key={bn} className="flex flex-col items-center gap-1">
                  <div className="flex h-10 items-end">
                    <div className="w-2 rounded-full bg-learn-primary" style={{ height: `${Math.max(14, pct)}%` }} />
                  </div>
                  <span className="text-[13px] text-learn-muted">{bn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-4 flex items-center justify-between border-t border-learn-border bg-white px-4 py-2.5">
            <Home className="size-5 text-learn-primary" strokeWidth={2.2} />
            <BookOpen className="size-5 text-learn-muted" strokeWidth={2.2} />
            <span className="flex size-11 -translate-y-2 items-center justify-center rounded-full bg-learn-ai text-white shadow-[0_8px_18px_rgba(124,107,245,0.5)] ring-4 ring-learn-bg">
              <Sparkles className="size-5" strokeWidth={2.2} />
            </span>
            <Mic className="size-5 text-learn-muted" strokeWidth={2.2} />
            <User className="size-5 text-learn-muted" strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Fictional-but-honest AI chat preview inside the violet section. */
function AiChatMock() {
  return (
    <div className="relative rounded-[20px] bg-white p-5 shadow-[0_24px_50px_rgba(20,23,43,0.3)] ring-1 ring-black/5">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-learn-border pb-3.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-learn-ai text-white">
          <Bot className="size-5" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[14px] font-bold text-learn-ink">AI টিউটর</p>
          <p className="flex items-center gap-1 text-[13px] font-semibold text-learn-success">
            <span className="size-1.5 rounded-full bg-learn-success" /> অনলাইন
          </p>
        </div>
      </div>

      {/* messages */}
      <div className="space-y-3 py-4">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-learn-structure px-3.5 py-2.5 text-[14px] leading-relaxed text-learn-ink">
          হাই! আজ কী শিখতে চান?
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-learn-ai px-3.5 py-2.5 text-[14px] leading-relaxed text-white">
          Could you correct this sentence?
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-learn-structure px-3.5 py-2.5 text-[14px] leading-relaxed text-learn-ink">
          <p>
            <span className="font-bold text-learn-danger line-through">I am agree with you.</span>
          </p>
          <p className="mt-1 font-semibold text-learn-success">✓ I agree with you.</p>
          <p className="mt-1.5 text-[13px] text-learn-muted">
            "Agree" এর পরে "am" বসে না — এখানে সরাসরি verb বসে।
          </p>
        </div>
      </div>

      {/* input */}
      <div className="flex items-center gap-2 rounded-full border border-learn-border bg-learn-bg py-1.5 pl-4 pr-1.5">
        <span className="flex-1 text-[14px] text-learn-muted/70">ইংরেজিতে লিখুন…</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-learn-ai text-white">
          <Send className="size-4" strokeWidth={2.2} />
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── Data (props-driven) ────────────────────── */

const NAV_LINKS = [
  { href: '#features', label: 'বৈশিষ্ট্য' },
  { href: '#ai', label: 'AI টিউটর' },
  { href: '#how', label: 'কীভাবে কাজ করে' },
  // { href: '#pricing', label: 'মূল্য' }, // pricing section commented out
  { href: '#faq', label: 'প্রশ্নোত্তর' },
];

const DEFAULT_STATS = [
  { value: 4, label: 'দক্ষতা এক জায়গায়', sub: 'পড়া · শোনা · বলা · লেখা' },
  { value: '300+', label: 'পাঠ ও লেসন', sub: 'ধাপে ধাপে সাজানো' },
  { value: '2000+', label: 'শব্দ ও ফ্রেজ', sub: 'দৈনন্দিন ব্যবহারে' },
  { value: 15, label: 'মিনিট প্রতিদিন', sub: 'ছোট, নিয়মিত লেসন' },
];

// Pricing data — used by the commented-out subscription section above.
// const DEFAULT_PRICING = { daily: 2, weekly: 12 };

const MARQUEE_WORDS = [
  ['improve', 'উন্নতি করা'],
  ['reliable', 'নির্ভরযোগ্য'],
  ['confident', 'আত্মবিশ্বাসী'],
  ['achieve', 'অর্জন করা'],
  ['practice', 'অনুশীলন'],
  ['fluent', 'সাবলীল'],
  ['vocabulary', 'শব্দভাণ্ডার'],
  ['progress', 'অগ্রগতি'],
];

const SKILLS = [
  {
    Icon: BookOpen,
    title: 'পড়া',
    desc: 'গ্লোসারি ও উচ্চারণ সহ পাঠ — ধাপে ধাপে বুঝে পড়ার অভ্যাস।',
  },
  {
    Icon: Headphones,
    title: 'শোনা',
    desc: 'নিজের গতিতে লিসেনিং অনুশীলন, প্রতিটি শব্দের সাথে পরিচিতি।',
  },
  {
    Icon: Mic,
    title: 'বলা',
    desc: 'উচ্চারণ অনুশীলন ও স্কোর — ভুলগুলো ধরে ধরে শুধরে নিন।',
  },
  {
    Icon: PenLine,
    title: 'লেখা',
    desc: 'দৈনিক রাইটিং চর্চা, সঙ্গে AI-র তাৎক্ষণিক ফিডব্যাক।',
  },
];

const CORE_FEATURES = [
  { Icon: Layers, title: 'স্মার্ট ফ্ল্যাশকার্ড', desc: 'মুখস্থ করার বৈজ্ঞানিক পদ্ধতিতে নতুন শব্দ মনে রাখুন।' },
  { Icon: ClipboardList, title: 'কুইজ সেন্টার', desc: 'নিয়মিত কুইজে নিজের অগ্রগতি যাচাই করুন।' },
  { Icon: MessageCircle, title: 'ফ্রেজবুক', desc: 'দরকারি বাক্য ও এক্সপ্রেশন সবসময় হাতের কাছে।' },
  { Icon: Target, title: 'ব্যক্তিগত স্টাডি প্ল্যান', desc: 'আপনার লক্ষ্য ও সময় অনুযায়ী দিনে দিনে সাজানো।' },
  { Icon: TrendingUp, title: 'অগ্রগতি ড্যাশবোর্ড', desc: 'স্কিল-ভিত্তিক বিশ্লেষণে দেখুন কোথায় উন্নতি করছেন।' },
  { Icon: CalendarCheck, title: 'রিমাইন্ডার', desc: 'দৈনিক অনুশীলনে নিয়মিত থাকতে মনে করিয়ে দেবে।' },
];

const AI_FEATURES = [
  { Icon: Send, title: '২৪/৭ ইংরেজি চ্যাট', desc: 'যেকোনো সময় কথা বলুন, তাৎক্ষণিক সংশোধন পান।' },
  { Icon: PenTool, title: 'রাইটিং ফিডব্যাক', desc: 'লেখা জমা দিন — ভুল, উন্নতি ও স্কোর একসাথে।' },
  { Icon: Sparkles, title: 'লেভেল-ভিত্তিক গাইড', desc: 'আপনার লেভেল অনুযায়ী ঠিক কী শিখবেন, তার দিকনির্দেশনা।' },
];

const STEPS = [
  {
    Icon: UserPlus,
    title: 'প্রোফাইল তৈরি করুন',
    desc: 'নাম, শেখার লক্ষ্য ও দৈনিক সময় বলুন — ফোন নম্বর দিয়েই।',
  },
  {
    Icon: ClipboardList,
    title: 'লেভেল নির্ধারণ করুন',
    desc: 'ছোট একটি প্লেসমেন্ট টেস্টে আপনার বর্তমান লেভেল জানুন।',
  },
  {
    Icon: Rocket,
    title: 'প্রতিদিন শিখুন',
    desc: 'দৈনিক লেসন, ফ্ল্যাশকার্ড ও অনুশীলন — মাত্র ১৫ মিনিটে।',
  },
];

const TESTIMONIALS = [
  {
    name: 'রাফসান আহমেদ',
    city: 'ঢাকা',
    quote: 'দৈনিক ১৫ মিনিট করে শুরু করেছিলাম। এখন অফিসের মিটিংয়ে ইংরেজিতে বলতে আর ভয় পাই না।',
  },
  {
    name: 'নুসরাত জাহান',
    city: 'চট্টগ্রাম',
    quote: 'AI রাইটিং ফিডব্যাকের কারণে লেখার ভুলগুলো এখন নিজেই ধরতে পারি। সত্যিই দারুণ অভিজ্ঞতা।',
  },
  {
    name: 'তানভীর হাসান',
    city: 'সিলেট',
    quote: 'অফলাইনে ফ্ল্যাশকার্ড রিভিউ করি, কাজে আসা-যাওয়ার পথে। অনেক সময় বেঁচে যায়।',
  },
];

// const PLAN_FREE = ['মৌলিক পাঠ ও শব্দের তালিকা', 'দৈনিক কিছু অনুশীলন', 'অগ্রগতি ট্র্যাকিং', 'অফলাইন ফ্ল্যাশকার্ড'];
//
// const PLAN_PREMIUM = [
//   'সব পাঠ ও অনুশীলন আনলক',
//   'AI টিউটর ও রাইটিং ফিডব্যাক',
//   'কুইজ, ফ্রেজবুক ও মিস্টেক ডাক্তার',
//   'ব্যক্তিগত স্টাডি প্ল্যান ও রিমাইন্ডার',
// ];

const FAQS = [
  {
    q: 'কীভাবে শুরু করব?',
    a: 'ফোন নম্বর দিয়ে লগইন করুন — প্রথমবার একটি OTP যাচাই হবে। এরপর প্রোফাইল তৈরি করে নিজের গতিতে শেখা শুরু করুন।',
  },
  {
    q: 'ইন্টারনেট ছাড়া কি ব্যবহার করা যাবে?',
    a: 'হ্যাঁ। পাঠ, ফ্ল্যাশকার্ড, কুইজসহ বেশিরভাগ অনুশীলন অফলাইনে চলে। শুধু AI টিউটর ও রাইটিং ফিডব্যাকে ইন্টারনেট লাগবে।',
  },
  {
    q: 'সাবস্ক্রিপশন কীভাবে বাতিল করব?',
    a: 'SMS-এ STOP লিখে পাঠিয়ে অথবা USSD মেনু থেকে যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে পারবেন।',
  },
  {
    q: 'কোন ডিভাইসে চলে?',
    a: 'যেকোনো স্মার্টফোনের ব্রাউজারে চলে, আবার Android অ্যাপও ডাউনলোড করা যায়। শুধু আপনার ফোন নম্বর লাগবে।',
  },
  {
    q: 'আমার লেভেল কীভাবে নির্ধারিত হয়?',
    a: 'শুরুতে একটি সংক্ষিপ্ত প্লেসমেন্ট টেস্ট দিতে হবে। তার ফলাফলের ভিত্তিতে আপনার জন্য উপযুক্ত পাঠ ও অনুশীলন সাজানো হয়।',
  },
];

const FOOTER_PRODUCT = [
  { label: 'বৈশিষ্ট্য', href: '#features' },
  { label: 'AI টিউটর', href: '#ai' },
  // { label: 'মূল্য', href: '#pricing' }, // pricing section commented out
  // { label: 'Android অ্যাপ', href: '/app' }, // app download commented out
];

const FOOTER_SUPPORT = [
  { label: 'প্রশ্নোত্তর', href: '#faq' },
  { label: 'লগইন', href: '/login' },
  // { label: 'সাবস্ক্রিপশন', href: '#pricing' }, // pricing section commented out
  { label: 'নতুন করে শুরু', href: '/welcome/profile' },
];

const MOCK_SKILLS = [
  { bn: 'পড়া', pct: 70 },
  { bn: 'শোনা', pct: 55 },
  { bn: 'বলা', pct: 40 },
  { bn: 'লেখা', pct: 50 },
];
