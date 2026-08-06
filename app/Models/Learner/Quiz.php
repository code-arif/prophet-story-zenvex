<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Quiz — a test with questions (quick / topic / level).
 */
class Quiz extends Model
{
    protected $fillable = [
        'slug', 'kind', 'title_bn', 'description_bn', 'topic', 'level',
        'questions', 'duration_minutes', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'questions' => 'array',
        'is_active' => 'boolean',
    ];

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
