<?php

namespace App\Services\Learner;

use App\Models\Learner\Lesson;
use App\Models\Learner\StudyPlanDay;
use App\Models\Subscriber;

/**
 * StudyPlanService — builds and reads the AI 30-day study plan.
 * The plan is deterministic (no LLM required) and offline afterwards:
 * it rotates lessons, vocabulary, pronunciation, quizzes and phrasebook.
 */
class StudyPlanService
{
    public const TOTAL_DAYS = 30;

    /**
     * Generate (or regenerate) a 30-day plan for a subscriber.
     */
    public function generate(Subscriber $subscriber): void
    {
        $level = $subscriber->level ?: 'A2';
        $minutes = $subscriber->daily_minutes ?: 15;

        $lessons = Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->get(['id', 'unit_no', 'title_en']);

        $decks = ['দৈনন্দিন জীবন', 'চাকরির ইন্টারভিউ', 'একাডেমিক শব্দ', 'ভ্রমণ ও বিমানবন্দর'];
        $pronunciations = ['উচ্চারণ স্টুডিও ৫ মিনিট', 'লিসেনিং প্র্যাকটিস ১০ মিনিট', 'ফ্রেজবুক — পরিস্থিতি চর্চা', 'কুইজ ও টেস্ট'];

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

            // 3) Pronunciation on Tuesdays/Thursdays pattern
            if ($day % 4 === 2) {
                $tasks[] = ['title' => '৫ মিনিট উচ্চারণ', 'done' => false];
            }

            // 4) Quiz every 5th day
            if ($day % 5 === 0) {
                $tasks[] = ['title' => 'কুইজ ও টেস্ট', 'done' => false];
            }

            // 5) Phrasebook / listening rotation
            $tasks[] = ['title' => $pronunciations[$day % 4], 'done' => false];

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

        StudyPlanDay::query()->where('subscriber_id', $subscriber->id)->delete();
        foreach ($plan as $day) {
            StudyPlanDay::create(array_merge($day, ['subscriber_id' => $subscriber->id]));
        }

        $subscriber->forceFill(['study_plan_generated_at' => now()])->save();
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
