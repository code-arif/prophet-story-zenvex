<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceDispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_request_id',
        'raised_by',
        'reason',
        'description',
        'status',
        'resolution_note',
    ];

    /**
     * Associated ServiceRequest.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'service_request_id');
    }

    /**
     * User who raised the dispute.
     */
    public function raisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'raised_by');
    }
}
