<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WritingDraft — an autosaved learner draft.
 */
class WritingDraft extends Model
{
    protected $fillable = ['subscriber_id', 'prompt_id', 'title', 'body'];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(WritingPrompt::class);
    }
}
