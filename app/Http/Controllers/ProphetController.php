<?php

namespace App\Http\Controllers;

use App\Models\ChapterReadRecord;
use App\Models\KidProfile;
use App\Models\Prophet;
use App\Models\ReadingBookmark;
use App\Models\StoryChapter;
use App\Models\Subscriber;
use App\Support\CurrentSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * ProphetController - Subscriber-facing Prophet library.
 *
 *  - index: all Prophets ordered by chronological_order with chapter count,
 *    per-Prophet reading completion, overall library completion summary,
 *    and resume bookmark.
 *  - show:  the selected Prophet's chapter list with read/unread markers.
 *  - progress: computes percentage complete per Prophet and overall library
 *    completion percentage.
 */
class ProphetController extends Controller
{
    /**
     * List all Prophets for the library browse view.
     */
    public function index(Request $request)
    {
        $subscriberId = CurrentSubscriber::id($request);
        $progressData = $this->progress($request);
        $prophetsProgress = $progressData['prophets'] ?? [];

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

        // Check for active KidProfile session context
        $activeKidProfile = null;
        $activeKidProfileId = $request->session()->get('active_kid_profile_id');
        if ($activeKidProfileId) {
            $activeKidProfile = KidProfile::find($activeKidProfileId);
        }

        $prophetsQuery = Prophet::query()->withCount('chapters');

        // When a KidProfile is active with restricted unlocked Prophets, filter the library
        if ($activeKidProfile && !empty($activeKidProfile->unlocked_prophet_ids)) {
            $prophetsQuery->whereIn('id', $activeKidProfile->unlocked_prophet_ids);
        }

        $prophets = $prophetsQuery
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get()
            ->map(function (Prophet $prophet) use ($subscriberId, $prophetsProgress, $resumeByProphet) {
                $total = (int) $prophet->chapters_count;
                $pStats = $prophetsProgress[$prophet->id] ?? null;
                $completed = $pStats['chapters_read'] ?? 0;
                $percent = $pStats['percentage'] ?? 0;

                return [
                    'id' => $prophet->id,
                    'name' => $prophet->name,
                    'name_arabic' => $prophet->name_arabic,
                    'short_intro' => $prophet->short_intro,
                    'cover_image_url' => $prophet->cover_image_url,
                    'chapter_count' => $total,
                    'completed_chapters' => $subscriberId === null ? null : $completed,
                    'progress_percent' => $subscriberId === null || $total === 0 ? null : $percent,
                    'is_completed' => $pStats['is_completed'] ?? false,
                    // Chapter to resume from if this story was started.
                    'resume_chapter' => $resumeByProphet[$prophet->id] ?? null,
                ];
            });

        return Inertia::render('Library/Index', [
            'prophets' => $prophets,
            'continueReading' => $continueReading,
            'overallProgress' => $progressData['overall'] ?? null,
            'activeKidProfile' => $activeKidProfile ? [
                'id' => $activeKidProfile->id,
                'name' => $activeKidProfile->name,
                'default_reader_mode' => $activeKidProfile->default_reader_mode,
            ] : null,
        ]);
    }

    /**
     * Chapter list for a single Prophet with read/unread markers.
     */
    public function show(Request $request, Prophet $prophet)
    {
        $subscriberId = CurrentSubscriber::id($request);
        $readChapterIds = $this->readChapterIds($subscriberId);

        $prophet->loadCount('chapters');

        $chapters = $prophet->chapters()
            ->get(['id', 'chapter_number', 'title', 'audio_path'])
            ->map(fn (StoryChapter $chapter) => [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'audio_url' => $chapter->audio_url,
                'is_read' => $readChapterIds !== null && in_array($chapter->id, $readChapterIds, true),
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
     * Compute percentage complete per Prophet and overall library completion.
     *
     * @param Request|Subscriber|int|null $user
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function progress($user = null)
    {
        $subscriberId = null;
        $isRequest = $user instanceof Request;

        if ($isRequest) {
            $subscriberId = CurrentSubscriber::id($user);
        } elseif ($user instanceof Subscriber) {
            $subscriberId = $user->id;
        } elseif (is_numeric($user)) {
            $subscriberId = (int) $user;
        } else {
            $subscriberId = CurrentSubscriber::id(request());
        }

        $readChapterIds = $this->readChapterIds($subscriberId);
        $readSet = $readChapterIds !== null ? array_flip($readChapterIds) : [];

        $prophets = Prophet::query()
            ->with(['chapters:id,prophet_id'])
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get();

        $prophetProgress = [];
        $totalLibraryChapters = 0;
        $totalLibraryRead = 0;
        $completedProphets = 0;
        $totalProphets = $prophets->count();

        foreach ($prophets as $prophet) {
            $totalChapters = $prophet->chapters->count();
            $readCount = 0;
            if ($subscriberId !== null) {
                foreach ($prophet->chapters as $chapter) {
                    if (isset($readSet[$chapter->id])) {
                        $readCount++;
                    }
                }
            }

            $totalLibraryChapters += $totalChapters;
            $totalLibraryRead += $readCount;

            $percent = $totalChapters > 0 ? (int) round(($readCount / $totalChapters) * 100) : 0;
            $isCompleted = $totalChapters > 0 && $readCount >= $totalChapters;
            if ($isCompleted) {
                $completedProphets++;
            }

            $prophetProgress[$prophet->id] = [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'chapters_read' => $readCount,
                'total_chapters' => $totalChapters,
                'percentage' => $percent,
                'is_completed' => $isCompleted,
            ];
        }

        $overallPercent = $totalLibraryChapters > 0
            ? (int) round(($totalLibraryRead / $totalLibraryChapters) * 100)
            : 0;

        $data = [
            'prophets' => $prophetProgress,
            'overall' => [
                'has_subscriber' => $subscriberId !== null,
                'completed_prophets' => $completedProphets,
                'total_prophets' => $totalProphets,
                'completed_chapters' => $totalLibraryRead,
                'total_chapters' => $totalLibraryChapters,
                'overall_percentage' => $overallPercent,
            ],
        ];

        if ($isRequest && ($user->wantsJson() || $user->is('*/progress*'))) {
            return response()->json($data);
        }

        return $data;
    }

    /**
     * Read chapter ids the current subscriber has finished.
     *
     * @param int|null $subscriberId
     * @return array<int>|null null when no reader or no chapter_read_records table
     */
    private function readChapterIds(?int $subscriberId): ?array
    {
        if ($subscriberId === null) {
            return null;
        }

        if (!Schema::hasTable('chapter_read_records')) {
            return null;
        }

        try {
            return DB::table('chapter_read_records')
                ->where('subscriber_id', $subscriberId)
                ->pluck('story_chapter_id')
                ->map(fn ($v) => (int) $v)
                ->all();
        } catch (\Throwable $e) {
            return null;
        }
    }
}