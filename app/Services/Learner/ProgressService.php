<?php

namespace App\Services\Learner;

use App\Models\Learner\Lesson;
use App\Models\Learner\ProgressLog;
use App\Models\Learner\SubscriberVocabulary;
use App\Models\Subscriber;
use Illuminate\Support\Collection;

/**
 * ProgressService — central hub for the learner's daily-loop numbers:
 * streak, weekly minutes, skill percentages, due flashcards, next lesson
 * and the lesson-path ladder.
 */
class ProgressService
{
    /** Skills shown on the home & progress screens (bn labels are UI-side). */
    public const SKILLS = ['reading', 'listening', 'writing', 'speaking'];

    /**
     * Record a finished activity and advance the streak.
     */
    public function markActivity(
        Subscriber $subscriber,
        string $skill,
        string $type,
        ?string $referenceType = null,
        ?int $referenceId = null,
        int $points = 1,
        int $minutes = 0
    ): void {
        ProgressLog::create([
            'subscriber_id' => $subscriber->id,
            'skill' => $skill,
            'type' => $type,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'points' => $points,
            'minutes' => $minutes,
            'created_at' => now(),
        ]);

        $this->refreshStreak($subscriber);
    }

    /**
     * Streak rule: activity yesterday extends the streak; activity today is
     * idempotent; a gap resets it to 1.
     */
    public function refreshStreak(Subscriber $subscriber): int
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        if ($subscriber->last_study_date === $today) {
            return $subscriber->streak ?? 0;
        }

        $streak = $subscriber->last_study_date === $yesterday ? ($subscriber->streak ?? 0) + 1 : 1;
        $subscriber->forceFill(['streak' => $streak, 'last_study_date' => $today])->save();

        return $streak;
    }

    /** Total minutes studied in the last 7 days. */
    public function weeklyMinutes(Subscriber $subscriber): int
    {
        return (int) ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->sum('minutes');
    }

    /** Per-day bar for the last 7 days: [{ day: 'শ', min }] (bn labels UI-side). */
    public function weekBar(Subscriber $subscriber): array
    {
        $rows = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as day, SUM(minutes) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $days = ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'];
        $bar = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $bar[] = [
                'day' => $days[(now()->subDays($i)->dayOfWeekIso - 1 + 7) % 7],
                'min' => (int) ($rows[$date] ?? 0),
                'active' => $i === 0,
            ];
        }

        return $bar;
    }

    /**
     * Skill percentages (0-100) over a range. Range: 'week' | 'month' | 'all'.
     * Keys are the four learner skills.
     */
    public function skillPercentages(Subscriber $subscriber, string $range = 'all'): array
    {
        $query = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->selectRaw('skill, COUNT(*) as total, SUM(points) as points')
            ->groupBy('skill');

        if ($range === 'week') {
            $query->where('created_at', '>=', now()->subDays(7)->startOfDay());
        } elseif ($range === 'month') {
            $query->where('created_at', '>=', now()->subDays(30)->startOfDay());
        }

        $bySkill = $query->pluck('points', 'skill')->map(fn ($v) => (int) $v);

        $max = max(1, (int) $bySkill->max());
        $result = [];
        foreach (self::SKILLS as $skill) {
            $points = (int) ($bySkill[$skill] ?? 0);
            $result[$skill] = (int) round(($points / $max) * 100);
        }

        return $result;
    }

    /** Weakest skill (tie-break: speaking → writing → listening → reading). */
    public function weakestSkill(Subscriber $subscriber, string $range = 'all'): string
    {
        $pct = $this->skillPercentages($subscriber, $range);
        $priority = ['speaking' => 0, 'writing' => 1, 'listening' => 2, 'reading' => 3];
        $weakest = 'speaking';
        $lowest = PHP_INT_MAX;
        foreach ($pct as $skill => $value) {
            if ($value < $lowest || ($value === $lowest && ($priority[$skill] ?? 99) < ($priority[$weakest] ?? 99))) {
                $weakest = $skill;
                $lowest = $value;
            }
        }

        return $weakest;
    }

    /** Number of flashcards due today (due_at <= today). */
    public function dueCardsCount(Subscriber $subscriber): int
    {
        return SubscriberVocabulary::query()
            ->where('subscriber_id', $subscriber->id)
            ->where(function ($q) {
                $q->whereNull('due_at')->orWhere('due_at', '<=', now()->toDateString());
            })
            ->count();
    }

    /**
     * The next lesson a learner should do at their level: the first published
     * lesson (in curriculum order) that has no completion log yet.
     */
    public function nextLesson(Subscriber $subscriber): ?Lesson
    {
        $level = $subscriber->level ?: 'A2';
        $doneIds = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('type', 'lesson')
            ->where('reference_type', 'Lesson')
            ->pluck('reference_id');

        return Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->when($doneIds->isNotEmpty(), fn ($q) => $q->whereNotIn('id', $doneIds))
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->first();
    }

    /**
     * Lesson-path ladder for one level: units with per-lesson status
     * (done / current / locked) exactly as the LessonPath screen expects.
     */
    public function lessonPath(Subscriber $subscriber, string $level): array
    {
        $lessons = Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->orderBy('unit_no')
            ->orderBy('order_index')
            ->get();

        $doneIds = ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('type', 'lesson')
            ->where('reference_type', 'Lesson')
            ->pluck('reference_id')
            ->all();

        $units = [];
        $previousDone = true;
        foreach ($lessons->groupBy('unit_no') as $unitNo => $unitLessons) {
            $unitDone = true;
            $lessonRows = [];
            foreach ($unitLessons as $lesson) {
                if (in_array($lesson->id, $doneIds, true)) {
                    $status = 'done';
                } elseif ($previousDone) {
                    $status = 'current';
                    $previousDone = false;
                } else {
                    $status = 'locked';
                }
                if ($status !== 'done') {
                    $unitDone = false;
                }
                $lessonRows[] = [
                    'id' => $lesson->id,
                    'titleEn' => $lesson->title_en,
                    'titleBn' => $lesson->title_bn,
                    'status' => $status,
                ];
            }

            $units[] = [
                'id' => "{$level}-U{$unitNo}",
                'num' => (int) $unitNo,
                'titleEn' => $unitLessons->first()->title_en ? $this->unitTitle($level, (int) $unitNo)['en'] : '',
                'titleBn' => $this->unitTitle($level, (int) $unitNo)['bn'],
                'status' => $unitDone ? 'done' : ($previousDone === false || $lessonRows[0]['status'] === 'current' ? 'current' : 'locked'),
                'lessons' => $lessonRows,
            ];
        }

        return $units;
    }

    /**
     * Curriculum unit names (en/bn) shared by lesson path + home card.
     */
    public function unitTitle(string $level, int $unitNo): array
    {
        $map = [
            'A1' => [1 => ['en' => 'Introducing Yourself', 'bn' => 'নিজের পরিচয়'], 2 => ['en' => 'Everyday Words', 'bn' => 'পরিচিত শব্দ']],
            'A2' => [3 => ['en' => 'Daily Routine', 'bn' => 'দৈনন্দিন রুটিন'], 4 => ['en' => 'Food & Shopping', 'bn' => 'খাবার ও কেনাকাটা']],
            'B1' => [5 => ['en' => 'Past & Present', 'bn' => 'অতীত ও বর্তমান']],
        ];

        return $map[$level][$unitNo] ?? ['en' => 'Unit '.$unitNo, 'bn' => 'ইউনিট '.$unitNo];
    }

    /** Whole-curriculum unit titles per level (for the study-plan generator). */
    public function unitTitlesForLevel(string $level): array
    {
        $units = Lesson::query()
            ->where('level', $level)
            ->where('is_published', true)
            ->orderBy('unit_no')
            ->get()
            ->groupBy('unit_no');

        $out = [];
        foreach ($units as $unitNo => $unitLessons) {
            $out[] = [
                'unit' => (int) $unitNo,
                'titleEn' => $this->unitTitle($level, (int) $unitNo)['en'],
                'lessons' => $unitLessons->map(fn ($l) => [
                    'id' => $l->id,
                    'titleEn' => $l->title_en,
                ])->values()->all(),
            ];
        }

        return $out;
    }

    /** Yesterday's studied minutes (for progress deltas). */
    public function studiedDaysInLast7(Subscriber $subscriber): Collection
    {
        return ProgressLog::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DISTINCT DATE(created_at) as day')
            ->pluck('day');
    }
}
