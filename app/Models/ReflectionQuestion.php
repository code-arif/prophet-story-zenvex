<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ReflectionQuestion Model - Post-chapter discussion prompt.
 *
 * Simple conversation starters placed after the moral lesson at the end of
 * a chapter. These are not graded quiz questions — they are meant to prompt
 * discussion, especially between parent and child. Each question may carry
 * a short `answer_hint` for the reader's reference.
 *
 * @property int $id
 * @property int $story_chapter_id
 * @property string $question
 * @property string|null $answer_hint
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read StoryChapter $chapter
 */
class ReflectionQuestion extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'story_chapter_id',
        'question',
        'answer_hint',
        'sort_order',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sort_order' => 'integer',
    ];

    /**
     * Get the chapter this reflection question belongs to.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(StoryChapter::class, 'story_chapter_id');
    }
}
