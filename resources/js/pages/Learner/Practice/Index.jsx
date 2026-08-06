import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LearnerShell from '../../../layouts/LearnerShell';
import { StreakChip } from '../../../components/StreakChip';
import { cn } from '../../../lib/utils';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 20 — অনুশীলন / Practice Hub (Stitch). Today's weakest-skill
 * suggestion plus the six practice surfaces with honest status chips.
 * Advice comes from the learner's actual progress.
 */
export default function PracticeIndex({ streak = 7, advice = { bn: 'বলা', text: 'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট উচ্চারণ অনুশীলন করুন', href: '/practice/pronunciation' } }) {
  const { t } = useI18n();

  return (
    <>
      <Head title={t('অনুশীলন')} />
      <LearnerShell
        activeTab="practice"
        title={<span className="text-[18px] font-bold text-learn-primary">{t('অনুশীলন')}</span>}
        right={<StreakChip days={streak} />}
      >
        <div className="mt-2 space-y-5">
          {/* Today's advice */}
          <section>
            <h2 className="text-[15px] font-bold text-learn-ink ml-1">{t('আজকের পরামর্শ')}</h2>
            <div className="mt-2.5 rounded-[14px] border-l-[4px] border-[#F5A524] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <p className="text-[15px] font-bold text-learn-ink">{t(advice.bn)}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-learn-muted">
                {t(advice.text)}
              </p>
              <Link
                href={advice.href}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-learn-primary px-6 text-[14px] font-bold text-white hover:bg-learn-primary-dark active:scale-[0.98] transition-all cursor-pointer"
              >
                {t('শুরু করুন')}
              </Link>
            </div>
          </section>

          {/* All practice */}
          <section>
            <h2 className="text-[15px] font-bold text-learn-ink ml-1">{t('সব অনুশীলন')}</h2>
            <div className="mt-2.5 grid grid-cols-2 gap-3.5">
              {TILES.map((tile) => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  className="flex flex-col items-center justify-center text-center rounded-[16px] bg-white p-5 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all hover:bg-learn-bg/30 active:scale-[0.98] cursor-pointer group"
                >
                  {/* Icon */}
                  <span className={cn('flex size-12 items-center justify-center rounded-[14px] transition-transform group-hover:scale-105', tile.bgTint, tile.iconColor)}>
                    <span className="material-symbols-outlined text-[24px]">{tile.icon}</span>
                  </span>

                  {/* Title */}
                  <span className="mt-3 block text-[15px] font-bold text-learn-ink leading-tight">
                    {t(tile.title)}
                  </span>

                  {/* Subtitle */}
                  <span className="mt-1 block text-[12px] text-learn-muted leading-snug min-h-[32px] flex items-center justify-center">
                    {t(tile.subtitle)}
                  </span>

                  {/* Badge */}
                  {tile.badge && (
                    <span
                      className={cn(
                        'mt-3.5 rounded-full px-3 py-1 text-[10px] font-bold leading-none',
                        tile.badgeTone === 'amber'
                          ? 'bg-[#FEF4E1] text-[#F5A524]'
                          : 'bg-[#eaf0fc] text-learn-muted'
                      )}
                    >
                      {t(tile.badge)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Premium Banner */}
          <div className="relative overflow-hidden rounded-[16px] h-32 bg-slate-900 flex items-center px-6 mt-6 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <img
              src="/images/premium_banner.png"
              alt={t('Premium')}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-learn-primary/95 via-learn-primary/80 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-[17px] font-bold text-white leading-tight">{t('আরও শিখতে চান?')}</h3>
              <p className="mt-1 text-[13px] font-semibold text-white/80 leading-tight">{t('প্রিমিয়াম কন্টেন্ট আনলক করুন')}</p>
            </div>
          </div>
        </div>
      </LearnerShell>
    </>
  );
}

const TILES = [
  { 
    href: '/practice/pronunciation', 
    icon: 'mic', 
    bgTint: 'bg-[#FEF4E1]',
    iconColor: 'text-[#F5A524]', 
    title: 'উচ্চারণ স্টুডিও', 
    subtitle: 'শুনুন, বলুন, মিলিয়ে দেখুন', 
    badge: 'স্কোরিং-এ নেট লাগে', 
    badgeTone: 'amber' 
  },
  { 
    href: '/practice/listening', 
    icon: 'headset', 
    bgTint: 'bg-[#eaf0fc]', 
    iconColor: 'text-learn-primary', 
    title: 'লিসেনিং', 
    subtitle: 'শুনে লিখুন ও বুঝুন', 
    badge: 'অফলাইন', 
    badgeTone: 'offline' 
  },
  { 
    href: '/practice/writing', 
    icon: 'edit_note', 
    bgTint: 'bg-[#e3fcf0]', 
    iconColor: 'text-learn-success', 
    title: 'রাইটিং ডেস্ক', 
    subtitle: 'বিষয় বেছে লিখুন', 
    badge: 'অফলাইন', 
    badgeTone: 'offline' 
  },
  { 
    href: '/practice/quiz', 
    icon: 'quiz', 
    bgTint: 'bg-[#f0edff]', 
    iconColor: 'text-learn-ai', 
    title: 'কুইজ ও টেস্ট', 
    subtitle: 'নিজেকে যাচাই করুন', 
    badge: 'অফলাইন', 
    badgeTone: 'offline' 
  },
  { 
    href: '/practice/phrasebook', 
    icon: 'menu_book', 
    bgTint: 'bg-[#e6f9ff]', 
    iconColor: 'text-[#0D9488]', 
    title: 'ফ্রেজবুক', 
    subtitle: 'বাস্তব পরিস্থিতির বাক্য', 
    badge: 'অফলাইন', 
    badgeTone: 'offline' 
  },
  { 
    href: '/practice/mistakes', 
    icon: 'calculate', 
    bgTint: 'bg-[#ffebee]', 
    iconColor: 'text-learn-danger', 
    title: 'ভুল সংশোধক', 
    subtitle: 'বাংলাভাষীদের সাধারণ ভুল', 
    badge: 'অফলাইন', 
    badgeTone: 'offline' 
  },
];
