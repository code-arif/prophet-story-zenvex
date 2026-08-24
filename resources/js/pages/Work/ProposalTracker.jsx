import React from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import ProposalFunnel from '../../components/work/ProposalFunnel';
import { StatTile } from '../../components/ui/StatTile';

/**
 * Screen 18 — Proposal Tracker · প্রস্তাব ট্র্যাকার
 * Funnel + group breakdown + low-data variant.
 */

const MOCK = {
  funnel: { sent: 38, viewed: 9, shortlisted: 4, hired: 1 },
  groups: [
    { label: 'গ্রাফিক ডিজাইন', sent: 18, hired: 1 },
    { label: 'ওয়েব ডেভেলপমেন্ট', sent: 12, hired: 0 },
    { label: 'কন্টেন্ট রাইটিং', sent: 8, hired: 0 },
  ],
  recent: [
    { id: 1, title: 'Logo design', client: 'Fatima Traders', status: 'shortlisted', days: 2 },
    { id: 2, title: 'Landing page', client: 'Rahim Corp', status: 'viewed', days: 1 },
    { id: 3, title: 'Blog posts', client: 'Kamal & Sons', status: 'sent', days: 0 },
  ],
};

export default function ProposalTracker() {
  const { t } = useI18n();
  const { funnel, groups, recent } = MOCK;

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="প্রস্তাব ট্র্যাকার — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('প্রস্তাব ট্র্যাকার')}</h1>

      {/* Summary stats */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        <StatTile label={t('পাঠানো')} value={String(funnel.sent)} />
        <StatTile label={t('দেখা হয়েছে')} value={String(funnel.viewed)} />
        <StatTile label={t('ছোট তালিকা')} value={String(funnel.shortlisted)} />
        <StatTile label={t('নিয়োগ')} value={String(funnel.hired)} />
      </div>

      {/* Funnel */}
      <div className="mb-3">
        <ProposalFunnel {...funnel} />
      </div>

      {/* Group breakdown */}
      <div className="mb-3 glass px-4 py-4">
        <p className="mb-3 text-[14px] font-bold text-ink font-bn">{t('বিভাগ অনুযায়ী')}</p>
        <div className="space-y-2">
          {groups.map((g, i) => (
            <div key={i} className="flex items-center justify-between text-[13px] font-bn">
              <span className="text-ink">{t(g.label)}</span>
              <span className="text-muted">{g.sent} {t('পাঠানো')} · <span className="font-bold text-brand">{g.hired} {t('নিয়োগ')}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent proposals */}
      <div className="mb-3">
        <p className="mb-2 text-[15px] font-bold text-ink font-bn">{t('সাম্প্রতিক')}</p>
        <div className="space-y-2">
          {recent.map((r) => (
            <div key={r.id} className="glass-row flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink truncate font-bn">{r.title}</p>
                <p className="text-[12px] text-muted font-bn">{r.client}</p>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-muted font-bn">{r.days} {t('দিন আগে')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
