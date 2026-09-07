<?php

namespace App\Http\Controllers;

use App\Models\ReadingBookmark;
use App\Models\StoryChapter;
use App\Support\CurrentSubscriber;
use Illuminate\Http\Request;

/**
 * ReadingBookmarkController - Resume-where-you-left-off persistence.
 *
 * A single JSON endpoint upserts the reader's bookmark for a chapter:
 * one active bookmark per subscriber per prophet, moved forward on every
 * chapter open. `scroll_position` (0..1) is optional — chapter-level resume
 * is sufficient when it is absent.
 */
class ReadingBookmarkController extends Controller
{
    public function store(Request $request)
    {
        $subscriber = CurrentSubscriber::get($request);
        if (!$subscriber) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'chapter_id' => ['required', 'integer', 'exists:story_chapters,id'],
            'scroll_position' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ]);

        $chapter = StoryChapter::query()->findOrFail((int) $validated['chapter_id']);

        ReadingBookmark::query()->updateOrCreate(
            [
                'subscriber_id' => $subscriber->id,
                'prophet_id' => $chapter->prophet_id,
            ],
            [
                'story_chapter_id' => $chapter->id,
                'scroll_position' => $validated['scroll_position'] ?? null,
                'last_read_at' => now(),
            ]
        );

        return response()->json(['saved' => true]);
    }
}