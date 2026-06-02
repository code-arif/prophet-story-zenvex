<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    protected $fillable = [
        'type',
        'parent_id',
        'label',
        'href',
        'roles',
        'page_id',
        'article_id',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'roles' => 'array',
        'is_active' => 'boolean',
        'parent_id' => 'integer',
        'page_id' => 'integer',
        'article_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }
}
