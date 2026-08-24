import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import QuestionCard from '../../components/work/QuestionCard';
import VerdictBand from '../../components/work/VerdictBand';

/**
 * Screen 21 — Client Screener · ক্লায়েন্ট স্ক্রিনার
 * 12 questions → verdict band + rule list.
 */

const QUESTIONS = [
  'প্রোফাইল ছবি আছে?',
  'পেমেন্ট হিস্ট্রি আছে?',
  'ইমেইল যাচাই হয়েছে?',
  'ফোন নম্বর যাচাই আছে?',
  'অন্তত ৩টি রিভিউ আছে?',
  'রেটিং ৪.০ বা তার বেশি?',
  'বাজেট স্পষ্ট?',
  'ডেডলাইন যুক্তিসঙ্গত?',
  'স্কোপ স্পষ্ট?',
  'কমিউনিকেশন ভালো?',
  'নমুনা কাজ দেখেছেন?',
  'আগে কাজ করেছেন?',
];

const MOCK = {
  verdict: 'caution',
  ruleList: [
    { rule: 'বিনা রিভিউ ক্লায়েন্ট — সতর্ক', status: 'warn' },
    { rule: 'পেমেন্ট হিস্ট্রি নেই — ঝুঁকি', status: 'danger' },
    { rule: 'স্পষ্ট স্কোপ — ভালো', status: 'success' },
  ],
};

export default function ClientScreener() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState({});
  const { verdict, ruleList } = MOCK;

  const answered = Object.keys(answers).length;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="ক্লায়েন্ট স্ক্রিনার — ইজি রাইজ" />

      <h1 className="mb-1 text-[22px] font-bold text-ink font-bn">{t('ক্লায়েন্ট স্ক্রিনার')}</h1>
      <p className="mb-4 text-[13px] text-muted font-bn">
        {answered}/{QUESTIONS.length} {t('প্রশ্নের উত্তর দেওয়া হয়েছে')}
      </p>

      {/* Verdict */}
      <div className="mb-3">
        <VerdictBand verdict={verdict} />
      </div>

      {/* Questions */}
      <div className="mb-3 space-y-2">
        {QUESTIONS.map((q, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={q}
            value={answers[i]}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [i]: v }))}
          />
        ))}
      </div>

      {/* Rule list */}
      <div className="mb-3 glass px-4 py-4">
        <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('নিয়ম')}</p>
        <div className="space-y-2">
          {ruleList.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] font-bn">
              <div className={`size-2 rounded-full ${
                r.status === 'success' ? 'bg-success' : r.status === 'warn' ? 'bg-warn' : 'bg-danger'
              }`} />
              <span className="text-ink">{t(r.rule)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
