import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
  Heart, 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  Paintbrush, 
  Tv, 
  Grid, 
  Star, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  ChevronLeft, 
  Award, 
  CheckCircle2, 
  Trash2,
  Phone
} from 'lucide-react';

const ICON_MAP = {
  zap: Zap,
  wrench: Wrench,
  wind: Wind,
  hammer: Hammer,
  'paint-brush': Paintbrush,
  tv: Tv,
  grid: Grid,
};

export default function Favorites({ favorites = [] }) {
  const { flash = {} } = usePage().props;

  const handleRemoveFavorite = (providerId) => {
    if (confirm('আপনি কি এই প্রোভাইডারকে প্রিয় তালিকা থেকে সরাতে চান?')) {
      router.delete(route('favorites.destroy', providerId), {
        preserveScroll: true,
      });
    }
  };

  return (
    <>
      <Head title="আমার প্রিয় মিস্ত্রি তালিকা — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={route('providers.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-[#FF6F3C] text-[#FF6F3C]" /> আমার প্রিয় মিস্ত্রি তালিকা
                </h1>
                <p className="text-xs text-white/70">আপনার বিশ্বস্ত টেকনিশিয়ানদের দ্রুত বুকিংয়ের জন্য সংরক্ষিত লিস্ট</p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-[#FFC300]">
              {favorites.length} জন সেভ করা
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-2xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FF6F3C]/15 text-[#FF6F3C] flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#37474F]">আপনার কোনো প্রিয় প্রোভাইডার সেভ করা নেই</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                প্রোফাইল দেখার সময় হার্ট (❤️) আইকনে ক্লিক করে আপনার বিশ্বস্ত মিস্ত্রিদের সেভ করে রাখতে পারেন।
              </p>
              <Link
                href={route('providers.index')}
                className="inline-block py-2.5 px-6 rounded-2xl bg-[#37474F] text-white font-bold text-xs shadow-md hover:bg-[#253137] transition"
              >
                প্রোভাইডার ব্রাউজ করুন
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((p) => {
                const pUser = p.user || {};
                const categories = p.service_categories || [];

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Provider Header info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#37474F] text-[#FFC300] font-black text-xl flex items-center justify-center shadow-2xs shrink-0">
                            {pUser.name ? pUser.name.charAt(0).toUpperCase() : <Wrench className="w-6 h-6" />}
                          </div>

                          <div>
                            <Link
                              href={route('providers.show', p.id)}
                              className="font-bold text-base text-[#37474F] hover:text-[#00B894] transition flex items-center gap-1.5"
                            >
                              {pUser.name}
                              {p.verification_status === 'verified' && (
                                <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                              )}
                            </Link>

                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#FF6F3C]" />
                              {p.base_area_name ? `${p.base_area_name}, ` : ''}{p.district || 'ঢাকা'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveFavorite(p.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="প্রিয় তালিকা থেকে সরান"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Badges: Rating & Price fairness score */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 bg-[#FFC300]/15 px-2.5 py-0.5 rounded-lg text-slate-800 font-bold border border-[#FFC300]/30">
                          <Star className="w-3.5 h-3.5 fill-[#FFC300] text-[#FFC300]" />
                          <span>{p.average_rating ? Number(p.average_rating).toFixed(1) : '5.0'}</span>
                        </div>

                        <div className="bg-[#00B894]/10 text-[#00B894] font-bold px-2.5 py-0.5 rounded-lg border border-[#00B894]/20">
                          👍 {p.price_fairness_score ?? 100}% ফেয়ারনেস
                        </div>

                        {p.is_available_now && (
                          <span className="bg-[#FF6F3C]/15 text-[#FF6F3C] font-bold px-2.5 py-0.5 rounded-lg border border-[#FF6F3C]/30 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> এমার্জেন্সি প্রস্তুত
                          </span>
                        )}
                      </div>

                      {/* Upfront Charges Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-500 block">ভিজিট ফি</span>
                          <span className="font-bold text-[#37474F]">৳{p.visit_charge ? Number(p.visit_charge) : 150}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">লেবার চার্জ</span>
                          <span className="font-bold text-[#37474F]">৳{p.hourly_rate ? Number(p.hourly_rate) : 300}/ঘণ্টা</span>
                        </div>
                      </div>

                      {/* Service Category Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-0.5 rounded-md bg-[#37474F] text-[#FFC300] text-[11px] font-bold"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Booking CTA */}
                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        href={route('service-requests.create', { provider_id: p.id })}
                        className="w-full py-3 px-4 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>সার্ভিস বুক করুন (Request Service)</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
