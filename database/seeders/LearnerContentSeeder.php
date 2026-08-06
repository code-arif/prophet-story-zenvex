<?php

namespace Database\Seeders;

use App\Models\Learner\AiScenario;
use App\Models\Learner\CommonMistake;
use App\Models\Learner\GrammarRule;
use App\Models\Learner\Lesson;
use App\Models\Learner\ListeningItem;
use App\Models\Learner\Phrase;
use App\Models\Learner\PronunciationItem;
use App\Models\Learner\Quiz;
use App\Models\Learner\ReadingPassage;
use App\Models\Learner\VocabDeck;
use App\Models\Learner\VocabularyWord;
use App\Models\Learner\WritingPrompt;
use Illuminate\Database\Seeder;

/**
 * LearnerContentSeeder — the real curriculum that powers the learner app.
 * Runs idempotently (keyed on slugs) so it can be re-run safely.
 */
class LearnerContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedLessons();
        $this->seedVocabulary();
        $this->seedGrammar();
        $this->seedReading();
        $this->seedQuizzes();
        $this->seedAiScenarios();
        $this->seedPhrases();
        $this->seedCommonMistakes();
        $this->seedWritingPrompts();
        $this->seedAudioPractice();
    }

    // ── Lessons ──────────────────────────────────────────────────────

    private function seedLessons(): void
    {
        $lessons = [
            // ── A1 · Unit 1 — নিজের পরিচয় ──
            ['level' => 'A1', 'unit_no' => 1, 'order_index' => 1, 'title_en' => 'Be Verbs — am / is / are', 'title_bn' => 'am/is/are এর ব্যবহার', 'subtitle_bn' => 'আমি, তুমি, সে — কে কী', 'explanation_bn' => 'am, is, are হলো be verb। "I"-এর সাথে am, he/she/it বা একবচন কর্তার সাথে is, আর you/we/they বা বহুবচন কর্তার সাথে are বসে। এগুলো দিয়ে পরিচয়, অবস্থা ও পেশা বোঝানো হয়।', 'examples' => [
                ['en' => 'I am a student.', 'bn' => 'আমি একজন শিক্ষার্থী।'],
                ['en' => 'She is my sister.', 'bn' => 'সে আমার বোন।'],
                ['en' => 'They are from Dhaka.', 'bn' => 'তারা ঢাকার।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I ___ a teacher.', 'options' => ['am', 'is', 'are'], 'answer' => 0, 'explanationBn' => '"I"-এর সাথে সবসময় am বসে।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ my brother.', 'options' => ['am', 'is', 'are'], 'answer' => 1, 'explanationBn' => 'He একবচন কর্তা, তাই is বসে।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'We ___ friends.', 'options' => ['am', 'is', 'are'], 'answer' => 2, 'explanationBn' => 'We বহুবচন, তাই are বসে।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 1, 'order_index' => 2, 'title_en' => 'Subject Pronouns', 'title_bn' => 'কর্তৃবাচক সর্বনাম', 'subtitle_bn' => 'I, you, he, she, it, we, they', 'explanation_bn' => 'Subject pronoun বাক্যের কর্তা হিসেবে বসে: I (আমি), you (তুমি/আপনি), he (সে-পুরুষ), she (সে-নারী), it (এটি), we (আমরা), they (তারা)। নামের বদলে এগুলো ব্যবহার হয়।', 'examples' => [
                ['en' => 'Rahim is a boy. He is my friend.', 'bn' => 'রাহিম ছেলে। সে আমার বন্ধু।'],
                ['en' => 'Mina and I are here. We are ready.', 'bn' => 'মিনা আর আমি এখানে। আমরা প্রস্তুত।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Mina is a girl. ___ is my classmate.', 'options' => ['He', 'She', 'It'], 'answer' => 1, 'explanationBn' => 'মিনা মেয়ে, তাই She বসে।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Rahim and I play. ___ play together.', 'options' => ['We', 'They', 'He'], 'answer' => 0, 'explanationBn' => 'Rahim এবং I মানে আমরা, তাই We বসে।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'The book is new. ___ is on the table.', 'options' => ['He', 'She', 'It'], 'answer' => 2, 'explanationBn' => 'বইয়ের জন্য It বসে।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 1, 'order_index' => 3, 'title_en' => 'Questions with What / Who', 'title_bn' => 'What/Who দিয়ে প্রশ্ন', 'subtitle_bn' => 'জিনিস ও মানুষ সম্পর্কে জানা', 'explanation_bn' => 'What দিয়ে জিনিস, কাজ ও তথ্য জানতে চাওয়া হয়; Who দিয়ে মানুষ সম্পর্কে। যেমন: What is your name? Who is she?', 'examples' => [
                ['en' => 'What is your name?', 'bn' => 'তোমার নাম কী?'],
                ['en' => 'Who is that man?', 'bn' => 'ঐ লোকটি কে?'],
                ['en' => 'What do you do?', 'bn' => 'তুমি কী করো?'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ is your name?', 'options' => ['What', 'Who', 'Where'], 'answer' => 0, 'explanationBn' => 'নাম জিনিস/তথ্য, তাই What।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ is the new teacher?', 'options' => ['What', 'Who', 'When'], 'answer' => 1, 'explanationBn' => 'মানুষ সম্পর্কে জানতে Who।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ do you study English?', 'options' => ['What', 'Who', 'Why'], 'answer' => 2, 'explanationBn' => 'কারণ জানতে Why।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 1, 'order_index' => 4, 'title_en' => 'Possessives', 'title_bn' => 'অধিকারবাচক শব্দ', 'subtitle_bn' => 'my, your, his, her, our, their', 'explanation_bn' => 'অধিকার বোঝাতে my (আমার), your (তোমার), his (তার-পুরুষ), her (তার-নারী), our (আমাদের), their (তাদের) ব্যবহার হয়। এদের পরে noun বসে।', 'examples' => [
                ['en' => 'This is my book.', 'bn' => 'এটি আমার বই।'],
                ['en' => 'Her name is Nusrat.', 'bn' => 'তার নাম নুসরাত।'],
                ['en' => 'Their house is big.', 'bn' => 'তাদের বাড়ি বড়।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I have a pen. It is ___ pen.', 'options' => ['my', 'his', 'her'], 'answer' => 0, 'explanationBn' => 'আমার কথা বলা হচ্ছে, তাই my।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Mina has a bag. It is ___ bag.', 'options' => ['his', 'her', 'our'], 'answer' => 1, 'explanationBn' => 'মিনা নারী, তাই her।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Rahim has a bike. It is ___ bike.', 'options' => ['her', 'our', 'his'], 'answer' => 2, 'explanationBn' => 'রাহিম পুরুষ, তাই his।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 1, 'order_index' => 5, 'title_en' => 'Review Check', 'title_bn' => 'পুনরালোচনা', 'subtitle_bn' => 'ইউনিট ১-এর সবকিছু', 'explanation_bn' => 'এই ইউনিটে আমরা am/is/are, subject pronoun, What/Who প্রশ্ন আর possessive শব্দ শিখেছি। এখন সব একসাথে যাচাই করি।', 'examples' => [
                ['en' => 'I am Rahim. My name is Rahim.', 'bn' => 'আমি রাহিম। আমার নাম রাহিম।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ name is Karim and he is my friend.', 'options' => ['My', 'His', 'Her'], 'answer' => 1, 'explanationBn' => 'Karim পুরুষ, তার নাম — His।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I am from Sylhet. I ___ a teacher.', 'options' => ['am', 'is', 'are'], 'answer' => 0, 'explanationBn' => 'I এর সাথে am।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ is your father?', 'options' => ['What', 'Who', 'Where'], 'answer' => 1, 'explanationBn' => 'মানুষ সম্পর্কে প্রশ্নে Who।'],
            ], 'estimated_minutes' => 5],

            // ── A1 · Unit 2 — পরিচিত শব্দ ──
            ['level' => 'A1', 'unit_no' => 2, 'order_index' => 6, 'title_en' => 'Plurals — s / es', 'title_bn' => 'বহুবচন s/es', 'subtitle_bn' => 'এক থেকে অনেক', 'explanation_bn' => 'বেশিরভাগ noun-এর শেষে s যোগ করলে বহুবচন হয়: book → books। s, sh, ch, x, o দিয়ে শেষ হলে es যোগ হয়: box → boxes।', 'examples' => [
                ['en' => 'one book, two books', 'bn' => 'একটি বই, দুটি বই'],
                ['en' => 'a box, three boxes', 'bn' => 'একটি বাক্স, তিনটি বাক্স'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I have two ___.', 'options' => ['pen', 'pens', 'penss'], 'answer' => 1, 'explanationBn' => 'দুটি পেন — pens (বহুবচন)।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'There are three ___ on the table.', 'options' => ['box', 'boxs', 'boxes'], 'answer' => 2, 'explanationBn' => 'x দিয়ে শেষ — boxes।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'She has many ___.', 'options' => ['book', 'books', 'bookes'], 'answer' => 1, 'explanationBn' => 'book → books।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 2, 'order_index' => 7, 'title_en' => 'This / That / These / Those', 'title_bn' => 'এটি/ওটি/এগুলো/ওগুলো', 'subtitle_bn' => 'কাছে ও দূরে', 'explanation_bn' => 'কাছে থাকা জিনিসের জন্য this (একবচন) ও these (বহুবচন); দূরে থাকার জন্য that ও those ব্যবহার হয়।', 'examples' => [
                ['en' => 'This is my phone.', 'bn' => 'এটি আমার ফোন।'],
                ['en' => 'Those are my shoes.', 'bn' => 'ওগুলো আমার জুতা।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ is a pen near me.', 'options' => ['This', 'That', 'Those'], 'answer' => 0, 'explanationBn' => 'কাছের একবচন — This।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Look at ___ birds far away!', 'options' => ['This', 'These', 'Those'], 'answer' => 2, 'explanationBn' => 'দূরের বহুবচন — Those।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ books in my hand are new.', 'options' => ['This', 'These', 'That'], 'answer' => 1, 'explanationBn' => 'কাছের বহুবচন — These।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 2, 'order_index' => 8, 'title_en' => 'Numbers & Time', 'title_bn' => 'সংখ্যা ও সময়', 'subtitle_bn' => 'গণনা ও ঘড়ি', 'explanation_bn' => 'সময় বলতে o’clock, half past, quarter past/quarter to ব্যবহার হয়। "Half past seven" মানে সাড়ে ৭টা।', 'examples' => [
                ['en' => 'It is three o’clock.', 'bn' => 'এখন ঠিক ৩টা।'],
                ['en' => 'It is half past six.', 'bn' => 'এখন সাড়ে ৬টা।'],
                ['en' => 'It is quarter to nine.', 'bn' => 'এখন ৯টা বাজতে ১৫ মিনিট বাকি।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'The bus leaves at half ___ eight.', 'options' => ['past', 'to', 'quarter'], 'answer' => 0, 'explanationBn' => '"Half past eight" মানে সাড়ে ৮টা।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'It is quarter ___ ten.', 'options' => ['past', 'to', 'o’clock'], 'answer' => 1, 'explanationBn' => '"Quarter to ten" মানে ১০টা বাজতে ১৫ মিনিট বাকি।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'The meeting starts at nine ___.', 'options' => ['past', 'to', 'o’clock'], 'answer' => 2, 'explanationBn' => '"Nine o’clock" মানে ঠিক ৯টা।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A1', 'unit_no' => 2, 'order_index' => 9, 'title_en' => 'Review Check', 'title_bn' => 'পুনরালোচনা', 'subtitle_bn' => 'ইউনিট ২-এর সবকিছু', 'explanation_bn' => 'বহুবচন, this/that/these/those আর সময় — সব একসাথে চর্চা করি।', 'examples' => [
                ['en' => 'These are my books and those are his.', 'bn' => 'এগুলো আমার বই, ওগুলো তার।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I have four ___.', 'options' => ['watchs', 'watches', 'watch'], 'answer' => 1, 'explanationBn' => 'ch দিয়ে শেষ — watches।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ is my bag next to me.', 'options' => ['This', 'That', 'Those'], 'answer' => 0, 'explanationBn' => 'কাছের একবচন — This।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'It is half past ___. (সাড়ে ১১টা)', 'options' => ['eleven', 'twelve', 'ten'], 'answer' => 0, 'explanationBn' => 'সাড়ে ১১টা — half past eleven।'],
            ], 'estimated_minutes' => 5],

            // ── A2 · Unit 3 — দৈনন্দিন রুটিন ──
            ['level' => 'A2', 'unit_no' => 3, 'order_index' => 10, 'title_en' => 'Present Simple — Daily Habits', 'title_bn' => 'প্রতিদিনের অভ্যাস', 'subtitle_bn' => 'যা নিয়মিত ঘটে', 'explanation_bn' => 'যে কাজ প্রতিদিন বা নিয়মিত ঘটে, তা বোঝাতে Present Simple ব্যবহার হয়। He/She/It কর্তার সাথে verb-এর শেষে s যোগ হয়: He goes, She works।', 'examples' => [
                ['en' => 'I wake up at 6 am.', 'bn' => 'আমি সকাল ৬টায় ঘুম থেকে উঠি।'],
                ['en' => 'She works in a bank.', 'bn' => 'সে একটি ব্যাংকে কাজ করে।'],
                ['en' => 'The sun rises in the east.', 'bn' => 'সূর্য পূর্ব দিকে ওঠে।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ to school every day.', 'options' => ['go', 'goes', 'going'], 'answer' => 1, 'explanationBn' => 'He কর্তা, তাই goes।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'My mother ___ delicious food.', 'options' => ['cook', 'cooks', 'cooking'], 'answer' => 1, 'explanationBn' => 'My mother একবচন, তাই cooks।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'They ___ cricket on Fridays.', 'options' => ['play', 'plays', 'playing'], 'answer' => 0, 'explanationBn' => 'They বহুবচন, তাই play।'],
            ], 'estimated_minutes' => 6],

            ['level' => 'A2', 'unit_no' => 3, 'order_index' => 11, 'title_en' => 'Adverbs of Frequency', 'title_bn' => 'always/usually/sometimes', 'subtitle_bn' => 'কতবার ঘটে', 'explanation_bn' => 'কাজ কতবার হয় বোঝাতে always (সবসময়), usually (সাধারণত), sometimes (কখনো কখনো), never (কখনো না) ব্যবহার হয়। এরা verb-এর আগে বসে।', 'examples' => [
                ['en' => 'I always drink tea in the morning.', 'bn' => 'আমি সকালে সবসময় চা খাই।'],
                ['en' => 'She never comes late.', 'bn' => 'সে কখনো দেরিতে আসে না।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ eats fish. (সবসময়)', 'options' => ['never', 'always', 'sometimes'], 'answer' => 1, 'explanationBn' => 'সবসময় = always।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I ___ go to the gym on Sunday. (সাধারণত)', 'options' => ['usually', 'never', 'always'], 'answer' => 0, 'explanationBn' => 'সাধারণত = usually।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'She ___ eats meat. (কখনো না)', 'options' => ['always', 'sometimes', 'never'], 'answer' => 2, 'explanationBn' => 'কখনো না = never।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 3, 'order_index' => 12, 'title_en' => 'Telling the Time', 'title_bn' => 'সময় বলা', 'subtitle_bn' => 'o’clock, half past, quarter', 'explanation_bn' => 'সময় বোঝাতে o’clock, half past, quarter past এবং quarter to ব্যবহার হয়। "Half past seven" মানে ৭টা বেজে ৩০ মিনিট।', 'examples' => [
                ['en' => 'I wake up at 6 am.', 'bn' => 'আমি সকাল ৬টায় ঘুম থেকে উঠি।'],
                ['en' => 'The bus leaves at half past seven.', 'bn' => 'বাসটি সাড়ে ৭টায় ছাড়ে।'],
                ['en' => 'It is quarter to nine.', 'bn' => 'এখন ৯টা বাজতে ১৫ মিনিট বাকি।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'She goes to bed at ___ past ten.', 'options' => ['half', 'quarter', 'o’clock'], 'answer' => 0, 'explanationBn' => '"Half past ten" মানে সাড়ে ১০টা।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'It is ___ to twelve.', 'options' => ['quarter', 'half', 'o’clock'], 'answer' => 0, 'explanationBn' => '"Quarter to twelve" মানে ১২টা বাজতে ১৫ মিনিট বাকি।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'The meeting starts at nine ___.', 'options' => ['o’clock', 'half', 'quarter'], 'answer' => 0, 'explanationBn' => '"Nine o’clock" মানে ঠিক ৯টা।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 3, 'order_index' => 13, 'title_en' => 'Prepositions of Time', 'title_bn' => 'in/on/at এর ব্যবহার', 'subtitle_bn' => 'কখন ঘটে', 'explanation_bn' => 'সময় বোঝাতে at (নির্দিষ্ট সময়: at 7 pm), on (দিন/তারিখ: on Monday), in (মাস/বছর/কাল: in June, in 2024) ব্যবহার হয়।', 'examples' => [
                ['en' => 'I wake up at 6 am.', 'bn' => 'আমি সকাল ৬টায় উঠি।'],
                ['en' => 'We play on Fridays.', 'bn' => 'আমরা শুক্রবার খেলি।'],
                ['en' => 'My birthday is in May.', 'bn' => 'আমার জন্মদিন মে মাসে।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'The class starts ___ 9 am.', 'options' => ['at', 'on', 'in'], 'answer' => 0, 'explanationBn' => 'নির্দিষ্ট সময়ে at।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I visit my village ___ winter.', 'options' => ['at', 'on', 'in'], 'answer' => 2, 'explanationBn' => 'কাল বোঝাতে in।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'We have a holiday ___ Friday.', 'options' => ['at', 'on', 'in'], 'answer' => 1, 'explanationBn' => 'দিনের নামে on।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 3, 'order_index' => 14, 'title_en' => 'Review Check', 'title_bn' => 'পুনরালোচনা', 'subtitle_bn' => 'ইউনিট ৩-এর সবকিছু', 'explanation_bn' => 'Present Simple, frequency adverb আর সময়ের preposition — সব একসাথে যাচাই।', 'examples' => [
                ['en' => 'She usually goes to work at 8 am.', 'bn' => 'সে সাধারণত সকাল ৮টায় কাজে যায়।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ breakfast at 7 am every day.', 'options' => ['have', 'has', 'having'], 'answer' => 1, 'explanationBn' => 'He কর্তা, তাই has।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I ___ watch TV at night. (কখনো না)', 'options' => ['always', 'usually', 'never'], 'answer' => 2, 'explanationBn' => 'কখনো না = never।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'She visits her mother ___ Sunday.', 'options' => ['at', 'on', 'in'], 'answer' => 1, 'explanationBn' => 'দিনের নামে on।'],
            ], 'estimated_minutes' => 5],

            // ── A2 · Unit 4 — খাবার ও কেনাকাটা ──
            ['level' => 'A2', 'unit_no' => 4, 'order_index' => 15, 'title_en' => 'Some / Any', 'title_bn' => 'some/any', 'subtitle_bn' => 'কিছু/কোনো', 'explanation_bn' => 'সাধারণত affirmative বাক্যে some আর negative ও প্রশ্নে any ব্যবহার হয়: I have some tea. Do you have any milk?', 'examples' => [
                ['en' => 'I have some money.', 'bn' => 'আমার কিছু টাকা আছে।'],
                ['en' => 'Do you have any questions?', 'bn' => 'তোমার কোনো প্রশ্ন আছে?'],
                ['en' => 'There isn’t any sugar.', 'bn' => 'কোনো চিনি নেই।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I need ___ water.', 'options' => ['some', 'any', 'no'], 'answer' => 0, 'explanationBn' => 'Affirmative বাক্যে some।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Is there ___ rice?', 'options' => ['some', 'any', 'a'], 'answer' => 1, 'explanationBn' => 'প্রশ্নে any।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'There isn’t ___ milk in the fridge.', 'options' => ['some', 'any', 'many'], 'answer' => 1, 'explanationBn' => 'Negative বাক্যে any।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 4, 'order_index' => 16, 'title_en' => 'Countable & Uncountable', 'title_bn' => 'গণনাযোগ্য ও অগণনাযোগ্য', 'subtitle_bn' => 'many / much / a lot of', 'explanation_bn' => 'গণনাযোগ্য noun (books, eggs)-এর সাথে many; অগণনাযোগ্য (water, rice)-এর সাথে much; দুটোর সাথেই a lot of ব্যবহার হয়।', 'examples' => [
                ['en' => 'How many eggs do you need?', 'bn' => 'তোমার কয়টি ডিম লাগবে?'],
                ['en' => 'How much rice is there?', 'bn' => 'কত চাল আছে?'],
                ['en' => 'She drinks a lot of tea.', 'bn' => 'সে প্রচুর চা খায়।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'How ___ books do you have?', 'options' => ['much', 'many', 'a lot'], 'answer' => 1, 'explanationBn' => 'books গণনাযোগ্য — many।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'How ___ sugar do you want?', 'options' => ['much', 'many', 'a lot'], 'answer' => 0, 'explanationBn' => 'sugar অগণনাযোগ্য — much।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'We bought ___ vegetables.', 'options' => ['much', 'a lot of', 'little'], 'answer' => 1, 'explanationBn' => 'a lot of দুটোর সাথেই চলে।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 4, 'order_index' => 17, 'title_en' => 'Prices & Shopping', 'title_bn' => 'দাম ও কেনাকাটা', 'subtitle_bn' => 'কত দাম?', 'explanation_bn' => 'দাম জানতে How much is this? আর জিনিসের দাম বলতে It costs … টাকা। খাবারের পরিমাণ বোঝাতে a kilo of, a bottle of, a packet of ব্যবহার হয়।', 'examples' => [
                ['en' => 'How much is this shirt?', 'bn' => 'এই শার্টটির দাম কত?'],
                ['en' => 'It costs 500 taka.', 'bn' => 'এর দাম ৫০০ টাকা।'],
                ['en' => 'A kilo of potatoes, please.', 'bn' => 'এক কেজি আলু দিন।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ much is this bag?', 'options' => ['How', 'What', 'Who'], 'answer' => 0, 'explanationBn' => 'দাম জানতে How much।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I want a ___ of milk.', 'options' => ['kilo', 'bottle', 'packet'], 'answer' => 1, 'explanationBn' => 'দুধের জন্য bottle।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'These shoes ___ 800 taka.', 'options' => ['cost', 'costs', 'costing'], 'answer' => 0, 'explanationBn' => 'These বহুবচন — cost।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'A2', 'unit_no' => 4, 'order_index' => 18, 'title_en' => 'Review Check', 'title_bn' => 'পুনরালোচনা', 'subtitle_bn' => 'ইউনিট ৪-এর সবকিছু', 'explanation_bn' => 'some/any, many/much আর কেনাকাটার ভাষা — একসাথে চর্চা করি।', 'examples' => [
                ['en' => 'How much does this cost? I need some change.', 'bn' => 'এর দাম কত? আমার কিছু ভাংতি দরকার।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Do you have ___ oranges?', 'options' => ['some', 'any', 'much'], 'answer' => 1, 'explanationBn' => 'প্রশ্নে any।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'There is a lot of ___ in Dhaka.', 'options' => ['traffic', 'cars', 'books'], 'answer' => 0, 'explanationBn' => 'traffic অগণনাযোগ্য — a lot of সঠিক।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'How ___ time do we have?', 'options' => ['many', 'much', 'a lot'], 'answer' => 1, 'explanationBn' => 'time অগণনাযোগ্য — much।'],
            ], 'estimated_minutes' => 5],

            // ── B1 · Unit 5 — অতীত ও বর্তমান ──
            ['level' => 'B1', 'unit_no' => 5, 'order_index' => 19, 'title_en' => 'Past Simple', 'title_bn' => 'অতীত কাল', 'subtitle_bn' => 'যা হয়ে গেছে', 'explanation_bn' => 'অতীতে সম্পন্ন কাজ বোঝাতে Past Simple: regular verb-এ d/ed যোগ হয় (work → worked), আর irregular verb-এর আলাদা রূপ থাকে (go → went, eat → ate)।', 'examples' => [
                ['en' => 'I visited Cox’s Bazar last year.', 'bn' => 'গত বছর আমি কক্সবাজার ঘুরেছিলাম।'],
                ['en' => 'She went to the market yesterday.', 'bn' => 'সে গতকাল বাজারে গিয়েছিল।'],
                ['en' => 'We ate biryani on Friday.', 'bn' => 'শুক্রবার আমরা বিরিয়ানি খেয়েছিলাম।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ his homework last night.', 'options' => ['finish', 'finished', 'finishing'], 'answer' => 1, 'explanationBn' => 'Past Simple — finished।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'They ___ to Dhaka by train.', 'options' => ['go', 'goes', 'went'], 'answer' => 2, 'explanationBn' => 'go-এর past — went।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '___ you watch the match yesterday?', 'options' => ['Do', 'Did', 'Does'], 'answer' => 1, 'explanationBn' => 'অতীতের প্রশ্নে Did।'],
            ], 'estimated_minutes' => 6],

            ['level' => 'B1', 'unit_no' => 5, 'order_index' => 20, 'title_en' => 'Present Perfect', 'title_bn' => 'Present Perfect', 'subtitle_bn' => 'অতীতের সাথে বর্তমানের সম্পর্ক', 'explanation_bn' => 'অতীতে যা ঘটেছে কিন্তু বর্তমানেও প্রাসঙ্গিক, তা বোঝাতে have/has + past participle: I have finished the work. She has lived here since 2019।', 'examples' => [
                ['en' => 'I have finished my homework.', 'bn' => 'আমি হোমওয়ার্ক শেষ করেছি।'],
                ['en' => 'She has worked here since 2019.', 'bn' => 'সে ২০১৯ থেকে এখানে কাজ করছে।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'He ___ lived in Dhaka for five years.', 'options' => ['has', 'have', 'is'], 'answer' => 0, 'explanationBn' => 'He কর্তা — has।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I have ___ my keys!', 'options' => ['lost', 'lose', 'losing'], 'answer' => 0, 'explanationBn' => 'have + past participle (lost)।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'We have ___ this movie before.', 'options' => ['see', 'seen', 'saw'], 'answer' => 1, 'explanationBn' => 'see-এর past participle — seen।'],
            ], 'estimated_minutes' => 6],

            ['level' => 'B1', 'unit_no' => 5, 'order_index' => 21, 'title_en' => 'Will & Going to', 'title_bn' => 'ভবিষ্যৎ: will/going to', 'subtitle_bn' => 'পরিকল্পনা ও ভবিষ্যদ্বাণী', 'explanation_bn' => 'আগে থেকেই পরিকল্পনা থাকলে be going to (I am going to visit), আর কথা বলার সময় সিদ্ধান্ত নিলে will (I will call you) ব্যবহার হয়।', 'examples' => [
                ['en' => 'I am going to visit my grandmother next week.', 'bn' => 'আগামী সপ্তাহে আমি দাদিমাকে দেখতে যাব।'],
                ['en' => 'Don’t worry, I will help you.', 'bn' => 'চিন্তা করো না, আমি তোমাকে সাহায্য করব।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'Look at the clouds! It ___ rain.', 'options' => ['will', 'is going to', 'does'], 'answer' => 1, 'explanationBn' => 'দেখে বোঝা যাচ্ছে — is going to।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I forgot my phone. I ___ call you later.', 'options' => ['will', 'am going to', 'was'], 'answer' => 0, 'explanationBn' => 'মুহূর্তের সিদ্ধান্ত — will।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'We ___ move to a new flat next month.', 'options' => ['will', 'are going to', 'were'], 'answer' => 1, 'explanationBn' => 'আগে ঠিক করা পরিকল্পনা — are going to।'],
            ], 'estimated_minutes' => 5],

            ['level' => 'B1', 'unit_no' => 5, 'order_index' => 22, 'title_en' => 'Review Check', 'title_bn' => 'পুনরালোচনা', 'subtitle_bn' => 'ইউনিট ৫-এর সবকিছু', 'explanation_bn' => 'Past Simple, Present Perfect আর future — তিন কাল একসাথে।', 'examples' => [
                ['en' => 'I have studied English for two years, and I will continue.', 'bn' => 'আমি দুই বছর ইংরেজি পড়েছি, এবং চালিয়ে যাব।'],
            ], 'exercises' => [
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'She ___ to Chittagong last month.', 'options' => ['goes', 'went', 'gone'], 'answer' => 1, 'explanationBn' => 'last month — Past Simple (went)।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'I ___ never been to Sylhet.', 'options' => ['have', 'has', 'am'], 'answer' => 0, 'explanationBn' => 'I কর্তা — have।'],
                ['typeBn' => 'শূন্যস্থান পূরণ', 'q' => 'It is hot. I ___ open the window.', 'options' => ['will', 'am going to', 'did'], 'answer' => 0, 'explanationBn' => 'মুহূর্তের সিদ্ধান্ত — will।'],
            ], 'estimated_minutes' => 5],
        ];

        foreach ($lessons as $lesson) {
            Lesson::updateOrCreate(
                ['level' => $lesson['level'], 'unit_no' => $lesson['unit_no'], 'order_index' => $lesson['order_index']],
                $lesson
            );
        }
    }

    // ── Vocabulary ───────────────────────────────────────────────────

    private function seedVocabulary(): void
    {
        $decks = [
            ['slug' => 'daily-life', 'name' => 'দৈনন্দিন জীবন', 'icon_key' => 'home', 'tint_class' => 'bg-learn-primary-tint text-learn-primary', 'level' => 'A1', 'description' => 'রোজকার জীবনে লাগা শব্দ', 'sort_order' => 1],
            ['slug' => 'job-interview', 'name' => 'চাকরির ইন্টারভিউ', 'icon_key' => 'briefcase', 'tint_class' => 'bg-[#EEF1FF] text-[#6366F1]', 'level' => 'B1', 'description' => 'ইন্টারভিউতে কাজে লাগবে', 'sort_order' => 2],
            ['slug' => 'academic', 'name' => 'একাডেমিক শব্দ', 'icon_key' => 'graduation', 'tint_class' => 'bg-[#DDF3EC] text-[#0D9488]', 'level' => 'B1', 'description' => 'পড়াশোনা ও পরীক্ষার শব্দ', 'sort_order' => 3],
            ['slug' => 'travel', 'name' => 'ভ্রমণ ও বিমানবন্দর', 'icon_key' => 'plane', 'tint_class' => 'bg-learn-warn-tint text-learn-warn', 'level' => 'A2', 'description' => 'ভ্রমণের সময় দরকারি শব্দ', 'sort_order' => 4],
        ];

        foreach ($decks as $deck) {
            VocabDeck::updateOrCreate(['slug' => $deck['slug']], $deck);
        }

        $words = [
            // daily-life (A1)
            ['word' => 'reliable', 'ipa' => '/rɪˈlaɪəbl/', 'meaning_bn' => 'নির্ভরযোগ্য', 'example_en' => 'He is a reliable friend.', 'example_bn' => 'তিনি একজন নির্ভরযোগ্য বন্ধু।', 'level' => 'A2', 'deck' => 'daily-life'],
            ['word' => 'neighbor', 'ipa' => '/ˈneɪbə(r)/', 'meaning_bn' => 'প্রতিবেশী', 'example_en' => 'My neighbor is very kind.', 'example_bn' => 'আমার প্রতিবেশী খুব দয়ালু।', 'level' => 'A1', 'deck' => 'daily-life'],
            ['word' => 'groceries', 'ipa' => '/ˈɡrəʊsəriz/', 'meaning_bn' => 'বাজারসামগ্রী', 'example_en' => 'I bought groceries from the market.', 'example_bn' => 'আমি বাজার থেকে বাজারসামগ্রী কিনেছি।', 'level' => 'A2', 'deck' => 'daily-life'],
            ['word' => 'household', 'ipa' => '/ˈhaʊshəʊld/', 'meaning_bn' => 'গৃহস্থালি', 'example_en' => 'We share the household chores.', 'example_bn' => 'আমরা গৃহস্থালির কাজ ভাগ করে করি।', 'level' => 'B1', 'deck' => 'daily-life'],
            ['word' => 'routine', 'ipa' => '/ruːˈtiːn/', 'meaning_bn' => 'দৈনন্দিন রুটিন', 'example_en' => 'Exercise is part of my routine.', 'example_bn' => 'ব্যায়াম আমার রুটিনের অংশ।', 'level' => 'A2', 'deck' => 'daily-life'],
            ['word' => 'deadline', 'ipa' => '/ˈdedlaɪn/', 'meaning_bn' => 'শেষ সময়সীমা', 'example_en' => 'The deadline is Friday.', 'example_bn' => 'সময়সীমা শুক্রবার।', 'level' => 'B1', 'deck' => 'daily-life'],
            ['word' => 'sincere', 'ipa' => '/sɪnˈsɪə(r)/', 'meaning_bn' => 'আন্তরিক', 'example_en' => 'She gave a sincere apology.', 'example_bn' => 'তিনি আন্তরিকভাবে ক্ষমা চেয়েছেন।', 'level' => 'B1', 'deck' => 'daily-life'],
            ['word' => 'achieve', 'ipa' => '/əˈtʃiːv/', 'meaning_bn' => 'অর্জন করা', 'example_en' => 'Hard work helps you achieve goals.', 'example_bn' => 'কঠোর পরিশ্রম লক্ষ্য অর্জনে সাহায্য করে।', 'level' => 'B1', 'deck' => 'daily-life'],
            ['word' => 'convenient', 'ipa' => '/kənˈviːniənt/', 'meaning_bn' => 'সুবিধাজনক', 'example_en' => 'This time is convenient for me.', 'example_bn' => 'এই সময়টি আমার জন্য সুবিধাজনক।', 'level' => 'B1', 'deck' => 'daily-life'],
            ['word' => 'improve', 'ipa' => '/ɪmˈpruːv/', 'meaning_bn' => 'উন্নতি করা', 'example_en' => 'I want to improve my English.', 'example_bn' => 'আমি ইংরেজিতে উন্নতি করতে চাই।', 'level' => 'A2', 'deck' => 'daily-life'],

            // job-interview (B1)
            ['word' => 'qualification', 'ipa' => '/ˌkwɒlɪfɪˈkeɪʃn/', 'meaning_bn' => 'যোগ্যতা', 'example_en' => 'What qualifications do you have?', 'example_bn' => 'আপনার কী কী যোগ্যতা আছে?', 'level' => 'B1', 'deck' => 'job-interview'],
            ['word' => 'experience', 'ipa' => '/ɪkˈspɪəriəns/', 'meaning_bn' => 'অভিজ্ঞতা', 'example_en' => 'I have three years of experience.', 'example_bn' => 'আমার তিন বছরের অভিজ্ঞতা আছে।', 'level' => 'A2', 'deck' => 'job-interview'],
            ['word' => 'strength', 'ipa' => '/streŋθ/', 'meaning_bn' => 'শক্তি/দক্ষতা', 'example_en' => 'My strength is problem solving.', 'example_bn' => 'আমার শক্তি সমস্যা সমাধান।', 'level' => 'B1', 'deck' => 'job-interview'],
            ['word' => 'responsibility', 'ipa' => '/rɪˌspɒnsəˈbɪləti/', 'meaning_bn' => 'দায়িত্ব', 'example_en' => 'I handle many responsibilities.', 'example_bn' => 'আমি অনেক দায়িত্ব সামলাই।', 'level' => 'B1', 'deck' => 'job-interview'],
            ['word' => 'salary', 'ipa' => '/ˈsæləri/', 'meaning_bn' => 'বেতন', 'example_en' => 'What salary do you expect?', 'example_bn' => 'আপনি কত বেতন আশা করেন?', 'level' => 'A2', 'deck' => 'job-interview'],
            ['word' => 'teamwork', 'ipa' => '/ˈtiːmwɜːk/', 'meaning_bn' => 'দলগত কাজ', 'example_en' => 'I enjoy teamwork.', 'example_bn' => 'আমি দলগত কাজ পছন্দ করি।', 'level' => 'B1', 'deck' => 'job-interview'],

            // academic (B1)
            ['word' => 'analysis', 'ipa' => '/əˈnæləsɪs/', 'meaning_bn' => 'বিশ্লেষণ', 'example_en' => 'The analysis shows a clear trend.', 'example_bn' => 'বিশ্লেষণে স্পষ্ট ধারা দেখা যায়।', 'level' => 'B1', 'deck' => 'academic'],
            ['word' => 'evidence', 'ipa' => '/ˈevɪdəns/', 'meaning_bn' => 'প্রমাণ', 'example_en' => 'There is strong evidence for this.', 'example_bn' => 'এটার পক্ষে শক্ত প্রমাণ আছে।', 'level' => 'B1', 'deck' => 'academic'],
            ['word' => 'theory', 'ipa' => '/ˈθɪəri/', 'meaning_bn' => 'তত্ত্ব', 'example_en' => 'We studied the theory in class.', 'example_bn' => 'আমরা ক্লাসে তত্ত্বটি পড়েছি।', 'level' => 'B1', 'deck' => 'academic'],
            ['word' => 'method', 'ipa' => '/ˈmeθəd/', 'meaning_bn' => 'পদ্ধতি', 'example_en' => 'This method works well.', 'example_bn' => 'এই পদ্ধতিটি ভালো কাজ করে।', 'level' => 'A2', 'deck' => 'academic'],
            ['word' => 'conclusion', 'ipa' => '/kənˈkluːʒn/', 'meaning_bn' => 'সিদ্ধান্ত', 'example_en' => 'The conclusion is very clear.', 'example_bn' => 'সিদ্ধান্তটি খুব স্পষ্ট।', 'level' => 'B1', 'deck' => 'academic'],
            ['word' => 'significant', 'ipa' => '/sɪɡˈnɪfɪkənt/', 'meaning_bn' => 'গুরুত্বপূর্ণ', 'example_en' => 'There was a significant change.', 'example_bn' => 'একটি গুরুত্বপূর্ণ পরিবর্তন হয়েছিল।', 'level' => 'B1', 'deck' => 'academic'],

            // travel (A2)
            ['word' => 'boarding pass', 'ipa' => '/ˈbɔːdɪŋ pɑːs/', 'meaning_bn' => 'বোর্ডিং পাস', 'example_en' => 'Please show your boarding pass.', 'example_bn' => 'অনুগ্রহ করে আপনার বোর্ডিং পাস দেখান।', 'level' => 'A2', 'deck' => 'travel'],
            ['word' => 'luggage', 'ipa' => '/ˈlʌɡɪdʒ/', 'meaning_bn' => 'মালপত্র', 'example_en' => 'My luggage is heavy.', 'example_bn' => 'আমার মালপত্র ভারী।', 'level' => 'A2', 'deck' => 'travel'],
            ['word' => 'departure', 'ipa' => '/dɪˈpɑːtʃə(r)/', 'meaning_bn' => 'প্রস্থান', 'example_en' => 'The departure gate is number 5.', 'example_bn' => 'প্রস্থান গেট নম্বর ৫।', 'level' => 'B1', 'deck' => 'travel'],
            ['word' => 'passenger', 'ipa' => '/ˈpæsɪndʒə(r)/', 'meaning_bn' => 'যাত্রী', 'example_en' => 'All passengers must board now.', 'example_bn' => 'সব যাত্রীকে এখনই বোর্ড করতে হবে।', 'level' => 'A2', 'deck' => 'travel'],
            ['word' => 'customs', 'ipa' => '/ˈkʌstəmz/', 'meaning_bn' => 'শুল্ক', 'example_en' => 'We passed through customs quickly.', 'example_bn' => 'আমরা দ্রুত শুল্ক পার হলাম।', 'level' => 'B1', 'deck' => 'travel'],
            ['word' => 'delay', 'ipa' => '/dɪˈleɪ/', 'meaning_bn' => 'বিলম্ব', 'example_en' => 'The flight was delayed by an hour.', 'example_bn' => 'ফ্লাইট এক ঘণ্টা বিলম্বিত হয়েছিল।', 'level' => 'A2', 'deck' => 'travel'],
        ];

        foreach ($words as $w) {
            $word = VocabularyWord::updateOrCreate(
                ['word' => $w['word']],
                collect($w)->except('deck')->toArray()
            );
            $deck = VocabDeck::where('slug', $w['deck'])->first();
            if ($deck) {
                $deck->words()->syncWithoutDetaching([$word->id]);
            }
        }
    }

    // ── Grammar ──────────────────────────────────────────────────────

    private function seedGrammar(): void
    {
        $rules = [
            ['slug' => 'present-simple', 'name_en' => 'Present Simple', 'summary_bn' => 'নিয়মিত ঘটে এমন কাজ', 'category' => 'Tense', 'level' => 'A1', 'explanation_bn' => [
                'যে কাজ প্রতিদিন বা নিয়মিত ঘটে, তা বোঝাতে Present Simple ব্যবহার হয়। অভ্যাস, সাধারণ সত্য এবং নির্ধারিত সময়সূচি — সবই এই টেন্সে প্রকাশ করা যায়।',
                'He / She / It কর্তার সাথে verb-এর শেষে s বা es যোগ হয়। নেতিবাচক ও প্রশ্নবাচক বাক্যে does ব্যবহার হয় এবং তখন verb-এর s উঠে যায়।',
            ], 'structure' => 'Subject + verb (+ s/es) + object', 'structure_note_bn' => 'He / She / It এর সাথে verb এ s যোগ হয়', 'correct' => [
                ['en' => 'I wake up at 6 am.', 'bn' => 'আমি সকাল ৬টায় ঘুম থেকে উঠি।'],
                ['en' => 'She works in a bank.', 'bn' => 'তিনি একটি ব্যাংকে কাজ করেন।'],
                ['en' => 'The sun rises in the east.', 'bn' => 'সূর্য পূর্ব দিকে ওঠে।'],
            ], 'mistakes' => [
                ['wrong' => 'He go to office.', 'right' => 'He goes to office.', 'reasonBn' => 'He কর্তার সাথে verb-এ s যোগ হয়।'],
                ['wrong' => 'She don’t like tea.', 'right' => 'She doesn’t like tea.', 'reasonBn' => 'He/She/It এর সাথে negative-এ does না হয়।'],
            ], 'sort_order' => 1],

            ['slug' => 'present-continuous', 'name_en' => 'Present Continuous', 'summary_bn' => 'এখন চলছে এমন কাজ', 'category' => 'Tense', 'level' => 'A1', 'explanation_bn' => [
                'এই মুহূর্তে যা চলছে তা বোঝাতে Present Continuous: am/is/are + verb-ing। যেমন — I am reading now. She is cooking।',
            ], 'structure' => 'Subject + am/is/are + verb-ing', 'structure_note_bn' => 'verb-এর সাথে ing যোগ হয়', 'correct' => [
                ['en' => 'I am reading a book now.', 'bn' => 'আমি এখন বই পড়ছি।'],
                ['en' => 'She is cooking dinner.', 'bn' => 'সে রাতের খাবার রান্না করছে।'],
            ], 'mistakes' => [
                ['wrong' => 'I am read a book.', 'right' => 'I am reading a book.', 'reasonBn' => 'am/is/are এর পরে verb-এ ing লাগে।'],
            ], 'sort_order' => 2],

            ['slug' => 'past-simple', 'name_en' => 'Past Simple', 'summary_bn' => 'অতীতে সম্পন্ন কাজ', 'category' => 'Tense', 'level' => 'A2', 'explanation_bn' => [
                'অতীতে একবার বা নির্দিষ্ট সময়ে সম্পন্ন কাজ বোঝাতে Past Simple। Regular verb-এ d/ed যোগ হয়, irregular verb-এর আলাদা রূপ থাকে।',
                'প্রশ্নবাচকে did, নেতিবাচকে didn’t + verb-এর base form ব্যবহার হয়।',
            ], 'structure' => 'Subject + verb (past form) + object', 'structure_note_bn' => 'go → went, eat → ate, work → worked', 'correct' => [
                ['en' => 'I visited Cox’s Bazar last year.', 'bn' => 'গত বছর আমি কক্সবাজার ঘুরেছিলাম।'],
                ['en' => 'She went to the market yesterday.', 'bn' => 'সে গতকাল বাজারে গিয়েছিল।'],
            ], 'mistakes' => [
                ['wrong' => 'I didn’t went home.', 'right' => 'I didn’t go home.', 'reasonBn' => 'didn’t এর পরে verb-এর base form বসে।'],
            ], 'sort_order' => 3],

            ['slug' => 'present-perfect', 'name_en' => 'Present Perfect', 'summary_bn' => 'অতীতের সাথে বর্তমানের সম্পর্ক', 'category' => 'Tense', 'level' => 'B1', 'explanation_bn' => [
                'অতীতে যা ঘটেছে কিন্তু বর্তমানেও প্রাসঙ্গিক বা প্রভাব আছে, তা বোঝাতে have/has + past participle।',
                'সাধারণত for (সময়কাল) এবং since (শুরুর সময়) এর সাথে ব্যবহার হয়।',
            ], 'structure' => 'Subject + have/has + past participle', 'structure_note_bn' => 'She has lived here since 2019', 'correct' => [
                ['en' => 'I have finished my homework.', 'bn' => 'আমি হোমওয়ার্ক শেষ করেছি।'],
                ['en' => 'She has worked here since 2019.', 'bn' => 'সে ২০১৯ থেকে এখানে কাজ করছে।'],
            ], 'mistakes' => [
                ['wrong' => 'I have went to Dhaka.', 'right' => 'I have gone to Dhaka.', 'reasonBn' => 'have-এর পরে past participle (gone) বসে, past form (went) নয়।'],
            ], 'sort_order' => 4],

            ['slug' => 'indefinite-article', 'name_en' => 'A / An', 'summary_bn' => 'অনির্দিষ্ট আর্টিকেল', 'category' => 'Article', 'level' => 'A1', 'explanation_bn' => [
                'সাধারণ বা প্রথমবার উল্লিখিত একবচন noun-এর আগে a বা an বসে।',
                'vowel sound (a, e, i, o, u)-এ শুরু হলে an, ব্যঞ্জনধ্বনি হলে a। বানান নয়, উচ্চারণ দেখতে হয় — an hour, a university।',
            ], 'structure' => 'a/an + singular countable noun', 'structure_note_bn' => 'an honest man (h উচ্চারিত হয় না)', 'correct' => [
                ['en' => 'He is an honest man.', 'bn' => 'তিনি একজন সৎ মানুষ।'],
                ['en' => 'I saw a cat on the roof.', 'bn' => 'আমি ছাদে একটি বিড়াল দেখেছি।'],
            ], 'mistakes' => [
                ['wrong' => 'He is a honest man.', 'right' => 'He is an honest man.', 'reasonBn' => 'honest-এ vowel sound, তাই an।'],
            ], 'sort_order' => 5],

            ['slug' => 'definite-article', 'name_en' => 'The', 'summary_bn' => 'নির্দিষ্ট আর্টিকেল', 'category' => 'Article', 'level' => 'A1', 'explanation_bn' => [
                'নির্দিষ্ট কোনো জিনিস, যা আগে উল্লেখ হয়েছে বা সবার জানা, তার আগে the বসে।',
                'নদী, সাগর, পর্বতমালা, দিক এবং সুপারলেটিভ-এর আগেও the ব্যবহৃত হয়।',
            ], 'structure' => 'the + noun', 'structure_note_bn' => 'The Padma, the sun, the best', 'correct' => [
                ['en' => 'The sun rises in the east.', 'bn' => 'সূর্য পূর্ব দিকে ওঠে।'],
                ['en' => 'She is the best student.', 'bn' => 'সে সেরা শিক্ষার্থী।'],
            ], 'mistakes' => [
                ['wrong' => 'She is best student.', 'right' => 'She is the best student.', 'reasonBn' => 'সুপারলিভেটিভের আগে the লাগে।'],
            ], 'sort_order' => 6],

            ['slug' => 'prepositions-of-time', 'name_en' => 'In / On / At (Time)', 'summary_bn' => 'সময় বোঝাতে', 'category' => 'Preposition', 'level' => 'A2', 'explanation_bn' => [
                'সময় বোঝাতে at (নির্দিষ্ট সময়), on (দিন/তারিখ), in (মাস/বছর/কাল) ব্যবহৃত হয়।',
            ], 'structure' => 'at + time · on + day · in + month/year', 'structure_note_bn' => 'at 7 pm · on Friday · in June', 'correct' => [
                ['en' => 'The class starts at 9 am.', 'bn' => 'ক্লাস শুরু সকাল ৯টায়।'],
                ['en' => 'We play on Fridays.', 'bn' => 'আমরা শুক্রবার খেলি।'],
                ['en' => 'My birthday is in May.', 'bn' => 'আমার জন্মদিন মে মাসে।'],
            ], 'mistakes' => [
                ['wrong' => 'I wake up in 6 am.', 'right' => 'I wake up at 6 am.', 'reasonBn' => 'নির্দিষ্ট সময়ের আগে at বসে।'],
            ], 'sort_order' => 7],

            ['slug' => 'prepositions-of-place', 'name_en' => 'Prepositions of Place', 'summary_bn' => 'স্থান বোঝাতে', 'category' => 'Preposition', 'level' => 'A2', 'explanation_bn' => [
                'স্থান বোঝাতে in (ভেতরে), on (উপরে/সংলগ্ন), at (নির্দিষ্ট বিন্দু) ব্যবহৃত হয়।',
            ], 'structure' => 'in/on/at + place', 'structure_note_bn' => 'in the room · on the table · at the station', 'correct' => [
                ['en' => 'The book is on the table.', 'bn' => 'বইটি টেবিলের উপর।'],
                ['en' => 'We met at the station.', 'bn' => 'আমরা স্টেশনে দেখা করেছি।'],
            ], 'mistakes' => [
                ['wrong' => 'We arrived to the station.', 'right' => 'We arrived at the station.', 'reasonBn' => 'ছোট/নির্দিষ্ট জায়গায় arrive-এর পরে at।'],
            ], 'sort_order' => 8],

            ['slug' => 'active-passive', 'name_en' => 'Active & Passive Voice', 'summary_bn' => 'কর্তৃবাচ্য ও কর্মবাচ্য', 'category' => 'Voice', 'level' => 'B1', 'explanation_bn' => [
                'Active বাক্যে কর্তা কাজ করে, Passive বাক্যে কাজের ফলের দিকে জোর থাকে।',
                'Passive-এর গঠন: be + past participle। যেমন — Rahim writes a letter → A letter is written by Rahim।',
            ], 'structure' => 'Active: Subject + verb + object · Passive: Object + be + past participle + by subject', 'structure_note_bn' => 'is/are/am + past participle (Present)', 'correct' => [
                ['en' => 'Rice is grown in Bangladesh.', 'bn' => 'বাংলাদেশে ধান উৎপাদিত হয়।'],
                ['en' => 'The letter was written by Rahim.', 'bn' => 'চিঠিটি রাহিম লিখেছিল।'],
            ], 'mistakes' => [
                ['wrong' => 'The letter was wrote by Rahim.', 'right' => 'The letter was written by Rahim.', 'reasonBn' => 'be-এর পরে past participle (written) বসে।'],
            ], 'sort_order' => 9],

            ['slug' => 'reported-speech', 'name_en' => 'Reported Speech', 'summary_bn' => 'উদ্ধৃত বক্তব্য', 'category' => 'Narration', 'level' => 'B1', 'explanation_bn' => [
                'কারো কথা নিজের ভাষায় বলতে Reported Speech: He said, "I am tired" → He said that he was tired।',
                'সাধারণত tense এক ধাপ পেছানো হয় এবং pronoun বদলায়।',
            ], 'structure' => 'Subject + said + that + reported clause', 'structure_note_bn' => 'said + that', 'correct' => [
                ['en' => 'She said that she was busy.', 'bn' => 'সে বলল সে ব্যস্ত ছিল।'],
            ], 'mistakes' => [
                ['wrong' => 'She said that she is busy.', 'right' => 'She said that she was busy.', 'reasonBn' => 'মূল বাক্যটি অতীত হলে reported clause-ও সাধারণত পেছায়।'],
            ], 'sort_order' => 10],

            ['slug' => 'sentence-types', 'name_en' => 'Sentence Types', 'summary_bn' => 'বাক্যের শ্রেণিবিভাগ', 'category' => 'Sentence', 'level' => 'A2', 'explanation_bn' => [
                'বাক্য ৪ প্রকার: Assertive (ঘোষণামূলক), Interrogative (প্রশ্নবোধক), Imperative (অনুজ্ঞাসূচক) এবং Exclamatory (আবেগসূচক)।',
            ], 'structure' => 'Assertive · Interrogative · Imperative · Exclamatory', 'structure_note_bn' => 'উদাহরণসহ মনে রাখুন', 'correct' => [
                ['en' => 'Close the door. (Imperative)', 'bn' => 'দরজাটি বন্ধ করো।'],
                ['en' => 'What a beautiful day! (Exclamatory)', 'bn' => 'কী সুন্দর দিন!'],
            ], 'mistakes' => [
                ['wrong' => 'What a beautiful day. (full stop)', 'right' => 'What a beautiful day!', 'reasonBn' => 'আবেগসূচক বাক্যে বিস্ময়চিহ্ন বসে।'],
            ], 'sort_order' => 11],

            ['slug' => 'subject-verb-agreement', 'name_en' => 'Subject-Verb Agreement', 'summary_bn' => 'কর্তা ও ক্রিয়ার সমতা', 'category' => 'Sentence', 'level' => 'A2', 'explanation_bn' => [
                'একবচন কর্তার সাথে একবচন verb (He goes), বহুবচন কর্তার সাথে বহুবচন verb (They go) বসে।',
                'one of the + plural noun এর পরে verb একবচন হয়: One of my friends lives in Dhaka।',
            ], 'structure' => 'Singular subject + singular verb · Plural subject + plural verb', 'structure_note_bn' => 'One of my friends lives…', 'correct' => [
                ['en' => 'One of my friends lives in Dhaka.', 'bn' => 'আমার এক বন্ধু ঢাকায় থাকে।'],
                ['en' => 'The students are in the class.', 'bn' => 'শিক্ষার্থীরা ক্লাসে আছে।'],
            ], 'mistakes' => [
                ['wrong' => 'One of my friend lives in Dhaka.', 'right' => 'One of my friends lives in Dhaka.', 'reasonBn' => 'one of এর পরে plural noun বসে।'],
            ], 'sort_order' => 12],
        ];

        foreach ($rules as $rule) {
            GrammarRule::updateOrCreate(['slug' => $rule['slug']], $rule);
        }
    }

    // ── Reading ──────────────────────────────────────────────────────

    private function seedReading(): void
    {
        $passages = [
            ['level' => 'A2', 'title_en' => 'Rahim’s Morning Routine', 'summary_bn' => 'সকালের রুটিনের বর্ণনা', 'words' => 120, 'minutes' => 2, 'sort_order' => 1, 'content' => 'Rahim wakes up at six every morning. He drinks tea and reads the newspaper. Then he takes a shower and eats breakfast. At seven thirty, he leaves home and walks to the bus stop. He goes to the office by bus. He works from nine to five. In the evening, he comes home and helps his mother. He watches television after dinner and goes to bed at ten.', 'glossary' => [
                'shower' => ['ipa' => '/ˈʃaʊə(r)/', 'bn' => 'গোসল', 'exampleEn' => 'He takes a shower after exercise.', 'exampleBn' => 'ব্যায়ামের পর সে গোসল করে।'],
                'newspaper' => ['ipa' => '/ˈnjuːzpeɪpə(r)/', 'bn' => 'খবরের কাগজ', 'exampleEn' => 'She reads the newspaper every day.', 'exampleBn' => 'সে প্রতিদিন খবরের কাগজ পড়ে।'],
                'evening' => ['ipa' => '/ˈiːvnɪŋ/', 'bn' => 'সন্ধ্যা', 'exampleEn' => 'We have dinner in the evening.', 'exampleBn' => 'আমরা সন্ধ্যায় রাতের খাবার খাই।'],
            ], 'questions' => [
                ['q' => 'What time does Rahim wake up?', 'options' => ['At five', 'At six', 'At seven', 'At eight'], 'answer' => 1],
                ['q' => 'What does he drink in the morning?', 'options' => ['Coffee', 'Milk', 'Tea', 'Juice'], 'answer' => 2],
                ['q' => 'How does he go to the office?', 'options' => ['By car', 'By bus', 'By train', 'By rickshaw'], 'answer' => 1],
                ['q' => 'What does he do in the evening?', 'options' => ['Goes to the gym', 'Helps his mother', 'Sleeps early', 'Watches TV all night'], 'answer' => 1],
            ]],
            ['level' => 'A2', 'title_en' => 'Shopping for Vegetables', 'summary_bn' => 'বাজারে কেনাকাটা', 'words' => 140, 'minutes' => 3, 'sort_order' => 2, 'content' => 'Mina went to the market on Sunday morning. She needed vegetables for the week. She bought two kilos of potatoes and one kilo of tomatoes. The seller told her the price, and she paid with a fifty taka note. Then she bought some fresh fish from the next stall. On the way home, she stopped to buy a bottle of cooking oil. She was happy because everything was fresh and cheap.', 'glossary' => [
                'stall' => ['ipa' => '/stɔːl/', 'bn' => 'দোকান/স্টল', 'exampleEn' => 'He has a vegetable stall in the market.', 'exampleBn' => 'বাজারে তার সবজির স্টল আছে।'],
                'fresh' => ['ipa' => '/freʃ/', 'bn' => 'তাজা', 'exampleEn' => 'The fish is very fresh.', 'exampleBn' => 'মাছটি খুব তাজা।'],
                'cheap' => ['ipa' => '/tʃiːp/', 'bn' => 'সস্তা', 'exampleEn' => 'This shirt is cheap and nice.', 'exampleBn' => 'শার্টটি সস্তা এবং সুন্দর।'],
            ], 'questions' => [
                ['q' => 'When did Mina go to the market?', 'options' => ['Saturday', 'Sunday', 'Friday', 'Monday'], 'answer' => 1],
                ['q' => 'How many kilos of potatoes did she buy?', 'options' => ['One', 'Three', 'Two', 'Five'], 'answer' => 2],
                ['q' => 'What did she buy from the next stall?', 'options' => ['Rice', 'Eggs', 'Fish', 'Sugar'], 'answer' => 2],
                ['q' => 'Why was she happy?', 'options' => ['The market was empty', 'Everything was fresh and cheap', 'She met a friend', 'She got a discount'], 'answer' => 1],
            ]],
            ['level' => 'B1', 'title_en' => 'The Dhaka Metro', 'summary_bn' => 'মেট্রোরেল নিয়ে একটি লেখা', 'words' => 220, 'minutes' => 4, 'sort_order' => 3, 'content' => 'The Dhaka Metro Rail is one of the most important transport projects in Bangladesh. It carries thousands of passengers every day between Uttara and Motijheel. The trains are fast, clean and comfortable. People who used to spend two hours in traffic can now reach their destination in about forty minutes. The metro has reduced traffic jams on the main roads, and many passengers say it has changed their daily life. However, the stations become very crowded during peak hours, so the authorities are planning to add more trains.', 'glossary' => [
                'transport' => ['ipa' => '/ˈtrænspɔːt/', 'bn' => 'পরিবহন', 'exampleEn' => 'Public transport is important for a city.', 'exampleBn' => 'শহরের জন্য গণপরিবহন গুরুত্বপূর্ণ।'],
                'destination' => ['ipa' => '/ˌdestɪˈneɪʃn/', 'bn' => 'গন্তব্য', 'exampleEn' => 'We reached our destination on time.', 'exampleBn' => 'আমরা সময়মতো গন্তব্যে পৌঁছেছি।'],
                'crowded' => ['ipa' => '/ˈkraʊdɪd/', 'bn' => 'জনাকীর্ণ', 'exampleEn' => 'The bus is crowded in the morning.', 'exampleBn' => 'সকালে বাসটি জনাকীর্ণ থাকে।'],
                'authorities' => ['ipa' => '/ɔːˈθɒrətiz/', 'bn' => 'কর্তৃপক্ষ', 'exampleEn' => 'The authorities are building new roads.', 'exampleBn' => 'কর্তৃপক্ষ নতুন রাস্তা তৈরি করছে।'],
            ], 'questions' => [
                ['q' => 'Where does the Dhaka Metro run between?', 'options' => ['Uttara and Motijheel', 'Mirpur and Gulshan', 'Dhaka and Chittagong', 'Airport and Farmgate'], 'answer' => 0],
                ['q' => 'How long does the journey take now?', 'options' => ['Two hours', 'About forty minutes', 'One hour', 'Ten minutes'], 'answer' => 1],
                ['q' => 'What problem does the text mention?', 'options' => ['The trains are slow', 'Stations are crowded at peak hours', 'Tickets are very expensive', 'The metro is dirty'], 'answer' => 1],
                ['q' => 'What are the authorities planning?', 'options' => ['To close the metro', 'To add more trains', 'To increase the fare', 'To build a bridge'], 'answer' => 1],
            ]],
            ['level' => 'A2', 'title_en' => 'A Letter from a Friend', 'summary_bn' => 'বন্ধুর চিঠি', 'words' => 100, 'minutes' => 2, 'sort_order' => 4, 'content' => 'Dear Karim, I hope you are well. I am writing to tell you about my new job. I work in a bookshop in Dhaka. I start at nine and finish at six. My colleagues are very friendly, and my boss is kind. The best part is that I can read books when the shop is quiet. I am saving money to visit you in Sylhet next month. Please write back soon. Your friend, Rafiq.', 'glossary' => [
                'colleagues' => ['ipa' => '/ˈkɒliːɡz/', 'bn' => 'সহকর্মী', 'exampleEn' => 'My colleagues are helpful.', 'exampleBn' => 'আমার সহকর্মীরা সহায়ক।'],
                'quiet' => ['ipa' => '/ˈkwaɪət/', 'bn' => 'নীরব/শান্ত', 'exampleEn' => 'The library is quiet in the morning.', 'exampleBn' => 'সকালে লাইব্রেরিটি শান্ত থাকে।'],
                'boss' => ['ipa' => '/bɒs/', 'bn' => 'মালিক/বস', 'exampleEn' => 'My boss is very supportive.', 'exampleBn' => 'আমার বস খুব সহায়ক।'],
            ], 'questions' => [
                ['q' => 'Where does Rafiq work?', 'options' => ['In a bank', 'In a bookshop', 'In a school', 'In a hospital'], 'answer' => 1],
                ['q' => 'When does he finish work?', 'options' => ['At five', 'At six', 'At seven', 'At eight'], 'answer' => 1],
                ['q' => 'What does he want to do next month?', 'options' => ['Visit Sylhet', 'Change his job', 'Buy a car', 'Start a shop'], 'answer' => 0],
            ]],
            ['level' => 'B1', 'title_en' => 'Why We Should Read Daily', 'summary_bn' => 'প্রতিদিন পড়ার গুরুত্ব', 'words' => 180, 'minutes' => 3, 'sort_order' => 5, 'content' => 'Reading every day is one of the best habits you can build. It improves your vocabulary, helps you understand grammar in context, and makes you a better writer. When you read, your brain learns new sentence patterns without you noticing. Experts say that even fifteen minutes of reading a day can make a big difference over a year. You do not need difficult books — start with stories or articles you enjoy. The important thing is to read a little every day, not a lot once a month.', 'glossary' => [
                'habit' => ['ipa' => '/ˈhæbɪt/', 'bn' => 'অভ্যাস', 'exampleEn' => 'Reading is a good habit.', 'exampleBn' => 'পড়া একটি ভালো অভ্যাস।'],
                'pattern' => ['ipa' => '/ˈpætn/', 'bn' => 'কাঠামো', 'exampleEn' => 'English has simple sentence patterns.', 'exampleBn' => 'ইংরেজিতে সহজ বাক্য কাঠামো আছে।'],
                'experts' => ['ipa' => '/ˈekspɜːts/', 'bn' => 'বিশেষজ্ঞরা', 'exampleEn' => 'Experts recommend daily practice.', 'exampleBn' => 'বিশেষজ্ঞরা দৈনিক অনুশীলনের পরামর্শ দেন।'],
            ], 'questions' => [
                ['q' => 'What is the text mainly about?', 'options' => ['The cost of books', 'Why daily reading matters', 'How to write stories', 'Famous English writers'], 'answer' => 1],
                ['q' => 'How much reading a day does the text suggest?', 'options' => ['One hour', 'Five minutes', 'Fifteen minutes', 'Thirty minutes'], 'answer' => 2],
                ['q' => 'What kind of books should you start with?', 'options' => ['Difficult textbooks', 'Books you enjoy', 'Only dictionaries', 'Very long novels'], 'answer' => 1],
            ]],
        ];

        foreach ($passages as $p) {
            ReadingPassage::updateOrCreate(
                ['title_en' => $p['title_en']],
                $p
            );
        }
    }

    // ── Quizzes ──────────────────────────────────────────────────────

    private function seedQuizzes(): void
    {
        $quizzes = [
            ['slug' => 'quick-mixed', 'kind' => 'quick', 'title_bn' => 'কুইক কুইজ', 'description_bn' => '১০টি প্রশ্ন · ৩ মিনিট · মিশ্র বিষয়', 'topic' => null, 'level' => 'A2', 'duration_minutes' => 3, 'sort_order' => 1, 'questions' => [
                ['topic' => 'Preposition', 'q' => 'He has been living in Dhaka ____ 2019.', 'options' => ['since', 'for', 'from', 'at'], 'answer' => 0, 'reasonBn' => 'কোনো সময়ের শুরু বোঝাতে since ব্যবহৃত হয়।'],
                ['topic' => 'Tense', 'q' => 'She ____ to school every day.', 'options' => ['go', 'goes', 'going', 'gone'], 'answer' => 1, 'reasonBn' => 'He/She/It এর সাথে Present Simple-এ verb এর শেষে s/es যোগ হয়।'],
                ['topic' => 'Article', 'q' => 'He is ____ honest man.', 'options' => ['a', 'an', 'the', 'no article'], 'answer' => 1, 'reasonBn' => 'honest শব্দের শুরুতে vowel sound, তাই an ব্যবহৃত হয়।'],
                ['topic' => 'Vocabulary', 'q' => 'Choose the closest meaning of "reliable".', 'options' => ['ঢিলেঢালা', 'নির্ভরযোগ্য', 'উদাসীন', 'কঠোর'], 'answer' => 1, 'reasonBn' => 'reliable মানে নির্ভরযোগ্য।'],
                ['topic' => 'Preposition', 'q' => 'We arrived ____ the station at noon.', 'options' => ['to', 'at', 'in', 'on'], 'answer' => 1, 'reasonBn' => 'ছোট জায়গা বা নির্দিষ্ট বিন্দু বোঝাতে at ব্যবহৃত হয়।'],
                ['topic' => 'Tense', 'q' => 'Look! It ____ now.', 'options' => ['rains', 'is raining', 'rained', 'will rain'], 'answer' => 1, 'reasonBn' => 'এখন ঘটছে — Present Continuous।'],
                ['topic' => 'Grammar', 'q' => 'One of my friends ____ in Chittagong.', 'options' => ['live', 'lives', 'living', 'are living'], 'answer' => 1, 'reasonBn' => 'one of my friends এর পরে একবচন verb।'],
                ['topic' => 'Vocabulary', 'q' => 'What does "deadline" mean?', 'options' => ['শেষ সময়সীমা', 'মৃত্যুবার্ষিকী', 'সাপ্তাহিক ছুটি', 'উপহার'], 'answer' => 0, 'reasonBn' => 'deadline মানে শেষ সময়সীমা।'],
                ['topic' => 'Article', 'q' => 'I saw ____ elephant at the zoo.', 'options' => ['a', 'an', 'the', 'no article'], 'answer' => 1, 'reasonBn' => 'elephant vowel sound-এ শুরু, তাই an।'],
                ['topic' => 'Sentence', 'q' => 'Choose the correct sentence.', 'options' => ['I am agree with you.', 'I agree with you.', 'I am agreeing with you always.', 'I agrees with you.'], 'answer' => 1, 'reasonBn' => 'agree নিজেই verb — এর আগে am বসে না।'],
            ]],
            ['slug' => 'topic-tense', 'kind' => 'topic', 'title_bn' => 'টপিক টেস্ট — Tense', 'description_bn' => '১০টি প্রশ্ন · নির্দিষ্ট বিষয়ে', 'topic' => 'Tense', 'level' => 'A2', 'duration_minutes' => 5, 'sort_order' => 2, 'questions' => [
                ['topic' => 'Tense', 'q' => 'She ____ tea every morning.', 'options' => ['drink', 'drinks', 'drinking', 'drank'], 'answer' => 1, 'reasonBn' => 'Present Simple — She কর্তায় s।'],
                ['topic' => 'Tense', 'q' => 'They ____ football yesterday.', 'options' => ['play', 'plays', 'played', 'playing'], 'answer' => 2, 'reasonBn' => 'yesterday — Past Simple।'],
                ['topic' => 'Tense', 'q' => 'I ____ my homework now.', 'options' => ['do', 'am doing', 'did', 'have do'], 'answer' => 1, 'reasonBn' => 'now — Present Continuous।'],
                ['topic' => 'Tense', 'q' => 'He has ____ in Dhaka for ten years.', 'options' => ['live', 'lived', 'lives', 'living'], 'answer' => 1, 'reasonBn' => 'has + past participle।'],
                ['topic' => 'Tense', 'q' => 'We ____ to Cox’s Bazar next month.', 'options' => ['go', 'are going to go', 'went', 'have gone'], 'answer' => 1, 'reasonBn' => 'ভবিষ্যৎ পরিকল্পনা — are going to।'],
                ['topic' => 'Tense', 'q' => '____ you finish the work yesterday?', 'options' => ['Do', 'Does', 'Did', 'Are'], 'answer' => 2, 'reasonBn' => 'অতীতের প্রশ্নে Did।'],
                ['topic' => 'Tense', 'q' => 'The sun ____ in the east.', 'options' => ['rise', 'rises', 'rose', 'is rising'], 'answer' => 1, 'reasonBn' => 'সাধারণ সত্য — Present Simple।'],
                ['topic' => 'Tense', 'q' => 'She didn’t ____ to the meeting.', 'options' => ['came', 'come', 'comes', 'coming'], 'answer' => 1, 'reasonBn' => 'didn’t এর পরে base form।'],
                ['topic' => 'Tense', 'q' => 'By this time next year, I ____ my course.', 'options' => ['finish', 'will have finished', 'finished', 'am finishing'], 'answer' => 1, 'reasonBn' => 'ভবিষ্যৎ সম্পন্ন — will have finished।'],
                ['topic' => 'Tense', 'q' => 'Listen! Someone ____ the door.', 'options' => ['knocks', 'is knocking', 'knocked', 'has knocked'], 'answer' => 1, 'reasonBn' => 'এই মুহূর্তে — Present Continuous।'],
            ]],
            ['slug' => 'level-a2', 'kind' => 'level', 'title_bn' => 'লেভেল টেস্ট', 'description_bn' => '১৫টি প্রশ্ন · সময় বাঁধা ১০ মিনিট', 'topic' => null, 'level' => 'A2', 'duration_minutes' => 10, 'sort_order' => 3, 'questions' => [
                ['topic' => 'Grammar', 'q' => 'He is good ____ mathematics.', 'options' => ['in', 'at', 'on', 'with'], 'answer' => 1, 'reasonBn' => 'good at — দক্ষতা বোঝাতে।'],
                ['topic' => 'Tense', 'q' => 'I have been learning English ____ 2023.', 'options' => ['for', 'since', 'from', 'by'], 'answer' => 1, 'reasonBn' => 'নির্দিষ্ট বছর — since।'],
                ['topic' => 'Article', 'q' => '____ Padma is the largest river in Bangladesh.', 'options' => ['A', 'An', 'The', 'No article'], 'answer' => 2, 'reasonBn' => 'নদীর নামের আগে the।'],
                ['topic' => 'Vocabulary', 'q' => 'Opposite of "polite" is ____.', 'options' => ['kind', 'rude', 'smart', 'shy'], 'answer' => 1, 'reasonBn' => 'polite-এর বিপরীত rude।'],
                ['topic' => 'Preposition', 'q' => 'She is afraid ____ spiders.', 'options' => ['from', 'of', 'about', 'at'], 'answer' => 1, 'reasonBn' => 'afraid of — fixed phrase।'],
                ['topic' => 'Tense', 'q' => 'If it rains, we ____ at home.', 'options' => ['stay', 'will stay', 'stayed', 'staying'], 'answer' => 1, 'reasonBn' => 'Conditional — main clause-এ will।'],
                ['topic' => 'Grammar', 'q' => 'This is the book ____ I told you about.', 'options' => ['who', 'which', 'whose', 'whom'], 'answer' => 1, 'reasonBn' => 'জিনিসের জন্য which।'],
                ['topic' => 'Vocabulary', 'q' => '"Achieve" means ____.', 'options' => ['হারানো', 'অর্জন করা', 'ভুল করা', 'অপেক্ষা করা'], 'answer' => 1, 'reasonBn' => 'achieve = অর্জন করা।'],
                ['topic' => 'Sentence', 'q' => 'Choose the correct sentence.', 'options' => ['I discussed about the matter.', 'I discussed the matter.', 'I am discussed the matter.', 'I was discuss the matter.'], 'answer' => 1, 'reasonBn' => 'discuss-এর পরে about বসে না।'],
                ['topic' => 'Grammar', 'q' => 'Neither of the answers ____ correct.', 'options' => ['are', 'is', 'were', 'be'], 'answer' => 1, 'reasonBn' => 'neither of + plural noun — verb একবচন।'],
                ['topic' => 'Tense', 'q' => 'She ____ her grandmother every weekend.', 'options' => ['visit', 'visits', 'visited', 'visiting'], 'answer' => 1, 'reasonBn' => 'every weekend — Present Simple।'],
                ['topic' => 'Preposition', 'q' => 'We are proud ____ our country.', 'options' => ['for', 'of', 'in', 'to'], 'answer' => 1, 'reasonBn' => 'proud of — fixed phrase।'],
                ['topic' => 'Grammar', 'q' => 'There is ____ water in the glass.', 'options' => ['a few', 'some', 'many', 'a'], 'answer' => 1, 'reasonBn' => 'water অগণনাযোগ্য — some।'],
                ['topic' => 'Vocabulary', 'q' => 'The train was ____ because of heavy fog.', 'options' => ['early', 'delayed', 'full', 'empty'], 'answer' => 1, 'reasonBn' => 'কুয়াশার কারণে বিলম্ব — delayed।'],
                ['topic' => 'Sentence', 'q' => 'Choose the correct sentence.', 'options' => ['I am agree with you.', 'I agreed with you yesterday.', 'I am agree to you.', 'I agreeing with you.'], 'answer' => 1, 'reasonBn' => 'অতীতে সম্মত হওয়া — I agreed।'],
            ]],
        ];

        foreach ($quizzes as $q) {
            Quiz::updateOrCreate(['slug' => $q['slug']], $q);
        }
    }

    // ── AI scenarios ─────────────────────────────────────────────────

    private function seedAiScenarios(): void
    {
        $scenarios = [
            ['slug' => 'job-interview', 'title_bn' => 'চাকরির ইন্টারভিউ', 'title_en' => 'Job interview', 'icon_key' => 'briefcase', 'level' => 'B1', 'sort_order' => 1, 'opening' => [
                ['role' => 'ai', 'text' => 'Welcome to your interview! Please, tell me about yourself.'],
            ], 'replies' => [
                'Great! What skills do you have?',
                'That sounds good! Could you tell me more about your last job experience?',
                'Why do you want to work for this company?',
                'Where do you see yourself in five years?',
                'Do you have any questions for us?',
            ]],
            ['slug' => 'shopping', 'title_bn' => 'দোকানে কেনাকাটা', 'title_en' => 'Shopping', 'icon_key' => 'shopping', 'level' => 'A2', 'sort_order' => 2, 'opening' => [
                ['role' => 'ai', 'text' => 'Hello! How can I help you today?'],
            ], 'replies' => [
                'Sure, that is available. What size do you need?',
                'The price is written on the tag. Anything else?',
                'Would you like to try it on?',
                'Is there anything else I can help you with?',
            ]],
            ['slug' => 'doctor', 'title_bn' => 'ডাক্তারের চেম্বার', 'title_en' => 'At the doctor', 'icon_key' => 'stethoscope', 'level' => 'A2', 'sort_order' => 3, 'opening' => [
                ['role' => 'ai', 'text' => 'Good morning. What seems to be the problem?'],
            ], 'replies' => [
                'I see. How long have you been feeling like this?',
                'Does it hurt when you do this?',
                'Let me check your temperature. Any allergies?',
                'I will prescribe some medicine. Take it twice a day.',
            ]],
            ['slug' => 'airport', 'title_bn' => 'বিমানবন্দর', 'title_en' => 'At the airport', 'icon_key' => 'plane', 'level' => 'A2', 'sort_order' => 4, 'opening' => [
                ['role' => 'ai', 'text' => 'Good morning. May I see your passport and boarding pass?'],
            ], 'replies' => [
                'Thank you. Do you have any luggage to check in?',
                'Your flight departs from gate number five. It starts boarding at ten.',
                'Please keep your passport with you until you board.',
                'Have a safe flight!',
            ]],
            ['slug' => 'small-talk', 'title_bn' => 'বন্ধুর সাথে আলাপ', 'title_en' => 'Small talk', 'icon_key' => 'chat', 'level' => 'A2', 'sort_order' => 5, 'opening' => [
                ['role' => 'ai', 'text' => 'Hi! How is your day going?'],
            ], 'replies' => [
                'That sounds fun! What did you do over the weekend?',
                'Really? Tell me more about it.',
                'Have you seen any good movies lately?',
                'Let’s meet for tea sometime!',
            ]],
            ['slug' => 'open-chat', 'title_bn' => 'মুক্ত আলাপ', 'title_en' => 'Open chat', 'icon_key' => 'message', 'level' => 'A2', 'sort_order' => 6, 'opening' => [
                ['role' => 'ai', 'text' => 'Hello! I am your English practice partner. What would you like to talk about today?'],
            ], 'replies' => [
                'Interesting! Could you say that in another way?',
                'Can you give me an example?',
                'How do you say that in English? Let’s practise together.',
                'Great! What else would you like to practise?',
            ]],
        ];

        foreach ($scenarios as $s) {
            AiScenario::updateOrCreate(['slug' => $s['slug']], $s);
        }
    }

    // ── Phrases ──────────────────────────────────────────────────────

    private function seedPhrases(): void
    {
        $groups = [
            'interview' => [
                ['group_label' => 'শুরুতে', 'phrases' => [
                    ['en' => 'Thank you for having me.', 'bn' => 'আমাকে ডাকার জন্য ধন্যবাদ।', 'note' => 'সাক্ষাৎকার শুরুর সময়'],
                    ['en' => 'Could you please tell me more about the role?', 'bn' => 'পদটি সম্পর্কে আরেকটু বলবেন কি?'],
                    ['en' => 'I have been working on this for three years.', 'bn' => 'আমি এ নিয়ে তিন বছর ধরে কাজ করছি।'],
                ]],
                ['group_label' => 'শেষে', 'phrases' => [
                    ['en' => 'It was nice talking to you.', 'bn' => 'আপনার সাথে কথা বলে ভালো লাগলো।'],
                    ['en' => 'When can I expect to hear from you?', 'bn' => 'কখন উত্তর পাবো বলে আশা করতে পারি?'],
                ]],
            ],
            'doctor' => [
                ['group_label' => 'লক্ষণ বলার সময়', 'phrases' => [
                    ['en' => 'I have been feeling a fever since yesterday.', 'bn' => 'গতকাল থেকে জ্বর অনুভব করছি।'],
                    ['en' => 'It hurts when I swallow.', 'bn' => 'গিলতে গেলে ব্যথা হয়।'],
                    ['en' => 'I am allergic to penicillin.', 'bn' => 'পেনিসিলিনে আমার অ্যালার্জি আছে।'],
                ]],
            ],
            'bank' => [
                ['group_label' => 'সাধারণ', 'phrases' => [
                    ['en' => 'I would like to open a savings account.', 'bn' => 'সঞ্চয় হিসাব খুলতে চাই।'],
                    ['en' => 'Could you check my balance, please?', 'bn' => 'আমার ব্যালেন্সটা একটু দেখবেন কি?'],
                ]],
            ],
            'airport' => [
                ['group_label' => 'চেক-ইন', 'phrases' => [
                    ['en' => 'Where is the boarding gate?', 'bn' => 'বোর্ডিং গেট কোথায়?'],
                    ['en' => 'I have a window seat preference.', 'bn' => 'জানালার পাশের আসন পছন্দ করি।'],
                    ['en' => 'How many bags can I check in?', 'bn' => 'কয়টি ব্যাগ চেক-ইন করতে পারবো?'],
                ]],
            ],
            'classroom' => [
                ['group_label' => 'শ্রেণিকক্ষে', 'phrases' => [
                    ['en' => 'Could you explain that again, please?', 'bn' => 'আবার একটু বোঝাবেন কি?'],
                    ['en' => 'May I ask a question?', 'bn' => 'একটি প্রশ্ন করতে পারি?'],
                ]],
            ],
            'shop' => [
                ['group_label' => 'কেনাকাটা', 'phrases' => [
                    ['en' => 'How much does this cost?', 'bn' => 'এটার দাম কত?'],
                    ['en' => 'Do you have a smaller size?', 'bn' => 'ছোট সাইজ আছে কি?'],
                    ['en' => 'Can I pay with bKash?', 'bn' => 'বিকাশ দিয়ে দিতে পারি?'],
                ]],
            ],
            'phone' => [
                ['group_label' => 'ফোনে', 'phrases' => [
                    ['en' => 'Who is speaking, please?', 'bn' => 'আপনি কে বলবেন কি?'],
                    ['en' => 'Can I take a message?', 'bn' => 'কোনো বার্তা নিয়ে রাখব কি?'],
                ]],
            ],
        ];

        $sort = 0;
        foreach ($groups as $situation => $situationGroups) {
            foreach ($situationGroups as $group) {
                foreach ($group['phrases'] as $phrase) {
                    $sort++;
                    Phrase::updateOrCreate(
                        ['situation' => $situation, 'english' => $phrase['en']],
                        [
                            'group_label' => $group['group_label'],
                            'bengali' => $phrase['bn'],
                            'note' => $phrase['note'] ?? null,
                            'sort_order' => $sort,
                            'level' => $situation === 'interview' ? 'B1' : 'A2',
                        ]
                    );
                }
            }
        }
    }

    // ── Common mistakes ──────────────────────────────────────────────

    private function seedCommonMistakes(): void
    {
        $mistakes = [
            ['pattern' => 'i am (agree|disagree)', 'wrong' => 'I am agree', 'correct' => 'I agree', 'reason_bn' => "'agree' নিজেই একটি verb, তাই এর আগে 'am/is/are' বসে না।", 'examples' => [
                ['en' => 'I agree with your plan.', 'bn' => 'আমি তোমার পরিকল্পনার সাথে একমত।'],
            ], 'category' => 'Grammar', 'sort_order' => 1],
            ['pattern' => 'discussed about', 'wrong' => 'discussed about', 'correct' => 'discussed', 'reason_bn' => "discuss-এর পরে about বসে না; discuss নিজেই 'কথা বলা' বোঝায়।", 'examples' => [
                ['en' => 'We discussed the project.', 'bn' => 'আমরা প্রজেক্ট নিয়ে আলোচনা করেছি।'],
            ], 'category' => 'Preposition', 'sort_order' => 2],
            ['pattern' => 'one of my friend', 'wrong' => 'one of my friend', 'correct' => 'one of my friends', 'reason_bn' => "'one of' এর পরে plural noun বসে — one of my friends।", 'examples' => [
                ['en' => 'One of my friends lives in Dhaka.', 'bn' => 'আমার এক বন্ধু ঢাকায় থাকে।'],
            ], 'category' => 'Grammar', 'sort_order' => 3],
            ['pattern' => 'cope up with', 'wrong' => 'cope up with', 'correct' => 'cope with', 'reason_bn' => "cope-এর সাথে up বসে না; শুধু cope with বলা হয়।", 'examples' => [
                ['en' => 'She can cope with the pressure.', 'bn' => 'সে চাপ সামলাতে পারে।'],
            ], 'category' => 'Grammar', 'sort_order' => 4],
            ['pattern' => 'more better', 'wrong' => 'more better', 'correct' => 'better', 'reason_bn' => "better ইতিমধ্যেই comparative, তাই more যোগ করা যায় না।", 'examples' => [
                ['en' => 'This plan is better than the old one.', 'bn' => 'এই পরিকল্পনাটি আগেরটার চেয়ে ভালো।'],
            ], 'category' => 'Grammar', 'sort_order' => 5],
            ['pattern' => 'return back', 'wrong' => 'return back', 'correct' => 'return', 'reason_bn' => "return-এর অর্থেই 'ফিরে আসা' আছে, তাই back অপ্রয়োজনীয়।", 'examples' => [
                ['en' => 'Please return the book tomorrow.', 'bn' => 'আগামীকাল বইটি ফেরত দিন।'],
            ], 'category' => 'Grammar', 'sort_order' => 6],
            ['pattern' => 'give a miss call', 'wrong' => 'give a miss call', 'correct' => 'missed call', 'reason_bn' => "ভুল ফোন দেওয়া বোঝাতে missed call বলা হয়।", 'examples' => [
                ['en' => 'Give me a missed call.', 'bn' => 'আমাকে একটি মিসড কল দাও।'],
            ], 'category' => 'Vocabulary', 'sort_order' => 7],
            ['pattern' => 'he don’t|he dont', 'wrong' => 'He don’t', 'correct' => 'He doesn’t', 'reason_bn' => "He/She/It কর্তার সাথে negative-এ doesn't বসে।", 'examples' => [
                ['en' => 'He doesn’t like tea.', 'bn' => 'সে চা পছন্দ করে না।'],
            ], 'category' => 'Tense', 'sort_order' => 8],
        ];

        foreach ($mistakes as $m) {
            CommonMistake::updateOrCreate(['pattern' => $m['pattern']], $m);
        }
    }

    // ── Writing prompts ──────────────────────────────────────────────

    private function seedWritingPrompts(): void
    {
        $prompts = [
            ['title_en' => 'Write an email requesting a day off', 'title_bn' => 'অফিসে ছুটির জন্য ইমেইল', 'level' => 'A2', 'word_range' => '১০০–১৫০ শব্দ', 'category' => 'ইমেইল', 'sort_order' => 1, 'structure' => [
                ['label' => 'শুরু', 'desc' => 'সৌজন্যমূলক শুরুর বাক্য লিখুন।', 'phrases' => ['Dear Sir,', 'I hope this message finds you well.']],
                ['label' => 'মূল অংশ', 'desc' => 'কোন দিন ও কেন ছুটি চাইছেন তা জানান।', 'phrases' => ['I would like to request…', 'Because of…']],
                ['label' => 'শেষ', 'desc' => 'ধন্যবাদ জানিয়ে ইমেইল শেষ করুন।', 'phrases' => ['Thank you for your consideration.', 'Sincerely,']],
            ]],
            ['title_en' => 'Write an application for a bank account', 'title_bn' => 'ব্যাংক অ্যাকাউন্ট খোলার দরখাস্ত', 'level' => 'A2', 'word_range' => '৮০–১২০ শব্দ', 'category' => 'দরখাস্ত', 'sort_order' => 2, 'structure' => [
                ['label' => 'শুরু', 'desc' => 'ব্যাংক ম্যানেজারের ঠিকানা ও বিষয় লিখুন।', 'phrases' => ['The Manager,', 'Subject: Opening a savings account']],
                ['label' => 'মূল অংশ', 'desc' => 'অ্যাকাউন্ট খোলার ইচ্ছা ও প্রয়োজনীয় কাগজের কথা জানান।', 'phrases' => ['I would like to open…', 'I am attaching…']],
                ['label' => 'শেষ', 'desc' => 'ধন্যবাদ দিয়ে দরখাস্ত সমাপ্তি করুন।', 'phrases' => ['Thank you.', 'Yours faithfully,']],
            ]],
            ['title_en' => 'Describe your daily routine in a paragraph', 'title_bn' => 'দৈনন্দিন রুটিন নিয়ে প্যারাগ্রাফ', 'level' => 'B1', 'word_range' => '১২০–১৮০ শব্দ', 'category' => 'প্যারাগ্রাফ', 'sort_order' => 3, 'structure' => [
                ['label' => 'শুরু', 'desc' => 'রুটিনের সারসংক্ষেপ দিয়ে শুরু করুন।', 'phrases' => ['My daily routine is quite simple.', 'I wake up at…']],
                ['label' => 'মূল অংশ', 'desc' => 'সকাল থেকে রাত পর্যন্ত ধাপে ধাপে বর্ণনা করুন।', 'phrases' => ['In the morning, I…', 'After that…', 'In the evening…']],
                ['label' => 'শেষ', 'desc' => 'রুটিনের গুরুত্ব বা আপনার অনুভূতি দিয়ে শেষ করুন।', 'phrases' => ['This routine helps me stay productive.', 'I like my daily life.']],
            ]],
            ['title_en' => 'Write a short story beginning with a rainy day', 'title_bn' => 'বৃষ্টির দিন দিয়ে শুরু করা গল্প', 'level' => 'B1', 'word_range' => '১৫০–২০০ শব্দ', 'category' => 'গল্প', 'sort_order' => 4, 'structure' => [
                ['label' => 'শুরু', 'desc' => 'আবহাওয়া ও পরিবেশ বর্ণনা করে শুরু করুন।', 'phrases' => ['It was a rainy day…', 'The streets were full of water.']],
                ['label' => 'মূল অংশ', 'desc' => 'ঘটনার বিবরণ ধাপে ধাপে লিখুন।', 'phrases' => ['Suddenly…', 'I saw…', 'Then…']],
                ['label' => 'শেষ', 'desc' => 'গল্পের মোড় বা শিক্ষা দিয়ে শেষ করুন।', 'phrases' => ['In the end…', 'I will never forget that day.']],
            ]],
        ];

        foreach ($prompts as $p) {
            WritingPrompt::updateOrCreate(['title_en' => $p['title_en']], $p);
        }
    }

    // ── Audio practice ───────────────────────────────────────────────

    private function seedAudioPractice(): void
    {
        $pronunciation = [
            ['mode' => 'word', 'target' => 'reliable', 'phonetic' => '/rɪˈlaɪəbl/', 'words' => null, 'level' => 'A2', 'sort_order' => 1],
            ['mode' => 'word', 'target' => 'comfortable', 'phonetic' => '/ˈkʌmftəbl/', 'words' => null, 'level' => 'B1', 'sort_order' => 2],
            ['mode' => 'sentence', 'target' => 'She sells sea shells by the shore.', 'phonetic' => '/ʃiː selz siː ʃelz baɪ ðə ʃɔːr/', 'words' => [
                ['w' => 'She', 'ok' => true], ['w' => 'sells', 'ok' => true], ['w' => 'sea', 'ok' => true],
                ['w' => 'shells', 'ok' => false], ['w' => 'by', 'ok' => true], ['w' => 'the', 'ok' => true], ['w' => 'shore.', 'ok' => true],
            ], 'level' => 'B1', 'sort_order' => 3],
            ['mode' => 'sentence', 'target' => 'I would like a cup of tea, please.', 'phonetic' => '/aɪ wʊd laɪk ə kʌp əv tiː pliːz/', 'words' => [
                ['w' => 'I', 'ok' => true], ['w' => 'would', 'ok' => false], ['w' => 'like', 'ok' => true],
                ['w' => 'a', 'ok' => true], ['w' => 'cup', 'ok' => true], ['w' => 'of', 'ok' => false], ['w' => 'tea,', 'ok' => true], ['w' => 'please.', 'ok' => true],
            ], 'level' => 'A2', 'sort_order' => 4],
            ['mode' => 'pairs', 'target' => 'ship / sheep', 'phonetic' => '/ʃɪp/ /ʃiːp/', 'words' => null, 'level' => 'A2', 'sort_order' => 5],
            ['mode' => 'pairs', 'target' => 'walk / work', 'phonetic' => '/wɔːk/ /wɜːk/', 'words' => null, 'level' => 'A2', 'sort_order' => 6],
        ];

        foreach ($pronunciation as $p) {
            PronunciationItem::updateOrCreate(
                ['mode' => $p['mode'], 'target' => $p['target']],
                $p
            );
        }

        $listening = [
            ['kind' => 'dictation', 'title' => 'সহজ বাক্য', 'text' => 'The bus leaves at seven.', 'questions' => null, 'level' => 'A2', 'sort_order' => 1],
            ['kind' => 'dictation', 'title' => 'দৈনন্দিন বাক্য', 'text' => 'She drinks tea every morning.', 'questions' => null, 'level' => 'A2', 'sort_order' => 2],
            ['kind' => 'dictation', 'title' => 'অফিসের বাক্য', 'text' => 'The meeting starts at nine o’clock.', 'questions' => null, 'level' => 'B1', 'sort_order' => 3],
            ['kind' => 'comprehension', 'title' => 'রাহিমের সকাল', 'text' => 'Rahim wakes up at six every morning. He drinks tea and reads the newspaper. Then he goes to the office by bus.', 'questions' => [
                ['q' => 'What time does Rahim wake up?', 'options' => ['At seven', 'At six', 'At five', 'At eight'], 'answer' => 1],
                ['q' => 'What does he drink in the morning?', 'options' => ['Coffee', 'Milk', 'Tea', 'Juice'], 'answer' => 2],
                ['q' => 'How does he go to the office?', 'options' => ['By car', 'By train', 'By bus', 'By rickshaw'], 'answer' => 2],
            ], 'level' => 'A2', 'sort_order' => 4],
        ];

        foreach ($listening as $l) {
            ListeningItem::updateOrCreate(
                ['kind' => $l['kind'], 'text' => $l['text']],
                $l
            );
        }
    }
}
