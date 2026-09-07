<?php

namespace App\Http\Controllers;

use App\Models\ChapterReadRecord;
use App\Support\CurrentSubscriber;
use Illuminate\Http\Request;

/**
 * ChapterReadController - Completion tracking persistence.
 *
 * A single JSON endpoint records that the reader reached the end of a
 * chapter (in either reader mode). Marking is idempotent: the unique
 * (subscriber_id, story_chapter_id) pair means one record per chapter,
 * and re-reading a chapter simply refreshes `completed_at`.
 */
class ChapterReadController extends Controller
{
    public function store(Request $request)
    {
        $subscriber = CurrentSubscriber::get($request);
        if (!$subscriber) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'chapter_id' => ['required', 'integer', 'exists:story_chapters,id'],
        ]);

        $record = ChapterReadRecord::query()->updateOrCreate(
            [
                'subscriber_id' => $subscriber->id,
                'story_chapter_id' => (int) $validated['chapter_id'],
            ],
            [
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'saved' => true,
            'is_read' => true,
            'completed_at' => $record->completed_at?->toIso8601String(),
        ]);
    }
}
