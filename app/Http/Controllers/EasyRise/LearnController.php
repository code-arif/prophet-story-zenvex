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
    private function ensureChecklistItems(int $userId): void
    {
        $count = ChecklistItem::where('user_id', $userId)->count();
        if ($count === 0) {
            $jsonItems = json_decode(
                file_get_contents(resource_path('js/data/checklistItems.json')),
                true
            ) ?? [];

            foreach ($jsonItems as $item) {
                $itemId = $item['id'] ?? ('item_' . uniqid());
                ChecklistItem::firstOrCreate([
                    'user_id' => $userId,
                    'item_id' => $itemId,
                ], [
                    'done' => false,
                ]);
            }
        }
    }

    public function index()
    {
        $user = LearnerUser::resolve();
        if (!$user) return redirect()->route('easy.welcome');

        $this->ensureChecklistItems($user->id);

        $settings = EasyRiseSetting::where('user_id', $user->id)
            ->pluck('value', 'key');

        $marketplaceDone = (bool) ($settings->get('learned_marketplace_done', false));

        $nicheCount = Niche::where('user_id', $user->id)->count();
        $nicheDone = $nicheCount > 0;

        $checklistTotal = ChecklistItem::where('user_id', $user->id)->count();
        $checklistDone = ChecklistItem::where('user_id', $user->id)->where('done', true)->count();

        $proposalsDone = (bool) ($settings->get('learned_proposals_done', false));
        $scriptsDone = (bool) ($settings->get('learned_scripts_done', false));

        // Count how many modules are completed (out of 5)
        $completedModulesCount = 0;
        if ($marketplaceDone) $completedModulesCount++;
        if ($nicheDone) $completedModulesCount++;
        if ($checklistTotal > 0 && $checklistDone === $checklistTotal) $completedModulesCount++;
        if ($proposalsDone) $completedModulesCount++;
        if ($scriptsDone) $completedModulesCount++;

        // Calculate progress percentage (0 to 100%)
        $marketplaceScore = $marketplaceDone ? 20 : 0;
        $nicheScore = $nicheDone ? 20 : 0;
        $checklistScore = $checklistTotal > 0 ? round(($checklistDone / $checklistTotal) * 20) : 0;
        $proposalsScore = $proposalsDone ? 20 : 0;
        $scriptsScore = $scriptsDone ? 20 : 0;

        $progressPct = min(100, $marketplaceScore + $nicheScore + $checklistScore + $proposalsScore + $scriptsScore);

        $plan = Plan::where('user_id', $user->id)->orderByDesc('created_at')->first();
        $review = Review::where('user_id', $user->id)->orderByDesc('created_at')->first();

        return Inertia::render('Learn/Index', [
            'progressPct' => (int) $progressPct,
            'completedCount' => (int) $completedModulesCount,
            'totalCount' => 5,
            'checklistDone' => (int) $checklistDone,
            'checklistTotal' => (int) $checklistTotal,
            'marketplaceDone' => (bool) $marketplaceDone,
            'nicheDone' => (bool) $nicheDone,
            'nicheCount' => (int) $nicheCount,
            'proposalsDone' => (bool) $proposalsDone,
            'scriptsDone' => (bool) $scriptsDone,
            'planCreated' => (bool) $plan,
            'planDate' => $plan ? $plan->created_at->format('d M') : null,
            'reviewCreated' => (bool) $review,
            'reviewDate' => $review ? $review->created_at->format('d M') : null,
        ]);
    }

    public function marketplace()
    {
        $user = LearnerUser::resolve();
        if ($user) {
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => 'learned_marketplace_done'],
                ['value' => '1']
            );
        }

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

        $this->ensureChecklistItems($user->id);

        $dbItems = ChecklistItem::where('user_id', $user->id)->get()->keyBy('item_id');

        $jsonItems = json_decode(
            file_get_contents(resource_path('js/data/checklistItems.json')),
            true
        ) ?? [];

        $items = array_map(function ($item) use ($dbItems) {
            $itemId = $item['id'];
            $dbRecord = $dbItems[$itemId] ?? null;
            return [
                'id' => $dbRecord ? $dbRecord->id : $itemId,
                'item_id' => $itemId,
                'group' => $item['groupBn'] ?? ($item['group'] ?? 'সাধারণ'),
                'title' => $item['labelBn'] ?? ($item['label'] ?? ''),
                'description' => $item['descriptionBn'] ?? ($item['description'] ?? ''),
                'done' => $dbRecord ? (bool) $dbRecord->done : false,
            ];
        }, $jsonItems);

        return Inertia::render('Learn/ProfileChecklist', [
            'items' => $items,
        ]);
    }

    public function toggleChecklist(\Illuminate\Http\Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $itemId = $request->input('id');
        $itemKey = $request->input('item_id');

        $query = ChecklistItem::where('user_id', $user->id);
        if (is_numeric($itemId)) {
            $item = $query->where('id', $itemId)->first();
        } elseif ($itemId || $itemKey) {
            $key = $itemKey ?: $itemId;
            $item = $query->where('item_id', $key)->first();
        } else {
            $item = null;
        }

        if ($item) {
            $item->done = !$item->done;
            $item->save();
        }

        return redirect()->back();
    }

    public function proposals()
    {
        $user = LearnerUser::resolve();
        if ($user) {
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => 'learned_proposals_done'],
                ['value' => '1']
            );
        }

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
        $user = LearnerUser::resolve();
        if ($user) {
            EasyRiseSetting::updateOrCreate(
                ['user_id' => $user->id, 'key' => 'learned_scripts_done'],
                ['value' => '1']
            );
        }

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
            'headline' => $validated['headline'] ?? ($validated['niche'] ?? 'Profile Review'),
            'overview' => $validated['bio'] ?? '',
            'samples' => $validated['portfolio'] ?? null,
            'result' => json_encode(['niche' => $validated['niche'] ?? null]),
        ]);

        return redirect()->back()->with('success', 'প্রোফাইল রিভিউ সম্পন্ন হয়েছে!');
    }
}
