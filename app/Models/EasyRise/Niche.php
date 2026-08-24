<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Niche extends Model
{
    use HasFactory;

    protected $table = 'niches';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'rate_min',
        'rate_max',
        'score',
    ];

    protected $casts = [
        'rate_min' => 'integer',
        'rate_max' => 'integer',
        'score' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
