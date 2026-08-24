import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

/**
 * NextStepsCard — suggests next actions to advance on the ladder.
 */
export default function NextStepsCard({ steps = [] }) {
  const { t } = useI18n();

  if (!steps.length) return null;

  return (
    <div className="glass px-4 py-4">
      <p className="mb-3 text-[14px] font-semibold text-ink font-bn">
        {t('পরবর্তী ধাপ')}
      </p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <Link
            key={i}
            href={step.href}
            className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 transition-all active:scale-[0.98]"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
              {i + 1}
            </span>
            <span className="flex-1 text-[14px] font-semibold text-ink font-bn">
              {step.label}
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
