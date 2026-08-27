# easy rise (ইজি রাইজ)

A modern Freelancer OS and career growth hub tailored for Bangladeshi freelancers. Built with Laravel 12, Inertia.js, React 19, and Tailwind CSS featuring a Bangla-first, offline-first design architecture.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Guiding Principles](#-guiding-principles)
- [Core Modules & Navigation](#-core-modules--navigation)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Implementation Roadmap](#-implementation-roadmap)
- [Quality Gates](#-quality-gates)
- [Development Setup](#-development-setup)
- [Backend Handoff Specification](#-backend-handoff-specification)

---

## 🌟 Overview

**easy rise (ইজি রাইজ)** is designed as an operational dashboard and growth platform for freelancers in Bangladesh. It bridges client work management, financial intelligence, capacity planning, and skill development with a local context.

### Key Highlights
- **Bangla-First Interface**: Full i18n support with primary `bn.json` translations and Bengali digit conversions (`toBnDigits`).
- **Offline-First Data Layer**: Local persistent state powered by **Dexie.js (IndexedDB)**.
- **Glassmorphism Design System**: Modern UI aesthetic featuring custom Tailwind design tokens and custom glass card utilities.
- **30 Dedicated UI Screens**: Distributed across 5 primary navigation tabs, onboarding, and settings.

---

## 🎯 Guiding Principles

| Principle | Application |
|-----------|-------------|
| **Backend is Source of Truth** | Preserves existing Laravel controllers, models, migrations, and routes. Admin panel remains untouched. |
| **UI-Only Phase** | Build Inertia pages + shared components with mock props & Dexie storage prior to full API wiring. |
| **Replace, Don't Duplicate** | Update existing frontend components directly rather than creating parallel duplicates. |
| **Shared Components First** | Build standard component library (`components/ui/*`) before screen composition. |
| **Props-First Interfaces** | Every screen defines TypeScript props interfaces with mock data closures during UI phase. |
| **Strict Design System** | Enforce Tailwind tokens for color roles, glass opacity (≥88%), and typography. |
| **Bangla-First** | All UI copy loaded via i18n keys from `bn.json`. |

---

## 🧭 Core Modules & Navigation

The platform is structured into **5 main navigation tabs** plus Onboarding and Settings:

### 1. আজ (Home / Today Hub)
- **Today Dashboard (`/home`)**: Daily driver displaying active jobs, deadline alerts, money at stake, capacity bar, and current Rise Ladder level.
- **Rise Ladder (`/home/rise-ladder`)**: Progression system tracking career milestones and stage achievements.

### 2. শেখা (Learn Hub)
- **Foundations & Marketplace Compare (`/learn`, `/learn/marketplace-compare`)**: Learning roadmap and marketplace metrics comparison.
- **Niche Scorer & Profile Checklist (`/learn/niche-scorer`, `/learn/profile-checklist`)**: Niche demand calculator and profile readiness checklist.
- **Proposal Library & Scripts (`/learn/proposal-library`, `/learn/conversation-scripts`)**: High-converting proposal templates and client communication scripts.
- **90-Day Plan & Profile Review (`/learn/plan-90-days`, `/learn/profile-review`)**: Personal roadmap generator and profile critique suite.

### 3. সহায়ক (Assistant Hub)
- **AI Assistant (`/assistant`)**: AI-assisted client communications, scope breakdown, and prompt drafting helpers.

### 4. কাজ (Work Operations)
- **Pipeline & Job Details (`/work`, `/work/job/:id`)**: Client project pipeline tracking, stage filters, step rails, and job cards.
- **Scope Guard (`/work/scope-guard`)**: Scope creep detector and change-request adder.
- **Proposal Tracker (`/work/proposal-tracker`)**: Proposal conversion funnel and analytics.
- **Payments Due & Capacity Meter (`/work/payments-due`, `/work/capacity-meter`)**: Aging payment ladder, workload gauge, and suggestion engine.
- **Client Screener (`/work/client-screener`)**: 12-point client risk scoring and screening questionnaire.

### 5. টাকা (Money & Finance)
- **Finance Overview & Ledger (`/money`, `/money/ledger`)**: 12-column earnings charts, financial metrics, and transaction logging.
- **True Hourly Rate Calculator (`/money/true-hourly`)**: Effective rate calculator taking hidden unbilled hours into account.
- **Runway & Payment Channels (`/money/runway`, `/money/channels`)**: Cash runway projections and channel fee warnings.
- **Incentive & Document Readiness (`/money/incentive`, `/money/doc-readiness`)**: Government incentive applicability calculator and documentation checklist.
- **Income Proof Pack Generator (`/money/income-proof`)**: Print-ready income certification generator.

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: React 19 + Inertia.js (Laravel adapter)
- **Styling**: Tailwind CSS + Custom CSS Utilities (`.glass`, `.glass-tall`, `.glass-row`)
- **State & Local Storage**: Dexie.js (IndexedDB offline store)
- **Typography**: Noto Sans Bengali (`font-bn`) & Inter (`font-latin`)
- **Icons**: Lucide React
- **Language & i18n**: Custom `useI18n` engine with `bn.json` / `en.json`

### Backend Architecture
- **Framework**: Laravel 12 (PHP 8.2+)
- **Routing & Rendering**: Inertia.js Controllers & Middleware
- **Database**: SQLite (Dev) / MySQL (Prod)

---

## 🏗 Project Architecture

```
resources/js/
├── app.jsx                    # Inertia entry point
├── bootstrap.js
├── lib/                       # Core utilities & database
│   ├── utils.ts               # Formatting helpers & cn()
│   ├── i18n.ts                # Translations engine & digit conversion
│   ├── db.ts                  # Dexie.js schema & store definitions
│   └── nav.ts                 # Main navigation definitions
├── components/
│   ├── ui/                    # 25+ shared UI component library
│   ├── TopBar.tsx             # Header bar
│   ├── BottomNav.tsx          # Mobile navigation bar
│   └── SidebarNav.tsx         # Desktop sidebar navigation
├── layouts/
│   └── LearnerShell.tsx       # Primary app chrome layout
├── pages/                     # 30 Inertia page components
│   ├── Onboarding/            # Welcome, PhoneVerify, ProfileSetup
│   ├── Home/                  # Today, RiseLadder
│   ├── Learn/                 # Index, MarketplaceCompare, NicheScorer, etc.
│   ├── Assistant/             # Index (AI Assistant)
│   ├── Work/                  # Pipeline, JobDetail, ScopeGuard, etc.
│   ├── Money/                 # Index, Ledger, TrueHourly, Runway, etc.
│   └── Settings/              # Index
├── features/                  # Pure calculation modules (*.calc.ts)
└── data/                      # Reference JSON datasets
```

---

## 🗺 Implementation Roadmap

- [x] **Phase 0: Foundation (Week 1)**: Tailwind token configuration, Noto Sans Bengali integration, i18n setup, shared UI components (`components/ui/*`), and updated app layout chrome.
- [ ] **Phase 1: Onboarding (Week 1–2)**: Welcome screen, Phone verification, and Profile setup.
- [ ] **Phase 2: Home Hub (Week 2)**: Today dashboard and Rise Ladder stage progression.
- [ ] **Phase 3: Work Tab (Week 3–4)**: Pipeline tracking, Scope Guard, Proposal tracker, Payments due, Capacity meter, and Client screener.
- [ ] **Phase 4: Money Tab (Week 4–5)**: Finance overview, Ledger, True hourly calculator, Runway projection, Document readiness, and Income proof pack.
- [ ] **Phase 5: Learn, Assistant & Settings (Week 5–6)**: Foundations, Marketplace compare, Niche scorer, Proposal library, AI Assistant, and Settings.
- [ ] **Phase 6: QA & Polish (Week 6)**: Offline validation, TypeScript type checks, and design token audit.

---

## 🧪 Quality Gates

Prior to merging phase releases, the codebase must pass the following quality gates:

| Gate | Tool / Command | Requirement |
|------|----------------|-------------|
| **TypeScript** | `npx tsc --noEmit` | 0 type errors |
| **Code Linting** | `npm run lint` | 0 lint warnings/errors |
| **Token Audit** | Custom Script | No hardcoded HEX colors outside `tailwind.config.js` |
| **Bangla Rendering** | Visual Check | All Bengali text legible with glass backdrop (opacity ≥88%) |
| **Touch Targets** | Accessibility Test | Interactive elements maintain min 48×48px target |
| **Offline Mode** | DevTools Offline | All 30 pages render offline using Dexie storage |

---

## ⚡ Development Setup

### Requirements
- **PHP**: >= 8.2
- **Composer**
- **Node.js**: >= 18
- **Bun** or **npm**

### Quick Start

1. **Install Dependencies**:
   ```bash
   composer install
   npm install
   ```

2. **Environment & App Key**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Migration & Seed**:
   ```bash
   php artisan migrate --seed
   ```

4. **Launch Development Servers**:
   ```bash
   composer dev
   # Launches Laravel server, Vite dev server, and queue worker concurrently
   ```

---

## 🤝 Backend Handoff Specification

Upon completion of the UI-only phase, frontend artifacts will be handed off with complete TypeScript interfaces:
1. **30 Inertia Screens**: Pre-wired with mock props and prop types.
2. **Dexie Database Schema**: 12 local store definitions in `resources/js/lib/db.ts`.
3. **Pure Calculators**: 12 standalone `*.calc.ts` modules for client/server shared logic.
4. **Reference Data**: JSON definitions in `resources/js/data/`.

Backend implementation will attach Eloquent models/migrations for persistence and controller endpoints returning identical JSON prop signatures.

---

**Built for the Bangladeshi Freelancer Community 🇧🇩**

