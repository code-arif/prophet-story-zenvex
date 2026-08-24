# DESIGN_SYSTEM.md — easy rise (ইজি রাইজ)

> Single source of truth for the visual language. Every screen, component, and token in this app must conform to this document. No exceptions.

---

## 1. Canvas & Foundation

| Property | Value |
|----------|-------|
| **Canvas** | 390 × 844 (mobile-first) |
| **Background** | Gradient `#EEF3FF` → `#F7F9FF` with 2–3 large blurred colour blobs (azure `#1D6FF2`, violet `#6D28D9`, occasional warm blush) behind all content |
| **Glass surface** | `rgba(255,255,255,0.92)` + `backdrop-filter: blur(18px)` |
| **Opacity floor** | **88% minimum** — Bengali conjuncts break below this. Never go lower. |
| **Corner radius** | 24px default · 28px tall primary cards · 20px list rows |
| **Border highlight** | 1px `rgba(255,255,255,0.7)` top-left edge |
| **Shadow** | `0 8px 32px rgba(14,22,38,0.08)` soft wide low-opacity |
| **Gutters** | 16px horizontal |
| **Card gaps** | 14px vertical between cards |
| **Card padding** | 16px internal |

---

## 2. Colour Palette — Strict Role Restrictions

| Role | Hex | Usage — **AND ONLY THESE** |
|------|-----|----------------------------|
| **Primary · azure** | `#1D6FF2` | Primary actions, active tab, progress fill, selected state |
| **Primary dark** | `#0B3FA8` | Pressed state, heading dark variant |
| **AI · violet** | `#6D28D9` | **AI surfaces ONLY** — centre nav button, assistant screen, plan/profile-review generation controls. Nowhere else. |
| **Success · green** | `#16A34A` | Completed, met, verified states ONLY |
| **Warning · amber** | `#D97706` | Warnings, lateness, overage, unverified figures ONLY |
| **Danger · red** | `#DC2626` | **Destructive actions ONLY** — exactly one screen: Settings → Delete All Data |
| **Info** | `#0284C7` | Informational icons, explanatory cards |
| **Ink** | `#0E1626` | Primary text |
| **Muted** | `#64748B` | Secondary text, inactive icons, captions |
| **Background** | `#EEF3FF` → `#F7F9FF` | Gradient canvas, behind blurred blobs |
| **Inset · pale blue** | `#EDF3FF` | English sample messages, inline chip interiors |
| **Inset · pale violet** | `#F3EFFF` | Assistant screen draft block & background glow ONLY |
| **Border · rest** | `#E2E8F0` | Input field borders at rest |
| **Outline · inactive** | `#CBD5E1` | Unreached step hollow circles, inactive outlines |

**No other colour value may appear anywhere in the app.**

---

## 3. Typography

| Element | Font | Size | Weight | Colour |
|---------|------|------|--------|--------|
| **Bangla (all strings)** | Noto Sans Bengali | — | — | — |
| **Latin & numerals** | Inter (or geometric sans equivalent) | — | — | — |
| **Heading** | — | 22–34px | Bold | `#0E1626` |
| **Body** | — | 15px | Regular | `#0E1626` |
| **Secondary** | — | 13px | Regular | `#64748B` |
| **Caption** | — | 12px | Regular | `#64748B` |
| **English samples** | Inter | 14–15px | Regular | `#64748B` (in `#EDF3FF` inset) |
| **Minimum readable** | — | **13px** | — | — |

**Rules:**
- Bangla is always the primary label at full size and weight
- English is smaller and `#64748B` — except inside client-facing message samples (full size in `#EDF3FF` inset)
- **Numerals shown to user render in Bangla digits** (`toBnDigits()`); storage uses ASCII digits + ISO dates

---

## 4. Spacing & Sizing

| Token | Value |
|-------|-------|
| **Gutter** | 16px |
| **Card vertical gap** | 14px |
| **Card internal padding** | 16px |
| **Button height** | 56px |
| **Button radius** | 18px |
| **Touch target minimum** | 48×48px |
| **Icon container** | 40–44px rounded-square (2px stroke) |
| **List row icon** | 24px rounded outline, 2px stroke |

---

## 5. Navigation Chrome (Global)

Present on **every screen except onboarding (01–03) and settings (30)**.

### Top Bar
- Translucent frosted strip (`backdrop-blur`)
- Left: Screen title in **bold Bangla** (`#0E1626`)
- Right: Settings gear icon (`#64748B`)
- Height: 56px (14 × 4)

### Bottom Navigation (5 tabs)
| Tab | Icon | Key | Active colour | Inactive colour |
|-----|------|-----|---------------|-----------------|
| আজ | Home | `home` | `#1D6FF2` + filled dot | `#64748B` |
| শেখা | BookOpen | `learn` | `#1D6FF2` + filled dot | `#64748B` |
| সহায়ক | Sparkles | `ai` | **Elevated circular `#6D28D9`** | `#64748B` |
| কাজ | Briefcase | `work` | `#1D6FF2` + filled dot | `#64748B` |
| টাকা | Wallet | `money` | `#1D6FF2` + filled dot | `#64748B` |

- Centre tab (`সহায়ক`) is **always elevated violet `#6D28D9`** with sparkle icon — the only place violet appears in chrome
- Active item: `#1D6FF2` with small filled dot beneath
- Inactive items: `#64748B`

### Desktop Adaptation (Phase 7+)
- Bottom nav → left sidebar (same 5 sections, same order)
- Centre button becomes prominent sidebar item retaining violet treatment
- Content column max-width 960px

---

## 6. Component Inventory (Shared)

Each component is built **once** and reused across all features.

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| **GlassCard** | Frosted glass card (92% opacity, 24px radius, highlight, shadow) | `tall` (28px), `row` (20px) |
| **ListRow** | 76px row with 44px tinted icon container, title, subtitle, trailing pill/chevron | — |
| **SegmentedControl** | Frosted pill segments, single/multi-select | — |
| **ChipStrip** | Horizontally scrollable frosted pills with icons | — |
| **StepperField** | Label + compact numeric stepper (increment/decrement) | — |
| **RingGauge** | Circular progress ring with centre value | — |
| **ArcGauge** | Semi-circular gauge with needle | — |
| **ProgressBar** | Horizontal bar with filled portion | `over` (amber fill) |
| **StackedBar** | Horizontal bar with proportional segments | — |
| **StepRail** | Vertical step rail with circles + connectors | — |
| **BottomSheet** | 28px top radius, drag handle, full-width actions | — |
| **FAB** | 56px floating action button, `#1D6FF2`, plus icon | — |
| **PaleInset** | `#EDF3FF` block for English sample text, copy icon | — |
| **VioletInset** | `#F3EFFF` block for assistant drafts ONLY | — |
| **WarnStrip** | Amber-tinted frosted strip with `#D97706` icon | — |
| **TodoChip** | `#D97706` chip reading "TODO — যাচাই বাকি" | — |
| **EmptyState** | Illustration + Bangla text + primary action | — |
| **StatusChip** | Small pill: grey/active/done/overdue | — |
| **TopBar** | Translucent frosted header with title + gear | `back`, `close`, `none` |
| **BottomNav** | 5-tab frosted bar with elevated centre | — |
| **SidebarNav** | Desktop left sidebar (same 5 sections) | — |

---

## 7. Interaction Patterns

| Pattern | Specification |
|---------|---------------|
| **Modals** | **Never** — use BottomSheet instead |
| **Add actions** | FAB (bottom right, above nav) |
| **Horizontal scrolling** | Chip strips, stat tiles, compare tables |
| **Filters** | Segmented controls, chip strips |
| **Expandable rows** | Chevron → inline expansion (not new screen) |
| **Long press / drag** | Grip dot column on right edge (pipeline cards) |
| **OTP entry** | 6 separate 48×56px boxes, auto-advance, paste distribution |
| **Numeric input** | Stepper fields (not raw text) for all calculated values |
| **Date display** | Bangla digits, local midnight Asia/Dhaka |

---

## 8. Accessibility Floor (Non-Negotiable)

| Requirement | Value |
|-------------|-------|
| Minimum text size | 13px |
| Minimum touch target | 48×48px |
| Every action | Icon + text label together |
| Meaning by colour alone | **Never** — coloured states also named in words |
| Contrast | WCAG AA on all glass surfaces (verified at 92% opacity) |

---

## 9. Content Rules

| Rule | Detail |
|------|--------|
| **Bangla primary** | Every user-facing string in Bangla first |
| **Numerals** | Bangla digits for display; ASCII for storage |
| **Dates** | Local Asia/Dhaka midnight for day calculations |
| **Money** | Integer paisa only (৳12,000 → 1200000); round at final step only |
| **No pricing UI** | No prices, plans, store badges, download prompts, install prompts, user counts, star ratings, review counts anywhere |
| **Offline-first** | All screens render identically in airplane mode |
| **Verification dates** | Show "সর্বশেষ যাচাই — DD MMM YYYY" under every regulatory figure; amber dot if >180 days |

---

## 10. Tailwind Config Reference

```js
// tailwind.config.js — theme.extend
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
```

```css
/* Glass utility — opacity floor is hard constraint */
.glass {
  background: rgb(255 255 255 / 0.92);
  backdrop-filter: blur(18px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgb(14 22 38 / 0.08);
  border-top: 1px solid rgb(255 255 255 / 0.7);
}
/* NEVER below 0.88 — Bengali conjuncts break before Latin does. */
```

---

## 11. Master Style Prompt (For Generator Reference)

> Design a mobile app called "easy rise" (ইজি রাইজ), a Bangla-first freelancer career and business app for Bangladesh. Canvas 390 by 844. The visual language is modern colourful glassmorphism: a soft light gradient background running from #EEF3FF at the top through pale violet to #F7F9FF at the bottom, with two or three large heavily blurred colour blobs sitting behind all content — azure #1D6FF2 and violet #6D28D9, occasionally a warm blush — never sharp, never in front. All content sits on frosted glass cards: white at 92% opacity with a backdrop blur, 24px corner radius (28px for tall primary cards, 20px for list rows), a 1px white highlight along the top-left edge, and a soft wide low-opacity shadow. Gutters are 16px, vertical gaps between cards 14px, internal card padding 16px. Never drop card opacity below 88 percent: Bengali conjunct characters break up and become unreadable on a low-opacity panel long before Latin text does, and most text in this app is small Bangla.
>
> Palette and role restrictions, which are strict: azure #1D6FF2 is the primary brand and the colour of every ordinary primary action, active tab and progress fill; #0B3FA8 is its pressed and heading-dark variant; violet #6D28D9 marks AI-assisted surfaces ONLY — the centre navigation button, the assistant screen, the plan and profile-review generation controls — and appears nowhere else; green #16A34A marks completed, met or verified states ONLY; amber #D97706 marks warnings, lateness, overage and unverified figures ONLY; red #DC2626 is reserved exclusively for destructive actions and appears on exactly one screen in this app, the delete-all-data control in settings; #0284C7 is informational; #64748B is secondary text; #0E1626 is primary ink. Four neutrals complete the set and carry no semantic role of their own: #EDF3FF for the pale inset block that holds English sample text, #F3EFFF for the violet-tinted inset on the assistant screen only, #E2E8F0 for input borders at rest, and #CBD5E1 for the hollow outline of an unreached step. No other colour value may appear anywhere in the app.
>
> Typography: Noto Sans Bengali for all Bangla, a clean geometric sans such as Inter for Latin and all numerals. Bangla is always the primary label at full size and weight; English, where it appears, is smaller and #64748B — except inside client-facing message samples, which are real English sentences shown at full size in a pale #EDF3FF inset block. Headings 22 to 34px bold, body 15px, secondary 13px, captions 12px. Never go below 13px for any text a user must read.
>
> Accessibility floor: minimum 13px text, minimum 48px touch targets, every action carries an icon and a text label together, and no meaning is ever conveyed by colour alone — a state that is coloured is also named in words.
>
> Navigation chrome, present on every screen except onboarding and settings: a translucent frosted top bar carrying the screen title on the left in bold Bangla and a settings gear icon on the right at #64748B; and a frosted bottom navigation bar with five items — আজ with a home icon, শেখা with a book icon, সহায়ক in the centre as an elevated circular violet #6D28D9 button with a sparkle icon, কাজ with a briefcase icon, and টাকা with a wallet icon. The active item is #1D6FF2 with a small filled dot beneath it; inactive items are #64748B.
>
> Icons are rounded outline style, 2px stroke, 24px, sitting inside 40 to 44px tinted rounded-square containers on list rows. Buttons are 56px tall with an 18px radius. Bottom sheets rather than centre modals. Numerals shown to the user render in Bangla digits.
>
> Do not put any price, plan, subscription, store badge, download prompt, install prompt, user count, star rating or review count anywhere in this app.