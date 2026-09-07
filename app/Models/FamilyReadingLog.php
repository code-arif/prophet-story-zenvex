<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * FamilyReadingLog Model - Daily family reading session record.
 *
 * Lightweight habit tracker: one row per subscriber per day. The streak
 * is always computed from data (consecutive calendar days), never stored
 * as a counter.
 *
 * @property int $id
 * @property int $parent_user_id
 * @property int|null $kid_profile_id
 * @property int|null $story_chapter_id
 * @property string $read_date (Y-m-d)
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Subscriber $parent
 * @property-read KidProfile|null $kidProfile
 * @property-read StoryChapter|null $chapter
 */
class FamilyReadingLog extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'parent_user_id',
        'kid_profile_id',
        'story_chapter_id',
        'read_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read_date' => 'date',
    ];

    /* ── Relationships ─────────────────────────────────────── */

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Subscriber::class, 'parent_user_id');
    }

    public function kidProfile(): BelongsTo
    {
        return $this->belongsTo(KidProfile::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(StoryChapter::class, 'story_chapter_id');
    }

    /* ── Streak computation ────────────────────────────────── */

    /**
     * Compute the current consecutive-day reading streak for a subscriber.
     *
     * Counts backwards from today (or the given reference date) through
     * the set of dates that have at least one log. Stops counting when
     * a gap is found. Today counts as day 1 if logged.
     *
     * @param int $subscriberId
     * @param Carbon|null $referenceDate  Defaults to today (server timezone).
     * @return array{streak: int, today_logged: bool}
     */
    public static function computeStreak(int $subscriberId, ?Carbon $referenceDate = null): array
    {
        $today = ($referenceDate ?? Carbon::today())->startOfDay();

        // Fetch all distinct log dates for this subscriber, descending.
        $dates = DB::table('family_reading_logs')
            ->where('parent_user_id', $subscriberId)
            ->where('read_date', '<=', $today->toDateString())
            ->distinct()
            ->orderByDesc('read_date')
            ->pluck('read_date')
            ->map(fn ($d) => Carbon::parse($d)->startOfDay())
            ->all();

        if (empty($dates)) {
            return ['streak' => 0, 'today_logged' => false];
        }

        $todayLogged = $dates[0]->isSameDay($today);

        // If today is not logged, the streak window starts from yesterday.
        $checkDate = $todayLogged ? $today : $today->copy()->subDay();
        $streak = 0;

        foreach ($dates as $date) {
            if ($date->isSameDay($checkDate)) {
                $streak++;
                $checkDate->subDay();
            } elseif ($date->lessThan($checkDate)) {
                // Gap found — streak is broken.
                break;
            }
            // If $date is between checkDate and today (same day already handled),
            // skip duplicates from the same day.
        }

        return [
            'streak' => $streak,
            'today_logged' => $todayLogged,
        ];
    }

    /**
     * Log today's reading session for a subscriber.
     *
     * Uses updateOrCreate to be idempotent — calling multiple times in
     * the same day does not create duplicate rows.
     *
     * @param int $subscriberId
     * @param int|null $kidProfileId
     * @param int|null $chapterId
     * @param Carbon|null $date  Defaults to today.
     * @return static
     */
    public static function logToday(
        int $subscriberId,
        ?int $kidProfileId = null,
        ?int $chapterId = null,
        ?Carbon $date = null,
    ): static {
        $readDate = ($date ?? Carbon::today())->toDateString();

        return static::updateOrCreate(
            [
                'parent_user_id' => $subscriberId,
                'read_date' => $readDate,
            ],
            [
                'kid_profile_id' => $kidProfileId,
                'story_chapter_id' => $chapterId,
            ],
        );
    }
}
