# IMPLEMENTATION_PLAN.md — UI-only migration plan

> **Phase scope:** UI only. No backend, no database, no controllers/models, no new APIs, no auth changes, no migrations.
> The existing Laravel project, its routes, controllers, models and **the admin panel** are the source of truth and must not be replaced, renamed, or duplicated.
> Build order follows the Stitch blueprint's recommended sequence ("এরপর কী"), adapted to the monolith.

---

## Guiding rules (non-negotiable)

1. Reuse `resources/js` — never create a new frontend folder or project.
2. If a page/component exists, **replace/update its UI**; never create a duplicate.
3. New learner screens live under `resources/js/pages/Learner/…`; new shared components under `resources/js/components/…`.
4. Admin (`pages/Admin/**`, `AdminShell.jsx`, `/admin/**` routes) — **untouched**.
5. Backend (`routes/web.php`, controllers, Blade feed views) — **untouched** during UI phase. New routes/controllers are added in a later phase; UI pages are written to be props-driven so they can be wired up later.
6. Do not generate React code until approved — this plan is the approval gate per phase.

---

## Phase 0 — Design tokens & foundation

**Goal:** make the Stitch palette, fonts, and radii available to every learner page without disturbing the admin theme.

- [ ] Add namespaced `learn-*` tokens to `@theme` in `resources/css/app.css` (see DESIGN_SYSTEM §4).
- [ ] Create `resources/js/lib/format.js` with `toBnDigits()` (extracted from `VerifyOtp.jsx`) + Asia/Dhaka day helpers.
- [ ] Optionally refactor `PhoneLogin.jsx`, `VerifyOtp.jsx`, `Profile/Index.jsx` inline hex values → `learn-*` tokens (visual change = none).

**Acceptance:** a learner page using `bg-learn-bg`, `text-learn-ink`, `bg-learn-primary` compiles in `npm run dev`; admin pages look unchanged.

---

## Phase 1 — Shared components & app shell

**Goal:** build the design-system components and the 5-tab shell once; every screen after this is composition.

- [ ] Primitives: extend `Button` with a 52px full-width learner size; build `Chip`, `StatusChip`, `ProgressBar` (linear + segmented), `StreakChip`, `AnswerRow`, `ScoreRing`, `Callout`, `NoticeStrip`, `StatPill`, `EmptyState`, `Toast`.
- [ ] `BottomSheet` wrapping `ui/sheet` (side bottom, 20px top radius, grab handle).
- [ ] `SessionShell` for focused full-screen flows (close X + progress + counter, single primary action, no bottom nav).
- [ ] `LearnerShell` layout: `TopBar` + `BottomNav` (5 tabs; centre elevated violet AI button). Wire it into new pages via Inertia layouts (Inertia 2 supports per-page `layout`).

**Acceptance:** a dummy hub page under `LearnerShell` shows all 5 tabs with correct active state; session screens render without the nav.

---

## Phase 2 — Onboarding flow (screens 01, 04, 05, 06)

*02 & 03 already exist.*

- [ ] 01 Welcome & Language (`/welcome`).
- [ ] 04 Profile Setup (`/welcome/profile`).
- [ ] 05 Placement Test (session screen, 15 questions, counter + progress).
- [ ] 06 Placement Result (score ring, skill bars, weakest-skill amber tag, AI plan card).

**Acceptance:** visual match to `ui-prompt.txt` screens 01/04/05/06 (colours, 52px buttons, Bengali numerals, no bottom nav, session chrome on 05).

---

## Phase 3 — Home Hub + the five hub screens

**Goal:** give the whole app structure for first review (Stitch order: 07, 08, 17, 20, 28).

- [ ] 07 Home Hub — resolve `/` vs `/home` + the missing `Feed/Index.jsx` (PAGE_MAP §3). Build the daily-loop card stack (today's lesson, word of the day, due cards, weekly progress, suggestions, reminder row).
- [ ] 08 Learn Hub (`/learn`), 17 AI Scenario Picker (`/ai`, amber internet notice, segmented control, 2×3 scenario grid), 20 Practice Hub (`/practice`, offline badges + amber "scoring needs net" on pronunciation), 28 Profile (`/profile` — exists; align remaining details with the design, e.g. the two extra stat blocks are already present).

**Acceptance:** all five tabs navigate between real screens; AI violet used only on the AI tab; honest status chips everywhere.

---

## Phase 4 — Core learning flows (09–16)

- [ ] 09 Lesson Path (units with status circles, locked states).
- [ ] 10 Lesson Player (SessionShell: explanation callout → examples → 3 exercises with instant correct/wrong feedback).
- [ ] 13 Vocabulary Decks + 14 Flashcard Review (SessionShell; card flip; 3 rating buttons জানি না/কঠিন/জানি).
- [ ] 11 Grammar Library (search + category chips) + 12 Rule Detail (5 fixed blocks, green/red only for correct/mistakes).
- [ ] 15 Reading List + 16 Reading Reader (SessionShell; tappable glossary words, BottomSheet word card, WPM chip).

**Acceptance:** session screens have no bottom nav; lock/unlock and progress states render from props; offline badges present.

---

## Phase 5 — AI & practice surfaces (17–19, 21–27)

- [ ] 18 AI Chat (violet bubbles, correction card, hint chips, mic + send input) and 19 AI Writing Feedback (two-tab segmented control, results pills, correction cards).
- [ ] 21 Pronunciation (mode chips, play/mic circle, score ring, playback rows), 22 Listening (segmented dictation/comprehension, speed pills, word-by-word result).
- [ ] 23 Writing Desk (prompt list → full-screen editor with structure panel, autosave indicators, AI feedback button gated on connectivity).
- [ ] 24 Quiz Center (3 test cards + recent results) + 25 Quiz Session (timer chip, result state with per-mistake cards).
- [ ] 26 Phrasebook (situation chips, phrase rows, star favorites), 27 Mistake Doctor (input card, correction card, common-mistake chips, AI escape hatch button).

**Acceptance:** every "internet needed" surface states it before use (amber strip or disabled button with reason); red/green only for wrong/correct.

---

## Phase 6 — Profile & settings (29–31)

- [ ] 29 Progress Dashboard (skill bars, streak calendar, weekly bar chart, weakest-skill suggestion).
- [ ] 30 AI Study Plan (setup state with 3 prefilled rows → 30-day plan view, checkbox days).
- [ ] 31 Settings & Reminder (grouped blocks, toggle, day chips, iOS notice + calendar export, destructive rows red).

**Acceptance:** destructive rows use `learn-danger`; toggle state and day chips match the design; nothing below 13px.

---

## Phase 7 — Responsive, QA & handoff

- [ ] Desktop adaptation: 5-tab bottom nav → left sidebar, content max-width 960px.
- [ ] Verify all screens against `ui-prompt.txt` (colours, spacing, 48px targets, Bengali numerals, icon+label actions).
- [ ] Optional PWA groundwork only if approved (manifest, theme colour `#2B59C3`, font self-hosting) — otherwise defer to the backend phase.
- [ ] Remove legacy Blade UI (`home.blade.php`, `layouts/app.blade.php`, `subscribe.blade.php`) only once every screen it powers has been replaced.

**Acceptance checklist (from Stitch final QA, UI portion):**
- Accessibility: 48px touch targets, ≥13px text, icon+label on every action, no colour-only meaning.
- All numbers in Bengali numerals; storage/ISO in ASCII (code-side).
- No fake scores/sample data; empty states always localized.
- `npm run build` completes without errors; admin screens visually unchanged.

---

## Verification commands

```bash
npm run dev        # local dev (Vite HMR disabled in this repo — manual refresh)
npm run build      # production build — must pass after each phase
```

(No test suite is required for the UI phase; visual acceptance is per screen against `ai/stitch/ui-prompt.txt`.)

---

## Suggested execution order (batches)

| Batch | Work |
|-------|------|
| 1 | Phase 0 + Phase 1 (tokens, components, LearnerShell) |
| 2 | Phase 2 (onboarding) + Phase 3 (home + hubs) → first full review |
| 3 | Phase 4 (core learning flows) |
| 4 | Phase 5 (AI + practice) |
| 5 | Phase 6 (profile/settings) + Phase 7 (responsive/QA) |

Build one screen at a time, in screen-number order — never two at once (Stitch guidance). After each batch, run `npm run build` and review in the browser against the blueprint.

---

## Out of scope (later phases)

AI proxy (`/api/chat`, `/api/writing`, `/api/plan`), data files (`curriculum.json`, `grammar.json`, etc.), IndexedDB/Dexie, PWA service worker, offline caching, reminders scheduling, exports, Firebase identity. The backend team will implement these behind the props-driven UI defined in this phase.
