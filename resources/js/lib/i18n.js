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
  'পাঠ': 'Lessons',
  'AI সঙ্গী': 'AI Companion',
  'অনুশীলন': 'Practice',
  'অগ্রগতি': 'Progress',
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
  'ইংরেজি শেখার রিমাইন্ডার': 'English learning reminder',
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
  'AI ফিডব্যাক নেওয়া হচ্ছে…': 'Getting AI feedback…',
  'দুঃখিত, AI ফিডব্যাক নেওয়া যায়নি': "Sorry, we couldn't get AI feedback",
  'ইন্টারনেট বা API সংযোগ পরীক্ষা করে আবার চেষ্টা করুন': 'Check your internet or API connection and try again',
  'আবার চেষ্টা করুন': 'Try again',
  'লেখা যাচাই খুলুন': 'Open writing check',
  'দারুণ! আপনার লেখায় কোনো ভুল পাওয়া যায়নি।': 'Great! No mistakes found in your writing.',
  'স্কোর: {score}': 'Score: {score}',
  'এই বিভাগে এখনো কোনো বিষয় নেই': 'No topics in this category yet',
  'ফিডব্যাক আছে': 'Has feedback',
  'লেখা বদলেছে — আবার AI ফিডব্যাক নিন': 'Your text changed — get AI feedback again',
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
  'আগের ফিডব্যাক': 'Previous feedback',
  'খসড়ায় সেভ করুন': 'Save to draft',
  'এই খসড়ায় সেভ করুন': 'Update this draft',
  'সেভ হচ্ছে…': 'Saving…',
  'খসড়ার নাম (ঐচ্ছিক)': 'Draft title (optional)',
  'খসড়ায় সেভ হয়েছে — রাইটিং ডেস্কে দেখুন': 'Saved to drafts — see it in the Writing Desk',
  'খসড়াটি আপডেট হয়েছে': 'Draft updated',
  'সেভ করা যায়নি — আবার চেষ্টা করুন': "Couldn't save — try again",
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
  'AI পরিকল্পনা তৈরি হচ্ছে…': 'Creating your AI plan…',
  'পরিকল্পনা তৈরি করা যায়নি — আবার চেষ্টা করুন।': 'Could not create the plan — please try again.',
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
  'লেভেল নির্ণয় পরীক্ষা': 'Placement Test',
  'উত্তর বদলানো যাবে না': 'Answers cannot be changed later',
  'সঠিক শব্দটি বেছে নিন': 'Choose the correct word',
  'স্তর: শুরু': 'Beginner',
  'স্তর: প্রাথমিক': 'Elementary',
  'স্তর: মধ্যম': 'Intermediate',
  'কুইজ শুরু করুন': 'Start now',

  // ── Welcome landing (public) ──
  'ইংরেজি শেখা এখন সহজ, মজার আর কার্যকর': 'Learning English is now easy, fun and effective',
  'প্রধান মেনু': 'Main menu',
  'মোবাইল মেনু': 'Mobile menu',
  'ভাষা বদলান': 'Change language',
  'মেনু বন্ধ করুন': 'Close menu',
  'মেনু খুলুন': 'Open menu',
  'শুরু করি': "Let's start",
  'লগইন': 'Log in',
  'বাংলাদেশের শিক্ষার্থীদের জন্য তৈরি': 'Built for students in Bangladesh',
  'ইংরেজি শেখা এখন': 'Learning English is now',
  'সহজ, মজার আর কার্যকর': 'easy, fun and effective',
  'পড়া, শোনা, বলা ও লেখা — চারটি দক্ষতাই এক জায়গায়। নিজের গতিতে, প্রতিদিনের ছোট ছোট লেসনে, ইন্টারনেট ছাড়াই অনুশীলন করুন।': 'Reading, listening, speaking and writing — all four skills in one place. Practice at your own pace, in small daily lessons, even without internet.',
  'ফ্রিতে শুরু করি': 'Start free',
  'আগে থেকে অ্যাকাউন্ট আছে': 'Already have an account',
  '৪টি দক্ষতা এক জায়গায়': '4 skills in one place',
  'দৈনিক {n} মিনিট': '{n} minutes daily',
  'শেখা শব্দের নমুনা': 'Sample words to learn',
  'পরিসংখ্যান': 'Statistics',
  'যা শিখবেন': "What you'll learn",
  'চারটি দক্ষতা, একটি অ্যাপে': 'Four skills, one app',
  'পড়া, শোনা, বলা আর লেখা — প্রতিটি দক্ষতার জন্য আলাদা পথ, আপনার গতিতে।': 'Reading, listening, speaking and writing — a separate path for each skill, at your own pace.',
  'সব ফিচার': 'All features',
  'শেখার প্রতিটি ধাপে পাশে আছি': "We're beside you at every step",
  'অনুশীলন থেকে অগ্রগতি — দৈনন্দিন শেখার পুরো চক্র এক জায়গায়।': 'From practice to progress — the whole daily learning cycle in one place.',
  'AI টিউটর': 'AI Tutor',
  'আপনার ব্যক্তিগত': 'Your personal',
  'সবসময় পাশে': 'always by your side',
  'যেকোনো সময় ইংরেজিতে চ্যাট করুন, ভুল শুধরে নিন, আর লেখা জমা দিয়ে তাৎক্ষণিক ফিডব্যাক নিন — আপনার লেভেল অনুযায়ী।': 'Chat in English anytime, fix your mistakes, and submit writing for instant feedback — tailored to your level.',
  'AI টিউটরের সাথে দেখা করুন': 'Meet your AI tutor',
  'কীভাবে কাজ করে': 'How it works',
  'মাত্র তিনটি ধাপে শুরু': 'Start in just three steps',
  'কোনো ঝামেলা ছাড়াই — ফোন নম্বর দিয়েই সবকিছু।': 'No hassle — everything starts with your phone number.',
  'শিক্ষার্থীদের কথা': 'From our learners',
  'তারা শিখছেন, আপনিও পারবেন': 'They are learning — so can you',
  'সারা বাংলাদেশের শিক্ষার্থীরা প্রতিদিন এই অ্যাপে অনুশীলন করছেন।': 'Students across Bangladesh practice in this app every day.',
  'আজই শুরু করুন': 'Start today',
  'আপনার ইংরেজি শেখার যাত্রা শুরু হোক আজই': 'Start your English learning journey today',
  'প্রথম পাঠ সম্পূর্ণ বিনামূল্যে — মাত্র {n} মিনিটে। ফোন নম্বর দিয়েই শুরু, কোনো ঝামেলা নেই।': 'Your first lesson is completely free — just {n} minutes. Start with your phone number, no hassle.',
  'প্রশ্নোত্তর': 'FAQ',
  'সাধারণ জিজ্ঞাসা': 'Frequently asked questions',
  'আপনার মনে প্রশ্ন থাকলে — সম্ভবত উত্তর এখানেই আছে।': 'Got a question? The answer is probably here.',
  '৫ স্টার': '5 stars',
  'বাংলাদেশের শিক্ষার্থীদের জন্য ইংরেজি শেখার সম্পূর্ণ সমাধান — পড়া, শোনা, বলা ও লেখা, এক অ্যাপে।': 'A complete English learning solution for Bangladeshi students — reading, listening, speaking and writing, all in one app.',
  'ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত': 'Your personal data is fully protected',
  'পণ্য': 'Product',
  'সহায়তা': 'Support',
  'যোগাযোগ': 'Contact',
  'আমাদের কার্যালয়:': 'Our office:',
  'পল্লবী, মিরপুর, ঢাকা': 'Pallabi, Mirpur, Dhaka',
  'সর্বস্বত্ব সংরক্ষিত': 'All rights reserved',
  'বৈশিষ্ট্য': 'Features',
  'নতুন করে শুরু': 'Start over',
  '{n} দিনের ধারা': '{n}-day streak',
  'অনলাইন': 'Online',
  'হাই! আজ কী শিখতে চান?': 'Hi! What would you like to learn today?',
  '"Agree" এর পরে "am" বসে না — এখানে সরাসরি verb বসে।': '"Agree" does not take "am" before it — the verb stands alone.',
  'ইংরেজিতে লিখুন…': 'Type in English…',
  'গ্লোসারি ও উচ্চারণ সহ পাঠ — ধাপে ধাপে বুঝে পড়ার অভ্যাস।': 'Graded passages with glossary and pronunciation — build a step-by-step reading habit.',
  'নিজের গতিতে লিসেনিং অনুশীলন, প্রতিটি শব্দের সাথে পরিচিতি।': 'Listening practice at your own pace, getting familiar with every word.',
  'উচ্চারণ অনুশীলন ও স্কোর — ভুলগুলো ধরে ধরে শুধরে নিন।': 'Pronunciation practice with scoring — catch and fix your mistakes.',
  'দৈনিক রাইটিং চর্চা, সঙ্গে AI-র তাৎক্ষণিক ফিডব্যাক।': 'Daily writing practice with instant AI feedback.',
  'স্মার্ট ফ্ল্যাশকার্ড': 'Smart flashcards',
  'মুখস্থ করার বৈজ্ঞানিক পদ্ধতিতে নতুন শব্দ মনে রাখুন।': 'Remember new words using the science of spaced repetition.',
  'কুইজ সেন্টার': 'Quiz center',
  'নিয়মিত কুইজে নিজের অগ্রগতি যাচাই করুন।': 'Test your progress with regular quizzes.',
  'ফ্রেজবুক': 'Phrasebook',
  'দরকারি বাক্য ও এক্সপ্রেশন সবসময় হাতের কাছে।': 'Useful phrases and expressions always at hand.',
  'ব্যক্তিগত স্টাডি প্ল্যান': 'Personal study plan',
  'আপনার লক্ষ্য ও সময় অনুযায়ী দিনে দিনে সাজানো।': 'Planned day by day around your goal and schedule.',
  'অগ্রগতি ড্যাশবোর্ড': 'Progress dashboard',
  'স্কিল-ভিত্তিক বিশ্লেষণে দেখুন কোথায় উন্নতি করছেন।': 'Skill-based analytics show where you are improving.',
  'রিমাইন্ডার': 'Reminder',
  'দৈনিক অনুশীলনে নিয়মিত থাকতে মনে করিয়ে দেবে।': 'Keeps you consistent with daily practice nudges.',
  '২৪/৭ ইংরেজি চ্যাট': '24/7 English chat',
  'যেকোনো সময় কথা বলুন, তাৎক্ষণিক সংশোধন পান।': 'Talk anytime, get instant corrections.',
  'রাইটিং ফিডব্যাক': 'Writing feedback',
  'লেখা জমা দিন — ভুল, উন্নতি ও স্কোর একসাথে।': 'Submit writing — mistakes, improvements and a score together.',
  'লেভেল-ভিত্তিক গাইড': 'Level-based guidance',
  'আপনার লেভেল অনুযায়ী ঠিক কী শিখবেন, তার দিকনির্দেশনা।': 'Guidance on exactly what to learn for your level.',
  'প্রোফাইল তৈরি করুন': 'Create your profile',
  'নাম, শেখার লক্ষ্য ও দৈনিক সময় বলুন — ফোন নম্বর দিয়েই।': 'Tell us your name, learning goal and daily time — just with your phone number.',
  'লেভেল নির্ধারণ করুন': 'Find your level',
  'ছোট একটি প্লেসমেন্ট টেস্টে আপনার বর্তমান লেভেল জানুন।': 'Discover your current level with a short placement test.',
  'প্রতিদিন শিখুন': 'Learn every day',
  'দৈনিক লেসন, ফ্ল্যাশকার্ড ও অনুশীলন — মাত্র ১৫ মিনিটে।': 'Daily lessons, flashcards and practice — in just 15 minutes.',
  'দৈনিক ১৫ মিনিট করে শুরু করেছিলাম। এখন অফিসের মিটিংয়ে ইংরেজিতে বলতে আর ভয় পাই না।': 'I started with 15 minutes a day. Now I no longer fear speaking English in office meetings.',
  'AI রাইটিং ফিডব্যাকের কারণে লেখার ভুলগুলো এখন নিজেই ধরতে পারি। সত্যিই দারুণ অভিজ্ঞতা।': 'Thanks to AI writing feedback I can now spot my own writing mistakes. A truly great experience.',
  'অফলাইনে ফ্ল্যাশকার্ড রিভিউ করি, কাজে আসা-যাওয়ার পথে। অনেক সময় বেঁচে যায়।': "I review flashcards offline on my commute. It saves a lot of time.",
  'রাফসান আহমেদ': 'Rafsan Ahmed',
  'ঢাকা': 'Dhaka',
  'নুসরাত জাহান': 'Nusrat Jahan',
  'চট্টগ্রাম': 'Chattogram',
  'তানভীর হাসান': 'Tanvir Hasan',
  'সিলেট': 'Sylhet',
  'কীভাবে শুরু করব?': 'How do I get started?',
  'ফোন নম্বর দিয়ে লগইন করুন — প্রথমবার একটি OTP যাচাই হবে। এরপর প্রোফাইল তৈরি করে নিজের গতিতে শেখা শুরু করুন।': 'Log in with your phone number — an OTP will be verified the first time. Then set up your profile and start learning at your own pace.',
  'ইন্টারনেট ছাড়া কি ব্যবহার করা যাবে?': 'Can I use it without internet?',
  'হ্যাঁ। পাঠ, ফ্ল্যাশকার্ড, কুইজসহ বেশিরভাগ অনুশীলন অফলাইনে চলে। শুধু AI টিউটর ও রাইটিং ফিডব্যাকে ইন্টারনেট লাগবে।': 'Yes. Most practice — lessons, flashcards and quizzes — works offline. Only the AI tutor and writing feedback need internet.',
  'সাবস্ক্রিপশন কীভাবে বাতিল করব?': 'How do I cancel my subscription?',
  'SMS-এ STOP লিখে পাঠিয়ে অথবা USSD মেনু থেকে যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে পারবেন।': 'You can cancel anytime by sending STOP via SMS or through the USSD menu.',
  'কোন ডিভাইসে চলে?': 'Which devices does it work on?',
  'যেকোনো স্মার্টফোনের ব্রাউজারে চলে, আবার Android অ্যাপও ডাউনলোড করা যায়। শুধু আপনার ফোন নম্বর লাগবে।': 'It runs in any smartphone browser, and an Android app is also available. All you need is your phone number.',
  'আমার লেভেল কীভাবে নির্ধারিত হয়?': 'How is my level determined?',
  'শুরুতে একটি সংক্ষিপ্ত প্লেসমেন্ট টেস্ট দিতে হবে। তার ফলাফলের ভিত্তিতে আপনার জন্য উপযুক্ত পাঠ ও অনুশীলন সাজানো হয়।': 'You take a short placement test at the start. Your lessons and practice are then arranged based on the result.',
  'দক্ষতা এক জায়গায়': 'skills in one place',
  'পাঠ ও লেসন': 'lessons & courses',
  'ধাপে ধাপে সাজানো': 'arranged step by step',
  'শব্দ ও ফ্রেজ': 'words & phrases',
  'দৈনন্দিন ব্যবহারে': 'for daily use',
  'মিনিট প্রতিদিন': 'minutes per day',
  'ছোট, নিয়মিত লেসন': 'short, regular lessons',

  // ── Profile setup (onboarding) ──
  'আপনার সম্পর্কে একটু বলুন': 'Tell us a little about yourself',
  'আপনার সম্পর্কে': 'About you',
  'সংরক্ষণ হচ্ছে…': 'Saving…',
  'সংরক্ষণ করুন': 'Save',
  'পরের ধাপ': 'Next step',
  'বাতিল': 'Cancel',
  'এড়িয়ে যান': 'Skip',
  'ধাপ ১/৩ — প্রোফাইল': 'Step 1/3 — Profile',
  'নাম, লক্ষ্য আর দৈনিক সময় যোগ করলে আমরা আপনার জন্য আরও ভালো শেখার পরিকল্পনা সাজিয়ে দেব।': 'Add your name, goal and daily time and we will build a better learning plan for you.',
  'নাম, লক্ষ্য আর দৈনিক সময় জানালে আমরা আপনার শেখার পথ বানিয়ে দেব — আপনার গতিতে।': 'Tell us your name, goal and daily time and we will shape your learning path — at your pace.',
  'আপনার নাম': 'Your name',
  'কেমন করে ডাকব আপনাকে': 'What should we call you',
  'আপনার লক্ষ্য': 'Your goal',
  'চাকরি, পরীক্ষা, বিদেশ যাত্রা বা সাধারণ উন্নতি': 'Job, exam, going abroad or general improvement',
  '১০ থেকে ৬০ মিনিট — আপনার সুবিধামতো': '10 to 60 minutes — whatever suits you',
  'মাত্র ১ মিনিটেই শেষ': 'Done in just 1 minute',
  'পরের ধাপে লেভেল পরীক্ষা, তারপর ৩০ দিনের শেখার পরিকল্পনা।': 'Next comes the level test, then your 30-day learning plan.',
  'নাম': 'Name',
  'প্রতিদিন কত সময় দিতে পারবেন': 'How much time can you give daily?',
  'মিনিট': 'min',
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
const GUEST_LANG_KEY = 'learn_guest_lang';

/** Read the guest (public landing) language preference, if any. */
export function getGuestLanguage() {
  try {
    const v = window.localStorage.getItem(GUEST_LANG_KEY);
    return v === 'en' ? 'en' : v === 'bn' ? 'bn' : null;
  } catch {
    return null;
  }
}

/** Persist the guest language preference (used by the Welcome toggle). */
export function setGuestLanguage(lang) {
  try {
    if (lang === 'en' || lang === 'bn') window.localStorage.setItem(GUEST_LANG_KEY, lang);
  } catch {
    // ignore storage failures
  }
}

/**
 * React hook — current { t, lang } derived from the shared `appLanguage`
 * prop, so components re-render in the new language after a save.
 *
 * Logged-out pages (public Welcome) have no `appLanguage`; they fall back
 * to the on-device guest preference (localStorage) so the landing page's
 * language toggle drives the whole page. Logged-in pages always carry the
 * prop, so the subscriber's saved choice stays authoritative.
 *
 * Also keeps the module language (used by the digit/date formatters) in
 * sync with the props this page is actually rendering with — belt and
 * braces alongside the router-event sync in app.jsx.
 */
export function useI18n() {
  const { appLanguage, auth } = usePage().props;
  // Logged-in pages always carry the subscriber's saved appLanguage, which is
  // authoritative. Only logged-out pages (the public Welcome landing) fall
  // back to the on-device guest preference so its toggle drives the page.
  const isGuest = auth?.isLoggedIn === false;
  const lang = (isGuest ? getGuestLanguage() : appLanguage || 'bn') === 'en' ? 'en' : 'bn';
  if (currentLang !== lang) setLanguage(lang);
  return {
    lang,
    t: (key, vars) => translate(key, vars, lang),
  };
}
