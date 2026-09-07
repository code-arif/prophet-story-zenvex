<?php

namespace App\Http\Controllers;

use App\Models\Prophet;
use App\Models\ReadingBookmark;
use App\Models\StoryChapter;
use App\Support\CurrentSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * ProphetController - Subscriber-facing Prophet library.
 *
 *  - index: all Prophets ordered by chronological_order with chapter count,
 *    per-Prophet reading completion and, when the subscriber has started a
 *    Prophet's story, the chapter to resume from. A "continue reading"
 *    target (the most recent bookmark across all Prophets) tops the payload.
 *  - show:  the selected Prophet's chapter list with read/unread markers.
 *
 * Reading progress is sourced from the `reading_progress` table
 * (subscriber_id, story_chapter_id, read_at) which the reading-progress
 * feature introduces. Until that migration exists the queries below fail
 * open (no progress data) so the pages render cleanly; once the table
 * lands the same code starts reporting completion percentages.
 */
class ProphetController extends Controller
{
    /**
     * List all Prophets for the library browse view.
     */
    public function index(Request $request)
    {
        $subscriberId = CurrentSubscriber::id($request);
        $readCountByProphet = $this->readCountByProphet($request);

        // One bookmark per prophet — the chapter each story should resume at.
        $bookmarks = $subscriberId !== null
            ? ReadingBookmark::query()
                ->where('subscriber_id', $subscriberId)
                ->with(['chapter:id,chapter_number,title,prophet_id', 'prophet:id,name,cover_image_path'])
                ->orderByRaw('last_read_at IS NULL, last_read_at DESC')
                ->get()
            : collect();

        $resumeByProphet = [];
        foreach ($bookmarks as $bookmark) {
            if (!$bookmark->chapter) {
                continue;
            }
            $resumeByProphet[(int) $bookmark->prophet_id] = [
                'id' => $bookmark->chapter->id,
                'chapter_number' => $bookmark->chapter->chapter_number,
                'title' => $bookmark->chapter->title,
            ];
        }

        // Most recently read chapter across all Prophets.
        $continueReading = null;
        $latest = $bookmarks->first();
        if ($latest && $latest->chapter && $latest->prophet) {
            $continueReading = [
                'chapter_id' => $latest->chapter->id,
                'chapter_number' => $latest->chapter->chapter_number,
                'chapter_title' => $latest->chapter->title,
                'prophet_id' => $latest->prophet->id,
                'prophet_name' => $latest->prophet->name,
                'cover_image_url' => $latest->prophet->cover_image_url,
            ];
        }

        $prophets = Prophet::query()
            ->withCount('chapters')
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get()
            ->map(function (Prophet $prophet) use ($readCountByProphet, $resumeByProphet) {
                $total = (int) $prophet->chapters_count;
                $completed = $readCountByProphet[$prophet->id] ?? 0;

                return [
                    'id' => $prophet->id,
                    'name' => $prophet->name,
                    'name_arabic' => $prophet->name_arabic,
                    'short_intro' => $prophet->short_intro,
                    'cover_image_url' => $prophet->cover_image_url,
                    'chapter_count' => $total,
                    // Null when the reader cannot be identified or the
                    // reading_progress table is not present yet.
                    'completed_chapters' => $readCountByProphet === null ? null : $completed,
                    'progress_percent' => $readCountByProphet === null || $total === 0
                        ? null
                        : (int) round(($completed / $total) * 100),
                    // Chapter to resume from if this story was started.
                    'resume_chapter' => $resumeByProphet[$prophet->id] ?? null,
                ];
            });

        return Inertia::render('Library/Index', [
            'prophets' => $prophets,
            'continueReading' => $continueReading,
        ]);
    }

    /**
     * Chapter list for a single Prophet with read/unread markers.
     */
    public function show(Request $request, Prophet $prophet)
    {
        $readChapterIds = $this->readChapterIds($request);

        $prophet->loadCount('chapters');

        $chapters = $prophet->chapters()
            ->get(['id', 'chapter_number', 'title'])
            ->map(fn (StoryChapter $chapter) => [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'is_read' => in_array($chapter->id, $readChapterIds, true),
            ]);

        return Inertia::render('Library/Show', [
            'prophet' => [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'name_arabic' => $prophet->name_arabic,
                'short_intro' => $prophet->short_intro,
                'cover_image_url' => $prophet->cover_image_url,
                'chapter_count' => (int) $prophet->chapters_count,
            ],
            'chapters' => $chapters,
            'hasProgress' => $readChapterIds !== null,
        ]);
    }

    /**
     * Read chapter ids the current subscriber has finished.
     *
     * @return array<int>|null  null when no reader or no reading_progress table
     */
    private function readChapterIds(Request $request): ?array
    {
        $subscriberId = CurrentSubscriber::id($request);
        if ($subscriberId === null) {
            return null;
        }

        if (!Schema::hasTable('reading_progress')) {
            return null;
        }

        try {
            return DB::table('reading_progress')
                ->where('subscriber_id', $subscriberId)
                ->pluck('story_chapter_id')
                ->map(fn ($v) => (int) $v)
                ->all();
        } catch (\Throwable $e) {
            // Column drift until the reading-progress migration lands.
            return null;
        }
    }

    /**
     * Map of prophet_id => number of chapters the subscriber has read.
     *
     * @return array<int, int>|null  null when progress is unavailable
     */
    private function readCountByProphet(Request $request): ?array
    {
        $ids = $this->readChapterIds($request);
        if ($ids === null || $ids === []) {
            return $ids === null ? null : [];
        }

        $chapterProphetIds = DB::table('story_chapters')
            ->whereIn('id', $ids)
            ->pluck('prophet_id', 'id');

        $counts = [];
        foreach ($chapterProphetIds as $prophetId) {
            $counts[(int) $prophetId] = ($counts[(int) $prophetId] ?? 0) + 1;
        }

        return $counts;
    }
}