<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\EasyRiseSetting;
use App\Models\EasyRise\Job;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $today = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();
        $weekEnd = Carbon::now()->endOfWeek();

        $jobsDue = Job::where('user_id', $user->id)
            ->whereDate('deadline', $today)
            ->count();

        $moneyOwed = Job::where('user_id', $user->id)
            ->where('status', 'awaiting_payment')
            ->sum('agreed_paisa');

        $weeklyLoad = Job::where('user_id', $user->id)
            ->where('status', 'active')
            ->whereBetween('deadline', [$weekStart, $weekEnd])
            ->sum('agreed_paisa');

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $ladderStage = (int) ($settings->get('ladder_stage') ?? 1);

        return Inertia::render('Home/Today', [
            'jobsDue' => $jobsDue,
            'moneyOwed' => $moneyOwed,
            'weeklyLoad' => $weeklyLoad,
            'ladderStage' => $ladderStage,
        ]);
    }

    public function ladder()
    {
        $user = auth()->user();

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $currentStage = (int) ($settings->get('ladder_stage') ?? 1);

        $ladderData = json_decode(
            file_get_contents(resource_path('js/data/ladderCriteria.json')),
            true
        );

        $criteria = $ladderData['stages'][$currentStage]['criteria'] ?? [];
        $nextSteps = $ladderData['stages'][$currentStage]['nextSteps'] ?? [];

        return Inertia::render('Home/RiseLadder', [
            'currentStage' => $currentStage,
            'criteria' => $criteria,
            'nextSteps' => $nextSteps,
        ]);
    }
}
