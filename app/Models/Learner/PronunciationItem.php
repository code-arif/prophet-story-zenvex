<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * PronunciationItem — one target to practise (word / sentence / pairs).
 */
class PronunciationItem extends Model
{
    protected $fillable = [
        'mode', 'target', 'phonetic', 'words', 'level', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'words' => 'array',
        'is_published' => 'boolean',
    ];
}
