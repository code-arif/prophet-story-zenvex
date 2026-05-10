<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * PostType Model - Defines different types of content
 * 
 * Post types allow the CMS to handle different kinds of content
 * (e.g., articles, news, blog posts, pages) with different
 * taxonomies and categories for each type.
 * 
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property bool $is_active
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|Taxonomy[] $taxonomies
 * @property-read \Illuminate\Database\Eloquent\Collection|Article[] $articles
 */
class PostType extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',           // Post type display name
        'slug',           // URL-friendly identifier
        'description',    // Optional description
        'icon',           // Icon class or identifier for UI
        'is_active',      // Whether post type is active
        'sort_order',     // Display order
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',     // Cast to boolean
        'sort_order' => 'integer',    // Cast to integer
    ];

    /**
     * Get the taxonomies for this post type.
     * 
     * Defines a one-to-many relationship with the Taxonomy model.
     * Each post type can have multiple taxonomies for categorizing content.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function taxonomies()
    {
        return $this->hasMany(Taxonomy::class);
    }

    /**
     * Get the articles of this post type.
     * 
     * Defines a one-to-many relationship with the Article model.
     * Each post type can have multiple articles.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
