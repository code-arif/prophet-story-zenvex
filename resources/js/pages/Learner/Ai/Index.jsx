import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Briefcase,
  History,
  MessageCircle,
  MessagesSquare,
  Plane,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  PenLine,
} from 'lucide-react';
import LearnerShell from '../../../layouts/LearnerShell';
import { StatusChip } from '../../../components/StatusChip';
import { NoticeStrip } from '../../../components/NoticeStrip';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { HubTile } from '../../../components/HubTile';
import { useI18n } from '../../../lib/i18n';

const SCENARIO_ICONS = {
  briefcase: Briefcase,
  shopping: ShoppingBag,
  stethoscope: Stethoscope,
  plane: Plane,
  chat: MessagesSquare,
  message: MessageCircle,
};

/**
 * Screen 17 — AI সঙ্গী / Scenario Picker (Stitch). The only always-online
 * hub: violet accents reserved for AI, amber connectivity notice, and a
 * segmented control between chat scenarios and writing feedback.
 * Scenarios + last conversation come from the backend.
 */
export default function AiIndex({ scenarios = SCENARIOS, lastSession = null }) {
  const { t, lang } = useI18n();
  const [tab, setTab] = React.useState('chat');

  return (
    <>
      <Head title={t('AI সঙ্গী')} />
      <LearnerShell
      activeTab="ai"
      title={
        <span className="inline-flex items-center gap-1.5">
          {t('AI সঙ্গী')}
          <StatusChip tone="violet" icon={<Sparkles className="size-3" />}>AI</StatusChip>
        </span>
      }
      right={
        <button
          type="button"
          aria-label={t('ইতিহাস')}
          className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95"
        >
          <History className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        {/* Connectivity notice (amber = internet needed) */}
        <NoticeStrip tone="warn">{t('এই ফিচারটি ব্যবহার করতে ইন্টারনেট প্রয়োজন')}</NoticeStrip>

        {/* Chat / writing toggle */}
        <SegmentedControl
          tone="ai"
          value={tab}
          onChange={setTab}
          options={[
            { label: t('কথা বলুন'), value: 'chat' },
            { label: t('লেখা যাচাই'), value: 'writing' },
          ]}
        />

        {tab === 'chat' ? (
          <>
            <section>
              <h2 className="text-[16px] font-semibold text-learn-ink">{t('পরিস্থিতি বেছে নিন')}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {scenarios.map(({ bn, en, iconKey, href }) => (
                  <HubTile
                    key={href}
                    href={href}
                    icon={SCENARIO_ICONS[iconKey] || MessageCircle}
                    tint="violet"
                    title={lang === 'en' ? en : bn}
                    subtitle={lang === 'en' ? bn : en}
                    layout="grid"
                  />
                ))}
              </div>
            </section>

            {/* Last conversation */}
            {lastSession && (
              <section className="rounded-[14px] border-l-[3px] border-learn-ai bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                <h2 className="text-[15px] font-bold text-learn-ink">{t('শেষ আলাপ')}</h2>
                <p className="mt-1 text-[13px] text-learn-muted">{lastSession.scenarioBn} — {lastSession.relative}</p>
                <Link href={lastSession.href} className="mt-2 inline-block text-[13px] font-semibold text-learn-ai">
                  {t('আবার শুরু করুন')}
                </Link>
              </section>
            )}
          </>
        ) : (
          <section className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <span className="flex size-10 items-center justify-center rounded-xl bg-learn-ai-tint text-learn-ai">
              <PenLine className="size-5" strokeWidth={2} />
            </span>
            <h2 className="mt-3 text-[15px] font-bold text-learn-ink">{t('লেখা যাচাই')}</h2>
            <p className="mt-1 text-[13px] text-learn-muted">{t('আপনার লেখা পেস্ট করে ভুল সংশোধন ও ব্যাখ্যা পান')}</p>
            <Link href="/ai/writing" className="mt-3 inline-block text-[13px] font-semibold text-learn-ai">
              {t('লেখা যাচাই করুন')}
            </Link>
          </section>
        )}
      </div>
      </LearnerShell>
    </>
  );
}

const SCENARIOS = [
  { bn: 'চাকরির ইন্টারভিউ', en: 'Job interview', Icon: Briefcase, href: '/ai/chat' },
  { bn: 'দোকানে কেনাকাটা', en: 'Shopping', Icon: ShoppingBag, href: '/ai/chat' },
  { bn: 'ডাক্তারের চেম্বার', en: 'At the doctor', Icon: Stethoscope, href: '/ai/chat' },
  { bn: 'বিমানবন্দর', en: 'At the airport', Icon: Plane, href: '/ai/chat' },
  { bn: 'বন্ধুর সাথে আলাপ', en: 'Small talk', Icon: MessagesSquare, href: '/ai/chat' },
  { bn: 'মুক্ত আলাপ', en: 'Open chat', Icon: MessageCircle, href: '/ai/chat' },
];
