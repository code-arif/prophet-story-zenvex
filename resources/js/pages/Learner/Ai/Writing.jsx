import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Copy, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { StatusChip } from '../../../components/StatusChip';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { StatPill } from '../../../components/StatPill';
import { buttonVariants } from '../../../components/ui/button';

/**
 * Screen 19 — লেখা যাচাই / AI Writing Feedback (Stitch, feature 13).
 * Paste a draft, request correction, see issues + corrected text.
 * UI-phase demo issues; real /api/writing comes later.
 */
export default function AiWriting() {
  const [tab, setTab] = React.useState('writing');
  const [text, setText] = React.useState(SAMPLE_TEXT);
  const [checked, setChecked] = React.useState(false);

  const words = countWords(text);

  return (
    <LearnerShell
      showBack
      activeTab="ai"
      title={
        <span className="inline-flex items-center gap-1.5">
          লেখা যাচাই
          <StatusChip tone="violet" icon={<Sparkles className="size-3" />}>AI</StatusChip>
        </span>
      }
    >
      <div className="mt-2 space-y-4">
        <Head title="লেখা যাচাই" />
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
            {/* Textarea card */}
            <div className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setChecked(false);
                }}
                placeholder="আপনার লেখা এখানে পেস্ট করুন…"
                rows={6}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between border-t border-learn-structure pt-3">
                <span className="text-[13px] text-learn-muted">{toBnDigits(words)} শব্দ</span>
                <Link href="/practice/writing" className="text-[13px] font-semibold text-learn-ai">
                  রাইটিং ডেস্ক থেকে আনুন
                </Link>
              </div>
              <button className={cn(buttonVariants({ variant: 'ai', size: 'learner' }), 'mt-3')} onClick={() => setChecked(true)}>
                যাচাই করুন
              </button>
            </div>

            {checked && (
              <>
                {/* Summary pills */}
                <div className="flex gap-2">
                  <StatPill label={`${toBnDigits(5)}টি ভুল`} tone="danger" />
                  <StatPill label={`${toBnDigits(2)}টি পরামর্শ`} tone="warn" />
                  <StatPill label="স্তর: A2" tone="ai" />
                </div>

                {/* Correction cards */}
                <div className="space-y-3">
                  {ISSUES.map((issue) => (
                    <div key={issue.original} className="rounded-[14px] bg-white p-4 shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
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
                        <button type="button" aria-label="কপি করুন" className="text-learn-muted">
                          <Copy className="size-3.5" strokeWidth={2} />
                        </button>
                      </p>
                      <p className="mt-1.5 text-[13px] text-learn-muted">{issue.reasonBn}</p>
                    </div>
                  ))}
                </div>

                <button className={cn(buttonVariants({ variant: 'outlineViolet', size: 'learner' }), 'w-full')}>
                  সংশোধিত লেখা কপি করুন
                </button>
              </>
            )}
          </>
        )}

        {tab === 'chat' && (
          <p className="rounded-[14px] bg-white p-4 text-[13px] text-learn-muted shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
            কথা বলতে চাইলে AI সঙ্গী ট্যাবে যান।
          </p>
        )}
      </div>
    </LearnerShell>
  );
}

function countWords(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

const SAMPLE_TEXT =
  'I am agree with your plan. We have discussed about the project last week. He don’t like the new office. She has been working here since 2019.';

const ISSUES = [
  { original: 'I am agree', corrected: 'I agree', category: 'Grammar', reasonBn: "'agree' নিজেই verb, তাই এর আগে am বসে না।" },
  { original: 'discussed about', corrected: 'discussed', category: 'Preposition', reasonBn: "discuss-এর পরে about লাগে না।" },
  { original: 'He don’t like', corrected: 'He doesn’t like', category: 'Tense', reasonBn: "He কর্তার সাথে negative-এ doesn't হয়।" },
];
