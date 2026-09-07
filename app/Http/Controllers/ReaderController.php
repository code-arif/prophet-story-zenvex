<?php

namespace App\Http\Controllers;

use App\Models\Prophet;
use App\Models\StoryChapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * ReaderController - Subscriber-facing chapter reading views.
 *
 *  - standard(): the primary adult-oriented reading experience — clean
 *    book-style typography over `content_standard`, closing with the moral
 *    lesson and the source citation, plus prev/next chapter navigation.
 *  - kid(): the alternate reading experience built for children — large
 *    illustration, `content_kid_friendly`, bigger text and simple Palm
 *    Green navigation. Both views share the same chapter/navigation payload
 *    so switching modes never loses the reader's place.
 */
class ReaderController extends Controller
{
    public function standard(StoryChapter $chapter)
    {
        return $this->render('Reader/Standard', $chapter, [
            'content' => $chapter->content_standard,
            'illustration_url' => null,
        ]);
    }

    public function kid(StoryChapter $chapter)
    {
        return $this->render('Reader/KidMode', $chapter, [
            'content' => $chapter->content_kid_friendly,
            'illustration_url' => $chapter->illustration_url,
        ]);
    }

    /**
     * Build the shared reader payload for a chapter.
     *
     * @param array{content: string, illustration_url: string|null} $extras
     */
    private function render(string $page, StoryChapter $chapter, array $extras)
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

        return Inertia::render($page, [
            'chapter' => [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'content' => $extras['content'],
                'illustration_url' => $extras['illustration_url'],
                'moral_lesson' => $chapter->moral_lesson,
                'source_reference' => $chapter->source_reference,
            ],
            'prophet' => $prophet ? [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'name_arabic' => $prophet->name_arabic,
            ] : null,
            'navigation' => [
                'prev' => $navItem($prev),
                'next' => $navItem($next),
            ],
        ]);
    }
}