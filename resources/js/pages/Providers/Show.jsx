import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  PaintBrush, 
  Tv, 
  Grid, 
  Star, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  ChevronLeft, 
  Phone, 
  Mail, 
  Award, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Share2,
  Calendar
} from 'lucide-react';

const ICON_MAP = {
  zap: Zap,
  wrench: Wrench,
  wind: Wind,
  hammer: Hammer,
  'paint-brush': PaintBrush,
  tv: Tv,
  grid: Grid,
};

export default function Show({ provider }) {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const user = provider?.user || {};
  const categories = provider?.service_categories || [];

  return (
    <>
      <Head title={`${user.name || 'সার্ভিস প্রোভাইডার'} — Mistri Call`} />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-28">
        {/* Header navigation bar */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href={route('providers.index')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>প্রোভাইডার তালিকা</span>
            </Link>

            <span className="text-sm font-bold truncate max-w-[200px]">
              {user.name || 'মিস্ত্রি প্রোফাইল'}
            </span>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: user.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('প্রোফাইল লিংক কপি করা হয়েছে!');
                }
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {/* Main Provider Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 relative overflow-hidden">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFC300]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Profile Info Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#37474F] text-[#FFC300] font-black text-3xl flex items-center justify-center shadow-md border-4 border-white flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : <Wrench className="w-10 h-10" />}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#37474F]">
                    {user.name || 'মিস্ত্রি সার্ভিস'}
                  </h1>

                  {provider.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#00B894]/15 text-[#00B894] border border-[#00B894]/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> ভেরিফাইড
                    </span>
                  )}

                  {provider.is_available_now && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FF6F3C]/15 text-[#FF6F3C] border border-[#FF6F3C]/30 animate-pulse">
                      <Flame className="w-3.5 h-3.5" /> এমার্জেন্সি প্রস্তুত
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6F3C]" />
                  {provider.base_area_name ? `${provider.base_area_name}, ` : ''}{provider.district || 'বাংলাদেশ'}
                </p>

                {/* Rating & Stats row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-1 bg-[#FFC300]/15 px-3 py-1 rounded-xl text-slate-800 font-bold border border-[#FFC300]/30">
                    <Star className="w-4 h-4 fill-[#FFC300] text-[#FFC300]" />
                    <span>{provider.rating ? Number(provider.rating).toFixed(1) : '5.0'} Rating</span>
                  </div>

                  {provider.years_experience > 0 && (
                    <div className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-3 py-1 rounded-xl">
                      <Award className="w-4 h-4 text-[#37474F]" />
                      <span>{provider.years_experience} বছর অভিজ্ঞতা</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-3 py-1 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-[#00B894]" />
                    <span>{provider.completed_jobs_count || 0} টি সম্পন্ন কাজ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upfront Pricing Trust Card - Prominently Displayed */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#37474F]/5 via-[#FFC300]/10 to-[#00B894]/5 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#37474F] flex items-center gap-1.5 uppercase tracking-wider">
                  <Wrench className="w-4 h-4 text-[#FFC300]" /> পূর্ব-নির্ধারিত সার্ভিস রেট (Upfront Pricing)
                </span>
                <span className="text-[11px] font-semibold text-[#00B894] bg-[#00B894]/10 px-2 py-0.5 rounded-md">
                  স্বচ্ছ ফি গ্যারান্টি
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">বেসিক ভিজিট ফি</span>
                  <span className="text-base font-black text-[#37474F]">
                    ৳{provider.visit_charge ? Number(provider.visit_charge) : 150}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">লেবার চার্জ</span>
                  <span className="text-base font-black text-[#37474F]">
                    ৳{provider.hourly_rate ? Number(provider.hourly_rate) : 300} <span className="text-[10px] font-normal text-slate-500">/ঘণ্টা</span>
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">প্রাইস ফেয়ারনেস</span>
                  <span className="text-base font-black text-[#00B894] flex items-center justify-center gap-1">
                    👍 {provider.price_fairness_score ?? 100}%
                  </span>
                </div>
              </div>

              {provider.pricing_note && (
                <p className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/50 leading-relaxed italic">
                  💡 {provider.pricing_note}
                </p>
              )}
            </div>

            {/* Service Category Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">সার্ভিস ক্যাটাগরি (Services Provided)</h3>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const IconComp = ICON_MAP[cat.icon_key] || Wrench;
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#37474F] text-[#FFC300] text-xs font-bold shadow-2xs"
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{cat.name}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
                    সাধারণ টেকনিশিয়ান সার্ভিস
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Details Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#FFC300]" /> বিবরণ ও কাজের দক্ষতা
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {provider.bio || 'প্রোভাইডার এখনও কোনো বিস্তারিত বিবরণ যুক্ত করেননি। তবে তিনি আমাদের নিবন্ধিত অভিজ্ঞ মিস্ত্রি।'}
            </p>
          </div>

          {/* Coverage & Radius info */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF6F3C]" /> সার্ভিস এরিয়া ও কভারেজ সীমা
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 font-medium">মেইন সার্ভিস এলাকা</span>
                <p className="font-bold text-[#37474F] text-sm">
                  {provider.base_area_name ? `${provider.base_area_name}, ` : ''}{provider.district || 'ধাক্কা'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 font-medium">সর্বোচ্চ কভারেজ দূরত্ব</span>
                <p className="font-bold text-[#37474F] text-sm">
                  {provider.service_radius_km || 5} কিলোমিটারের মধ্যে
                </p>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Preview (Prompt 7 placeholder ready) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#FFC300] text-[#FFC300]" /> কাস্টমার রিভিউ ও রেটিং
              </h2>
              <span className="text-xs font-bold text-[#00B894] bg-[#00B894]/10 px-2.5 py-1 rounded-full">
                ১০০% স্যাটিসফেকশন
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <div className="flex text-[#FFC300]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFC300]" />
                    ))}
                  </div>
                  <span>৫.০</span>
                </div>
                <span className="text-slate-400">সম্প্রতি সম্পন্ন কাজ</span>
              </div>
              <p className="text-xs text-slate-600 italic">
                "খুবই দ্রুত সময়ে এসে ইলেকট্রিক মেইন সুইচের সমস্যা সমাধান করে দিয়েছেন। কাজ অনেক ভালো হয়েছে।"
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">— স্থানীয় কাস্টমার</p>
            </div>
          </div>
        </div>

        {/* Sticky Primary CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-2xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">প্রোভাইডার স্ট্যাটাস</span>
              <span className="text-xs font-bold text-[#37474F] flex items-center gap-1">
                {provider.is_available_now ? (
                  <span className="text-[#00B894] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00B894] animate-ping"></span> এখন এভেইলএবল
                  </span>
                ) : (
                  <span className="text-slate-500">বুকিং উন্মুক্ত</span>
                )}
              </span>
            </div>

            <Link
              href={route('service-requests.create', { provider_id: provider.id })}
              className="py-3.5 px-8 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-sm sm:text-base shadow-lg shadow-[#FFC300]/25 transition active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <Wrench className="w-5 h-5" />
              <span>সার্ভিস বুক করুন (Request Service)</span>
            </Link>
          </div>
        </div>

        {/* Quick Service Request Modal Placeholder */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#FFC300]/20 text-[#37474F] flex items-center justify-center mx-auto">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#37474F]">{user.name}-কে কল / সার্ভিস রিকোয়েস্ট</h3>
                <p className="text-xs text-slate-500">আপনার প্রয়োজনীয় কাজ ও লোকেশন সিলেক্ট করে সরাসরি বুকিং দিন</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00B894]" /> যোগাযোগ নম্বর: <span className="font-bold text-[#37474F]">{user.phone || '01700000000'}</span>
                </p>
                <p className="text-slate-500">আপনি সরাসরি কল দিয়ে বা সার্ভিস রিকোয়েস্ট পাঠিয়ে বুকিং কনফার্ম করতে পারেন।</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <a
                  href={`tel:${user.phone || ''}`}
                  className="flex-1 py-3 rounded-2xl bg-[#00B894] text-white font-bold text-xs hover:bg-[#00a383] transition text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>সরাসরি কল দিন</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
