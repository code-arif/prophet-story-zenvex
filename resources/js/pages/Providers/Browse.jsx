import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  PaintBrush, 
  Tv, 
  Grid, 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  ChevronRight, 
  User, 
  X,
  Clock,
  Filter
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

export default function Browse({ providers = { data: [] }, categories = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [minRating, setMinRating] = useState(filters.min_rating || '');
  const [emergencyOnly, setEmergencyOnly] = useState(filters.emergency_only === '1' || filters.emergency_only === true);
  const [verifiedOnly, setVerifiedOnly] = useState(filters.verified_only === '1' || filters.verified_only === true);
  const [sortBy, setSortBy] = useState(filters.sort_by || 'rating');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    applyFilters({ search, category: selectedCategory });
  };

  const handleCategoryClick = (catSlug) => {
    const newCategory = selectedCategory === catSlug ? '' : catSlug;
    setSelectedCategory(newCategory);
    applyFilters({ category: newCategory });
  };

  const applyFilters = (overrides = {}) => {
    router.get(
      route('providers.index'),
      {
        search: search,
        category: selectedCategory,
        min_rating: minRating,
        emergency_only: emergencyOnly ? 1 : 0,
        verified_only: verifiedOnly ? 1 : 0,
        sort_by: sortBy,
        ...overrides,
      },
      { preserveState: true, replace: true }
    );
    setShowFilterDrawer(false);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinRating('');
    setEmergencyOnly(false);
    setVerifiedOnly(false);
    setSortBy('rating');
    router.get(route('providers.index'));
  };

  return (
    <>
      <Head title="সার্ভিস প্রোভাইডার ব্রাউজ করুন — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Top Sticky Header & Search */}
        <header className="sticky top-0 z-30 bg-[#37474F] text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#FFC300]" /> মিস্ত্রি খুঁজুন (Find Mistri)
                </h1>
                <p className="text-xs text-white/70">আপনার এলাকার অভিজ্ঞ ইলেকট্রিশিয়ান, প্লাম্বার ও টেকনিশিয়ান</p>
              </div>

              <Link
                href={route('provider.setup')}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FFC300] text-[#37474F] hover:bg-[#e6b000] transition flex items-center gap-1 shadow-sm"
              >
                <span>প্রোভাইডার হন</span>
              </Link>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="নাম, এরিয়া বা সার্ভিস লিখে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-[#37474F] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(''); applyFilters({ search: '' }); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilterDrawer(true)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition relative flex items-center justify-center cursor-pointer"
                title="ফিল্টার"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
                {(emergencyOnly || verifiedOnly || minRating) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFC300] rounded-full"></span>
                )}
              </button>
            </form>
          </div>
        </header>

        {/* Category Horizontal Filter Chips */}
        <div className="bg-white border-b border-slate-200 sticky top-[105px] z-20 shadow-xs">
          <div className="max-w-5xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                !selectedCategory
                  ? 'bg-[#37474F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>সকল সার্ভিস</span>
            </button>

            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon_key] || Wrench;
              const isSelected = selectedCategory === cat.slug || selectedCategory == cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#37474F] text-[#FFC300] shadow-xs border border-[#FFC300]/40'
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

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 pt-6">
          {/* Active Filter Chips & Status Bar */}
          <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              মোট প্রোভাইডার পাওয়া গেছে: <span className="text-[#37474F] font-bold">{providers.total || providers.data.length}</span> জন
            </span>

            {(selectedCategory || emergencyOnly || verifiedOnly || search || minRating) && (
              <button
                onClick={resetFilters}
                className="text-red-500 hover:underline font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> ফিল্টার রিসেট
              </button>
            )}
          </div>

          {/* Provider Grid Cards */}
          {providers.data && providers.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.data.map((prov) => (
                <div
                  key={prov.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top row: Avatar & Status Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#37474F] text-[#FFC300] font-bold text-lg flex items-center justify-center shadow-xs">
                          {prov.user?.name ? prov.user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-[#37474F] group-hover:text-[#FF6F3C] transition">
                              {prov.user?.name || 'মিস্ত্রি সার্ভিস'}
                            </h3>
                            {prov.verification_status === 'verified' && (
                              <ShieldCheck className="w-4 h-4 text-[#00B894] flex-shrink-0" title="ভেরিফাইড" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {prov.base_area_name ? `${prov.base_area_name}, ` : ''}{prov.district || 'বাংলাদেশ'}
                          </p>
                        </div>
                      </div>

                      {/* Emergency Badge */}
                      {prov.is_available_now && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FF6F3C]/10 text-[#FF6F3C] border border-[#FF6F3C]/20 shrink-0">
                          <Flame className="w-3 h-3" /> এভেইলএবল
                        </span>
                      )}
                    </div>

                    {/* Service Category Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prov.service_categories && prov.service_categories.length > 0 ? (
                        prov.service_categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          সাধারণ মিস্ত্রি
                        </span>
                      )}
                    </div>

                    {/* Bio Snippet */}
                    {prov.bio && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {prov.bio}
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Rating, Experience & Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs">
                      {/* Rating */}
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-4 h-4 fill-[#FFC300] text-[#FFC300]" />
                        <span>{prov.rating ? Number(prov.rating).toFixed(1) : '5.0'}</span>
                      </div>

                      {/* Experience */}
                      {prov.years_experience > 0 && (
                        <span className="text-slate-500 font-medium">
                          {prov.years_experience} বছর অভিজ্ঞতা
                        </span>
                      )}
                    </div>

                    <Link
                      href={route('providers.show', prov.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#37474F] hover:bg-[#1B1F22] text-[#FFC300] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>প্রোফাইল</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#37474F]">কোনো প্রোভাইডার পাওয়া যায়নি</h3>
                <p className="text-xs text-slate-500">আপনার ফিল্টার অপশন পরিবর্তন বা রিসেট করে পুনরায় চেষ্টা করুন</p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#37474F] text-[#FFC300] font-bold text-xs hover:bg-[#1B1F22] transition cursor-pointer"
              >
                সকল প্রোভাইডার দেখুন
              </button>
            </div>
          )}
        </main>

        {/* Filter Bottom Sheet / Modal Drawer */}
        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-5 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FFC300]" /> ফিল্টার অপশনসমূহ
                </h2>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Rating filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">সর্বনিম্ন রেটিং (Rating)</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none"
                  >
                    <option value="">যেকোনো রেটিং</option>
                    <option value="4.5">৪.৫+ স্টার (Top Rated)</option>
                    <option value="4.0">৪.০+ স্টার</option>
                    <option value="3.5">৩.৫+ স্টার</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">সাজানোর ক্রম (Sort By)</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none"
                  >
                    <option value="rating">রেটিং অনুযায়ী (সর্বোচ্চ আগে)</option>
                    <option value="experience">অভিজ্ঞতা অনুযায়ী (বেশি অভিজ্ঞতা)</option>
                  </select>
                </div>

                {/* Emergency toggle */}
                <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#37474F] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#FF6F3C]" /> শুধুমাত্র এমার্জেন্সি এভেইলএবল
                    </span>
                    <p className="text-[11px] text-slate-500">তাত্ক্ষণিক কাজের জন্য উপলব্ধ প্রোভাইডার</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#FF6F3C] cursor-pointer"
                  />
                </div>

                {/* Verified toggle */}
                <div className="flex items-center justify-between py-1">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#37474F] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00B894]" /> শুধুমাত্র ভেরিফাইড মিস্ত্রি
                    </span>
                    <p className="text-[11px] text-slate-500">NID ও ডকুমেন্ট ভেরিফাইড প্রোভাইডার</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#00B894] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  রিসেট
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters()}
                  className="flex-1 py-2.5 rounded-xl bg-[#37474F] text-[#FFC300] text-xs font-bold hover:bg-[#1B1F22] cursor-pointer"
                >
                  ফিল্টার প্রয়োগ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
