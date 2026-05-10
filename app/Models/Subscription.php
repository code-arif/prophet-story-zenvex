<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Subscription Model - Represents user subscriptions to services
 * 
 * This model tracks subscription status for users (via MSISDN/phone number).
 * Subscriptions have start and end dates, status (active/canceled),
 * and can be associated with different channels (SMS, USSD, etc.).
 * 
 * @property int $id
 * @property string $msisdn
 * @property string $status
 * @property \Illuminate\Support\Carbon $starts_at
 * @property \Illuminate\Support\Carbon|null $ends_at
 * @property string|null $channel
 * @property string|null $last_message
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Subscription extends Model
{
    // Subscription status constants
    public const STATUS_ACTIVE = 'active';      // Subscription is currently active
    public const STATUS_CANCELED = 'canceled'; // Subscription has been canceled

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'msisdn',        // Phone number (Mobile Station International Subscriber Directory Number)
        'status',        // Current status: 'active' or 'canceled'
        'starts_at',     // Subscription start date/time
        'ends_at',       // Subscription end date/time (nullable for indefinite)
        'channel',       // Channel used for subscription (SMS, USSD, etc.)
        'last_message',  // Last message sent to the subscriber
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'starts_at' => 'datetime',  // Cast to Carbon instance
        'ends_at' => 'datetime',    // Cast to Carbon instance (nullable)
    ];
}
