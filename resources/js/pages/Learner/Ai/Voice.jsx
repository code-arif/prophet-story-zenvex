import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Mic, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { SessionShell } from '../../../components/SessionShell';
import { VoiceChatOverlay } from '../../../components/VoiceChatOverlay';
import { useI18n } from '../../../lib/i18n';

/**
 * Voice assistant — realtime English conversation powered by OpenAI Realtime
 * (WebRTC), the same voice UI & flow as the Full Fit app. Tap the orb to open
 * the fullscreen voice chat; the AI replies with a natural voice in the
 * selected scenario. The transcript below shows the persisted conversation
 * history for the scenario.
 */
export default function VoiceAssistant({
  scenarios = [],
  scenario = null,
  messages: initialMessages = [],
  voiceName = 'coral',
  voiceLevel = 'beginner',
}) {
  const { t, lang } = useI18n();
  const [messages, setMessages] = React.useState(initialMessages);
  const [voiceChatOpen, setVoiceChatOpen] = React.useState(false);
  const bottomRef = React.useRef(null);

  // Keep the latest message in view.
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <SessionShell
      title={
        <span className="block leading-tight">
          <span className="block text-[15px] font-bold">{t('ভয়েস সহকারী')}</span>
          <span className="block truncate text-[13px] font-medium text-learn-muted">
            {scenario ? (lang === 'en' ? scenario.en : scenario.bn) : ''}
          </span>
        </span>
      }
      // Deterministic back → AI hub: window.history.back() silently fails on
      // mobile when the page was opened directly (deep link / refresh).
      onClose={() => router.visit('/ai')}
    >
      <Head title={t('ভয়েস সহকারী')} />

      {/* Desktop: same tinted panel treatment as the chat page. */}
      <div className="lg:flex lg:h-full lg:flex-col lg:rounded-[20px] lg:bg-learn-ai-tint/40 lg:px-6 lg:py-4 lg:ring-1 lg:ring-learn-ai/10">
        <div className="flex h-full flex-col lg:h-auto lg:min-h-0 lg:flex-1">
          {/* Scenario picker */}
          {scenarios.length > 1 && (
            <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {scenarios.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => router.visit(`/ai/voice?scenario=${s.slug}`)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors active:scale-95',
                    s.slug === scenario?.slug
                      ? 'bg-learn-ai text-white shadow-[0_2px_10px_rgba(124,107,245,0.35)]'
                      : 'bg-learn-structure text-learn-muted hover:bg-learn-ai/10 hover:text-learn-ai'
                  )}
                >
                  {lang === 'en' ? s.en : s.bn}
                </button>
              ))}
            </div>
          )}

          {!scenario ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="material-symbols-outlined text-[44px] text-learn-muted">mic_off</span>
              <p className="text-[14px] font-bold text-learn-ink">{t('কোনো পরিস্থিতি নেই')}</p>
              <Link href="/ai" className="text-[13px] font-semibold text-learn-ai underline underline-offset-2">
                {t('AI সঙ্গী')}
              </Link>
            </div>
          ) : (
            <>
              {/* Conversation transcript */}
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4 pt-2">
                {messages.length === 0 && (
                  <p className="pt-4 text-center text-[13px] text-learn-muted">
                    {t('মাইক্রোফোনে ট্যাপ করে কথা শুরু করুন')} — {scenario && (lang === 'en' ? scenario.en : scenario.bn)}
                  </p>
                )}
                {messages.map((msg, i) =>
                  msg.role === 'ai' ? (
                    <div key={i} className="flex animate-fade-in items-start gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-learn-ai text-white">
                        <Sparkles className="size-4" strokeWidth={2} />
                      </span>
                      <div className="max-w-[82%] rounded-[16px] rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed text-learn-ink shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex animate-fade-in flex-col items-end gap-2">
                      <div className="max-w-[82%] rounded-[16px] rounded-br-md bg-learn-ai px-4 py-3 text-[14px] leading-relaxed text-white">
                        {msg.text}
                      </div>
                      {msg.correction && (
                        <div className="w-full max-w-[82%] rounded-[14px] border-l-2 border-dashed border-learn-ai bg-white p-3 shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
                          <p className="text-[13px] font-bold uppercase tracking-wide text-learn-ai">{t('সংশোধন')}</p>
                          <p className="mt-1.5 text-[13px] leading-relaxed">
                            <span className="text-learn-danger line-through">{msg.correction.wrong}</span>{' '}
                            <span className="text-learn-muted">→</span>{' '}
                            <span className="font-bold text-learn-success">{msg.correction.right}</span>
                          </p>
                          <p className="mt-1.5 text-[13px] text-learn-muted">{msg.correction.reasonBn}</p>
                        </div>
                      )}
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>

              {/* Mic orb — opens the realtime voice chat overlay */}
              <div className="flex flex-col items-center pb-1 pt-4">
                <div className="relative flex items-center justify-center">
                  <span
                    className="absolute size-40 animate-pulse rounded-full bg-learn-ai/10"
                    style={{ animationDuration: '2.4s' }}
                  />
                  <button
                    type="button"
                    aria-label={t('ভয়েস চ্যাট শুরু করুন')}
                    onClick={() => setVoiceChatOpen(true)}
                    className="relative flex size-24 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] text-white shadow-[0_10px_40px_rgba(124,107,245,0.45)] transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Mic className="size-9" strokeWidth={2} />
                  </button>
                </div>
                <p className="mt-5 text-center text-[13px] font-semibold text-learn-ink">
                  {t('মাইক্রোফোনে ট্যাপ করে কথা শুরু করুন')}
                </p>
                <p className="mt-1 text-center text-[12px] font-medium text-learn-muted">
                  {t('AI সরাসরি কণ্ঠে উত্তর দেবে — রিয়েলটাইম সংযোগ')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Realtime voice assistant (OpenAI WebRTC) — same UI as the Full Fit app */}
      <VoiceChatOverlay
        open={voiceChatOpen}
        onClose={() => setVoiceChatOpen(false)}
        scenario={scenario}
        voiceName={voiceName}
        voiceLevel={voiceLevel}
      />
    </SessionShell>
  );
}
