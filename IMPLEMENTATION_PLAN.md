# IMPLEMENTATION_PLAN.md — easy rise (ইজি রাইজ)

> UI-only phase. Backend deferred. Replace existing frontend gradually. Keep all existing Laravel backend untouched.

---

## 1. Guiding Principles

| Principle | Application |
|-----------|-------------|
| **Backend is source of truth** | Never modify existing controllers, models, migrations, routes, or database. Admin panel untouched. |
| **UI-only phase** | Build Inertia pages + shared components with mock props. Real data wiring later. |
| **Replace, don't duplicate** | If a page exists (e.g., PhoneLogin), update its UI to match Stitch. Never create `PhoneLogin2.jsx`. |
| **Shared components first** | Build `components/ui/*` library before any screen. One component, one file. |
| **Props-first interfaces** | Every screen defines a TypeScript props interface. Mock data in route closures during UI phase. |
| **Strict design system** | Zero tolerance for colour/token violations. Use Tailwind tokens only. |
| **Bangla-first** | Every string from `bn.json`. English only in `PaleInset` samples. |

---

## 2. Current State Analysis

### Existing Frontend (to be replaced)
- **Auth**: `Auth/PhoneLogin.jsx`, `Auth/VerifyOtp.jsx` → **UPDATE** to Stitch screens 02, 03
- **Home**: `Learner/Home.jsx` → **REPLACE** with Screen 04 (Today hub)
- **Learn**: `Learner/Learn/*` → **REPLACE** with Screens 06–13
- **AI**: `Learner/Ai/*` → **REPLACE** with Screen 14
- **Practice**: `Learner/Practice/*` → **REMOVE** (not in easy rise)
- **Profile**: `Learner/Profile/*` → **REPLACE** with Screen 30
- **Layouts**: `LearnerShell.jsx`, `BottomNav.jsx`, `TopBar.jsx` → **UPDATE** to Stitch chrome
- **Components**: 30+ components in `components/` → **AUDIT & REPLACE** with Stitch component tree

### Existing Backend (keep untouched)
- `FirstLoginController` — Firebase Phone Auth (screens 02, 03)
- `ProfileController` — subscriber profile (will map to settings later)
- `HomeController` — currently renders missing `Feed/Index`
- Admin routes (`/admin/**`) — **NEVER TOUCH**
- Public routes (`/app`, `/apk`, `/p/{slug}`, `/news`) — **NEVER TOUCH**

### Database (keep untouched)
- Existing migrations — **NEVER MODIFY**
- New tables for easy rise (clients, jobs, income, etc.) created in **backend phase only**
- UI phase uses **Dexie/IndexedDB** on device only

---

## 3. Migration Strategy: Gradual Replacement

### Phase 0: Foundation (Week 1)
```
[ ] Install/verify Tailwind config with DESIGN_SYSTEM.md tokens
[ ] Add Noto Sans Bengali font (self-hosted or Google Fonts)
[ ] Add Lucide icons (already present)
[ ] Create i18n system: lib/i18n.ts + i18n/bn.json + i18n/en.json
[ ] Build shared components/ui/* (GlassCard, ListRow, SegmentedControl, etc.)
[ ] Update LearnerShell.jsx → Stitch chrome (TopBar, BottomNav, SidebarNav)
[ ] Update nav.js → 5 tabs: আজ, শেখা, সহায়ক, কাজ, টাকা
[ ] Add placeholder routes in routes/web.php for all 30 screens
```

### Phase 1: Onboarding (Week 1–2)
```
[ ] Screen 01: Onboarding/Welcome.jsx (no bottom nav)
[ ] Screen 02: Onboarding/PhoneVerify.jsx (update existing Auth/PhoneLogin)
[ ] Screen 03: Onboarding/ProfileSetup.jsx (update existing Onboarding/ProfileSetup)
[ ] Verify: Bangla rendering, glass opacity ≥88%, OTP auto-advance
```

### Phase 2: Home Hub — The Daily Driver (Week 2)
```
[ ] Screen 04: Home/Today.jsx (REPLACE Learner/Home.jsx)
[ ] Screen 05: Home/RiseLadder.jsx
[ ] Components: MoneyAtStakeStrip, CapacityBar, TodayJobsList, RiseLadderStrip
[ ] Critical: This screen decides daily retention — must be pixel-perfect
```

### Phase 3: Work Tab — Operational Core (Week 3–4)
```
[ ] Screen 15: Work/Pipeline.jsx (StatTile, StateFilter, JobCard, FAB)
[ ] Screen 16: Work/JobDetail.jsx (Header, StepRail mini, 3 segments, sticky actions)
[ ] Screen 17: Work/ScopeGuard.jsx (ScopeGuardCard, BottomSheet add)
[ ] Screen 18: Work/ProposalTracker.jsx (ProposalFunnel, GroupStatsRows)
[ ] Screen 19: Work/PaymentsDue.jsx (Total card, StackedBar aging, PaymentLadder)
[ ] Screen 20: Work/CapacityMeter.jsx (ArcGauge, JobLoadRows, SuggestionCards)
[ ] Screen 21: Work/ClientScreener.jsx (QuestionCard, ResultCard, 12 questions)
[ ] Dexie schema: clients, jobs, scopeItems, proposals, reminderLog
```

### Phase 4: Money Tab — Data Heavy, TODO Chips (Week 4–5)
```
[ ] Screen 22: Money/Index.jsx (12-col chart, 4 tiles, 3 rows, FAB)
[ ] Screen 23: Money/Ledger.jsx (MonthHeaders, LedgerRow, BottomSheet add)
[ ] Screen 24: Money/TrueHourly.jsx (Job selector, 5 steppers, ComparisonCard)
[ ] Screen 25: Money/Runway.jsx (Chart with dashed lines, 3 ResultCards)
[ ] Screen 26: Money/Channels.jsx (4 expandable cards, amber warning card)
[ ] Screen 27: Money/Incentive.jsx (6 questions, ResultCard with TODO rate)
[ ] Screen 28: Money/DocReadiness.jsx (3 RingGauges, segmented, DocRows, amber strip)
[ ] Screen 29: Money/IncomeProof.jsx (Setup → A4 sheet, mandatory footer, print)
[ ] Dexie schema: income, documents
[ ] CRITICAL: Keep TODO chips visible — they are not placeholders
```

### Phase 5: Learn Tab + Assistant + Settings (Week 5–6)
```
[ ] Screen 06: Learn/Index.jsx (RingGauge, FoundationRows, ArtifactCards)
[ ] Screen 07: Learn/MarketplaceCompare.jsx (ChipStrip, SegmentedControl, TODO chips)
[ ] Screen 08: Learn/NicheScorer.jsx (StepperFields, ScoreRing, saved niches strip)
[ ] Screen 09: Learn/ProfileChecklist.jsx (ProgressBar, filter, ExpandableRows)
[ ] Screen 10: Learn/ProposalLibrary.jsx (ChipStrip, 6 parts, PaleInset, amber donts)
[ ] Screen 11: Learn/ConversationScripts.jsx (5×3, PaleInset, avoid strip, CTA→14)
[ ] Screen 12: Learn/Plan90Days.jsx (Setup → saved plan, VioletInset)
[ ] Screen 13: Learn/ProfileReview.jsx (3 textareas → comparison blocks)
[ ] Screen 14: Assistant/Index.jsx (VioletInset, SituationChips, DraftResultCard)
[ ] Screen 30: Settings/Index.jsx (6 groups, danger button only red in app)
```

---

## 4. Technical Implementation Details

### Tailwind Config (tailwind.config.js)
```js
// Must match DESIGN_SYSTEM.md exactly
theme: {
  extend: {
    colors: {
      brand: { DEFAULT: '#1D6FF2', dark: '#0B3FA8' },
      ai: '#6D28D9',
      success: '#16A34A',
      warn: '#D97706',
      danger: '#DC2626',
      info: '#0284C7',
      ink: '#0E1626',
      muted: '#64748B',
      bg: { from: '#EEF3FF', to: '#F7F9FF' },
      inset: { blue: '#EDF3FF', violet: '#F3EFFF' },
      border: { rest: '#E2E8F0', outline: '#CBD5E1' },
    },
    fontFamily: {
      bn: ['Noto Sans Bengali', 'sans-serif'],
      latin: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      'card': '24px',
      'card-tall': '28px',
      'card-row': '20px',
      'btn': '18px',
      'chip': '9999px',
    },
    boxShadow: {
      'glass': '0 8px 32px rgb(14 22 38 / 0.08)',
    },
  },
}
```

### Glass Utility (resources/css/app.css)
```css
@layer utilities {
  .glass {
    background: rgb(255 255 255 / 0.92);
    backdrop-filter: blur(18px);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgb(14 22 38 / 0.08);
    border-top: 1px solid rgb(255 255 255 / 0.7);
  }
  .glass-tall { @apply glass rounded-[28px]; }
  .glass-row { @apply glass rounded-[20px]; }
}
```

### i18n Setup (resources/js/lib/i18n.ts)
```ts
import bn from '@/i18n/bn.json';
import en from '@/i18n/en.json';

type Locale = 'bn' | 'en';
const messages: Record<Locale, Record<string, string>> = { bn, en };
let current: Locale = 'bn';

export function useI18n() {
  const t = (key: string, params?: Record<string, string>) => {
    let msg = messages[current]?.[key] ?? messages.bn[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        msg = msg.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return msg;
  };
  return { t, locale: current, setLocale: (l: Locale) => current = l };
}

export function toBnDigits(n: number | string): string {
  const map = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(n).replace(/\d/g, d => map[parseInt(d)]);
}
```

### Dexie Schema (resources/js/lib/db.ts)
```ts
import Dexie from 'dexie';

export const db = new Dexie('easy-rise');

db.version(1).stores({
  clients: '++id, name, source, marketplace, createdAt',
  jobs: '++id, clientId, status, deadline, agreedPaisa, currency, createdAt',
  scopeItems: '++id, jobId, date, description, hours, createdAt',
  proposals: '++id, jobId, sentAt, marketplace, jobType, quotedPaisa, outcome',
  income: '++id, jobId, date, currency, amountPaisa, rate, channel, createdAt',
  documents: '++id, purpose, name, status, expiryDate, note, createdAt',
  niches: '++id, name, profilesFound, jobsPosted7d, rateMin, rateMax, skill, score, band, createdAt',
  checklist: 'itemId, done, updatedAt',
  plans: '++id, niche, hours, experience, english, deadline, createdAt',
  reviews: '++id, headline, overview, samples, result, createdAt',
  settings: 'key, value',
  reminderLog: '++id, jobId, step, sentAt',
});

export type DB = typeof db;
```

### Route Placeholders (routes/web.php — UI Phase)
```php
// Add these placeholder routes for UI phase (replace with real controllers later)
Route::get('/home', fn() => inertia('Home/Today', [
    'jobsDue' => 3,
    'moneyOwed' => 1850000,
    'weeklyLoad' => ['used' => 20, 'max' => 25],
    'ladderStage' => 2,
    'todayJobs' => [
        ['id' => 1, 'name' => 'লোগো ডিজাইন — Ahmed Traders', 'deadline' => 'আজ', 'status' => 'active'],
        ['id' => 2, 'name' => 'ব্যানার সেট — Nabila Store', 'deadline' => '৩ দিন', 'status' => 'active'],
    ],
]))->name('home');

Route::get('/learn', fn() => inertia('Learn/Index', [
    'progressPct' => 42,
    'foundations' => [/* 5 items from data */],
    'artifacts' => [/* 2 items */],
]))->name('learn');

// ... repeat for all 30 screens with mock data matching props interfaces
```

---

## 5. Component Build Order (Dependency Graph)

```
LEVEL 0 (No deps)
├── GlassCard, PaleInset, VioletInset
├── TopBar, BottomNav, SidebarNav
├── ChipStrip, SegmentedControl, DropdownChip, ToggleChip
├── StepperField, OTPBoxes
├── FAB, BottomSheet, Toast
├── StatTile, StatusChip, TodoChip, WarnStrip
└── EmptyState

LEVEL 1 (Depends on Level 0)
├── ListRow (uses GlassCard, ChipStrip)
├── ProgressBar, StackedBar
├── RingGauge, ArcGauge, ScoreRing
├── StepRail, CapacityGauge
├── PaymentLadder, ScopeGuardCard
├── ProposalFunnel, IncomeProofSheet
└── DocumentRow

LEVEL 2 (Feature screens - compose Level 0+1)
├── Onboarding: Welcome, PhoneVerify, ProfileSetup
├── Home: Today, RiseLadder
├── Learn: Index, MarketplaceCompare, NicheScorer, ProfileChecklist, ProposalLibrary, ConversationScripts, Plan90Days, ProfileReview
├── Assistant: Index
├── Work: Pipeline, JobDetail, ScopeGuard, ProposalTracker, PaymentsDue, CapacityMeter, ClientScreener
├── Money: Index, Ledger, TrueHourly, Runway, Channels, Incentive, DocReadiness, IncomeProof
└── Settings: Index
```

---

## 6. Quality Gates (Must Pass Before Next Phase)

| Gate | Command | Threshold |
|------|---------|-----------|
| **TypeScript** | `npx tsc --noEmit` | 0 errors |
| **Lint** | `npm run lint` | 0 errors |
| **Design token audit** | Custom script | No hardcoded colours, all tokens used |
| **Bangla rendering** | Visual review | All conjuncts readable at 92% opacity |
| **Touch targets** | Manual test | All interactive elements ≥48×48px |
| **Colour roles** | Custom script | No colour outside assigned role |
| **Offline render** | DevTools offline | All 30 screens render identically |
| **i18n coverage** | `grep -r "t(" --include="*.jsx"` | 100% strings from i18n |

---

## 7. File Structure (Final)

```
resources/js/
├── app.jsx                    # Entry
├── bootstrap.js
├── lib/
│   ├── utils.ts               # cn(), toBnDigits(), formatMoney(), etc.
│   ├── i18n.ts                # useI18n(), bn.json/en.json loader
│   ├── db.ts                  # Dexie instance + schema
│   ├── nav.ts                 # NAV_TABS (5 tabs)
│   ├── format.ts              # formatMoney, formatDate, formatRelative
│   └── api.ts                 # AI proxy calls (later)
├── components/
│   ├── ui/                    # 25 shared components (LEVEL 0+1)
│   │   ├── GlassCard.tsx
│   │   ├── ListRow.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── ChipStrip.tsx
│   │   ├── StepperField.tsx
│   │   ├── OTPBoxes.tsx
│   │   ├── DropdownChip.tsx
│   │   ├── ToggleChip.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StackedBar.tsx
│   │   ├── RingGauge.tsx
│   │   ├── ArcGauge.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── StepRail.tsx
│   │   ├── CapacityGauge.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── FAB.tsx
│   │   ├── PaleInset.tsx
│   │   ├── VioletInset.tsx
│   │   ├── WarnStrip.tsx
│   │   ├── TodoChip.tsx
│   │   ├── EmptyState.tsx
│   │   ├── StatTile.tsx
│   │   ├── StatusChip.tsx
│   │   ├── ProposalFunnel.tsx
│   │   ├── PaymentLadder.tsx
│   │   ├── ScopeGuardCard.tsx
│   │   ├── IncomeProofSheet.tsx
│   │   └── DocumentRow.tsx
│   ├── TopBar.tsx
│   ├── BottomNav.tsx
│   └── SidebarNav.tsx
├── layouts/
│   └── LearnerShell.tsx       # Updated to Stitch chrome
├── pages/
│   ├── Onboarding/
│   │   ├── Welcome.tsx
│   │   ├── PhoneVerify.tsx
│   │   └── ProfileSetup.tsx
│   ├── Home/
│   │   ├── Today.tsx
│   │   └── RiseLadder.tsx
│   ├── Learn/
│   │   ├── Index.tsx
│   │   ├── MarketplaceCompare.tsx
│   │   ├── NicheScorer.tsx
│   │   ├── ProfileChecklist.tsx
│   │   ├── ProposalLibrary.tsx
│   │   ├── ConversationScripts.tsx
│   │   ├── Plan90Days.tsx
│   │   └── ProfileReview.tsx
│   ├── Assistant/
│   │   └── Index.tsx
│   ├── Work/
│   │   ├── Pipeline.tsx
│   │   ├── JobDetail.tsx
│   │   ├── ScopeGuard.tsx
│   │   ├── ProposalTracker.tsx
│   │   ├── PaymentsDue.tsx
│   │   ├── CapacityMeter.tsx
│   │   └── ClientScreener.tsx
│   ├── Money/
│   │   ├── Index.tsx
│   │   ├── Ledger.tsx
│   │   ├── TrueHourly.tsx
│   │   ├── Runway.tsx
│   │   ├── Channels.tsx
│   │   ├── Incentive.tsx
│   │   ├── DocReadiness.tsx
│   │   └── IncomeProof.tsx
│   └── Settings/
│       └── Index.tsx
├── features/                  # Pure calculators + stores
│   ├── niche/nicheScore.calc.ts
│   ├── ladder/ladder.calc.ts
│   ├── capacity/capacity.calc.ts
│   ├── scope/scopeGuard.calc.ts
│   ├── payments/escalation.calc.ts
│   ├── proposals/winRate.calc.ts
│   ├── screener/screener.rules.ts
│   ├── incentive/incentive.rules.ts
│   ├── documents/docReadiness.rules.ts
│   ├── proof/proofPack.build.ts
│   ├── rate/trueHourly.calc.ts
│   ├── runway/runway.calc.ts
│   └── ...stores
├── data/                      # Hand-authored JSON + tests
│   ├── marketplaces.json
│   ├── checklistItems.json
│   ├── proposalStructures.json
│   ├── conversationScripts.json
│   ├── escalation.json
│   ├── incentiveRules.json
│   ├── documentLists.json
│   ├── screenerRules.json
│   └── ladderCriteria.json
├── i18n/
│   ├── bn.json                # PRIMARY
│   └── en.json                # Secondary
└── styles/
    └── globals.css            # Tailwind + .glass utilities
```

---

## 8. Handoff to Backend Phase

When UI phase completes, the following are ready for backend integration:

| Deliverable | Description |
|-------------|-------------|
| **30 Inertia pages** | All screens built with typed props interfaces |
| **Shared component library** | 25 reusable components in `components/ui/` |
| **Dexie schema** | Complete client-side schema for offline-first |
| **Pure calculators** | 12 `*.calc.ts` files with unit tests |
| **Reference data** | 9 JSON files in `data/` with validation tests |
| **i18n files** | Complete `bn.json` (primary) + `en.json` |
| **Route map** | `PAGE_MAP.md` with all routes and props shapes |
| **Design system** | `DESIGN_SYSTEM.md` + Tailwind config |

Backend team implements:
1. Laravel models/migrations for: clients, jobs, scopeItems, proposals, income, documents, niches, checklist, plans, reviews, settings, reminderLog
2. Controllers returning props-shaped JSON for each route
3. AI proxy endpoints: `POST /api/assist`, `POST /api/generate`
4. Firebase Phone Auth integration (already exists)

---

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Bangla font not loading | Self-host Noto Sans Bengali; fallback to system font with `font-display: swap` |
| Glass opacity <88% on low-end devices | Test on Android 8+ Chrome; enforce `.glass` utility |
| Colour drift in generators | CI check: `grep -r "#[0-9A-Fa-f]\{6\}" --include="*.tsx" --include="*.css" \| grep -v "tailwind.config"` |
| Duplicate components | PR template: "Which shared component does this use?" |
| Backend coupling | Props interfaces frozen; backend must match exactly |
| TODO chips removed | Lint rule: `TODO — যাচাই বাকি` string must exist in 3+ screens |

---

## 10. Timeline Summary

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Foundation + Onboarding | Tokens, i18n, 25 shared components, 3 onboarding screens |
| 2 | Home Hub | Today + Rise Ladder (pixel-perfect) |
| 3–4 | Work Tab | 7 screens + Dexie schema |
| 4–5 | Money Tab | 8 screens + TODO chips visible |
| 5–6 | Learn + Assistant + Settings | 10 screens |
| 6 | Polish + QA | All gates pass, offline verified |

**Total: ~6 weeks for UI phase**

---

## 11. What NOT to Do

| ❌ Don't | ✅ Do |
|----------|-------|
| Create new Laravel project | Work in existing `E:\zenvex\eary-rise` |
| Create `frontend/`, `stitch/`, `generated/` folders | Use `resources/js/` |
| Duplicate `PhoneLogin` → `PhoneLogin2` | Update existing `Auth/PhoneLogin.jsx` |
| Modify admin routes/controllers | Keep `/admin/**` untouched |
| Add pricing/subscription UI | Zero price/plan/store language |
| Use colours outside role table | Strict Tailwind tokens only |
| Drop glass opacity below 88% | Enforce in `.glass` utility |
| Hardcode Bangla strings | Every string from `bn.json` |
| Use centre modals | BottomSheet only |
| Skip unit tests for calculators | 100% coverage on `*.calc.ts` |

---

## 12. Approval Checkpoint

**After documentation review, before any React code generation:**

- [ ] DESIGN_SYSTEM.md approved
- [ ] COMPONENT_TREE.md approved
- [ ] PAGE_MAP.md approved
- [ ] IMPLEMENTATION_PLAN.md approved
- [ ] Tailwind config matches DESIGN_SYSTEM.md
- [ ] Noto Sans Bengali font loading strategy confirmed
- [ ] Dexie schema matches feature requirements

**Only after explicit approval** → proceed to Phase 0 implementation.