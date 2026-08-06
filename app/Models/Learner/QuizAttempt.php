<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * QuizAttempt — one finished quiz session per subscriber.
 */
class QuizAttempt extends Model
{
    protected $fillable = [
        'subscriber_id', 'quiz_id', 'score', 'total', 'answers', 'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'completed_at' => 'datetime',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
