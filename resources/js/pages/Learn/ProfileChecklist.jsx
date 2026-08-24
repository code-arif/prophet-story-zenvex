import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { cn } from '../../lib/utils';

/**
 * Screen 09 — Profile Checklist · প্রোফাইল চেকলিস্ট
 * ProgressBar + filter tabs + expandable rows with failLine.
 */

const GROUPS = ['সব', 'প্রোফাইল', 'পোর্টফোলিও', 'যোগাযোগ'];

const ITEMS = [
  { group: 'প্রোফাইল', label: 'প্রোফাইল ছবি', done: true, detail: 'পরিষ্কার ছবি আছে' },
  { group: 'প্রোফাইল', label: 'টাইটেল', done: true, detail: 'Graphic Designer' },
  { group: 'প্রোফাইল', label: 'বিবরণ', done: false, detail: 'বিস্তারিত লিখুন — কী করতে পারেন' },
  { group: 'প্রোফাইল', label: 'স্কিল ট্যাগ', done: true, detail: '৫টি স্কিল যোগ করা হয়েছে' },
  { group: 'পোর্টফোলিও', label: 'অন্তত ৩টি কাজ', done: false, detail: '১/৩ সম্পন্ন' },
  { group: 'পোর্টফোলিও', label: 'কেস স্টাডি', done: false, detail: 'প্রতিটি কাজের ব্যাখ্যা দিন' },
  { group: 'পোর্টফোলিও', label: 'ভিডিও ইন্ট্রো', done: false, detail: '৬০ সেকেন্ডের পরিচয়' },
  { group: 'যোগাযোগ', label: 'ইমেইল', done: true, detail: 'যাচাই হয়েছে' },
  { group: 'যোগাযোগ', label: 'ফোন নম্বর', done: true, detail: 'যাচাই হয়েছে' },
  { group: 'যোগাযোগ', label: 'প্রতিক্রিয়া সময়', done: false, detail: '২৪ ঘণ্টার মধ্যে উত্তর দিন' },
  { group: 'প্রোফাইল', label: 'ভাষা', done: true, detail: 'Bangla, English' },
  { group: 'পোর্টফোলিও', label: 'টেস্টিমোনিয়াল', done: false, detail: 'ক্লায়েন্টদের মতামত যোগ করুন' },
];

export default function ProfileChecklist() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('সব');
  const [expanded, setExpanded] = useState({});

  const filtered = filter === 'সব' ? ITEMS : ITEMS.filter((i) => i.group === filter);
  const doneCount = filtered.filter((i) => i.done).length;

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="প্রোফাইল চেকলিস্ট — ইজি রাইজ" />

      <h1 className="mb-4 text-[22px] font-bold text-ink font-bn">{t('প্রোফাইল চেকলিস্ট')}</h1>

      {/* Progress */}
      <div className="glass mb-3 px-4 py-4">
        <div className="mb-2 flex items-center justify-between text-[13px] font-bn">
          <span className="text-muted">{doneCount}/{filtered.length} {t('সম্পন্ন')}</span>
          <span className="font-bold text-ink">{Math.round((doneCount / filtered.length) * 100)}%</span>
        </div>
        <ProgressBar value={doneCount} max={filtered.length} />
      </div>

      {/* Filter tabs */}
      <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 font-bn',
              filter === g ? 'bg-brand text-white' : 'glass-row text-ink'
            )}
          >
            {t(g)}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item, i) => (
          <div key={i} className="glass-row overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left active:scale-[0.98]"
            >
              <div className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                item.done ? 'bg-success text-white' : 'border-2 border-outline-inactive text-muted'
              )}>
                {item.done ? '✓' : ''}
              </div>
              <span className={cn(
                'flex-1 text-[14px] font-semibold font-bn',
                item.done ? 'text-success' : 'text-ink'
              )}>
                {t(item.label)}
              </span>
              <span className={cn('text-[13px] transition-transform', expanded[i] ? 'rotate-90' : '')}>▶</span>
            </button>
            {expanded[i] && (
              <div className="border-t border-border-rest px-4 py-2 ml-9">
                <p className="text-[12px] text-muted font-bn">{t(item.detail)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
