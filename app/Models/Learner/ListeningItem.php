<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * ListeningItem — a dictation sentence or comprehension passage.
 */
class ListeningItem extends Model
{
    protected $fillable = [
        'kind', 'title', 'text', 'questions', 'level', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'questions' => 'array',
        'is_published' => 'boolean',
    ];
}
