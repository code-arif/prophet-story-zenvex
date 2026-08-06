<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * Phrase — a real-life English sentence with a Bangla translation.
 */
class Phrase extends Model
{
    protected $fillable = [
        'situation', 'group_label', 'english', 'bengali',
        'note', 'level', 'sort_order', 'is_published',
    ];

    protected $casts = ['is_published' => 'boolean'];
}
