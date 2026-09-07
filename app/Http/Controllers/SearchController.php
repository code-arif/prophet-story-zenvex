<?php

namespace App\Http\Controllers;

use App\Models\Prophet;
use App\Models\StoryChapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * SearchController - Prophet Stories Library Search.
 *
 * Searches Prophet names and StoryChapter titles/content_standard/moral lessons,
 * returning ranked results grouped by Prophet.
 */
class SearchController extends Controller
{
    /**
     * Search by Prophet name, keyword, or theme.
     *
     * @param Request $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->input('q', $request->input('query', '')));

        if ($q === '') {
            $payload = [
                'q' => '',
                'results' => [],
                'totalMatches' => 0,
            ];

            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json($payload);
            }

            return Inertia::render('Search/Index', $payload);
        }

        // 1. Search matching Prophets (by name, Arabic name, short intro)
        $prophets = Prophet::query()
            ->withCount('chapters')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('name_arabic', 'like', "%{$q}%")
                    ->orWhere('short_intro', 'like', "%{$q}%");
            })
            ->get();

        // 2. Search matching StoryChapters (by title, standard content, moral lesson, reference)
        $chapters = StoryChapter::query()
            ->with(['prophet'])
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('content_standard', 'like', "%{$q}%")
                    ->orWhere('content_kid_friendly', 'like', "%{$q}%")
                    ->orWhere('moral_lesson', 'like', "%{$q}%")
                    ->orWhere('source_reference', 'like', "%{$q}%");
            })
            ->orderBy('prophet_id')
            ->orderBy('chapter_number')
            ->get();

        // 3. Group and rank results by Prophet
        $grouped = [];

        // Seed groups from directly matching Prophets
        foreach ($prophets as $prophet) {
            $pScore = 30;
            if (mb_stripos($prophet->name, $q) !== false) {
                $pScore += 70;
            }
            if ($prophet->name_arabic && mb_stripos($prophet->name_arabic, $q) !== false) {
                $pScore += 50;
            }

            $grouped[$prophet->id] = [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'name_arabic' => $prophet->name_arabic,
                'short_intro' => $prophet->short_intro,
                'cover_image_url' => $prophet->cover_image_url,
                'chapter_count' => (int) $prophet->chapters_count,
                'score' => $pScore,
                'matched_prophet' => true,
                'matching_chapters' => [],
            ];
        }

        // Add matching chapters into their respective Prophet groups
        foreach ($chapters as $chapter) {
            $prophet = $chapter->prophet;
            if (!$prophet) {
                continue;
            }

            if (!isset($grouped[$prophet->id])) {
                $grouped[$prophet->id] = [
                    'id' => $prophet->id,
                    'name' => $prophet->name,
                    'name_arabic' => $prophet->name_arabic,
                    'short_intro' => $prophet->short_intro,
                    'cover_image_url' => $prophet->cover_image_url,
                    'chapter_count' => (int) ($prophet->chapters_count ?? $prophet->chapters()->count()),
                    'score' => 0,
                    'matched_prophet' => false,
                    'matching_chapters' => [],
                ];
            }

            // Determine match reason & score
            $matchType = 'content';
            $snippet = '';
            $chapterScore = 20;

            if (mb_stripos($chapter->title, $q) !== false) {
                $matchType = 'title';
                $chapterScore = 50;
                if ($chapter->content_standard && mb_stripos($chapter->content_standard, $q) !== false) {
                    $snippet = $this->extractSnippet($chapter->content_standard, $q);
                } elseif ($chapter->moral_lesson && mb_stripos($chapter->moral_lesson, $q) !== false) {
                    $snippet = $this->extractSnippet($chapter->moral_lesson, $q);
                }
            } elseif ($chapter->moral_lesson && mb_stripos($chapter->moral_lesson, $q) !== false) {
                $matchType = 'moral_lesson';
                $snippet = $this->extractSnippet($chapter->moral_lesson, $q);
                $chapterScore = 35;
            } elseif (mb_stripos($chapter->content_standard, $q) !== false) {
                $matchType = 'content';
                $snippet = $this->extractSnippet($chapter->content_standard, $q);
                $chapterScore = 25;
            } elseif ($chapter->content_kid_friendly && mb_stripos($chapter->content_kid_friendly, $q) !== false) {
                $matchType = 'content';
                $snippet = $this->extractSnippet($chapter->content_kid_friendly, $q);
                $chapterScore = 20;
            }

            $grouped[$prophet->id]['score'] += $chapterScore;
            $grouped[$prophet->id]['matching_chapters'][] = [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'snippet' => $snippet,
                'match_type' => $matchType,
            ];
        }

        // For prophets matched by name who don't have matching chapters in this query,
        // include their initial chapters so the user can tap straight in.
        foreach ($grouped as $prophetId => &$group) {
            if ($group['matched_prophet'] && empty($group['matching_chapters'])) {
                $initialChapters = StoryChapter::query()
                    ->where('prophet_id', $prophetId)
                    ->orderBy('chapter_number')
                    ->limit(4)
                    ->get(['id', 'chapter_number', 'title']);

                foreach ($initialChapters as $ic) {
                    $group['matching_chapters'][] = [
                        'id' => $ic->id,
                        'chapter_number' => $ic->chapter_number,
                        'title' => $ic->title,
                        'snippet' => '',
                        'match_type' => 'prophet_match',
                    ];
                }
            }
        }
        unset($group);

        // Sort prophets by highest relevance score
        uasort($grouped, fn ($a, $b) => $b['score'] <=> $a['score']);
        $results = array_values($grouped);

        $totalMatches = array_reduce($results, function ($carry, $item) {
            return $carry + count($item['matching_chapters']);
        }, 0);

        $payload = [
            'q' => $q,
            'results' => $results,
            'totalMatches' => $totalMatches,
        ];

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($payload);
        }

        return Inertia::render('Search/Index', $payload);
    }

    /**
     * Fallback for invoke-style routing if invoked directly.
     */
    public function __invoke(Request $request)
    {
        return $this->index($request);
    }

    /**
     * Extract a small contextual snippet around the matching keyword.
     */
    private function extractSnippet(string $text, string $query, int $radius = 55): string
    {
        $clean = strip_tags($text);
        $pos = mb_stripos($clean, $query);

        if ($pos === false) {
            return mb_substr($clean, 0, $radius * 2) . (mb_strlen($clean) > $radius * 2 ? '…' : '');
        }

        $start = max(0, $pos - $radius);
        $length = mb_strlen($query) + ($radius * 2);
        $snippet = mb_substr($clean, $start, $length);

        if ($start > 0) {
            $snippet = '…' . $snippet;
        }
        if (($start + $length) < mb_strlen($clean)) {
            $snippet .= '…';
        }

        return trim($snippet);
    }
}
