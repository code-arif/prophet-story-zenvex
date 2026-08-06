<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * WritingDraft — an autosaved learner draft.
 */
class WritingDraft extends Model
{
    protected $fillable = ['subscriber_id', 'prompt_id', 'title', 'body'];
}
