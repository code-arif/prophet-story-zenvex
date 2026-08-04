import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatusChip } from './StatusChip';
import { ProgressBar } from './ProgressBar';

const TINTS = {
  blue: 'bg-learn-primary-tint text-learn-primary',
  green: 'bg-learn-success-tint text-learn-success',
  indigo: 'bg-[#EEF1FF] text-[#6366F1]',
  teal: 'bg-[#DDF3EC] text-[#0D9488]',
  violet: 'bg-learn-ai-tint text-learn-ai',
  amber: 'bg-learn-warn-tint text-learn-warn',
  grey: 'bg-learn-structure text-learn-muted',
};

/**
 * White feature tile (Stitch design) used by the Learn, Practice and AI hubs.
 * layout="row"  → full-width: icon square + title/subtitle + optional progress + chevron
 * layout="grid" → 2-col tile: icon square, title, subtitle, status chip
 */
export function HubTile({
  href,
  icon: Icon,
  tint = 'blue',
  title,
  subtitle,
  progress,
  badge,
  badgeTone = 'grey',
  layout = 'row',
  className,
}) {
  const tintClass = TINTS[tint] || TINTS.blue;

  const inner = (
    <div
      className={cn(
        'flex rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)] transition-all duration-150 active:scale-[0.99]',
        layout === 'grid'
          ? badge
            ? 'h-[120px] flex-col items-start justify-between p-4'
            : 'h-[120px] flex-col items-start justify-start gap-3 p-4'
          : 'items-center gap-3 p-4',
        className
      )}
    >
      {layout === 'row' ? (
        <>
          <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', tintClass)}>
            <Icon className="size-6" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-[15px] font-bold text-learn-ink">{title}</span>
              {badge && <StatusChip tone={badgeTone}>{badge}</StatusChip>}
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-learn-muted">{subtitle}</span>
            {typeof progress === 'number' && <ProgressBar value={progress} className="mt-2.5" />}
          </span>
          <ChevronRight className="size-5 shrink-0 text-learn-muted" />
        </>
      ) : (
        <>
          <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', tintClass)}>
            <Icon className="size-5" strokeWidth={2} />
          </span>
          <span className="w-full">
            <span className="block truncate text-[15px] font-bold text-learn-ink">{title}</span>
            <span className="mt-0.5 block truncate text-[12px] text-learn-muted">{subtitle}</span>
          </span>
          {badge && <StatusChip tone={badgeTone}>{badge}</StatusChip>}
        </>
      )}
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}
