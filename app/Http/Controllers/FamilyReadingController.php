<?php

namespace App\Http\Controllers;

use App\Models\FamilyReadingLog;
use App\Support\CurrentSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * FamilyReadingController - Lightweight habit tracker for family reading.
 *
 * Provides two JSON endpoints:
 *  - store(): log today's reading session (idempotent)
 *  - streak(): compute and return the current consecutive-day streak
 */
class FamilyReadingController extends Controller
{
    /**
     * Log today's reading session.
     *
     * POST /family-reading/log
     * Body: { chapter_id?: number, kid_profile_id?: number }
     *
     * Idempotent — multiple calls on the same day upsert the same row.
     */
    public function store(Request $request): JsonResponse
    {
        $subscriber = CurrentSubscriber::get($request);
        if ($subscriber === null) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'chapter_id' => ['nullable', 'integer', 'exists:story_chapters,id'],
            'kid_profile_id' => ['nullable', 'integer', 'exists:kid_profiles,id'],
        ]);

        $log = FamilyReadingLog::logToday(
            subscriberId: $subscriber->id,
            kidProfileId: $validated['kid_profile_id'] ?? null,
            chapterId: $validated['chapter_id'] ?? null,
        );

        $streak = FamilyReadingLog::computeStreak($subscriber->id);

        return response()->json([
            'saved' => true,
            'read_date' => $log->read_date->toDateString(),
            'streak' => $streak['streak'],
            'today_logged' => true,
        ]);
    }

    /**
     * Get the current reading streak for the authenticated subscriber.
     *
     * GET /family-reading/streak
     */
    public function streak(Request $request): JsonResponse
    {
        $subscriber = CurrentSubscriber::get($request);
        if ($subscriber === null) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $data = FamilyReadingLog::computeStreak($subscriber->id);

        return response()->json([
            'streak' => $data['streak'],
            'today_logged' => $data['today_logged'],
        ]);
    }
}
