import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useI18n } from '../../lib/i18n';
import { StatTile } from '../../components/ui/StatTile';
import { FAB } from '../../components/ui/FAB';
import StateFilter from '../../components/work/StateFilter';
import JobCard from '../../components/work/JobCard';

/**
 * Screen 15 — Pipeline · কাজ পাইপলাইন
 * The operational core. Stat tiles + state filter + job cards + FAB.
 */

const MOCK = {
  stats: [
    { label: 'সম্ভাবনা', value: '৫' },
    { label: 'প্রস্তাব', value: '৩' },
    { label: 'চলছে', value: '২' },
    { label: 'সম্পন্ন', value: '১২' },
  ],
  jobs: [
    { id: 1, title: 'E-commerce landing page', client: 'Rahim Corp', deadline: 'আজ রাত', status: 'active' },
    { id: 2, title: 'Logo design package', client: 'Fatima Traders', deadline: '৩ দিন', status: 'applied' },
    { id: 3, title: 'WordPress blog setup', client: 'Kamal & Sons', deadline: '৭ দিন', status: 'prospect' },
    { id: 4, title: 'Social media banners', client: 'Nusrat Fashions', deadline: 'গতকাল', status: 'active' },
    { id: 5, title: 'Product photo editing', client: 'Sohel Electronics', deadline: '৫ দিন', status: 'applied' },
  ],
};

export default function Pipeline() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? MOCK.jobs
    : MOCK.jobs.filter((j) => j.status === filter);

  return (
    <div className="px-4 pb-24 pt-2">
      <Head title="কাজ — ইজি রাইজ" />

      {/* Stat tiles */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        {MOCK.stats.map((s) => (
          <StatTile key={s.label} label={t(s.label)} value={s.value} />
        ))}
      </div>

      {/* State filter */}
      <div className="mb-3">
        <StateFilter value={filter} onChange={setFilter} />
      </div>

      {/* Job cards */}
      <div className="space-y-2">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {!filtered.length && (
        <div className="py-12 text-center text-[14px] text-muted font-bn">
          {t('এই অবস্থায় কোনো কাজ নেই')}
        </div>
      )}

      {/* FAB */}
      <FAB onClick={() => {}} />
    </div>
  );
}
