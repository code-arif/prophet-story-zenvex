<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * PrayerTime Model - Stores daily prayer times for locations
 * 
 * This model stores Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * for specific locations and dates. Supports different calculation methods
 * and provides helper methods to get current/next prayer times.
 * 
 * @property int $id
 * @property string $location
 * @property float $latitude
 * @property float $longitude
 * @property string $timezone
 * @property \Illuminate\Support\Carbon $date
 * @property string $fajr
 * @property string $sunrise
 * @property string $dhuhr
 * @property string $asr
 * @property string $maghrib
 * @property string $isha
 * @property string $calculation_method
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class PrayerTime extends Model
{
    use HasFactory;

    /** @var bool Enable auto-incrementing ID */
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'integer';

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'location',           // Location name (city, area)
        'latitude',           // Latitude coordinate (7 decimal places)
        'longitude',          // Longitude coordinate (7 decimal places)
        'timezone',           // Timezone identifier (e.g., 'Asia/Dhaka')
        'date',               // Date for these prayer times
        'fajr',               // Fajr prayer time (HH:MM:SS)
        'sunrise',            // Sunrise time (HH:MM:SS)
        'dhuhr',              // Dhuhr prayer time (HH:MM:SS)
        'asr',                // Asr prayer time (HH:MM:SS)
        'maghrib',            // Maghrib prayer time (HH:MM:SS)
        'isha',               // Isha prayer time (HH:MM:SS)
        'calculation_method', // Method used for calculation
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'latitude' => 'decimal:7',   // 7 decimal places precision
        'longitude' => 'decimal:7',  // 7 decimal places precision
        'date' => 'date',            // Cast to Carbon (date only)
    ];

    /**
     * Get all prayer times as an associative array.
     * 
     * @return array Prayer times ['fajr' => '...', 'dhuhr' => '...', ...]
     */
    public function getPrayerTimesAttribute()
    {
        return [
            'fajr' => $this->fajr,
            'sunrise' => $this->sunrise,
            'dhuhr' => $this->dhuhr,
            'asr' => $this->asr,
            'maghrib' => $this->maghrib,
            'isha' => $this->isha,
        ];
    }

    /**
     * Get the current or next prayer time based on current time.
     * 
     * @return array|null ['name' => '...', 'time' => '...'] or null
     */
    public function getCurrentPrayer()
    {
        $now = now()->format('H:i:s');
        $prayers = [
            'fajr' => $this->fajr,
            'dhuhr' => $this->dhuhr,
            'asr' => $this->asr,
            'maghrib' => $this->maghrib,
            'isha' => $this->isha,
        ];

        $current = null;
        $next = null;

        foreach ($prayers as $name => $time) {
            if ($now >= $time) {
                $current = $name;
            } else {
                $next = $name;
                break;
            }
        }

        return [
            'current' => $current,
            'next' => $next ?? 'fajr',
            'next_time' => $next ? $prayers[$next] : $prayers['fajr'],
        ];
    }

    /**
     * Scope for today
     */
    public function scopeToday($query)
    {
        return $query->where('date', today());
    }

    /**
     * Scope for specific location
     */
    public function scopeLocation($query, $location)
    {
        return $query->where('location', $location);
    }
}
