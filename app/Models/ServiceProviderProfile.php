<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ServiceProviderProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'years_experience',
        'visit_charge',
        'hourly_rate',
        'pricing_note',
        'service_radius_km',
        'base_area_name',
        'district',
        'latitude',
        'longitude',
        'verification_status',
        'nid_or_certificate_path',
        'is_available_now',
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'visit_charge' => 'float',
        'hourly_rate' => 'float',
        'service_radius_km' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_available_now' => 'boolean',
    ];

    /**
     * Get the User that owns this provider profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Service categories offered by this provider.
     */
    public function serviceCategories(): BelongsToMany
    {
        return $this->belongsToMany(
            ServiceCategory::class,
            'provider_service_categories',
            'service_provider_profile_id',
            'service_category_id'
        )->withTimestamps();
    }

    /**
     * Service quotes sent by this provider.
     */
    public function serviceQuotes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ServiceQuote::class, 'provider_id');
    }

    /**
     * Reviews received by this provider.
     */
    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ServiceReview::class, 'provider_id')->latest();
    }

    /**
     * Compute average rating score.
     */
    public function getAverageRatingAttribute(): float
    {
        $avg = $this->reviews()->avg('rating');
        return $avg ? round((float) $avg, 1) : 5.0;
    }

    /**
     * Compute total count of reviews.
     */
    public function getTotalReviewsAttribute(): int
    {
        return $this->reviews()->count();
    }

    /**
     * Compute percentage of reviews marked 'fair' price.
     */
    public function getPriceFairnessScoreAttribute(): int
    {
        $total = $this->reviews()->count();
        if ($total === 0) return 100;

        $fairCount = $this->reviews()->where('price_fairness', 'fair')->count();
        return (int) round(($fairCount / $total) * 100);
    }

    /**
     * Provider working schedule & exception availabilities.
     */
    public function availabilities(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProviderAvailability::class, 'provider_id');
    }

    /**
     * Customers who favorited this provider.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'favorite_providers',
            'provider_id',
            'customer_id'
        )->withTimestamps();
    }
}
