<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon_key',
        'description',
    ];

    /**
     * Service provider profiles offering this category.
     */
    public function providerProfiles(): BelongsToMany
    {
        return $this->belongsToMany(
            ServiceProviderProfile::class,
            'provider_service_categories',
            'service_category_id',
            'service_provider_profile_id'
        )->withTimestamps();
    }
}
