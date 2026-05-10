<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Page Model - Represents static pages in the CMS
 * 
 * Pages are used for static content like About, Contact, etc.
 * They can use a visual builder (builder_data) or simple content.
 * Pages support visibility settings and publishing status.
 * 
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string|null $content
 * @property bool $is_published
 * @property array|null $builder_data
 * @property bool $use_builder
 * @property string $visibility
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Page extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'slug',           // URL-friendly identifier (unique)
        'title',          // Page title
        'content',        // Page content (HTML/text)
        'is_published',   // Whether page is published
        'builder_data',   // Visual builder data (JSON/array)
        'use_builder',    // Whether to use the visual builder
        'visibility',     // Visibility setting (public, private, etc.)
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'is_published' => 'boolean',   // Cast to boolean
        'use_builder' => 'boolean',    // Cast to boolean
        'builder_data' => 'array',     // JSON to array conversion
    ];
}
