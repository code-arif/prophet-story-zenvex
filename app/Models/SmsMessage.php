<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SmsMessage Model - Logs SMS messages sent through the system
 * 
 * This model stores SMS messages for auditing and debugging purposes.
 * Tracks the recipient (MSISDN), message content, provider used,
 * delivery status, and any errors encountered.
 * 
 * @property int $id
 * @property string $msisdn
 * @property string $message
 * @property string|null $provider
 * @property string|null $status
 * @property string|null $error
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class SmsMessage extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'msisdn',     // Recipient phone number
        'message',    // SMS message content
        'provider',   // SMS provider used (e.g., 'bdapps')
        'status',     // Delivery status (sent, failed, pending, etc.)
        'error',      // Error message if delivery failed
    ];
}
