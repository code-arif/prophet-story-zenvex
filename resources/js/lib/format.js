// Shared formatting helpers for the "Learn English" learner UI.
// Design system rule: numbers are stored/calculated in ASCII, and only
// converted to Bengali numerals at render time. Day boundaries use Asia/Dhaka.
// In the English UI language the formatters keep ASCII digits instead.

import { getLanguage } from './i18n';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert every ASCII digit in the input to a Bengali numeral (kept ASCII
 * when the app language is English). Accepts numbers or strings.
 */
export function toBnDigits(value) {
  if (value === null || value === undefined || value === '') return '';
  const s = String(value);
  if (getLanguage() === 'en') return s;
  return s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Format a "YYYY-MM-DD" date as dd/mm/yyyy: 2026-08-04 -> ০৪/০৮/২০২৬
 * (or 04/08/2026 in the English UI language).
 */
export function toBnDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).slice(0, 10).split('-');
  if (!y || !m || !d) return String(isoDate);
  if (getLanguage() === 'en') return `${d}/${m}/${y}`;
  return `${toBnDigits(d)}/${toBnDigits(m)}/${toBnDigits(y)}`;
}

/**
 * Today's date as "YYYY-MM-DD" in the Asia/Dhaka timezone (ISO, ASCII digits).
 */
export function todayInDhakaISO() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const map = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  return `${map.year}-${map.month}-${map.day}`;
}
