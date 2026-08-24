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

    public function storeNiche(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate_min' => 'nullable|integer',
            'rate_max' => 'nullable|integer',
            'score' => 'required|integer',
        ]);

        Niche::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'rate_min' => $validated['rate_min'] ?? 0,
            'rate_max' => $validated['rate_max'] ?? 0,
            'score' => $validated['score'],
        ]);

        return redirect()->back()->with('success', 'নিচ সংরক্ষিত হয়েছে!');
    }

    public function checklist()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $count = ChecklistItem::where('user_id', $user->id)->count();
        if ($count === 0) {
            $jsonItems = json_decode(
                file_get_contents(resource_path('js/data/checklistItems.json')),
                true
            ) ?? [];

            foreach ($jsonItems as $item) {
                ChecklistItem::create([
                    'user_id' => $user->id,
                    'title' => $item['labelBn'] ?? $item['label'],
                    'description' => $item['descriptionBn'] ?? $item['description'],
                    'done' => false,
                ]);
            }
        }

        $items = ChecklistItem::where('user_id', $user->id)
            ->get();

        return Inertia::render('Learn/ProfileChecklist', [
            'items' => $items,
        ]);
    }

    public function toggleChecklist(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $itemId = $request->input('id');
        $item = ChecklistItem::where('user_id', $user->id)->where('id', $itemId)->first();

        if ($item) {
            $item->done = !$item->done;
            $item->save();
        }

        return redirect()->back();
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

    public function storePlan(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'skills' => 'nullable|array',
            'hours' => 'required|integer',
            'experience' => 'required|string',
            'english_level' => 'required|integer',
            'income_goal_days' => 'required|integer',
        ]);

        $nicheStr = is_array($request->skills) ? implode(', ', $request->skills) : ($request->skills ?? 'সাধারণ');

        Plan::create([
            'user_id' => $user->id,
            'niche' => $nicheStr,
            'hours' => $validated['hours'],
            'experience' => $validated['experience'],
            'english' => 'Score ' . $validated['english_level'],
            'deadline' => now()->addDays($validated['income_goal_days']),
        ]);

        return redirect()->back()->with('success', '৯০ দিনের পরিকল্পনা তৈরি হয়েছে!');
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

    public function storeProfileReview(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'niche' => 'nullable|string|max:255',
            'headline' => 'nullable|string',
            'bio' => 'nullable|string',
            'portfolio' => 'nullable|string',
        ]);

        Review::create([
            'user_id' => $user->id,
            'client_name' => $validated['niche'] ?? 'Profile Review',
            'rating' => 5,
            'comment' => json_encode($validated),
            'date' => now()->toDateString(),
        ]);

        return redirect()->back()->with('success', 'প্রোফাইল রিভিউ সম্পন্ন হয়েছে!');
    }
}
