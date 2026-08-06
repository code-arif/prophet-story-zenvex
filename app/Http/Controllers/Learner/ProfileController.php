<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\StudyPlanDay;
use App\Services\Learner\ProgressService;
use App\Services\Learner\StudyPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * ProfileController (learner) — screens 29, 30, 31.
 * (Main /profile stays with the existing ProfileController.)
 */
class ProfileController extends BaseController
{
    // ── Progress dashboard (29) ─────────────────────────────────────

    public function progress(Request $request, ProgressService $progress)
    {
        $subscriber = $this->subscriber($request);

        $ranges = ['week', 'month', 'all'];
        $labels = ['reading' => 'পড়া', 'listening' => 'শোনা', 'writing' => 'লেখা', 'speaking' => 'বলা'];

        $skills = [];
        foreach ($ranges as $range) {
            $pct = $progress->skillPercentages($subscriber, $range);
            $weakest = $progress->weakestSkill($subscriber, $range);
            $skills[$range] = collect(ProgressService::SKILLS)->map(function ($skill) use ($pct, $weakest, $labels) {
                $prev = $pct[$skill] - 4; // approximate delta for the badge
                return [
                    'label' => $labels[$skill],
                    'value' => $pct[$skill],
                    'delta' => max(-9, min(9, $prev)),
                    'tone' => $skill === $weakest ? 'bg-learn-warn' : 'bg-learn-primary',
                    'weakest' => $skill === $weakest,
                ];
            })->values()->all();
        }

        // Streak calendar (last 7 days).
        $studied = $progress->studiedDaysInLast7($subscriber)->map(fn ($d) => (string) $d);
        $days = ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'];
        $week = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $week[] = [
                'label' => $days[(now()->subDays($i)->dayOfWeekIso - 1 + 7) % 7],
                'done' => $studied->contains($date),
                'today' => $i === 0,
            ];
        }

        $weakestBn = $labels[$progress->weakestSkill($subscriber)] ?? 'বলা';
        $nextStepHref = match ($progress->weakestSkill($subscriber)) {
            'reading' => '/learn/reading',
            'listening' => '/practice/listening',
            'writing' => '/practice/writing',
            default => '/practice/pronunciation',
        };

        return Inertia::render('Learner/Profile/Progress', [
            'skills' => $skills,
            'streak' => (int) $subscriber->streak,
            'week' => $week,
            'weekly' => $progress->weekBar($subscriber),
            'weeklyMinutes' => $progress->weeklyMinutes($subscriber),
            'weakestBn' => $weakestBn,
            'nextStepHref' => $nextStepHref,
        ]);
    }

    // ── AI study plan (30) ──────────────────────────────────────────

    public function studyPlan(Request $request, StudyPlanService $plans)
    {
        $subscriber = $this->subscriber($request);
        $ready = $subscriber->study_plan_generated_at !== null;

        $today = $plans->today($subscriber);
        $doneItems = [];
        $todayTasks = [];
        if ($today) {
            foreach ($today->tasks ?: [] as $i => $task) {
                $todayTasks[] = ['title' => $task['title'] ?? '', 'done' => (bool) ($task['done'] ?? false)];
                if ($task['done'] ?? false) {
                    $doneItems[] = $i;
                }
            }
        }

        return Inertia::render('Learner/Profile/StudyPlan', [
            'planReady' => $ready,
            'level' => $subscriber->level,
            'goal' => $subscriber->learning_goal,
            'dailyMinutes' => $subscriber->daily_minutes,
            'todayDay' => $today?->day_number,
            'todayTasks' => $todayTasks,
            'doneItems' => $doneItems,
            'progressPercent' => $plans->progressPercent($subscriber),
            'upcoming' => $plans->upcoming($subscriber),
        ]);
    }

    /** POST — (re)generate the AI study plan. */
    public function generatePlan(Request $request, StudyPlanService $plans)
    {
        $validated = $request->validate([
            'level' => ['nullable', 'string', 'in:A1,A2,B1'],
            'goal' => ['nullable', 'string', 'max:40'],
            'dailyMinutes' => ['nullable', 'integer', 'min:5', 'max:240'],
        ]);

        $subscriber = $this->subscriber($request);
        $subscriber->forceFill([
            'level' => $validated['level'] ?? $subscriber->level,
            'learning_goal' => $validated['goal'] ?? $subscriber->learning_goal,
            'daily_minutes' => $validated['dailyMinutes'] ?? $subscriber->daily_minutes,
        ])->save();

        $plans->generate($subscriber);

        return Redirect::route('profile.study-plan')->with('status', 'AI স্টাডি প্ল্যান তৈরি হয়েছে।');
    }

    /** POST — toggle a task checkbox on today's plan day (JSON). */
    public function togglePlanTask(Request $request)
    {
        $validated = $request->validate([
            'day_number' => ['required', 'integer'],
            'task_index' => ['required', 'integer'],
        ]);

        $subscriber = $this->subscriber($request);
        $day = StudyPlanDay::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('day_number', $validated['day_number'])
            ->firstOrFail();

        $tasks = $day->tasks ?: [];
        $index = $validated['task_index'];
        if (isset($tasks[$index])) {
            $tasks[$index]['done'] = !($tasks[$index]['done'] ?? false);
        }

        $allDone = collect($tasks)->every(fn ($t) => $t['done'] ?? false);
        $day->forceFill([
            'tasks' => $tasks,
            'completed' => $allDone,
            'completed_at' => $allDone ? now() : null,
        ])->save();

        return response()->json(['ok' => true, 'tasks' => $tasks, 'completed' => $allDone]);
    }

    // ── Settings (31) ───────────────────────────────────────────────

    public function settings(Request $request)
    {
        $subscriber = $this->subscriber($request);
        $dayKeys = ['শ', 'র', 'সো', 'ম', 'বু', 'বৃ', 'শু'];

        return Inertia::render('Learner/Profile/Settings', [
            'settings' => [
                'reminderEnabled' => (bool) $subscriber->reminder_enabled,
                'reminderTime' => $subscriber->reminder_time ?: '21:00',
                'reminderDays' => $subscriber->reminder_days ?: $dayKeys,
                'appLanguage' => $subscriber->app_language ?: 'bn',
                'fontSize' => (int) $subscriber->font_size,
                'voice' => 'ডিভাইসের ডিফল্ট',
                'readingSpeed' => '১.০x',
            ],
        ]);
    }

    /** POST — save reminder + display settings. */
    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'reminderEnabled' => ['sometimes', 'boolean'],
            'reminderTime' => ['sometimes', 'string', 'max:5'],
            'reminderDays' => ['sometimes', 'array'],
            'reminderDays.*' => ['string', 'max:4'],
            'appLanguage' => ['sometimes', 'string', 'in:bn,en'],
            'fontSize' => ['sometimes', 'integer', 'in:0,1,2'],
        ]);

        $subscriber = $this->subscriber($request);
        $subscriber->forceFill([
            'reminder_enabled' => (bool) ($validated['reminderEnabled'] ?? $subscriber->reminder_enabled),
            'reminder_time' => $validated['reminderTime'] ?? $subscriber->reminder_time,
            'reminder_days' => $validated['reminderDays'] ?? $subscriber->reminder_days,
            'app_language' => $validated['appLanguage'] ?? $subscriber->app_language,
            'font_size' => $validated['fontSize'] ?? $subscriber->font_size,
        ])->save();

        return Redirect::route('profile.settings')->with('status', 'সেটিংস সংরক্ষিত হয়েছে।');
    }
}
