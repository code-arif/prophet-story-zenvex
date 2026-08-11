import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Copy, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { StatusChip } from '../../../components/StatusChip';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { StatPill } from '../../../components/StatPill';
import { useI18n } from '../../../lib/i18n';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 19 — লেখা যাচাই / AI Writing Feedback (Stitch, feature 13).
 * Paste a draft, request correction, see issues + corrected text, then save
 * the checked draft (with its feedback) back to the Writing Desk.
 *
 * POST /ai/writing/check runs the real LLM (AI_CHAT_* credentials) with a
 * rule-based fallback. When arriving from the Writing Desk the current
 * draft is pre-filled via sessionStorage ('learnWritingDraft' [+ id]).
 * Drafts that already have AI feedback are listed up top for quick review.
 */
export default function AiWriting({ sample = SAMPLE_TEXT, drafts = [] }) {
  const [tab, setTab] = React.useState('writing');
  const [text, setText] = React.useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.sessionStorage.getItem('learnWritingDraft');
        if (stored) return stored;
      } catch {
        // ignore storage failures
      }
    }
    return sample;
  });
  const [activeDraftId, setActiveDraftId] = React.useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const id = window.sessionStorage.getItem('learnWritingDraftId');
        if (id) return Number(id) || null;
      } catch {
        // ignore storage failures
      }
    }
    return null;
  });
  const [draftTitle, setDraftTitle] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [issues, setIssues] = React.useState([]);
  const [level, setLevel] = React.useState('A2');
  const [correctedText, setCorrectedText] = React.useState('');
  const [score, setScore] = React.useState(null);
  const [praiseBn, setPraiseBn] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [lastReview, setLastReview] = React.useState(null); // last check payload (no `ok`)
  const [saving, setSaving] = React.useState(false);
  const [saveState, setSaveState] = React.useState(null); // null | 'ok' | 'error'
  const { t } = useI18n();

  const words = countWords(text);

  const check = async () => {
    if (!text.trim() || checking) return;
    setChecking(true);
    try {
      const res = await postJson('/ai/writing/check', { text, draft_id: activeDraftId });
      const { ok, ...review } = res;
      setLastReview(review);
      setIssues(review.issues || []);
      setLevel(review.level || 'A2');
      setCorrectedText(review.correctedText || '');
      setScore(review.score ?? null);
      setPraiseBn(review.praiseBn || '');
      setChecked(true);
      setSaveState(null);
    } catch {
      // keep the previous state; user can retry
    } finally {
      setChecking(false);
    }
  };

  // Load a past draft (text + stored AI feedback) for review or re-checking.
  const loadDraft = (d) => {
    const fb = d.feedback || {};
    setText(d.body || fb.checked_text || '');
    setDraftTitle(d.title || '');
    setActiveDraftId(d.id);
    setChecked(true);
    setLastReview(fb); // keep the stored review so saving never wipes it
    setIssues(fb.issues || []);
    setLevel(fb.level || 'A2');
    setCorrectedText(fb.correctedText || '');
    setScore(fb.score ?? null);
    setPraiseBn(fb.praiseBn || '');
    setSaveState(null);
  };

  const saveAsDraft = async () => {
    if (saving || !text.trim()) return;
    const existing = activeDraftId;
    setSaving(true);
    try {
      const res = await postJson('/ai/writing/save', {
        text,
        title: draftTitle.trim() || makeTitle(text),
        feedback: lastReview || undefined,
        draft_id: existing,
      });
      setActiveDraftId(res.draftId);
      setSaveState(existing ? 'ok-updated' : 'ok-created');
      if (!existing) {
        // Refresh the past-feedback list so the new draft shows up.
        router.reload({ only: ['drafts'] });
      }
    } catch {
      setSaveState('error');
    } finally {
      setSaving(false);
    }
  };

  const copyCorrected = () => {
    const target = correctedText || text;
    if (typeof navigator !== 'undefined' && navigator.clipboard && target) {
      navigator.clipboard.writeText(target).catch(() => {});
    }
  };

  const suggestions = issues.filter((i) => i.category !== 'Grammar').length;

  return (
    <LearnerShell
      showBack
      activeTab="ai"
      title={
        <span className="inline-flex items-center gap-1.5">
          {t('লেখা যাচাই')}
          <StatusChip tone="violet" icon={<Sparkles className="size-3" />}>AI</StatusChip>
        </span>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('লেখা যাচাই')} />
        <SegmentedControl
          tone="ai"
          value={tab}
          onChange={setTab}
          options={[
            { label: 'কথা বলুন', value: 'chat' },
            { label: 'লেখা যাচাই', value: 'writing' },
          ]}
        />

        {tab === 'writing' && (
          <>
            {/* Past feedback — drafts that already have an AI review */}
            {drafts.length > 0 && (
              <div>
                <p className="mb-2 text-[14px] font-bold text-learn-ink ml-1">{t('আগের ফিডব্যাক')}</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {drafts.map((d) => {
                    const fb = d.feedback || {};
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => loadDraft(d)}
                        className={cn(
                          'w-44 shrink-0 rounded-[14px] bg-white p-3 text-left shadow-[0px_4px_12px_rgba(20,23,43,0.04)]',
                          'hover:bg-learn-bg/30 active:scale-[0.98] transition-all cursor-pointer',
                          activeDraftId === d.id && 'ring-2 ring-learn-ai/50'
                        )}
                      >
                        <p className="truncate text-[13px] font-bold text-learn-ink">{d.title}</p>
                        <p className="mt-1 text-[12px] font-semibold text-learn-muted">
                          {fb.score !== undefined
                            ? t('স্কোর: {score}', { score: toBnDigits(fb.score) })
                            : `${toBnDigits(fb.issues?.length || 0)} ${t('টি ভুল')}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Textarea card */}
            <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setChecked(false);
                  setLastReview(null);
                  setCorrectedText('');
                  setScore(null);
                  setPraiseBn('');
                  setSaveState(null);
                }}
                placeholder={t('আপনার লেখা এখানে পেস্ট করুন…')}
                rows={6}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between border-t border-learn-structure pt-3">
                <span className="text-[13px] text-learn-muted">{toBnDigits(words)} {t('শব্দ')}</span>
                <Link href="/practice/writing" className="text-[13px] font-semibold text-learn-ai">
                  {t('রাইটিং ডেস্ক থেকে আনুন')}
                </Link>
              </div>
              <button className={cn(buttonVariants({ variant: 'ai', size: 'learner' }), 'mt-3')} onClick={check} disabled={checking}>
                {checking ? t('যাচাই হচ্ছে…') : t('যাচাই করুন')}
              </button>
            </div>

            {checked && (
              <>
                {/* Summary pills */}
                <div className="flex flex-wrap gap-2">
                  <StatPill
                    label={t('{n}টি ভুল', { n: toBnDigits(issues.length) })}
                    tone={issues.length > 0 ? 'danger' : 'success'}
                  />
                  <StatPill label={t('{n}টি পরামর্শ', { n: toBnDigits(suggestions) })} tone="warn" />
                  <StatPill label={t('স্তর: {level}', { level })} tone="ai" />
                  {score ? <StatPill label={t('স্কোর: {score}', { score: toBnDigits(score) })} tone="success" /> : null}
                </div>

                {praiseBn && <p className="text-[13px] font-bold text-learn-success">{praiseBn}</p>}

                {issues.length === 0 && (
                  <p className="rounded-[14px] bg-white p-4 text-[13px] text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                    {t('আপনার লেখায় আমাদের তালিকার কোনো পরিচিত ভুল পাওয়া যায়নি। ভালো করেছেন!')}
                  </p>
                )}

                {/* Correction cards */}
                <div className="space-y-3">
                  {issues.map((issue, i) => (
                    <div key={i} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[14px] leading-relaxed text-learn-ink">
                          <span className="bg-learn-danger-tint text-learn-danger underline decoration-2 underline-offset-2">{issue.original}</span>
                        </p>
                        <span className="shrink-0 rounded-full bg-learn-structure px-2.5 py-1 text-[13px] font-bold text-learn-muted">
                          {issue.category}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-[14px] font-bold text-learn-success">
                        {issue.corrected}
                        <button type="button" aria-label={t('কপি করুন')} className="text-learn-muted">
                          <Copy className="size-3.5" strokeWidth={2} />
                        </button>
                      </p>
                      <p className="mt-1.5 text-[13px] text-learn-muted">{issue.reasonBn}</p>
                    </div>
                  ))}
                </div>

                <button
                  className={cn(buttonVariants({ variant: 'outlineViolet', size: 'learner' }), 'w-full')}
                  onClick={copyCorrected}
                >
                  {t('সংশোধিত লেখা কপি করুন')}
                </button>

                {/* Save the checked draft + feedback to the Writing Desk */}
                <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    maxLength={60}
                    placeholder={t('খসড়ার নাম (ঐচ্ছিক)')}
                    className="w-full rounded-[10px] bg-learn-bg px-3 py-2.5 text-[14px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none focus:ring-2 focus:ring-learn-primary/40"
                  />
                  <button
                    type="button"
                    onClick={saveAsDraft}
                    disabled={saving || !text.trim()}
                    className="mt-2 w-full h-12 rounded-[14px] bg-learn-primary text-[15px] font-bold text-white active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
                  >
                    {saving ? t('সেভ হচ্ছে…') : activeDraftId ? t('এই খসড়ায় সেভ করুন') : t('খসড়ায় সেভ করুন')}
                  </button>
                  {saveState === 'ok-created' && (
                    <p className="mt-2 text-center text-[13px] font-semibold text-learn-success">
                      {t('খসড়ায় সেভ হয়েছে — রাইটিং ডেস্কে দেখুন')}
                    </p>
                  )}
                  {saveState === 'ok-updated' && (
                    <p className="mt-2 text-center text-[13px] font-semibold text-learn-success">
                      {t('খসড়াটি আপডেট হয়েছে')}
                    </p>
                  )}
                  {saveState === 'error' && (
                    <p className="mt-2 text-center text-[13px] font-semibold text-learn-danger">
                      {t('সেভ করা যায়নি — আবার চেষ্টা করুন')}
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'chat' && (
          <p className="rounded-[14px] bg-white p-4 text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            {t('কথা বলতে চাইলে AI সঙ্গী ট্যাবে যান।')}
          </p>
        )}
      </div>
    </LearnerShell>
  );
}

function countWords(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

/** Auto title from the first few words of the text. */
function makeTitle(text) {
  return String(text).trim().split(/\s+/).slice(0, 6).join(' ') || 'AI লেখা যাচাই';
}

const SAMPLE_TEXT =
  'I am agree with your plan. We have discussed about the project last week. He don’t like the new office. She has been working here since 2019.';
