import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * LadderRail — vertical step rail showing 4 stages.
 * Completed: filled circle + checkmark. Current: filled circle. Upcoming: hollow circle.
 */
export default function LadderRail({ currentStage = 1 }) {
  const stages = [
    { n: 1, label: 'শুরু' },
    { n: 2, label: 'প্রস্তুত' },
    { n: 3, label: 'কাজ চলছে' },
    { n: 4, label: 'ব্যবসা' },
  ];

  return (
    <div className="flex flex-col items-center gap-0">
      {stages.map((stage, i) => {
        const isCompleted = stage.n < currentStage;
        const isCurrent = stage.n === currentStage;
        const isUpcoming = stage.n > currentStage;

        return (
          <React.Fragment key={stage.n}>
            {/* Node */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-[13px] font-bold transition-all',
                  isCompleted && 'bg-brand text-white',
                  isCurrent && 'bg-brand text-white ring-4 ring-brand/20',
                  isUpcoming && 'border-2 border-outline-inactive bg-white text-muted'
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  stage.n
                )}
              </div>
              <span
                className={cn(
                  'text-[14px] font-semibold font-bn',
                  isCurrent ? 'text-ink' : 'text-muted'
                )}
              >
                {stage.label}
              </span>
            </div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <div
                className={cn(
                  'ml-4 h-6 w-0.5',
                  stage.n < currentStage ? 'bg-brand' : 'bg-border-rest'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
