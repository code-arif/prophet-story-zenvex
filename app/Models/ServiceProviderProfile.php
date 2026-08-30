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
}
