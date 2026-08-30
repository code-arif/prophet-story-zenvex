<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'provider_id',
        'request_mode',
        'category_id',
        'description',
        'photo_paths',
        'urgency',
        'preferred_date',
        'preferred_time_slot',
        'start_time',
        'end_time',
        'address_note',
        'district',
        'latitude',
        'longitude',
        'status',
    ];

    protected $casts = [
        'photo_paths' => 'array',
        'preferred_date' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Customer user who submitted the request.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Target Service Provider (if direct mode).
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProviderProfile::class, 'provider_id');
    }

    /**
     * Service category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }
}
