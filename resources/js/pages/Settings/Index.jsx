import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
  ChevronRight,
  Download,
  Trash2,
  ExternalLink,
  Lock,
  ArrowLeftRight,
  Camera,
  AlertTriangle,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { BottomSheet } from '../../components/ui/BottomSheet';
import AppModal from '../../components/ui/AppModal';

function Toggle({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300"
      style={{ background: checked ? '#1d6ff2' : '#e1e2ed' }}
    >
      <span
        className="inline-block h-[22px] w-[22px] rounded-full bg-white shadow transition-transform duration-300"
        style={{
          transform: checked ? 'translateX(22px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

function SectionHeader({ children }) {
  return (
    <h3 className="px-4 pt-4 pb-2 text-[12px] font-bold uppercase tracking-wider text-brand font-bn">
      {children}
    </h3>
  );
}

function Row({ children, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${className}`}
    >
      {children}
    </div>
  );
}

function RowDivider() {
  return <div className="h-px bg-black/5 ml-4" />;
}

export default function SettingsIndex({
  user,
  subscriber,
  workingHours = 40,
  minRate = 800,
  currency = 'BDT',
  appLanguage = 'bn',
  textSize: serverTextSize = 1,
}) {
  const { t } = useI18n();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showWorkRules, setShowWorkRules] = useState(false);
  const [lang, setLang] = useState(appLanguage);
  const [textSize, setTextSize] = useState(serverTextSize);
  const [toggles, setToggles] = useState({
    deadline: true,
    overdue: true,
    docExpiry: false,
  });

  const prefForm = useForm({
    app_language: appLanguage,
    text_size: serverTextSize,
  });

  const profileForm = useForm({
    name: subscriber?.name || user?.name || '',
    dob: subscriber?.dob || '',
    avatar: null,
  });

  const workRulesForm = useForm({
    weekly_hours: workingHours,
    min_hourly_rate: minRate,
    currency: currency,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  const toggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const savePrefs = (updates) => {
    router.post('/settings/preferences', { app_language: lang, text_size: textSize, ...updates });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      profileForm.setData('avatar', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    profileForm.post('/settings/profile', {
      forceFormData: true,
      onSuccess: () => {
        setShowProfile(false);
        setAvatarPreview(null);
      },
    });
  };

  const handleWorkRulesSave = (e) => {
    e.preventDefault();
    workRulesForm.post('/settings/work-rules', {
      onSuccess: () => setShowWorkRules(false),
    });
  };

  const displayName = subscriber?.name || user?.name || 'ব্যবহারকারী';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayPhone = subscriber?.msisdn
    ? subscriber.msisdn.replace(/(\d{3})\d{4}(\d{3})/, '$1••••$2')
    : '০১৭•••••৬৭৮';

  const currencySymbol =
    workRulesForm.data.currency === 'USD'
      ? '$'
      : workRulesForm.data.currency === 'EUR'
      ? '€'
      : '৳';

  return (
    <div className="space-y-4">
      <Head title="সেটিংস — ইজি রাইজ" />

      {/* Group 1: অ্যাকাউন্ট */}
      <div className="glass mb-3.5 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowProfile(true)}
          className="flex w-full items-center gap-4 p-4 transition-colors active:scale-[0.99] text-left hover:bg-black/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[16px] font-bold text-white font-bn">
            {displayInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-ink font-bn truncate">
              {t(displayName)}
            </p>
            <p className="text-[12px] text-muted font-bn truncate">
              {displayPhone}
            </p>
          </div>
          <ChevronRight className="size-5 text-muted shrink-0" />
        </button>
      </div>

      {/* Group 2: কাজের নিয়ম */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('কাজের নিয়ম')}</SectionHeader>
        <button
          type="button"
          onClick={() => setShowWorkRules(true)}
          className="w-full text-left transition-colors hover:bg-black/5"
        >
          <Row>
            <span className="text-[15px] text-ink font-bn">
              {t('সাপ্তাহিক ঘণ্টা')}
            </span>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-[13px] font-bn font-semibold text-brand">
                {workRulesForm.data.weekly_hours} ঘণ্টা
              </span>
              <ChevronRight className="size-5" />
            </div>
          </Row>
        </button>
        <RowDivider />
        <button
          type="button"
          onClick={() => setShowWorkRules(true)}
          className="w-full text-left transition-colors hover:bg-black/5"
        >
          <Row>
            <span className="text-[15px] text-ink font-bn">
              {t('সর্বনিম্ন গ্রহণযোগ্য ঘণ্টা-হার')}
            </span>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-[13px] font-bn font-semibold text-brand">
                {currencySymbol} {workRulesForm.data.min_hourly_rate}
              </span>
              <ChevronRight className="size-5" />
            </div>
          </Row>
        </button>
        <RowDivider />
        <button
          type="button"
          onClick={() => setShowWorkRules(true)}
          className="w-full text-left transition-colors hover:bg-black/5"
        >
          <Row className="pb-4">
            <span className="text-[15px] text-ink font-bn">
              {t('প্রধান মুদ্রা')}
            </span>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-[13px] font-bn font-semibold text-brand">
                {workRulesForm.data.currency} ({currencySymbol})
              </span>
              <ChevronRight className="size-5" />
            </div>
          </Row>
        </button>
      </div>

      {/* Group 3: ভাষা ও দেখা */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('ভাষা ও দেখা')}</SectionHeader>
        <Row>
          <span className="text-[15px] text-ink font-bn">{t('ভাষা')}</span>
          <div className="flex items-center gap-1 rounded-full border border-border-rest bg-bg-from px-3 py-1.5">
            <button
              type="button"
              onClick={() => { setLang('bn'); savePrefs({ app_language: 'bn' }); }}
              className={`text-[13px] font-bn transition-colors ${
                lang === 'bn' ? 'text-ink font-semibold' : 'text-muted'
              }`}
            >
              বাংলা
            </button>
            <ArrowLeftRight className="size-3.5 text-muted mx-0.5" />
            <button
              type="button"
              onClick={() => { setLang('en'); savePrefs({ app_language: 'en' }); }}
              className={`text-[13px] font-bn transition-colors ${
                lang === 'en' ? 'text-ink font-semibold' : 'text-muted'
              }`}
            >
              English
            </button>
          </div>
        </Row>
        <div className="px-4 pb-4 pt-1">
          <span className="mb-2 block text-[15px] text-ink font-bn">
            {t('টেক্সট সাইজ')}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted font-bn">অ</span>
            <input
              type="range"
              min={1}
              max={3}
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              onMouseUp={(e) => savePrefs({ text_size: Number(e.target.value) })}
              onTouchEnd={(e) => savePrefs({ text_size: Number(e.target.value) })}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-border-rest accent-brand"
            />
            <span className="text-[22px] text-ink font-bn">অ</span>
          </div>
        </div>
      </div>

      {/* Group 4: মনে করিয়ে দেওয়া */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('মনে করিয়ে দেওয়া')}</SectionHeader>
        <Row>
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('সময়সীমার আগে')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ৩ দিন আগে
            </span>
          </div>
          <Toggle
            checked={toggles.deadline}
            onToggle={() => toggle('deadline')}
          />
        </Row>
        <RowDivider />
        <Row>
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('বকেয়া টাকার তাগাদা')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ১ দিন পর
            </span>
          </div>
          <Toggle
            checked={toggles.overdue}
            onToggle={() => toggle('overdue')}
          />
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <div className="flex flex-col">
            <span className="text-[15px] text-ink font-bn">
              {t('কাগজের মেয়াদ')}
            </span>
            <span className="text-[12px] text-muted font-bn">
              ৭ দিন আগে
            </span>
          </div>
          <Toggle
            checked={toggles.docExpiry}
            onToggle={() => toggle('docExpiry')}
          />
        </Row>
      </div>

      {/* Group 5: তথ্য */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('তথ্য')}</SectionHeader>
        <Row>
          <div className="flex items-center gap-3">
            <Download className="size-5 text-muted" />
            <span className="text-[15px] text-ink font-bn">
              {t('সব তথ্য ফাইল হিসেবে নিন')}
            </span>
          </div>
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <div className="flex items-center gap-3">
            <Trash2 className="size-5 text-danger" />
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="text-[15px] text-danger font-bn"
            >
              {t('সব তথ্য মুছে ফেলুন')}
            </button>
          </div>
        </Row>
      </div>

      {/* Group 6: সম্পর্কে */}
      <div className="glass mb-3.5 overflow-hidden">
        <SectionHeader>{t('সম্পর্কে')}</SectionHeader>
        <Row>
          <span className="text-[15px] text-ink font-bn">{t('ভার্সন')}</span>
          <span className="text-[13px] text-muted font-bn">
            v1.2.4 (Build 89)
          </span>
        </Row>
        <RowDivider />
        <Row>
          <span className="text-[15px] text-ink font-bn">
            {t('শর্তাবলী')}
          </span>
          <ChevronRight className="size-5 text-muted" />
        </Row>
        <RowDivider />
        <Row className="pb-4">
          <span className="text-[15px] text-brand font-bn">
            {t('মতামত দিন')}
          </span>
          <ExternalLink className="size-5 text-brand" />
        </Row>
      </div>

      {/* Footnote */}
      <div className="pb-8 text-center">
        <p className="flex items-center justify-center gap-1 text-[12px] text-muted font-bn">
          <Lock className="size-3.5" />
          {t('সব তথ্য আপনার ডিভাইসেই থাকে')}
        </p>
      </div>

      {/* Profile Edit Modal */}
      <AppModal
        open={showProfile}
        onClose={() => {
          setShowProfile(false);
          setAvatarPreview(null);
          profileForm.reset();
        }}
        title={t('প্রোফাইল সম্পাদনা')}
      >
        <form onSubmit={handleProfileSave} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-[28px] font-bold text-white font-bn overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayInitial
                )}
              </div>
              <label className="absolute bottom-0 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md border border-border-rest active:scale-95 transition-all">
                <Camera className="size-4 text-muted" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[12px] text-muted font-bn">
              {t('ছবি পরিবর্তন করুন')}
            </span>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink font-bn">
              {t('পুরো নাম')}
            </label>
            <input
              type="text"
              value={profileForm.data.name}
              onChange={(e) => profileForm.setData('name', e.target.value)}
              className="h-12 w-full rounded-[14px] border border-border-rest bg-bg-from px-4 text-[15px] text-ink font-bn placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              placeholder={t('আপনার নাম লিখুন')}
            />
            {profileForm.errors.name && (
              <p className="mt-1 text-[12px] text-danger font-bn">
                {profileForm.errors.name}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink font-bn">
              {t('জন্ম তারিখ')}
            </label>
            <input
              type="date"
              value={profileForm.data.dob || ''}
              onChange={(e) => profileForm.setData('dob', e.target.value)}
              className="h-12 w-full rounded-[14px] border border-border-rest bg-bg-from px-4 text-[15px] text-ink font-bn focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
            {profileForm.errors.dob && (
              <p className="mt-1 text-[12px] text-danger font-bn">
                {profileForm.errors.dob}
              </p>
            )}
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={profileForm.processing}
            className="h-12 w-full rounded-[14px] bg-brand text-[15px] font-bold text-white font-bn active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {profileForm.processing
              ? t('সংরক্ষণ হচ্ছে…')
              : t('সংরক্ষণ করুন')}
          </button>
        </form>
      </AppModal>

      {/* Work Rules Modal */}
      <AppModal
        open={showWorkRules}
        onClose={() => setShowWorkRules(false)}
        title={t('কাজের নিয়ম সংশোধন')}
      >
        <form onSubmit={handleWorkRulesSave} className="space-y-4 pt-2 font-bn">
          {/* Weekly Hours */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink font-bn">
              {t('সাপ্তাহিক টার্গেট ঘণ্টা')}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                max="168"
                value={workRulesForm.data.weekly_hours}
                onChange={(e) => workRulesForm.setData('weekly_hours', e.target.value)}
                className="h-12 w-full rounded-[14px] border border-border-rest bg-bg-from px-4 text-[15px] font-bold text-ink font-bn focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
              <span className="absolute right-4 text-[13px] font-bold text-muted">ঘণ্টা/সপ্তাহ</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              ক্যাপাসিটি মিটার ও সময়ের চাপ মূল্যায়নে এটি ব্যবহৃত হয়
            </p>
          </div>

          {/* Min Hourly Rate */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink font-bn">
              {t('সর্বনিম্ন গ্রহণযোগ্য ঘণ্টা-হার')}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                step="50"
                value={workRulesForm.data.min_hourly_rate}
                onChange={(e) => workRulesForm.setData('min_hourly_rate', e.target.value)}
                className="h-12 w-full rounded-[14px] border border-border-rest bg-bg-from px-4 text-[15px] font-bold text-ink font-bn focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
              <span className="absolute right-4 text-[13px] font-bold text-brand">
                {currencySymbol}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              স্কোপ গার্ড অতিরিক্ত কাজের প্রভাব হিসাব করতে এই ফ্লোর রেটটি ব্যবহার করে
            </p>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink font-bn">
              {t('প্রধান মুদ্রা')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['BDT', 'USD', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => workRulesForm.setData('currency', curr)}
                  className={`h-11 rounded-xl text-[13px] font-bold transition-all border ${
                    workRulesForm.data.currency === curr
                      ? 'bg-brand text-white border-brand shadow-sm'
                      : 'bg-slate-50 text-ink border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {curr} ({curr === 'BDT' ? '৳' : curr === 'USD' ? '$' : '€'})
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={workRulesForm.processing}
            className="h-12 w-full rounded-[14px] bg-brand text-[15px] font-bold text-white font-bn active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-brand/20 mt-2"
          >
            {workRulesForm.processing
              ? t('সংরক্ষণ হচ্ছে…')
              : t('সংরক্ষণ করুন')}
          </button>
        </form>
      </AppModal>

      {/* Delete confirm sheet */}
      <BottomSheet
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setDeleteConfirmText('');
        }}
      >
        <div className="flex flex-col items-center text-center font-bn space-y-4 p-1">
          {/* Warning Icon Container */}
          <div className="size-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner mb-1">
            <AlertTriangle className="size-8 stroke-[2.2]" />
          </div>

          {/* Header Copy */}
          <div className="space-y-1">
            <h2 className="text-[22px] font-black text-rose-600 tracking-tight">
              এই কাজটি ফেরানো যাবে না
            </h2>
            <p className="text-[14px] leading-relaxed text-muted px-2">
              আপনার সব কাজের হিসাব, আয়ের খাতা এবং প্রোফাইল তথ্য চিরতরে মুছে যাবে।
            </p>
          </div>

          {/* Confirmation Input */}
          <div className="w-full text-left space-y-1.5 pt-1">
            <label htmlFor="confirm-delete-input" className="block text-[13px] font-bold text-ink pl-1">
              নিশ্চিত করতে <span className="font-bold text-rose-600">"মুছুন"</span> লিখুন
            </label>
            <input
              id="confirm-delete-input"
              type="text"
              placeholder="মুছুন"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-[15px] font-bold text-ink placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              type="button"
              disabled={deleteConfirmText.trim() !== 'মুছুন'}
              onClick={() => {
                setShowDelete(false);
                setDeleteConfirmText('');
              }}
              className={`w-full h-12 rounded-xl text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                deleteConfirmText.trim() === 'মুছুন'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Trash2 className="size-4" />
              সব তথ্য মুছে ফেলুন
            </button>

            <button
              type="button"
              onClick={() => {
                setShowDelete(false);
                setDeleteConfirmText('');
              }}
              className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink text-[14px] font-bold border border-slate-200 transition-all active:scale-[0.98]"
            >
              ফিরে যান
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
