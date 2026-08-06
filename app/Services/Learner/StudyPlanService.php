<?php

namespace App\Services\Learner;

use App\Models\Learner\Lesson;
use App\Models\Learner\StudyPlanDay;
use App\Models\Learner\VocabDeck;
use App\Models\Subscriber;

/**
 * StudyPlanService — builds and reads the AI 30-day study plan.
 *
 * Generation is AI-first: when FIT_AI_* credentials are configured the real
 * LLM (AiProvider) personalises the plan from the learner's level, goal,
 * daily minutes and the actual curriculum (lessons + vocab decks). When the
 * LLM is unavailable or its output is invalid, a deterministic template
 * generator produces the same 30-day structure. Either way the plan is
 * stored per subscriber and stays available offline afterwards.
 */
class StudyPlanService
{
    public const TOTAL_DAYS = 30;

    /**
     * Generate (or regenerate) a 30-day plan for a subscriber.
     *
     * Returns true when the plan was created with the real LLM, false when
     * the deterministic template was used.
     */
    public function generate(Subscriber $subscriber, ?AiProvider $provider = null): bool
    {
        if ($provider !== null && $provider->isConfigured()) {
            $aiDays = $provider->generateStudyPlan($this->contextFor($subscriber));
            if (is_array($aiDays)) {
                $normalized = $this->normalizePlan($aiDays);
                // Personalize the days the LLM produced correctly; fill any
                // missing day numbers from the deterministic template so a
                // single model hiccup never discards the whole AI plan.
                if (count($normalized) >= 5) {
                    $this->storePlan($subscriber, $this->fillMissingDays($normalized, $subscriber));

                    return true;
                }
            }
        }

        $this->storePlan($subscriber, $this->deterministicPlan($subscriber));

        return false;
    }

    /**
     * Merge the AI-produced days into a complete 1..30 plan, using the
     * deterministic template rows for any missing day numbers.
     *
     * @param  array<int, array{day_number:int, summary:string, tasks:array, completed:bool}>  $aiDays
     * @return array<int, array{day_number:int, summary:string, tasks:array, completed:bool}>
     */
    protected function fillMissingDays(array $aiDays, Subscriber $subscriber): array
    {
        $byDay = [];
        foreach ($aiDays as $day) {
            $byDay[$day['day_number']] = $day;
        }

        $fallback = collect($this->deterministicPlan($subscriber))->keyBy('day_number');

        $merged = [];
        for ($day = 1; $day <= self::TOTAL_DAYS; $day++) {
            $merged[] = $byDay[$day] ?? $fallback[$day];
        }

        return $merged;
    }

    /**
     * Learner profile + real curriculum handed to the LLM so the plan is
     * personal and only references content that actually exists.
     *
     * @return array{level:string, goal:string, dailyMinutes:int, lessons:array, vocabDecks:array}
     */
    protected function contextFor(Subscriber $subscriber): array
    {
        $level = $subscriber->level ?: 'A2';

        $lessons = Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->get(['unit_no', 'title_en'])
            ->map(fn ($l) => "Unit {$l->unit_no} · {$l->title_en}")
            ->values()
            ->all();

        $decks = VocabDeck::query()->get(['name'])->pluck('name')->filter()->values()->all();
        if ($decks === []) {
            $decks = ['দৈনন্দিন জীবন', 'চাকরির ইন্টারভিউ', 'একাডেমিক শব্দ', 'ভ্রমণ ও বিমানবন্দর'];
        }

        return [
            'level' => $level,
            'goal' => $subscriber->learning_goal ?: 'সাধারণ উন্নতি',
            'dailyMinutes' => (int) ($subscriber->daily_minutes ?: 15),
            'lessons' => $lessons,
            'vocabDecks' => $decks,
        ];
    }

    /**
     * Persist a plan after normalizing/validating it.
     * Returns false (→ caller falls back) unless the plan has exactly the
     * required number of unique, in-range day rows.
     */
    protected function storePlan(Subscriber $subscriber, array $plan): bool
    {
        $normalized = $this->normalizePlan($plan);
        if (count($normalized) !== self::TOTAL_DAYS) {
            return false;
        }

        StudyPlanDay::query()->where('subscriber_id', $subscriber->id)->delete();
        foreach ($normalized as $day) {
            StudyPlanDay::create(array_merge($day, ['subscriber_id' => $subscriber->id]));
        }

        $subscriber->forceFill(['study_plan_generated_at' => now()])->save();

        return true;
    }

    /**
     * Validate + shape raw day rows into StudyPlanDay-friendly records:
     * unique day 1-30, ≤3 tasks, done forced false, safe string lengths.
     *
     * @param  array<int, mixed>  $plan
     * @return array<int, array{day_number:int, summary:string, tasks:array, completed:bool}>
     */
    protected function normalizePlan(array $plan): array
    {
        $out = [];
        $seen = [];

        foreach ($plan as $row) {
            if (!is_array($row)) {
                continue;
            }

            $dayNumber = (int) ($row['day'] ?? $row['day_number'] ?? 0);
            if ($dayNumber < 1 || $dayNumber > self::TOTAL_DAYS || isset($seen[$dayNumber])) {
                continue;
            }
            $seen[$dayNumber] = true;

            $tasks = [];
            foreach ((array) ($row['tasks'] ?? []) as $task) {
                if (!is_array($task) || empty($task['title'])) {
                    continue;
                }
                $tasks[] = ['title' => mb_substr((string) $task['title'], 0, 80), 'done' => false];
                if (count($tasks) >= 3) {
                    break;
                }
            }
            if ($tasks === []) {
                $tasks[] = ['title' => 'রিভিউ ও পুনরালোচনা', 'done' => false];
            }

            $summary = (string) ($row['summary'] ?? ($tasks[0]['title'] ?? 'দৈনিক অনুশীলন'));

            $out[] = [
                'day_number' => $dayNumber,
                'summary' => mb_substr($summary, 0, 120) ?: 'দৈনিক অনুশীলন',
                'tasks' => $tasks,
                'completed' => false,
            ];
        }

        usort($out, fn ($a, $b) => $a['day_number'] <=> $b['day_number']);

        return $out;
    }

    /**
     * The deterministic template plan (used as the offline fallback and by
     * onboarding): rotates lessons, vocabulary, pronunciation, quizzes and
     * phrasebook across the month.
     *
     * @return array<int, array{day_number:int, summary:string, tasks:array, completed:bool}>
     */
    protected function deterministicPlan(Subscriber $subscriber): array
    {
        $level = $subscriber->level ?: 'A2';

        $lessons = Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->get(['id', 'unit_no', 'title_en']);

        $rotations = ['উচ্চারণ স্টুডিও ৫ মিনিট', 'লিসেনিং প্র্যাকটিস ১০ মিনিট', 'ফ্রেজবুক — পরিস্থিতি চর্চা', 'কুইজ ও টেস্ট'];

        $plan = [];

        $lessonCursor = 0;
        for ($day = 1; $day <= self::TOTAL_DAYS; $day++) {
            $summary = '';
            $tasks = [];

            // 1) One lesson every other day
            if ($day % 2 === 1) {
                $lesson = $lessons[$lessonCursor % max(1, $lessons->count())] ?? null;
                if ($lesson) {
                    $lessonCursor++;
                    $summary = "Unit {$lesson->unit_no} · {$lesson->title_en}";
                    $tasks[] = ['title' => "Unit {$lesson->unit_no} · {$lesson->title_en}", 'done' => false];
                }
            }

            // 2) Vocabulary — 10 new words every 3rd day
            if ($day % 3 === 0) {
                $tasks[] = ['title' => '১০টি নতুন শব্দ', 'done' => false];
            }

            // 3) Pronunciation pattern
            if ($day % 4 === 2) {
                $tasks[] = ['title' => '৫ মিনিট উচ্চারণ', 'done' => false];
            }

            // 4) Quiz every 5th day
            if ($day % 5 === 0) {
                $tasks[] = ['title' => 'কুইজ ও টেস্ট', 'done' => false];
            }

            // 5) Phrasebook / listening rotation
            $tasks[] = ['title' => $rotations[$day % 4], 'done' => false];

            // Fill empty days with a light task so nothing is blank
            if ($tasks === []) {
                $tasks[] = ['title' => 'রিভিউ ও পুনরালোচনা', 'done' => false];
            }

            $plan[] = [
                'day_number' => $day,
                'summary' => $summary ?: ($tasks[0]['title'] ?? 'দৈনিক অনুশীলন'),
                'tasks' => array_slice($tasks, 0, 3),
                'completed' => false,
            ];
        }

        return $plan;
    }

    /**
     * The plan day a subscriber is on today (day 1 = plan creation date).
     */
    public function today(Subscriber $subscriber): ?StudyPlanDay
    {
        if (!$subscriber->study_plan_generated_at) {
            return null;
        }

        $elapsed = (int) $subscriber->study_plan_generated_at->startOfDay()->diffInDays(now()->startOfDay());
        $dayNumber = min(self::TOTAL_DAYS, $elapsed + 1);

        return StudyPlanDay::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('day_number', $dayNumber)
            ->first();
    }

    /** Completed-percentage 0-100 for the plan progress bar. */
    public function progressPercent(Subscriber $subscriber): int
    {
        $total = StudyPlanDay::query()->where('subscriber_id', $subscriber->id)->count();
        if ($total === 0) {
            return 0;
        }

        $done = StudyPlanDay::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('completed', true)
            ->count();

        return (int) round(($done / $total) * 100);
    }

    /** Upcoming days (after today) for the plan view. */
    public function upcoming(Subscriber $subscriber, int $limit = 8): array
    {
        $today = $this->today($subscriber);

        return StudyPlanDay::query()
            ->where('subscriber_id', $subscriber->id)
            ->when($today, fn ($q) => $q->where('day_number', '>', $today->day_number))
            ->orderBy('day_number')
            ->limit($limit)
            ->get()
            ->map(fn ($d) => [
                'dayNum' => $d->day_number,
                'summary' => $d->summary,
                'done' => (bool) $d->completed,
            ])
            ->values()
            ->all();
    }
}
