import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { VioletInset } from '../../components/ui/VioletInset';
import SituationChip from '../../components/assistant/SituationChip';
import DraftResultCard from '../../components/assistant/DraftResultCard';

/**
 * Screen 14 — AI Assistant · সহায়ক
 * VioletInset + SituationChips + input + DraftResultCard.
 */

const SITUATIONS = [
  'প্রস্তাব লিখুন',
  'ক্লায়েন্টের সাথে কথা বলুন',
  'দর নির্ধারণ করুন',
  'সমস্যা সমাধান করুন',
  'প্রোফাইল উন্নত করুন',
];

const MOCK_DRAFT = `Hi Rahim,

I noticed your project for an e-commerce landing page. I have designed similar pages for fashion brands before and would love to help.

My approach:
1. Research your brand and competitors
2. Create a wireframe for approval
3. Design 2 concepts
4. Finalize and deliver

I can start today and deliver the first draft within 48 hours.

Best regards,
[Your Name]`;

export default function AssistantIndex() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState('');

  const handleGenerate = () => {
    setDraft(MOCK_DRAFT);
  };

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="সহায়ক — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('সহায়ক')}</h1>

      {/* AI inset */}
      <div className="mb-3">
        <VioletInset>
          <p className="text-[13px] text-ai font-bn">
            {t('AI সঙ্গী — আপনার ব্যক্তিগত সহায়ক। প্রস্তাব লিখুন, ক্লায়েন্টের সাথে কথা বলুন, দর ঠিক করুন।')}
          </p>
        </VioletInset>
      </div>

      {/* Situation chips */}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">
        {SITUATIONS.map((s, i) => (
          <SituationChip
            key={s}
            label={s}
            selected={selected === i}
            onClick={() => setSelected(selected === i ? null : i)}
          />
        ))}
      </div>

      {/* Input */}
      <div className="mb-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-border-rest bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted focus:border-ai focus:outline-none focus:ring-1 focus:ring-ai font-bn"
          placeholder={t('আপনার প্রয়োজনীয় তথ্য লিখুন…')}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!input && selected === null}
        className="mb-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-ai text-[14px] font-bold text-white active:scale-[0.98] disabled:opacity-50 font-bn"
      >
        {t('খসড়া তৈরি করুন')}
      </button>

      {/* Draft result */}
      {draft && (
        <DraftResultCard
          draft={draft}
          onCopy={() => navigator.clipboard?.writeText(draft)}
        />
      )}
    </div>
  );
}
