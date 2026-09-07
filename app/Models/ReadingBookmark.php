<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ReadingBookmark Model - Resume-where-you-left-off position.
 *
 * One active bookmark per subscriber per prophet (enforced by a unique
 * pair). Opening a chapter upserts the bookmark — it never accumulates a
 * per-chapter history; that is the reading-progress feature's job.
 * `scroll_position` stores a 0..1 vertical ratio so a reader can resume
 * mid-chapter; null means "start of the chapter".
 *
 * @property int $id
 * @property int $subscriber_id
 * @property int $prophet_id
 * @property int $story_chapter_id
 * @property float|null $scroll_position
 * @property \Illuminate\Support\Carbon|null $last_read_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Subscriber $subscriber
 * @property-read Prophet $prophet
 * @property-read StoryChapter $chapter
 */
class ReadingBookmark extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subscriber_id',
        'prophet_id',
        'story_chapter_id',
        'scroll_position',
        'last_read_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scroll_position' => 'float',
        'last_read_at' => 'datetime',
    ];

    /**
     * The subscriber this bookmark belongs to.
     */
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(Subscriber::class);
    }

    /**
     * The prophet this bookmark tracks.
     */
    public function prophet(): BelongsTo
    {
        return $this->belongsTo(Prophet::class);
    }

    /**
     * The chapter the subscriber should resume at.
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(StoryChapter::class, 'story_chapter_id');
    }
}