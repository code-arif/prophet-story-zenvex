<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_request_id',
        'amount',
        'method',
        'status',
        'transaction_id',
        'confirmed_by',
        'confirmed_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'confirmed_at' => 'datetime',
    ];

    /**
     * Associated ServiceRequest.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'service_request_id');
    }

    /**
     * User who confirmed the payment.
     */
    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
