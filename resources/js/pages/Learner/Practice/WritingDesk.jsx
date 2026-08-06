import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import { postJson } from '../../../lib/api';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { StatPill } from '../../../components/StatPill';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 23 — রাইটিং ডেস্ক / Writing Desk (Stitch, feature 15).
 * Two states: prompt list (Tab 4 shell) and full-screen editor
 * (no bottom nav, violet AI feedback entry).
 *
 * Everything is dynamic and backend-driven:
 *  - prompt list, structures & category chips come from `writing_prompts`
 *  - drafts come from the subscriber's `writing_drafts` (autosaved)
 *  - "AI ফিডব্যাক নিন" saves the draft, runs /ai/writing/check against the
 *    real LLM (FIT_AI_* credentials, rule-engine fallback) and shows the
 *    correction cards inline in the editor.
 */
export default function WritingDesk({ prompts = [], drafts = [], categories = [] }) {
  const [editing, setEditing] = React.useState(null); // prompt object | null
  const [draft, setDraft] = React.useState('');
  const [draftId, setDraftId] = React.useState(null);
  const [savedTick, setSavedTick] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [selectedCat, setSelectedCat] = React.useState('সব');
  const [showStructure, setShowStructure] = React.useState(true);
  const [feedback, setFeedback] = React.useState(null); // null | {loading} | review | {error}
  const { t } = useI18n();

  // Editor timer (resets on open)
  React.useEffect(() => {
    if (!editing) return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [editing]);

  const words = draft.trim() === '' ? 0 : draft.trim().split(/\s+/).length;

  // Category chips are derived from the backend — never hardcoded.
  const chips = React.useMemo(() => {
    const source = categories.length > 0 ? categories : prompts.map((p) => p.category).filter(Boolean);
    return ['সব', ...source.filter((c, i, a) => a.indexOf(c) === i)];
  }, [categories, prompts]);

  const filteredPrompts = prompts.filter((p) => selectedCat === 'সব' || p.category === selectedCat);

  const saveDraft = () =>
    postJson('/practice/writing/save-draft', {
      prompt_id: editing.id,
      title: editing.title,
      body: draft,
      draft_id: draftId,
    }).then((res) => {
      setDraftId(res.draft_id);
      setSavedTick((t) => t + 1);
      return res.draft_id;
    });

  const openPrompt = (prompt) => {
    setEditing({ ...prompt, structure: prompt.structure || [] });
    setDraft('');
    setDraftId(null);
    setSavedTick(0);
    setFeedback(null);
  };

  const openDraft = (d) => {
    const prompt = prompts.find((p) => p.id === d.prompt_id) || null;
    setEditing({
      id: d.prompt_id,
      title: d.title,
      structure: d.structure || prompt?.structure || [],
    });
    // The checked text is the exact body the feedback was produced for —
    // fall back to it so reviewing past feedback never shows an empty box.
    setDraft(d.body || d.feedback?.checked_text || '');
    setDraftId(d.id);
    setSavedTick(0);
    // Reopen with the last AI review so learners can review past feedback.
    setFeedback(d.feedback || null);
  };

  const closeEditor = () => {
    setEditing(null);
    // Refresh the draft list so a just-saved draft shows up.
    router.reload({ only: ['drafts'] });
  };

  const getAiFeedback = async () => {
    if (!draft.trim() || (feedback && feedback.loading)) return;
    setFeedback({ loading: true });
    // Persist the draft first so the server can attach the review to it.
    let id = draftId;
    try {
      id = await saveDraft();
    } catch {
      // the check still runs against the current text
    }
    try {
      const res = await postJson('/ai/writing/check', { text: draft, draft_id: id });
      // Stamp the checked text so staleness is detected if the user edits
      // the text after a fresh check too (not just on resume).
      setFeedback({ ...res, checked_text: draft, loading: false });
    } catch {
      setFeedback({ loading: false, error: true });
    }
  };

  // Hand the current draft to the full-screen AI writing page (/ai/writing).
  const openAiWriting = () => {
    try {
      window.sessionStorage.setItem('learnWritingDraft', draft);
    } catch {
      // ignore storage failures
    }
  };

  if (editing) {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const target = parseTarget(editing.words);
    // Stored feedback belongs to an older version of the text — flag it.
    const feedbackStale = !!(feedback && !feedback.loading && !feedback.error
      && feedback.checked_text !== undefined && feedback.checked_text !== draft);

    return (
      <div className="flex h-full min-h-screen flex-col bg-learn-bg">
        <Head title={t('রাইটিং ডেস্ক')} />
        <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col pb-24">
          {/* Editor top bar — no bottom nav */}
          <header className="flex h-14 items-center justify-between px-5">
            <button
              type="button"
              onClick={closeEditor}
              className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-ink active:scale-95 transition-transform cursor-pointer"
              aria-label={t('বন্ধ করুন')}
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <p className="min-w-0 flex-1 truncate text-center text-[16px] font-bold text-learn-ink px-3">{editing.title}</p>
            <button
              type="button"
              onClick={saveDraft}
              className="shrink-0 text-[15px] font-bold text-learn-primary cursor-pointer hover:opacity-80 active:scale-95 transition-all"
            >
              {savedTick > 0 ? `${t('সেভ')} ✓` : t('সেভ')}
            </button>
          </header>

          {/* Structure panel — comes from the prompt's DB record */}
          {editing.structure && editing.structure.length > 0 && (
            <div className="mx-5 rounded-[14px] bg-[#f0edff] p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <button
                type="button"
                onClick={() => setShowStructure(!showStructure)}
                className="flex w-full items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-learn-primary">account_tree</span>
                  <span className="text-[14px] font-bold text-learn-ink">{t('কাঠামো দেখুন')}</span>
                </div>
                <span className="material-symbols-outlined text-[20px] text-learn-muted">
                  {showStructure ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showStructure && (
                <div className="mt-4 space-y-4">
                  {editing.structure.map((step, i) => (
                    <div key={`${step.label}-${i}`} className="space-y-1">
                      <div className="flex items-start gap-1 text-[13px] font-bold text-learn-primary">
                        <span>|</span>
                        <span>{t(step.label)}</span>
                      </div>
                      {step.desc && <p className="text-[13px] text-learn-muted ml-2">{t(step.desc)}</p>}
                      {(step.phrases || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-2 mt-1.5">
                          {step.phrases.map((p) => (
                            <span key={p} className="rounded-full bg-white border border-learn-primary/15 text-learn-primary px-3.5 py-1.5 text-[12px] font-semibold">
                              "{p}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Writing area */}
          <div className="flex-1 px-5 py-4">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('এখানে ইংরেজিতে লিখুন…')}
              rows={12}
              autoFocus
              className="w-full resize-none rounded-[16px] bg-white p-4 text-[15px] leading-relaxed text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)] placeholder:text-learn-muted/60 focus:outline-none min-h-[300px]"
            />
          </div>

          {/* Stale-feedback notice (text changed since the last review) */}
          {feedbackStale && (
            <div className="mx-5 mb-3 flex items-center gap-2 rounded-[14px] bg-learn-warn-tint px-4 py-3 text-[13px] font-semibold text-learn-warn">
              <span className="material-symbols-outlined text-[20px] shrink-0 text-[#f5a524]">info</span>
              <span>{t('লেখা বদলেছে — আবার AI ফিডব্যাক নিন')}</span>
            </div>
          )}

          {/* AI feedback panel (inline results from /ai/writing/check) */}
          {feedback && (
            <FeedbackPanel feedback={feedback} onRetry={getAiFeedback} onOpenWriting={openAiWriting} />
          )}
        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-learn-structure/70 bg-white px-5 py-3 shadow-[0px_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="mx-auto flex w-full max-w-[960px] items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-learn-muted">
                {toBnDigits(words)} {t('শব্দ')} · {toBnDigits(mm)}:{toBnDigits(ss)}
              </span>
              <div className="h-1.5 w-28 rounded-full bg-learn-structure overflow-hidden">
                <div
                  className="h-full bg-learn-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (words / target) * 100)}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={getAiFeedback}
              disabled={!draft.trim()}
              className={cn(
                'flex h-11 items-center gap-1.5 rounded-full border-2 border-learn-primary bg-white px-5 text-[14px] font-bold text-learn-primary',
                'hover:bg-learn-primary/5 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">wifi</span>
              <span>{feedback?.loading ? t('যাচাই করছে…') : t('AI ফিডব্যাক নিন')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const customLeft = (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="-ml-2 flex size-12 items-center justify-center rounded-full text-learn-primary active:scale-95 transition-transform cursor-pointer"
      aria-label="Back"
    >
      <span className="material-symbols-outlined text-[24px]">arrow_back</span>
    </button>
  );

  return (
    <LearnerShell
      activeTab="practice"
      left={customLeft}
      title={<span className="text-[18px] font-bold text-learn-ink">{t('রাইটিং ডেস্ক')}</span>}
      right={
        drafts.length > 0 ? (
          <button
            type="button"
            aria-label={t('খসড়া')}
            className="relative flex size-12 items-center justify-center rounded-full text-learn-ink active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px] text-learn-ink">folder_open</span>
            <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-[#E5484D] text-[10px] font-bold text-white leading-none">
              {toBnDigits(drafts.length)}
            </span>
          </button>
        ) : null
      }
    >
      <div className="mt-2 space-y-4">
        <Head title={t('রাইটিং ডেস্ক')} />

        {/* Category chips — dynamic */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <Chip key={c} selected={selectedCat === c} onClick={() => setSelectedCat(c)}>
              {t(c)}
            </Chip>
          ))}
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div>
            <p className="mb-2 text-[14px] font-bold text-learn-ink ml-1">{t('খসড়া চালিয়ে যান')}</p>
            {drafts.map((d) => (
              <div
                key={d.id}
                role="button"
                tabIndex={0}
                onClick={() => openDraft(d)}
                onKeyDown={(e) => e.key === 'Enter' && openDraft(d)}
                className="mb-3 flex items-center gap-3 rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] cursor-pointer hover:bg-learn-bg/30 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-learn-ink">{d.title}</p>
                  <p className="mt-0.5 truncate text-[13px] text-learn-muted">{d.preview || t('খসড়া')}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-learn-muted">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>{toBnDigits(d.words || 0)} {t('শব্দ')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{d.relative}</span>
                    </span>
                    {d.feedback && (
                      <span className="flex items-center gap-1 text-learn-success">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>
                          {d.feedback.score !== undefined
                            ? t('স্কোর: {score}', { score: toBnDigits(d.feedback.score) })
                            : t('ফিডব্যাক আছে')}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] shrink-0 text-[#c3c6d5]">chevron_right</span>
              </div>
            ))}
          </div>
        )}

        {/* New prompts — dynamic */}
        <div>
          <p className="mb-2 text-[14px] font-bold text-learn-ink ml-1">{t('নতুন লেখা শুরু করুন')}</p>
          {filteredPrompts.length === 0 ? (
            <p className="rounded-[14px] bg-white p-4 text-center text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              {t('এই বিভাগে এখনো কোনো বিষয় নেই')}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPrompt(prompt)}
                  onKeyDown={(e) => e.key === 'Enter' && openPrompt(prompt)}
                  className="rounded-[16px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)] hover:bg-learn-bg/30 transition-all cursor-pointer"
                >
                  <p className="text-[16px] font-bold text-learn-ink leading-tight">{prompt.title}</p>
                  <p className="mt-1 text-[13px] text-learn-muted">{t(prompt.bn || prompt.bnBn)}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[4px] bg-[#eaf0fc] px-2 py-0.5 text-[11px] font-bold text-learn-primary">
                        {prompt.level}
                      </span>
                      <span className="text-[13px] font-semibold text-learn-muted">
                        {toBnDigits(prompt.words || '')}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-learn-primary hover:underline">
                      {t('শুরু করুন')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[13px] text-learn-muted">{t('সব খসড়া ডিভাইসে সংরক্ষিত থাকে')}</p>
      </div>
    </LearnerShell>
  );
}

/**
 * Inline AI feedback panel shown inside the editor. Renders the same
 * payload shape as the AI Writing page: issues[], correctedText, level,
 * score and praiseBn. Loading + error states included.
 */
function FeedbackPanel({ feedback, onRetry, onOpenWriting }) {
  const { t } = useI18n();

  if (feedback.loading) {
    return (
      <div className="mx-5 mb-4 flex items-center gap-3 rounded-[16px] bg-[#f0edff] p-4">
        <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-learn-ai border-t-transparent" />
        <p className="text-[14px] font-semibold text-learn-ai">{t('AI ফিডব্যাক নেওয়া হচ্ছে…')}</p>
      </div>
    );
  }

  if (feedback.error) {
    return (
      <div className="mx-5 mb-4 rounded-[16px] bg-white p-4 text-center shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
        <p className="text-[14px] font-bold text-learn-ink">{t('দুঃখিত, AI ফিডব্যাক নেওয়া যায়নি')}</p>
        <p className="mt-1 text-[13px] text-learn-muted">{t('ইন্টারনেট বা API সংযোগ পরীক্ষা করে আবার চেষ্টা করুন')}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex h-11 items-center rounded-full bg-learn-primary px-5 text-[14px] font-bold text-white active:scale-95 transition-all cursor-pointer"
          >
            {t('আবার চেষ্টা করুন')}
          </button>
          <Link
            href="/ai/writing"
            onClick={onOpenWriting}
            className="flex h-11 items-center rounded-full border-2 border-learn-primary bg-white px-5 text-[14px] font-bold text-learn-primary active:scale-95 transition-all"
          >
            {t('লেখা যাচাই খুলুন')}
          </Link>
        </div>
      </div>
    );
  }

  const issues = feedback.issues || [];
  const copyCorrected = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && feedback.correctedText) {
      navigator.clipboard.writeText(feedback.correctedText).catch(() => {});
    }
  };

  return (
    <div className="mx-5 mb-4 space-y-3">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-2">
        <StatPill
          label={t('{n}টি ভুল', { n: toBnDigits(issues.length) })}
          tone={issues.length > 0 ? 'danger' : 'success'}
        />
        {feedback.level && <StatPill label={t('স্তর: {level}', { level: feedback.level })} tone="ai" />}
        {feedback.score ? (
          <StatPill label={t('স্কোর: {score}', { score: toBnDigits(feedback.score) })} tone="success" />
        ) : null}
      </div>

      {feedback.praiseBn && <p className="text-[13px] font-bold text-learn-success">{feedback.praiseBn}</p>}

      {issues.length === 0 && (
        <p className="rounded-[14px] bg-white p-4 text-[13px] text-learn-ink shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
          {t('দারুণ! আপনার লেখায় কোনো ভুল পাওয়া যায়নি।')}
        </p>
      )}

      {/* Correction cards */}
      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div key={i} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] leading-relaxed text-learn-ink">
                <span className="bg-learn-danger-tint text-learn-danger underline decoration-2 underline-offset-2">
                  {issue.original}
                </span>
              </p>
              <span className="shrink-0 rounded-full bg-learn-structure px-2.5 py-1 text-[13px] font-bold text-learn-muted">
                {issue.category}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[14px] font-bold text-learn-success">
              {issue.corrected}
            </p>
            {issue.reasonBn && <p className="mt-1.5 text-[13px] text-learn-muted">{issue.reasonBn}</p>}
          </div>
        ))}
      </div>

      {feedback.correctedText ? (
        <button
          type="button"
          onClick={copyCorrected}
          className="w-full h-12 rounded-full border-2 border-learn-primary bg-white text-[14px] font-bold text-learn-primary active:scale-95 transition-all cursor-pointer"
        >
          {t('সংশোধিত লেখা কপি করুন')}
        </button>
      ) : null}
    </div>
  );
}

/** Pick the word target from a prompt's word range ('১০০–১৫০ শব্দ' → 150). */
function parseTarget(wordRange) {
  const str = String(wordRange || '').replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  const matches = str.match(/\d+/g);
  const max = matches ? Math.max(...matches.map(Number)) : 0;
  return max || 150;
}
