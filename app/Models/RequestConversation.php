<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RequestConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_request_id',
    ];

    /**
     * Associated ServiceRequest.
     */
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class, 'service_request_id');
    }

    /**
     * Messages in this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(RequestMessage::class, 'conversation_id')->orderBy('created_at', 'asc');
    }
}
