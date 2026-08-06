import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toBnDigits } from '../../../lib/format';
import LearnerShell from '../../../layouts/LearnerShell';
import { Chip } from '../../../components/Chip';
import { StatusChip } from '../../../components/StatusChip';
import { useI18n } from '../../../lib/i18n';

/**
 * Screen 11 — গ্রামার লাইব্রেরি / Grammar Library (Stitch, feature 3).
 * Search (Bangla + English substring), category chips, grouped list with
 * "পড়া হয়েছে" markers. Rules + seen markers come from the backend.
 */
export default function Grammar({ rules = RULES, seen: initialSeen = [] }) {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [seen, setSeen] = React.useState(() => new Set(initialSeen));

  const { t } = useI18n();
  const normalized = query.trim().toLowerCase();
  const visible = rules.filter((r) => {
    const inCat = category === 'all' || r.category === category;
    const inQuery =
      normalized === '' ||
      r.nameEn.toLowerCase().includes(normalized) ||
      r.summaryBn.toLowerCase().includes(normalized) ||
      r.category.toLowerCase().includes(normalized);
    return inCat && inQuery;
  });

  const grouped = React.useMemo(() => {
    const groups = {};
    visible.forEach((rule) => {
      const cat = rule.category;
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(rule);
    });
    return Object.keys(groups).map((cat) => ({
      cat,
      rules: groups[cat],
    }));
  }, [visible]);

  return (
    <LearnerShell title={t('গ্রামার লাইব্রেরি')} showBack onBack={() => router.visit('/learn')}>
      <div className="mt-2">
        <Head title={t('গ্রামার লাইব্রেরি')} />
        {/* Search */}
        <div className="flex h-12 items-center gap-2.5 rounded-[14px] bg-white px-4 ring-1 ring-learn-border focus-within:ring-learn-primary">
          <Search className="size-4.5 text-learn-muted" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("বাংলা বা ইংরেজিতে খুঁজুন — যেমন 'article' বা 'কাল'")}
            className="h-full flex-1 bg-transparent text-[14px] text-learn-ink placeholder:text-learn-muted/60 focus:outline-none"
          />
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isAll = cat === 'সব';
            const value = isAll ? 'all' : cat;
            return (
              <Chip key={cat} selected={category === value} onClick={() => setCategory(value)}>
                {cat}
              </Chip>
            );
          })}
        </div>

        {/* Grouped list */}
        <div className="mt-3 space-y-4">
          {grouped.map(({ cat, rules }) => (
            <section key={cat}>
              <h2 className="text-[13px] font-semibold text-learn-muted">{cat}</h2>
              <div className="mt-1.5 overflow-hidden rounded-[14px] bg-white shadow-[0px_4px_12px_rgba(20,23,43,0.04)]">
                {rules.map((rule, i) => (
                  <React.Fragment key={rule.id}>
                    <Link
                      href={`/learn/grammar/${rule.id}`}
                      onClick={() => setSeen((prev) => new Set(prev).add(rule.id))}
                      className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-learn-primary-tint/60"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[15px] font-bold text-learn-ink">{rule.nameEn}</span>
                          {seen.has(rule.id) && <StatusChip tone="green">{t('পড়া হয়েছে')}</StatusChip>}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-learn-muted">{rule.summaryBn}</span>
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-learn-muted">chevron_right</span>
                    </Link>
                    {i < rules.length - 1 && <div className="mx-4 h-px bg-learn-structure" />}
                  </React.Fragment>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[13px] text-learn-muted">
          {t('{n}টি নিয়ম, সবই অফলাইনে পাওয়া যাবে', { n: toBnDigits(rules.length) })}
        </p>
      </div>
    </LearnerShell>
  );
}

const CATEGORIES = ['সব', 'Tense', 'Article', 'Preposition', 'Voice', 'Narration', 'Sentence'];

// ── UI-phase demo rules (feature 3 ships data/grammar.json later) ──
const RULES = [
  { id: 'present-simple', nameEn: 'Present Simple', summaryBn: 'নিয়মিত ঘটে এমন কাজ', category: 'Tense' },
  { id: 'present-continuous', nameEn: 'Present Continuous', summaryBn: 'এখন চলছে এমন কাজ', category: 'Tense' },
  { id: 'past-simple', nameEn: 'Past Simple', summaryBn: 'অতীতে সম্পন্ন কাজ', category: 'Tense' },
  { id: 'present-perfect', nameEn: 'Present Perfect', summaryBn: 'অতীতের সাথে বর্তমানের সম্পর্ক', category: 'Tense' },
  { id: 'indefinite-article', nameEn: 'A / An', summaryBn: 'অনির্দিষ্ট আর্টিকেল', category: 'Article' },
  { id: 'definite-article', nameEn: 'The', summaryBn: 'নির্দিষ্ট আর্টিকেল', category: 'Article' },
  { id: 'prepositions-of-time', nameEn: 'In / On / At', summaryBn: 'সময় বোঝাতে', category: 'Preposition' },
  { id: 'prepositions-of-place', nameEn: 'Prepositions of Place', summaryBn: 'স্থান বোঝাতে', category: 'Preposition' },
  { id: 'active-passive', nameEn: 'Active & Passive Voice', summaryBn: 'কর্তৃবাচ্য ও কর্মবাচ্য', category: 'Voice' },
  { id: 'reported-speech', nameEn: 'Reported Speech', summaryBn: 'উদ্ধৃত বক্তব্য', category: 'Narration' },
  { id: 'sentence-types', nameEn: 'Sentence Types', summaryBn: 'বাক্যের শ্রেণিবিভাগ', category: 'Sentence' },
  { id: 'subject-verb-agreement', nameEn: 'Subject-Verb Agreement', summaryBn: 'কর্তা ও ক্রিয়ার সমতা', category: 'Sentence' },
];
