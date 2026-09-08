import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
  User,
  Phone,
  Calendar,
  Camera,
  ShieldCheck,
  AlertTriangle,
  LogOut,
  XCircle,
  Save,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useConfirm } from '../../components/ConfirmDialog';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';
import { toBnDigits, toBnDate } from '../../lib/format';
import { cn } from '../../lib/utils';

export default function ProfileIndex({
  msisdn = '',
  subscriber = null,
  subscriptions = [],
  brandName = 'Prophet Stories',
}) {
  const { flash } = usePage().props;
  const confirm = useConfirm();

  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(subscriber?.avatar_url || null);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  // Form for updating profile
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    name: subscriber?.name || '',
    dob: subscriber?.dob ? String(subscriber.dob).substring(0, 10) : '',
    avatar: null,
  });

  // Watch for manual unsubscribe instructions flash
  useEffect(() => {
    if (flash?.unsubscribe_manual) {
      setShowUnsubscribeModal(true);
    }
  }, [flash]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('avatar', file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    post('/profile', {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const handleUnsubscribe = async () => {
    const ok = await confirm({
      title: 'সাবস্ক্রিপশন বাতিল করবেন?',
      message:
        'আপনি কি নিশ্চিত যে সাবস্ক্রিপশন বাতিল করতে চান? বাতিল করলে প্রিমিয়াম ফিচারসমূহ বন্ধ হয়ে যাবে এবং আপনি লগ আউট হয়ে যাবেন।',
      confirmLabel: 'হ্যাঁ, বাতিল করুন',
      cancelLabel: 'না, রেখে দিন',
      danger: true,
    });

    if (!ok) return;

    router.post('/unsubscribe', {}, {
      preserveScroll: false,
    });
  };

  const handleSubscribe = () => {
    router.post('/subscribe', {}, {
      preserveScroll: true,
    });
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'লগ আউট করতে চান?',
      message: 'আপনি কি নিশ্চিত যে আপনার একাউন্ট থেকে লগ আউট হতে চান?',
      confirmLabel: 'লগ আউট',
      cancelLabel: 'বাতিল',
      danger: true,
    });

    if (!ok) return;

    router.post('/logout', {}, {
      preserveScroll: false,
    });
  };

  const isActive = Boolean(subscriber?.is_active);
  const isUnsubscribed = Boolean(subscriber?.is_unsubscribed);

  return (
    <>
      <Head title="প্রোফাইল ও সেটিংস — Prophet Stories" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-[26px] sm:text-[32px] font-black tracking-tight text-ink font-bn">
            আমার প্রোফাইল ও সেটিংস
          </h1>
          <p className="text-[14px] text-muted font-medium font-bn">
            আপনার একাউন্টের তথ্য, ব্যক্তিগত বিবরণ এবং সাবস্ক্রিপশন স্ট্যাটাস পরিচালনা করুন।
          </p>
        </div>

        {/* Profile Card Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-white/90 via-primary/5 to-accent/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar with Upload Trigger */}
            <div className="relative group shrink-0">
              <div className="size-24 sm:size-28 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-md bg-white flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={subscriber?.name || 'Avatar'}
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-12 text-primary/40" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="ছবি পরিবর্তন করুন"
                aria-label="ছবি পরিবর্তন করুন"
                className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-2xl bg-primary text-white shadow-md hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="size-4.5" />
              </button>
            </div>

            {/* User details summary */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-[20px] sm:text-[24px] font-black text-ink font-bn">
                  {subscriber?.name || 'সম্মানিত পাঠক'}
                </h2>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-bn">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    সক্রিয় সাবস্ক্রাইবার
                  </span>
                ) : isUnsubscribed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-rose-100 text-rose-800 border border-rose-300 font-bn">
                    বাতিলকৃত
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-amber-100 text-amber-800 border border-amber-300 font-bn">
                    গেস্ট / ফ্রি এক্সেস
                  </span>
                )}
              </div>

              <p className="text-[14px] text-muted font-medium font-bn flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="size-4 text-primary" />
                <span>মোবাইল নম্বর: <strong className="text-ink">{toBnDigits(msisdn)}</strong></span>
              </p>

              {subscriber?.dob && (
                <p className="text-[13px] text-muted font-medium font-bn flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="size-4 text-primary/70" />
                  <span>জন্ম তারিখ: {toBnDate(subscriber.dob)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Update Section */}
        <div className="rounded-3xl border border-primary/15 bg-white/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-5 border-b border-primary/10 mb-6">
            <div className="space-y-0.5">
              <h3 className="text-[18px] font-bold text-ink font-bn flex items-center gap-2">
                <User className="size-5 text-primary" />
                ব্যক্তিগত তথ্য হালনাগাদ
              </h3>
              <p className="text-[13px] text-muted font-medium font-bn">
                আপনার নাম ও অন্যান্য তথ্য পরিবর্তন করে সংরক্ষণ করুন।
              </p>
            </div>
            {recentlySuccessful && (
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl animate-in fade-in duration-200 font-bn">
                <CheckCircle2 className="size-4 text-emerald-600" />
                সংরক্ষিত হয়েছে!
              </span>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Hidden avatar file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="block text-[13px] font-bold text-ink font-bn"
                >
                  পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 size-4.5 text-muted pointer-events-none" />
                  <input
                    id="profile-name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    maxLength={80}
                    className="h-11 w-full rounded-xl border border-primary/20 bg-white pl-10 pr-4 text-[14px] font-medium text-ink shadow-xs outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15 font-bn"
                  />
                </div>
                {errors.name && (
                  <p className="text-[12px] font-medium text-rose-600 font-bn">{errors.name}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-dob"
                  className="block text-[13px] font-bold text-ink font-bn"
                >
                  জন্ম তারিখ
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3.5 size-4.5 text-muted pointer-events-none" />
                  <input
                    id="profile-dob"
                    type="date"
                    value={data.dob}
                    onChange={(e) => setData('dob', e.target.value)}
                    className="h-11 w-full rounded-xl border border-primary/20 bg-white pl-10 pr-4 text-[14px] font-medium text-ink shadow-xs outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15 font-bn"
                  />
                </div>
                {errors.dob && (
                  <p className="text-[12px] font-medium text-rose-600 font-bn">{errors.dob}</p>
                )}
              </div>
            </div>

            {/* Mobile Number (Read-only) */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-ink font-bn">
                নিবন্ধিত ফোন নম্বর (লগইন আইডি)
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 size-4.5 text-muted pointer-events-none" />
                <input
                  type="text"
                  disabled
                  value={toBnDigits(msisdn)}
                  className="h-11 w-full rounded-xl border border-primary/15 bg-primary/5 pl-10 pr-4 text-[14px] font-bold text-muted cursor-not-allowed font-bn"
                />
              </div>
              <p className="text-[11.5px] text-muted font-medium font-bn">
                নিরাপত্তাজনিত কারণে ফোন নম্বর পরিবর্তন করা যায় না।
              </p>
            </div>

            {/* Avatar Error */}
            {errors.avatar && (
              <p className="text-[12px] font-medium text-rose-600 font-bn">{errors.avatar}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-[14px] font-bold text-white shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer font-bn"
              >
                {processing ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    পরিবর্তন সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Management Section */}
        <div className="rounded-3xl border border-primary/15 bg-white/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-0.5 pb-4 border-b border-primary/10">
            <h3 className="text-[18px] font-bold text-ink font-bn flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              সাবস্ক্রিপশন ও বিলিং তথ্য
            </h3>
            <p className="text-[13px] text-muted font-medium font-bn">
              আপনার বর্তমান সাবস্ক্রিপশন স্ট্যাটাস এবং নবায়ন বিবরণ।
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-ink font-bn">বর্তমান অবস্থা:</span>
                {isActive ? (
                  <span className="font-black text-[14px] text-emerald-700 font-bn flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> সক্রিয়
                  </span>
                ) : (
                  <span className="font-black text-[14px] text-rose-700 font-bn flex items-center gap-1">
                    <XCircle className="size-4" /> নিষ্ক্রিয় / বাতিল
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-muted font-medium font-bn">
                {isActive
                  ? 'আপনি নবীদের গল্প অ্যাপের সকল প্রিমিয়াম ফিচার এবং অধ্যায়ে সম্পূর্ণ এক্সেস উপভোগ করছেন।'
                  : 'সকল পূর্ণাঙ্গ অধ্যায় ও অডিও শুনতে অনুগ্রহ করে সাবস্ক্রাইব করুন।'}
              </p>
            </div>

            {/* Subscription Actions */}
            <div className="shrink-0 flex items-center gap-2">
              {isActive ? (
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[13px] font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer font-bn flex items-center gap-1.5"
                >
                  <XCircle className="size-4" />
                  সাবস্ক্রিপশন বাতিল করুন
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="rounded-xl bg-primary px-4 py-2 text-[13px] font-bold text-white hover:bg-primary/90 shadow-sm transition-all cursor-pointer font-bn flex items-center gap-1.5"
                >
                  <Sparkles className="size-4" />
                  সাবস্ক্রাইব করুন
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions / Logout Section */}
        <div className="rounded-3xl border border-rose-200/60 bg-rose-50/40 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-[17px] font-bold text-rose-900 font-bn flex items-center gap-2">
              <LogOut className="size-5 text-rose-600" />
              একাউন্ট থেকে লগ আউট
            </h3>
            <p className="text-[13px] text-rose-800/80 font-medium font-bn">
              আপনার ডিভাইস থেকে নিরাপদভাবে লগ আউট হতে নিচের বাটনে চাপ দিন।
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-2xl bg-rose-600 px-5 py-2.5 text-[14px] font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95 cursor-pointer font-bn flex items-center justify-center gap-2"
          >
            <LogOut className="size-4.5" />
            লগ আউট করুন
          </button>
        </div>
      </div>

      {/* Manual Unsubscribe Modal if BdApps requires manual SMS */}
      {showUnsubscribeModal && flash?.unsubscribe_manual && (
        <UnsubscribeManualModal
          message={flash.unsubscribe_manual.message}
          instruction={flash.unsubscribe_manual.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </>
  );
}
