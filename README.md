# 📖 Prophet Stories (নবীদের গল্প)

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An authentic, engaging, and interactive digital library of Islamic Prophet Stories (কুরআন ও সহিহ হাদিসভিত্তিক ২৫ জন নবীর পূর্ণাঙ্গ জীবনালেখ্য). Built with **Laravel 12**, **React 19**, **Inertia.js**, and **Tailwind CSS v4**, designed for both adults and children with dedicated dual-reading modes, audio narrations, progress tracking, and telecom-grade subscription integration (BdApps).

---

## 📋 Table of Contents

- [🌟 Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture & Modules](#-architecture--modules)
- [📚 Content Library (২৫ জন নবী ও ১১৭টি গল্প)](#-content-library)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [⚙️ Configuration & Environment](#️-configuration--environment)
- [🧪 Testing](#-testing)
- [📱 Routes & Pages](#-routes--pages)
- [🛡 Security & Compliance](#-security--compliance)
- [📄 License](#-license)

---

## 🌟 Key Features

### 📖 Dual Reading Modes
- **স্ট্যান্ডার্ড মোড (Standard Mode)**: 
  - Rich book-style typography with adjustable font sizing (4 preset levels: 16px to 21.5px).
  - Authentic references (`source_reference`) citing Quran Surah/Ayat and Sahih Hadith.
  - Distinct Moral Lessons (`moral_lesson`) summarizing the ethical takeaway of each chapter.
- **কিড মোড (Kid Mode)**: 
  - Simplified Bengali narrative accessible for young learners.
  - Colorful illustrations, emojis, engaging visuals, and kid-friendly layout.
  - Dedicated Kid Profiles system (`/kid`) allowing parents to create and manage personalized reading contexts for their children.

### 🎙 Audio Narration Player
- Embedded audio narration player with playback speed controls, seek bar, time display, and background playback.

### 📊 Reading Progress Tracking
- Idempotent chapter completion logging (`/chapters/{id}/complete`).
- Live percentage progress per prophet and overall library journey overview.

### 🔍 Instant Bengali Search
- Fast keyword search across prophet names and chapter content with highlighting and text snippets (`/search`).

### 📱 Telecom & BdApps Integration
- Mobile number (MSISDN) login with OTP verification (+880 validation).
- Subscription lifecycle support: Auto-registration, renewal reminders, and on-demand manual cancellation.
- Dynamic subscription charging info configurable via Admin Panel.

### 🧭 Interactive Landing Page
- Modern single-page landing with **Scroll-Spy** active navigation highlighting.
- Animated indicator pills powered by Framer Motion.
- Responsive mobile quick-navigation bar.

### 🛠 Powerful Admin Dashboard
- Complete CMS for managing prophets, story chapters, reflection questions, categories, and media.
- General application settings (Theme colors, logos, SEO meta, charging notices, pagination, and guest mode).

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Backend** | [Laravel 12](https://laravel.com) | PHP 8.2+, Eloquent ORM, Artisan CLI, Middleware |
| **Frontend** | [React 19](https://react.dev) | Modern component architecture, React hooks, Framer Motion |
| **SPA Bridge** | [Inertia.js v2](https://inertiajs.com) | Server-driven client routing without client-side API boilerplate |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Design tokens, glassmorphism, responsive utilities |
| **Icons** | [Lucide React](https://lucide.dev) | Consistent, lightweight SVG icon system |
| **Database** | [MySQL 8.0+](https://www.mysql.com) / SQLite | Relational schema with foreign keys and cascade rules |
| **Authentication** | Custom Multi-guard | Subscriber guard (MSISDN/OTP) + Admin user guard |

---

## 🏗 Architecture & Modules

```
prophet-story/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/               # Admin panel & CMS controllers
│   │   │   ├── FirstLoginController.php  # OTP auth & BdApps login flow
│   │   │   ├── HomeController.php         # Public landing page controller
│   │   │   ├── KidProfileController.php   # Kid profiles & context switching
│   │   │   ├── ProfileController.php      # Subscriber profile & unsub flow
│   │   │   ├── ProphetController.php      # Library browsing & chapter reader
│   │   │   └── SearchController.php       # Prophet & chapter keyword search
│   │   └── Middleware/
│   │       ├── HandleInertiaRequests.php  # Global shared props (branding, auth, settings)
│   │       └── SubscriberAuth.php         # Route guard for active subscribers
│   ├── Models/
│   │   ├── Prophet.php              # Prophet entity (order, name_bn, name_ar, slug, etc.)
│   │   ├── StoryChapter.php         # Chapters (content_standard, content_kid_friendly, moral_lesson)
│   │   ├── ChapterCompletion.php    # Reader progress tracking
│   │   ├── KidProfile.php           # Child profile linked to subscriber
│   │   ├── Subscriber.php           # Subscriber profile (msisdn, name, avatar, dob)
│   │   └── Subscription.php         # Subscription status & history
│   └── Services/
│       ├── AppSettings.php          # Cached key-value settings provider
│       ├── BdAppsApiClient.php      # BdApps telecom REST API integration
│       └── BdAppsSmsService.php     # SMS delivery service
├── database/
│   ├── migrations/                  # Database schema definitions
│   └── seeders/
│       ├── DatabaseSeeder.php       # Main database seeder orchestrator
│       └── ProphetStorySeeder.php   # 25 Prophets + 117 complete story chapters
├── resources/
│   ├── css/app.css                  # Tailwind CSS theme tokens & fonts
│   └── js/
│       ├── components/              # Reusable UI (TopBar, BottomNav, Modals, AudioPlayer)
│       ├── layouts/                 # LearnerShell, AdminShell
│       └── pages/                   # Inertia views (Landing, Library, Reader, KidProfiles, Profile, Search)
└── routes/
    ├── web.php                      # Application routes
    └── console.php                  # Artisan commands
```

---

## 📚 Content Library

The database is pre-populated via `ProphetStorySeeder.php` with **25 Quranic Prophets** and **117 complete chapters**:

1. **আদম (আ.)** — আদম সৃষ্টি, জান্নাত ও পৃথিবীতে আগমন (৩ অধ্যায়)
2. **ইদরীস (আ.)** — জ্ঞান, প্রজ্ঞা ও আল্লাহর নৈকট্য (৩ অধ্যায়)
3. **নূহ (আ.)** — দাওয়াত, প্লাবন ও মহাপ্লাবনের জাহাজ (৫ অধ্যায়)
4. **হূদ (আ.)** — আদ জাতি ও প্রচণ্ড ঝড়ের শাস্তি (৪ অধ্যায়)
5. **সালিহ (আ.)** — সামূদ জাতি ও অলৌকিক উটনী (৪ অধ্যায়)
6. **ইব্রাহীম (আ.)** — অগ্নিকুণ্ড, কাবা নির্মাণ ও আত্মত্যাগ (৭ অধ্যায়)
7. **লূত (আ.)** — সদোম নগরী ও হেদায়াতের আহ্বান (৪ অধ্যায়)
8. **ইসমাঈল (আ.)** — কুরবানি ও যমযম কূপ (৪ অধ্যায়)
9. **ইসহাক (আ.)** — বরকতময় জীবনের প্রতিচ্ছবি (৩ অধ্যায়)
10. **ইয়াকূব (আ.)** — ধৈর্য ও সন্তানের প্রতি ভালোবাসা (৪ অধ্যায়)
11. **ইউসুফ (আ.)** — কূপ থেকে রাজপ্রাসাদের সত্যবাদী নবী (৮ অধ্যায়)
12. **আইয়ূব (আ.)** — চরম রোগব্যাধি ও অপরিসীম ধৈর্য (৪ অধ্যায়)
13. **শুআইব (আ.)** — মাপ ও ওজনে সততার পাঠ (৪ অধ্যায়)
14. **মূসা (আ.)** — ফিরাউনের দরবার ও নীল নদের অলৌকিক ঘটনা (১০ অধ্যায়)
15. **হারূন (আ.)** — সত্যের পথে সহযোগিতার উজ্জ্বল দৃষ্টান্ত (৩ অধ্যায়)
16. **যুলকিফল (আ.)** — অঙ্গীকার পালন ও ন্যায়পরায়ণতা (৩ অধ্যায়)
17. **দাউদ (আ.)** — জালুত বধ, সুন্দর কণ্ঠ ও যাবূর কিতাব (৫ অধ্যায়)
18. **সুলাইমান (আ.)** — বাতাস, জ্বিন ও পশুপাখির রাজা (৬ অধ্যায়)
19. **ইলিয়াস (আ.)** — একত্ববাদের বার্তা ও বাল দেবতার খণ্ডন (৩ অধ্যায়)
20. **আল-ইয়াসা (আ.)** — আল্লাহর পথের বিশ্বস্ত পথপ্রদর্শক (৩ অধ্যায়)
21. **ইউনুস (আ.)** — মাছের পেট ও অন্ধকারের প্রার্থনা (৪ অধ্যায়)
22. **জাকারিয়া (আ.)** — বৃদ্ধ বয়সে দোয়ার শক্তি ও আত্মনিবেদন (৪ অধ্যায়)
23. **ইয়াহইয়া (আ.)** — সত্যের পক্ষে আপসহীন জীবন (৩ অধ্যায়)
24. **ঈসা (আ.)** — অলৌকিক জন্ম ও আসমানে উঠিয়ে নেওয়া (৭ অধ্যায়)
25. **মুহাম্মদ (সা.)** — নবুওয়াত, হিজরত, বদর ও মানবতার মুক্তি (১৩ অধ্যায়)

---

## ⚡ Quick Start & Installation

### Prerequisites
- **PHP**: `>= 8.2` (with `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`)
- **Composer**: `>= 2.x`
- **Node.js**: `>= 18.x` & **npm**
- **MySQL**: `>= 8.0` (or SQLite for development)

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/prophet-story.git
   cd prophet-story
   ```

2. **Install PHP Dependencies**:
   ```bash
   composer install
   ```

3. **Install JavaScript Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure Database in `.env`**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=prophet_stories
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

6. **Run Database Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```
   > This automatically seeds the admin users, permissions, settings, all 25 Prophets, and 117 story chapters.

7. **Build Frontend Assets**:
   ```bash
   npm run build
   ```

8. **Start Local Development Servers**:
   ```bash
   # Terminal 1: Laravel Backend
   php artisan serve

   # Terminal 2: Vite Hot Reload
   npm run dev
   ```

---

## ⚙️ Configuration & Environment

Key configuration settings in `.env`:

```env
APP_NAME="Prophet Stories"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# BdApps Telecom Gateway (Optional / Mockable in Dev)
BDAPPS_APP_ID=
BDAPPS_APP_PASSWORD=
BDAPPS_USE_PLATFORM_OTP=false
BDAPPS_AUTO_LOGIN_EXISTING_SUBSCRIBER=true
BDAPPS_OTP_DEBUG=true
```

---

## 🧪 Testing

The test suite covers subscriber authentication, protected route access, profile updates, kid profiles, chapter completions, search queries, and admin charging text synchronization:

```bash
php artisan test
```

Sample output:
```
   PASS  Tests\Unit\ExampleTest
   PASS  Tests\Feature\ChapterCompletionTest
   PASS  Tests\Feature\ExampleTest
   PASS  Tests\Feature\KidProfileTest
   PASS  Tests\Feature\LoginChargingTextTest
   PASS  Tests\Feature\ProfileTest
   PASS  Tests\Feature\ProphetSearchTest
   PASS  Tests\Feature\ProtectedRouteAccessTest

   Tests:    27 passed (128 assertions)
```

---

## 📱 Routes & Pages

| Route | Name | Access | Purpose |
|---|---|---|---|
| `/` | `home` | Public | High-converting landing page with Scroll-Spy navigation |
| `/login` | `login.show` | Public | Mobile number OTP login with BdApps charge text |
| `/login/verify` | `login.verify.show` | Public | 6-digit OTP verification screen |
| `/library` | `library.index` | Subscriber | Main Prophet library with grid cards & progress |
| `/prophets/{slug}` | `prophets.show` | Subscriber | Prophet chapter overview and synopsis |
| `/prophets/{slug}/chapters/{num}` | `chapters.show` | Subscriber | Dual-mode Reader (Standard/Kid) with Audio player |
| `/search` | `search.index` | Subscriber | Real-time Bengali & Arabic keyword story search |
| `/kid` | `kid.index` | Subscriber | Kid profiles manager & context switcher |
| `/profile` | `profile.show` | Subscriber | Profile settings, avatar selector, cancel subscription |
| `/admin` | `admin.dashboard` | Admin | Administrative CMS & Application settings |

---

## 🛡 Security & Compliance

- **Authentication Guards**: Strict isolation between standard web subscribers (`subscriber`) and admin users (`web`).
- **Idempotent Operations**: Progress completions and subscription states are idempotent to prevent double charges and race conditions.
- **Child Safety**: Fully ad-free, external tracker-free, and safe for unsupervised child exploration.

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
