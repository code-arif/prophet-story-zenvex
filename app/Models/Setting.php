<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Setting Model - Stores key-value configuration settings
 * 
 * This model provides a simple way to store and retrieve application
 * settings from the database. Settings are stored as key-value pairs
 * and can be used for various configuration purposes.
 * 
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Setting extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'key',    // Setting key (unique identifier)
        'value',  // Setting value (can be any string data)
    ];
}
