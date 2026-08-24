import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * Screen 29 — Income Proof · আয়ের প্রমাণ
 * Setup → A4 sheet with mandatory footer + print button.
 */

export default function IncomeProof() {
  const { t } = useI18n();
  const [phase, setPhase] = useState('setup'); // 'setup' | 'preview'

  const [form, setForm] = useState({
    name: '',
    address: '',
    purpose: '',
    period: '',
  });

  const handleGenerate = () => {
    if (!form.name || !form.purpose) return;
    setPhase('preview');
  };

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="আয়ের প্রমাণ — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('আয়ের প্রমাণ')}</h1>

      {phase === 'setup' ? (
        <div>
          <p className="mb-4 text-[14px] text-muted font-bn">
            {t('আয়ের প্রমাণ তৈরি করতে নিচের তথ্য দিন')}
          </p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder={t('পুরো নাম')}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
            />
            <input
              type="text"
              placeholder={t('ঠিকানা')}
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
            />
            <input
              type="text"
              placeholder={t('উদ্দেশ্য (যেমন: ভিসা আবেদন)')}
              value={form.purpose}
              onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
            />
            <input
              type="text"
              placeholder={t('সময়কাল (যেমন: জানুয়ারি ২০২৬ — আগস্ট ২০২৬)')}
              value={form.period}
              onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!form.name || !form.purpose}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-brand text-[14px] font-bold text-white active:scale-[0.98] disabled:opacity-50 font-bn"
          >
            {t('প্রিভিউ দেখুন')}
          </button>
        </div>
      ) : (
        <div>
          {/* A4 preview */}
          <div className="glass mb-4 rounded-2xl border border-border-rest p-6" style={{ aspectRatio: '210/297' }}>
            <div className="border-b border-ink/20 pb-3 mb-3">
              <p className="text-[18px] font-bold text-ink text-center font-bn">আয়ের প্রমাণ</p>
              <p className="text-[12px] text-muted text-center font-bn">Income Proof Certificate</p>
            </div>

            <div className="space-y-2 text-[13px] text-ink font-bn">
              <p><span className="text-muted">নাম:</span> {form.name}</p>
              <p><span className="text-muted">ঠিকানা:</span> {form.address || '—'}</p>
              <p><span className="text-muted">উদ্দেশ্য:</span> {form.purpose}</p>
              <p><span className="text-muted">সময়কাল:</span> {form.period || '—'}</p>
            </div>

            <div className="mt-4 border-t border-ink/20 pt-3">
              <p className="text-[13px] text-ink font-bn">
                আমি প্রমাণ করছি যে উপরের তথ্যগুলো সত্য এবং আমার আয়ের হিসাবের ভিত্তিতে তৈরি।
              </p>
              <div className="mt-4 flex justify-between text-[12px] text-muted font-bn">
                <span>স্বাক্ষর: _____________</span>
                <span>তারিখ: _____________</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPhase('setup')}
              className="flex h-12 flex-1 items-center justify-center rounded-[14px] border border-border-rest text-[14px] font-bold text-ink active:scale-[0.98] font-bn"
            >
              {t('ফিরে যান')}
            </button>
            <button
              onClick={() => window.print()}
              className="flex h-12 flex-1 items-center justify-center rounded-[14px] bg-brand text-[14px] font-bold text-white active:scale-[0.98] font-bn"
            >
              {t('প্রিন্ট করুন')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
