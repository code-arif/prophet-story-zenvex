<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * Permission Model - Represents individual permissions in the system
 * 
 * Extends Spatie's Permission model to integrate with spatie/laravel-permission.
 * 
 * @property int $id
 * @property string $name
 * @property string|null $display_name
 * @property string|null $description
 * @property string $guard_name
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Permission extends SpatiePermission
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'guard_name',
    ];
}
