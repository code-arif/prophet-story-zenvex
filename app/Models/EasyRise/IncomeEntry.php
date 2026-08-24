<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class IncomeEntry extends Model
{
    use HasFactory;

    protected $table = 'income_entries';

    protected $fillable = [
        'user_id',
        'job_id',
        'date',
        'amount_paisa',
        'rate',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'amount_paisa' => 'integer',
        'rate' => 'decimal:2',
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
