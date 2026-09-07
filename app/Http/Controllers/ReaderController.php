<?php

namespace App\Http\Controllers;

use App\Models\Prophet;
use App\Models\StoryChapter;
use Inertia\Inertia;

/**
 * ReaderController - Subscriber-facing chapter reading views.
 *
 * standard(): the primary adult-oriented reading experience — clean
 * book-style typography over `content_standard`, closing with the moral
 * lesson and the source citation, plus prev/next chapter navigation.
 * (Kid-mode reading will reuse the same chapter resolution.)
 */
class ReaderController extends Controller
{
    public function standard(StoryChapter $chapter)
    {
        $prophet = $chapter->prophet()->first(['id', 'name', 'name_arabic']);

        $prev = StoryChapter::query()
            ->where('prophet_id', $chapter->prophet_id)
            ->where('chapter_number', '<', $chapter->chapter_number)
            ->orderByDesc('chapter_number')
            ->first(['id', 'chapter_number', 'title']);

        $next = StoryChapter::query()
            ->where('prophet_id', $chapter->prophet_id)
            ->where('chapter_number', '>', $chapter->chapter_number)
            ->orderBy('chapter_number')
            ->first(['id', 'chapter_number', 'title']);

        $navItem = fn (?StoryChapter $c) => $c === null ? null : [
            'id' => $c->id,
            'chapter_number' => $c->chapter_number,
            'title' => $c->title,
        ];

        return Inertia::render('Reader/Standard', [
            'chapter' => [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'content_standard' => $chapter->content_standard,
                'moral_lesson' => $chapter->moral_lesson,
                'source_reference' => $chapter->source_reference,
            ],
            'prophet' => $prophet ? [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'name_arabic' => $prophet->name_arabic,
                'cover_image_url' => $prophet->cover_image_url,
            ] : null,
            'navigation' => [
                'prev' => $navItem($prev),
                'next' => $navItem($next),
            ],
        ]);
    }
}