<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * CommonMistake — a fixed Bangla-speaker error pattern used by the
 * Mistake Doctor and the rule-based writing-feedback engine.
 */
class CommonMistake extends Model
{
    protected $fillable = [
        'pattern', 'wrong', 'correct', 'reason_bn', 'examples',
        'category', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'examples' => 'array',
        'is_active' => 'boolean',
    ];
}
