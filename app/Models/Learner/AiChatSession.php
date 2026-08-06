<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * AiChatSession — a persisted conversation between a subscriber and the
 * rule-based AI tutor.
 */
class AiChatSession extends Model
{
    protected $fillable = [
        'subscriber_id', 'scenario_id', 'messages', 'last_activity_at',
    ];

    protected $casts = [
        'messages' => 'array',
        'last_activity_at' => 'datetime',
    ];

    public function scenario()
    {
        return $this->belongsTo(AiScenario::class, 'scenario_id');
    }
}
