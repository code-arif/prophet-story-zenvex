import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MessageSquare, DollarSign, FileText } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';
import { StepRail } from '../../components/ui/StepRail';
import { StatusChip } from '../../components/ui/StatusChip';

/**
 * Screen 16 — Job Detail · কাজের বিবরণ
 * Header + step rail mini + 3 segments (details/scope/money) + sticky actions.
 */

const MOCK = {
  job: {
    id: 1,
    title: 'E-commerce landing page',
    client: 'Rahim Corp',
    status: 'active',
    deadline: 'আজ রাত ১০টা',
    amount: '১৫,০০০',
    description: 'A modern, responsive landing page for an online fashion store. Include hero section, product grid, testimonials, and footer.',
  },
  steps: [
    { n: 1, label: 'প্রস্তাব', done: true },
    { n: 2, label: 'নিশ্চিত', done: true },
    { n: 3, label: 'কাজ চলছে', done: false },
    { n: 4, label: 'ডেলিভারি', done: false },
    { n: 5, label: 'পেমেন্ট', done: false },
  ],
  scope: [
    { item: 'Hero section', done: true },
    { item: 'Product grid (8 items)', done: true },
    { item: 'Testimonials (3)', done: false },
    { item: 'Footer + CTA', done: false },
  ],
  payments: [
    { label: 'মোট', amount: '১৫,০০০' },
    { label: 'অগ্রিম', amount: '৭,৫০০' },
    { label: 'বাকি', amount: '৭,৫০০' },
  ],
};

const SEGMENTS = ['বিবরণ', 'স্কোপ', 'টাকা'];

export default function JobDetail({ jobId }) {
  const { t } = useI18n();
  const [seg, setSeg] = useState(0);
  const { job, steps, scope, payments } = MOCK;

  return (
    <div className="pb-24 pt-2">
      <Head title={`${job.title} — ইজি রাইজ`} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-bg-from to-bg-to/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/work" className="flex size-10 items-center justify-center rounded-full hover:bg-black/5">
            <ArrowLeft className="size-5 text-ink" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-ink truncate font-bn">{job.title}</p>
            <p className="text-[12px] text-muted font-bn">{job.client}</p>
          </div>
          <StatusChip status={job.status} />
        </div>
      </div>

      <div className="px-4">
        {/* Step rail */}
        <div className="glass mb-3 p-4">
          <StepRail steps={steps} />
        </div>

        {/* Segment tabs */}
        <div className="mb-3 flex gap-1 rounded-2xl bg-white/60 p-1">
          {SEGMENTS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeg(i)}
              className={cn(
                'flex-1 rounded-xl py-2 text-[13px] font-bold transition-all font-bn',
                seg === i ? 'bg-brand text-white' : 'text-muted'
              )}
            >
              {t(s)}
            </button>
          ))}
        </div>

        {/* Segment content */}
        {seg === 0 && (
          <div className="glass p-4">
            <p className="mb-2 text-[13px] text-muted font-bn">{t('বিবরণ')}</p>
            <p className="text-[14px] text-ink font-bn">{t(job.description)}</p>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-muted font-bn">
              <span>{t('ডেডলাইন')}:</span>
              <span className="font-semibold text-ink">{job.deadline}</span>
            </div>
          </div>
        )}

        {seg === 1 && (
          <div className="space-y-2">
            {scope.map((s, i) => (
              <div key={i} className="glass-row flex items-center gap-3 px-4 py-3">
                <div className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                  s.done ? 'bg-success text-white' : 'border-2 border-outline-inactive text-muted'
                )}>
                  {s.done ? '✓' : i + 1}
                </div>
                <span className={cn(
                  'text-[14px] font-bn',
                  s.done ? 'text-success line-through' : 'text-ink'
                )}>
                  {t(s.item)}
                </span>
              </div>
            ))}
          </div>
        )}

        {seg === 2 && (
          <div className="glass p-4 space-y-3">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[14px] text-muted font-bn">{t(p.label)}</span>
                <span className="text-[16px] font-bold text-ink font-bn">৳{p.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-4">
        <div className="glass flex gap-2 p-3">
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-brand text-[14px] font-bold text-white active:scale-[0.98] font-bn">
            <MessageSquare className="size-4" />
            {t('ক্লায়েন্টের সাথে কথা বলুন')}
          </button>
          <button className="flex size-12 items-center justify-center rounded-[14px] bg-success text-white active:scale-[0.98]">
            <FileText className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
