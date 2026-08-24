<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\ChecklistItem;
use App\Models\EasyRise\EasyRiseSetting;
use App\Models\EasyRise\Niche;
use App\Models\EasyRise\Plan;
use App\Models\EasyRise\Review;
use App\Support\LearnerUser;
use Inertia\Inertia;

class LearnController extends Controller
{
    public function index()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $foundations = json_decode(
            file_get_contents(resource_path('js/data/ladderCriteria.json')),
            true
        )['foundations'] ?? [];

        $artifacts = json_decode(
            file_get_contents(resource_path('js/data/checklistItems.json')),
            true
        )['artifacts'] ?? [];

        $completedCount = ChecklistItem::where('user_id', $user->id)
            ->where('done', true)
            ->count();
        $totalItems = ChecklistItem::where('user_id', $user->id)->count();

        $progressPct = $totalItems > 0
            ? round(($completedCount / $totalItems) * 100)
            : 42;

        $plan = Plan::where('user_id', $user->id)->first();
        $review = Review::where('user_id', $user->id)->first();

        return Inertia::render('Learn/Index', [
            'progressPct' => (int) $progressPct,
            'completedCount' => $completedCount > 0 ? $completedCount : 2,
            'totalCount' => 5,
            'checklistDone' => $completedCount > 0 ? $completedCount : 7,
            'checklistTotal' => $totalItems > 0 ? $totalItems : 12,
            'planCreated' => (bool) $plan,
            'planDate' => $plan ? $plan->created_at->format('d M') : '১২ জুন',
            'reviewCreated' => (bool) $review,
            'foundations' => $foundations,
            'artifacts' => $artifacts,
        ]);
    }

    public function marketplace()
    {
        $marketplaces = json_decode(
            file_get_contents(resource_path('js/data/marketplaces.json')),
            true
        );

        return Inertia::render('Learn/MarketplaceCompare', [
            'marketplaces' => $marketplaces,
        ]);
    }

    public function niche()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $niches = Niche::where('user_id', $user->id)
            ->orderByDesc('score')
            ->get();

        return Inertia::render('Learn/NicheScorer', [
            'niches' => $niches,
        ]);
    }

    public function checklist()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $items = ChecklistItem::where('user_id', $user->id)
            ->orderBy('done')
            ->get();

        return Inertia::render('Learn/ProfileChecklist', [
            'items' => $items,
        ]);
    }

    public function proposals()
    {
        $structures = json_decode(
            file_get_contents(resource_path('js/data/proposalStructures.json')),
            true
        );

        return Inertia::render('Learn/ProposalLibrary', [
            'structures' => $structures['jobTypes'] ?? [],
        ]);
    }

    public function scripts()
    {
        $scripts = json_decode(
            file_get_contents(resource_path('js/data/conversationScripts.json')),
            true
        );

        return Inertia::render('Learn/ConversationScripts', [
            'scripts' => $scripts,
        ]);
    }

    public function plan()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $items = Plan::where('user_id', $user->id)
            ->orderBy('deadline')
            ->get();

        return Inertia::render('Learn/Plan90Days', [
            'items' => $items,
        ]);
    }

    public function profileReview()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $review = Review::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->first();

        return Inertia::render('Learn/ProfileReview', [
            'review' => $review,
        ]);
    }
}
