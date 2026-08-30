import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  History, 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  PaintBrush, 
  Tv, 
  Grid, 
  Star, 
  RotateCcw, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Flame,
  ThumbsUp,
  AlertTriangle,
  AlertCircle
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

export default function ServiceHistory({ 
  serviceRequests, 
  categories = [], 
  selectedCategory = null 
}) {
  const requestsList = serviceRequests?.data || [];

  const handleCategoryFilter = (catId) => {
    router.get(route('service-requests.history'), 
      catId ? { category_id: catId } : {}, 
      { preserveState: true, preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="গৃহস্থালি কাজের সার্ভিস হিস্ট্রি — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={route('providers.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">গৃহস্থালি কাজের সার্ভিস হিস্ট্রি</h1>
                <p className="text-xs text-white/70">পূর্বের সম্পন্ন কাজ ও সার্ভিসিং রেকর্ড</p>
              </div>
            </div>

            <Link
              href={route('service-requests.create')}
              className="py-2 px-3.5 rounded-xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition"
            >
              নতুন অর্ডার
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {/* Category Filter Chips */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              ক্যাটাগরি অনুযায়ী ফিল্টার (Categories)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  !selectedCategory
                    ? 'bg-[#37474F] text-[#FFC300] shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সকল কাজ ({serviceRequests?.total || 0})
              </button>

              {categories.map((cat) => {
                const isSelected = String(selectedCategory) === String(cat.id);
                const IconComp = ICON_MAP[cat.icon_key] || Wrench;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryFilter(isSelected ? null : cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#37474F] text-[#FFC300] shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* History Request Cards List */}
          {requestsList.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFC300]/20 text-[#37474F] flex items-center justify-center mx-auto">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#37474F]">কোনো সার্ভিস হিস্ট্রি পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                আপনার আগে কোনো হোম রিপেয়ার বা সার্ভিসিংয়ের রেকর্ড নেই। প্রয়োজনে এখনই নতুন অর্ডার করতে পারেন।
              </p>
              <Link
                href={route('providers.index')}
                className="inline-block py-2.5 px-6 rounded-2xl bg-[#37474F] text-white font-bold text-xs shadow-md hover:bg-[#253137] transition"
              >
                মিস্ত্রি খুঁজুন
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requestsList.map((req) => {
                const category = req.category || {};
                const providerProfile = req.provider || {};
                const providerUser = providerProfile.user || {};
                const IconComp = ICON_MAP[category.icon_key] || Wrench;

                // Determine Cost
                const acceptedQuote = req.service_quotes ? req.service_quotes[0] : null;
                const cost = acceptedQuote ? acceptedQuote.estimated_total : (providerProfile.visit_charge || 150);

                const isCompleted = req.status === 'completed';

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
                  >
                    {/* Top Row: Category & Status */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#37474F] text-[#FFC300]">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#37474F]">{category.name} সার্ভিস</span>
                          <span className="text-[11px] text-slate-400 block font-medium">
                            অর্ডার #{req.id} • {new Date(req.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-[#00B894]/15 text-[#00B894] border-[#00B894]/30'
                          : req.status === 'cancelled'
                          ? 'bg-[#FF6F3C]/15 text-[#FF6F3C] border-[#FF6F3C]/30'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                      }`}>
                        {isCompleted ? 'সম্পন্ন (Serviced)' : req.status === 'cancelled' ? 'বাতিল' : 'চলতি কাজ'}
                      </span>
                    </div>

                    {/* Provider Info & Description */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#37474F] text-[#FFC300] font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                          {providerUser.name ? providerUser.name.charAt(0).toUpperCase() : <Wrench className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#37474F]">{providerUser.name || 'ব্রডকাস্ট সার্ভিস মিস্ত্রি'}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{req.description}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium block">কাজের আনুমানিক খরচ</span>
                        <span className="text-sm font-black text-[#37474F]">৳{Number(cost).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Review Rating & Price Fairness badge if exists */}
                    {req.review && (
                      <div className="flex items-center justify-between bg-[#FFC300]/10 p-3 rounded-2xl border border-[#FFC300]/30 text-xs">
                        <div className="flex items-center gap-1 text-[#37474F] font-bold">
                          <Star className="w-4 h-4 fill-[#FFC300] text-[#FFC300]" />
                          <span>আপনার দেওয়া রেটিং: {req.review.rating}.0/5.0</span>
                        </div>

                        <span className="text-[11px] font-bold text-[#00B894] bg-white px-2.5 py-0.5 rounded-md border border-[#00B894]/20 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> প্রাইস ফেয়ারনেস: {req.review.price_fairness}
                        </span>
                      </div>
                    )}

                    {/* Quick Action Bar */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Link
                        href={route('service-requests.show', req.id)}
                        className="text-xs font-bold text-slate-600 hover:text-[#37474F] flex items-center gap-1 hover:underline"
                      >
                        <span>বিস্তারিত দেখুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* "Book Again" Button linking to create form with provider & category pre-filled */}
                      <Link
                        href={route('service-requests.create', {
                          provider_id: providerProfile.id || '',
                          category_id: req.category_id,
                        })}
                        className="py-2.5 px-5 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>পুনরায় বুকিং দিন (Book Again)</span>
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
