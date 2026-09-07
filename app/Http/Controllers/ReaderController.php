<?php

namespace App\Http\Controllers;

use App\Models\ChapterReadRecord;
use App\Models\Prophet;
use App\Models\ReadingBookmark;
use App\Models\StoryChapter;
use App\Support\CurrentSubscriber;
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
 *
 * Both render a `resume_scroll` (0..1) when the current subscriber has a
 * bookmark on this exact chapter, letting the reader restore their place
 * mid-chapter after coming back through "Continue Reading".
 */
class ReaderController extends Controller
{
    public function standard(Request $request, StoryChapter $chapter)
    {
        return $this->render($request, 'Reader/Standard', $chapter, [
            'content' => $chapter->content_standard,
            'illustration_url' => null,
        ]);
    }

    public function kid(Request $request, StoryChapter $chapter)
    {
        return $this->render($request, 'Reader/KidMode', $chapter, [
            'content' => $chapter->content_kid_friendly,
            'illustration_url' => $chapter->illustration_url,
        ]);
    }

    /**
     * Build the shared reader payload for a chapter.
     *
     * @param array{content: string, illustration_url: string|null} $extras
     */
    private function render(Request $request, string $page, StoryChapter $chapter, array $extras)
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

        // Mid-chapter resume position when this chapter is bookmarked.
        $resumeScroll = null;
        $isRead = false;
        $subscriberId = CurrentSubscriber::id($request);
        if ($subscriberId !== null) {
            $bookmark = ReadingBookmark::query()
                ->where('subscriber_id', $subscriberId)
                ->where('story_chapter_id', $chapter->id)
                ->first(['scroll_position']);
            if ($bookmark && $bookmark->scroll_position !== null) {
                $resumeScroll = (float) $bookmark->scroll_position;
            }

            $isRead = ChapterReadRecord::query()
                ->where('subscriber_id', $subscriberId)
                ->where('story_chapter_id', $chapter->id)
                ->exists();
        }

        // Load reflection questions for this chapter (ordered by sort_order).
        $reflectionQuestions = $chapter->reflectionQuestions()
            ->get(['id', 'question', 'answer_hint', 'sort_order'])
            ->map(fn ($q) => [
                'id' => $q->id,
                'question' => $q->question,
                'answer_hint' => $q->answer_hint,
            ]);

        return Inertia::render($page, [
            'chapter' => [
                'id' => $chapter->id,
                'chapter_number' => $chapter->chapter_number,
                'title' => $chapter->title,
                'content' => $extras['content'],
                'illustration_url' => $extras['illustration_url'],
                'audio_url' => $chapter->audio_url,
                'moral_lesson' => $chapter->moral_lesson,
                'source_reference' => $chapter->source_reference,
                'is_read' => $isRead,
            ],
            'reflectionQuestions' => $reflectionQuestions,
            'prophet' => $prophet ? [
                'id' => $prophet->id,
                'name' => $prophet->name,
                'name_arabic' => $prophet->name_arabic,
            ] : null,
            'navigation' => [
                'prev' => $navItem($prev),
                'next' => $navItem($next),
            ],
            'resumeScroll' => $resumeScroll,
            'isRead' => $isRead,
        ]);
    }
}