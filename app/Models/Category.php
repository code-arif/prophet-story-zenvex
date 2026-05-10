<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Category Model - Represents content categories within taxonomies
 * 
 * Categories are used to organize content (articles, posts, etc.) within
 * a specific taxonomy. Categories can be ordered, activated/deactivated,
 * and optionally shown in navigation menus.
 * 
 * @property int $id
 * @property int $taxonomy_id
 * @property string $slug
 * @property string $name
 * @property int $sort_order
 * @property bool $is_active
 * @property bool $show_in_nav
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Taxonomy $taxonomy
 * @property-read \Illuminate\Database\Eloquent\Collection|Article[] $articles
 */
class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'taxonomy_id',   // Foreign key to taxonomies table
        'slug',          // URL-friendly identifier (unique within taxonomy)
        'name',          // Category display name
        'sort_order',    // Display order (lower numbers appear first)
        'is_active',     // Whether category is active (for filtering)
        'show_in_nav',   // Whether to show in navigation menus
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'sort_order' => 'integer',     // Cast to integer
        'is_active' => 'boolean',      // Cast to boolean
        'show_in_nav' => 'boolean',    // Cast to boolean
    ];

    /**
     * Get the taxonomy that this category belongs to.
     * 
     * Defines a many-to-one relationship with the Taxonomy model.
     * Categories are organized under taxonomies for better content structure.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function taxonomy()
    {
        return $this->belongsTo(Taxonomy::class);
    }

    /**
     * Get the articles in this category.
     * 
     * Defines a one-to-many relationship with the Article model.
     * One category can have multiple articles.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
