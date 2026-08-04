# COMPONENT_TREE.md — "Learn English" UI component inventory

> Where every component lives, what already exists in the monolith, what must be created, and how the tree is organized.
> Rule: **never duplicate.** If a component exists, update it. New shared components go in `resources/js/components/`; new primitives go in `resources/js/components/ui/`.

---

## 1. Directory conventions (existing)

```
resources/js/
├── app.jsx                     # Inertia bootstrap (unchanged)
├── components/                 # Shared feature components
│   ├── ui/                     # Primitives (button, sheet, input, skeleton, dialog)
│   ├── FlashMessages.jsx
│   └── ...
├── layouts/
│   ├── AdminShell.jsx          # ADMIN ONLY — do not modify
│   └── LearnerShell.jsx        # [NEW] 5-tab app shell for the learner app
├── lib/
│   ├── utils.js                # cn() — reuse everywhere
│   └── format.js               # [NEW] toBnDigits(), date helpers (extract from VerifyOtp)
└── pages/
    ├── Admin/**                # ADMIN ONLY — do not modify
    ├── Auth/PhoneLogin.jsx     # EXISTS (Stitch screen 02)
    ├── Auth/VerifyOtp.jsx      # EXISTS (Stitch screen 03)
    ├── Profile/Index.jsx       # EXISTS (Stitch screen 28, incl. bottom nav)
    ├── Feed/Articles/…         # existing public content pages
    └── Learner/**              # [NEW] new learner screens per PAGE_MAP.md
```

---

## 2. Component tree (target state)

```
LearnerShell (layout: top bar + bottom nav OR session chrome)
├── TopBar                       # back/close X + title + right actions (streak chip, counters)
│   ├── StreakChip
│   └── LevelChip / CounterChip
├── BottomNav                    # 5 tabs; centre = elevated violet AI button
│   ├── NavItem (icon + label; active = primary)
│   └── AiCenterButton (violet circle, elevated)
├── <Outlet/page content>
│   ├── HubTile / FeatureCard    # white card + icon square + title + subtitle + progress + chevron
│   ├── StatusChip               # offline / internet-lagbe / সম্পন্ন / level chips
│   ├── Chip                     # filters, levels, topics, speed — selected = filled primary
│   ├── ProgressBar              # linear (thin) + segmented (5-part) variants
│   ├── BottomSheet              # word meaning, confirmation, time picker (wrap ui/sheet)
│   ├── AnswerRow                # 56px option row w/ letter circle + selected state
│   ├── SessionShell             # full-screen focused flows (no bottom nav)
│   ├── NoticeStrip              # amber connectivity / info strips
│   ├── Callout                  # lesson explanation box (light blue, 3px primary border)
│   ├── ScoreRing                # circular score (placement result, quiz result, pronunciation)
│   ├── StatPill                 # small stat pills (result summaries)
│   ├── EmptyState               # localized empty states (never blank lists)
│   └── Toast                    # save/confirm feedback
```

---

## 3. Existing components — reuse, don't recreate

| Existing | Location | Reuse as |
|----------|----------|----------|
| `Button` + `buttonVariants` (cva) | `components/ui/button.jsx` | Primary/outline/secondary buttons. Add a **learner size** (`h-[52px]`, full-width, `rounded-learn-button`) via a new variant/size or a wrapper — do **not** edit admin usage. |
| `Sheet` (Radix) | `components/ui/sheet.jsx` | Base for the `BottomSheet` component (side="bottom", top radius 20px, grab handle). |
| `Input` | `components/ui/input.jsx` | Text inputs; learner styling via className overrides. |
| `Skeleton` | `components/ui/skeleton.jsx` | Loading placeholders. |
| `Dialog` (Radix) | `components/ui/dialog.jsx` | Reserved for **admin**; learner app uses BottomSheet instead. |
| `FlashMessages` | `components/FlashMessages.jsx` | Success/error flash strips (already styled inline in learner pages — can stay). |
| `cn()` | `lib/utils.js` | Class merging everywhere. |
| `toBnDigits()` (inline in `VerifyOtp.jsx`) | — | **Extract** to `lib/format.js`, reuse in all learner screens (Bengali numerals rule). |
| `material-symbols-outlined` | loaded in `app.blade.php` | Icon set for learner UI (see DESIGN_SYSTEM §7). |

---

## 4. Components to create (new — no duplicates exist)

Each is a small, prop-driven presentational component in `components/` (feature-agnostic) unless noted.

| Component | Purpose | Key props / variants |
|-----------|---------|----------------------|
| `LearnerShell` (layout) | 5-tab bottom nav + top bar chrome for all non-session pages | `title`, `showBack`, `streak`, `activeTab`, `right` (slot) |
| `TopBar` | Back/close X, centered title, right slot | `variant: "back" \| "close"`, `title`, `right` |
| `BottomNav` | 5 items; centre violet elevated AI button | `active: "home"\|"learn"\|"ai"\|"practice"\|"profile"` |
| `StreakChip` | Flame + Bengali digits on amber pill | `days: number` |
| `Chip` | Filter/level/topic/speed selection | `selected`, `icon?`, `lock?` |
| `StatusChip` | Offline / internet-lagbe / completed / level | `tone: "grey"\|"amber"\|"green"\|"blue"\|"violet"` |
| `ProgressBar` | Thin linear + segmented (5) | `value`, `segments?`, `filled` |
| `BottomSheet` | Non-modal sheet from bottom | wraps `ui/sheet`; `title?`, `children`, `onClose` |
| `SessionShell` | Full-screen focused session chrome | `title`, `progress`, `counter`, `primaryAction`, `children` |
| `AnswerRow` | Quiz/exercise option row | `letter`, `label`, `selected`, `state: "idle"\|"correct"\|"wrong"` |
| `ScoreRing` | Circular score display | `score: "8/10" \| "৮২%"`, `tone` |
| `Callout` | Lesson explanation box | 3px primary left border, light blue fill |
| `NoticeStrip` | Amber "internet required" / info | `tone: "warn"\|"info"`, `icon`, `text` |
| `StatPill` | Result summary pills | `label`, `tone: "danger"\|"warn"\|"ai"` |
| `EmptyState` | Localized empty message + action | `message`, `actionLabel?`, `onAction?` |
| `Toast` | Confirmation feedback | `message`, `tone` |

### Feature-scoped components (inside `pages/Learner/<feature>/`, built when that screen is implemented)

- Lesson: `LessonRow`, `ExerciseChoice`, `FillBlank`, `SegmentIndicator`
- Vocab: `Flashcard` (front/back), `RatingBar` (জানি না / কঠিন / জানি)
- Reading: `TappableWord`, `GlossarySheet` (BottomSheet-based)
- Grammar: `RuleCard`, `ExampleRow`, `MistakeRow`
- Quiz: `QuizQuestionCard`, `SkillBar`, `TimerChip`
- AI: `AiBubble`, `CorrectionCard`, `ScenarioTile`, `SegmentedControl`
- Practice: `PlayCircle`, `PlaybackRow`, `Waveform`, `DraftRow`, `PhraseRow`
- Profile: `StatBlock`, `SettingsRow` (already inline in `Profile/Index.jsx` — extract when reusing elsewhere)

---

## 5. Component → screen usage matrix (key screens only)

| Component | 07 Home | 08 Learn | 09 Path | 14 Cards | 17 AI | 21 Pron. | 25 Quiz | 28 Profile |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| LearnerShell + BottomNav | ✅ | ✅ | ✅ | – | ✅ | ✅ | – | ✅ |
| SessionShell | – | – | – | ✅ | – | – | ✅ | – |
| Chip / StatusChip | ✅ | ✅ | ✅ | – | ✅ | ✅ | ✅ | ✅ |
| ProgressBar | ✅ | ✅ | ✅ | ✅ | – | – | ✅ | – |
| BottomSheet | ✅ | – | – | – | – | – | – | – |
| AnswerRow | – | – | ✅ | – | – | – | ✅ | – |
| StreakChip | ✅ | ✅ | – | – | – | – | – | – |
| ScoreRing | – | – | – | – | – | ✅ | ✅ | – |

---

## 6. Anti-patterns to avoid

- ❌ Re-creating `Button`/`Sheet`/`Input` — extend the existing primitives.
- ❌ Copying the inline `toBnDigits()` into each page — use `lib/format.js`.
- ❌ Hardcoding new hex values — use `learn-*` tokens (see DESIGN_SYSTEM §4).
- ❌ Adding bottom navigation to session screens (lessons, quiz, cards, chat, reading).
- ❌ Touching `AdminShell.jsx`, `pages/Admin/**`, or admin-only components.
