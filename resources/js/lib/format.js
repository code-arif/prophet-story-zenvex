// Shared formatting helpers for the "Learn English" learner UI.
// Design system rule: numbers are stored/calculated in ASCII, and only
// converted to Bengali numerals at render time. Day boundaries use Asia/Dhaka.

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert every ASCII digit in the input to a Bengali numeral.
 * Accepts numbers or strings (e.g. "12", "০৭:৩০", 123).
 */
export function toBnDigits(value) {
  if (value === null || value === undefined || value === '') return '';
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Format a "YYYY-MM-DD" date as Bengali numerals: 2026-08-04 -> ০৪/০৮/২০২৬
 */
export function toBnDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).slice(0, 10).split('-');
  if (!y || !m || !d) return String(isoDate);
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
