import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import AgingBuckets from '../../components/work/AgingBuckets';
import PaymentLadder from '../../components/work/PaymentLadder';
import { EmptyState } from '../../components/ui/EmptyState';

/**
 * Screen 19 — Payments Due · বকেয় পেমেন্ট
 * Total card + aging buckets + expandable ladders + empty state.
 */

const MOCK = {
  totalDue: '৪২,৫০০',
  buckets: [
    { label: 'চলতি', amount: '১৫,০০০' },
    { label: '৩০ দিন', amount: '১২,৫০০' },
    { label: '৬০ দিন', amount: '১০,০০০' },
    { label: '৯০+', amount: '৫,০০০' },
  ],
  payments: [
    { client: 'Rahim Corp', deadline: 'আজ', amount: '১৫,০০০', status: 'overdue' },
    { client: 'Fatima Traders', deadline: '৩ দিন', amount: '১২,৫০০', status: 'active' },
    { client: 'Kamal & Sons', deadline: '১৫ দিন', amount: '১০,০০০', status: 'active' },
    { client: 'Nusrat Fashions', deadline: '৩০ দিন', amount: '৫,০০০', status: 'active' },
  ],
};

export default function PaymentsDue() {
  const { t } = useI18n();
  const { totalDue, buckets, payments } = MOCK;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="বকেয় পেমেন্ট — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('বকেয় পেমেন্ট')}</h1>

      {/* Total card */}
      <div className="glass mb-3 flex flex-col items-center px-4 py-5">
        <p className="text-[13px] text-muted font-bn">{t('মোট বকেয়')}</p>
        <p className="text-[32px] font-bold text-warn font-bn">৳{totalDue}</p>
      </div>

      {/* Aging buckets */}
      <div className="mb-3">
        <AgingBuckets buckets={buckets} />
      </div>

      {/* Payment ladder */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('বিস্তারিত')}</p>
        <PaymentLadder payments={payments} />
      </div>
    </div>
  );
}
