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

    /**
     * Quotes submitted for this service request.
     */
    public function serviceQuotes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ServiceQuote::class, 'service_request_id');
    }

    /**
     * Active/latest quote for this request.
     */
    public function activeQuote()
    {
        return $this->serviceQuotes()->latest()->first();
    }

    /**
     * Scoped chat conversation (1-to-1).
     */
    public function conversation(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RequestConversation::class, 'service_request_id');
    }

    /**
     * Get or auto-create conversation for this request.
     */
    public function getOrCreateConversation(): RequestConversation
    {
        return $this->conversation()->firstOrCreate([
            'service_request_id' => $this->id,
        ]);
    }

    /**
     * Status transition history logs.
     */
    public function statusLogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ServiceRequestStatusLog::class, 'service_request_id')->latest();
    }

    /**
     * Helper to update status and record history log entry.
     */
    public function updateStatusWithLog(string $toStatus, int $userId, ?string $reason = null): bool
    {
        $fromStatus = $this->status;
        $this->status = $toStatus;
        $saved = $this->save();

        if ($saved) {
            ServiceRequestStatusLog::create([
                'service_request_id' => $this->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'changed_by' => $userId,
                'reason' => $reason,
            ]);
        }

        return $saved;
    }

    /**
     * Customer review for this request (if completed).
     */
    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ServiceReview::class, 'service_request_id');
    }

    /**
     * Payment record for this completed request.
     */
    public function payment(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ServicePayment::class, 'service_request_id');
    }

    /**
     * Service disputes raised for this request.
     */
    public function disputes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ServiceDispute::class, 'service_request_id')->latest();
    }
}
