<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceQuote extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_request_id',
        'provider_id',
        'estimated_total',
        'visit_charge',
        'labor_charge',
        'materials_charge',
        'breakdown_note',
        'status',
    ];

    protected $casts = [
        'estimated_total' => 'float',
        'visit_charge' => 'float',
        'labor_charge' => 'float',
        'materials_charge' => 'float',
    ];

    /**
     * Target service request for this quote.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'service_request_id');
    }

    /**
     * Provider who created this quote.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProviderProfile::class, 'provider_id');
    }
}
