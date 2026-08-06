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
  'বাংলা কণ্ঠ (নারীর কণ্ঠ)': 'Bangla voice (female)',
  'বাংলা কণ্ঠ (পুরুষের কণ্ঠ)': 'Bangla voice (male)',
  'English voice (female)': 'English voice (female)',
  'English voice (male)': 'English voice (male)',
  'পড়ার গতি': 'Reading speed',
  'ডেটা': 'Data',
  'সংরক্ষিত জায়গা': 'Storage used',
  'অগ্রগতি রপ্তানি করুন': 'Export progress',
  'সব তথ্য মুছে ফেলুন': 'Erase all data',
  'আপনি কি নিশ্চিত যে সব তথ্য মুছে ফেলতে চান?': 'Are you sure you want to erase all data?',
  // ── Learn flow: lesson path / player / vocab / grammar / reading ──
  'এই লেভেলে কোনো পাঠ নেই': 'No lessons at this level yet',
  'Unit {n} শেষ করলে খুলে যাবে': 'Unlocks after completing Unit {n}',
  'খুঁজুন': 'Search',
  'আজ পুনরাবৃত্তির জন্য প্রস্তুত': 'Ready for review today',
  'টি কার্ড': 'cards',
  'সময়মতো দেখলে শব্দ বেশিদিন মনে থাকে': 'Reviewing on time helps words stick longer',
  'পুনরাবৃত্তি শুরু করুন': 'Start review',
  'ডেক': 'Decks',
  'কোনো ডেক নেই': 'No decks yet',
  '{n}টি শব্দ': '{n} words',
  'অর্থ দেখুন': 'Show meaning',
  'অর্থ দেখতে ট্যাপ করুন': 'Tap to see the meaning',
  'কার্ড পুনরাবৃত্তি': 'Card review',
  'জানি না': "Don't know",
  'কঠিন': 'Hard',
  'জানি': 'Know it',
  'পরের বার দেখা যাবে: ৩ দিন পর': 'Next review: in 3 days',
  'সেশন শেষ!': 'Session complete!',
  'আগামীকাল আবার আসুন — শব্দ মনে রাখতে নিয়মিত পুনরাবৃত্তি জরুরি': 'Come back tomorrow — regular review is key to remembering words',
  'গ্রামার লাইব্রেরি': 'Grammar Library',
  'বাংলা বা ইংরেজিতে খুঁজুন — যেমন \'article\' বা \'কাল\'': "Search in Bangla or English — e.g. 'article' or 'কাল'",
  'পড়া হয়েছে': 'Read',
  '{n}টি নিয়ম, সবই অফলাইনে পাওয়া যাবে': '{n} rules, all available offline',
  'সহজ ব্যাখ্যা': 'Simple explanation',
  'সঠিক উদাহরণ': 'Correct examples',
  'যে ভুলগুলো বেশি হয়': 'Common mistakes',
  'এই নিয়মে অনুশীলন করুন': 'Practice this rule',
  'আমার লেভেল ({level})': 'My level ({level})',
  'ছোট': 'Short',
  'বড়': 'Long',
  'এই ফিল্টারে কোনো পাঠ্য নেই': 'No passages match this filter',
  'সম্পন্ন': 'Done',
  'মিনিট': 'min',
  'সব পাঠ্য অফলাইনে পড়া যাবে': 'All passages are available offline',
  'প্রশ্নে যান': 'Go to questions',
  'বোধগম্যতা যাচাই': 'Comprehension check',
  'সম্পন্ন!': 'Complete!',
  'পাঠ্যটি পড়া শেষ — তালিকায় "সম্পন্ন" চিপ দেখাবে': 'Passage finished — it will show a "Done" chip in the list',
  'শব্দভাণ্ডারে যোগ করুন': 'Add to vocabulary',
  'বন্ধ করুন': 'Close',
  'পাঠ': 'Lesson',
  'ব্যাখ্যা': 'Explanation',
  'উদাহরণ': 'Examples',
  'মনে রাখুন': 'Remember',
  'অনুশীলন': 'Exercise',
  'অনুশীলন শুরু করুন': 'Start exercises',
  '{n}টি অনুশীলন, শেষে একটি চেক': '{n} exercises, then a final check',
  'পরের অনুশীলন': 'Next exercise',
  'সঠিক!': 'Correct!',
  'ভুল হয়েছে': 'Wrong',
  'ভালো করেছেন!': 'Great job!',
  '৭০% বা তার বেশি — পরের পাঠ খুলে গেছে': '70% or more — the next lesson is unlocked',
  '৭০% পেলেই পরের পাঠ খুলবে — এই পাঠটি আবার দেখুন': 'You need 70% to unlock the next lesson — review this one',
  'পরের পাঠ': 'Next lesson',
  'নিয়মটি পড়ুন': 'Read the rule',
  'শব্দ': 'words',
  'বাক্য': 'sentence',

  // ── Practice flow: pronunciation / listening / quiz / writing ──
  'উচ্চারণ স্টুডিও': 'Pronunciation Studio',
  'তালিকা': 'List',
  'কঠিন জোড়া': 'Minimal pairs',
  'ধীরে': 'Slow',
  'রেকর্ড করুন': 'Record',
  'চেপে ধরে বলুন': 'Press and hold to speak',
  'পরের বাক্য': 'Next sentence',
  'রিকগনিশন না চললে রেকর্ডিং মিলিয়ে দেখার সুযোগ থাকবে': 'If recognition is unavailable, you can still compare your recording',
  'সঠিক উচ্চারণ': 'Correct pronunciation',
  'আপনার উচ্চারণ': 'Your pronunciation',
  'আবার চেষ্টা করুন': 'Try again',
  'লিসেনিং প্র্যাকটিস': 'Listening Practice',
  'ডিকটেশন': 'Dictation',
  'বুঝে উত্তর দিন': 'Comprehension',
  'শুনুন': 'Listen',
  'বাক্যটি শুনুন': 'Listen to the sentence',
  'আবার': 'Again',
  'যা শুনলেন লিখুন…': 'Type what you heard…',
  'মিলিয়ে দেখুন': 'Check',
  '{total}টির মধ্যে {n}টি শব্দ মিলেছে': '{n} of {total} words matched',
  'ডিভাইসের ভয়েস ব্যবহার হয়, কোনো অডিও ফাইল নামাতে হয় না': 'Uses your device voice — no audio files to download',
  'অনুচ্ছেদটি শুনুন': 'Listen to the paragraph',
  'দারুণ! সব সঠিক': 'Great! All correct',
  'ফলাফল দেখুন': 'See results',
  'পরের প্রশ্ন': 'Next question',
  'প্রশ্ন {n}': 'Question {n}',
  'কুইজ ও টেস্ট সেন্টার': 'Quiz & Test Center',
  'ইতিহাস': 'History',
  'কুইক কুইজ': 'Quick Quiz',
  '১০টি প্রশ্ন · ৩ মিনিট · মিশ্র বিষয়': '10 questions · 3 minutes · mixed topics',
  'শুরু করুন': 'Start now',
  'টপিক টেস্ট': 'Topic Test',
  '২০টি প্রশ্ন · নির্দিষ্ট বিষয়ে': '20 questions · on a specific topic',
  'বিষয় বেছে শুরু করুন': 'Start by topic',
  'লেভেল টেস্ট': 'Level Test',
  '৩০টি প্রশ্ন · সময় বাঁধা ২০ মিনিট': '30 questions · 20-minute timer',
  'লেভেল বদলাতে পারে': 'May change your level',
  'পরীক্ষা দিন': 'Take the test',
  'সাম্প্রতিক ফল': 'Recent results',
  'গতকাল': 'Yesterday',
  '৩ দিন আগে': '3 days ago',
  '৫ দিন আগে': '5 days ago',
  'কুইজ চলছে': 'Quiz in progress',
  'এই প্রশ্নটি বাদ দিন': 'Skip this question',
  'ফলাফল': 'Result',
  'ভালো করেছেন': 'Well done',
  'আরেকটু অনুশীলন করুন': 'A bit more practice',
  'দক্ষতা অনুযায়ী': 'By skill',
  'গ্রামার': 'Grammar',
  'যেগুলো ভুল হয়েছে': 'Mistakes',
  'প্রশ্নটি বাদ দেওয়া হয়েছে': 'Question was skipped',
  'আবার দিন': 'Retake',
  'ভুল সংশোধক': 'Mistake Doctor',
  'তথ্য': 'Info',
  'সম্পূর্ণ অফলাইন — নির্দিষ্ট ভুলের তালিকা মিলিয়ে দেখা হয়': 'Fully offline — checks against a fixed mistake list',
  'একটি ইংরেজি বাক্য লিখুন…': 'Type an English sentence…',
  'যে ভুলটি পাওয়া গেল': 'Mistake found',
  'সঠিক ব্যবহার': 'Correct usage',
  'বেশি হয় এমন ভুল': 'Common mistakes',
  'তালিকায় নেই? AI সঙ্গীকে জিজ্ঞাসা করুন': "Not in the list? Ask the AI companion",
  'ফ্রেজবুক': 'Phrasebook',
  'সংরক্ষিত': 'Saved',
  'পরিস্থিতি বা বাক্য খুঁজুন…': 'Search phrases or situations…',
  'সংরক্ষণ করুন': 'Save',
  'সব বাক্য অফলাইনে পাওয়া যাবে': 'All phrases are available offline',
  'চাকরির ইন্টারভিউ': 'Job interview',
  'ডাক্তারের চেম্বার': "Doctor's office",
  'ব্যাংক': 'Bank',
  'বিমানবন্দর': 'Airport',
  'শ্রেণিকক্ষ': 'Classroom',
  'দোকান': 'Shop',
  'ফোনালাপ': 'Phone call',
  'শুরুতে': 'At the start',
  'শেষে': 'At the end',
  'সাক্ষাৎকার শুরুর সময়': 'When starting an interview',
  'সাক্ষাৎকারের শেষে প্রশ্ন করার সময়': 'When asking questions at the end',
  'লক্ষণ বলার সময়': 'Describing symptoms',
  'সাধারণ': 'General',
  'চেক-ইন': 'Check-in',
  'শ্রেণিকক্ষে': 'In class',
  'কেনাকাটা': 'Shopping',
  'ফোনে': 'On the phone',
  'রাইটিং ডেস্ক': 'Writing Desk',
  'খসড়া': 'Drafts',
  'সেভ': 'Save',
  'কাঠামো দেখুন': 'View structure',
  'এখানে ইংরেজিতে লিখুন…': 'Write in English here…',
  'AI ফিডব্যাক নিন': 'Get AI feedback',
  'দরখাস্ত': 'Application',
  'ইমেইল': 'Email',
  'প্যারাগ্রাফ': 'Paragraph',
  'গল্প': 'Story',
  'মতামত': 'Opinion',
  'খসড়া চালিয়ে যান': 'Continue drafts',
  'নতুন লেখা শুরু করুন': 'Start a new piece',
  'সব খসড়া ডিভাইসে সংরক্ষিত থাকে': 'All drafts are saved on your device',
  'অফিসে ছুটির জন্য ইমেইল': 'Email requesting a day off',
  'ব্যাংক অ্যাকাউন্ট খোলার দরখাস্ত': 'Application for a bank account',
  'দৈনন্দিন রুটিন নিয়ে প্যারাগ্রাফ': 'Paragraph about your daily routine',
  'বৃষ্টির দিন দিয়ে শুরু করা গল্প': 'Story starting with a rainy day',

  // ── AI flow: chat + writing ──
  'AI সঙ্গী': 'AI Companion',
  'শেষ করুন': 'Finish',
  'ইংরেজিতে উত্তর লিখুন…': 'Type your answer in English…',
  'মাইক্রোফোন': 'Microphone',
  'পাঠান': 'Send',
  'লিখছেন…': 'Typing…',
  'শব্দ খুঁজে পাচ্ছি না': "I can't find the word",
  'আরেকবার বলুন': 'Say it again',
  'সংশোধন': 'Correction',
  'ব্যাখ্যা দেখুন': 'See explanation',
  'দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।': 'Sorry, something went wrong. Please try again.',
  'লেখা যাচাই': 'Writing check',
  'আপনার লেখা এখানে পেস্ট করুন…': 'Paste your writing here…',
  'রাইটিং ডেস্ক থেকে আনুন': 'Import from Writing Desk',
  'যাচাই হচ্ছে…': 'Checking…',
  'যাচাই করুন': 'Check',
  '{n}টি ভুল': '{n} mistakes',
  '{n}টি পরামর্শ': '{n} suggestions',
  'স্তর: {level}': 'Level: {level}',
  'আপনার লেখায় আমাদের তালিকার কোনো পরিচিত ভুল পাওয়া যায়নি। ভালো করেছেন!': "We couldn't find any known mistakes in your writing. Nice job!",
  'কপি করুন': 'Copy',
  'সংশোধিত লেখা কপি করুন': 'Copy corrected text',
  'কথা বলতে চাইলে AI সঙ্গী ট্যাবে যান।': 'To chat, go to the AI Companion tab.',

  // ── Profile flow: progress + study plan ──
  'অগ্রগতি': 'Progress',
  'শেয়ার করুন': 'Share',
  'সপ্তাহ': 'Week',
  'মাস': 'Month',
  'সব সময়': 'All time',
  'চার দক্ষতা': 'Four skills',
  'দুর্বলতম': 'Weakest',
  '{n} দিনের স্ট্রিক': '{n}-day streak',
  'সাপ্তাহিক সময়': 'Weekly time',
  'এই সপ্তাহে {n} মিনিট': '{n} minutes this week',
  'পরবর্তী পদক্ষেপ': 'Next step',
  '{skill} দক্ষতা পিছিয়ে আছে — আজ ৫ মিনিট সময় দিন': '{skill} skill is behind — spend 5 minutes today',
  'সব হিসাব আপনার ডিভাইসেই থাকে': 'All stats stay on your device',
  'AI স্টাডি প্ল্যান': 'AI Study Plan',
  'আবার তৈরি করুন': 'Rebuild',
  '৩০ দিনের পরিকল্পনা তৈরি করুন': 'Create a 30-day plan',
  'একবার তৈরি হলে ইন্টারনেট ছাড়াই পুরো মাস চলবে': 'Once created, it works all month offline',
  'লেভেল': 'Level',
  'লক্ষ্য': 'Goal',
  'দৈনিক সময়': 'Daily time',
  'চাকরি': 'Job',
  'পরীক্ষা': 'Exam',
  'বিদেশ যাত্রা': 'Going abroad',
  'সাধারণ উন্নতি': 'General improvement',
  '১০ মিনিট': '10 min',
  '২০ মিনিট': '20 min',
  '৩০ মিনিট': '30 min',
  '৬০ মিনিট': '60 min',
  'তৈরি করার সময় একবার ইন্টারনেট লাগবে': 'Internet is needed once when creating',
  'পরিকল্পনা তৈরি করুন': 'Create plan',
  'দিন {n} / ৩০': 'Day {n} / 30',
  'আগামী দিনগুলো': 'Upcoming days',
  'দিন {n}': 'Day {n}',
  'পরিকল্পনাটি আপনার ডিভাইসে সংরক্ষিত — অফলাইনেও খুলবে': 'Your plan is saved on your device — it works offline',

  // ── Onboarding flow ──
  'আপনার লেভেল': 'Your level',
  'আপনার লেভেল — {level}': 'Your level — {level}',
  '{total}টির মধ্যে {score}টি সঠিক': '{score} correct out of {total}',
  'দক্ষতা অনুযায়ী ফল': 'Result by skill',
  'সবচেয়ে দুর্বল': 'Weakest',
  'একবার তৈরি হলে ইন্টারনেট ছাড়াই চলবে': 'Once created, it works offline',
  'শেখা শুরু করুন': 'Start learning',
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
