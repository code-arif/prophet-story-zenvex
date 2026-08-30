import React from 'react';
import { CheckCircle2, Clock, Navigation, Wrench, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'pending', label: 'রিকোয়েস্টেড', icon: Clock },
  { key: 'accepted', label: 'কনফার্মড', icon: ShieldCheck },
  { key: 'en_route', label: 'অন রুট', icon: Navigation },
  { key: 'in_progress', label: 'কাজ চলছে', icon: Wrench },
  { key: 'completed', label: 'সম্পন্ন', icon: CheckCircle2 },
];

const STATUS_ORDER = {
  pending: 1,
  accepted: 2,
  en_route: 3,
  in_progress: 4,
  completed: 5,
};

export default function StatusStepper({ currentStatus, cancellationReason = null }) {
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'declined';
  const currentStepNumber = STATUS_ORDER[currentStatus] || 1;

  if (isCancelled) {
    return (
      <div className="bg-[#FF6F3C]/10 border border-[#FF6F3C]/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-[#FF6F3C] font-bold text-sm">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            {currentStatus === 'cancelled' ? 'সার্ভিস রিকোয়েস্টটি বাতিল করা হয়েছে (Cancelled)' : 'সার্ভিস রিকোয়েস্টটি প্রত্যাখ্যান করা হয়েছে (Declined)'}
          </span>
        </div>

        {cancellationReason && (
          <p className="text-xs text-slate-700 bg-white/60 p-2.5 rounded-xl border border-[#FF6F3C]/20 font-medium">
            <span className="font-bold text-[#37474F]">কারণ:</span> {cancellationReason}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Progress Stepper Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>

        {/* Active Filled Progress Line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#00B894] z-0 transition-all duration-300"
          style={{
            width: `${((currentStepNumber - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        ></div>

        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isDone = stepNum <= currentStepNumber;
          const isCurrent = stepNum === currentStepNumber;
          const IconComp = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                  isCurrent
                    ? 'bg-[#00B894] text-white ring-4 ring-[#00B894]/25 scale-110'
                    : isDone
                    ? 'bg-[#00B894] text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold text-center ${
                  isCurrent ? 'text-[#00B894]' : isDone ? 'text-[#37474F]' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
