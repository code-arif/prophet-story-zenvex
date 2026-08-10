import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Briefcase,
  History,
  MessageCircle,
  MessagesSquare,
  Mic,
  Plane,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  PenLine,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import LearnerShell from '../../../layouts/LearnerShell';
import { StatusChip } from '../../../components/StatusChip';
import { NoticeStrip } from '../../../components/NoticeStrip';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { HubTile } from '../../../components/HubTile';
import { BottomSheet } from '../../../components/BottomSheet';
import { useI18n } from '../../../lib/i18n';
import { toBnDigits } from '../../../lib/format';

const LEVEL_TONES = {
  A1: 'bg-learn-success-tint text-learn-success',
  A2: 'bg-learn-primary-tint text-learn-primary',
  B1: 'bg-learn-ai-tint text-learn-ai',
};

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
export default function AiIndex({ scenarios = SCENARIOS, lastSession = null, history = [] }) {
  const { t, lang } = useI18n();
  const [tab, setTab] = React.useState('chat');
  const [historyOpen, setHistoryOpen] = React.useState(false);

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
          onClick={() => setHistoryOpen(true)}
          className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95 cursor-pointer"
        >
          <History className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        {/* Connectivity notice (amber = internet needed) */}
        {/* <NoticeStrip tone="warn">{t('এই ফিচারটি ব্যবহার করতে ইন্টারনেট প্রয়োজন')}</NoticeStrip> */}

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
            {/* Voice assistant CTA — hands-free English conversation */}
            <Link
              href="/ai/voice"
              className="flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#8b7cf6] to-[#6d28d9] p-4 text-white shadow-[0_8px_24px_rgba(124,107,245,0.35)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Mic className="size-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">{t('ভয়েস সহকারী')}</span>
                <span className="block truncate text-[12px] text-white/80">{t('মাইক্রোফোনে কথা বলুন — AI উত্তর দেবে কণ্ঠে')}</span>
              </span>
              <span className="material-symbols-outlined shrink-0 text-[20px]">arrow_forward</span>
            </Link>

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

            {/* Last conversation — dynamic, from the learner's most recent session */}
            {lastSession && (
              <section className="rounded-[14px] border-l-[3px] border-learn-ai bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[15px] font-bold text-learn-ink">{t('শেষ আলাপ')}</h2>
                  <span className="shrink-0 text-[12px] font-semibold text-learn-muted">
                    {toBnDigits(lastSession.relative)}
                  </span>
                </div>

                <div className="mt-3 rounded-[12px] bg-learn-ai-tint/60 p-3">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-learn-ai">
                    {lastSession.lastRole === 'ai' ? (
                      <Sparkles className="size-3.5" />
                    ) : (
                      <MessageCircle className="size-3.5" />
                    )}
                    {lastSession.lastRole === 'ai' ? 'AI' : t('আপনি')}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-learn-ink">
                    {lastSession.preview || (lang === 'en' ? lastSession.scenarioEn : lastSession.scenarioBn)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-learn-muted">
                      {lastSession.level && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_TONES[lastSession.level] || LEVEL_TONES.A1}`}
                        >
                          {lastSession.level}
                        </span>
                      )}
                      <span className="truncate">{lang === 'en' ? lastSession.scenarioEn : lastSession.scenarioBn}</span>
                    </p>
                    {lastSession.messageCount > 0 && (
                      <p className="mt-0.5 text-[12px] text-learn-muted/70">
                        {t('{n}টি বার্তা', { n: toBnDigits(lastSession.messageCount) })}
                      </p>
                    )}
                  </div>
                  <Link
                    href={lastSession.href}
                    className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-learn-ai hover:text-learn-ai/80 transition-colors"
                  >
                    {t('আবার শুরু করুন')}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
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

      {/* Chat history (top-bar History button) */}
      <BottomSheet open={historyOpen} onOpenChange={setHistoryOpen} title={t('ইতিহাস')}>
        {history.length > 0 ? (
          <div className="-mx-1 max-h-[55vh] overflow-y-auto px-1">
            {history.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className={cn('block py-3 transition-colors hover:bg-learn-bg/60', i > 0 && 'border-t border-learn-structure')}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="flex min-w-0 items-center gap-1.5 text-[14px] font-bold text-learn-ink">
                    {s.level && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_TONES[s.level] || LEVEL_TONES.A1}`}
                      >
                        {s.level}
                      </span>
                    )}
                    <span className="truncate">{lang === 'en' ? s.scenarioEn : s.scenarioBn}</span>
                  </p>
                  <span className="shrink-0 text-[12px] font-semibold text-learn-muted">{toBnDigits(s.relative)}</span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-learn-muted">
                  <span className="min-w-0 flex-1 truncate">
                    {s.preview || (lang === 'en' ? s.scenarioEn : s.scenarioBn)}
                  </span>
                  {s.messageCount > 0 && (
                    <span className="shrink-0 text-[12px] font-semibold text-learn-muted/70">
                      · {t('{n}টি বার্তা', { n: toBnDigits(s.messageCount) })}
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-[40px] text-learn-muted">history_toggle_off</span>
            <p className="mt-2 text-[14px] font-bold text-learn-ink">{t('এখনো কোনো আলাপ নেই')}</p>
            <p className="mt-1 text-[13px] text-learn-muted">{t('একটি পরিস্থিতি বেছে নিয়ে কথা বলা শুরু করুন')}</p>
          </div>
        )}
      </BottomSheet>
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
