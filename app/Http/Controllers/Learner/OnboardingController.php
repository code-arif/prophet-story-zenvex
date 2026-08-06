<?php

namespace App\Http\Controllers\Learner;

use App\Services\AppSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * OnboardingController — screens 01, 04, 05, 06.
 *
 * Flow (after login): new user → profile setup → placement test →
 * placement result → home. `/welcome` stays public (marketing landing).
 */
class OnboardingController extends BaseController
{
    /** Server-side placement content (15 questions, 5 per band). */
    public const PLACEMENT_QUESTIONS = [
        ['id' => 'p1', 'band' => 'A1', 'skill' => 'speaking', 'q' => 'She ___ to school every day.', 'options' => ['go', 'goes', 'going', 'gone'], 'answer' => 1],
        ['id' => 'p2', 'band' => 'A1', 'skill' => 'reading', 'q' => 'This is a ___ of water.', 'options' => ['cup', 'car', 'cat', 'day'], 'answer' => 0],
        ['id' => 'p3', 'band' => 'A1', 'skill' => 'reading', 'q' => 'I ___ rice every day.', 'options' => ['eat', 'eats', 'eating', 'eaten'], 'answer' => 0],
        ['id' => 'p4', 'band' => 'A1', 'skill' => 'listening', 'q' => 'They ___ football on Friday.', 'options' => ['play', 'plays', 'playing', 'played'], 'answer' => 0],
        ['id' => 'p5', 'band' => 'A1', 'skill' => 'speaking', 'q' => '"___ are you?" — "I am fine."', 'options' => ['What', 'Who', 'How', 'Where'], 'answer' => 2],
        ['id' => 'p6', 'band' => 'A2', 'skill' => 'writing', 'q' => 'He has been living in Dhaka ___ 2019.', 'options' => ['since', 'for', 'from', 'at'], 'answer' => 0],
        ['id' => 'p7', 'band' => 'A2', 'skill' => 'writing', 'q' => 'She is ___ in her new job.', 'options' => ['interesting', 'interested', 'interest', 'interests'], 'answer' => 1],
        ['id' => 'p8', 'band' => 'A2', 'skill' => 'reading', 'q' => 'The train leaves ___ 7 o’clock.', 'options' => ['on', 'at', 'in', 'to'], 'answer' => 1],
        ['id' => 'p9', 'band' => 'A2', 'skill' => 'listening', 'q' => 'We ___ to the market yesterday.', 'options' => ['go', 'went', 'gone', 'going'], 'answer' => 1],
        ['id' => 'p10', 'band' => 'A2', 'skill' => 'writing', 'q' => 'If it rains, we ___ at home.', 'options' => ['stay', 'stayed', 'staying', 'will stay'], 'answer' => 3],
        ['id' => 'p11', 'band' => 'B1', 'skill' => 'writing', 'q' => 'The report ___ by Monday.', 'options' => ['must finish', 'must be finished', 'must finished', 'finished must'], 'answer' => 1],
        ['id' => 'p12', 'band' => 'B1', 'skill' => 'reading', 'q' => 'She ___ to the success of the project.', 'options' => ['contributed', 'contribution', 'contributing', 'contributes'], 'answer' => 0],
        ['id' => 'p13', 'band' => 'B1', 'skill' => 'reading', 'q' => 'Despite the rain, the match ___ on.', 'options' => ['went', 'goes', 'was going', 'has gone'], 'answer' => 0],
        ['id' => 'p14', 'band' => 'B1', 'skill' => 'writing', 'q' => 'I look forward to ___ from you.', 'options' => ['hear', 'hearing', 'heard', 'hears'], 'answer' => 1],
        ['id' => 'p15', 'band' => 'B1', 'skill' => 'speaking', 'q' => 'By next year, I ___ my degree.', 'options' => ['will complete', 'will have completed', 'complete', 'completed'], 'answer' => 1],
    ];

    /** Public marketing landing (screen 01). Logged-in onboarded users go home. */
    public function welcome(Request $request, AppSettings $settings)
    {
        $subscriber = $this->subscriberIfPresent($request);
        if ($subscriber && $subscriber->is_onboarded) {
            return Redirect::route('learner.home');
        }

        return Inertia::render('Learner/Onboarding/Welcome', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
        ]);
    }

    /** Screen 04 — profile setup (name, goal, daily minutes). */
    public function profileSetup(Request $request)
    {
        $subscriber = $this->subscriber($request);

        return Inertia::render('Learner/Onboarding/ProfileSetup', [
            'onboarded' => $subscriber->is_onboarded,
            'existing' => [
                'name' => $subscriber->name,
                'goal' => $subscriber->learning_goal,
                'dailyMinutes' => $subscriber->daily_minutes,
            ],
        ]);
    }

    /** POST — save the profile-setup values, then continue the flow. */
    public function saveProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'goal' => ['nullable', 'string', 'max:40'],
            'dailyMinutes' => ['nullable', 'integer', 'min:5', 'max:240'],
            // The landing page's guest language choice, carried into the
            // subscriber's saved preference on their first profile save.
            'appLanguage' => ['sometimes', 'string', 'in:bn,en'],
        ]);

        $subscriber = $this->subscriber($request);
        $subscriber->forceFill([
            'name' => $validated['name'],
            'learning_goal' => $validated['goal'] ?? $subscriber->learning_goal,
            'daily_minutes' => $validated['dailyMinutes'] ?? $subscriber->daily_minutes,
            'app_language' => $validated['appLanguage'] ?? $subscriber->app_language,
            // Completing the profile clears any earlier skip (analytics).
            'profile_skipped_at' => null,
        ])->save();

        // First run: profile → placement test. Later edits: straight home.
        return $subscriber->is_onboarded
            ? Redirect::route('learner.home')->with('status', 'প্রোফাইল সংরক্ষিত হয়েছে।')
            : Redirect::route('welcome.placement');
    }

    /**
     * POST — skip profile setup.
     *
     * First run (not onboarded yet): skip the whole onboarding and go home
     * (no level yet — home offers the placement test as a later, optional
     * step). Already onboarded (editing from the app): treat skip as cancel
     * → home. The profile can be completed later from /welcome/profile.
     */
    public function skipProfile(Request $request)
    {
        $subscriber = $this->subscriber($request);

        // Already onboarded — this is a "cancel" from an edit, not a skip.
        if ($subscriber->is_onboarded) {
            return Redirect::route('learner.home');
        }

        // First run — pass the onboarding gate (no level) and record the
        // skip so analytics can distinguish it from a profile that was
        // never started. (Repeated skips overwrite with the latest time,
        // i.e. "last skipped at"; cleared when the profile is completed.)
        $subscriber->forceFill([
            'onboarded_at' => now(),
            'profile_skipped_at' => now(),
        ])->save();

        return Redirect::route('learner.home');
    }

    /** Screen 05 — placement test (questions from the server). */
    public function placement(Request $request)
    {
        return Inertia::render('Learner/Onboarding/Placement', [
            'questions' => array_map(fn ($q) => [
                'id' => $q['id'],
                'band' => $q['band'],
                'skill' => $q['skill'],
                'q' => $q['q'],
                'options' => $q['options'],
                'answer' => $q['answer'],
            ], self::PLACEMENT_QUESTIONS),
        ]);
    }

    /** POST — grade the answers (same thresholds as the client) and save the level. */
    public function submitPlacement(Request $request)
    {
        $validated = $request->validate([
            'answers' => ['required', 'array'],
        ]);

        $answers = array_values($validated['answers']);
        $questions = self::PLACEMENT_QUESTIONS;

        $bySkill = [];
        $score = 0;
        foreach ($questions as $i => $q) {
            $skill = $q['skill'];
            if (!isset($bySkill[$skill])) {
                $bySkill[$skill] = ['correct' => 0, 'total' => 0];
            }
            $bySkill[$skill]['total']++;
            $given = isset($answers[$i]) ? (int) $answers[$i] : -1;
            if ($given === (int) $q['answer']) {
                $bySkill[$skill]['correct']++;
                $score++;
            }
        }

        $total = count($questions);
        $level = $score <= 5 ? 'A1' : ($score <= 10 ? 'A2' : 'B1');

        $subscriber = $this->subscriber($request);
        $subscriber->forceFill([
            'level' => $level,
            'placement_score' => $score,
            'placement_total' => $total,
            'onboarded_at' => now(),
        ])->save();

        // Auto-generate the AI study plan so the profile tab is ready.
        app(\App\Services\Learner\StudyPlanService::class)->generate($subscriber);

        return Redirect::route('welcome.placement.result', [
            'score' => $score,
            'total' => $total,
            'level' => $level,
            'bySkill' => json_encode($bySkill),
        ]);
    }

    /** Screen 06 — placement result. */
    public function placementResult(Request $request)
    {
        $bySkill = json_decode((string) $request->query('bySkill', '{}'), true) ?: [];

        return Inertia::render('Learner/Onboarding/PlacementResult', [
            'score' => (int) $request->query('score', 0),
            'total' => (int) $request->query('total', 15),
            'level' => (string) $request->query('level', 'A1'),
            'bySkill' => $bySkill,
        ]);
    }

    /** Lightweight session lookup that never creates records (welcome page). */
    private function subscriberIfPresent(Request $request): ?\App\Models\Subscriber
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        if ($msisdn === '') {
            return null;
        }

        return \App\Models\Subscriber::query()->where('msisdn', $msisdn)->first();
    }
}
