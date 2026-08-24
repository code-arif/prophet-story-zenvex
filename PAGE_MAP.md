# PAGE_MAP.md — easy rise (ইজি রাইজ)

> Maps all 30 Stitch screens to Inertia pages, routes, and backend status.
> **Backend is deferred** — all screens built as props-first Inertia pages with static data.
> Real controllers/routes wired in later phase.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| 🆕 **CREATE** | New screen; new Inertia page (route added in UI phase as placeholder) |
| 🔒 **BACKEND LATER** | Data/logic deferred; UI scaffolded with typed props interfaces |
| ♻️ **REPLACE UI** | Route + backend exist; replace only the UI (not applicable — new app) |
| ✅ **EXISTS** | Page already exists and matches design (not applicable — new app) |

---

## Route Map (30 Screens)

| # | Screen (BN / EN) | Tab | Inertia Page | Route | Backend Source |
|---|------------------|-----|--------------|-------|----------------|
| **Onboarding (no bottom nav)** |
| 01 | স্বাগতম / Welcome | — | `Onboarding/Welcome` | `/welcome` | 🔒 none (client-only) |
| 02 | ফোন যাচাই / Phone Verification | — | `Onboarding/PhoneVerify` | `/login` | Firebase Phone Auth (keep existing) |
| 03 | শুরুর তথ্য / Starting Setup | — | `Onboarding/ProfileSetup` | `/welcome/setup` | 🔒 later; can reuse `ProfileController@update` |
| **Tab: আজ (Home)** |
| 04 | আজ / Today | আজ | `Home/Today` | `/home` | 🔒 later (reads pipeline, income, settings) |
| 05 | রাইজ ল্যাডার / Rise Ladder | আজ | `Home/RiseLadder` | `/home/ladder` | 🔒 later (calculates from user records) |
| **Tab: শেখা (Learn)** |
| 06 | শেখা / Learn Hub | শেখা | `Learn/Index` | `/learn` | 🔒 later (static reference data) |
| 07 | মার্কেটপ্লেস তুলনা / Marketplace Comparison | শেখা | `Learn/MarketplaceCompare` | `/learn/marketplace` | 🔒 `data/marketplaces.json` |
| 08 | নিশ ফিট স্কোরার / Niche Fit Scorer | শেখা | `Learn/NicheScorer` | `/learn/niche` | 🔒 `nicheScore.calc.ts` (pure) |
| 09 | প্রোফাইল ও পোর্টফোলিও চেকলিস্ট / Profile & Portfolio Checklist | শেখা | `Learn/ProfileChecklist` | `/learn/checklist` | 🔒 `data/checklistItems.json` + Dexie |
| 10 | প্রস্তাব কাঠামো লাইব্রেরি / Proposal Structure Library | শেখা | `Learn/ProposalLibrary` | `/learn/proposals` | 🔒 `data/proposalStructures.json` |
| 11 | ক্লায়েন্ট কথোপকথন স্ক্রিপ্ট / Client Conversation Scripts | শেখা | `Learn/ConversationScripts` | `/learn/scripts` | 🔒 `data/conversationScripts.json` |
| 12 | আমার ৯০ দিনের পরিকল্পনা / My 90-Day Plan | শেখা | `Learn/Plan90Days` | `/learn/plan` | 🔒 AI proxy `/generate` (later) |
| 13 | প্রোফাইল রিভিউ / Profile Review | শেখা | `Learn/ProfileReview` | `/learn/profile-review` | 🔒 AI proxy `/generate` (later) |
| **Tab: সহায়ক (AI Assistant — centre, elevated)** |
| 14 | সহায়ক / Assistant | সহায়ক | `Assistant/Index` | `/assistant` | 🔒 AI proxy `/assist` (later) |
| **Tab: কাজ (Work)** |
| 15 | পাইপলাইন / Pipeline | কাজ | `Work/Pipeline` | `/work` | 🔒 Dexie `clients` + `jobs` |
| 16 | কাজের বিস্তারিত / Job Detail | কাজ | `Work/JobDetail` | `/work/jobs/:id` | 🔒 Dexie `jobs` + `scopeItems` |
| 17 | স্কোপ ও রিভিশন গার্ড / Scope & Revision Guard | কাজ | `Work/ScopeGuard` | `/work/jobs/:id/scope` | 🔒 Dexie `scopeItems` |
| 18 | প্রস্তাব ট্র্যাকার / Proposal Tracker | কাজ | `Work/ProposalTracker` | `/work/proposals` | 🔒 Dexie `proposals` |
| 19 | বকেয়া ও তাগাদা ধাপ / Payments Due | কাজ | `Work/PaymentsDue` | `/work/payments` | 🔒 Dexie `jobs` (AWAITING_PAYMENT) + `reminderLog` |
| 20 | কাজের চাপ মিটার / Capacity Meter | কাজ | `Work/CapacityMeter` | `/work/capacity` | 🔒 `capacity.calc.ts` (pure) |
| 21 | ক্লায়েন্ট ঝুঁকি স্ক্রিনার / Client Red-Flag Screener | কাজ | `Work/ClientScreener` | `/work/screener` | 🔒 `data/screenerRules.json` |
| **Tab: টাকা (Money)** |
| 22 | টাকা / Money Hub | টাকা | `Money/Index` | `/money` | 🔒 Dexie `income` + settings |
| 23 | আয়ের খাতা / Income Ledger | টাকা | `Money/Ledger` | `/money/ledger` | 🔒 Dexie `income` |
| 24 | রেট ও প্রকৃত ঘণ্টা-আয় / Rate & True Hourly | টাকা | `Money/TrueHourly` | `/money/true-hourly` | 🔒 `trueHourly.calc.ts` (pure) |
| 25 | স্থিতিশীলতা ও রানওয়ে / Stability & Runway | টাকা | `Money/Runway` | `/money/runway` | 🔒 `runway.calc.ts` (pure) |
| 26 | টাকা দেশে আনার চ্যানেল / Bringing Earnings Home | টাকা | `Money/Channels` | `/money/channels` | 🔒 `data/incentiveRules.json` + `documentLists.json` |
| 27 | প্রণোদনা হিসাব ও যোগ্যতা / Remittance Incentive | টাকা | `Money/Incentive` | `/money/incentive` | 🔒 `incentive.rules.ts` (pure) |
| 28 | কাগজপত্র প্রস্তুতি / Document Readiness | টাকা | `Money/DocReadiness` | `/money/documents` | 🔒 Dexie `documents` + `data/documentLists.json` |
| 29 | আয়ের প্রমাণপত্র / Income Proof Pack | টাকা | `Money/IncomeProof` | `/money/proof` | 🔒 Dexie `income` + browser print-to-PDF |
| **Global (reached from top-bar gear)** |
| 30 | সেটিংস / Settings | — | `Settings/Index` | `/settings` | 🔒 Dexie `settings` + export/import |

---

## Tab → Route Mapping

| Tab | Key | Active Route | Inertia Page |
|-----|-----|--------------|--------------|
| আজ | `home` | `/home` | `Home/Today` |
| শেখা | `learn` | `/learn` | `Learn/Index` |
| সহায়ক | `ai` | `/assistant` | `Assistant/Index` |
| কাজ | `work` | `/work` | `Work/Pipeline` |
| টাকা | `money` | `/money` | `Money/Index` |

---

## Route Gaps to Close (UI Phase)

1. **Bottom nav target routes** — Add placeholder Inertia routes in `routes/web.php`:
   ```php
   // Learner app (UI phase — static props, real controllers later)
   Route::get('/home', fn() => inertia('Home/Today'))->name('home');
   Route::get('/learn', fn() => inertia('Learn/Index'))->name('learn');
   Route::get('/assistant', fn() => inertia('Assistant/Index'))->name('assistant');
   Route::get('/work', fn() => inertia('Work/Pipeline'))->name('work');
   Route::get('/money', fn() => inertia('Money/Index'))->name('money');
   Route::get('/settings', fn() => inertia('Settings/Index'))->name('settings');
   ```

2. **Sub-routes** — Add when screens land:
   ```php
   Route::get('/home/ladder', fn() => inertia('Home/RiseLadder'));
   Route::get('/learn/marketplace', fn() => inertia('Learn/MarketplaceCompare'));
   Route::get('/learn/niche', fn() => inertia('Learn/NicheScorer'));
   Route::get('/learn/checklist', fn() => inertia('Learn/ProfileChecklist'));
   Route::get('/learn/proposals', fn() => inertia('Learn/ProposalLibrary'));
   Route::get('/learn/scripts', fn() => inertia('Learn/ConversationScripts'));
   Route::get('/learn/plan', fn() => inertia('Learn/Plan90Days'));
   Route::get('/learn/profile-review', fn() => inertia('Learn/ProfileReview'));
   Route::get('/work/jobs/{id}', fn($id) => inertia('Work/JobDetail', ['jobId' => $id]));
   Route::get('/work/jobs/{id}/scope', fn($id) => inertia('Work/ScopeGuard', ['jobId' => $id]));
   Route::get('/work/proposals', fn() => inertia('Work/ProposalTracker'));
   Route::get('/work/payments', fn() => inertia('Work/PaymentsDue'));
   Route::get('/work/capacity', fn() => inertia('Work/CapacityMeter'));
   Route::get('/work/screener', fn() => inertia('Work/ClientScreener'));
   Route::get('/money/ledger', fn() => inertia('Money/Ledger'));
   Route::get('/money/true-hourly', fn() => inertia('Money/TrueHourly'));
   Route::get('/money/runway', fn() => inertia('Money/Runway'));
   Route::get('/money/channels', fn() => inertia('Money/Channels'));
   Route::get('/money/incentive', fn() => inertia('Money/Incentive'));
   Route::get('/money/documents', fn() => inertia('Money/DocReadiness'));
   Route::get('/money/proof', fn() => inertia('Money/IncomeProof'));
   ```

3. **Onboarding routes** — Already exist for auth, add setup:
   ```php
   Route::get('/welcome', fn() => inertia('Onboarding/Welcome'))->name('welcome');
   Route::get('/welcome/setup', fn() => inertia('Onboarding/ProfileSetup'))->name('welcome.setup');
   ```

---

## Feature → Screen Coverage (from Stitch Blueprint)

| Feature | Primary Screen(s) | Also In |
|---------|-------------------|---------|
| 1 Marketplace Comparison | 06, 07 | — |
| 2 Niche Fit & Crowding Scorer | 06, 08 | — |
| 3 Profile & Portfolio Checklist | 06, 09, 13 | — |
| 4 Proposal Structure Library | 06, 10 | 14 (assistant CTA) |
| 5 Client Conversation Scripts | 06, 11, 19, 21 | — |
| 6 Client & Project Pipeline | 04, 15, 16 | — |
| 7 Proposal Tracker & Win Rate | 18 | — |
| 8 Payment Due & Escalation Ladder | 04, 16, 19 | — |
| 9 Scope & Revision Guard | 16, 17 | — |
| 10 Capacity & Overcommitment Meter | 03, 04, 20 | — |
| 11 Income Ledger | 22, 23 | — |
| 12 Rate & True Hourly Guidance | 03, 24 | 16 |
| 13 Income Smoothing & Runway | 22, 25 | — |
| 14 Bringing Earnings Home | 26 | — |
| 15 Remittance Incentive Calculator | 27 | — |
| 16 Document Readiness | 26, 28 | — |
| 17 Income Proof Pack | 29 | — |
| 18 Rise Ladder | 03, 04, 05 | — |
| 19 Client Message Assistant | 14 | 10, 11 |
| 20 Niche & First 90 Days Plan | 04, 06, 12 | — |
| 21 Profile & Portfolio Review | 06, 13 | — |
| 22 Client Red-Flag Screener | 21 | — |

---

## Data Dependencies (UI Phase — Static/Props)

| Screen | Props Interface (TypeScript) | Static Data Source |
|--------|------------------------------|-------------------|
| 01 Welcome | `{}` | — |
| 02 Phone | `{ onVerify: (code) => void }` | Firebase config |
| 03 Setup | `{ onSave: (data) => void }` | — |
| 04 Today | `TodayHubProps { jobsDue, moneyOwed, weeklyLoad, ladderStage }` | Mock data |
| 05 Ladder | `LadderProps { currentStage, criteria[], nextSteps[] }` | Mock data |
| 06 Learn | `LearnHubProps { progressPct, foundations[], artifacts[] }` | `data/*.json` |
| 07 Marketplace | `MarketplaceProps { marketplaces[], selected[] }` | `data/marketplaces.json` |
| 08 Niche | `NicheProps { savedNiches[] }` | `data/niches.json` (Dexie) |
| 09 Checklist | `ChecklistProps { items[], filter }` | `data/checklistItems.json` |
| 10 Proposal | `ProposalProps { jobTypes[], structures[] }` | `data/proposalStructures.json` |
| 11 Scripts | `ScriptsProps { situations[], levels[] }` | `data/conversationScripts.json` |
| 12 Plan | `PlanProps { savedPlan?, setupData? }` | Dexie `plans` |
| 13 ProfileReview | `ReviewProps { savedReview?, draftData? }` | Dexie `reviews` |
| 14 Assistant | `AssistantProps { situations[], draft? }` | Mock + AI proxy later |
| 15 Pipeline | `PipelineProps { clients[], jobs[], stats }` | Dexie `clients`, `jobs` |
| 16 JobDetail | `JobDetailProps { job, scopeItems, payments }` | Dexie `jobs`, `scopeItems` |
| 17 ScopeGuard | `ScopeGuardProps { agreed, extra[], items[] }` | Dexie `scopeItems` |
| 18 Proposals | `ProposalTrackerProps { proposals[], windowDays }` | Dexie `proposals` |
| 19 Payments | `PaymentsProps { overdueJobs[], reminderLog }` | Dexie `jobs` (AWAITING_PAYMENT) |
| 20 Capacity | `CapacityProps { weeklyHours, committed[], available }` | Dexie `jobs` + settings |
| 21 Screener | `ScreenerProps { answers[], result? }` | `data/screenerRules.json` |
| 22 Money | `MoneyHubProps { earnings12m[], monthly[], runway, safeDraw }` | Dexie `income` |
| 23 Ledger | `LedgerProps { entries[], filters }` | Dexie `income` |
| 24 TrueHourly | `TrueHourlyProps { jobs[], selectedJob?, calc }` | Dexie `jobs` |
| 25 Runway | `RunwayProps { monthlyIncome[], expenses, savings }` | Dexie `income` + settings |
| 26 Channels | `ChannelsProps { channels[], requirements[] }` | `data/incentiveRules.json`, `documentLists.json` |
| 27 Incentive | `IncentiveProps { payment, rules[], result? }` | `data/incentiveRules.json` |
| 28 Documents | `DocReadinessProps { purposes[], documents[] }` | Dexie `documents` + `data/documentLists.json` |
| 29 Proof | `ProofProps { range, personName, purpose, showClientNames }` | Dexie `income` |
| 30 Settings | `SettingsProps { user, workingHours, minRate, currency }` | Dexie `settings` |

---

## Navigation Rules

| Rule | Detail |
|------|--------|
| **Bottom nav** | Present on screens 04–29 (all tab screens) |
| **No bottom nav** | Screens 01–03 (onboarding), 30 (settings) |
| **Top bar** | All screens except 01–03, 30 |
| **Top bar gear** | Opens Screen 30 (settings) from any screen |
| **Centre tab** | Always elevated violet `#6D28D9` — the AI assistant flagship |
| **Active tab indicator** | `#1D6FF2` + filled dot beneath |
| **Back navigation** | Top-bar back chevron on sub-screens (05, 07–29) |

---

## Existing Laravel Routes to Preserve (Admin + Auth)

| Route | Controller | Status |
|-------|------------|--------|
| `GET /` | `HomeController` | **REPLACE** — becomes `/home` (Today hub) |
| `GET /login` · `POST /login/send-otp` · `GET/POST /login/verify` | `FirstLoginController` | **KEEP** — Firebase Phone Auth |
| `GET /profile` · `POST /profile` | `ProfileController` | **REPLACE** — becomes Screen 30 |
| `GET /admin/**` | Admin controllers | **UNTOUCHED** — out of scope |
| `GET /app` · `/apk/**` | `AppDownloadController` | **UNTOUCHED** |
| `GET /p/{slug}` | `PageController` | **UNTOUCHED** |
| `GET /news` | `ArticleController` | **UNTOUCHED** |

---

## Inertia Page Structure (New)

```
resources/js/pages/
├── Onboarding/
│   ├── Welcome.jsx           # 01
│   ├── PhoneVerify.jsx       # 02 (replaces Auth/PhoneLogin)
│   └── ProfileSetup.jsx      # 03
├── Home/
│   ├── Today.jsx             # 04
│   └── RiseLadder.jsx        # 05
├── Learn/
│   ├── Index.jsx             # 06
│   ├── MarketplaceCompare.jsx # 07
│   ├── NicheScorer.jsx       # 08
│   ├── ProfileChecklist.jsx  # 09
│   ├── ProposalLibrary.jsx   # 10
│   ├── ConversationScripts.jsx # 11
│   ├── Plan90Days.jsx        # 12
│   └── ProfileReview.jsx     # 13
├── Assistant/
│   └── Index.jsx             # 14
├── Work/
│   ├── Pipeline.jsx          # 15
│   ├── JobDetail.jsx         # 16
│   ├── ScopeGuard.jsx        # 17
│   ├── ProposalTracker.jsx   # 18
│   ├── PaymentsDue.jsx       # 19
│   ├── CapacityMeter.jsx     # 20
│   └── ClientScreener.jsx    # 21
├── Money/
│   ├── Index.jsx             # 22
│   ├── Ledger.jsx            # 23
│   ├── TrueHourly.jsx        # 24
│   ├── Runway.jsx            # 25
│   ├── Channels.jsx          # 26
│   ├── Incentive.jsx         # 27
│   ├── DocReadiness.jsx      # 28
│   └── IncomeProof.jsx       # 29
└── Settings/
    └── Index.jsx             # 30
```

---

## Props-First Development (UI Phase)

Every screen component accepts a typed `props` interface. During UI phase, pages receive **mock data** matching the interface. When backend lands, controllers pass real data with same shape.

```tsx
// Example: resources/js/pages/Home/Today.jsx
interface TodayHubProps {
  jobsDue: number;
  moneyOwed: number;        // paisa
  weeklyLoad: { used: number; max: number; };
  ladderStage: 1 | 2 | 3 | 4;
  todayJobs: Array<{ id: number; name: string; deadline: string; status: string }>;
}

export default function Today({ jobsDue, moneyOwed, weeklyLoad, ladderStage, todayJobs }: TodayHubProps) {
  // Render using shared components
}
```

**Mock data** provided via route closure in `routes/web.php` during UI phase.

---

## Screen Dependencies (Build Order)

```
Phase 1: Design System + Onboarding
  01 → 02 → 03

Phase 2: Home Hub (daily driver)
  04 → 05

Phase 3: Work Tab (operational core)
  15 → 16 → 17 → 18 → 19 → 20 → 21

Phase 4: Money Tab (data-heavy, TODO chips)
  22 → 23 → 24 → 25 → 26 → 27 → 28 → 29

Phase 5: Learn Tab + Assistant + Settings
  06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 30
```

---

## Acceptance Criteria (Per Screen)

| Screen | Must Render Without Network | Key Visual Check |
|--------|----------------------------|------------------|
| 01–03 | Yes | Bangla conjuncts readable at 92% opacity |
| 04 | Yes | Money strip, capacity bar, ladder strip all visible |
| 05 | Yes | StepRail: 1✓ 2● 3○ 4○ with criteria rows |
| 06 | Yes | RingGauge 42%, 5 foundation rows, 2 artifact cards |
| 07 | Yes | Chip strip + segmented control + 5 sections + TODO chips |
| 08 | Yes | Stepper fields + ScoreRing (69) + verdict band |
| 09 | Yes | 7/12 progress, filter tabs, expandable rows with failLine |
| 10 | Yes | 6 parts + PaleInset samples + amber donts card |
| 11 | Yes | 5 situations × 3 levels, PaleInset messages, avoid strip |
| 12 | Yes | Setup state → saved plan with timeline |
| 13 | Yes | 3 textareas → comparison blocks + amber warnings |
| 14 | Yes | VioletInset draft + annotated parts + CTA to scripts |
| 15 | Yes | 5 stat tiles + state filter + job cards + FAB |
| 16 | Yes | Header + 3 segments (details/scope/money) + sticky actions |
| 17 | Yes | Split card + stacked bar + amber strip + add sheet |
| 18 | Yes | Funnel (38/9/4) + group breakdown + low-data variant |
| 19 | Yes | Total card + aging buckets + expandable ladders + EmptyState |
| 20 | Yes | ArcGauge (32/25) + verdict + job load rows + suggestions |
| 21 | Yes | 12 questions → verdict band (green/amber/red) + rule list |
| 22 | Yes | 12-col chart (3 zeros visible) + 4 tiles + 3 rows + FAB |
| 23 | Yes | Month headers (incl. zero months) + ledger rows + add sheet |
| 24 | Yes | Job selector + 5 steppers + comparison card (667 vs 423) |
| 25 | Yes | Chart with dashed/dotted lines + 3 result cards + low-data |
| 26 | Yes | 4 expandable channel cards + amber warning card |
| 27 | Yes | 6 questions → green/amber result + TODO rate chip |
| 28 | Yes | 3 RingGauges + segmented + doc rows + expiry amber strip |
| 29 | Yes | Setup → A4 sheet with mandatory footer + print button |
| 30 | Yes | 6 groups + danger button (only red in app) + confirm sheet |