<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * AiScenario — a chat scenario tile (job interview, shopping, …).
 */
class AiScenario extends Model
{
    protected $fillable = [
        'slug', 'title_bn', 'title_en', 'icon_key', 'level',
        'opening', 'replies', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'opening' => 'array',
        'replies' => 'array',
        'is_active' => 'boolean',
    ];
}
