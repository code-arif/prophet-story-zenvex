import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { BottomSheet } from '../../../components/BottomSheet';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 31 — সেটিংস ও রিমাইন্ডার / Settings & Reminder (Stitch).
 * Grouped setting rows with a reminder toggle + day chips, language/voice
 * controls and a destructive data section (red reserved for destructive).
 * Reminder preferences are persisted via POST /profile/settings.
 */
export default function Settings({
  settings = {
    reminderEnabled: false,
    reminderTime: '21:00',
    reminderDays: ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'],
    appLanguage: 'bn',
    fontSize: 1,
    voice: 'ডিভাইসের ডিফল্ট',
    readingSpeed: '১.০x',
  },
}) {
  const [reminderOn, setReminderOn] = React.useState(Boolean(settings.reminderEnabled));
  const [days, setDays] = React.useState(() => new Set(settings.reminderDays || ['শ', 'র', 'সো', 'ম', 'বু']));
  const [size, setSize] = React.useState(settings.fontSize || 1); // 0 small, 1 medium, 2 large
  const [lang, setLang] = React.useState(settings.appLanguage || 'bn');
  const [langOpen, setLangOpen] = React.useState(false);
  const [time, setTime] = React.useState(settings.reminderTime || '21:00');
  const [timeOpen, setTimeOpen] = React.useState(false);
  const langLabel = LANGUAGES.find((l) => l.code === lang)?.label || 'বাংলা';
  const { flash } = usePage().props;
  const { t } = useI18n();

  const save = () => {
    router.post('/profile/settings', {
      reminderEnabled: reminderOn,
      reminderTime: time,
      reminderDays: Array.from(days),
      appLanguage: lang,
      fontSize: size,
    });
  };

  const toggleDay = (d) => {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const customHeader = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex size-10 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
        aria-label="Back"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
      </button>
      <span className="text-[18px] font-bold text-learn-primary">{t('সেটিংস')}</span>
    </div>
  );

  return (
    <LearnerShell activeTab="profile" left={customHeader}>
      <div className="mt-2 space-y-4">
        <Head title={t('সেটিংস')} />

        {/* Save confirmation */}
        {flash?.status && (
          <div className="rounded-[14px] bg-learn-success-tint px-4 py-3 text-[13px] font-semibold text-learn-success">
            {t(flash.status)}
          </div>
        )}

        {/* Group 1 — Reminder */}
        <section>
          <p className="mb-2 text-[14px] font-bold text-learn-muted ml-1">{t('পড়ার রিমাইন্ডার')}</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex h-[56px] items-center px-4">
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">notifications</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink">{t('দৈনিক রিমাইন্ডার')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={reminderOn}
                aria-label={t('দৈনিক রিমাইন্ডার')}
                onClick={() => setReminderOn((v) => !v)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer',
                  reminderOn ? 'bg-learn-primary' : 'bg-learn-disabled'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200',
                    reminderOn ? 'left-[22px]' : 'left-0.5'
                  )}
                />
              </button>
            </div>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <button
              type="button"
              onClick={() => setTimeOpen(true)}
              className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">schedule</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink text-left">{t('সময়')}</span>
              <span className="text-[13px] text-[#434653] mr-1">{toBnDigits(time)}</span>
              <span className="material-symbols-outlined text-[#c3c6d5] text-[20px]">chevron_right</span>
            </button>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <div className="flex gap-2 px-4 py-3.5">
              {DAY_KEYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  aria-pressed={days.has(d)}
                  className={cn(
                    'flex size-11 flex-1 items-center justify-center rounded-full text-[13px] font-bold transition-all active:scale-95 cursor-pointer',
                    days.has(d) ? 'bg-learn-primary text-white' : 'bg-learn-primary-tint text-learn-primary'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Amber note */}
          <div className="mt-3 rounded-[14px] bg-learn-warn-tint p-4">
            <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#b25e00]">
              <span className="material-symbols-outlined text-[20px] shrink-0">info</span>
              <span>{t('iPhone-এ ব্রাউজার নোটিফিকেশন সবসময় নির্ভরযোগ্য নয় — অ্যাপ খুললে বকেয়া রিমাইন্ডার দেখানো হবে')}</span>
            </div>
            <button
              type="button"
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#b25e00]/50 bg-transparent px-4 text-[14px] font-semibold text-[#b25e00] hover:bg-[#b25e00]/5 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              {t('ক্যালেন্ডারে যোগ করুন')}
            </button>
          </div>
        </section>

        {/* Group 2 — Language & writing */}
        <section>
          <p className="mb-2 text-[14px] font-bold text-learn-muted ml-1">{t('ভাষা ও লেখা')}</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <button
              type="button"
              onClick={() => setLangOpen(true)}
              className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">language</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink text-left">{t('অ্যাপের ভাষা')}</span>
              <span className="text-[13px] text-[#434653] mr-1">{langLabel}</span>
              <span className="material-symbols-outlined text-[#c3c6d5] text-[20px]">chevron_right</span>
            </button>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <div className="flex h-[56px] items-center px-4">
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">format_size</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink">{t('লেখার আকার')}</span>
              <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl">
                {[0, 1, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-label={`লেখার আকার ${s + 1}`}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg font-bold transition-all cursor-pointer',
                      size === s ? 'bg-white text-learn-primary shadow-sm' : 'text-[#6b7280]'
                    )}
                  >
                    <span className={s === 0 ? 'text-[12px]' : s === 1 ? 'text-[14px]' : 'text-[16px]'}>A</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Group 3 — Listening */}
        <section>
          <p className="mb-2 text-[14px] font-bold text-learn-muted ml-1">{t('শোনা')}</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <button
              type="button"
              className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">record_voice_over</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink text-left">{t('ভয়েস')}</span>
              <span className="text-[13px] text-[#434653] mr-1">{t(settings.voice || 'ডিভাইসের ডিফল্ট')}</span>
              <span className="material-symbols-outlined text-[#c3c6d5] text-[20px]">chevron_right</span>
            </button>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <button
              type="button"
              className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">speed</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink text-left">{t('পড়ার গতি')}</span>
              <span className="text-[13px] text-[#434653] mr-1">{settings.readingSpeed || '১.০x'}</span>
              <span className="material-symbols-outlined text-[#c3c6d5] text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Group 4 — Data */}
        <section>
          <p className="mb-2 text-[14px] font-bold text-learn-muted ml-1">{t('ডেটা')}</p>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex h-[56px] items-center px-4">
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">database</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink">{t('সংরক্ষিত জায়গা')}</span>
              <span className="text-[13px] text-[#434653]">{toBnDigits(18)} MB</span>
            </div>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <button
              type="button"
              className="w-full h-[56px] flex items-center px-4 hover:bg-[#f4f2ff] active:bg-[#e6e6ff] transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-primary mr-4">file_upload</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-ink text-left">{t('অগ্রগতি রপ্তানি করুন')}</span>
              <span className="material-symbols-outlined text-[#c3c6d5] text-[20px]">chevron_right</span>
            </button>
            <div className="mx-4 h-[1px] bg-[#c3c6d5]/30" />
            <button
              type="button"
              onClick={() => window.confirm(t('আপনি কি নিশ্চিত যে সব তথ্য মুছে ফেলতে চান?'))}
              className="w-full h-[56px] flex items-center px-4 hover:bg-red-50 active:bg-red-100 transition-colors text-left group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-learn-danger mr-4">delete</span>
              <span className="flex-1 font-semibold text-[16px] text-learn-danger text-left">{t('সব তথ্য মুছে ফেলুন')}</span>
            </button>
          </div>
        </section>

        {/* Save settings */}
        <button
          type="button"
          onClick={save}
          className="w-full h-[52px] shrink-0 bg-learn-primary text-white rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all hover:bg-learn-primary-dark cursor-pointer mt-6"
        >
          {t('সেটিংস সংরক্ষণ করুন')}
        </button>

        {/* Reminder time picker */}
        <BottomSheet open={timeOpen} onOpenChange={setTimeOpen} title={t('সময়')}>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((h) => {
              const selected = h === time;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    setTime(h);
                    setTimeOpen(false);
                  }}
                  className={cn(
                    'flex h-12 items-center justify-center rounded-[12px] text-[15px] font-semibold transition-colors active:scale-[0.97] cursor-pointer',
                    selected
                      ? 'bg-learn-primary text-white'
                      : 'bg-learn-primary-tint text-learn-primary hover:bg-learn-primary/15'
                  )}
                >
                  {toBnDigits(h)}
                </button>
              );
            })}
          </div>
        </BottomSheet>

        {/* App language picker */}
        <BottomSheet open={langOpen} onOpenChange={setLangOpen} title={t('অ্যাপের ভাষা')}>
          <div className="space-y-1">
            {LANGUAGES.map(({ code, label }) => {
              const selected = code === lang;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLang(code);
                    setLangOpen(false);
                  }}
                  className={cn(
                    'flex h-[52px] w-full items-center justify-between rounded-[12px] px-4 text-left transition-colors cursor-pointer',
                    selected ? 'bg-learn-primary-tint' : 'hover:bg-learn-bg'
                  )}
                >
                  <span className={cn('text-[15px] font-semibold', selected ? 'text-learn-primary' : 'text-learn-ink')}>
                    {label}
                  </span>
                  {selected && <span className="material-symbols-outlined text-[20px] text-learn-primary">check</span>}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      </div>
    </LearnerShell>
  );
}

const LANGUAGES = [
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
];

// Hourly options 06:00 → 23:00 (stored ASCII; rendered via toBnDigits).
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

const DAY_KEYS = ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'];
