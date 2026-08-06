<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * Lesson — a curriculum step rendered by the lesson player.
 */
class Lesson extends Model
{
    protected $fillable = [
        'level', 'unit_no', 'order_index', 'title_en', 'title_bn',
        'subtitle_bn', 'explanation_bn', 'examples', 'exercises',
        'estimated_minutes', 'is_published',
    ];

    protected $casts = [
        'examples' => 'array',
        'exercises' => 'array',
        'is_published' => 'boolean',
    ];
}
