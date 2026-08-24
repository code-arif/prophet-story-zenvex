import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, GripVertical } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { StatusChip } from '../ui/StatusChip';

/**
 * JobCard — single job row in pipeline list.
 * Shows: grip handle, client name, job title, status chip, deadline, chevron.
 */
export default function JobCard({ job }) {
  const { t } = useI18n();

  return (
    <Link
      href={`/work/jobs/${job.id}`}
      className="glass-row flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]"
    >
      {/* Grip handle */}
      <div className="flex size-6 shrink-0 items-center justify-center text-outline-inactive">
        <GripVertical className="size-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink truncate font-bn">{job.title}</p>
        <div className="flex items-center gap-2 text-[12px] text-muted font-bn">
          <span>{job.client}</span>
          <span>·</span>
          <span>{job.deadline}</span>
        </div>
      </div>

      {/* Status + chevron */}
      <div className="flex items-center gap-2">
        <StatusChip status={job.status} />
        <ChevronRight className="size-4 shrink-0 text-muted" />
      </div>
    </Link>
  );
}
