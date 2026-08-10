import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Check, Info, WifiOff, ArrowRight, Wifi } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { buttonVariants } from '../../../components/ui/button';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 27 — ভুল সংশোধক / Mistake Doctor (Stitch, feature 16).
 * Type a sentence, match it against the fixed error-pattern map, show the
 * correction card; plus a grid of common Bangla-speaker mistakes.
 * The check runs on the server (POST /practice/mistakes/check).
 */
export default function MistakeDoctor({ common = COMMON }) {
  const [text, setText] = React.useState('I am agree with your plan');
  const [checked, setChecked] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [checkingAi, setCheckingAi] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const { t } = useI18n();

  const check = async (sentence) => {
    const value = (sentence ?? text).trim();
    if (!value || checking) return;
    setChecking(true);
    setErrorMessage(null);
    try {
      const res = await postJson('/practice/mistakes/check', { text: value });
      setResult(res);
      setChecked(true);
    } catch {
      // keep previous state
    } finally {
      setChecking(false);
    }
  };

  const checkAi = async () => {
    const value = text.trim();
    if (!value || checkingAi) return;
    setCheckingAi(true);
    setErrorMessage(null);
    try {
      const res = await postJson('/practice/mistakes/check-ai', { text: value });
      setResult(res);
      setChecked(true);
    } catch (err) {
      if (err && err.reasonBn) {
        setErrorMessage(err.reasonBn);
      } else {
        setErrorMessage(t('দুঃখিত, AI সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।'));
      }
    } finally {
      setCheckingAi(false);
    }
  };

  return (
    <LearnerShell
      showBack
      activeTab="practice"
      title={t('ভুল সংশোধক')}
      right={
        <button type="button" aria-label={t('তথ্য')} className="flex size-12 items-center justify-center rounded-full text-learn-ink transition-colors hover:bg-black/5 active:scale-95">
          <Info className="size-5" strokeWidth={2} />
        </button>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('ভুল সংশোধক')} />
        
        {/* Input card */}
        <div className="rounded-[20px] bg-white p-5 shadow-[0px_4px_20px_rgba(20,23,43,0.04)]">
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); setChecked(false); setErrorMessage(null); }}
            placeholder={t('একটি ইংরেজি বাক্য লিখুন…')}
            className="w-full h-14 rounded-[12px] border border-[#c3c6d5]/60 bg-white px-4 text-[16px] text-learn-ink placeholder:text-learn-muted/60 focus:border-learn-primary focus:outline-none"
          />
          <button 
            className="w-full h-12 mt-3 flex items-center justify-center rounded-[14px] bg-[#2b59c3] font-bold text-white text-[16px] transition-transform active:scale-[0.98] disabled:opacity-60 shadow-sm"
            onClick={() => check()} 
            disabled={checking || checkingAi}
          >
            {checking ? t('যাচাই হচ্ছে…') : t('মিলিয়ে দেখুন')}
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-[20px] bg-red-50 p-5 text-[14px] text-red-600 border border-red-200">
            {errorMessage}
          </div>
        )}

        {result && result.found === false && (
          <div className="rounded-[20px] bg-white p-5 text-[14px] text-learn-ink shadow-[0px_4px_20px_rgba(20,23,43,0.04)] border border-[#c3c6d5]/40">
            <p className="font-bold text-[#2b8a3e] flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#2b8a3e]/10 text-[#2b8a3e]">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t('কোনো ভুল পাওয়া যায়নি!')}
            </p>
            <p className="mt-2 text-learn-muted">{result.reasonBn || t('আপনার বাক্যটি সঠিক আছে।')}</p>
          </div>
        )}

        {result && result.found !== false && result.wrong && (
          <div className="rounded-[20px] border-l-[4px] border-[#c92a2a] bg-white p-5 shadow-[0px_4px_20px_rgba(20,23,43,0.04)]">
            <p className="text-[14px] font-bold text-[#c92a2a]">{t('যে ভুলটি পাওয়া গেল')}</p>
            <p className="mt-3 flex items-center gap-2 text-[16px]">
              <span className="text-[#c92a2a] line-through decoration-1">{result.wrong}</span>
              <ArrowRight className="size-4 text-[#71737e]" strokeWidth={2.5} />
              <span className="font-bold text-[#2b8a3e]">{result.correct}</span>
            </p>
            <div className="mt-4 rounded-[14px] bg-[#f0f2f9]/70 p-4 text-[14px] leading-relaxed text-learn-ink">
              {result.reasonBn}
            </div>
            {result.examples && result.examples.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-[14px] font-bold text-learn-ink">{t('সঠিক ব্যবহার')}</p>
                <div className="space-y-3">
                  {result.examples.map((ex) => (
                    <div key={ex.en} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#12b886] text-[#12b886]">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="text-[15px] font-bold text-learn-ink leading-tight">{ex.en}</p>
                        <p className="mt-1 text-[13px] text-learn-muted">{ex.bn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Common mistakes grid */}
        <div>
          <p className="mb-2 text-[14px] font-semibold text-learn-ink">{t('বেশি হয় এমন ভুল')}</p>
          <div className="grid grid-cols-2 gap-2.5">
            {common.map((m) => (
              <button
                key={m.wrong}
                type="button"
                onClick={() => { setText(m.wrong); check(m.wrong); }}
                className="flex items-center justify-center h-12 rounded-[14px] bg-white border border-[#c3c6d5]/50 text-[14px] font-medium text-learn-ink transition-transform active:scale-[0.98] hover:bg-[#f8f9fc] active:bg-[#f1f3f9] shadow-sm"
              >
                {m.wrong}
              </button>
            ))}
          </div>
        </div>

        {/* AI fallback */}
        <button 
          type="button"
          onClick={checkAi}
          disabled={checkingAi || checking || !text.trim()}
          className="flex w-full h-12 items-center justify-center gap-2 rounded-[14px] border border-[#7C6BF5] bg-white text-[#7C6BF5] font-semibold text-[14px] transition-transform active:scale-[0.98] mt-4 shadow-sm disabled:opacity-60"
        >
          <Wifi className="size-5 text-[#7C6BF5]" strokeWidth={2} />
          {checkingAi ? t('AI যাচাই করছে…') : t('তালিকায় নেই? AI সঙ্গীকে জিজ্ঞাসা করুন')}
        </button>
      </div>
    </LearnerShell>
  );
}

const COMMON = [
  { wrong: 'discuss about', correct: 'discuss' },
  { wrong: 'one of my friend', correct: 'one of my friends' },
  { wrong: 'cope up with', correct: 'cope with' },
  { wrong: 'give a miss call', correct: 'missed call' },
  { wrong: 'return back', correct: 'return' },
  { wrong: 'more better', correct: 'better' },
];
