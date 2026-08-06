<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Learner\QuizAttempt;
use App\Models\Learner\SubscriberVocabulary;
use App\Models\Learner\StudyPlanDay;
use App\Models\Learner\WritingDraft;
use App\Models\Learner\ProgressLog;
use App\Models\Learner\AiChatSession;
use App\Models\Learner\Phrase;

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
        'msisdn',                // Phone number (unique identifier)
        'bdapps_subscriber_id',  // BdApps platform subscriber ID (if integrated)
        'name',                   // Subscriber's name (optional)
        'dob',                    // Date of birth (optional)
        'avatar_path',            // Path to avatar image in storage
        // ── "Learn English" learner profile ──
        'level',
        'learning_goal',
        'daily_minutes',
        'placement_score',
        'placement_total',
        'onboarded_at',
        'streak',
        'last_study_date',
        'reminder_enabled',
        'reminder_time',
        'reminder_days',
        'study_plan_generated_at',
        'profile_skipped_at',
        'app_language',
        'font_size',
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'dob' => 'date',  // Cast to Carbon instance (date only, no time)
        'reminder_days' => 'array',
        'onboarded_at' => 'datetime',
        'study_plan_generated_at' => 'datetime',
        'profile_skipped_at' => 'datetime',
        'font_size' => 'integer',
    ];

    // ── "Learn English" learner relations ────────────────────────────

    public function vocabulary(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SubscriberVocabulary::class);
    }

    public function quizAttempts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function studyPlanDays(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StudyPlanDay::class);
    }

    public function drafts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(WritingDraft::class);
    }

    public function progressLogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProgressLog::class);
    }

    public function aiChatSessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(AiChatSession::class);
    }

    public function savedPhrases(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'saved_phrases', 'subscriber_id', 'phrase_id')
            ->withTimestamps();
    }

    /**
     * Whether the learner passed the onboarding gate.
     *
     * Onboarding is passed as soon as the user gets past the profile screen
     * — either by completing it or by skipping (onboarded_at is set in both
     * cases). A level is NOT required: the services default to A2, and the
     * placement test can be taken later from the home screen.
     */
    public function getIsOnboardedAttribute(): bool
    {
        return $this->onboarded_at !== null;
    }

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
