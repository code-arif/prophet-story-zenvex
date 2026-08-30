import React, { useState } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { 
  Wrench, 
  Flame, 
  Clock, 
  Calendar as CalendarIcon, 
  Camera, 
  MapPin, 
  User, 
  ChevronLeft, 
  Radio, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function Create({ 
  categories = [], 
  selectedCategory = null, 
  selectedProvider = null, 
  districts = [], 
  timeSlots = [] 
}) {
  const { flash = {} } = usePage().props;

  const [photoPreviews, setPhotoPreviews] = useState([]);

  const { data, setData, post, processing, errors, progress } = useForm({
    category_id: selectedCategory?.id || (categories[0]?.id || ''),
    provider_id: selectedProvider?.id || '',
    request_mode: selectedProvider ? 'direct' : 'broadcast',
    description: '',
    urgency: 'urgent_today',
    preferred_date: '',
    preferred_time_slot: timeSlots[0] || '10:00 AM - 12:00 PM',
    address_note: '',
    district: selectedProvider?.district || districts[0] || 'Dhaka',
    latitude: '',
    longitude: '',
    photos: [],
  });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPhotos = [...data.photos, ...files].slice(0, 5);
    setData('photos', newPhotos);

    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    const updatedPhotos = data.photos.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    setData('photos', updatedPhotos);
    setPhotoPreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('service-requests.store'), {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  return (
    <>
      <Head title="সার্ভিস বুকিং রিকোয়েস্ট — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href={selectedProvider ? route('providers.show', selectedProvider.id) : route('providers.index')} 
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">সার্ভিস বুকিং রিকোয়েস্ট</h1>
                <p className="text-xs text-white/70">কাজ ও স্থান উল্লেখ করে সার্ভিস অর্ডার করুন</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-2xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Mode & Selected Provider Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#FFC300]" /> রিকোয়েস্ট মোড সিলেক্ট করুন (Request Mode)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData('request_mode', 'direct')}
                  disabled={!selectedProvider}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                    data.request_mode === 'direct'
                      ? 'bg-[#37474F] text-white border-[#37474F] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FFC300]" /> নির্দিষ্ট মিস্ত্রিকে রিকোয়েস্ট (Direct)
                  </span>
                  <span className="text-[11px] opacity-80">
                    {selectedProvider ? `${selectedProvider.user?.name}-কে সরাসরি পাঠাবে` : 'নির্দিষ্ট মিস্ত্রি নির্বাচন করুন'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setData('request_mode', 'broadcast');
                    setData('provider_id', '');
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                    data.request_mode === 'broadcast'
                      ? 'bg-[#37474F] text-white border-[#37474F] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#FFC300]" /> ওপেন ব্রডকাস্ট (Broadcast)
                  </span>
                  <span className="text-[11px] opacity-80">এলাকার সকল ফ্রি মিস্ত্রিদের কাছে বিজ্ঞপ্তি যাবে</span>
                </button>
              </div>

              {/* Selected Provider Info Summary */}
              {data.request_mode === 'direct' && selectedProvider && (
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#37474F] text-[#FFC300] font-bold flex items-center justify-center">
                    {selectedProvider.user?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#37474F] flex items-center gap-1">
                      {selectedProvider.user?.name}
                      {selectedProvider.verification_status === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00B894]" />
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {selectedProvider.base_area_name}, {selectedProvider.district}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Category & Problem Description */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#37474F]" /> কাজের ধরন ও বিবরণ
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">সার্ভিস ক্যাটাগরি</label>
                <select
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#37474F] outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  কী সমস্যা বা কী কাজ করাতে চান? (বিস্তারিত বিবরণ)
                </label>
                <textarea
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#37474F] outline-none"
                  placeholder="যেমন: ডাইনিং রুমের ফ্যান ঘুরছে না, সুইচে সমস্যা হতে পারে অথবা ওয়াটার পাম্পে শব্দ হচ্ছে..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Photo Upload for Broken Equipment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নষ্ট আইটেমের ছবি (Optional - সর্বোচ্চ ৫টি)
                </label>
                <div className="flex flex-wrap gap-3">
                  {photoPreviews.map((src, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-2xl border overflow-hidden group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {photoPreviews.length < 5 && (
                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500">ছবি যোগ করুন</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.photos && <p className="text-xs text-red-500 mt-1">{errors.photos}</p>}
              </div>
            </div>

            {/* Urgency Selector Chips */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF6F3C]" /> আপনার কাজের জরুরীতা সিলেক্ট করুন (Urgency)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Scheduled */}
                <button
                  type="button"
                  onClick={() => setData('urgency', 'scheduled')}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    data.urgency === 'scheduled'
                      ? 'bg-[#37474F] text-white border-[#37474F] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5 text-[#FFC300]" />
                  <span className="text-xs font-bold">নির্ধারিত সময়</span>
                  <span className="text-[10px] opacity-75">তারিখ ও শিডিউল পছন্দ করুন</span>
                </button>

                {/* Urgent Today */}
                <button
                  type="button"
                  onClick={() => setData('urgency', 'urgent_today')}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    data.urgency === 'urgent_today'
                      ? 'bg-[#37474F] text-white border-[#37474F] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-5 h-5 text-[#00B894]" />
                  <span className="text-xs font-bold">আজকের মধ্যেই</span>
                  <span className="text-[10px] opacity-75">আজকের কাজের জন্য</span>
                </button>

                {/* Emergency Now - Flame Orange Styled */}
                <button
                  type="button"
                  onClick={() => setData('urgency', 'emergency_now')}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    data.urgency === 'emergency_now'
                      ? 'bg-[#FF6F3C] text-white border-[#FF6F3C] shadow-md ring-2 ring-[#FF6F3C]/40'
                      : 'bg-[#FF6F3C]/10 text-[#FF6F3C] border-[#FF6F3C]/30 hover:bg-[#FF6F3C]/20'
                  }`}
                >
                  <Flame className="w-5 h-5 text-white fill-current" />
                  <span className="text-xs font-black">জরুরী এখন (Emergency)</span>
                  <span className="text-[10px] opacity-90">তাত্ক্ষণিক ইমার্জেন্সি কল</span>
                </button>
              </div>

              {/* Date & Time slot picker if Scheduled */}
              {data.urgency === 'scheduled' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পছন্দের তারিখ</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={data.preferred_date}
                        onChange={(e) => setData('preferred_date', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none bg-white"
                      />
                      {errors.preferred_date && <p className="text-xs text-red-500 mt-1">{errors.preferred_date}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পছন্দের সময় (Time Slot)</label>
                      <select
                        value={data.preferred_time_slot}
                        onChange={(e) => setData('preferred_time_slot', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#37474F] outline-none bg-white"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address & Location */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#37474F] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6F3C]" /> কাজ সম্পাদনের ঠিকানা (Service Location)
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জেলা (District)</label>
                  <select
                    value={data.district}
                    onChange={(e) => setData('district', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#37474F] outline-none bg-white"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সম্পূর্ণ ঠিকানা ও ল্যান্ডমার্ক (Address Note)
                  </label>
                  <textarea
                    rows={2}
                    value={data.address_note}
                    onChange={(e) => setData('address_note', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#37474F] outline-none"
                    placeholder="যেমন: বাসা #৪, রোড #১২, ব্লক-বি, মিরপুর ১০ (মসজিদের বিপরীতে)"
                  />
                  {errors.address_note && <p className="text-xs text-red-500 mt-1">{errors.address_note}</p>}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 px-6 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-black text-base shadow-lg shadow-[#FFC300]/25 transition active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>{processing ? 'পাঠানো হচ্ছে...' : 'সার্ভিস রিকোয়েস্ট সাবমিট করুন'}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
