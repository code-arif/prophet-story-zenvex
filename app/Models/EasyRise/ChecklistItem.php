<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class ChecklistItem extends Model
{
    use HasFactory;

    protected $table = 'checklist_items';

    protected $fillable = [
        'user_id',
        'item_id',
        'done',
    ];

    protected $casts = [
        'done' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
