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
}
