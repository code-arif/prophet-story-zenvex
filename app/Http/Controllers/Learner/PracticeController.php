<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\CommonMistake;
use App\Models\Learner\ListeningItem;
use App\Models\Learner\Phrase;
use App\Models\Learner\PronunciationItem;
use App\Models\Learner\Quiz;
use App\Models\Learner\QuizAttempt;
use App\Models\Learner\WritingDraft;
use App\Models\Learner\WritingPrompt;
use App\Services\Learner\AiCorrectionService;
use App\Services\Learner\ProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * PracticeController — the "অনুশীলন" tab (screens 20-27).
 */
class PracticeController extends BaseController
{
    /** Screen 20 — practice hub with weakest-skill advice. */
    public function practice(Request $request, ProgressService $progress)
    {
        $subscriber = $this->subscriber($request);
        $weakest = $progress->weakestSkill($subscriber);

        $advice = [
            'reading' => ['bn' => 'পড়া', 'text' => 'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট রিডিং প্র্যাকটিস করুন', 'href' => '/learn/reading'],
            'listening' => ['bn' => 'শোনা', 'text' => 'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট লিসেনিং অনুশীলন করুন', 'href' => '/practice/listening'],
            'writing' => ['bn' => 'লেখা', 'text' => 'আপনার সবচেয়ে দুর্বল দক্ষতা — একটি প্যারাগ্রাফ লিখে দেখুন', 'href' => '/practice/writing'],
            'speaking' => ['bn' => 'বলা', 'text' => 'আপনার সবচেয়ে দুর্বল দক্ষতা — ৫ মিনিট উচ্চারণ অনুশীলন করুন', 'href' => '/practice/pronunciation'],
        ][$weakest];

        return Inertia::render('Learner/Practice/Index', [
            'streak' => (int) $subscriber->streak,
            'advice' => $advice,
        ]);
    }

    /** Screen 21 — pronunciation studio. */
    public function pronunciation(Request $request)
    {
        $items = PronunciationItem::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('mode')
            ->map(fn ($group) => $group->map(fn ($i) => [
                'target' => $i->target,
                'phonetic' => $i->phonetic,
                'words' => $i->words,
            ])->values()->all())
            ->toArray();

        return Inertia::render('Learner/Practice/Pronunciation', [
            'modes' => [
                'word' => $items['word'] ?? [],
                'sentence' => $items['sentence'] ?? [],
                'pairs' => $items['pairs'] ?? [],
            ],
        ]);
    }

    /** Screen 22 — listening practice. */
    public function listening(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $dictation = ListeningItem::query()
            ->where('kind', 'dictation')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get(['text'])
            ->pluck('text')
            ->values()
            ->all();

        $comprehension = ListeningItem::query()
            ->where('kind', 'comprehension')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->first();

        return Inertia::render('Learner/Practice/Listening', [
            'streak' => $subscriber ? (int) $subscriber->streak : 0,
            'dictationSentences' => $dictation,
            'comprehension' => $comprehension ? [
                'text' => $comprehension->text,
                'questions' => $comprehension->questions,
            ] : null,
        ]);
    }

    // ── Writing desk (23) ───────────────────────────────────────────

    public function writingDesk(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $prompts = WritingPrompt::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title_en,
                'bn' => $p->title_bn,
                'level' => $p->level,
                'words' => $p->word_range,
                'category' => $p->category,
                'structure' => $p->structure,
            ])
            ->values()
            ->all();

        // Category chips are derived from the database, never hardcoded.
        $categories = collect($prompts)->pluck('category')->filter()->unique()->values()->all();

        $drafts = $subscriber->drafts()
            ->with('prompt')
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'prompt_id' => $d->prompt_id,
                'title' => $d->title ?: 'খসড়া',
                // Full body so resuming a draft restores the written text
                // (the list is capped at 5, so this stays small).
                'body' => $d->body,
                'preview' => mb_substr(strip_tags((string) $d->body), 0, 70),
                'words' => str_word_count((string) $d->body),
                'relative' => $d->updated_at->diffForHumans(),
                // Bring the prompt's writing structure along so the editor
                // can show the right scaffolding for a resumed draft.
                'structure' => $d->prompt?->structure,
                // The last AI review (if any) — shown when resuming a draft.
                'feedback' => $d->feedback,
            ])
            ->values()
            ->all();

        return Inertia::render('Learner/Practice/WritingDesk', [
            'prompts' => $prompts,
            'drafts' => $drafts,
            'categories' => $categories,
        ]);
    }

    /** POST — autosave a writing draft (JSON for the editor). */
    public function saveDraft(Request $request)
    {
        $validated = $request->validate([
            'prompt_id' => ['nullable', 'integer'],
            'title' => ['nullable', 'string', 'max:120'],
            'body' => ['nullable', 'string', 'max:50000'],
            'draft_id' => ['nullable', 'integer'],
        ]);

        $subscriber = $this->subscriber($request);

        if (!empty($validated['draft_id'])) {
            $draft = $subscriber->drafts()->findOrFail($validated['draft_id']);
            $draft->forceFill([
                'title' => $validated['title'] ?? $draft->title,
                'body' => $validated['body'] ?? $draft->body,
            ])->save();
        } else {
            $draft = $subscriber->drafts()->create([
                'prompt_id' => $validated['prompt_id'] ?? null,
                'title' => $validated['title'] ?? 'নতুন খসড়া',
                'body' => $validated['body'] ?? '',
            ]);
        }

        return response()->json(['ok' => true, 'draft_id' => $draft->id]);
    }

    // ── Quiz centre (24) + session (25) ─────────────────────────────

    public function quizCenter(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $quizzes = Quiz::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($q) {
                $count = count($q->questions);
                $desc = match ($q->kind) {
                    'quick' => "{$count}টি প্রশ্ন · {$q->duration_minutes} মিনিট · মিশ্র বিষয়",
                    'topic' => "{$count}টি প্রশ্ন · নির্দিষ্ট বিষয়ে",
                    default => "{$count}টি প্রশ্ন · সময় বাঁধা {$q->duration_minutes} মিনিট",
                };

                return [
                    'id' => $q->id,
                    'slug' => $q->slug,
                    'kind' => $q->kind,
                    'titleBn' => $q->title_bn,
                    'descriptionBn' => $desc,
                    'topic' => $q->topic,
                    'questionCount' => $count,
                    'href' => route('practice.quiz.session', $q->slug),
                ];
            })
            ->values()
            ->all();

        $recent = $subscriber->quizAttempts()
            ->with('quiz')
            ->orderByDesc('completed_at')
            ->limit(8)
            ->get()
            ->map(function ($a) {
                $pct = $a->total > 0 ? ($a->score / $a->total) * 100 : 0;
                return [
                    'name' => $a->quiz?->title_bn ?: 'কুইজ',
                    'date' => $a->completed_at ? $a->completed_at->diffForHumans() : '',
                    'score' => "{$a->score}/{$a->total}",
                    'pillClass' => $pct >= 70 ? 'bg-learn-success-tint text-learn-success' : ($pct >= 40 ? 'bg-learn-warn-tint text-learn-warn' : 'bg-learn-danger-tint text-learn-danger'),
                ];
            })
            ->values()
            ->all();

        $topics = Quiz::query()
            ->where('is_active', true)
            ->where('kind', 'topic')
            ->pluck('topic')
            ->filter()
            ->unique()
            ->values()
            ->all();

        return Inertia::render('Learner/Practice/QuizCenter', [
            'quizzes' => $quizzes,
            'recentResults' => $recent,
            'topics' => $topics,
        ]);
    }

    public function quizSession(Request $request, $quiz = 'quick-mixed')
    {
        $quiz = Quiz::query()
            ->where('slug', $quiz)
            ->orWhere('id', (int) $quiz ?: -1)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Learner/Practice/QuizSession', [
            'quiz' => [
                'id' => $quiz->id,
                'slug' => $quiz->slug,
                'titleBn' => $quiz->title_bn,
                'kind' => $quiz->kind,
                'topic' => $quiz->topic,
                'durationMinutes' => (int) $quiz->duration_minutes,
            ],
            'questions' => $quiz->questions,
        ]);
    }

    /** POST — persist a finished quiz attempt. */
    public function submitQuiz(Request $request, ProgressService $progress)
    {
        $validated = $request->validate([
            'quiz_id' => ['required', 'integer'],
            'answers' => ['required', 'array'],
        ]);

        $quiz = Quiz::query()->findOrFail($validated['quiz_id']);
        $subscriber = $this->subscriber($request);

        $answers = array_values($validated['answers']);
        $score = 0;
        foreach ($quiz->questions as $i => $q) {
            $given = isset($answers[$i]) ? (int) $answers[$i] : -1;
            if ($given === (int) ($q['answer'] ?? -1)) {
                $score++;
            }
        }

        $attempt = QuizAttempt::create([
            'subscriber_id' => $subscriber->id,
            'quiz_id' => $quiz->id,
            'score' => $score,
            'total' => count($quiz->questions),
            'answers' => $answers,
            'completed_at' => now(),
        ]);

        $progress->markActivity(
            $subscriber,
            'grammar',
            'quiz',
            'Quiz',
            $quiz->id,
            points: $score,
            minutes: (int) $quiz->duration_minutes
        );

        // A good score can unlock a stronger level (level test only).
        if ($quiz->kind === 'level' && $score / max(1, count($quiz->questions)) >= 0.8) {
            $newLevel = $subscriber->level === 'A1' ? 'A2' : ($subscriber->level === 'A2' ? 'B1' : $subscriber->level);
            $subscriber->forceFill(['level' => $newLevel])->save();
        }

        return response()->json([
            'ok' => true,
            'attempt_id' => $attempt->id,
            'score' => $score,
            'total' => count($quiz->questions),
        ]);
    }

    // ── Phrasebook (26) ─────────────────────────────────────────────

    public function phrasebook(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $savedIds = $subscriber->savedPhrases()->pluck('phrase_id');

        $groups = Phrase::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('situation')
            ->map(function ($situationGroup) {
                return $situationGroup
                    ->groupBy('group_label')
                    ->map(fn ($group) => [
                        'label' => $group->first()->group_label,
                        'phrases' => $group->map(fn ($p) => [
                            'id' => $p->id,
                            'en' => $p->english,
                            'bn' => $p->bengali,
                            'note' => $p->note,
                        ])->values()->all(),
                    ])
                    ->values()
                    ->all();
            })
            ->toArray();

        return Inertia::render('Learner/Practice/Phrasebook', [
            'situations' => $groups,
            'savedIds' => $savedIds,
        ]);
    }

    /** POST — toggle a phrase favourite (JSON). */
    public function togglePhrase(Request $request)
    {
        $validated = $request->validate(['phrase_id' => ['required', 'integer']]);
        $subscriber = $this->subscriber($request);

        $phrase = Phrase::query()->findOrFail($validated['phrase_id']);
        $exists = $subscriber->savedPhrases()->where('phrase_id', $phrase->id)->exists();

        if ($exists) {
            $subscriber->savedPhrases()->detach($phrase->id);
        } else {
            $subscriber->savedPhrases()->attach($phrase->id);
        }

        return response()->json(['ok' => true, 'saved' => !$exists]);
    }

    // ── Mistake doctor (27) ─────────────────────────────────────────

    public function mistakeDoctor(Request $request)
    {
        $common = CommonMistake::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($m) => ['wrong' => $m->wrong, 'correct' => $m->correct])
            ->values()
            ->all();

        return Inertia::render('Learner/Practice/MistakeDoctor', [
            'common' => $common,
        ]);
    }

    /** POST — check a sentence against the fixed patterns (JSON). */
    public function checkMistake(Request $request, AiCorrectionService $ai)
    {
        $validated = $request->validate(['text' => ['required', 'string', 'max:2000']]);

        $mistakes = $ai->findMistakes($validated['text']);
        if ($mistakes === []) {
            return response()->json([
                'ok' => true,
                'found' => false,
                'reasonBn' => 'আপনার লেখায় আমাদের তালিকার কোনো পরিচিত ভুল পাওয়া যায়নি। চাইলে AI সঙ্গীকে জিজ্ঞাসা করতে পারেন।',
            ]);
        }

        $m = $mistakes[0];

        return response()->json([
            'ok' => true,
            'found' => true,
            'wrong' => $m['wrong'],
            'correct' => $m['corrected'],
            'reasonBn' => $m['reasonBn'],
            'examples' => $m['examples'],
        ]);
    }
}
