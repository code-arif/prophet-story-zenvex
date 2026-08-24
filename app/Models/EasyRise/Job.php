<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Job extends Model
{
    use HasFactory;

    protected $table = 'easy_rise_jobs';

    protected $fillable = [
        'user_id',
        'client_id',
        'title',
        'description',
        'deadline',
        'agreed_paisa',
        'status',
    ];

    protected $casts = [
        'deadline' => 'date',
        'agreed_paisa' => 'integer',
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function scopeItems(): HasMany
    {
        return $this->hasMany(ScopeItem::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function incomeEntries(): HasMany
    {
        return $this->hasMany(IncomeEntry::class);
    }

    public function reminderLogs(): HasMany
    {
        return $this->hasMany(ReminderLog::class);
    }
}
