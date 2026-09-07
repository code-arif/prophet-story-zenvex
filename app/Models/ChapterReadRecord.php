<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ChapterReadRecord Model - Completion tracking for chapters.
 *
 * One row per subscriber per chapter, inserted when the reader reaches the
 * end of a chapter in either reading mode (enforced by a unique pair).
 * Per-Prophet completion (chapters read / total chapters) and the overall
 * library completion percentage are derived from these records.
 *
 * @property int $id
 * @property int $subscriber_id
 * @property int $story_chapter_id
 * @property \Illuminate\Support\Carbon $completed_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Subscriber $subscriber
 * @property-read StoryChapter $chapter
 */
class ChapterReadRecord extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subscriber_id',
        'story_chapter_id',
        'completed_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completed_at' => 'datetime',
    ];

    /**
     * The subscriber who completed the chapter.
     */
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(Subscriber::class);
    }

    /**
     * The chapter that was completed.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(StoryChapter::class, 'story_chapter_id');
    }
}
