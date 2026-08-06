<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * ReadingPassage — graded reading content with glossary + comprehension.
 */
class ReadingPassage extends Model
{
    protected $fillable = [
        'level', 'title_en', 'summary_bn', 'content', 'glossary',
        'questions', 'words', 'minutes', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'glossary' => 'array',
        'questions' => 'array',
        'is_published' => 'boolean',
    ];
}
