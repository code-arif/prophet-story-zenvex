<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Taxonomy Model - Represents a grouping mechanism for categories
 * 
 * Taxonomies are used to group categories for specific post types.
 * For example, a "News" post type might have taxonomies like "Topics" or "Regions".
 * Each taxonomy can have multiple categories under it.
 * 
 * @property int $id
 * @property int $post_type_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property bool $is_active
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\PostType $postType
 * @property-read \Illuminate\Database\Eloquent\Collection|Category[] $categories
 */
class Taxonomy extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'post_type_id',   // Foreign key to post_types table
        'name',           // Taxonomy display name
        'slug',           // URL-friendly identifier
        'description',    // Optional description
        'is_active',      // Whether taxonomy is active
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
     * Get the post type that this taxonomy belongs to.
     * 
     * Defines a many-to-one relationship with the PostType model.
     * Taxonomies are specific to a particular post type.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function postType()
    {
        return $this->belongsTo(PostType::class);
    }

    /**
     * Get the categories under this taxonomy.
     * 
     * Defines a one-to-many relationship with the Category model.
     * One taxonomy can have multiple categories.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
