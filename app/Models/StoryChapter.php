<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * StoryChapter Model - A chapter of a Prophet's narrative.
 *
 * Each chapter carries two content modes: `content_standard` for the
 * standard/adult reading mode and `content_kid_friendly` for the simplified,
 * gentler kid-mode version. `source_reference` is the citation for the
 * account — required, since it is the basis of content trust in this app.
 *
 * @property int $id
 * @property int $prophet_id
 * @property int $chapter_number
 * @property string $title
 * @property string $content_standard
 * @property string $content_kid_friendly
 * @property string|null $illustration_path
 * @property string|null $audio_path
 * @property string $moral_lesson
 * @property string $source_reference
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Prophet $prophet
 */
class StoryChapter extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'prophet_id',            // Foreign key to prophets table
        'chapter_number',        // Order within the prophet's story
        'title',                 // Chapter title
        'content_standard',      // Standard / adult reading mode
        'content_kid_friendly',  // Simplified kid-mode version
        'illustration_path',     // Kid-mode illustration (nullable)
        'audio_path',            // Narration audio (nullable)
        'moral_lesson',          // "What we learn from this" summary
        'source_reference',      // Citation — required for content trust
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'chapter_number' => 'integer',
    ];

    /**
     * Attributes to append to the model's array/JSON form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'illustration_url',  // Computed URL for the kid-mode illustration
        'audio_url',         // Computed URL for the narrated audio
    ];

    /**
     * Get the prophet this chapter belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function prophet(): BelongsTo
    {
        return $this->belongsTo(Prophet::class);
    }

    /**
     * Get the computed kid-mode illustration URL.
     *
     * Accepts direct URLs or absolute paths as-is; anything else is treated
     * as a storage path served from /storage.
     *
     * @return string|null
     */
    public function getIllustrationUrlAttribute(): ?string
    {
        if (!$this->illustration_path) {
            return null;
        }

        $raw = trim((string) $this->illustration_path);
        if ($raw === '') {
            return null;
        }

        $lower = strtolower($raw);
        if (str_starts_with($lower, 'http://') || str_starts_with($lower, 'https://')) {
            return $raw;
        }
        if (str_starts_with($raw, '/')) {
            return $raw;
        }

        return '/storage/' . ltrim($raw, '/');
    }

    /**
     * Get the computed narration audio URL.
     *
     * Accepts direct URLs or absolute paths as-is; anything else is treated
     * as a storage path served from /storage.
     *
     * @return string|null
     */
    public function getAudioUrlAttribute(): ?string
    {
        if (!$this->audio_path) {
            return null;
        }

        $raw = trim((string) $this->audio_path);
        if ($raw === '') {
            return null;
        }

        $lower = strtolower($raw);
        if (str_starts_with($lower, 'http://') || str_starts_with($lower, 'https://')) {
            return $raw;
        }
        if (str_starts_with($raw, '/')) {
            return $raw;
        }

        return '/storage/' . ltrim($raw, '/');
    }
}