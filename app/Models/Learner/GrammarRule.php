<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * GrammarRule — one rule in the grammar library.
 */
class GrammarRule extends Model
{
    protected $fillable = [
        'slug', 'name_en', 'summary_bn', 'category', 'level',
        'explanation_bn', 'structure', 'structure_note_bn',
        'correct', 'mistakes', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'explanation_bn' => 'array',
        'correct' => 'array',
        'mistakes' => 'array',
        'is_published' => 'boolean',
    ];
}
