<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FavoriteProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'provider_id',
    ];

    /**
     * Customer user.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Target service provider profile.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProviderProfile::class, 'provider_id');
    }
}
