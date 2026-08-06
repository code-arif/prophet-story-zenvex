<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * ProgressLog — one row per completed study activity. Powers streaks,
 * the daily loop and the progress dashboard.
 */
class ProgressLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'subscriber_id', 'skill', 'type', 'reference_type',
        'reference_id', 'points', 'minutes', 'created_at',
    ];

    protected $casts = ['created_at' => 'datetime'];
}
