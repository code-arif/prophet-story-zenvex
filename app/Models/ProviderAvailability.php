<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'day_of_week',
        'specific_date',
        'start_time',
        'end_time',
        'is_available',
    ];

    protected $casts = [
        'specific_date' => 'date',
        'is_available' => 'boolean',
    ];

    /**
     * Parent Service Provider profile.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProviderProfile::class, 'provider_id');
    }
}
