<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Role Model - Represents user roles for authorization
 * 
 * Roles are used to group permissions and assign them to users.
 * Each role can have multiple permissions, and each user can have multiple roles.
 * This implements a flexible Role-Based Access Control (RBAC) system.
 * 
 * @property int $id
 * @property string $name
 * @property string $display_name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|Permission[] $permissions
 * @property-read \Illuminate\Database\Eloquent\Collection|User[] $users
 */
class Role extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',          // Unique role identifier (e.g., 'admin', 'editor')
        'display_name',  // Human-readable name for display
        'description',   // Optional description of the role's purpose
    ];

    /**
     * Get the permissions assigned to this role.
     * 
     * Defines a many-to-many relationship with the Permission model.
     * Uses the 'permission_role' pivot table to manage the relationship.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    /**
     * Get the users assigned to this role.
     * 
     * Defines a many-to-many relationship with the User model.
     * Uses the 'role_user' pivot table to manage the relationship.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user');
    }

    /**
     * Check if this role has a specific permission.
     * 
     * @param string $permissionName The permission name to check
     * @return bool True if the role has the permission, false otherwise
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }
}
