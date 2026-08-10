import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Mic, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import { speak, getEnglishVoices } from '../../../lib/speech';
import { SessionShell } from '../../../components/SessionShell';
import { BottomSheet } from '../../../components/BottomSheet';
import { useI18n } from '../../../lib/i18n';

// Browser speech-to-text (Chrome / Edge / Safari). Undefined elsewhere.
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Short English sample used to preview a chosen reply voice.
const VOICE_SAMPLE = 'Hello! I am your English speaking companion.';

// Pause this long while speaking → assume the turn is done and send it.
// This is what makes the conversation feel realtime (like ChatGPT voice).
const SILENCE_MS = 1600;

/**
 * Voice assistant — Gemini Live-style hands-free English conversation.
 * Tap the orb to talk; your speech is transcribed live, sent to the same
 * AI backend as the text chat (/ai/chat/send), and the reply is spoken
 * back with an English voice. With "স্বয়ংক্রিয় চালু" (auto-continue) on,
 * the mic re-opens after every reply for a free-flowing dialogue.
 */
export default function VoiceAssistant({
  scenarios = [],
  scenario = null,
  messages: initialMessages = [],
  voiceAutoContinue = true,
  aiVoice: aiVoiceProp = null,
}) {
  const { t, lang } = useI18n();
  const [messages, setMessages] = React.useState(initialMessages);
  const [state, setState] = React.useState('idle'); // idle | listening | thinking | speaking
  const [interim, setInterim] = React.useState('');
  const [error, setError] = React.useState(null);
  const [autoContinue, setAutoContinue] = React.useState(Boolean(voiceAutoContinue));
  const [aiVoice, setAiVoice] = React.useState(aiVoiceProp || null);
  const [voiceOpen, setVoiceOpen] = React.useState(false);
  const [voices, setVoices] = React.useState([]);

  const recRef = React.useRef(null);
  const finalRef = React.useRef('');
  const interimRef = React.useRef('');
  const keepListeningRef = React.useRef(false);
  const interruptedRef = React.useRef(false);
  const autoContinueRef = React.useRef(autoContinue);
  const stateRef = React.useRef('idle');
  const silenceTimerRef = React.useRef(null);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    autoContinueRef.current = autoContinue;
  }, [autoContinue]);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Keep the latest message in view.
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, interim, state]);

  // Cleanup on unmount (scenario switch / close): stop listening, cut audio.
  React.useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      clearSilenceCheck();
      try {
        recRef.current?.abort?.();
      } catch {
        // ignore
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const clearSilenceCheck = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Each time speech is heard, restart the pause timer. If the user stays
  // quiet for SILENCE_MS, assume the turn is finished → finalize & send,
  // so the AI replies without needing another tap (ChatGPT-style flow).
  const scheduleSilenceCheck = () => {
    clearSilenceCheck();
    silenceTimerRef.current = setTimeout(() => {
      if (keepListeningRef.current && stateRef.current === 'listening') {
        stopListening();
      }
    }, SILENCE_MS);
  };

  const startListening = () => {
    if (!SR || stateRef.current === 'listening' || stateRef.current === 'thinking') return;
    setError(null);
    finalRef.current = '';
    interimRef.current = '';
    setInterim('');

    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let final = '';
      let partial = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else partial += r[0].transcript;
      }
      if (final) finalRef.current += final;
      interimRef.current = partial;
      setInterim(partial);
      scheduleSilenceCheck();
    };

    rec.onerror = (e) => {
      clearSilenceCheck();
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError(t('মাইক্রোফোন ব্যবহারের অনুমতি দিন'));
      } else if (e.error === 'network') {
        setError(t('ইন্টারনেট সংযোগ পরীক্ষা করুন'));
      }
      keepListeningRef.current = false;
    };

    rec.onend = () => {
      // Fired after a manual stop OR when the browser times out on silence.
      clearSilenceCheck();
      const wantMore = keepListeningRef.current;
      keepListeningRef.current = false;
      const text = `${finalRef.current} ${interimRef.current}`.trim();
      setInterim('');
      interimRef.current = '';

      if (text) {
        sendToAi(text);
      } else if (wantMore && autoContinueRef.current && !interruptedRef.current) {
        // Hands-free: silence timeout — keep the conversation live.
        setTimeout(() => {
          if (autoContinueRef.current && !interruptedRef.current && stateRef.current === 'idle') startListening();
        }, 500);
      } else {
        setState('idle');
      }
    };

    rec.start();
    recRef.current = rec;
    keepListeningRef.current = true;
    setState('listening');
  };

  const stopListening = () => {
    clearSilenceCheck();
    keepListeningRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      // ignore
    }
  };

  const speakReply = (text) => {
    setState('speaking');
    speak(text, {
      voice: 'en', // AI replies are English — always use an English voice
      voiceName: aiVoice || undefined, // the voice picked in the voice sheet
      onEnd: () => {
        if (interruptedRef.current) {
          // The user took the floor (tap while speaking) — the interrupt
          // path already started listening; leave the state untouched.
          interruptedRef.current = false;
          return;
        }
        setState('idle');
        if (autoContinueRef.current) {
          setTimeout(() => {
            if (autoContinueRef.current && stateRef.current === 'idle') startListening();
          }, 650);
        }
      },
    });
  };

  const sendToAi = async (text) => {
    if (!scenario?.id || !text.trim()) {
      setState('idle');
      return;
    }
    setState('thinking');
    setMessages((m) => [...m, { role: 'learner', text: text.trim() }]);
    try {
      const res = await postJson('/ai/chat/send', { message: text.trim(), scenario_id: scenario.id });
      setMessages(res.messages || []);
      const aiMsg = [...(res.messages || [])].reverse().find((m) => m.role === 'ai');
      if (aiMsg?.text) {
        speakReply(aiMsg.text);
      } else {
        setState('idle');
      }
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: t('দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।') }]);
      setState('idle');
    }
  };

  // Flip the hands-free toggle and persist it for this subscriber.
  const toggleAutoContinue = () => {
    const next = !autoContinue;
    setAutoContinue(next);
    postJson('/ai/voice/auto-continue', { enabled: next }).catch(() => {});
  };

  // Re-read the device's English voices each time the sheet opens.
  const openVoiceSheet = () => {
    setVoices(getEnglishVoices());
    setVoiceOpen(true);
  };

  // Pick a reply voice, persist it, and preview it right away.
  const chooseVoice = (name) => {
    setAiVoice(name);
    postJson('/ai/voice/voice', { voice: name }).catch(() => {});
    speak(VOICE_SAMPLE, { voice: 'en', voiceName: name || undefined });
  };

  const tapOrb = () => {
    if (state === 'listening') {
      stopListening();
      return;
    }
    if (state === 'speaking') {
      // Interrupt the AI and take the floor (like Gemini Live).
      interruptedRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      startListening();
      return;
    }
    if (state === 'thinking') return;
    startListening();
  };

  const statusText =
    state === 'listening'
      ? interim || t('শুনছি…')
      : state === 'thinking'
        ? t('ভাবছি…')
        : state === 'speaking'
          ? t('বলছি…')
          : scenario
            ? t('মাইক্রোফোনে ট্যাপ করে কথা শুরু করুন')
            : t('কোনো পরিস্থিতি নেই');

  const statusTone =
    state === 'listening'
      ? 'bg-learn-ai-tint text-learn-ai'
      : state === 'speaking'
        ? 'bg-learn-ai-tint text-learn-ai'
        : state === 'thinking'
          ? 'bg-learn-structure text-learn-muted'
          : 'bg-learn-structure text-learn-muted';

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
      right={
        <button
          type="button"
          aria-label={t('স্বয়ংক্রিয় চালু')}
          onClick={toggleAutoContinue}
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-learn-ai-tint px-2.5 text-[11px] font-bold text-learn-ai transition-colors hover:bg-learn-ai/20 active:scale-95"
        >
          <span className={cn('size-1.5 rounded-full', autoContinue ? 'bg-learn-ai' : 'bg-learn-disabled')} />
          {t('স্বয়ংক্রিয়')}
        </button>
      }
      onClose={() => window.history.back()}
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
                {(state === 'thinking' || state === 'speaking') && (
                  <div className="flex animate-fade-in items-start gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-learn-ai text-white">
                      <Sparkles className="size-4" strokeWidth={2} />
                    </span>
                    <div className="rounded-[16px] rounded-bl-md bg-white px-4 py-3 text-[13px] text-learn-muted shadow-[0px_2px_10px_rgba(20,23,43,0.06)]">
                      {state === 'thinking' ? t('ভাবছি…') : t('বলছি…')}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Mic orb */}
              <div className="flex flex-col items-center pb-1 pt-4">
                <div className="relative flex items-center justify-center">
                  {state === 'listening' && (
                    <>
                      <span
                        className="absolute size-40 rounded-full bg-learn-ai/20 animate-ping"
                        style={{ animationDuration: '1.8s' }}
                      />
                      <span
                        className="absolute size-32 rounded-full bg-learn-ai/15 animate-ping"
                        style={{ animationDuration: '1.8s', animationDelay: '0.45s' }}
                      />
                    </>
                  )}
                  {state === 'speaking' && (
                    <span className="absolute size-40 rounded-full bg-learn-ai/10 animate-pulse" style={{ animationDuration: '1.2s' }} />
                  )}
                  <button
                    type="button"
                    aria-label={state === 'listening' ? t('শোনা বন্ধ করুন') : t('কথা শুরু করুন')}
                    onClick={tapOrb}
                    className={cn(
                      'relative flex size-24 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] text-white shadow-[0_10px_40px_rgba(124,107,245,0.45)] transition-all duration-300 active:scale-95',
                      state === 'listening' && 'scale-105',
                      state === 'thinking' && 'animate-pulse',
                      !scenario && 'pointer-events-none opacity-50'
                    )}
                  >
                    {state === 'listening' ? (
                      <Mic className="size-9" strokeWidth={2} />
                    ) : state === 'speaking' ? (
                      <span className="flex h-8 items-end gap-[3px]">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className="voice-wave-bar w-[3.5px] rounded-full bg-white"
                            style={{ height: `${8 + (i % 3) * 5}px`, animationDelay: `${i * 0.11}s` }}
                          />
                        ))}
                      </span>
                    ) : state === 'thinking' ? (
                      <Mic className="size-9" strokeWidth={2} />
                    ) : (
                      <Mic className="size-9" strokeWidth={2} />
                    )}
                  </button>
                </div>

                {/* Status / live caption */}
                <div className="mt-5 min-h-9 max-w-full">
                  <p
                    className={cn(
                      'mx-auto inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
                      statusTone
                    )}
                  >
                    {state === 'listening' && (
                      <span className="flex items-end gap-[2px]">
                        <span className="voice-wave-bar h-2 w-[2px] rounded-full bg-current" style={{ animationDelay: '0s' }} />
                        <span className="voice-wave-bar h-2 w-[2px] rounded-full bg-current" style={{ animationDelay: '0.15s' }} />
                        <span className="voice-wave-bar h-2 w-[2px] rounded-full bg-current" style={{ animationDelay: '0.3s' }} />
                      </span>
                    )}
                    <span className="truncate">{statusText}</span>
                  </p>
                  {state === 'listening' && (
                    <p className="mt-2 text-center text-[12px] font-medium text-learn-muted">
                      {t('থামলেই AI উত্তর দেবে')}
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-center text-[12px] font-semibold text-learn-danger">{error}</p>
                  )}
                  {!SR && (
                    <p className="mt-2 text-center text-[12px] font-semibold text-learn-warn">
                      {t('এই ব্রাউজারে ভয়েস শোনা যায় না')} — {t('Chrome বা Edge ব্যবহার করে দেখুন')}
                    </p>
                  )}

                  {/* Reply-voice picker */}
                  <button
                    type="button"
                    onClick={openVoiceSheet}
                    className="mx-auto mt-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-learn-ai-tint/70 px-3 py-1.5 text-[12px] font-bold text-learn-ai transition-colors hover:bg-learn-ai/20 active:scale-95"
                  >
                    <Volume2 className="size-3.5" strokeWidth={2} />
                    {t('AI কণ্ঠস্বর')}: {aiVoice || t('স্বয়ংক্রিয় (সেরা)')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Voice selection sheet */}
      <BottomSheet open={voiceOpen} onOpenChange={setVoiceOpen} title={t('AI কণ্ঠস্বর')}>
        <p className="text-[13px] text-learn-muted">{t('কণ্ঠস্বর বাছাই করুন')}</p>
        <div className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto pb-2">
          <VoiceRow
            name={t('স্বয়ংক্রিয় (সেরা)')}
            lang="en-US"
            selected={!aiVoice}
            onSelect={() => chooseVoice(null)}
            onPreview={() => speak(VOICE_SAMPLE, { voice: 'en' })}
          />
          {voices.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-learn-muted">{t('কোনো কণ্ঠস্বর পাওয়া যায়নি')}</p>
          ) : (
            voices.map((v) => (
              <VoiceRow
                key={v.name}
                name={v.name}
                lang={v.lang}
                selected={aiVoice === v.name}
                onSelect={() => chooseVoice(v.name)}
                onPreview={() => speak(VOICE_SAMPLE, { voice: 'en', voiceName: v.name })}
              />
            ))
          )}
        </div>
      </BottomSheet>
    </SessionShell>
  );
}

function VoiceRow({ name, lang, selected, onSelect, onPreview }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-[14px] border p-3 transition-colors',
        selected ? 'border-learn-ai bg-learn-ai-tint/60' : 'border-learn-border bg-white'
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
      >
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            selected ? 'border-learn-ai bg-learn-ai' : 'border-learn-disabled bg-white'
          )}
        >
          {selected && <Check className="size-3 text-white" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-bold text-learn-ink">{name}</span>
          <span className="block text-[12px] text-learn-muted">{lang}</span>
        </span>
      </button>
      <button
        type="button"
        aria-label={t('নমুনা শুনুন')}
        onClick={onPreview}
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-learn-ai-tint text-learn-ai transition-colors hover:bg-learn-ai/20 active:scale-95"
      >
        <Volume2 className="size-4.5" strokeWidth={2} />
      </button>
    </div>
  );
}
