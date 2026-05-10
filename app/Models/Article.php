<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Article Model - Represents articles/posts in the CMS system
 * 
 * This model handles different types of content (articles, news, blog posts, etc.)
 * based on the associated post type. Articles can be categorized, have featured images,
 * support rich text content via body_blocks, and track view counts.
 * 
 * @property int $id
 * @property int $post_type_id
 * @property int|null $category_id
 * @property string $slug
 * @property string $title
 * @property string|null $excerpt
 * @property string|null $featured_image_path
 * @property string|null $body
 * @property array|null $body_blocks
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property int|null $publish_by
 * @property bool $is_breaking
 * @property string $visibility
 * @property int $view_count
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read string|null $featured_image_url
 * @property-read \App\Models\PostType $postType
 * @property-read \App\Models\Category|null $category
 * @property-read \App\Models\User|null $publisher
 */
class Article extends Model
{
    /**
     * Attributes to append to the model's array/JSON form.
     * 
     * @var array
     */
    protected $appends = [
        'featured_image_url',  // Computed URL for the featured image
    ];

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'post_type_id',          // Foreign key to post_types table
        'category_id',           // Foreign key to categories table (optional)
        'slug',                  // URL-friendly identifier (unique)
        'title',                 // Article title
        'excerpt',               // Short summary of the article
        'featured_image_path',   // Path to featured image in storage
        'body',                  // Main article content (HTML/text)
        'body_blocks',           // Structured content blocks (JSON/array)
        'published_at',          // Publication date/time
        'publish_by',            // User ID who published the article
        'is_breaking',           // Flag for breaking news
        'visibility',            // Visibility setting (public, private, etc.)
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'published_at' => 'datetime',    // Cast to Carbon instance
        'view_count' => 'integer',       // Cast to integer
        'body_blocks' => 'array',        // JSON to array conversion
        'is_breaking' => 'boolean',      // Cast to boolean
    ];

    /**
     * Get the post type associated with this article.
     * 
     * Defines a many-to-one relationship with the PostType model.
     * Each article belongs to a specific post type (e.g., news, blog, article).
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function postType()
    {
        return $this->belongsTo(PostType::class);
    }

    /**
     * Get the category associated with this article.
     * 
     * Defines a many-to-one relationship with the Category model.
     * Articles can be optionally categorized for better organization.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the user who published this article.
     * 
     * Defines a many-to-one relationship with the User model.
     * Uses 'publish_by' as the foreign key instead of the conventional 'user_id'.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function publisher()
    {
        return $this->belongsTo(User::class, 'publish_by');
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image_path) {
            return null;
        }

        $raw = (string) $this->featured_image_path;
        $rawTrimmed = trim($raw);
        if ($rawTrimmed === '') {
            return null;
        }

        // Allow direct URLs or absolute paths (useful for seeded/demo content).
        $lower = strtolower($rawTrimmed);
        if (str_starts_with($lower, 'http://') || str_starts_with($lower, 'https://')) {
    /**
     * Get the route key for the model.
     * 
     * Uses 'slug' instead of the default 'id' for route model binding.
     * This allows for SEO-friendly URLs like /articles/my-article-slug.
     * 
     * @return string
     */
            return $rawTrimmed;
        }
        if (str_starts_with($rawTrimmed, '/')) {
            return $rawTrimmed;
        }

        $path = ltrim($rawTrimmed, '/');
        return '/storage/'.$path;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
