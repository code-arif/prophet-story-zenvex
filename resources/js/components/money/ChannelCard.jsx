import React from 'react';
import { useI18n } from '../../lib/i18n';
import { cn } from '../../lib/utils';

/**
 * ChannelCard — expandable payment channel card.
 */
export default function ChannelCard({ channel, expanded, onToggle }) {
  const { t } = useI18n();

  return (
    <div className={cn('glass overflow-hidden', expanded && 'ring-2 ring-brand/20')}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left active:scale-[0.98]"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand text-[14px]">
          {channel.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink font-bn">{t(channel.name)}</p>
          <p className="text-[12px] text-muted font-bn">{channel.status}</p>
        </div>
        <span className={cn('text-[13px] transition-transform', expanded ? 'rotate-90' : '')}>▶</span>
      </button>
      {expanded && (
        <div className="border-t border-border-rest px-4 py-3">
          {channel.details?.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 text-[13px] font-bn">
              <span className="text-muted">{t(d.label)}</span>
              <span className="font-semibold text-ink">{t(d.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
