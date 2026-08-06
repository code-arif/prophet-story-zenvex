<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * StudyPlanDay — one day of the AI 30-day study plan.
 */
class StudyPlanDay extends Model
{
    protected $fillable = [
        'subscriber_id', 'day_number', 'summary', 'tasks', 'completed', 'completed_at',
    ];

    protected $casts = [
        'tasks' => 'array',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];
}
