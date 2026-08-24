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

/**
 * Format money in integer paisa to display string.
 * e.g. formatMoney(1250000) → "৳১২,৫০০" (Bangla) or "৳12,500" (English).
 * Design rule: money is stored as integer paisa, displayed as taka with comma grouping.
 */
export function formatMoney(paisa, { currency = '৳', showDecimals = false } = {}) {
  if (paisa === null || paisa === undefined) return '';
  const taka = Math.abs(Number(paisa)) / 100;
  const formatted = showDecimals
    ? taka.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : taka.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const prefix = Number(paisa) < 0 ? '-' : '';
  const digits = getLanguage() === 'en' ? formatted : toBnDigits(formatted);
  return `${prefix}${currency}${digits}`;
}

/**
 * Format a date relative to today (Asia/Dhaka timezone).
 * Returns Bangla or English relative strings.
 */
export function formatRelative(isoDate) {
  if (!isoDate) return '';
  const today = todayInDhakaISO();
  const target = String(isoDate).slice(0, 10);

  if (target === today) return getLanguage() === 'en' ? 'Today' : 'আজ';

  const todayDate = new Date(today + 'T00:00:00+06:00');
  const targetDate = new Date(target + 'T00:00:00+06:00');
  const diffDays = Math.round((targetDate - todayDate) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return getLanguage() === 'en' ? 'Yesterday' : 'গতকাল';
  if (diffDays === 1) return getLanguage() === 'en' ? 'Tomorrow' : 'আগামীকাল';

  if (diffDays < -1) {
    const abs = Math.abs(diffDays);
    return getLanguage() === 'en'
      ? `${abs} days ago`
      : `${toBnDigits(abs)} দিন আগে`;
  }
  if (diffDays > 1) {
    return getLanguage() === 'en'
      ? `in ${diffDays} days`
      : `${toBnDigits(diffDays)} দিন বাকি`;
  }

  return toBnDate(isoDate);
}

/**
 * Format a date string in the user's preferred format.
 * "YYYY-MM-DD" → "DD MMM YYYY" in Bangla or English.
 */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = String(isoDate).slice(0, 10).split('-');
  if (!y || !m || !d) return String(isoDate);

  const monthsBn = ['জান','ফেব','মার','এপ্র','মে','জুন','জুল','আগ','সেপ','অক্ট','নভে','ডিসে'];
  const monthsEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const monthIndex = parseInt(m, 10) - 1;
  if (getLanguage() === 'en') {
    return `${d} ${monthsEn[monthIndex]} ${y}`;
  }
  return `${toBnDigits(d)} ${monthsBn[monthIndex]} ${toBnDigits(y)}`;
}
