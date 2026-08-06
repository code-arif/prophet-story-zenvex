<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\GrammarRule;
use App\Models\Learner\Lesson;
use App\Models\Learner\ProgressLog;
use App\Models\Learner\ReadingPassage;
use App\Models\Learner\SubscriberVocabulary;
use App\Models\Learner\VocabDeck;
use App\Models\Learner\VocabularyWord;
use App\Services\Learner\ProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * LearnController — the "শিখুন" tab (screens 08-16).
 */
class LearnController extends BaseController
{
    // ── Hub (08) ────────────────────────────────────────────────────

    public function learn(Request $request, ProgressService $progress)
    {
        $subscriber = $this->subscriber($request);
        $next = $progress->nextLesson($subscriber);
        $unitNo = $next?->unit_no ?? 1;
        $unitTitle = $next ? $progress->unitTitle($next->level, $unitNo) : ['en' => '', 'bn' => ''];

        // Lessons progress summary for the hub tile.
        $units = $progress->lessonPath($subscriber, $subscriber->level ?: 'A2');
        $lessonDone = 0;
        $lessonTotal = 0;
        foreach ($units as $unit) {
            $lessonTotal += count($unit['lessons']);
            $lessonDone += count(array_filter($unit['lessons'], fn ($l) => $l['status'] === 'done'));
        }

        $rulesCount = (int) GrammarRule::query()->where('is_published', true)->count();
        $readingCount = (int) ReadingPassage::query()
            ->where('level', $subscriber->level ?: 'A2')
            ->where('is_published', true)
            ->count();

        return Inertia::render('Learner/Learn/Index', [
            'level' => $subscriber->level ?: 'A2',
            'lessonProgress' => $lessonTotal > 0 ? (int) round(($lessonDone / $lessonTotal) * 100) : 0,
            'lessonRemaining' => $lessonTotal - $lessonDone,
            'nextUnit' => $unitTitle,
            'dueCards' => (int) $progress->dueCardsCount($subscriber),
            'streak' => (int) $subscriber->streak,
            'rulesCount' => $rulesCount,
            'readingCount' => $readingCount,
        ]);
    }

    // ── Lesson path (09) ────────────────────────────────────────────

    public function lessonPath(Request $request, ProgressService $progress)
    {
        $subscriber = $this->subscriber($request);
        $level = $request->query('level', $subscriber->level ?: 'A2');

        return Inertia::render('Learner/Learn/LessonPath', [
            'level' => $level,
            'units' => $progress->lessonPath($subscriber, $level),
            'availableLevels' => ['A1', 'A2', 'B1'],
        ]);
    }

    // ── Lesson player (10) ──────────────────────────────────────────

    public function lessonPlayer(Request $request, $lesson)
    {
        $lesson = Lesson::query()->where('is_published', true)->findOrFail($lesson);

        return Inertia::render('Learner/Learn/LessonPlayer', [
            'lesson' => $this->lessonPayload($lesson),
            'completed' => $this->lessonCompleted($request, $lesson),
        ]);
    }

    /** POST — mark a lesson complete and log it. */
    public function completeLesson(Request $request, ProgressService $progress, $lesson)
    {
        $lesson = Lesson::query()->findOrFail($lesson);
        $subscriber = $this->subscriber($request);

        $score = (int) $request->input('score', 0);
        $total = (int) $request->input('total', count($lesson->exercises));
        $passed = $request->boolean('passed', $total > 0 && ($score / $total) >= 0.7);

        if ($passed && !$this->lessonCompleted($request, $lesson)) {
            $progress->markActivity(
                $subscriber,
                'grammar',
                'lesson',
                'Lesson',
                $lesson->id,
                points: $score,
                minutes: $lesson->estimated_minutes ?: 5
            );
        }

        $next = Lesson::query()
            ->where('level', $lesson->level)
            ->where('is_published', true)
            ->where(function ($q) use ($lesson) {
                $q->where('unit_no', '>', $lesson->unit_no)
                    ->orWhere(function ($q2) use ($lesson) {
                        $q2->where('unit_no', $lesson->unit_no)->where('order_index', '>', $lesson->order_index);
                    });
            })
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->first();

        return Redirect::route('learn.lessons.show', $next ?? $lesson);
    }

    // ── Vocabulary (13) ─────────────────────────────────────────────

    public function vocabulary(Request $request, ProgressService $progress)
    {
        $subscriber = $this->subscriber($request);
        $due = $progress->dueCardsCount($subscriber);

        $decks = VocabDeck::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($deck) use ($subscriber) {
                $wordIds = $deck->words()->pluck('vocabulary_words.id');
                $wordsCount = $wordIds->count();
                $learned = SubscriberVocabulary::query()
                    ->where('subscriber_id', $subscriber->id)
                    ->whereIn('word_id', $wordIds)
                    ->where('rating', '>=', 1)
                    ->count();

                return [
                    'id' => $deck->id,
                    'name' => $deck->name,
                    'iconKey' => $deck->icon_key,
                    'tintClass' => $deck->tint_class,
                    'words' => $wordsCount,
                    'progress' => $wordsCount > 0 ? (int) round(($learned / $wordsCount) * 100) : 0,
                    'footnote' => $learned === 0 ? 'শুরু করেননি' : null,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Learner/Learn/Vocabulary', [
            'due' => $due,
            'decks' => $decks,
        ]);
    }

    // ── Flashcard review (14) ───────────────────────────────────────

    public function flashcardReview(Request $request)
    {
        $subscriber = $this->subscriber($request);

        // Due cards = never seen or due today. Top up with new words if short.
        $dueIds = SubscriberVocabulary::query()
            ->where('subscriber_id', $subscriber->id)
            ->where(function ($q) {
                $q->whereNull('due_at')->orWhere('due_at', '<=', now()->toDateString());
            })
            ->pluck('word_id');

        $cards = collect();
        if ($dueIds->isNotEmpty()) {
            $cards = VocabularyWord::query()
                ->whereIn('id', $dueIds)
                ->orderBy('id')
                ->limit(20)
                ->get();
        }

        if ($cards->count() < 10) {
            $extra = VocabularyWord::query()
                ->whereNotIn('id', $cards->pluck('id'))
                ->whereIn('level', ['A1', 'A2'])
                ->orderBy('id')
                ->limit(20 - $cards->count())
                ->get();
            $cards = $cards->concat($extra);
        }

        $cards = $cards->map(fn ($w) => [
            'id' => $w->id,
            'en' => $w->word,
            'ipa' => $w->ipa,
            'bn' => $w->meaning_bn,
            'exampleEn' => $w->example_en,
            'exampleBn' => $w->example_bn,
        ])->values()->all();

        return Inertia::render('Learner/Learn/FlashcardReview', [
            'cards' => $cards,
        ]);
    }

    /** POST — record a flashcard self-rating (SRS scheduling). */
    public function rateCard(Request $request)
    {
        $validated = $request->validate([
            'word_id' => ['required', 'integer'],
            'rating' => ['required', 'integer', 'min:0', 'max:2'], // 0 জানি না · 1 কঠিন · 2 জানি
        ]);

        $subscriber = $this->subscriber($request);

        $row = SubscriberVocabulary::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('word_id', $validated['word_id'])
            ->first();

        $repetitions = $row?->repetitions ?? 0;
        $next = match ((int) $validated['rating']) {
            0 => now()->addDays(1)->toDateString(),   // জানি না → tomorrow
            1 => now()->addDays(3)->toDateString(),   // কঠিন → 3 days
            default => now()->addDays(7)->toDateString(), // জানি → 7 days
        };

        SubscriberVocabulary::updateOrCreate(
            ['subscriber_id' => $subscriber->id, 'word_id' => $validated['word_id']],
            [
                'rating' => (int) $validated['rating'],
                'repetitions' => $repetitions + 1,
                'due_at' => $next,
            ]
        );

        app(ProgressService::class)->markActivity(
            $subscriber,
            'vocabulary',
            'vocab',
            'VocabularyWord',
            (int) $validated['word_id'],
            points: (int) $validated['rating'] === 2 ? 1 : 0,
            minutes: 0
        );

        return response()->json(['ok' => true, 'nextDueAt' => $next]);
    }

    /** POST — save a word from the reading glossary / flashcard star. */
    public function saveWord(Request $request)
    {
        $validated = $request->validate([
            'word_id' => ['nullable', 'integer'],
            'word' => ['nullable', 'string', 'max:60'],
            'saved' => ['sometimes', 'boolean'],
        ]);

        $word = null;
        if (!empty($validated['word_id'])) {
            $word = VocabularyWord::query()->find($validated['word_id']);
        } elseif (!empty($validated['word'])) {
            $word = VocabularyWord::query()->where('word', $validated['word'])->first();
        }

        if (!$word) {
            return response()->json(['ok' => true, 'saved' => false, 'reason' => 'word-not-in-vocabulary']);
        }

        $subscriber = $this->subscriber($request);
        $saved = (bool) ($validated['saved'] ?? true);

        SubscriberVocabulary::updateOrCreate(
            ['subscriber_id' => $subscriber->id, 'word_id' => $word->id],
            ['saved' => $saved]
        );

        return response()->json(['ok' => true, 'saved' => $saved]);
    }

    // ── Grammar library (11) + rule detail (12) ─────────────────────

    public function grammar(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $rules = GrammarRule::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->slug,
                'nameEn' => $r->name_en,
                'summaryBn' => $r->summary_bn,
                'category' => $r->category,
            ])
            ->values()
            ->all();

        $seen = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('type', 'grammar')
            ->pluck('reference_type', 'reference_id')
            ->filter(fn ($v) => $v === 'GrammarRule')
            ->keys()
            ->map(fn ($id) => GrammarRule::find((int) $id)?->slug)
            ->filter()
            ->values();

        return Inertia::render('Learner/Learn/Grammar', [
            'rules' => $rules,
            'seen' => $seen,
        ]);
    }

    public function grammarRule(Request $request, $rule)
    {
        $subscriber = $this->subscriber($request);
        $rule = GrammarRule::query()->where('slug', $rule)->where('is_published', true)->firstOrFail();

        // Track "পড়া হয়েছে" marker.
        ProgressLog::firstOrCreate(
            [
                'subscriber_id' => $subscriber->id,
                'type' => 'grammar',
                'reference_type' => 'GrammarRule',
                'reference_id' => $rule->id,
                'created_at' => now(),
            ],
            ['skill' => 'grammar', 'points' => 1, 'minutes' => 3]
        );

        return Inertia::render('Learner/Learn/GrammarRule', [
            'rule' => [
                'id' => $rule->slug,
                'nameEn' => $rule->name_en,
                'category' => $rule->category,
                'explanationBn' => $rule->explanation_bn,
                'structure' => $rule->structure,
                'structureNoteBn' => $rule->structure_note_bn,
                'correct' => $rule->correct,
                'mistakes' => $rule->mistakes,
            ],
        ]);
    }

    // ── Reading list (15) + reader (16) ─────────────────────────────

    public function reading(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $completed = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('type', 'reading')
            ->where('reference_type', 'ReadingPassage')
            ->get()
            ->keyBy('reference_id');

        $passages = ReadingPassage::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($p) use ($completed) {
                $log = $completed->get($p->id);

                return [
                    'id' => $p->id,
                    'level' => $p->level,
                    'titleEn' => $p->title_en,
                    'summaryBn' => $p->summary_bn,
                    'words' => (int) $p->words,
                    'minutes' => (int) $p->minutes,
                    'completed' => (bool) $log,
                    'correct' => $log ? (int) $log->points : 0,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Learner/Learn/Reading', [
            'passages' => $passages,
            'myLevel' => $this->subscriber($request)->level ?: 'A2',
        ]);
    }

    public function readingReader(Request $request, $id)
    {
        $passage = ReadingPassage::query()->where('is_published', true)->findOrFail($id);

        return Inertia::render('Learner/Learn/ReadingReader', [
            'passage' => [
                'id' => $passage->id,
                'titleEn' => $passage->title_en,
                'words' => (int) $passage->words,
                'textEn' => $passage->content,
                'glossary' => $passage->glossary,
                'questions' => $passage->questions,
            ],
        ]);
    }

    /** POST — finish a reading passage (stores comprehension score). */
    public function completeReading(Request $request, $id)
    {
        $passage = ReadingPassage::query()->findOrFail($id);
        $subscriber = $this->subscriber($request);

        $score = (int) $request->input('score', 0);
        $total = (int) $request->input('total', count($passage->questions));

        ProgressLog::updateOrCreate(
            [
                'subscriber_id' => $subscriber->id,
                'type' => 'reading',
                'reference_type' => 'ReadingPassage',
                'reference_id' => $passage->id,
            ],
            [
                'skill' => 'reading',
                'points' => $score,
                'minutes' => (int) $passage->minutes,
                'created_at' => now(),
            ]
        );

        return response()->json(['ok' => true, 'score' => $score, 'total' => $total]);
    }

    // ── Helpers ─────────────────────────────────────────────────────

    private function lessonPayload(Lesson $lesson): array
    {
        return [
            'id' => $lesson->id,
            'titleEn' => $lesson->title_en,
            'subtitleBn' => $lesson->subtitle_bn,
            'explanationBn' => $lesson->explanation_bn,
            'examples' => $lesson->examples,
            'exercises' => $lesson->exercises,
        ];
    }

    private function lessonCompleted(Request $request, Lesson $lesson): bool
    {
        return ProgressLog::query()
            ->where('subscriber_id', $this->subscriber($request)->id)
            ->where('type', 'lesson')
            ->where('reference_type', 'Lesson')
            ->where('reference_id', $lesson->id)
            ->exists();
    }
}
