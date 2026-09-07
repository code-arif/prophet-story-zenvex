<?php

namespace App\Http\Controllers;

use App\Models\Prophet;
use App\Models\StoryChapter;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * ProphetController - Subscriber-facing Prophet library.
 *
 *  - index: all Prophets ordered by chronological_order with chapter count
 *    and, for the logged-in subscriber, per-Prophet reading completion.
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
        $readCountByProphet = $this->readCountByProphet($request);

        $prophets = Prophet::query()
            ->withCount('chapters')
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get()
            ->map(function (Prophet $prophet) use ($readCountByProphet) {
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
                ];
            });

        return Inertia::render('Library/Index', [
            'prophets' => $prophets,
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
        $subscriberId = $this->currentSubscriberId($request);
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

    /**
     * Resolve the subscriber id for the current reader session, if any.
     */
    private function currentSubscriberId(Request $request): ?int
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        if ($msisdn === '' && Auth::guard('subscriber')->check()) {
            $msisdn = (string) Auth::guard('subscriber')->user()->msisdn;
        }
        if ($msisdn === '') {
            return null;
        }

        return Subscriber::query()->where('msisdn', $msisdn)->value('id');
    }
}