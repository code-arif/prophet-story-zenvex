<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Subscriber Model - Represents subscribers in the system
 * 
 * This model stores subscriber information, typically collected via SMS/USSD services.
 * Subscribers are identified by their MSISDN (phone number) and can have
 * profile information like name, date of birth, and avatar.
 * 
 * @property int $id
 * @property string $msisdn
 * @property string|null $bdapps_subscriber_id
 * @property string|null $name
 * @property \Illuminate\Support\Carbon|null $dob
 * @property string|null $avatar_path
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read string|null $avatar_url
 */
class Subscriber extends Authenticatable
{
    /**
     * Attributes to append to the model's array/JSON form.
     * 
     * @var array
     */
    protected $appends = [
        'avatar_url',  // Computed URL for the subscriber's avatar
    ];

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'msisdn', 
        'bdapps_subscriber_id', 
        'name',
        'dob',
        'avatar_path',
        'app_language',
        'text_size',
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'dob' => 'date',
        'reminder_days' => 'array',
        'onboarded_at' => 'datetime',
        'study_plan_generated_at' => 'datetime',
        'profile_skipped_at' => 'datetime',
        'font_size' => 'integer',
        'text_size' => 'integer',
        'reading_speed' => 'float',
        'voice_auto_continue' => 'boolean',
    ];

    /**
     * Get the full URL for the subscriber's avatar image.
     * 
     * Generates a storage URL for the avatar image path.
     * Returns null if no avatar path is set.
     * 
     * @return string|null Full URL to the avatar image, or null if not set
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar_path) {
            return null;
        }

        $path = ltrim((string) $this->avatar_path, '/');
        return '/storage/'.$path;
    }
}
