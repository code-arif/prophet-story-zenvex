import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'features', label: 'বৈশিষ্ট্য' },
  { id: 'library', label: 'লাইব্রেরি' },
  { id: 'how-it-works', label: 'কিভাবে কাজ করে' },
  { id: 'testimonials', label: 'মতামত' },
  { id: 'faq', label: 'FAQ' },
];
import {
  BookOpen,
  Headphones,
  Baby,
  BarChart3,
  Globe,
  Shield,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Star,
  Play,
  CheckCircle2,
  Languages,
  Heart,
  Library,
  ScrollText,
  Volume2,
  BookMarked,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: 'কুরআন ও সুন্নাহভিত্তিক',
    desc: 'প্রতিটি গল্প কুরআন ও সহিহ হাদিসের নির্ভরযোগ্য সূত্র থেকে সংকলিত ও যাচাইকৃত।',
    color: 'bg-primary/15 text-primary border-primary/30',
    iconBg: 'bg-primary text-white shadow-primary/25',
  },
  {
    icon: Baby,
    title: 'কিড মোড',
    desc: 'বাচ্চাদের জন্য বিশেষায়িত পাঠ — সহজ ভাষা, রঙিন ইন্টারফেস ও আকর্ষণীয় ডিজাইন।',
    color: 'bg-kid/15 text-kid border-kid/30',
    iconBg: 'bg-kid text-white shadow-kid/25',
  },
  {
    icon: Headphones,
    title: 'অডিও নারেশন',
    desc: 'প্রতিটি অধ্যায়ে পেশাদার কণ্ঠে অডিও — শুনুন যেকোনো সময়, যেকোনো জায়গায়।',
    color: 'bg-accent/15 text-accent border-accent/30',
    iconBg: 'bg-accent text-white shadow-accent/25',
  },
  {
    icon: BarChart3,
    title: 'পড়ার অগ্রগতি',
    desc: 'প্রতিটি নবীর গল্পে আপনার পড়ার অগ্রগতি ট্র্যাক করুন — কতটুকু শেষ হয়েছে তা দেখুন।',
    color: 'bg-info/15 text-info border-info/30',
    iconBg: 'bg-info text-white shadow-info/25',
  },
  {
    icon: Languages,
    title: 'বাংলা ও আরবি',
    desc: 'বাংলায় পূর্ণাঙ্গ পাঠ ও আরবিতে নবীদের নাম — দুই ভাষায় একসাথে অনুভব করুন।',
    color: 'bg-secondary/15 text-secondary border-secondary/30',
    iconBg: 'bg-secondary text-white shadow-secondary/25',
  },
  {
    icon: Shield,
    title: 'নিরাপদ ও বিশ্বস্ত',
    desc: 'বিজ্ঞাপনমুক্ত, শিশুনৈর্ভর পরিবেশ — আপনার সন্তানদের জন্য নিরাপড় পড়ার অভিজ্ঞতা।',
    color: 'bg-success/15 text-success border-success/30',
    iconBg: 'bg-success text-white shadow-success/25',
  },
];

const PROPHETS = [
  { name: 'আদম (আ.)', nameArabic: 'آدم', chapters: 3, emoji: '🕌' },
  { name: 'নূহ (আ.)', nameArabic: 'نوح', chapters: 5, emoji: '🌊' },
  { name: 'ইব্রাহিম (আ.)', nameArabic: 'إبراهيم', chapters: 4, emoji: '🕋' },
  { name: 'মূসা (আ.)', nameArabic: 'موسى', chapters: 6, emoji: '📜' },
  { name: 'ঈসা (আ.)', nameArabic: 'عيسى', chapters: 4, emoji: '✨' },
  { name: 'মুহাম্মদ (সা.)', nameArabic: 'محمد', chapters: 8, emoji: '🌟' },
];

const HOW_STEPS = [
  {
    num: '১',
    title: 'লাইব্রেরি ব্রাউজ করুন',
    desc: '২৫+ নবীর গল্পের সম্পূর্ণ লাইব্রেরি থেকে আপনার পছন্দের নবী বেছে নিন।',
    icon: Library,
    color: 'bg-primary',
  },
  {
    num: '২',
    title: 'পড়ুন বা শুনুন',
    desc: 'বড়দের জন্য স্ট্যান্ডার্ড মোড বা বাচ্চাদের জন্য কিড মোডে পড়ুন। অডিও চালু করে শুনতে পারেন।',
    icon: BookOpen,
    color: 'bg-accent',
  },
  {
    num: '৩',
    title: 'অগ্রগতি ট্র্যাক করুন',
    desc: 'প্রতিটি অধ্যায় পড়া শেষে চিহ্নিত করুন এবং আপনার সম্পূর্ণ পড়ার যাত্রা দেখুন।',
    icon: BarChart3,
    color: 'bg-success',
  },
];

const TESTIMONIALS = [
  {
    name: 'ফাতিমা আক্তার',
    location: 'ঢাকা',
    text: 'আমার মেয়ে (৮ বছর) প্রতিদিন কিড মোডে নবীদের গল্প পড়ে। খুবই সুন্দর ভাষায় লেখা, বাচ্চাদের ভালোবাসে।',
    rating: 5,
  },
  {
    name: 'মোঃ রাকিবুল হাসান',
    location: 'চট্টগ্রাম',
    text: 'অডিও ফিচারটি অসাধারণ। গাড়ি চালানোর সময় শুনতে পারি। পেশাদার কণ্ঠে গল্প শোনার অভিজ্ঞতা চমৎকার।',
    rating: 5,
  },
  {
    name: 'সাবরিনা রহমান',
    location: 'সিলেট',
    text: 'আমার ছেলেদের জন্য সেরা অ্যাপ। বিজ্ঞাপন নেই, নিরাপদ, আর গল্পগুলো কুরআন ও হাদিস থেকে নেওয়া — মনে প্রশান্তি থাকে।',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'গল্পগুলো কি নির্ভরযোগ্য সূত্র থেকে নেওয়া?',
    a: 'হ্যাঁ, প্রতিটি গল্প কুরআন ও সহিহ হাদিসের নির্ভরযোগ্য সূত্র থেকে সংকলিত। প্রতিটি অধ্যায়ের শেষে সূত্র (Source Reference) উল্লেখ করা আছে।',
  },
  {
    q: 'কিড মোড কীভাবে কাজ করে?',
    a: 'কিড মোডে গল্পের ভাষা সরলীকৃত, ফন্ট আকার বড়, এবং ইন্টারফেস রঙিন ও আকর্ষণীয়। বাচ্চারা সহজেই পড়তে পারবে। TopBar থেকে এক ক্লিকে কিড মোড চালু/বন্ধ করা যায়।',
  },
  {
    q: 'অফলাইনে কি পড়া যায়?',
    a: 'হ্যাঁ, অ্যাপে অফলাইন সাপোর্ট আছে। একবার চ্যাপ্টার পড়লে সেটি ক্যাশে সংরক্ষিত হয় এবং ইন্টারনেট ছাড়াই পরবর্তী সময়ে পড়া যায়।',
  },
  {
    q: 'বাচ্চাদের জন্য কি নিরাপদ?',
    a: 'পুরোপুরি। কোনো বিজ্ঞাপন নেই, কোনো বাইরের লিংক নেই, এবং পুরো পরিবেশটি শিশুবান্ধব। শুধুমাত্র ধর্মীয় শিক্ষামূলক বিষয়বস্তু রয়েছে।',
  },
  {
    q: 'নতুন গল্প কতদিন পর যোগ হয়?',
    a: 'আমরা নিয়মিত নতুন অধ্যায় ও নবীর গল্প যোগ করে থাকি। আমাদের টিম কুরআন ও হাদিস থেকে সতর্কতার সাথে নতুন বিষয়বস্তু সংকলন করে।',
  },
];

export default function LandingIndex() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const { auth } = usePage().props;
  const isLoggedIn = auth?.isLoggedIn ?? false;
  // Authenticated subscribers go straight to the app; guests must log in first.
  const appHref = isLoggedIn ? '/library' : '/login';
  const appLabel = isLoggedIn ? 'লাইব্রেরিতে যান' : 'লগইন করুন';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerOffset = 130;

      // If scrolled to near the bottom of the page, activate the last section (faq)
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection('faq');
        return;
      }

      // If at top hero area, reset active section
      if (scrollY < 180) {
        setActiveSection('');
        return;
      }

      let current = '';
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop - headerOffset;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            current = item.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      setActiveSection(id);
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <>
      <Head title="Prophet Stories — নবীদের গল্প | কুরআন ও সুন্নাহভিত্তিক গল্প পাঠ" />

      <div className="min-h-screen bg-gradient-to-b from-bg-from to-bg-to text-ink font-sans selection:bg-primary selection:text-white">
        {/* ═══════════════ STICKY HEADER ═══════════════ */}
        <header className="sticky top-0 z-40 bg-brand/95 backdrop-blur-md text-white border-b border-white/10 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Prophet Stories Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  Prophet Stories
                  <span className="text-primary text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">নবীদের গল্প</span>
                </span>
                <span className="text-[10px] text-white/60 block font-medium">কুরআন ও সুন্নাহভিত্তিক গল্প পাঠ</span>
              </div>
            </Link>

            {/* Desktop Navigation with Active Indicator */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
                      isActive
                        ? 'text-white font-black'
                        : 'text-white/75 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeLandingNavIndicator"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/25"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                      )}
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={appHref}
                className="py-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Library className="w-3.5 h-3.5" />
                <span>{appLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Strip with Active Indicator */}
          <div className="md:hidden overflow-x-auto no-scrollbar py-2 px-3 border-t border-white/10 bg-brand/95 backdrop-blur-md flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-sm font-black'
                      : 'text-white/70 bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && <span className="size-1.5 rounded-full bg-white animate-pulse" />}
                  {item.label}
                </a>
              );
            })}
          </div>
        </header>

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand via-brand-dark to-[#111820] text-white pt-14 pb-24 sm:pt-20 sm:pb-32 rounded-b-[40px] shadow-xl">
          {/* Decorative glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-primary text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                <span>কুরআন ও সুন্নাহভিত্তিক — ১০০% নির্ভরযোগ্য</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl lg:text-[54px] font-black leading-[1.15] tracking-tight">
                নবীদের <span className="text-primary">গল্প পড়ুন,</span><br />
                জীবনে <span className="text-accent">অনুপ্রেরণা</span> খুঁজুন
              </motion.h1>

              <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                ২৫+ নবীর গল্পের সম্পূর্ণ লাইব্রেরি — কুরআন ও সহিহ হাদিস থেকে সংকলিত।
                বড়দের জন্য স্ট্যান্ডার্ড মোড, বাচ্চাদের জন্য কিড মোড, এবং পেশাদার অডিও নারেশন।
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={appHref}
                  className="py-3.5 px-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm shadow-xl shadow-primary/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isLoggedIn ? 'লাইব্রেরিতে যান' : 'লগইন করে পড়া শুরু করুন'}</span>
                </Link>

                <a
                  href="#features"
                  className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>বৈশিষ্ট্য দেখুন</span>
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-primary block">২৫+</span>
                  <span className="text-[11px] text-white/60 font-medium">নবীর গল্প</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-accent block">১০০+</span>
                  <span className="text-[11px] text-white/60 font-medium">অধ্যায়</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-success block">১০০%</span>
                  <span className="text-[11px] text-white/60 font-medium">নিরাপদ পাঠ</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual — Mock Phone with Reading UI */}
            <motion.div
              className="lg:col-span-5 relative flex justify-center"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-[280px] sm:w-[300px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-4 shadow-2xl">
                {/* Phone Notch */}
                <div className="w-24 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

                {/* Reading Card */}
                <div className="bg-white rounded-2xl p-5 space-y-4 text-ink shadow-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">পড়ছেন</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[13px] font-bold text-secondary">মূসা (আ.)</p>
                    <h3 className="text-[17px] font-black text-ink leading-snug">
                      আরশের গল্প — ফিরাউনের কাছ থেকে উদ্ধার
                    </h3>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary to-accent" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>অধ্যায় ৪ / ৬</span>
                    <span className="font-bold text-primary">৬৫%</span>
                  </div>

                  {/* Audio player hint */}
                  <div className="flex items-center gap-2 bg-bg-from rounded-xl p-2.5 border border-primary/10">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                    <div className="flex-1">
                      <div className="h-1 w-full rounded-full bg-primary/15 overflow-hidden">
                        <div className="h-full w-[40%] rounded-full bg-primary" />
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-muted" />
                  </div>
                </div>

                {/* Kid Mode Toggle Hint */}
                <div className="mt-3 flex items-center justify-center gap-2 bg-white/10 rounded-xl p-2.5 border border-white/15">
                  <Baby className="w-3.5 h-3.5 text-kid" />
                  <span className="text-[11px] font-bold text-white/80">কিড মোড সক্রিয়</span>
                  <div className="w-8 h-4 rounded-full bg-kid relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ FEATURES SECTION ═══════════════ */}
        <section id="features" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-wider border border-primary/20">
              বৈশিষ্ট্যসমূহ (Features)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              যে ৬টি বৈশিষ্ট্যে আমরা আলাদা
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              শিশু থেকে বয়স্ক — সবার জন্য ডিজাইনকৃত গল্প পাঠের অভিজ্ঞতা
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`group p-6 rounded-3xl border ${feat.color} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center shadow-lg mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">{feat.title}</h3>
                  <p className="text-[13px] text-muted leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ═══════════════ LIBRARY PREVIEW ═══════════════ */}
        <section id="library" className="py-16 sm:py-20 bg-white border-y border-border-rest">
          <div className="max-w-6xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-wider border border-secondary/20">
                লাইব্রেরি (Library)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                নবীদের গল্প — আপনার অপেক্ষায়
              </h2>
              <p className="text-sm text-muted max-w-lg mx-auto">
                প্রতিটি নবীর গল্পে একাধিক অধ্যায় — ধাপে ধাপে পড়ুন, অগ্রগতি দেখুন
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
            >
              {PROPHETS.map((prophet, idx) => (
                <motion.div key={idx} variants={scaleIn}>
                  <Link
                    href={appHref}
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-primary/15 bg-bg-light/80 hover:bg-white hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {prophet.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-[15px] font-bold text-ink group-hover:text-primary transition-colors truncate">
                          {prophet.name}
                        </h3>
                        <span dir="rtl" className="shrink-0 text-[13px] text-secondary font-semibold">
                          {prophet.nameArabic}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted mt-0.5 flex items-center gap-1">
                        <BookMarked className="w-3 h-3" />
                        {prophet.chapters}টি অধ্যায়
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center pt-4">
              <Link
                href={appHref}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition transform hover:-translate-y-0.5"
              >
                <Library className="w-4 h-4" />
                {isLoggedIn ? 'সম্পূর্ণ লাইব্রেরি দেখুন' : 'লগইন করে লাইব্রেরি দেখুন'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ READING MODES COMPARISON ═══════════════ */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-accent bg-accent/10 px-4 py-1.5 rounded-full uppercase tracking-wider border border-accent/20">
              পাঠ মোড (Reading Modes)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              দুই রকমের পাঠ অভিজ্ঞতা
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              বড়দের জন্য স্ট্যান্ডার্ড মোড, বাচ্চাদের জন্য কিড মোড — একই গল্প, দুই ভাষায়
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Mode */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative p-6 sm:p-8 rounded-3xl border-2 border-primary/30 bg-white shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-ink">স্ট্যান্ডার্ড মোড</h3>
                  <p className="text-[12px] text-muted font-medium">বড়দের জন্য</p>
                </div>
              </div>

              <ul className="space-y-3 text-[13px] text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>বুক-স্টাইল টাইপোগ্রাফি — আরামদায়ক পাঠ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>৪ ধাপের ফন্ট সাইজ কন্ট্রোল (১৬px — ২১.৫px)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>প্রতিটি গল্পের শিক্ষা (Moral Lesson) আলাদা সেকশনে</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>সূত্র উল্লেখ — কুরআন/হাদিস রেফারেন্স</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>অডিও প্লেয়ার — পেশাদার কণ্ঠে নারেশন</span>
                </li>
              </ul>
            </motion.div>

            {/* Kid Mode */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative p-6 sm:p-8 rounded-3xl border-2 border-kid/30 bg-white shadow-lg overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-kid/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-kid text-white flex items-center justify-center shadow-md shadow-kid/25">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-ink">কিড মোড</h3>
                  <p className="text-[12px] text-muted font-medium">বাচ্চাদের জন্য</p>
                </div>
              </div>

              <ul className="space-y-3 text-[13px] text-ink/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-kid shrink-0 mt-0.5" />
                  <span>সরলীকৃত বাংলা ভাষা — বাচ্চাদের বোধগম্য</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-kid shrink-0 mt-0.5" />
                  <span>বড় ফন্ট ও রঙিন ইন্টারফেস</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-kid shrink-0 mt-0.5" />
                  <span>ইমোজি ও আকর্ষণীয় ভিজ্যুয়াল</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-kid shrink-0 mt-0.5" />
                  <span>এক ক্লিকে মোড সুইচ — TopBar থেকে</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-kid shrink-0 mt-0.5" />
                  <span>নিরাপদ পরিবেশ — কোনো বিজ্ঞাপন নেই</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-border-rest">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-ink bg-slate-200/80 px-4 py-1.5 rounded-full uppercase tracking-wider">
                সহজ প্রক্রিয়া (How It Works)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink">
                মাত্র ৩টি সহজ ধাপে শুরু করুন
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-accent to-success" />

              {HOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="relative bg-bg-light p-8 rounded-3xl border border-border-rest text-center space-y-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 rounded-full ${step.color} text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg relative z-10`}>
                      {step.num}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4 text-muted" />
                      <h3 className="text-base font-bold text-ink">{step.title}</h3>
                    </div>
                    <p className="text-[13px] text-muted leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section id="testimonials" className="py-16 sm:py-20 bg-brand text-white">
          <div className="max-w-6xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-primary bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-wider border border-white/15">
                পাঠকদের মতামত (Reviews)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                আমাদের পাঠকরা কি বলছেন
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white/10 p-6 rounded-3xl border border-white/15 space-y-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-[13px] text-white/90 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="text-[12px] border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="font-bold text-white">{t.name}</span>
                    <span className="text-white/50">{t.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA BANNER ═══════════════ */}
        <section className="py-16 max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-primary to-accent text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.15),_transparent)] pointer-events-none" />
            <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full inline-block backdrop-blur-sm">
                আজই শুরু করুন
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                নবীদের গল্প পড়া শুরু করুন — এখনই!
              </h2>
              <p className="text-sm font-medium text-white/90 leading-relaxed">
                বিজ্ঞাপনমুক্ত এবং সম্পূর্ণ নিরাপদ। আপনার ফোনেই পাবেন ২৫+ নবীর গল্প।
              </p>
            </div>

            <div className="shrink-0 relative z-10">
              <Link
                href={appHref}
                className="py-4 px-8 rounded-2xl bg-white hover:bg-white/90 text-primary font-black text-sm shadow-2xl transition transform hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>{isLoggedIn ? 'লাইব্রেরিতে যান' : 'লগইন করে পড়ুন'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section id="faq" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-ink bg-slate-200/80 px-4 py-1.5 rounded-full uppercase tracking-wider">
              সচরাচর জিজ্ঞাসা (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              সাধারণ জিজ্ঞাসিত প্রশ্নাবলি
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-border-rest shadow-xs overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-ink flex items-center justify-between gap-4 cursor-pointer hover:bg-bg-from/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted shrink-0 transform transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="px-5 pb-5 text-[13px] text-muted border-t border-border-rest pt-3 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="bg-brand text-white pt-12 pb-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <img
                src="/logo.png"
                alt="Prophet Stories"
                className="w-8 h-8 rounded-xl object-cover"
              />
                <span className="text-base font-black text-white">Prophet Stories</span>
              </div>
              <p className="text-white/60 leading-relaxed">
                কুরআন ও সহিহ সূত্রভিত্তিক নবী-কাহিনীর সম্পূর্ণ বাংলা লাইব্রেরি। বিজ্ঞাপনমুক্ত ও মনোযোগী পাঠের অভিজ্ঞতা।
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-primary">লাইব্রেরি</h4>
              <ul className="space-y-1.5 text-white/60">
                <li><Link href={appHref} className="hover:text-white transition">সব গল্প</Link></li>
                <li><a href="#features" className="hover:text-white transition">বৈশিষ্ট্যসমূহ</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">কিভাবে কাজ করে</a></li>
                <li><a href="#faq" className="hover:text-white transition">সাধারণ জিজ্ঞাসা</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-primary">নবীগণ</h4>
              <ul className="space-y-1.5 text-white/60">
                <li><Link href={appHref} className="hover:text-white transition">আদম (আ.)</Link></li>
                <li><Link href={appHref} className="hover:text-white transition">নূহ (আ.)</Link></li>
                <li><Link href={appHref} className="hover:text-white transition">ইব্রাহিম (আ.)</Link></li>
                <li><Link href={appHref} className="hover:text-white transition">মূসা (আ.)</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-primary">যোগাযোগ</h4>
              <p className="text-white/60 leading-relaxed">
                প্রশ্ন বা মতামত জানাতে যোগাযোগ করুন।<br />
                ঢাকা, বাংলাদেশ
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition" aria-label="Facebook">
                  <Globe className="w-4 h-4 text-white/70" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition" aria-label="Email">
                  <ScrollText className="w-4 h-4 text-white/70" />
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40">
            <span>© {new Date().getFullYear()} Prophet Stories. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-urgent fill-urgent" /> for the Ummah
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
