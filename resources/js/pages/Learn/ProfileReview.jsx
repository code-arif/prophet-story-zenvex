import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import ComparisonBlock from '../../components/learn/ComparisonBlock';

/**
 * Screen 13 — Profile Review · প্রোফাইল পর্যালোচনা
 * 3 textareas → comparison blocks + amber warnings.
 */

const MOCK = {
  fields: [
    { label: 'টাইটেল', before: 'Graphic Designer', after: 'Senior Graphic Designer | Brand Identity Specialist' },
    { label: 'বিবরণ', before: 'I am a graphic designer.', after: 'I help startups build memorable brands through logo design, brand identity, and visual systems. 50+ projects delivered across 12 countries.' },
    { label: 'স্কিল', before: 'Photoshop, Illustrator', after: 'Brand Identity, Logo Design, Figma, Adobe Creative Suite, Typography, Color Theory' },
  ],
  warnings: [
    'টাইটেলে নির্দিষ্ট কীওয়ার্ড যোগ করুন',
    'বিবরণে সংখ্যা ও ফলাফল উল্লেখ করুন',
  ],
};

export default function ProfileReview() {
  const { t } = useI18n();
  const [generated, setGenerated] = useState(false);
  const [inputs, setInputs] = useState({ title: '', description: '', skills: '' });

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="প্রোফাইল পর্যালোচনা — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('প্রোফাইল পর্যালোচনা')}</h1>

      {!generated ? (
        <div>
          <p className="mb-4 text-[14px] text-muted font-bn">
            {t('আপনার প্রোফাইলের টেক্সট দিন, AI উন্নত সংস্করণ তৈরি করবে')}
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-ink font-bn">{t('টাইটেল')}</label>
              <input
                type="text"
                value={inputs.title}
                onChange={(e) => setInputs((p) => ({ ...p, title: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
                placeholder={t('আপনার টাইটেল')}
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-ink font-bn">{t('বিবরণ')}</label>
              <textarea
                value={inputs.description}
                onChange={(e) => setInputs((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-border-rest bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
                placeholder={t('আপনার সম্পর্কে লিখুন')}
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-semibold text-ink font-bn">{t('স্কিল')}</label>
              <input
                type="text"
                value={inputs.skills}
                onChange={(e) => setInputs((p) => ({ ...p, skills: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
                placeholder={t('কমা দিয়ে আলাদা করুন')}
              />
            </div>
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-ai text-[14px] font-bold text-white active:scale-[0.98] font-bn"
          >
            {t('AI পর্যালোচনা করুন')}
          </button>
        </div>
      ) : (
        <div>
          {/* Comparison blocks */}
          <div className="mb-3 space-y-3">
            {MOCK.fields.map((f, i) => (
              <ComparisonBlock key={i} {...f} hasWarning={i < MOCK.warnings.length} />
            ))}
          </div>

          {/* Warnings */}
          <div className="mb-3 glass px-4 py-3">
            <p className="mb-2 text-[13px] font-bold text-warn font-bn">{t('পরামর্শ')}</p>
            {MOCK.warnings.map((w, i) => (
              <p key={i} className="text-[12px] text-ink font-bn">• {t(w)}</p>
            ))}
          </div>

          <button
            onClick={() => setGenerated(false)}
            className="flex h-12 w-full items-center justify-center rounded-[14px] border border-border-rest text-[14px] font-bold text-ink active:scale-[0.98] font-bn"
          >
            {t('আবার চেষ্টা করুন')}
          </button>
        </div>
      )}
    </div>
  );
}
