import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import MonthHeader from '../../components/money/MonthHeader';
import LedgerRow from '../../components/money/LedgerRow';
import { BottomSheet } from '../../components/ui/BottomSheet';

/**
 * Screen 23 — Income Ledger · আয়ের হিসাব
 * Month headers + ledger rows + add bottom sheet.
 */

const MOCK = {
  months: [
    {
      name: 'আগস্ট ২০২৬',
      total: '৩৮,০০০',
      entries: [
        { label: 'Rahim Corp — Landing page', date: '১৫ আগ', amount: '১৫,০০০', type: 'income' },
        { label: 'Fatima Traders — Logo', date: '১০ আগ', amount: '১২,৫০০', type: 'income' },
        { label: 'Fiverr commission', date: '১২ আগ', amount: '১,৫০০', type: 'expense' },
        { label: 'Kamal & Sons — Blog', date: '০৫ আগ', amount: '১০,০০০', type: 'income' },
      ],
    },
    {
      name: 'জুলাই ২০২৬',
      total: '৩১,০০০',
      entries: [
        { label: 'Nusrat Fashions — Banners', date: '২৮ জুল', amount: '৮,০০০', type: 'income' },
        { label: 'Sohel Electronics — Edit', date: '২০ জুল', amount: '১২,০০০', type: 'income' },
        { label: 'Upwork fee', date: '২২ জুল', amount: '২,০০০', type: 'expense' },
        { label: 'Kamal & Sons — Blog', date: '১৫ জুল', amount: '১০,০০০', type: 'income' },
      ],
    },
    {
      name: 'জুন ২০২৬',
      total: '৪২,০০০',
      entries: [
        { label: 'Rahim Corp — E-com', date: '২৫ জুন', amount: '২০,০০০', type: 'income' },
        { label: 'Fatima Traders — Brand', date: '১৮ জুন', amount: '১৫,০০০', type: 'income' },
        { label: 'Payoneer fee', date: '২০ জুন', amount: '২,০০০', type: 'expense' },
        { label: 'Nusrat Fashions', date: '১০ জুন', amount: '৯,০০০', type: 'income' },
      ],
    },
  ],
};

export default function Ledger() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState({ 0: true });
  const [showSheet, setShowSheet] = useState(false);
  const { months } = MOCK;

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="আয়ের হিসাব — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('আয়ের হিসাব')}</h1>

      <div className="space-y-2">
        {months.map((m, i) => (
          <div key={i}>
            <MonthHeader
              month={m.name}
              total={m.total}
              expanded={!!expanded[i]}
              onToggle={() => toggle(i)}
            />
            {expanded[i] && (
              <div className="mt-1 space-y-1.5 pl-2">
                {m.entries.map((e, j) => (
                  <LedgerRow key={j} entry={e} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] active:scale-95"
      >
        +
      </button>

      {/* Add sheet */}
      <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
        <div className="p-4">
          <p className="mb-4 text-[18px] font-bold text-ink font-bn">{t('নতুন এন্ট্রি')}</p>
          <input
            type="text"
            placeholder={t('বিবরণ')}
            className="mb-3 h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
          />
          <input
            type="number"
            placeholder={t('পরিমাণ')}
            className="mb-3 h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
          />
          <div className="mb-3 flex gap-2">
            <button className="flex-1 rounded-full bg-success py-2.5 text-[13px] font-bold text-white font-bn">
              {t('আয়')}
            </button>
            <button className="flex-1 rounded-full bg-warn py-2.5 text-[13px] font-bold text-white font-bn">
              {t('খরচ')}
            </button>
          </div>
          <button className="flex h-12 w-full items-center justify-center rounded-[14px] bg-brand text-[14px] font-bold text-white active:scale-[0.98] font-bn">
            {t('যোগ করুন')}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
