<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Prophet Model - A Prophet whose narrative the app presents.
 *
 * Each Prophet is a container for StoryChapter records ordered by
 * `chapter_number`. The library browse view is sequenced by
 * `chronological_order`.
 *
 * @property int $id
 * @property string $name
 * @property string|null $name_arabic
 * @property string $short_intro
 * @property string $cover_image_path
 * @property int $chronological_order
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read string|null $cover_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection|StoryChapter[] $chapters
 */
class Prophet extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',                  // Name in the app language (e.g. Bengali)
        'name_arabic',           // Arabic name (nullable)
        'short_intro',           // One-two line introduction
        'cover_image_path',      // Cover image path for the library card
        'chronological_order',   // Sequencing for the browse view
    ];

    /**
     * Attributes to append to the model's array/JSON form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'cover_image_url',  // Computed URL for the cover image
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'chronological_order' => 'integer',
    ];

    /**
     * Get the story chapters belonging to this prophet.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(StoryChapter::class)->orderBy('chapter_number');
    }

    /**
     * Get the computed cover image URL.
     *
     * Accepts direct URLs or absolute paths as-is; anything else is treated
     * as a storage path served from /storage.
     *
     * @return string|null
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (!$this->cover_image_path) {
            return null;
        }

        $raw = trim((string) $this->cover_image_path);
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