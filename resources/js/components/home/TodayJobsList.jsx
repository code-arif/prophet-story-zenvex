import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Clock, FileText } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * TodayJobsList — list of jobs due today or overdue.
 * Each row links to the job detail.
 */
export default function TodayJobsList({ jobs = [] }) {
  const { t } = useI18n();

  if (!jobs.length) {
    return (
      <div className="glass-row flex items-center gap-3 px-4 py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
          <FileText className="size-4" />
        </div>
        <p className="text-[14px] text-muted font-bn">
          {t('আজকে কোনো দায় নেই')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/work/jobs/${job.id}`}
          className="glass-row flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]"
        >
          {/* Status dot */}
          <div className={cn(
            'size-2.5 shrink-0 rounded-full',
            job.status === 'overdue' ? 'bg-warn' : 'bg-brand'
          )} />

          {/* Job info */}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink truncate font-bn">
              {job.name}
            </p>
            <div className="flex items-center gap-1.5 text-[12px] text-muted font-bn">
              <Clock className="size-3" />
              <span>{job.deadline}</span>
            </div>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted" />
        </Link>
      ))}
    </div>
  );
}
