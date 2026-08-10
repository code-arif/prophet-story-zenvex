import React from 'react';
import { cn } from '../lib/utils';

/**
 * Wraps children with a scroll-reveal animation. When the element enters
 * the viewport, it fades in with an upward slide + scale. Supports an
 * optional stagger delay so sibling tiles animate in sequence.
 *
 * Usage:
 *   <RevealOnScroll delay={120}>
 *     <div>...</div>
 *   </RevealOnScroll>
 */
export function RevealOnScroll({ children, delay = 0, className }) {
  const ref = React.useRef(null);
  const timerRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(el);
          timerRef.current = setTimeout(() => setVisible(true), delay);
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-300',
        visible ? 'reveal-visible' : 'reveal-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}