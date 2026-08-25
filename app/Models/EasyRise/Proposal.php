<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Proposal extends Model
{
    use HasFactory;

    protected $table = 'proposals';

    protected $fillable = [
        'user_id',
        'job_id',
        'cover_letter',
        'quoted_paisa',
        'sent_at',
        'status',
        'marketplace',
        'job_type',
        'outcome',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'quoted_paisa' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
