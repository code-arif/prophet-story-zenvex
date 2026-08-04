# PAGE_MAP.md — 31 Stitch screens → existing & proposed routes

> Maps every screen in `ai/stitch/ui-prompt.txt` onto the **existing Laravel monolith** (routes, Inertia pages, controllers).
> Status legend:
> - ✅ **EXISTS** — page already exists and already matches the Stitch design (reference implementation).
> - ♻️ **REPLACE UI** — route + backend exist; replace only the UI.
> - 🆕 **CREATE** — new screen; new Inertia page (and route only when backend lands).
> - 🔒 **BACKEND LATER** — data/logic is deferred; UI can be scaffolded with props-first interfaces.

---

## 1. Existing routes (backend is the source of truth — keep)

| Route | Controller | Serves |
|-------|-----------|--------|
| `GET /` (name `home`) | `HomeController` | Inertia `Feed/Index` (articles feed) / login redirect / configurable home type |
| `GET /login` · `POST /login/send-otp` · `GET/POST /login/verify` · `GET /guest` | `FirstLoginController` | MSISDN + OTP auth (existing backend) |
| `GET/POST /profile` · `POST /subscribe` · `POST /unsubscribe` · `GET/POST /logout` | `ProfileController` | Subscriber profile + subscription + logout |
| `GET /news` (middleware `subscribed`) | `ArticleController@index` | Subscriber-only content feed |
| `GET /app` · `/app/download` · `/apk/{filename}` | `AppDownloadController` | APK download |
| `GET /p/{slug}` | `PageController@show` | Static pages |
| `/admin/**` | Admin controllers | **ADMIN — untouched** |

### Existing public Inertia pages
`Auth/PhoneLogin.jsx`, `Auth/VerifyOtp.jsx`, `Profile/Index.jsx`, `Articles/Index.jsx`, `Articles/Show.jsx`, `Pages/Show.jsx`, `Search/Index.jsx`, `AppDownload.jsx`.
> ⚠️ Note: `HomeController` renders `Feed/Index` but `resources/js/pages/Feed/Index.jsx` does **not exist** in the repo — the home feed page is missing. This is a gap to resolve when the Home Hub UI lands.

### Legacy Blade views to retire as UI migrates
`resources/views/home.blade.php`, `resources/views/layouts/app.blade.php`, `resources/views/subscribe.blade.php` — old dark-theme UI. Leave in place until their screens are replaced, then remove to avoid duplicate UI.

---

## 2. The 31 screens

### Onboarding (no bottom nav)

| # | Screen (bn / en) | Status | Inertia page | Route | Backend source |
|---|------------------|--------|--------------|-------|----------------|
| 01 | স্বাগতম / Welcome & Language | 🆕 | `Learner/Onboarding/Welcome` | `/welcome` (new) | 🔒 none (client) |
| 02 | ফোন নম্বর দিন / Phone Login | ✅ **EXISTS** | `Auth/PhoneLogin` | `/login` | `FirstLoginController` (keep) |
| 03 | কোড যাচাই / OTP Verification | ✅ **EXISTS** | `Auth/VerifyOtp` | `/login/verify` | `FirstLoginController` (keep) |
| 04 | আপনার সম্পর্কে / Profile Setup | 🆕 | `Learner/Onboarding/ProfileSetup` | `/welcome/profile` (new) | 🔒 later; can reuse `ProfileController@update` when wired |
| 05 | লেভেল নির্ণয় / Placement Test | 🆕 | `Learner/Onboarding/Placement` | `/welcome/placement` (new) | 🔒 later (rule-based, feature 15) |
| 06 | আপনার লেভেল / Placement Result | 🆕 | `Learner/Onboarding/PlacementResult` | `/welcome/placement/result` (new) | 🔒 later |

### Tab 1 — হোম (Home)

| # | Screen | Status | Inertia page | Route | Backend source |
|---|--------|--------|--------------|-------|----------------|
| 07 | হোম / Home Hub | 🆕 | `Learner/Home` | `/` (replace Feed/Index UI) | existing settings/articles for brand; learning data 🔒 later |

### Tab 2 — শিখুন (Learn)

| # | Screen | Status | Inertia page | Route | Backend source |
|---|--------|--------|--------------|-------|----------------|
| 08 | শিখুন / Learn Hub | 🆕 | `Learner/Learn/Index` | `/learn` (new) | 🔒 later |
| 09 | পাঠ পথ / Lesson Path | 🆕 | `Learner/Learn/LessonPath` | `/learn/lessons` (new) | 🔒 later |
| 10 | পাঠ / Lesson Player | 🆕 | `Learner/Learn/LessonPlayer` | `/learn/lessons/{id}` (new, session screen) | 🔒 later |
| 11 | গ্রামার লাইব্রেরি / Grammar Library | 🆕 | `Learner/Learn/Grammar` | `/learn/grammar` (new) | 🔒 later |
| 12 | নিয়মের বিস্তারিত / Grammar Rule Detail | 🆕 | `Learner/Learn/GrammarRule` | `/learn/grammar/{rule}` (new) | 🔒 later |
| 13 | শব্দভাণ্ডার / Vocabulary Decks | 🆕 | `Learner/Learn/Vocabulary` | `/learn/vocabulary` (new) | 🔒 later |
| 14 | কার্ড পুনরাবৃত্তি / Flashcard Review | 🆕 | `Learner/Learn/FlashcardReview` | `/learn/vocabulary/review` (new, session screen) | 🔒 later |
| 15 | রিডিং প্র্যাকটিস / Reading List | 🆕 | `Learner/Learn/Reading` | `/learn/reading` (new) | 🔒 later |
| 16 | পাঠ্য পড়ুন / Reading Reader | 🆕 | `Learner/Learn/ReadingReader` | `/learn/reading/{id}` (new, session screen) | 🔒 later |

### Tab 3 — AI সঙ্গী (centre, always-online)

| # | Screen | Status | Inertia page | Route | Backend source |
|---|--------|--------|--------------|-------|----------------|
| 17 | AI সঙ্গী / Scenario Picker | 🆕 | `Learner/Ai/Index` | `/ai` (new) | 🔒 later (proxy `/api/chat` `/api/writing`) |
| 18 | কথোপকথন / AI Chat Session | 🆕 | `Learner/Ai/Chat` | `/ai/chat` (new, session screen) | 🔒 later |
| 19 | লেখা যাচাই / AI Writing Feedback | 🆕 | `Learner/Ai/Writing` | `/ai/writing` (new) | 🔒 later |

### Tab 4 — অনুশীলন (Practice)

| # | Screen | Status | Inertia page | Route | Backend source |
|---|--------|--------|--------------|-------|----------------|
| 20 | অনুশীলন / Practice Hub | 🆕 | `Learner/Practice/Index` | `/practice` (new) | 🔒 later |
| 21 | উচ্চারণ স্টুডিও / Pronunciation | 🆕 | `Learner/Practice/Pronunciation` | `/practice/pronunciation` (new) | 🔒 later |
| 22 | লিসেনিং / Listening | 🆕 | `Learner/Practice/Listening` | `/practice/listening` (new) | 🔒 later |
| 23 | রাইটিং ডেস্ক / Writing Desk | 🆕 | `Learner/Practice/Writing` | `/practice/writing` (new) | 🔒 later |
| 24 | কুইজ ও টেস্ট / Quiz Center | 🆕 | `Learner/Practice/Quiz` | `/practice/quiz` (new) | 🔒 later |
| 25 | কুইজ চলছে / Quiz Session | 🆕 | `Learner/Practice/QuizSession` | `/practice/quiz/session` (new, session screen) | 🔒 later |
| 26 | ফ্রেজবুক / Phrasebook | 🆕 | `Learner/Practice/Phrasebook` | `/practice/phrasebook` (new) | 🔒 later |
| 27 | ভুল সংশোধক / Mistake Doctor | 🆕 | `Learner/Practice/MistakeDoctor` | `/practice/mistakes` (new) | 🔒 later |

### Tab 5 — প্রোফাইল (Profile)

| # | Screen | Status | Inertia page | Route | Backend source |
|---|--------|--------|--------------|-------|----------------|
| 28 | প্রোফাইল / Profile & Account | ✅ **EXISTS** | `Profile/Index` | `/profile` | `ProfileController` (keep) |
| 29 | অগ্রগতি / Progress Dashboard | 🆕 | `Learner/Profile/Progress` | `/profile/progress` (new) | 🔒 later |
| 30 | AI স্টাডি প্ল্যান / Study Plan | 🆕 | `Learner/Profile/StudyPlan` | `/profile/study-plan` (new) | 🔒 later |
| 31 | সেটিংস / Settings & Reminder | 🆕 | `Learner/Profile/Settings` | `/profile/settings` (new) | 🔒 later |

---

## 3. Route gaps to close during the UI phase

1. **Bottom nav target routes are missing.** `Profile/Index.jsx` (already migrated) links to `/home`, `/learn`, `/practice` — none of these routes exist in `routes/web.php`. Add placeholder Inertia routes when the hub screens land (or in the UI phase as Inertia pages with static props, with real controllers later).
2. **`/` vs `/home`.** The current home route is `/`; the migrated nav uses `/home`. Decide one canonical home URL (recommendation: keep `/` as home and point nav items at it; or register `/home` as an alias route to `HomeController`).
3. **`Feed/Index.jsx` missing.** `HomeController` renders it; the file does not exist. Resolve together with the Home Hub work.

---

## 4. Feature → screen coverage (from Stitch)

| Feature | Primary screen(s) | Also in |
|---------|-------------------|---------|
| 1 Lesson Path | 07, 08, 09, 10 | – |
| 2 Vocabulary Trainer | 07, 08, 13, 14 | 16 (saved words) |
| 3 Grammar Library | 08, 11, 12 | – |
| 4 Pronunciation | 20, 21 | – |
| 5 Listening | 20, 22 | – |
| 6 Reading | 08, 15, 16 | – |
| 7 Writing Desk | 19, 20, 23 | – |
| 8 Quiz & Tests | 20, 24, 25 | – |
| 9 Word of the Day | 07 | – |
| 10 Phrasebook | 20, 26 | – |
| 11 Progress Dashboard | 06, 07, 28, 29 | – |
| 12 Study Reminder | 07, 28, 31 | – |
| 13 AI Partner | 17, 18, 19 | – |
| 14 AI 30-Day Plan | 04, 07, 28, 30 | – |
| 15 Placement | 05, 06 | – |
| 16 Mistake Doctor | 20, 27 | – |

---

## 5. Rules reminder

- Screens 02, 03, 28 already exist and match the design — **do not rebuild them**; only refactor to tokens if desired.
- All `🆕` screens are UI-only in this phase: build the Inertia page + shared components; wire real routes/controllers **later**.
- Admin routes (`/admin/**`) and `pages/Admin/**` are out of scope and must not be modified.
