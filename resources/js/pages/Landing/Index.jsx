import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Zap,
  Wind,
  Hammer,
  Paintbrush,
  Tv,
  Grid,
  ShieldCheck,
  Star,
  Clock,
  DollarSign,
  ThumbsUp,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Calendar,
  PhoneCall,
  MapPin,
  Heart,
  Briefcase,
  History,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const safeRoute = (name, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.route === 'function') {
    try {
      return window.route(name, params);
    } catch (e) {}
  }
  const routes = {
    'providers.index': '/providers',
    'providers.favorites': '/providers/favorites',
    'service-requests.history': '/service-requests/history',
    'provider.setup': '/provider/setup',
  };
  let url = routes[name] || '/';
  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    if (query) url += '?' + query;
  }
  return url;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const CATEGORIES = [
  { slug: 'electrician', name: 'ইলেকট্রিশিয়ান', desc: 'ফ্যান, লাইট, সার্কিট ব্রেকার, ওয়ারিং সার্ভিসিং', icon: Zap, bg: 'bg-[#FFC300]/15 text-[#37474F] border-[#FFC300]/40' },
  { slug: 'plumber', name: 'প্লাম্বার', desc: 'পাইপ লিকেজ, ট্যাপ, বেসিন, ওয়াটার পাম্প সার্ভিসিং', icon: Wrench, bg: 'bg-[#00B894]/15 text-[#00B894] border-[#00B894]/40' },
  { slug: 'ac-mechanic', name: 'এসি মেকানিক', desc: 'এসি সার্ভিসিং, গ্যাস রিফিল, ইনস্টলেশন ও রিপেয়ার', icon: Wind, bg: 'bg-sky-500/15 text-sky-600 border-sky-500/40' },
  { slug: 'carpenter', name: 'কার্পেন্টার', desc: 'ডোর, ফার্নিচার, লক রিপেয়ার ও উড ফিটিং', icon: Hammer, bg: 'bg-amber-700/15 text-amber-700 border-amber-700/40' },
  { slug: 'painter', name: 'পেইন্টার', desc: 'ইনডোর/আউটডোর রুম পেইন্টিং ও ড্যাম্প প্রুফিং', icon: Paintbrush, bg: 'bg-purple-600/15 text-purple-600 border-purple-600/40' },
  { slug: 'appliance-repair', name: 'অ্যাপ্লায়েন্স রিপেয়ার', desc: 'টিভি, ফ্রিজ, ওয়াশিং মেশিন ও মাইক্রোওয়েভ সার্ভিস', icon: Tv, bg: 'bg-rose-500/15 text-rose-600 border-rose-500/40' },
];

const FAQS = [
  { q: 'সার্ভিস ফি ও খরচ কিভাবে নির্ধারিত হয়?', a: 'প্রতিটি প্রোভাইডার প্রোফাইলে স্পষ্ট ভিজিট ফি (যেমন: ৳১৫০) ও ঘণ্টাভিত্তিক মজুরি উল্লেখ করা থাকে। এছাড়া সার্ভিস শেষ হলে প্রোভাইডার স্পেসিফিক কোটেশন পাঠালে কাস্টমার রিভিউ করে গ্রহণ করতে পারেন।' },
  { q: 'আমি কিভাবে পেমেন্ট সম্পন্ন করতে পারব?', a: 'আমরা ক্যাশ পেমেন্টের পাশাপাশি বিকাশ ও নগদ সাপোর্ট করি। কাজ সম্পন্ন হলে আপনি ক্যাশ দিতে পারেন অথবা মিস্ত্রির বিকাশ/নগদ নম্বরে সরাসরি পাঠাতে পারেন।' },
  { q: 'মিস্ত্রিদের সততা ও দক্ষতা কিভাবে নিশ্চিত করা হয়?', a: 'আমাদের সকল মিস্ত্রি ও কারিগরের জাতীয় পরিচয়পত্র (NID) এবং ট্রেড সনদ ভেরিফাই করা হয়। প্রতিটি কাজের পর কাস্টমারদের দেওয়া রেটিং ও প্রাইস ফেয়ারনেস স্কোরের ভিত্তিতে প্রোভাইডারদের মান নিশ্চিত রাখা হয়।' },
  { q: 'কাজে কোনো সমস্যা বা মতবিরোধ দেখা দিলে কি করব?', a: 'যেকোনো কাজের বিস্তারিত পেজ থেকে সরাসরি "সমস্যা রিপোর্ট করুন" অপশন ব্যবহার করে নো-শো, নিম্নমানের কাজ বা মূল্য সংক্রান্ত বিরোধের জন্য রিপোর্ট জানাতে পারবেন।' },
];

export default function LandingIndex() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Head title="Mistri Call — অন-ডিমান্ড গৃহস্থালি মিস্ত্রি সার্ভিস প্ল্যাটফর্ম" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans selection:bg-[#FFC300] selection:text-[#37474F]">
        {/* Sticky Header Navigation */}
        <header className="sticky top-0 z-40 bg-[#37474F]/95 backdrop-blur-md text-white border-b border-white/10 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC300] text-[#37474F] font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 text-[#37474F]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Mistri Call <span className="text-[#FFC300] text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">মিস্ত্রি কল</span>
                </span>
                <span className="text-[10px] text-white/70 block font-medium">বিশ্বস্ত হোম রিপেয়ার প্ল্যাটফর্ম</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-white/90">
              <a href="#categories" className="hover:text-[#FFC300] transition">সার্ভিসসমূহ</a>
              <a href="#why-us" className="hover:text-[#FFC300] transition">কেন মিস্ত্রি কল?</a>
              <a href="#how-it-works" className="hover:text-[#FFC300] transition">যেভাবে কাজ করে</a>
              <a href="#testimonials" className="hover:text-[#FFC300] transition">রিভিউ</a>
              <a href="#faq" className="hover:text-[#FFC300] transition">FAQ</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={safeRoute('providers.favorites')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
                title="প্রিয় মিস্ত্রি তালিকা"
              >
                <Heart className="w-4 h-4 text-[#FF6F3C]" />
              </Link>

              <Link
                href={safeRoute('service-requests.history')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white hidden sm:flex"
                title="সার্ভিস হিস্ট্রি"
              >
                <History className="w-4 h-4 text-[#FFC300]" />
              </Link>

              <Link
                href={safeRoute('providers.index')}
                className="py-2 px-4 rounded-xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition flex items-center gap-1"
              >
                <span>মিস্ত্রি খুঁজুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* SECTION 1: HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#37474F] via-[#2c383f] to-[#1f282d] text-white pt-12 pb-20 rounded-b-[40px] shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC300]/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <motion.div 
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#FFC300] text-xs font-bold backdrop-blur-md shadow-2xs">
                <Sparkles className="w-4 h-4 animate-spin text-[#FFC300]" />
                <span>বাংলাদেশের ১ নম্বর ঘরোয়া সার্ভিস নেটওয়ার্ক</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">
                ঘরের যেকোনো মেরামত,<br />
                <span className="text-[#FFC300]">বিশ্বস্ত মিস্ত্রি</span> এখন এক ক্লিকেই!
              </motion.h1>

              <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                ইলেকট্রিশিয়ান, প্লাম্বার, এসি মেকানিক বা পেইন্টার — কাজের আগেই দেখুন ভিজিট ফি ও কাস্টমার রিভিউ। কোনো লুকানো চার্জ ছাড়াই অভিজ্ঞ কারিগর ডাকুন।
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={safeRoute('providers.index')}
                  className="py-3.5 px-7 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-black text-sm shadow-xl shadow-[#FFC300]/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>এখনই মিস্ত্রি বুক করুন</span>
                </Link>

                <Link
                  href={safeRoute('provider.setup')}
                  className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-[#FFC300]" />
                  <span>প্রোভাইডার হিসেবে জয়েন করুন</span>
                </Link>
              </motion.div>

              {/* Trust signals indicators */}
              <motion.div variants={fadeUp} className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#FFC300] block">৫,০০০+</span>
                  <span className="text-[11px] text-white/70 font-medium">সম্পন্ন গৃহস্থালি কাজ</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#00B894] block">৯৮%</span>
                  <span className="text-[11px] text-white/70 font-medium">প্রাইস ফেয়ারনেস স্কোর</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white block">১০০%</span>
                  <span className="text-[11px] text-white/70 font-medium">এনআইডি ভেরিফাইড</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Card Visual */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 text-slate-800">
                <div className="flex items-center justify-between border-b border-white/15 pb-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00B894] animate-ping" />
                    <span className="text-xs font-bold">ইনস্ট্যান্ট এভেইলএবল মিস্ত্রি</span>
                  </div>
                  <span className="text-[11px] bg-[#FFC300] text-[#37474F] font-black px-2.5 py-0.5 rounded-full">
                    লাইভ ট্র্যাকিং
                  </span>
                </div>

                {/* Demo Floating Card */}
                <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#37474F] text-[#FFC300] font-black flex items-center justify-center">
                        আ
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#37474F]">আরিফ হোসেন (ইলেকট্রিশিয়ান)</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Star className="w-3 h-3 fill-[#FFC300] text-[#FFC300]" />
                          <span className="font-bold text-slate-700">4.9/5.0</span>
                          <span>(১২৮টি রিভিউ)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#00B894] bg-[#00B894]/15 px-2 py-0.5 rounded-md">
                      ভেরিফায়েড
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">কল-আউট চার্জ</span>
                      <span className="font-bold text-[#37474F]">৳১৫০</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">লেবার রেট</span>
                      <span className="font-bold text-[#37474F]">৳৩০০ / ঘণ্টা</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">ফেয়ারনেস</span>
                      <span className="font-bold text-[#00B894]">👍 ৯৬%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/15 text-white text-xs flex items-center justify-between">
                  <span className="font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FFC300]" /> গড় সার্ভিস আগমন সময়:
                  </span>
                  <span className="font-black text-[#FFC300]">১৫-৩০ মিনিট</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: SERVICE CATEGORIES GRID */}
        <section id="categories" className="py-16 max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#37474F] bg-[#FFC300]/20 px-3.5 py-1 rounded-full uppercase tracking-wider">
              সার্ভিস ক্যাটাগরি (Services)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#37474F]">
              আপনার কোন কাজ প্রয়োজন?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              প্রয়োজনীয় ক্যাটাগরি বেছে নিন এবং আপনার এলাকার সেরা কারিগরদের সাথে সরাসরি যোগাযোগ করুন
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.slug} variants={fadeUp}>
                  <Link
                    href={safeRoute('providers.index', { category: cat.slug })}
                    className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 block space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-3.5 rounded-2xl border ${cat.bg} transition-transform group-hover:scale-110`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-slate-300 group-hover:text-[#37474F] transition">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#37474F] group-hover:text-[#00B894] transition">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="pt-2 text-[11px] font-extrabold text-[#37474F] flex items-center gap-1">
                      <span>প্রোভাইডার দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FFC300]" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* SECTION 3: CORE FEATURES / WHY US */}
        <section id="why-us" className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#00B894] bg-[#00B894]/15 px-3.5 py-1 rounded-full uppercase tracking-wider">
                কেন মিস্ত্রি কল? (Why Choose Us)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#37474F]">
                যে ৪টি কারণে গ্রাহকরা আমাদের বিশ্বাস করেন
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#F7F8FA] p-6 rounded-3xl border border-slate-200 space-y-3 hover:border-slate-300 transition">
                <div className="p-3 w-12 h-12 rounded-2xl bg-[#FFC300] text-[#37474F] font-bold flex items-center justify-center shadow-md">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#37474F]">স্বচ্ছ আপফ্রন্ট প্রাইসিং</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  কাজের আগেই প্রোভাইডারের কল-আউট ভিজিট ফি ও ঘণ্টাভিত্তিক শ্রম মজুরি জানতে পারবেন।
                </p>
              </div>

              <div className="bg-[#F7F8FA] p-6 rounded-3xl border border-slate-200 space-y-3 hover:border-slate-300 transition">
                <div className="p-3 w-12 h-12 rounded-2xl bg-[#00B894] text-white font-bold flex items-center justify-center shadow-md">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#37474F]">প্রাইস ফেয়ারনেস সিগন্যাল</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  অন্যান্য কাস্টমারদের দেওয়া ফেয়ারনেস স্কোরের মাধ্যমে নিশ্চিত হন দাম সঠিক নাকি বেশি নেওয়া হয়েছে।
                </p>
              </div>

              <div className="bg-[#F7F8FA] p-6 rounded-3xl border border-slate-200 space-y-3 hover:border-slate-300 transition">
                <div className="p-3 w-12 h-12 rounded-2xl bg-[#37474F] text-[#FFC300] font-bold flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#37474F]">এনআইডি ভেরিফাইড প্রোভাইডার</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আমাদের সকল টেকনিশিয়ান ও মিস্ত্রির জাতীয় পরিচয়পত্র ও কাজের যোগ্যতা যাচাই করা হয়।
                </p>
              </div>

              <div className="bg-[#F7F8FA] p-6 rounded-3xl border border-slate-200 space-y-3 hover:border-slate-300 transition">
                <div className="p-3 w-12 h-12 rounded-2xl bg-[#FF6F3C] text-white font-bold flex items-center justify-center shadow-md">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#37474F]">ফ্লেক্সিবল শিডিউল ও পেমেন্ট</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  আপনার সুবিধাজনক সময় সিলেক্ট করুন এবং কাজ শেষে ক্যাশ, বিকাশ বা নগদে পেমেন্ট পরিশোধ করুন।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section id="how-it-works" className="py-16 max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#37474F] bg-slate-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
              সহজ প্রক্রিয়া (How It Works)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#37474F]">
              মাত্র ৩টি সহজ ধাপে কাজ সম্পন্ন করুন
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFC300] text-[#37474F] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                ১
              </div>
              <h3 className="text-base font-bold text-[#37474F]">মিস্ত্রি বা ক্যাটাগরি নির্বাচন করুন</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার এলাকার ফিল্টার করা মিস্ত্রি তালিকা থেকে দূরত্ব, রেটিং ও সার্ভিস চার্জ দেখে মিস্ত্রি বেছে নিন।
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00B894] text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                ২
              </div>
              <h3 className="text-base font-bold text-[#37474F]">কাজের বিবরণ ও সময় দিন</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার কি কি মেরামত লাগবে সেটির বিবরণ, ছবি এবং সুবিধাজনক সময় সিলেক্ট করে অর্ডার নিশ্চিত করুন।
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#37474F] text-[#FFC300] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                ৩
              </div>
              <h3 className="text-base font-bold text-[#37474F]">কাজ সম্পন্ন ও ক্যাশ/MFS পেমেন্ট</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                মিস্ত্রি এসে কাজ শেষ করলে আপনি চেক করে ক্যাশ বা বিকাশ/নগদে সহজে পেমেন্ট পরিশোধ ও রিভিউ দিন।
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: CUSTOMER REVIEWS */}
        <section id="testimonials" className="py-16 bg-[#37474F] text-white">
          <div className="max-w-6xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#FFC300] bg-white/10 px-3.5 py-1 rounded-full uppercase tracking-wider">
                কাস্টমার রিভিউ (Customer Reviews)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-3xl border border-white/15 space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FFC300]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFC300]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#00B894] bg-white/15 px-2 py-0.5 rounded">
                    👍 প্রাইস ফেয়ারনেস: Fair
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "আমাদের বাসার এসি কাজ করছিল না। মিস্ত্রি কল অ্যাপে দেখে এসি মেকানিক ডাকলাম। তিনি এসে খুবই স্বচ্ছভাবে সার্ভিস চার্জ আগেই বুঝিয়ে দিয়েছেন এবং দ্রুত সমাধান করেছেন।"
                </p>
                <div className="text-xs border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="font-bold text-white">তানভীর আহমেদ</span>
                  <span className="text-white/60">উত্তরা, ঢাকা</span>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-3xl border border-white/15 space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FFC300]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFC300]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#00B894] bg-white/15 px-2 py-0.5 rounded">
                    👍 প্রাইস ফেয়ারনেস: Fair
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "বাথরুমের পাইপ লিক হয়ে খুব সমস্যা হচ্ছিল। অ্যাপ থেকে কাছাকাছি প্লাম্বার কল করি। তিনি ৩০ মিনিটে উপস্থিত হন। কাজের ফি আগে থেকেই স্পষ্ট থাকায় বাড়তি ঝামেলা হয়নি।"
                </p>
                <div className="text-xs border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="font-bold text-white">নুসরাত জাহান</span>
                  <span className="text-white/60">ধানমন্ডি, ঢাকা</span>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-3xl border border-white/15 space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FFC300]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFC300]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#00B894] bg-white/15 px-2 py-0.5 rounded">
                    👍 প্রাইস ফেয়ারনেস: Fair
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "ইলেকট্রিক সার্কিট ব্রেকারের জন্য জরুরি সার্ভিস লেগেছিল। রাত ৮টায়ও এমার্জেন্সি অপশনে টেকনিশিয়ান পাওয়া গেছে। খুবই প্রফেশনাল অভিজ্ঞতা।"
                </p>
                <div className="text-xs border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="font-bold text-white">মাহমুদুল হাসান</span>
                  <span className="text-white/60">চট্টগ্রাম</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: PROVIDER INVITATION BANNER */}
        <section className="py-16 max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#FFC300] via-[#e6b000] to-[#d4a000] text-[#37474F] rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider bg-[#37474F] text-[#FFC300] px-3.5 py-1 rounded-full inline-block">
                দক্ষ কারিগরদের জন্য আহ্বান
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                আপনি কি একজন অভিজ্ঞ মিস্ত্রি? আজই জয়েন করে প্রতিদিন কাজ পান!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#37474F]/90 leading-relaxed">
                আপনার এলাকার হাজারো কাস্টমার থেকে সরাসরি কাজের অর্ডার পান। আপনার নিজের কাজের রেট ও শিডিউল নিজেই ঠিক করুন।
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href={safeRoute('provider.setup')}
                className="py-4 px-8 rounded-2xl bg-[#37474F] hover:bg-[#253137] text-white font-black text-sm shadow-2xl transition transform hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-[#FFC300]" />
                <span>প্রোভাইডার হিসেবে জয়েন করুন</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ ACCORDION */}
        <section id="faq" className="py-16 max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#37474F] bg-slate-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
              সাধারণ জিজ্ঞাসা (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#37474F]">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলি
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left font-bold text-xs sm:text-sm text-[#37474F] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180 text-[#37474F]' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed"
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

        {/* FOOTER */}
        <footer className="bg-[#37474F] text-white pt-12 pb-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFC300] text-[#37474F] font-black flex items-center justify-center text-base">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-base font-black text-white">Mistri Call</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                বাংলাদেশের ঘরোয়া মেরামত ও টেকনিশিয়ান খোঁজার সবচেয়ে সহজ ও নির্ভরযোগ্য ডিজিটাল প্ল্যাটফর্ম।
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FFC300]">সার্ভিসসমূহ</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link href={safeRoute('providers.index', { category: 'electrician' })} className="hover:text-white transition">ইলেকট্রিশিয়ান</Link></li>
                <li><Link href={safeRoute('providers.index', { category: 'plumber' })} className="hover:text-white transition">প্লাম্বার</Link></li>
                <li><Link href={safeRoute('providers.index', { category: 'ac-mechanic' })} className="hover:text-white transition">এসি মেকানিক</Link></li>
                <li><Link href={safeRoute('providers.index', { category: 'carpenter' })} className="hover:text-white transition">কার্পেন্টার</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FFC300]">দ্রুত লিংক</h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link href={safeRoute('providers.index')} className="hover:text-white transition">মিস্ত্রি খুঁজুন</Link></li>
                <li><Link href={safeRoute('providers.favorites')} className="hover:text-white transition">প্রিয় তালিকা</Link></li>
                <li><Link href={safeRoute('service-requests.history')} className="hover:text-white transition">সার্ভিস হিস্ট্রি</Link></li>
                <li><Link href={safeRoute('provider.setup')} className="hover:text-white transition">প্রোভাইডার রেজিস্ট্রেশন</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FFC300]">যোগাযোগ</h4>
              <p className="text-white/70 leading-relaxed">
                হেল্পলাইন: +880 1700-000000<br />
                ইমেইল: support@mistri-call.test<br />
                ঢাকা, বাংলাদেশ
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pt-6 text-center text-xs text-white/50">
            © {new Date().getFullYear()} Mistri Call. All rights reserved. Powered by Zenvex Tech.
          </div>
        </footer>
      </div>
    </>
  );
}
