<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * KidProfile Model - Child profile managed by a parent.
 *
 * Allows a parent account to manage what a child sees without a separate
 * child authentication system. Session-based context switching applies
 * `unlocked_prophet_ids` filtering to the library and forces `kid` reader mode.
 *
 * @property int $id
 * @property int $parent_user_id
 * @property string $name
 * @property string $default_reader_mode
 * @property array<int>|null $unlocked_prophet_ids
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class KidProfile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parent_user_id',
        'name',
        'default_reader_mode',
        'unlocked_prophet_ids',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'unlocked_prophet_ids' => 'array',
    ];

    /**
     * Check if a specific Prophet story is unlocked for this profile.
     *
     * When `unlocked_prophet_ids` is null or empty, all Prophets are unlocked.
     */
    public function isProphetUnlocked(int $prophetId): bool
    {
        if (empty($this->unlocked_prophet_ids)) {
            return true;
        }

        return in_array($prophetId, array_map('intval', $this->unlocked_prophet_ids), true);
    }
}
