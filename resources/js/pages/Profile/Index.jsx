import { Head, useForm, usePage, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function ProfileIndex({ subscriber: subscriberProp, brandName, logoUrl, apk }) {
  const { auth, subscriber, flash } = usePage().props;
  const effectiveSubscriber = subscriberProp ?? subscriber;

  const form = useForm({
    name: effectiveSubscriber?.name || '',
    dob: effectiveSubscriber?.dob || '',
    avatar: null,
  });

  const unsubscribeForm = useForm({});
  const subscribeForm = useForm({});
  const logoutForm = useForm({});

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Check for manual unsubscribe instruction
  useEffect(() => {
    if (flash?.unsubscribe_manual) {
      setShowUnsubscribeModal(true);
    }
  }, [flash?.unsubscribe_manual]);

  useEffect(() => {
    if (!form.data.avatar) {
      setAvatarPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.data.avatar);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.data.avatar]);

  const currentAvatarUrl = avatarPreviewUrl ?? effectiveSubscriber?.avatar_url ?? null;
  const displayName = form.data.name || effectiveSubscriber?.name || 'ব্যবহারকারী';
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : 'র';

  return (
    <div className="bg-[#F6F7FB] text-[#171a2e] antialiased min-h-screen flex flex-col items-center font-['Noto_Sans_Bengali','Inter',sans-serif]">
      <Head title="প্রোফাইল" />

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#F6F7FB] flex justify-between items-center h-14 px-5 max-w-md mx-auto left-0 right-0 border-b border-black/5">
        <button
          aria-label="Back"
          type="button"
          onClick={() => window.history.back()}
          className="w-10 h-10 flex items-center justify-start text-[#434653] active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-[18px] font-bold text-[#0040a8]">প্রোফাইল</h1>
        <button
          aria-label="Settings"
          type="button"
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="w-10 h-10 flex items-center justify-end text-[#434653] active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isEditingProfile ? 'close' : 'settings'}
          </span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-5 pt-18 pb-32 space-y-4">
        {/* Flash Messages */}
        {flash?.error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 ring-1 ring-red-500/20">
            {flash.error}
          </div>
        )}
        {flash?.status && (
          <div className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20">
            {flash.status}
          </div>
        )}

        {/* Identity Card */}
        <section className="bg-white rounded-[14px] p-5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#0040a8] text-2xl font-bold overflow-hidden ring-2 ring-[#2b59c3]/20">
                {currentAvatarUrl ? (
                  <img src={currentAvatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  displayInitial
                )}
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#171a2e] leading-tight">{displayName}</h2>
                <p className="text-[13px] text-[#434653] mt-1">{auth?.msisdn || '+৮৮০ ১৭১২•••৬৭৮'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="bg-[#E9F0FF] px-3 py-1 rounded-full text-[#2b59c3] font-bold text-[13px] hover:bg-[#2b59c3]/10 transition-colors"
            >
              {isEditingProfile ? 'বন্ধ করুন' : 'সম্পাদনা'}
            </button>
          </div>

          {/* Inline Edit Form Panel */}
          {isEditingProfile && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.post('/profile', {
                  forceFormData: true,
                  onSuccess: () => setIsEditingProfile(false),
                });
              }}
              className="mt-5 pt-4 border-t border-[#c3c6d5]/30 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#434653] mb-1">নাম</label>
                <input
                  type="text"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  className="w-full h-11 bg-[#F6F7FB] border border-[#c3c6d5] rounded-xl px-3 text-sm focus:outline-none focus:border-[#2b59c3]"
                  placeholder="আপনার নাম লিখুন"
                />
                {form.errors.name && <div className="text-xs text-red-500 mt-1">{form.errors.name}</div>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434653] mb-1">জন্ম তারিখ</label>
                <input
                  type="date"
                  value={form.data.dob || ''}
                  onChange={(e) => form.setData('dob', e.target.value)}
                  className="w-full h-11 bg-[#F6F7FB] border border-[#c3c6d5] rounded-xl px-3 text-sm focus:outline-none focus:border-[#2b59c3]"
                />
                {form.errors.dob && <div className="text-xs text-red-500 mt-1">{form.errors.dob}</div>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434653] mb-1">প্রোফাইল ছবি</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => form.setData('avatar', e.target.files?.[0] ?? null)}
                  className="w-full text-xs text-[#434653] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2b59c3] file:text-white hover:file:bg-[#0040a8]"
                />
                {form.errors.avatar && <div className="text-xs text-red-500 mt-1">{form.errors.avatar}</div>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={form.processing}
                  className="w-full h-11 bg-[#2b59c3] text-white rounded-xl font-semibold text-sm hover:bg-[#0040a8] transition-colors"
                >
                  {form.processing ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="h-[1px] w-full bg-[#c3c6d5]/40 my-5"></div>

          {/* Stat Blocks */}
          <div className="flex justify-between items-center text-center">
            <div className="flex-1">
              <p className="text-[20px] font-bold text-[#0040a8]">৭</p>
              <p className="text-[13px] text-[#434653]">দিনের স্ট্রিক</p>
            </div>
            <div className="w-[1px] h-8 bg-[#c3c6d5]/40"></div>
            <div className="flex-1">
              <p className="text-[20px] font-bold text-[#0040a8]">৩২০</p>
              <p className="text-[13px] text-[#434653]">মোট মিনিট</p>
            </div>
            <div className="w-[1px] h-8 bg-[#c3c6d5]/40"></div>
            <div className="flex-1">
              <p className="text-[20px] font-bold text-[#0040a8]">১৪২</p>
              <p className="text-[13px] text-[#434653]">শেখা শব্দ</p>
            </div>
          </div>
        </section>

        {/* Block 1 Settings */}
        <section className="bg-white rounded-[14px] overflow-hidden shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          {/* Row: Insights */}
          <Link
            href="/profile/progress"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">insights</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">অগ্রগতি ড্যাশবোর্ড</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Study Plan */}
          <Link
            href="/profile/study-plan"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">calendar_today</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">আমার স্টাডি প্ল্যান</span>
            <span className="text-[13px] text-[#434653] mr-1">দিন ৯/৩০</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Re-assess */}
          <Link
            href="/welcome/placement"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">speed</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">লেভেল আবার নির্ণয় করুন</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Reminder */}
          <Link
            href="/profile/settings"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">notifications</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">পড়ার রিমাইন্ডার</span>
            <span className="text-[13px] text-[#434653] mr-1">রাত ৯:০০</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
        </section>

        {/* Block 2 Settings */}
        <section className="bg-white rounded-[14px] overflow-hidden shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          {/* Row: Bookmarks */}
          <Link
            href="/learn/vocabulary"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">bookmark</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">সংরক্ষিত শব্দ ও বাক্য</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Language */}
          <Link
            href="/profile/settings"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">language</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">ভাষা</span>
            <span className="text-[13px] text-[#434653] mr-1">বাংলা</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </Link>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Help */}
          <button
            type="button"
            className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-[#0040a8] mr-4">help_outline</span>
            <span className="flex-1 font-semibold text-[16px] text-[#171a2e]">সাহায্য</span>
            <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
          </button>
          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Subscription Action Row */}
          {effectiveSubscriber && effectiveSubscriber.is_active ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (window.confirm('আপনি কি নিশ্চিত যে সাবস্ক্রিপশন বাতিল করতে চান?')) {
                  unsubscribeForm.post('/unsubscribe');
                }
              }}
            >
              <button
                type="submit"
                disabled={unsubscribeForm.processing}
                className="w-full h-[56px] flex items-center px-4 hover:bg-amber-50 active:bg-amber-100 transition-colors text-left group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px] text-amber-600 mr-4">unsubscribe</span>
                <span className="flex-1 font-semibold text-[16px] text-amber-700">
                  {unsubscribeForm.processing ? 'প্রসেসিং হচ্ছে...' : 'সাবস্ক্রিপশন বাতিল করুন'}
                </span>
                <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                subscribeForm.post('/subscribe');
              }}
            >
              <button
                type="submit"
                disabled={subscribeForm.processing}
                className="w-full h-[56px] flex items-center px-4 hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-left group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px] text-emerald-600 mr-4">loyalty</span>
                <span className="flex-1 font-semibold text-[16px] text-emerald-700">
                  {subscribeForm.processing ? 'প্রসেসিং হচ্ছে...' : 'এখনই সাবস্ক্রাইব করুন'}
                </span>
                <span className="material-symbols-outlined text-[#c3c6d5]">chevron_right</span>
              </button>
            </form>
          )}

          <div className="h-[1px] mx-4 bg-[#c3c6d5]/30"></div>

          {/* Row: Logout */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (window.confirm('আপনি কি নিশ্চিত যে লগ আউট করতে চান?')) {
                logoutForm.post('/logout');
              }
            }}
          >
            <button
              type="submit"
              disabled={logoutForm.processing}
              className="w-full h-[56px] flex items-center px-4 hover:bg-red-50 active:bg-red-100 transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-[#E5484D] mr-4">logout</span>
              <span className="flex-1 font-semibold text-[16px] text-[#E5484D]">
                {logoutForm.processing ? 'লগ আউট হচ্ছে...' : 'লগ আউট'}
              </span>
            </button>
          </form>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 w-full h-16 flex justify-around items-center px-2 bg-white border-t border-[#c3c6d5]/50 shadow-sm z-50 max-w-md mx-auto rounded-t-xl">
        {/* Home */}
        <Link
          href="/home"
          className="flex flex-col items-center justify-center text-[#434653] hover:bg-[#f4f2ff] transition-colors w-full h-full active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[11px] font-semibold">হোম</span>
        </Link>
        {/* Learn */}
        <Link
          href="/learn"
          className="flex flex-col items-center justify-center text-[#434653] hover:bg-[#f4f2ff] transition-colors w-full h-full active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">menu_book</span>
          <span className="text-[11px] font-semibold">শিখুন</span>
        </Link>
        {/* AI Companion (Floating Center) */}
        <div className="relative -top-4">
          <button
            type="button"
            className="w-14 h-14 bg-[#7C6BF5] rounded-full flex items-center justify-center text-white shadow-[0px_8px_20px_rgba(124,107,245,0.35)] active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
          </button>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-[#7C6BF5] whitespace-nowrap">
            AI সঙ্গী
          </span>
        </div>
        {/* Practice */}
        <Link
          href="/practice"
          className="flex flex-col items-center justify-center text-[#434653] hover:bg-[#f4f2ff] transition-colors w-full h-full active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">fitness_center</span>
          <span className="text-[11px] font-semibold">অনুশীলন</span>
        </Link>
        {/* Profile (Active) */}
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center text-[#0040a8] font-bold hover:bg-[#f4f2ff] transition-colors w-full h-full active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
          <span className="text-[11px] font-semibold">প্রোফাইল</span>
        </Link>
      </nav>

      {/* Manual Unsubscribe Modal */}
      {showUnsubscribeModal && flash?.unsubscribe_manual && (
        <UnsubscribeManualModal
          message={flash.unsubscribe_manual.message}
          instruction={flash.unsubscribe_manual.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </div>
  );
}
