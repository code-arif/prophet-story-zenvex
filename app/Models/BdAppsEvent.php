<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * BdAppsEvent Model - Logs API events from BdApps integration
 * 
 * This model stores incoming and outgoing API requests/responses
 * to/from the BdApps platform (SMS/USSD services). Useful for
 * debugging, auditing, and monitoring API interactions.
 * 
 * @property int $id
 * @property string $direction (incoming/outgoing)
 * @property string $service (sms, ussd, etc.)
 * @property string $http_method
 * @property string $url
 * @property int|null $status_code
 * @property array|null $headers
 * @property array|null $request
 * @property array|null $response
 * @property string|null $error
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class BdAppsEvent extends Model
{
    /**
     * Custom table name for BdApps events.
     */
    protected $table = 'bdapps_events';

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'direction',     // 'incoming' or 'outgoing'
        'service',       // Service type (sms, ussd, etc.)
        'http_method',   // HTTP method (GET, POST, etc.)
        'url',           // Request URL
        'status_code',   // HTTP status code (nullable)
        'headers',       // Request/response headers (JSON)
        'request',       // Request body (JSON)
        'response',      // Response body (JSON)
        'error',         // Error message if any
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'headers' => 'array',    // JSON to array conversion
        'request' => 'array',    // JSON to array conversion
        'response' => 'array',   // JSON to array conversion
    ];
}
