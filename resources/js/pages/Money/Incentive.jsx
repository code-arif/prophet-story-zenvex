import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { TodoChip } from '../../components/ui/TodoChip';
import { cn } from '../../lib/utils';

/**
 * Screen 27 — Incentive Calculator · ইনসেন্টিভ হিসাব
 * 6 questions → green/amber result + TODO rate chip.
 */

const QUESTIONS = [
  '৬০+ দিন ধারাবাহিক?',
  'মাসিক আয় ৳৩০,০০০+?',
  'ক্লায়েন্ট রেটিং ৪.৫+?',
  'প্রোফাইল ৯০%+ সম্পূর্ণ?',
  'অন্তত ৩টি নতুন ক্লায়েন্ট?',
  'সপ্তাহে ৩০+ ঘণ্টা কাজ?',
];

export default function IncentiveCalc() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState({});
  const answered = Object.values(answers).filter(Boolean).length;

  const verdict = answered >= 5 ? 'success' : answered >= 3 ? 'warn' : 'default';

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="ইনসেন্টিভ হিসাব — ইজি রাইজ" />

      <h1 className="mb-1 text-[22px] font-bold text-ink font-bn">{t('ইনসেন্টিভ হিসাব')}</h1>
      <p className="mb-4 text-[13px] text-muted font-bn">
        {answered}/{QUESTIONS.length} {t('শর্ত পূরণ')}
      </p>

      {/* Questions */}
      <div className="mb-3 space-y-2">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="glass-row px-4 py-3">
            <div className="mb-2 flex items-start gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                {i + 1}
              </span>
              <p className="text-[14px] font-semibold text-ink font-bn">{t(q)}</p>
            </div>
            <div className="flex gap-2 pl-8">
              <button
                onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}
                className={cn(
                  'flex-1 rounded-full py-2 text-[13px] font-bold transition-all active:scale-95 font-bn',
                  answers[i] === true ? 'bg-success text-white' : 'glass-row text-ink'
                )}
              >
                {t('হ্যাঁ')}
              </button>
              <button
                onClick={() => setAnswers((p) => ({ ...p, [i]: false }))}
                className={cn(
                  'flex-1 rounded-full py-2 text-[13px] font-bold transition-all active:scale-95 font-bn',
                  answers[i] === false ? 'bg-warn text-white' : 'glass-row text-ink'
                )}
              >
                {t('না')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className={cn(
        'glass px-4 py-4',
        verdict === 'success' && 'border border-success/30',
        verdict === 'warn' && 'border border-warn/30'
      )}>
        <div className="text-center">
          <p className="text-[12px] text-muted font-bn">{t('আপনার অবস্থা')}</p>
          <p className={cn(
            'text-[18px] font-bold font-bn',
            verdict === 'success' ? 'text-success' : verdict === 'warn' ? 'text-warn' : 'text-muted'
          )}>
            {verdict === 'success' ? 'ইনসেন্টিভের জন্য যোগ্য' :
             verdict === 'warn' ? 'আরেকটু বাকি' :
             'শুরু করুন'}
          </p>
          {verdict === 'warn' && (
            <div className="mt-2">
              <TodoChip />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
