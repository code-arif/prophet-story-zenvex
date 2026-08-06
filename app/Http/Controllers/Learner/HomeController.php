<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\VocabularyWord;
use App\Models\Subscriber;
use App\Services\Learner\ProgressService;
use App\Services\Learner\StudyPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * HomeController (learner) — screen 07, the daily-loop dashboard.
 * New users (no level yet) are redirected to the onboarding flow.
 */
class HomeController extends BaseController
{
    public function __invoke(Request $request, ProgressService $progress, StudyPlanService $plans)
    {
        $subscriber = $this->subscriber($request);

        if (!$subscriber->is_onboarded) {
            return Redirect::route('welcome.profile');
        }

        $nextLesson = $progress->nextLesson($subscriber);

        // Progress inside the current unit (for the "today's lesson" bar).
        $unitDone = 0;
        $unitTotal = 0;
        $unitNo = 1;
        if ($nextLesson) {
            $unitNo = $nextLesson->unit_no;
            $units = $progress->lessonPath($subscriber, $nextLesson->level);
            foreach ($units as $unit) {
                if ((int) $unit['num'] === (int) $nextLesson->unit_no) {
                    $unitTotal = count($unit['lessons']);
                    $unitDone = count(array_filter($unit['lessons'], fn ($l) => $l['status'] === 'done'));
                    break;
                }
            }
        }

        $weekSkills = $this->weekSkills($subscriber, $progress);

        // Word of the day — deterministic by day-of-year.
        $dayOfYear = (int) now()->format('z');
        $word = VocabularyWord::query()
            ->orderBy('id')
            ->skip($dayOfYear % max(1, VocabularyWord::count()))
            ->first();
        $wordOfDay = $word ? ['word' => $word->word, 'bn' => $word->meaning_bn] : ['word' => 'practice', 'bn' => 'অনুশীলন'];

        $reminderOn = (bool) $subscriber->reminder_enabled;

        return Inertia::render('Learner/Home', [
            'learner' => [
                'name' => $subscriber->name ?: 'শিক্ষার্থী',
                'streak' => (int) $subscriber->streak,
                'level' => $subscriber->level,
            ],
            'profileIncomplete' => $subscriber->name === null || trim($subscriber->name) === '',
            'today' => $nextLesson ? [
                'day' => $unitDone + 1,
                'unit' => "Unit {$nextLesson->unit_no}: {$progress->unitTitle($nextLesson->level, $nextLesson->unit_no)['en']}",
                'titleEn' => $nextLesson->title_en,
                'progress' => $unitTotal > 0 ? (int) round(($unitDone / $unitTotal) * 100) : 0,
                'lessonId' => $nextLesson->id,
            ] : null,
            'wordOfDay' => $wordOfDay,
            'dueCards' => (int) $progress->dueCardsCount($subscriber),
            'weekSkills' => $weekSkills,
            'suggestions' => [
                ['href' => '/practice/pronunciation', 'label' => 'উচ্চারণ ২ মিনিট'],
                ['href' => '/practice/quiz', 'label' => 'একটি কুইজ'],
                ['href' => '/practice/phrasebook', 'label' => 'ফ্রেজবুক দেখুন'],
            ],
            'reminder' => [
                'enabled' => $reminderOn,
                // The UI composes the reminder sentence (i18n-aware) from
                // these two values instead of a pre-built string.
                'time' => $subscriber->reminder_time ?: '21:00',
            ],
        ]);
    }

    /** Skill percentages for the home weekly chart (bn labels are UI-side). */
    private function weekSkills(Subscriber $subscriber, ProgressService $progress): array
    {
        $labels = ['reading' => 'পড়া', 'listening' => 'শোনা', 'writing' => 'লেখা', 'speaking' => 'বলা'];
        $pct = $progress->skillPercentages($subscriber, 'week');

        return collect(ProgressService::SKILLS)->map(fn ($skill) => [
            'bn' => $labels[$skill],
            'pct' => $pct[$skill],
        ])->values()->all();
    }
}
