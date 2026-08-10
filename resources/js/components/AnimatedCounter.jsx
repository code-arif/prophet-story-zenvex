import React from 'react';
import { toBnDigits } from '../lib/format';

/**
 * AnimatedCounter — counts from 0 to `value` over `duration` ms using
 * requestAnimationFrame (cubic ease-out). Renders the number in Bengali digits.
 *
 * Starts counting on mount. Wrap in <RevealOnScroll> for scroll-triggered
 * visibility — the counter runs while hidden, so by the time the reveal
 * animation finishes the number is near its final value (looks natural).
 *
 * Usage:
 *   <AnimatedCounter value={42} duration={700} />
 */
export function AnimatedCounter({ value = 0, duration = 600 }) {
  // Coerce to a finite number; anything non-numeric (null/undefined/NaN/
  // Bengali-digit strings) falls back to 0 so the UI never shows NaN.
  const target = Number(value);
  const safeValue = Number.isFinite(target) ? target : 0;

  const [display, setDisplay] = React.useState(0);
  const prevValue = React.useRef(0);

  React.useEffect(() => {
    if (safeValue === prevValue.current) {
      setDisplay(safeValue);
      return;
    }

    prevValue.current = safeValue;
    const startTime = performance.now();
    let frameId;

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplay(Math.round(safeValue * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [safeValue, duration]);

  return <span>{toBnDigits(display)}</span>;
}