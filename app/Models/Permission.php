<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Permission Model - Represents individual permissions in the system
 * 
 * Permissions are granular access rights that can be assigned to roles.
 * Each permission can be assigned to multiple roles, enabling flexible
 * access control throughout the application.
 * 
 * @property int $id
 * @property string $name
 * @property string $display_name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|Role[] $roles
 */
class Permission extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',          // Unique permission identifier (e.g., 'edit-articles')
        'display_name',  // Human-readable name for display
        'description',   // Optional description of what the permission allows
    ];

    /**
     * Get the roles that have this permission.
     * 
     * Defines a many-to-many relationship with the Role model.
     * Uses the 'permission_role' pivot table to manage the relationship.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_role');
    }
}
