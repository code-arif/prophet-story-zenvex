import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

/**
 * Step rail — easy rise Stitch design.
 * Vertical rail: 32px circles + 2px connectors.
 * States: completed (green tick), current (azure + glow), pending (hollow).
 * Used in Rise Ladder, Payments Due ladder.
 */
export function StepRail({ steps = [], className }) {
  return (
    <div className={cn('flex flex-col', className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const state = step.state || 'pending'; // 'completed' | 'current' | 'pending'

        return (
          <div key={i} className="flex gap-3">
            {/* Rail column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  state === 'completed' && 'border-success bg-success text-white',
                  state === 'current' && 'border-brand bg-brand/10 text-brand shadow-[0_0_12px_rgba(29,111,242,0.3)]',
                  state === 'pending' && 'border-outline-inactive bg-transparent text-muted'
                )}
              >
                {state === 'completed' ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  <span className="text-[12px] font-bold font-bn">{i + 1}</span>
                )}
              </div>
              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px]',
                    state === 'completed' ? 'bg-success' : 'bg-border-rest'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-[15px] font-semibold font-bn',
                  state === 'pending' ? 'text-muted' : 'text-ink'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-[13px] text-muted font-bn">{step.description}</p>
              )}
              {step.value && (
                <p className={cn(
                  'text-[13px] font-bold font-bn mt-0.5',
                  step.state === 'completed' ? 'text-success' : step.state === 'current' ? 'text-brand' : 'text-muted'
                )}>
                  {step.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
