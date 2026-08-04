# DESIGN_SYSTEM.md — "Learn English" (I Learn English)

> Source of truth: `ai/stitch/ui-prompt.txt` (UI blueprint, 31 screens) and `ai/stitch/requirement.txt` (feature spec, 16 features).
> This document defines the **design language** for the redesigned learner app and how to implement it **inside the existing Laravel 12 + Inertia + React 19 + Tailwind v4 monolith** — without touching the admin panel or the backend.

---

## 1. Product & design philosophy

"Learn English" is a Bangla-first, mobile-first English-learning **PWA** for learners in Bangladesh. The interface language is **Bangla**; learning content (sentences, words, passages, questions) is **English**.

Seven design principles from the Stitch blueprint:

| # | Principle | What it means in UI |
|---|-----------|---------------------|
| 1 | **Daily loop first** | The Home tab shows *today's state* (lesson, due cards, word of the day, streak) — not a feature list. |
| 2 | **One screen, one task** | Exactly one clear primary button per screen, reachable by thumb (bottom area). |
| 3 | **Honest status badges** | Every feature states up front whether it works offline ("অফলাইন") or needs internet ("ইন্টারনেট লাগবে"). |
| 4 | **AI has its own color** | Violet `#7C6BF5` is reserved **exclusively** for AI features — never anywhere else. |
| 5 | **Step-by-step onboarding** | Onboarding asks only name, goal, daily minutes. |
| 6 | **Mobile-native patterns** | Bottom sheets (never modals), horizontal chip strips (not long lists), no bottom nav on focused session screens. |
| 7 | **Accessibility floor** | Text ≥ 13px, touch targets ≥ 48×48px, icons paired with text labels, high contrast. |

Character: **clean, friendly, encouraging, trustworthy** — a study tool, not a game.

---

## 2. Stack mapping (Stitch spec → existing monolith)

| Stitch spec | Existing monolith | Decision |
|-------------|-------------------|----------|
| React + Vite + Tailwind | React 19, Vite 7, Tailwind v4 (`@tailwindcss/vite`, CSS-first `@theme` in `resources/css/app.css`) | ✅ Reuse as-is |
| Routing | Inertia 2 server-driven routing (`routes/web.php`, `createInertiaApp`) | ✅ Reuse — add routes when backend lands; UI phases render via Inertia pages |
| Icons: lucide-react | `lucide-react` installed (used by admin) **and** Material Symbols (Google font, used by already-migrated learner pages) | ⚠️ Decision: **keep Material Symbols** for the learner UI (consistency with migrated pages, already loaded in `app.blade.php`). lucide-react remains available for components needing dynamic icon maps. |
| Fonts: Noto Sans Bengali + neutral sans | Noto Sans Bengali + Inter already loaded via Google Fonts in `resources/views/app.blade.php` | ✅ Keep for UI phase; self-hosting/subsetting is a PWA/offline concern (later phase) |
| PWA (vite-plugin-pwa, offline) | Not present | 🔒 Deferred — backend/PWA phase, not UI phase |
| IndexedDB/Dexie | Not present | 🔒 Deferred — data layer, not UI phase |
| Firebase Phone Auth | Existing MSISDN + OTP backend (`/login`, `/login/send-otp`, `/login/verify`) | ✅ **Backend is the source of truth** — do NOT replace. Only restyle UI. |
| zod, Vitest, Node proxy | Not present | 🔒 Deferred |

---

## 3. Color palette & strict role rules

All values are verbatim from the Stitch master style prompt. **Colors are role-locked** — using a color for the wrong purpose is a design violation.

| Role | Token | Hex | Used ONLY for |
|------|-------|-----|---------------|
| Primary | `--learn-primary` | `#2B59C3` | Primary buttons, active tab, progress bars, selected states |
| Primary Dark | `--learn-primary-dark` | `#1E3F8F` | Gradients, pressed states |
| Background | `--learn-bg` | `#F6F7FB` | Screen background; cards are white |
| Ink | `--learn-ink` | `#14172B` | Headings & body text |
| Grey (secondary) | `--learn-muted` | `#6B7280` | Secondary/helper text, inactive icons |
| Border | `--learn-border` | `#E2E6EE` | Card/input borders |
| Disabled | `--learn-disabled` | `#C9CED6` | Disabled buttons |
| AI Violet | `--learn-ai` | `#7C6BF5` | **Only** AI features: centre nav button, AI chips, AI cards, AI bubbles, AI buttons |
| Success | `--learn-success` | `#17A673` | **Only** correct answers, completed lessons, streak marks |
| Danger | `--learn-danger` | `#E5484D` | **Only** wrong answers, incorrect examples, destructive actions (delete, logout) |
| Warn | `--learn-warn` | `#F5A524` | **Only** connectivity notices, weakest-skill tag, timers |
| Info | `--learn-info` | `#3B82F6` | Informational strips & links |

### Semantic tint backgrounds (used across screens)

| Tint | Usage |
|------|-------|
| Light blue `#EAF0FC` | Callout box (lesson explanation), selected answer fill, skill bars |
| Very light red | Mistake example rows / error strips |
| Very light amber | Connectivity notice strip, "weakest skill" suggestion card |
| Light green pill | "পড়া হয়েছে" (read) chips, completed chips |
| Light violet | AI cards, AI avatar, scenario tiles |
| Light grey `#F3F4F6` | Structure/monospace strip, pressed hovers |

---

## 4. Design tokens → Tailwind v4 implementation

Tailwind v4 is CSS-first. Add the tokens **namespaced** (`learn-*`) to `@theme` in `resources/css/app.css` so they never collide with the existing shadcn/admin theme (`--primary`, `--background`, …) or the server-driven brand colors.

```css
/* resources/css/app.css — append inside the existing @theme { … } block */
@theme {
  /* Learn English (Stitch) palette — namespaced, role-locked */
  --color-learn-primary: #2B59C3;
  --color-learn-primary-dark: #1E3F8F;
  --color-learn-bg: #F6F7FB;
  --color-learn-ink: #14172B;
  --color-learn-muted: #6B7280;
  --color-learn-border: #E2E6EE;
  --color-learn-disabled: #C9CED6;
  --color-learn-ai: #7C6BF5;
  --color-learn-success: #17A673;
  --color-learn-danger: #E5484D;
  --color-learn-warn: #F5A524;
  --color-learn-info: #3B82F6;

  --color-learn-primary-tint: #EAF0FC;
  --color-learn-ai-tint: #F0EDFF;
  --color-learn-success-tint: #E6F6F0;
  --color-learn-danger-tint: #FDEBEC;
  --color-learn-warn-tint: #FEF4E1;
  --color-learn-structure: #F3F4F6;

  /* Radius */
  --radius-learn-card: 14px;
  --radius-learn-button: 14px;
  --radius-learn-sheet: 20px;
  --radius-learn-flashcard: 20px;

  /* Fonts */
  --font-learn-bn: 'Noto Sans Bengali', ui-sans-serif, system-ui, sans-serif;
  --font-learn-en: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

Usage: `bg-learn-bg`, `text-learn-ink`, `bg-learn-primary`, `rounded-learn-card`, `font-learn-bn`, etc.

> **Note on existing migrated pages** (`Auth/PhoneLogin.jsx`, `Auth/VerifyOtp.jsx`, `Profile/Index.jsx`) use inline hex values. They already match the palette exactly. During the UI phase, optionally refactor them to tokens; it is not blocking.

---

## 5. Typography

| Role | Size | Weight | Font | Color |
|------|------|--------|------|-------|
| Screen heading | 22px | Bold | Bangla | ink `#14172B` |
| English lesson/question text | 20px | Bold | English | ink |
| English word on flashcard | 34px | Bold | English | ink |
| Bangla meaning (revealed card) | 28px | Bold | Bangla | ink |
| Section label | 16px | Semibold | Bangla | ink |
| Body | 15px | Regular | Bangla | ink |
| Secondary / helper | 13px | Regular | Bangla | muted `#6B7280` |
| Reading passage | 17px, line-height 1.7 | Regular | English | ink |

Rules:
- **Nothing below 13px.**
- Bangla in `Noto Sans Bengali`; English *learning content* always set in the Latin font (Inter).
- **Numbers shown to the user use Bengali numerals** (০১২৩৪৫৬৭৮৯). Code & storage use ASCII digits + ISO dates (`YYYY-MM-DD`). A shared `toBnDigits()` helper already exists inline in `VerifyOtp.jsx` — extract it to `resources/js/lib/format.js` (do not duplicate).

---

## 6. Layout, spacing, elevation

- **Canvas:** mobile-first `390×844`, safe areas respected. Existing migrated pages center content with `max-w-[390px]` (login/OTP) or `max-w-md` (profile). Keep this pattern.
- **Side padding:** 20px horizontal. **Gaps:** 16px between cards, 12px between list rows, 12px between stacked answer cards.
- **Corners:** card 14px · button 14px · bottom sheet top 20px · flashcard 20px · OTP boxes 12px · message bubbles 16px.
- **Shadows:** soft, diffuse, low opacity (`0px 4px 12px rgba(20,23,43,0.04)` — already used in migrated pages). Use for separation, never drama.
- **Touch targets:** minimum 48×48px. Primary buttons: **52px tall, full-width**.
- **Answer rows:** 56px tall, full-width, letter circle + option text; selected = 2px primary border + light blue fill.
- **Session shell:** close X + progress + counter top bar; single primary action bottom; **no bottom navigation** on lessons, quizzes, flashcards, chat, reading.

### Desktop adaptation (from Stitch "এরপর কী")
Same structure; move the 5-tab bottom navigation into a left sidebar; cap content width at **960px**.

---

## 7. Icons

- Rounded **outline** style, 2px stroke, consistent 24px. No filled emoji.
- Convention for the learner UI: **Material Symbols Outlined** (already loaded in `app.blade.php` and used by all three migrated pages). Keep `font-variation-settings` fills only where the design shows a filled state (e.g., active tab, centre AI button, star).
- lucide-react is available for shared components that need mapped/dynamic icons (e.g., feature tiles) — same outline aesthetic.

---

## 8. Motion & micro-interactions

| Interaction | Spec |
|-------------|------|
| Button press | `active:scale-95` / `active:scale-[0.98]` (~150ms) |
| Page content enter | `animate-fade-in` (240ms ease-out, slight translateY) — exists in `app.css` |
| Sheet open | Slide from bottom, 20px top radius, grab-handle bar |
| Answer feedback | Immediate correct/incorrect colour + one-line Bangla explanation |
| Streak / progress | Steady transitions, no celebratory animation noise |

---

## 9. Accessibility & conventions

- Min text 13px; min touch target 48×48px; primary buttons 52px tall.
- Every action = icon + text label (never icon-only).
- High contrast; **no colour-only meaning** — every state also has an icon/label (e.g., locked = lock icon + 50% opacity, complete = check icon).
- All user-facing strings in Bangla (via a future `i18n` dictionary — currently strings are inline in migrated pages; centralize when practical).
- Platform honesty: iOS background notifications are unreliable → show the localized notice; speech recognition may be unavailable → show compare-only mode up front. Never fake scores or sample data.

---

## 10. Design do / don't

| ✅ Do | ❌ Don't |
|-------|----------|
| Use violet `#7C6BF5` only for AI surfaces | Use violet for non-AI elements |
| Use green `#17A673` only for correct/completed | Use green for branding |
| Use red `#E5484D` only for wrong/destructive | Use red for normal links |
| Use amber `#F5A524` only for connectivity/weakest-skill/timers | Use amber as a general accent |
| Use bottom sheets for word meaning, confirmations, time pickers | Use modal dialogs in the learner app |
| Hide the bottom nav on focused session screens | Show nav during lessons/tests/cards/chat/reading |
| Keep 5 tabs maximum | Add a 6th tab; new features nest inside a hub |
| Keep backend + admin untouched | Rename/replace routes, controllers, models, tables |
