// Lightweight i18n for the "Learn English" learner UI.
//
// Strategy: Bengali strings ARE the translation keys. The `en` dictionary
// maps each Bengali source string to its English equivalent, and `t(key)`
// returns the Bengali string when the app language is Bengali. Any key
// missing from the active dictionary falls back to the Bengali string, so
// pages that haven't been wrapped yet degrade gracefully instead of breaking.
//
// React components read the current language from the shared `appLanguage`
// prop via useI18n(); number/date formatters (lib/format.js) use the module
// language kept in sync by app.jsx across Inertia navigations.

import { usePage } from '@inertiajs/react';

const EN = {
  // ── Chrome: nav & shell ───────────────────────────────────────────
  'হোম': 'Home',
  'শিখুন': 'Learn',
  'AI সঙ্গী': 'AI Companion',
  'অনুশীলন': 'Practice',
  'প্রোফাইল': 'Profile',
  'ইংরেজি শেখা এবার নিজের গতিতে': 'Learn English at your own pace',
  'লগ আউট': 'Log out',
  'লগ আউট হচ্ছে…': 'Logging out…',
  'আপনি কি নিশ্চিত যে লগ আউট করতে চান?': 'Are you sure you want to log out?',
  'দিন': 'day',

  // ── Home (07) ─────────────────────────────────────────────────────
  'শুভ সকাল': 'Good morning',
  'শুভ দুপুর': 'Good afternoon',
  'শুভ সন্ধ্যা': 'Good evening',
  'আজকের পড়া': "Today's lesson",
  'আজকের পড়া — দিন {n}': "Today's lesson — day {n}",
  'চালিয়ে যান': 'Continue',
  'আজকের শব্দ': 'Word of the day',
  'পুনরাবৃত্তি বাকি': 'Due for review',
  'টি কার্ড': 'cards',
  'শুরু': 'Start',
  'এই সপ্তাহের অগ্রগতি': "This week's progress",
  'বিস্তারিত': 'Details',
  'উচ্চারণ ২ মিনিট': '2-minute pronunciation',
  'একটি কুইজ': 'A quick quiz',
  'ফ্রেজবুক দেখুন': 'Open phrasebook',
  'বদলান': 'Change',
  'আপনার প্রোফাইল এখনো সম্পূর্ণ হয়নি': 'Your profile is not complete yet',
  'নাম, লক্ষ্য আর লেভেল ঠিক করতে মাত্র ২ মিনিট লাগবে।': 'It takes just 2 minutes to set your name, goal and level.',
  'প্রোফাইল সম্পূর্ণ করুন': 'Complete profile',
  'লেভেল পরীক্ষা দিন': 'Take the level test',
  'আপনার লেভেল এখনো ঠিক হয়নি': 'Your level is not set yet',
  '৫ মিনিটের পরীক্ষা দিয়ে লেভেল নির্ধারণ করুন': 'Find your level with a 5-minute test',
  'পরীক্ষা দিন': 'Take the test',
  'শেখা শুরু করুন': 'Start learning',
  'লেসন দেখুন': 'View lessons',
  'প্রতিদিন {time}টায় মনে করিয়ে দেব': 'Daily reminder at {time}',
  'রিমাইন্ডার বন্ধ আছে — সেটিংসে চালু করুন': 'Reminder is off — turn it on in Settings',

  // ── Learn hub (08) ────────────────────────────────────────────────
  'আপনার লেভেল — {level}': 'Your level — {level}',
  'পাঠ পথ': 'Lesson Path',
  '{n}টি পাঠ বাকি': '{n} lessons left',
  'অফলাইন': 'Offline',
  'শব্দভাণ্ডার': 'Vocabulary',
  '{n}টি কার্ড আজ পুনরাবৃত্তির জন্য প্রস্তুত': '{n} cards ready for review today',
  'গ্রামার লাইব্রেরি': 'Grammar Library',
  'নিয়ম, বাংলায় ব্যাখ্যা': 'Rules explained in Bangla',
  'রিডিং প্র্যাকটিস': 'Reading Practice',
  'আপনার লেভেলের পাঠ্য ({level})': 'Readings at your level ({level})',

  // ── AI hub (17) ───────────────────────────────────────────────────
  'ইতিহাস': 'History',
  'এই ফিচারটি ব্যবহার করতে ইন্টারনেট প্রয়োজন': 'An internet connection is needed for this feature',
  'কথা বলুন': 'Chat',
  'লেখা যাচাই': 'Writing check',
  'লেখা যাচাই করুন': 'Check your writing',
  'পরিস্থিতি বেছে নিন': 'Pick a scenario',
  'শেষ আলাপ': 'Last chat',
  'আবার শুরু করুন': 'Resume',
  'আপনার লেখা পেস্ট করে ভুল সংশোধন ও ব্যাখ্যা পান': 'Paste your writing to get corrections and explanations',

  // ── Practice hub (20) ─────────────────────────────────────────────
  'আজকের পরামর্শ': "Today's advice",
  'শুরু করুন': 'Start',
  'সব অনুশীলন': 'All practice',
  'পড়া': 'Reading',
  'শোনা': 'Listening',
  'লেখা': 'Writing',
  'বলা': 'Speaking',
  'উচ্চারণ স্টুডিও': 'Pronunciation Studio',
  'শুনুন, বলুন, মিলিয়ে দেখুন': 'Listen, speak, compare',
  'স্কোরিং-এ নেট লাগে': 'Scoring needs internet',
  'লিসেনিং': 'Listening',
  'শুনে লিখুন ও বুঝুন': 'Listen, write and understand',
  'রাইটিং ডেস্ক': 'Writing Desk',
  'বিষয় বেছে লিখুন': 'Write on chosen topics',
  'কুইজ ও টেস্ট': 'Quizzes & Tests',
  'নিজেকে যাচাই করুন': 'Test yourself',
  'ফ্রেজবুক': 'Phrasebook',
  'বাস্তব পরিস্থিতির বাক্য': 'Real-life phrases',
  'ভুল সংশোধক': 'Mistake Doctor',
  'বাংলাভাষীদের সাধারণ ভুল': 'Common mistakes of Bengali speakers',
  'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট রিডিং প্র্যাকটিস করুন': 'Your weakest skill — try 5 minutes of reading practice',
  'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট লিসেনিং অনুশীলন করুন': 'Your weakest skill — try 5 minutes of listening practice',
  'আপনার সবচেয়ে দুর্বল দক্ষতা — একটি প্যারাগ্রাফ লিখে দেখুন': 'Your weakest skill — try writing a paragraph',
  'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট উচ্চারণ অনুশীলন করুন': 'Your weakest skill — try 5 minutes of pronunciation practice',

  // ── Settings (31) ─────────────────────────────────────────────────
  'সেটিংস': 'Settings',
  'পড়ার রিমাইন্ডার': 'Reading reminder',
  'দৈনিক রিমাইন্ডার': 'Daily reminder',
  'সময়': 'Time',
  'রাত ৯:০০': '9:00 PM',
  'iPhone-এ ব্রাউজার নোটিফিকেশন সবসময় নির্ভরযোগ্য নয় — অ্যাপ খুললে বকেয়া রিমাইন্ডার দেখানো হবে': "Browser notifications aren't always reliable on iPhone — pending reminders will show when you open the app",
  'ক্যালেন্ডারে যোগ করুন': 'Add to calendar',
  'ভাষা ও লেখা': 'Language & writing',
  'অ্যাপের ভাষা': 'App language',
  'লেখার আকার': 'Text size',
  'ভয়েস': 'Voice',
  'ডিভাইসের ডিফল্ট': 'Device default',
  'পড়ার গতি': 'Reading speed',
  'ডেটা': 'Data',
  'সংরক্ষিত জায়গা': 'Storage used',
  'অগ্রগতি রপ্তানি করুন': 'Export progress',
  'সব তথ্য মুছে ফেলুন': 'Erase all data',
  'আপনি কি নিশ্চিত যে সব তথ্য মুছে ফেলতে চান?': 'Are you sure you want to erase all data?',
  'সেটিংস সংরক্ষণ করুন': 'Save settings',
  'সেটিংস সংরক্ষিত হয়েছে।': 'Settings saved.',
};

const TRANSLATIONS = { en: EN };

let currentLang = 'bn';

/** Set the module language (used by the number/date formatters). */
export function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'bn';
}

export function getLanguage() {
  return currentLang;
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
}

/**
 * Translate a key (a Bengali source string) into the active language.
 * `vars` supports {name} interpolation, applied in both languages.
 */
export function translate(key, vars, lang) {
  if (key === null || key === undefined) return key;
  const active = lang === undefined ? currentLang : lang === 'en' ? 'en' : 'bn';
  const template = active === 'en' ? (TRANSLATIONS.en[key] ?? key) : key;
  return interpolate(template, vars);
}

/**
 * React hook — current { t, lang } derived from the shared `appLanguage`
 * prop, so components re-render in the new language after a save.
 *
 * Also keeps the module language (used by the digit/date formatters) in
 * sync with the props this page is actually rendering with — belt and
 * braces alongside the router-event sync in app.jsx.
 */
export function useI18n() {
  const { appLanguage } = usePage().props;
  const lang = appLanguage === 'en' ? 'en' : 'bn';
  if (currentLang !== lang) setLanguage(lang);
  return {
    lang,
    t: (key, vars) => translate(key, vars, lang),
  };
}
