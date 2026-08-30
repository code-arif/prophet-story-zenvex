import React, { useState } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  PaintBrush, 
  Tv, 
  Grid, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Upload, 
  ShieldCheck, 
  MapPin, 
  User, 
  Flame,
  ChevronLeft
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

export default function CreateProfile({ categories = [], profile = null, districts = [] }) {
  const { flash = {} } = usePage().props;

  const initialCategories = profile?.service_categories?.map((c) => c.id) || [];

  const { data, setData, post, processing, errors, progress } = useForm({
    category_ids: initialCategories,
    bio: profile?.bio || '',
    years_experience: profile?.years_experience ?? 1,
    visit_charge: profile?.visit_charge ?? 150,
    hourly_rate: profile?.hourly_rate ?? 300,
    pricing_note: profile?.pricing_note || '',
    service_radius_km: profile?.service_radius_km ?? 5,
    base_area_name: profile?.base_area_name || '',
    district: profile?.district || (districts[0] || 'Dhaka'),
    is_available_now: profile?.is_available_now ?? true,
    document: null,
  });

  const toggleCategory = (id) => {
    if (data.category_ids.includes(id)) {
      setData('category_ids', data.category_ids.filter((cId) => cId !== id));
    } else {
      setData('category_ids', [...data.category_ids, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('provider.store'), {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00B894]/15 text-[#00B894] border border-[#00B894]/30">
            <ShieldCheck className="w-4 h-4" /> ভেরিফাইড সার্ভিস প্রোভাইডার
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 border border-amber-500/30">
            <Clock className="w-4 h-4" /> ভেরিফিকেশন পেন্ডিং (যাচাই চলছে)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-600 border border-slate-300">
            <AlertCircle className="w-4 h-4" /> আনভেরিফাইড প্রোফাইল
          </span>
        );
    }
  };

  return (
    <>
      <Head title="সার্ভিস প্রোভাইডার প্রোফাইল সেটআপ — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-16">
        {/* Header bar */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href={route('home')} 
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">সার্ভিস প্রোভাইডার প্রোফাইল</h1>
                <p className="text-xs text-white/70">মিস্ত্রি হিসেবে সার্ভিস দিতে প্রোফাইল পূরণ করুন</p>
              </div>
            </div>
            {profile && getStatusBadge(profile.verification_status)}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#FFC300]" /> আপনার সার্ভিসের ধরন (Category) Select করুন
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">আপনি একের অধিক বিষয়ে দক্ষ হলে একাধিক ক্যাটাগরি সিলেক্ট করতে পারেন</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {categories.map((cat) => {
                  const IconComponent = ICON_MAP[cat.icon_key] || Wrench;
                  const isSelected = data.category_ids.includes(cat.id);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#37474F] text-white border-[#37474F] shadow-md ring-2 ring-[#FFC300]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#FFC300]' : 'text-[#37474F]'}`} />
                      <span className="text-xs font-semibold">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category_ids && (
                <p className="text-xs text-red-500 font-medium">{errors.category_ids}</p>
              )}
            </div>

            {/* Emergency availability toggle */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF6F3C]/10 text-[#FF6F3C]">
                  <Flame className="w-3.5 h-3.5" /> এমার্জেন্সি কল সার্ভিস
                </span>
                <h3 className="text-sm font-bold text-[#37474F]">তাত্ক্ষণিক বা জরুরী কাজের জন্য এভেইলএবল আছেন?</h3>
                <p className="text-xs text-slate-500">অন থাকলে নিকটস্থ কাস্টমাররা আপনাকে এমার্জেন্সি রিকোয়েস্টে কল দিতে পারবে</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={data.is_available_now}
                  onChange={(e) => setData('is_available_now', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B894]"></div>
              </label>
            </div>

            {/* Basic details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <User className="w-5 h-5 text-[#37474F]" /> অভিজ্ঞতা ও বিবরণ
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কাজের অভিজ্ঞতা (Years of Experience)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={data.years_experience}
                    onChange={(e) => setData('years_experience', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                    placeholder="যেমন: ৩ বছর"
                  />
                  {errors.years_experience && (
                    <p className="text-xs text-red-500 mt-1">{errors.years_experience}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আপনার পরিচিতি ও দক্ষতার বিবরণ (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                    placeholder="আপনার কাজের অভিজ্ঞতা, বিশেষ দক্ষতা ও সুনাম সম্পর্কে সংক্ষেপে লিখুন..."
                  />
                  {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
                </div>
            </div>

            {/* Upfront Pricing & Charges */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#FFC300]" /> আগে থেকেই সার্ভিস ফি ও চার্জ নির্ধারণ (Upfront Pricing)
              </h2>
              <p className="text-xs text-slate-500">কাস্টমারদের ট্রাস্ট অর্জনের জন্য বেসিক ভিজিট ফি ও ঘন্টা ভিত্তিক ফি নির্ধারণ করুন</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কল-আউট / বেসিক ভিজিট চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={data.visit_charge}
                    onChange={(e) => setData('visit_charge', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                    placeholder="যেমন: ১৫০ টাকা"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">কাজে যাওয়ার প্রাথমিক পরিদর্শন ফি</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আনুমানিক ঘণ্টা ভিত্তিক লেবার রেট (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={data.hourly_rate}
                    onChange={(e) => setData('hourly_rate', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                    placeholder="যেমন: ৩০০ টাকা / ঘণ্টা"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">কাজের গড় ঘণ্টাভিত্তিক মজুরি</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মূল্য ও মালামাল সংক্রান্ত শর্তাবলি (Pricing Note)
                </label>
                <textarea
                  rows={2}
                  value={data.pricing_note}
                  onChange={(e) => setData('pricing_note', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                  placeholder="যেমন: মালামাল বা স্পেয়ার পার্টসের খরচ আলাদা হবে, অথবা বড় কাজে কাস্টম কোটেশন দেওয়া হবে..."
                />
              </div>
            </div>

            {/* Location & Radius */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6F3C]" /> সার্ভিস এলাকা ও কভারেজ (Service Area)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জেলা (District)</label>
                  <select
                    value={data.district}
                    onChange={(e) => setData('district', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm bg-white"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মেইন এরিয়া / এলাকা (Base Area)</label>
                  <input
                    type="text"
                    value={data.base_area_name}
                    onChange={(e) => setData('base_area_name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#37474F] text-sm"
                    placeholder="যেমন: মিরপুর ১০, উত্তরা, ধোপাদী"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">সার্ভিস দেওয়ার কভারেজ রেডিয়াস (Service Radius)</label>
                  <span className="text-xs font-bold text-[#37474F] bg-slate-100 px-2 py-0.5 rounded-md">
                    {data.service_radius_km} KM
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={data.service_radius_km}
                  onChange={(e) => setData('service_radius_km', e.target.value)}
                  className="w-full accent-[#37474F] cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">আপনার বেস এরিয়া থেকে কত কিলোমিটার পর্যন্ত সার্ভিস দিতে পারবেন</p>
              </div>
            </div>

            {/* Document verification */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#00B894]" /> এনআইডি (NID) বা ট্রেড সার্টিফিকেট ভেরিফিকেশন
                </h2>
                <span className="text-xs text-slate-500 font-normal">(ঐচ্ছিক কিন্তু ভেরিফায়েড ব্যাজের জন্য সুপারিশকৃত)</span>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                <input
                  type="file"
                  id="document"
                  accept="image/*,.pdf"
                  onChange={(e) => setData('document', e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="document" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">
                    {data.document ? data.document.name : profile?.nid_or_certificate_path ? 'নতুন ফাইল সিলেক্ট করতে ক্লিক করুন' : 'NID বা সার্টিফিকেটের ছবি অথবা PDF আপলোড করুন'}
                  </div>
                  <p className="text-[11px] text-slate-500">সর্বোচ্চ ৫ মেগাবাইট (JPG, PNG, PDF)</p>
                </label>
              </div>

              {profile?.nid_or_certificate_path && !data.document && (
                <div className="text-xs text-slate-600 bg-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                  <span>পূর্বে আপলোডকৃত ডকুমেন্ট সংরক্ষিত রয়েছে</span>
                  <span className="font-semibold text-[#00B894]">সংরক্ষিত</span>
                </div>
              )}

              {progress && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-[#37474F] h-2 rounded-full transition-all" style={{ width: `${progress.percentage}%` }}></div>
                </div>
              )}
              {errors.document && <p className="text-xs text-red-500">{errors.document}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 px-6 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-bold text-base shadow-lg shadow-[#FFC300]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {processing ? 'সংরক্ষণ করা হচ্ছে...' : profile ? 'প্রোফাইল তথ্য আপডেট করুন' : 'সার্ভিস প্রোভাইডার হিসেবে জয়েন করুন'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
