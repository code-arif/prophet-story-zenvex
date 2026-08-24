import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { StackedBar } from '../../components/ui/StackedBar';
import { WarnStrip } from '../../components/ui/WarnStrip';
import { BottomSheet } from '../../components/ui/BottomSheet';

/**
 * Screen 17 — Scope Guard · স্কোপ গার্ড
 * Split card + stacked bar + amber strip + add sheet.
 */

const MOCK = {
  job: { id: 1, title: 'E-commerce landing page', client: 'Rahim Corp' },
  scope: [
    { item: 'Hero section', agreed: 1, actual: 1 },
    { item: 'Product grid', agreed: 8, actual: 12 },
    { item: 'Testimonials', agreed: 3, actual: 3 },
    { item: 'Footer + CTA', agreed: 1, actual: 2 },
  ],
  total: { agreed: 13, actual: 18 },
};

export default function ScopeGuard({ jobId }) {
  const { t } = useI18n();
  const [showSheet, setShowSheet] = useState(false);
  const { job, scope, total } = MOCK;

  const overPct = total.agreed > 0
    ? Math.round(((total.actual - total.agreed) / total.agreed) * 100)
    : 0;
  const isOver = total.actual > total.agreed;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="স্কোপ গার্ড — ইজি রাইজ" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link href={`/work/jobs/${jobId}`} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
          <ArrowLeft className="size-5 text-ink" />
        </Link>
        <div>
          <h1 className="text-[18px] font-bold text-ink font-bn">{t('স্কোপ গার্ড')}</h1>
          <p className="text-[12px] text-muted font-bn">{job.title}</p>
        </div>
      </div>

      {/* Split card */}
      <div className="glass mb-3 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-[12px] text-muted font-bn">{t('সম্মত')}</p>
            <p className="text-[28px] font-bold text-brand font-bn">{total.agreed}</p>
          </div>
          <div className="text-center">
            <p className="text-[12px] text-muted font-bn">{t('প্রকৃত')}</p>
            <p className={cn('text-[28px] font-bold font-bn', isOver ? 'text-warn' : 'text-success')}>
              {total.actual}
            </p>
          </div>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mb-3">
        <StackedBar
          segments={[
            { pct: (total.agreed / total.actual) * 100, color: 'bg-brand' },
            { pct: isOver ? ((total.actual - total.agreed) / total.actual) * 100 : 0, color: 'bg-warn' },
          ]}
        />
      </div>

      {/* Amber strip if over */}
      {isOver && (
        <div className="mb-3">
          <WarnStrip message={t(`স্কোপ ${overPct}% বেশি হয়েছে`)} />
        </div>
      )}

      {/* Scope items */}
      <div className="mb-3 space-y-2">
        {scope.map((s, i) => (
          <div key={i} className="glass-row flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-ink font-bn">{t(s.item)}</p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-bold text-ink font-bn">{s.actual}</span>
              <span className="text-[12px] text-muted font-bn"> / {s.agreed}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(29,111,242,0.25)] active:scale-95"
      >
        <Plus className="size-6" />
      </button>

      {/* Add sheet */}
      <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
        <div className="p-4">
          <p className="mb-4 text-[18px] font-bold text-ink font-bn">{t('নতুন স্কোপ যোগ করুন')}</p>
          <input
            type="text"
            placeholder={t('স্কোপের নাম')}
            className="mb-3 h-12 w-full rounded-2xl border border-border-rest bg-white px-4 text-[14px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-bn"
          />
          <button className="flex h-12 w-full items-center justify-center rounded-[14px] bg-brand text-[14px] font-bold text-white active:scale-[0.98] font-bn">
            {t('যোগ করুন')}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
