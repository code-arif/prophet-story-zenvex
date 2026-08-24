# COMPONENT_TREE.md — easy rise (ইজি রাইজ)

> Complete component hierarchy. Every component listed here is built **once** in `resources/js/components/` or `resources/js/components/ui/` and reused across all 30 screens. No duplicate components.

---

## 1. Layout Shell (App-Level)

```
LearnerShell (layouts/LearnerShell.jsx)
├── SidebarNav (components/SidebarNav.jsx) — desktop left sidebar
├── TopBar (components/TopBar.jsx) — translucent frosted header
│   ├── Back/Close button (conditional)
│   ├── Title (bold Bangla)
│   └── Right slot (gear, streak, counter, etc.)
├── Main content area (scrollable)
└── BottomNav (components/BottomNav.jsx) — 5-tab frosted bar
    ├── Tab: আজ (Home) → /home
    ├── Tab: শেখা (BookOpen) → /learn
    ├── Tab: সহায়ক (Sparkles) → /ai — ELEVATED VIOLET #6D28D9
    ├── Tab: কাজ (Briefcase) → /work
    └── Tab: টাকা (Wallet) → /money
```

---

## 2. Shared UI Components (components/ui/)

### Glass Surfaces
```
GlassCard (ui/GlassCard.jsx)
├── Props: variant: 'default' | 'tall' | 'row', children, className
├── 92% opacity, backdrop-blur, radius, highlight, shadow
└── Used by: EVERY screen card

PaleInset (ui/PaleInset.jsx)
├── #EDF3FF background, 12px radius, copy icon top-right
├── For: English sample messages (proposal library, scripts, assistant)
└── Text: 14–15px Inter, #64748B

VioletInset (ui/VioletInset.jsx)
├── #F3EFFF background, violet left accent
├── For: Assistant draft block ONLY
└── Text: 15px Inter, copy + edit icons
```

### Navigation & Chrome
```
BottomNav (components/BottomNav.jsx) — see Layout Shell
TopBar (components/TopBar.jsx) — see Layout Shell
SidebarNav (components/SidebarNav.jsx) — desktop sidebar
SegmentedControl (components/SegmentedControl.jsx)
├── Frosted pill segments
├── Single/multi-select
├── Active: #1D6FF2 fill, white text
└── Inactive: 92% frosted, #0E1626 text
```

### Data Display
```
ListRow (components/ListRow.jsx)
├── 76px height, 44px tinted rounded-square icon container
├── Title (16px bold Bangla), Subtitle (13px #64748B)
├── Trailing: StatusChip | Chevron | Pill | Value
└── Touch target: entire row (48px min)

ChipStrip (components/ChipStrip.jsx)
├── Horizontally scrollable frosted pills
├── Each: icon + label, selectable
├── Selected: #1D6FF2 fill, white text
└── Used: marketplace tabs, job types, channels, periods

StatTile (components/StatTile.jsx)
├── Compact tile: count (large bold) + label (12px)
├── Horizontal scroll strip
├── Variant: amber numeral for overdue/warning
└── Used: Pipeline header, Money hub, Today hub

ProgressBar (components/ProgressBar.jsx)
├── Horizontal bar, filled portion
├── Colours: #1D6FF2 (normal), #D97706 (over capacity)
├── Over-capacity variant
└── Used: Today hub, Capacity meter, Rise Ladder

StackedBar (components/StackedBar.jsx)
├── Horizontal bar with proportional segments
├── Each segment: colour per role
├── Used: Aging buckets (Money), Pipeline states

RingGauge (components/RingGauge.jsx)
├── Circular progress ring
├── Centre: bold value (Bangla digits)
├── Stroke: 8px, gap: 4px
└── Used: Learn hub, Document Readiness

ArcGauge (components/ArcGauge.jsx)
├── Semi-circular gauge with needle
├── Fill: #1D6FF2 → #D97706 past 100%
├── Centre: "current / max" in bold
└── Used: Capacity Meter (Screen 20)

StepRail (components/StepRail.jsx)
├── Vertical rail: 32px circles + 2px connectors
├── States: completed (green tick), current (azure + glow), pending (hollow)
├── Labels: Bangla stage name + 13px description
└── Used: Rise Ladder (Screen 05), Payments Due ladder (Screen 19)
```

### Inputs & Controls
```
StepperField (components/StepperField.jsx)
├── Label + compact numeric stepper (−/+)
├── Value in Bangla digits
├── Validation: min/max/step
└── Used: Onboarding, Niche Scorer, Rate calculator, Settings

OTPBoxes (components/OTPBoxes.jsx)
├── 6 separate 48×56px boxes, 14px radius
├── Auto-advance, backspace navigation, paste distribution
├── Focus: #1D6FF2 outline
└── Used: Phone Verification (Screen 02)

DropdownChip (components/DropdownChip.jsx)
├── Frosted pill with chevron, opens BottomSheet
├── Selected: #1D6FF2 fill
└── Used: Currency, Channel, Job type, Marketplace

ToggleChip (components/ToggleChip.jsx)
├── Two/three frosted chips, one active
├── Active: #1D6FF2 (or violet for assistant)
└── Used: Assistant detail level, Proposal structure view
```

### Feedback & State
```
BottomSheet (components/BottomSheet.jsx)
├── 28px top radius, drag handle, backdrop
├── Full-width primary action (#1D6FF2)
├── Secondary: outlined or text button
└── Used: Add job, Add income, Add scope item, Confirm delete

FAB (components/FAB.jsx)
├── 56px, #1D6FF2, white plus icon
├── Position: fixed bottom-right above nav (24px gap)
└── Used: Pipeline, Money hub, Ledger, Proposals

WarnStrip (components/WarnStrip.jsx)
├── Amber-tinted frosted strip, #D97706 icon
├── Bangla text, optional action link
└── Used: Scope guard, Channel guide, Screener result, Settings

TodoChip (components/TodoChip.jsx)
├── #D97706 chip: "TODO — যাচাই বাকি"
├── 11px "সর্বশেষ যাচাই — DATE" caption
├── NEVER show estimate/average
└── Used: Marketplace figures, Incentive rate, Channel limits

EmptyState (components/EmptyState.jsx)
├── Illustration + Bangla text + primary action
├── Green tick for success empty (Payments Due)
└── Used: Pipeline, Ledger, Proposals, Payments Due

StatusChip (components/StatusChip.jsx)
├── Small pill: grey (awaiting), azure (active), blue-grey (delivered), amber (due), green (closed)
├── Left edge accent bar on parent card matches
└── Used: Pipeline cards, Job Detail header

Toast (components/Toast.jsx)
├── Frosted, auto-dismiss 3s, action optional
└── Used: Copied, Saved, Error states
```

### Specialised
```
ScoreRing (components/ScoreRing.jsx)
├── Large circular gauge (120px)
├── Arc: #1D6FF2, centre: bold score (Bangla digits)
├── Three slim sub-score bars beneath
└── Used: Niche Fit Scorer result (Screen 08)

CapacityGauge (components/CapacityGauge.jsx)
├── ArcGauge + verdict line + suggestion cards
└── Used: Capacity Meter (Screen 20)

PaymentLadder (components/PaymentLadder.jsx)
├── StepRail (4 steps) + PaleInset message + actions
├── Step tick only if reminderLog exists
└── Used: Payments Due (Screen 19), Job Detail (Screen 16)

ScopeGuardCard (components/ScopeGuardCard.jsx)
├── Split comparison: agreed vs extra
├── StackedBar (agreed #1D6FF2, extra #D97706)
├── Amber alert strip + extra items list + add sheet
└── Used: Scope & Revision Guard (Screen 17)

ProposalFunnel (components/ProposalFunnel.jsx)
├── Three descending bars: sent / replied / won
├── Derived rates (null if sent < 10)
├── Low-data info card variant
└── Used: Proposal Tracker (Screen 18)

IncomeProofSheet (components/IncomeProofSheet.jsx)
├── A4-proportioned white sheet in frosted frame
├── Header, summary, monthly table, channel table, mandatory footer
├── Print button → browser print-to-PDF
└── Used: Income Proof Pack (Screen 29)
```

---

## 3. Feature-Specific Components (features/*/)

Each feature owns its calculator (`*.calc.ts`), store (`*.store.ts`), and screen components.

```
features/
├── auth/
│   ├── PhoneEntry.jsx
│   ├── OtpEntry.jsx
│   └── auth.store.ts
├── onboarding/
│   ├── Welcome.jsx
│   ├── ProfileSetup.jsx
│   ├── PlacementTest.jsx
│   └── PlacementResult.jsx
├── home/
│   ├── TodayHub.jsx (Screen 04)
│   ├── MoneyAtStakeStrip.jsx
│   ├── CapacityBar.jsx
│   ├── TodayJobsList.jsx
│   └── RiseLadderStrip.jsx
├── ladder/
│   ├── RiseLadderScreen.jsx (Screen 05)
│   ├── LadderRail.jsx
│   ├── CriteriaRows.jsx
│   └── NextStepsCard.jsx
├── learn/
│   ├── LearnHub.jsx (Screen 06)
│   ├── ProgressRing.jsx
│   ├── FoundationRows.jsx
│   ├── PersonalArtifactCards.jsx
│   ├── MarketplaceCompare.jsx (Screen 07)
│   ├── NicheScorer.jsx (Screen 08)
│   ├── ProfileChecklist.jsx (Screen 09)
│   ├── ProposalLibrary.jsx (Screen 10)
│   ├── ConversationScripts.jsx (Screen 11)
│   ├── Plan90Days.jsx (Screen 12)
│   └── ProfileReview.jsx (Screen 13)
├── assistant/
│   ├── AssistantScreen.jsx (Screen 14)
│   ├── SituationChips.jsx
│   ├── InputCard.jsx
│   └── DraftResultCard.jsx
├── pipeline/
│   ├── PipelineBoard.jsx (Screen 15)
│   ├── PipelineHeader.jsx
│   ├── StateFilter.jsx
│   ├── JobCard.jsx
│   ├── JobDetail.jsx (Screen 16)
│   ├── ScopeGuard.jsx (Screen 17)
│   ├── ProposalTracker.jsx (Screen 18)
│   ├── PaymentsDue.jsx (Screen 19)
│   ├── CapacityMeter.jsx (Screen 20)
│   └── ClientScreener.jsx (Screen 21)
├── money/
│   ├── MoneyHub.jsx (Screen 22)
│   ├── IncomeLedger.jsx (Screen 23)
│   ├── TrueHourly.jsx (Screen 24)
│   ├── Runway.jsx (Screen 25)
│   ├── ChannelsGuide.jsx (Screen 26)
│   ├── IncentiveCalc.jsx (Screen 27)
│   ├── DocReadiness.jsx (Screen 28)
│   └── IncomeProof.jsx (Screen 29)
├── settings/
│   └── SettingsScreen.jsx (Screen 30)
└── lib/
    ├── money.ts (paisa formatting, Bangla digits)
    ├── dates.ts (Asia/Dhaka midnight, day diffs)
    ├── numerals.ts (toBnDigits, fromBnDigits)
    ├── i18n.ts (bn.json primary, en.json fallback)
    └── db.ts (Dexie instance + schema)
```

---

## 4. Static Data Files (data/)

All reference data is **hand-authored JSON**, never generated. Each has a unit test verifying exact match with spec.

```
data/
├── marketplaces.json          # Feature 1 — 5 marketplaces × 5 sections × figures
├── checklistItems.json        # Feature 3 — 12 items × 4 groups
├── proposalStructures.json    # Feature 4 — 5 job types × 6 parts + shared donts
├── conversationScripts.json   # Feature 5 — 5 situations × 3 levels
├── escalation.json            # Feature 8 — 4 steps × day ranges + level mapping
├── incentiveRules.json        # Feature 15 — eligibility rules + rates (TODO chips)
├── documentLists.json         # Feature 16 — 3 purposes × documents + expiry rules
├── screenerRules.json         # Feature 22 — 12 questions × rules + verdict bands
├── ladderCriteria.json        # Feature 18 — 4 stages × 3 criteria each
└── nicheScore.calc.ts         # Feature 2 — pure function + tests
```

---

## 5. i18n Structure

```
i18n/
├── bn.json  ← PRIMARY (all Bangla strings)
└── en.json  ← Secondary (English samples only, no UI labels)
```

**Rule:** No hardcoded strings in any component. Every user-facing string comes from `useI18n()`.

---

## 6. Component → Screen Mapping (Quick Reference)

| Screen | Key Components Used |
|--------|---------------------|
| 01 Welcome | GlassCard, FAB (primary button), PageDots |
| 02 Phone | GlassCard, OTPBoxes, DropdownChip (+880) |
| 03 Setup | GlassCard, RadioRows, StepperField, ChipStrip (currency) |
| 04 Today | GlassCard, StatTile, ProgressBar, ListRow, StepRail (mini) |
| 05 Ladder | GlassCard, StepRail, CriteriaRows, NextStepsCard |
| 06 Learn | GlassCard, RingGauge, ListRow, PersonalArtifactCards |
| 07 Marketplace | ChipStrip, SegmentedControl, GlassCard, TodoChip |
| 08 Niche | GlassCard, StepperField, DropdownChip, ScoreRing |
| 09 Checklist | GlassCard, ProgressBar, SegmentedControl, ExpandableRow |
| 10 Proposal | ChipStrip, GlassCard, PaleInset, WarnStrip (donts) |
| 11 Scripts | ChipStrip, SegmentedControl, GlassCard, PaleInset, WarnStrip (avoid) |
| 12 Plan | GlassCard, TagField, StepperField, ChipStrip, VioletInset |
| 13 ProfileReview | GlassCard, TextArea, VioletInset, ComparisonBlocks |
| 14 Assistant | VioletInset, SituationChips, InputCard, DraftResultCard |
| 15 Pipeline | StatTile, StateFilter, JobCard, FAB |
| 16 JobDetail | GlassCard, StepRail (mini), SegmentedControl, StatusChip, FAB |
| 17 ScopeGuard | ScopeGuardCard, BottomSheet (add item) |
| 18 Proposals | ProposalFunnel, SegmentedControl, GroupStatsRows, ListRow |
| 19 Payments | GlassCard, StackedBar (aging), PaymentLadder, EmptyState |
| 20 Capacity | ArcGauge, JobLoadRows, SuggestionCards |
| 21 Screener | GlassCard, ProgressBar, QuestionCard, ResultCard |
| 22 Money | GlassCard, BarChart (12 cols), StatTile, ListRow, FAB |
| 23 Ledger | GlassCard, MonthHeaders, LedgerRow, FAB, BottomSheet (add) |
| 24 Rate | GlassCard, DropdownChip, StepperField, ComparisonCard |
| 25 Runway | GlassCard, BarChart, StepperField, ResultCards |
| 26 Channels | GlassCard, ExpandableCard (4 sections), WarnStrip |
| 27 Incentive | GlassCard, ProgressBar, QuestionCard, ResultCard |
| 28 Docs | RingGauge (×3), SegmentedControl, DocumentRow, WarnStrip |
| 29 Proof | GlassCard, ChipStrip, IncomeProofSheet |
| 30 Settings | GlassCard, AvatarRow, ValueRows, ToggleRows, DangerButton |

---

## 7. Build Rules

1. **One component, one file** — no barrel exports for components
2. **Shared first** — build `components/ui/*` before any feature screens
3. **Calculators pure** — `*.calc.ts` have zero UI deps, unit tested
4. **Stores feature-scoped** — Zustand store per feature, no global store
5. **Data hand-authored** — every JSON in `data/` has a `__tests__/*.test.ts`
6. **i18n mandatory** — `t('key')` everywhere, `bn.json` is source of truth
7. **No colour literals** — use Tailwind tokens (`bg-brand`, `text-warn`, etc.)