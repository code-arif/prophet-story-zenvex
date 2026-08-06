<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * WritingPrompt — a topic the learner can write about.
 */
class WritingPrompt extends Model
{
    protected $fillable = [
        'title_en', 'title_bn', 'level', 'word_range',
        'category', 'structure', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'structure' => 'array',
        'is_published' => 'boolean',
    ];
}
