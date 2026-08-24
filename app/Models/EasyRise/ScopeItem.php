<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class ScopeItem extends Model
{
    use HasFactory;

    protected $table = 'scope_items';

    protected $fillable = [
        'user_id',
        'job_id',
        'title',
        'description',
        'date',
        'hours',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'decimal:2',
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
